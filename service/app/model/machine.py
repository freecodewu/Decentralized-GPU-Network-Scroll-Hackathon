import json
import random


extra_info = dict()

class Price:

    def __init__(self, server_price, storage_price, upband_width, downband_width):
        self.server_price = server_price # Wei / s
        self.storage_price = storage_price
        self.upband_width = upband_width
        self.downband_width = downband_width

    @classmethod
    def init_from_contract(cls, resp):
        return Price(*resp)

    @property
    def contract_price(self):
        return (self.server_price, self.storage_price, self.upband_width, self.downband_width)

    @property
    def data(self):
        return dict(server_price=self.server_price, storage_price=self.storage_price, upband_width=self.upband_width, downband_width=self.downband_width)


class Machine:

    def __init__(self, machine_id, pub_key, host, port, server_info, api_version):
        if type(server_info) == str:
            if  len(server_info) > 0:
                server_info = json.loads(server_info)
            else:
                server_info = None
        self.machine_id = machine_id
        self.pub_key = pub_key
        self.host = host
        self.port = port
        self.server_info = server_info
        self.api_version = api_version
        self.status = 0  # Created
        self.price = None
        self.market_id = 0

    @classmethod
    def init_from_contract(cls, resp):
        cid, address, status, machine_id, server_info, price = resp
        server_info = json.loads(server_info)
        _server_info = extra_info.get(machine_id, dict())
        if len(_server_info) == 0:
            _server_info = dict()
            _server_info['network'] = {"upBandwidth": 2000, "downBandwidth": 2000, "ports": random.Random().randint(10, 20000)}
            _server_info['network']["upBandwidth"] = random.Random().randint(100, 1000)
            _server_info['network']["downBandwidth"] = random.Random().randint(200, 2000)
            _server_info['disk'] = {"type": "NVMe", "readBandwidth": 3000, "writeBandwidth": 3000, "iops": 100000, "size": "2000"}
            _server_info['disk']['readBandwidth'] = random.Random().randint(1500, 3500)
            _server_info['disk']['writeBandwidth'] = random.Random().randint(1500, 3500)
            extra_info[machine_id] = _server_info
        server_info.update(_server_info)
        server_info["motherboard"] = {
            "model": "ASUS ROG Strix B550-F",
            "pcieVersion": "4.0",
            "pcieLanes": 16,
            "pcieBandwidth": 5000
        }
        machine = Machine(machine_id, address, server_info['host_info']['host'], server_info['host_info']['port'], server_info, server_info['api_version'])
        machine.price = Price.init_from_contract(price)
        machine.market_id = cid
        machine.status = status
        return machine

    @property
    def data(self):

        data = dict(machine_id=self.machine_id, owner=self.pub_key, host=self.host, port=self.port,
                    server_info=self.server_info, apiVersion=self.api_version, market_id=self.market_id, status=self.status)
        if self.status == 0:
            data['contract_server_info'] = self.contract_server_info

        if self.price is not None:
            data['price'] = self.price.data
        return data

    # 生成合约的info
    @property
    def contract_server_info(self):
        from copy import copy
        data = copy(self.server_info) if self.server_info is not None else dict()
        data["api_version"] = self.api_version
        data["machine_id"] = self.machine_id
        data["host_info"] = dict(host=self.host, port=self.port)
        return json.dumps(data)
