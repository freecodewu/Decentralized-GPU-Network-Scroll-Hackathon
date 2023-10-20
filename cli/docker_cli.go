package main

import (
	"context"
	"errors"
	"fmt"
	docker "github.com/fsouza/go-dockerclient"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

type dockerCli struct {
	Client *docker.Client
	Containers map[string]*docker.Container
	mutex sync.Mutex
	WG *sync.WaitGroup
}

var once = new(sync.Once)
var DockerCli *dockerCli = nil



func init() {
	if DockerCli == nil {
		once.Do(func() {
			// 暂时没必要太详细, 先从环境获取即可
			client, err := docker.NewClientFromEnv()
			if err != nil {
				panic(err.Error())
				return
			}
			DockerCli = &dockerCli{
				Client: client,
				Containers: make(map[string]*docker.Container, 0),
				mutex: sync.Mutex{},
			}
		})
	}
}

// 当前面向demo编程, 当前执行docker的功能是:
// 创建 Docker 客户端, 并持续监听
// 首先明确创建docker 的命令
// 1. SshPort 映射22号端口 默认 33/tcp
// 2. ServerPort 映射7860号端口 7860/tcp
// 3. 挂在volumn文件 // 这里提供一个下载方式
// 4. ContainerName 容器名称
// 5. ImageName
// 6. ImageTag
// 7. 默认自带 --rm
//docker run -itd --name sdw -p 0.0.0.0:33:22 -p 0.0.0.0:7860:7860 \
//-v /root/gpu/models:/app/stable-diffusion-webui/models -v /root/gpu/outputs:/app/stable-diffusion-webui/outputs \
//--rm irongyi/apus_sd_webui:cuda-v1.6.0-RC-2023-08-27 /bin/bash
func (c *dockerCli) Run(ctx context.Context, containerName, imageName, imageTag, sshPort, serverPort string, volumns []string) (*docker.Container, error){
	if len(volumns) == 0 {
		volumns = []string{"/root/gpu/outputs:/app/stable-diffusion-webui/outputs", "/root/gpu/models:/app/stable-diffusion-webui/models"}
	}

	Logger.Infof("index:docker_cli||start_create_container:%s with image name:%s", containerName, imageName)
	container, err := c.Client.CreateContainer(docker.CreateContainerOptions{
		Context: ctx,
		Name: containerName,
		HostConfig: &docker.HostConfig{
			Binds: volumns,
			PortBindings: map[docker.Port][]docker.PortBinding{
				"22": {{HostIP: "0.0.0.0", HostPort: sshPort}},
				"7860": {{HostIP: "0.0.0.0", HostPort: serverPort}},
			},
			AutoRemove: true,
		},
		Config: &docker.Config{
			Cmd: []string{"/bin/bash"},
			Image: fmt.Sprintf("%s:%s", imageName, imageTag),
			AttachStdin: true,
			AttachStdout: true,
			AttachStderr: true,
			ExposedPorts: map[docker.Port]struct{}{
				"22": {},
				"7860": {},
			},
			Tty: true,
		},
	})


	if err != nil {
		Logger.Errorf("index:docker_cli||create_container:%s with image name:%s:err", containerName, imageName)
		return container, err
	}
	err = c.Client.StartContainer(container.ID, nil)
	if err != nil {
		Logger.Errorf("index:docker_cli||create_container:%s with image name:%s:err", containerName, imageName)
		return container, err
	}
	Logger.Infof("index:docker_cli||create_container:%s with image name:%s:Done", containerName, imageName)
	c.Containers[container.Name] = container
	return container, err
}

func(c *dockerCli) DetachSSHD(ctx context.Context, containerName string) error {
	err := c.Exec(ctx, containerName, []string{"/usr/sbin/sshd"})
	return err
}


func(c *dockerCli) Exec(ctx context.Context, containerName string, cmd []string) error {
	Logger.Infof("index:docker_cli||start_create_exec container:%s with cmd: %s", containerName, strings.Join( cmd, ","))
	container, ok := c.Containers[containerName]
	if !ok {
		Logger.Errorf("index:docker_cli||container:%s not exist", containerName)
		return errors.New(fmt.Sprintf("Unknown container name: %s", containerName))
	}
	exec, err := DockerCli.Client.CreateExec(docker.CreateExecOptions{Cmd: cmd, Container: container.ID})
	if err != nil {
		Logger.Infof("index:docker_cli||create_exec container:%s err: %s", containerName, err.Error())
		return err
	}
	Logger.Infof("index:docker_cli||create_exec container:%s done, exec_id: %s", containerName, exec.ID)

	Logger.Infof("index:docker_cli||start_exec container:%s with exec id: %s", containerName, exec.ID)
	err = DockerCli.Client.StartExec(exec.ID, docker.StartExecOptions{Detach: true})
	if err != nil {
		Logger.Errorf("index:docker_cli||create_exec container:%s exec_id:%s err: %v", containerName, exec.ID, err)
		return err
	}
	Logger.Infof("index:docker_cli||start_exec container:%s exec_id: %s done", containerName, exec.ID)
	return nil
}

// 监控container状态为RUNNING
func (c *dockerCli) Monitor(ctx context.Context, container *docker.Container) {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	if c.WG == nil {
		c.WG = new(sync.WaitGroup)
	}
	go func(ctx context.Context, dc *docker.Container) {
		c.WG.Add(1)
		defer func() {
			c.WG.Done()
		}()
		for {
			if _, ok := c.Containers[container.Name]; !ok {
				return
			}
			ticker := time.NewTicker(10 * time.Second)
			select {
			case <- ticker.C:
				ticker = time.NewTicker(10 * time.Second)
				inspect, err := c.Client.InspectContainerWithOptions(docker.InspectContainerOptions{Context: ctx, ID: dc.ID})
				if err != nil {
					Logger.Errorf("index:docker_cli||inspect running container:%s err: %v", dc.ID, err)
					continue
				}
				if !inspect.State.Running {
					Logger.Errorf("index:docker_cli||monitor container:%s status err: %v", dc.ID, inspect.State.Status)
					continue
				}

			}
		}
	}(ctx, container)
}

func (d *dockerCli) Stop(ctx context.Context, containerName string) error {
	d.mutex.Lock()
	defer d.mutex.Unlock()
	return d.stop(ctx, containerName)
}
func (d *dockerCli) StopAll(ctx context.Context) error {
	d.mutex.Lock()
	defer d.mutex.Unlock()

	for containerName, _ := range d.Containers {
		_ = d.stop(ctx, containerName)
	}
	return nil
}


func (c *dockerCli) stop(ctx context.Context, containerName string) error {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	Logger.Infof("index:docker_cli||stop container:%s start", containerName)
	err := DockerCli.Client.StopContainer(containerName, 1)
	if err != nil {
		Logger.Errorf("index:docker_cli||stop container:%s err:%v", containerName, err)
		return err
	}
	delete(c.Containers, containerName)
	Logger.Infof("index:docker_cli||stop container:%s done", containerName)
	return nil
}

func Demo() {

	ctx := context.Background()
	Logger.Infof("apus cli start!!")

	curDir, _ := filepath.Abs(".")
	//curDir = "/root/gpu"
	volumns := []string{fmt.Sprintf("%s/models:/app/stable-diffusion-webui/models", curDir), fmt.Sprintf("%s/outputs:/app/stable-diffusion-webui/outputs", curDir)}
	container, err := DockerCli.Run(ctx, "go_cli_test_apus_sd_webui", "irongyi/apus_sd_webui", "cuda-v1.6.0-RC-2023-08-27", "33", "7860", volumns)
	if err != nil {
		fmt.Println("FUCK ERROR", err)
		return
	}

	err = DockerCli.DetachSSHD(ctx, container.Name)
	if err != nil {
		fmt.Println("FUCK ERROR:2", err)
		return
	}
	fmt.Println(fmt.Sprintf("Start Stop Container : %s", container.ID))

	//DockerCli.Stop(ctx, container.Name)
}

//docker run -itd --name sdw -p 0.0.0.0:33:22 -p 0.0.0.0:7860:7860 -v /Users/irongyi/GolandProjects/xxxx/models:/app/stable-diffusion-webui/models -v /Users/irongyi/GolandProjects/xxxx/outputs:/app/stable-diffusion-webui/outputs --rm irongyi/apus_sd_webui:cuda-v1.6.0-RC-2023-08-27 /bin/bash
