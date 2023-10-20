package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/urfave/cli"
	"os"
	"path/filepath"
	"strconv"
)

var (
diskPath string = ""
pubKey string = ""
cliPort string = ""
ServerIP string = ""
sshPort = 10000
serverPort = 20000
backendUrl = "http://35.91.235.139:80"
machineInfo *MachineInfo = nil
serverInfo *ServerInfo= nil
)


func args_parser() error {
	app := cli.NewApp()
	app.Name = "ApusNetwork CLi"
	app.Usage = "Apus Network Cli to up machine to apus network"

	// 定义一个必需的参数
	//diskPathFlag := cli.StringFlag{
	//	Name:     "disk_path",
	//	Usage:    "A required flag, dick path",
	//	Required: true,
	//}

	serverIPFlag:= cli.StringFlag{
		Name:     "server_ip",
		Usage:    "A required flag, server ip",
		Required: true,
	}
	pubKeyFlag := cli.StringFlag{
		Name:     "pub_key",
		Usage:    "A required flag, pubKey",
		Required: true,
	}

	cliPortFlag := cli.StringFlag{
		Name:     "port",
		Usage:    "A required flag, port",
		Required: true,
	}

	// 将参数添加到应用程序的命令中
	app.Commands = []cli.Command{
		{
			Name:  "init",
			Usage: "up server to apus network",
			Flags: []cli.Flag{&pubKeyFlag, &cliPortFlag, &serverIPFlag},
			Action: func(c *cli.Context) error {
				// 获取必需的参数值
				//diskPath = c.String("disk_path")
				pubKey = c.String("pub_key")
				cliPort = c.String("port")
				ServerIP = c.String("server_ip")
				return nil
			},
		},
	}

	// 运行应用程序
	err := app.Run(os.Args)
	if err != nil {
		fmt.Println(err)
		return err
	}

	if ServerIP == "" || pubKey == "" || cliPort == ""{
		return errors.New("please input serverIP & pubKey & cliPort")
	}
	return nil
}



// 两个接口: start & stop & exit退出
func main() {
	err := args_parser()
	if err != nil {
		return
	}

	s, err := GetRandomInfo()
	if err != nil {
		return
	}
	serverInfo = s
	fmt.Println("check server info : %v", serverInfo)

	diskPath, _ = filepath.Abs(".")

	bs, _ := json.Marshal(serverInfo)

	ctx := context.Background()
	machineInfo = &MachineInfo{
		MachineId: pubKey + cliPort,
		Port : cliPort,
		Host :ServerIP,
		PubKey : pubKey,
		ApiVersion : "v0", // 当前只有一个版本apiVersion
		ServerInfo : string(bs),
	}

	//Demo()
	err = new(ApusClient).MountServer(ctx, machineInfo)
	if err != nil {
		fmt.Println(fmt.Sprintf("mount server err: %v", err))
	}

	defer DockerCli.StopAll(ctx)


	router := gin.Default()

	// develop click rent, then create a docker within the server, so:
	// container name: from deveop address & image name
	// sshPort use random 10000~20000
	// serverPort use random 20000~30000
	// volumns 配置需要models和outputs, only provide a disk, can mkdir within this disk and use link to do。
	router.POST("/apus_network/cli/start", func(c *gin.Context) {
		imageName	:= c.PostForm("image_name")
		imageTag := c.PostForm("image_tag")
		containerName := c.PostForm("container_name")
		mountDir := filepath.Join(diskPath, containerName)
		_ = os.MkdirAll(mountDir, os.ModePerm)
		container, err := DockerCli.Run(ctx, containerName, imageName, imageTag, strconv.Itoa(sshPort), strconv.Itoa(serverPort), []string{fmt.Sprintf("%s:/app/mount_dir", mountDir)})
		if err != nil {
			_ = DockerCli.Stop(ctx, containerName)
			c.JSON(501, map[string]string{
				"msg": err.Error(),
			})
			return
		}

		_ = DockerCli.Exec(ctx, containerName, []string{"/usr/sbin/sshd"})
		DockerCli.Monitor(ctx, container)

		c.JSON(200, map[string]string{
			"msg": "ok",
			"ssh_method": fmt.Sprintf("ssh root@%s -p %d", ServerIP, sshPort),
		})
	})

	router.POST("/apus_network/cli/stop", func(c *gin.Context) {
		containerName := c.PostForm("container_name")
		err := DockerCli.Stop(ctx, containerName)
		if err != nil {
			c.JSON(501, map[string]string{
				"msg": err.Error(),
			})
			return
		}

		c.JSON(200, map[string]string{
			"msg": "ok",
		})
	})

	router.GET("/apus_network/cli/health", func(c *gin.Context) {
		c.JSON(200, map[string]string{
			"msg": "ok",
		})
	})

	// 启动服务器并监听指定的端口
	router.Run(fmt.Sprintf("0.0.0.0:%s", cliPort))
}