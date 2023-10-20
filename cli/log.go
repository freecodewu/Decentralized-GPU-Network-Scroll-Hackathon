package main

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/lestrrat-go/file-rotatelogs"
	"github.com/rifflock/lfshook"
	"github.com/sirupsen/logrus"
)

var Logger *logrus.Logger = nil

func init() {
	log := logrus.New()

	log.SetOutput(os.Stdout) // 输出到标准输出

	// 获取当前目录的绝对路径
	currentDir, _ := filepath.Abs(".")
	// 创建 log 目录
	logDir := filepath.Join(currentDir, "log")
	_ = os.Mkdir(logDir, os.ModePerm)

	// 创建按时间分割的日志文件
	writer, err := rotatelogs.New(
		filepath.Join(logDir, "apus_cli_%Y%m%d.log"),                 // 日志文件名格式
		rotatelogs.WithLinkName(filepath.Join(logDir, "apus_cli.log")), // 最新日志文件的软链接
		rotatelogs.WithRotationTime(24*time.Hour), // 每24小时分割一次日志文件
	)
	if err != nil {
		panic(fmt.Sprintf("Failed to create log file: %v", err))
	}

	// 创建 LFSHook
	lfsHook := lfshook.NewHook(lfshook.WriterMap{
		logrus.InfoLevel:  writer,
		logrus.ErrorLevel: writer,
	}, &logrus.TextFormatter{})

	log.AddHook(lfsHook)

	Logger = log
}
