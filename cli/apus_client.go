package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/url"

	// Import resty into your code and refer it as `resty`.
	"github.com/go-resty/resty/v2"
)

// 初始化时候, 上传到backend
// 中间监听任务, 可以开始和终止任务
type ApusClient struct {
}

type MachineInfo struct {
	MachineId string `json:"machine_id"`
	Port string `json:"port"`
	Host string `json:"host"`
	PubKey string `json:"pub_key"`
	ApiVersion string `json:"api_version"`
	ServerInfo string `json:"server_info"` // 这里应该是程序自动采集的, 目前没有采集程序, 所以先mock方式搞上去
}

type mountServerResp struct {
	Code int `json:"code"`
	Msg string `json:"msg"`
}

func (a *ApusClient) MountServer(ctx context.Context, mi *MachineInfo) error {
	client := resty.New()
	bs, err := json.Marshal(mi)
	if err != nil {
		Logger.Errorf("index:apus_client||mount_server err: %v", err)
		return err
	}

	result := new(mountServerResp)

	targetUrl, err := url.JoinPath(backendUrl, "apus_network/client/mount")
	if err != nil {
		Logger.Errorf("index:apus_client||mount_server err: %v", err)
		return err
	}

	_, err = client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(bs).
		SetResult(result).    // or SetResult(AuthSuccess{}).
		Post(targetUrl)
	if err != nil {
		Logger.Errorf("index:apus_client||mount_server err: %v", err)
		return err
	}
	if result.Code != 200 {
		Logger.Errorf("index:apus_client||mount_server err: %s", result.Msg)
		return errors.New(result.Msg)
	}

	Logger.Infof("index:apus_client||mount_server done")
	return nil
}