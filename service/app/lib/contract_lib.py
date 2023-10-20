import json
import random
import time

import web3

from app.lib.config import role
from app.lib.conn import helper_contract, account_contract, get_nonce, transaction
from app.model.machine import Machine, Price
from app.model.instance import Instance, Billing


class UserInfo:
    def __init__(self, address, balance, provider_blocked_funds, recipient_blocked_funds, info):
        if type(info) == str and len(info) > 0:
            info = json.loads(info)
        self.address = address
        self.balance = balance
        self.provider_blocked_funds = provider_blocked_funds
        self.recipient_blocked_funds = recipient_blocked_funds
        self._info = info

    @property
    def info(self):
        return dict(address=self.address, balance=self.balance, provider_blocked_funds=self.provider_blocked_funds, recipient_blocked_funds=self.recipient_blocked_funds, info=self._info)


class ContractLib:
    _helper_contract = None
    _account_contract = None

    def __init__(self):
        self._helper_contract = helper_contract
        self._account_contract = account_contract

    def list_devices(self, _limit, _offset):
        resp = self._helper_contract.functions.listDevices(_limit=_limit, _offset=_offset).call()
        result = [Machine.init_from_contract(item) for item in resp if item[0] != 0]
        return result

    def list_own_devices(self, _provider, _limit, _offset):
        _, _, _, _, resp = self.get_all()
        result = list(filter(lambda x: x.pub_key == _provider.public_key, resp))
        return result

    def list_provider_lease(self, public_key, _limit, _offset):
        lease, billing = self._helper_contract.functions.listProviderLease(public_key, _limit, _offset).call()
        lease = list(filter(lambda x: x[1] != 0, lease))
        billing = list(filter(lambda x: x[1] != 0, billing))
        return lease, billing

    def online_server(self, _user, machine_info, price, start_time, end_time):
        tx_receipt = transaction(_user, self._helper_contract.functions.onlineServer(_machineId=machine_info.machine_id, _serverInfo=machine_info.contract_server_info, _price=price.contract_price, _startTime=start_time, _endTime=end_time))
        return tx_receipt

    def offline_server(self, _user, _deviceId):
        tx_receipt = transaction(_user, self._helper_contract.functions.offlineServer(_deviceId=_deviceId))
        return tx_receipt

    def rent_server(self, _user, _deviceId, _endTime):
        tx_receipt = transaction(_user, self._helper_contract.functions.rentServer(_deviceId=_deviceId, _endTime=_endTime))
        return tx_receipt

    def renewal_lease_server(self, _user, _leaseId, _endTime):
        tx_receipt = transaction(_user, self._helper_contract.functions.RenewalLeaseServer(_leaseId=_leaseId, _endTime=_endTime))
        return tx_receipt

    def terminate_instance(self, _user, _leaseId):
        tx_receipt = transaction(_user, self._helper_contract.functions.terminateInstance(_leaseId=_leaseId))
        return tx_receipt

    # 质押单位是ETH
    def stake(self, _user, amount):
        tx_receipt = transaction(_user, self._account_contract.functions.stake(), value=int(amount * 10 ** 18))
        return tx_receipt

    def unstake(self, _user, amount):
        tx_receipt = transaction(_user, self._account_contract.functions.unstake(amount=int(amount * 10 ** 18)))
        return tx_receipt

    def register(self, addr):
        tx_receipt = transaction(addr, self._account_contract.functions.register())
        return tx_receipt

    def is_register(self, pub_key):
        pub_key = web3.Web3.to_checksum_address(pub_key)
        return self._account_contract.functions.isRegister(_user=pub_key).call()

    def get_account_info(self, pub_key):
        pub_key = web3.Web3.to_checksum_address(pub_key)
        try:
            address, balance, provider_blocked_funds, recipient_blocked_funds, info = self._account_contract.functions.getAccount(pub_key).call()
        except Exception as e:
            if not self.is_register(pub_key):
                raise Exception("please register first")
            raise e
        return UserInfo(address, balance, provider_blocked_funds, recipient_blocked_funds, info)

    def set_provider_info(self, addr, _info):
        tx_receipt = transaction(addr, self._account_contract.functions.setProviderInfo(_info))
        return tx_receipt

    def get_earn_billings(self):
        self._account_contract.functions.renewalRentBilling().call()

    def get_consume_billings(self):
        self._account_contract.functions.renewalRentBilling().call()

    def get_release(self):
        self._account_contract.functions.renewalRentBilling().call()

    def get_device(self, _deviceId):
        return self._helper_contract.functions.getDevice(_deviceId=_deviceId).call()

    def get_all(self):
        provider_billings, recipient_billings, lease_provider, lease_recipient, devices = self._helper_contract.functions.getAll().call()

        provider_billings = [Billing(*i) for i in provider_billings]
        recipient_billings = [Billing(*i) for i in recipient_billings]
        lease_provider = [Instance(*i) for i in lease_provider]
        lease_recipient = [Instance(*i) for i in lease_recipient]
        devices = [Machine.init_from_contract(device) for device in devices]
        return provider_billings, recipient_billings, lease_provider, lease_recipient, devices


contract_connector = ContractLib()


def main_test():
    print(ContractLib().register(role.provider))
    print(ContractLib().register(role.user))
    print(ContractLib().get_account_info(role.provider.public_key).info)
    import json
    print(ContractLib().set_provider_info(role.provider, json.dumps(dict(a=1, b=2))))
    print(ContractLib().get_account_info(role.provider.public_key).info)

    try:
        print(ContractLib().get_account_info(role.user.public_key).info) ## 测试一个不存在的key, 应该返回报错, 先注册
    except Exception as e:
        print(e)

    print(ContractLib().register(role.user))
    print(ContractLib().get_account_info(role.provider.public_key).info)

    print("=" * 10, "测试质押", "=" * 10)
    print(ContractLib().stake(role.provider, 30))
    print(ContractLib().stake(role.user, 30))

    print("=" * 10, "上线机器", "=" * 10)
    print("online_server", ContractLib().online_server(role.provider, Machine(machine_id="ym-test", pub_key=role.provider.public_key, host="127.0.0.1", port="10", server_info=dict(a="a", b="b", c="c"), api_version="v0"), price=Price(server_price=36 * 10 ** 10, storage_price=10, upband_width=20, downband_width=30), start_time=int(time.time()), end_time=int(time.time()) + 36000)['status'])

    # print(HelperLib().unstake(role.provider, 50))
    # print("=" * 10, "下线机器", "=" * 10)
    # print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])
    # print("list_provider_lease", [i for i in ContractLib().get_all()[3]])
    # print("offline_server", ContractLib().offline_server(role.provider, 1)['status'])
    # print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])

    print("=" * 10, "租用机器", "=" * 10)
    devices = [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0) if i.data['status'] == 1]
    print("online_devices", devices)
    if len(devices) > 0:
        print("get_device", ContractLib().get_device(devices[-1][0]))
        print("rent_server", devices[-1][0], ContractLib().rent_server(role.user, devices[-1][0], int(time.time()) + 3600 * 24 * 10)['status'])
        print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])
    else:
        print("online_device not enough")

    print("=" * 10, "续租机器", "=" * 10)
    leases = [i for i in ContractLib().get_all()[3]]
    if len(leases) > 0:
        # print("list_leases", [i.data for i in ContractLib().get_all()[3]])
        print("list_lease", leases[-1].data)
        print("renewal_lease_server", leases[-1].lease_id, ContractLib().renewal_lease_server(role.user, leases[-1].lease_id, int(time.time()) + 3600)['status'])
        leases = [i for i in ContractLib().get_all()[3]]
        print("list_lease", leases[-1].data)
        # print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])
    else:
        print("rent server not enough")

    print("=" * 10, "关闭机器", "=" * 10)
    if len(leases) > 0:
        # print("terminate_instance", leases[-1].lease_id, ContractLib().terminate_instance(role.user, leases[-1].lease_id)['status'])
        print("terminate_instance", leases[-1].lease_id, ContractLib().terminate_instance(role.user, leases[-1].lease_id)['status'])
        print("list_lease", leases[-1].data)
        # print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])
        # print("list_leases", [i for i in ContractLib().get_all()[2] if i.lease_id == leases[-1]])
    else:
        print("rent server not enough")

server_infos = [
  {
    "gpu": {
      "count": 1,
      "model": "Nvidia A100",
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
  },
  {
    "gpu": {
      "count": 2,
      "model": "Nvidia A100",
      "tflops": 40,
      "maxCUDAVersion": "11.4",
      "ram": 24,
      "ramBandwidth": 600
    },
    "motherboard": {
      "model": "MSI MEG Z590 ACE",
      "pcieVersion": "4.0",
      "pcieLanes": 24,
      "pcieBandwidth": 6000
    },
    "cpu": {
      "cores": "12",
      "threads": "24",
      "model": "Intel Core i9-11900K"
    },
    "ram": {
      "size": 32,
      "frequency": 3600
    },
    "network": {
      "upBandwidth": 2000,
      "downBandwidth": 2000,
      "ports": 8
    },
    "disk": {
      "type": "NVMe",
      "readBandwidth": 3000,
      "writeBandwidth": 3000,
      "iops": 100000,
      "size": "2TB"
    },
    "price": {
      "server": 3000,
      "storage": 200,
      "upbandwidth": 100,
      "downbandwidth": 100
    },
    "health": {
      "scheduledMaintenanceTimestamp": 1800000000,
      "reliability": 98
    }
  },
  {
    "gpu": {
      "count": 1,
      "model": "Nvidia A40",
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
  },
  {
    "gpu": {
      "count": 2,
      "model": "Nvidia V100",
      "tflops": 40,
      "maxCUDAVersion": "11.4",
      "ram": 24,
      "ramBandwidth": 600
    },
    "motherboard": {
      "model": "MSI MEG Z590 ACE",
      "pcieVersion": "4.0",
      "pcieLanes": 24,
      "pcieBandwidth": 6000
    },
    "cpu": {
      "cores": "12",
      "threads": "24",
      "model": "Intel Core i9-11900K"
    },
    "ram": {
      "size": 32,
      "frequency": 3600
    },
    "network": {
      "upBandwidth": 2000,
      "downBandwidth": 2000,
      "ports": 8
    },
    "disk": {
      "type": "NVMe",
      "readBandwidth": 3000,
      "writeBandwidth": 3000,
      "iops": 100000,
      "size": "2TB"
    },
    "price": {
      "server": 3000,
      "storage": 200,
      "upbandwidth": 100,
      "downbandwidth": 100
    },
    "health": {
      "scheduledMaintenanceTimestamp": 1800000000,
      "reliability": 98
    }
  },
  {
    "gpu": {
      "count": 1,
      "model": "Nvidia RTX 3070",
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
  },
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
  },
  {
    "gpu": {
      "count": 1,
      "model": "Nvidia A4000",
      "tflops": 30,
      "maxCUDAVersion": "11.2",
      "ram": 8,
      "ramBandwidth": 400
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
  },
  {
    "gpu": {
      "count": 1,
      "model": "Nvidia RTX 3080Ti",
      "tflops": 30,
      "maxCUDAVersion": "11.2",
      "ram": 8,
      "ramBandwidth": 400
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
]

if __name__ == '__main__':
    # main_test()
    #
    # print("=" * 10, "续租机器", "=" * 10)
    # print(len(ContractLib().get_all()))
    # leases = [i for i in ContractLib().get_all()[3]]
    # if len(leases) > 0:
    #     # print("list_leases", [i.data for i in ContractLib().get_all()[3]])
    #     print("list_lease", leases[-1].data)
    #     t = int(time.time()) + 300
    #     print("renewal_lease_server", leases[-1].lease_id, "target_end_time: ", str(t), ContractLib().renewal_lease_server(role.user, leases[-1].lease_id, t)['status'])
    #     leases = [i for i in ContractLib().get_all()[3]]
    #     print("list_lease", leases[-1].data)
    #     # print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])
    # else:
    #     print("rent server not enough")
    #
    # print("=" * 10, "关闭机器", "=" * 10)
    # if len(leases) > 0:
    #     print("terminate_instance", leases[-1].lease_id, ContractLib().terminate_instance(role.user, leases[-1].lease_id)['status'])
    #     leases = [i for i in ContractLib().get_all()[3]]
    #     print("list_lease", leases[-1].data, ContractLib().get_device(leases[-1].device_id))
    #     # print("list_devices", [(i.data['market_id'], i.data['status']) for i in ContractLib().list_devices(100, 0)])
    #     # print("list_leases", [i for i in ContractLib().get_all()[2] if i.lease_id == leases[-1]])
    # else:
    #     print("rent server not enough")

    # market_id = 4
    # print(contract_connector.get_device(4))
    # print(contract_connector.rent_server(role.user, 14, int(time.time()) + 3600 * 12)['status'])
    # time.sleep(3)
    # print(contract_connector.get_device(4))

    # print(contract_connector.get_device(4))
    # print(contract_connector.terminate_instance(role.user, 5))
    # print(contract_connector.get_device(4))

    # print(contract_connector.get_device(4))
    # print(contract_connector.renewal_lease_server(role.user, 8, 1695140459))
    # print(contract_connector.get_device(4))

    # leases = [i for i in ContractLib().get_all()[3]]
    # for i in leases:
    #     print(i.data)

    print("=" * 10, "测试质押", "=" * 10)
    print(ContractLib().register(role.provider))
    print(ContractLib().stake(role.provider, 0.1))
    print(ContractLib().get_account_info(role.provider.public_key).info)
    print("=" * 10, "上线机器", "=" * 10)
    for i in range(5):
        index = random.Random().randint(0, len(server_infos) - 1)
        info = json.loads(json.dumps(server_infos[index]))
        print(info)
        info['gpu']['tflops'] = float(random.Random().randint(5000, 15000)) * 0.01
        info['gpu']['maxCUDAVersion'] = ['11.2', '11.4', '12.0', '12.1'][i % 4]
        del info['network']
        del info['disk']
        del info['price']
        # info['network'] = {"upBandwidth": 2000, "downBandwidth": 2000, "ports": random.Random().randint(10, 20000)}
        # info['network']["upBandwidth"] = random.Random().randint(100, 1000)
        # info['network']["downBandwidth"] = random.Random().randint(200, 2000)
        # info['disk'] = {"type": "NVMe", "readBandwidth": 3000, "writeBandwidth": 3000, "iops": 100000, "size": "2000"}
        # info['disk']['readBandwidth'] = random.Random().randint(1500, 3500)
        # info['disk']['writeBandwidth'] = random.Random().randint(1500, 3500)
        # info["motherboard"] = {
        #     "model": "ASUS ROG Strix B550-F",
        #     "pcieVersion": "4.0",
        #     "pcieLanes": 16,
        #     "pcieBandwidth": 5000
        # }
        if 'mmotherboard' in info:
            del info["motherboard"]

        machine = Machine(machine_id=role.provider.public_key + str(int(time.time() + i)), pub_key=role.provider.public_key, host="112341234", port="10",
                          server_info=json.dumps(info), api_version="v0")
        print("online_server", ContractLib().online_server(_user=role.provider, machine_info=machine,
                                                           price=Price(server_price=random.Random().randint(10, 30) * 36 * 10 ** 6 , storage_price=10, upband_width=20, downband_width=30),
                                                           start_time=int(time.time()),
                                                           end_time=int(time.time()) + 36000))

        # print("=" * 10, "上线机器", "=" * 10)
        # print("online_server", ContractLib().online_server(role.provider, machine,
        #                                                    price=Price(server_price=36 * 10 ** 10, storage_price=10,
        #                                                                upband_width=20, downband_width=30),
        #                                                    start_time=int(time.time()),
        #                                                    end_time=int(time.time()) + 36000)['status'])
