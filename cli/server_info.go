package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
)

var demos = `[
  {
    "gpu": {
      "count": 1,
      "model": "Nvidia RTX 4090",
      "tflops": 30,
      "maxCUDAVersion": "11.2",
      "ram": 8,
      "ramBandwidth": 400
    },
    "motherboard": {
      "model": "ASUS ROG Strix B550-F",
      "pcieVersion": "4.0",
      "pcieLanes": 16,
      "pcieBandwidth": 5000
    },
    "cpu": {
      "cores": "8",
      "threads": "16",
      "model": "AMD Ryzen 7 5800X"
    },
    "ram": {
      "size": 16,
      "frequency": 3200
    },
    "network": {
      "upBandwidth": 1000,
      "downBandwidth": 1000,
      "ports": 4
    },
    "disk": {
      "type": "SSD",
      "readBandwidth": 500,
      "writeBandwidth": 500,
      "iops": 50000,
      "size": "1TB"
    },
    "price": {
      "server": 2000,
      "storage": 150,
      "upbandwidth": 50,
      "downbandwidth": 50
    },
    "health": {
      "scheduledMaintenanceTimestamp": 1700000000,
      "reliability": 95
    }
  }
]`


type GPU struct {
	Count          int    `json:"count"`
	Model          string `json:"model"`
	TFLOPS         int    `json:"tflops"`
	MaxCUDAVersion string `json:"maxCUDAVersion"`
	RAM            int    `json:"ram"`
	RAMBandwidth   int    `json:"ramBandwidth"`
}

type Motherboard struct {
	Model         string `json:"model"`
	PCIeVersion   string `json:"pcieVersion"`
	PCIeLanes     int    `json:"pcieLanes"`
	PCIeBandwidth int    `json:"pcieBandwidth"`
}

type CPU struct {
	Cores   string `json:"cores"`
	Threads string `json:"threads"`
	Model   string `json:"model"`
}

type RAM struct {
	Size      int `json:"size"`
	Frequency int `json:"frequency"`
}

type Network struct {
	UpBandwidth   int `json:"upBandwidth"`
	DownBandwidth int `json:"downBandwidth"`
	Ports         int `json:"ports"`
}

type Disk struct {
	Type          string `json:"type"`
	ReadBandwidth int    `json:"readBandwidth"`
	WriteBandwidth int   `json:"writeBandwidth"`
	IOPS          int    `json:"iops"`
	Size          string `json:"size"`
}

type Price struct {
	Server       int `json:"server"`
	Storage      int `json:"storage"`
	UpBandwidth  int `json:"upbandwidth"`
	DownBandwidth int `json:"downbandwidth"`
}

type Health struct {
	ScheduledMaintenanceTimestamp int `json:"scheduledMaintenanceTimestamp"`
	Reliability                   int `json:"reliability"`
}

type ServerInfo struct {
	GPU       GPU       `json:"gpu"`
	Motherboard Motherboard `json:"motherboard"`
	CPU       CPU       `json:"cpu"`
	RAM       RAM       `json:"ram"`
	Network   Network   `json:"network"`
	Disk      Disk      `json:"disk"`
	Price     Price     `json:"price"`
	Health    Health    `json:"health"`
}

func GetRandomInfo() (*ServerInfo, error) {
	serverInfos := make([]*ServerInfo, 0)

	err := json.Unmarshal([]byte(demos), &serverInfos)
	if err != nil {
		fmt.Println("scan machine info error")
		return nil, err
	}

	num := rand.Intn(len(serverInfos))
	return serverInfos[num], nil

}