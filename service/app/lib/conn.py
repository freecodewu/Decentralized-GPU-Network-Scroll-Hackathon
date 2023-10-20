# -*- coding:utf-8 -*-
import enum
import json
import time
from web3 import Web3

from .config import *

web3 = Web3(Web3.HTTPProvider(url))  # 替换为您自己的Infura项目ID或以太坊节点URL

helper_contract = web3.eth.contract(address=helper_contract_address, abi=helper_abi)
account_contract = web3.eth.contract(address=account_contract_address, abi=account_abi)


def get_nonce(address):
    return web3.eth.get_transaction_count(address)


def transaction(addr, func, **kwargs):
    transaction = {
        'chainId': chain_id,
        'gas': gas_limit,
        'gasPrice': web3.eth.gas_price,
        'nonce': get_nonce(addr.public_key),
    }

    transaction.update(**kwargs)
    transaction = func.build_transaction(transaction)
    signed_txn = web3.eth.account.sign_transaction(transaction, addr.private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return web3.eth.wait_for_transaction_receipt(tx_hash)

__all__ = ['helper_contract', 'account_contract']
