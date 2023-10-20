# -*- coding:utf-8 -*-
import json
import os
import sys

# url = 'http://7.tcp.cpolar.top:11719'
# url = 'http://127.0.0.1:8545'
# contract_address = '0xBfFd481336eac92e381D990636d9e8be7e909bFd'
# contract_address = '0xBfFd481336eac92e381D990636d9e8be7e909bFd'
account_contract_address = '0xa6983d77EBF8C55E153BcBa8E2cd616b512cE0C2'
account_abi = json.load(open(os.path.join(os.getcwd(), "build/contracts/AccountFactory.json")))['abi']

helper_contract_address = '0x1d77589F3d73E601D35bCA37EB308a714293Cd93'
helper_abi = json.load(open(os.path.join(os.getcwd(), "build/contracts/Helper.json")))['abi']


gas_limit = 1000000  # 您可能需要根据合约函数的复杂性和资源消耗进行调整

url = 'https://sepolia-rpc.scroll.io'
chain_id = 534351

public_to_private_keys = {
    '0xe9B85f5413D0a6783b96CFE014D3d2A1F179b0cA': 'ccca76e7cfd79340217a9f371b3ace50b6758336423e6104bdd36dc91ff922ee'
}


class _role:
    _contract_owner = '0xe9B85f5413D0a6783b96CFE014D3d2A1F179b0cA0xe9B85f5413D0a6783b96CFE014D3d2A1F179b0cA'
    _provider = '0xe9B85f5413D0a6783b96CFE014D3d2A1F179b0cA'
    _user = '0xe9B85f5413D0a6783b96CFE014D3d2A1F179b0cA'

    @classmethod
    def private_key(cls, public_key):
        return public_to_private_keys.get(public_key, None)

    @property
    def contract_owner(self):
        return type("owner", (), dict(public_key=self._contract_owner, private_key=self.private_key(self._contract_owner)))

    @property
    def provider(self):
        return type("provider", (), dict(public_key=self._provider, private_key=self.private_key(self._provider)))

    @property
    def user(self):
        return type("user", (), dict(public_key=self._user, private_key=self.private_key(self._user)))


role = _role()


__all__ = ['role', 'url', 'helper_contract_address', 'account_contract_address', 'helper_abi', 'account_abi', 'chain_id', 'gas_limit']

if __name__ == '__main__':
    print(role.provider.public_key)
    print(role.provider.private_key)
