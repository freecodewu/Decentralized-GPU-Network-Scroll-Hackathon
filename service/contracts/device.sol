// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

enum DeviceStatus {Created, Online, Running, Offline}

struct Price {
    uint serverPrice;
    uint storagePrice;
    uint upbandWidth;
    uint downbandWidth;
}

struct deviceInfo {
    uint id;
    address owner;
    DeviceStatus status;
    string machineId;
    string serverInfo;
    Price price;
}

contract Device {
    uint id = 0;
    deviceInfo [] public devices;

    modifier _isOwner(address _owner) {
        _;
    }

    // 这里需要质押, 这里price 可能存在的多种情况
    function online(string memory _machineId, string memory _serverInfo, Price memory _price) internal returns (uint) {
        id += 1;
        // 这里msg.sender 不做检查, 只是因为当前不考虑作弊, 考虑作弊这里要处理
        devices.push(deviceInfo(id, msg.sender,  DeviceStatus.Online, _machineId, _serverInfo, _price));
        return id;
    }

    function getDevice(uint _deviceId) view public returns(deviceInfo memory) {
        require(_deviceId > 0, "need device_id > 0");
        return devices[_deviceId - 1];
    }

    function deleteDevices(uint _deviceId) internal {
        require(devices[_deviceId].status == DeviceStatus.Online || devices[_deviceId].status == DeviceStatus.Created, "need pre status online or created");
        devices[_deviceId - 1].status = DeviceStatus.Offline;
    }

    function offlineDevice(uint _deviceId) internal {
        require(devices[_deviceId - 1].status == DeviceStatus.Online, "need pre status online");
        devices[_deviceId - 1].status = DeviceStatus.Offline;
    }

    function rentDevice(uint _deviceId) internal {
        require(devices[_deviceId - 1].status == DeviceStatus.Online, "need pre status online");
        devices[_deviceId - 1].status = DeviceStatus.Running;
    }

    function terminateDevice(uint _deviceId) internal {
        devices[_deviceId - 1].status = DeviceStatus.Online;

    }

}