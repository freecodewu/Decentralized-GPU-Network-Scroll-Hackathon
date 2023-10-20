export const configRes = {
    "code": 200,
    "data": {
        "contract_info": [
            {
                "abi": [
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "previousOwner",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "newOwner",
                                "type": "address"
                            }
                        ],
                        "name": "OwnershipTransferred",
                        "type": "event"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "owner",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "renounceOwnership",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "newOwner",
                                "type": "address"
                            }
                        ],
                        "name": "transferOwnership",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "register",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "addr",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "balance",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "providerBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "recipientBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "info",
                                        "type": "string"
                                    }
                                ],
                                "internalType": "struct AccountFactory.accountInfo",
                                "name": "accountinfo",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "withdraw",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "cancellation",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "_info",
                                "type": "string"
                            }
                        ],
                        "name": "setProviderInfo",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_stakeAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "onlineBlockedFund",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_stakeAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "offlineUnBlockedFund",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_stakeAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "rentBlockedFund",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "_recipient",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "_provider",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_stakeAmount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_unBlockedAmount",
                                "type": "uint256"
                            }
                        ],
                        "name": "rentUnBlockedFund",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "stake",
                        "outputs": [],
                        "payable": true,
                        "stateMutability": "payable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "unstake",
                        "outputs": [],
                        "payable": true,
                        "stateMutability": "payable",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "_user",
                                "type": "address"
                            }
                        ],
                        "name": "isRegister",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "_addr",
                                "type": "address"
                            }
                        ],
                        "name": "getAccount",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "addr",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "balance",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "providerBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "recipientBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "info",
                                        "type": "string"
                                    }
                                ],
                                "internalType": "struct AccountFactory.accountInfo",
                                "name": "",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ],
                "contract_address": "0x6368FEE87Ca2b7d28DBdB32781553095900abF1C",
                "name": "account_contract"
            },
            {
                "abi": [
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "_accountFactoryAddress",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "account_contract",
                        "outputs": [
                            {
                                "internalType": "contract AccountFactory",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "a",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "b",
                                "type": "string"
                            }
                        ],
                        "name": "concatenateStrings",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "pure",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "devices",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "enum DeviceStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "string",
                                "name": "machineId",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "serverInfo",
                                "type": "string"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "serverPrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "storagePrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "upbandWidth",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "downbandWidth",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct Price",
                                "name": "price",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_deviceId",
                                "type": "uint256"
                            }
                        ],
                        "name": "getDevice",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "enum DeviceStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "machineId",
                                        "type": "string"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "serverInfo",
                                        "type": "string"
                                    },
                                    {
                                        "components": [
                                            {
                                                "internalType": "uint256",
                                                "name": "serverPrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "storagePrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "upbandWidth",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "downbandWidth",
                                                "type": "uint256"
                                            }
                                        ],
                                        "internalType": "struct Price",
                                        "name": "price",
                                        "type": "tuple"
                                    }
                                ],
                                "internalType": "struct deviceInfo",
                                "name": "",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_deviceId",
                                "type": "uint256"
                            }
                        ],
                        "name": "getLeaseByDeviceId",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "expireTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "deviceId",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct leaseInfo",
                                "name": "",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_leaseId",
                                "type": "uint256"
                            }
                        ],
                        "name": "getProviderBillingByLeaseId",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "user",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "providerBlockedFund",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "recipientBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "amount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "enum billingStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "enum billingType",
                                        "name": "billType",
                                        "type": "uint8"
                                    }
                                ],
                                "internalType": "struct billingInfo",
                                "name": "",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_leaseId",
                                "type": "uint256"
                            }
                        ],
                        "name": "getRecipientBillingByLeaseId",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "user",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "providerBlockedFund",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "recipientBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "amount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "enum billingStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "enum billingType",
                                        "name": "billType",
                                        "type": "uint8"
                                    }
                                ],
                                "internalType": "struct billingInfo",
                                "name": "",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "leaseProvider",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "leaseId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "expireTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "deviceId",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "leaseRecipient",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "leaseId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "expireTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "deviceId",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "platformSharingRatio",
                        "outputs": [
                            {
                                "internalType": "uint8",
                                "name": "",
                                "type": "uint8"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "providerBillings",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "leaseId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "providerBlockedFund",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "recipientBlockedFunds",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "enum billingStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum billingType",
                                "name": "billType",
                                "type": "uint8"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_endTime",
                                "type": "uint256"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "serverPrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "storagePrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "upbandWidth",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "downbandWidth",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct Price",
                                "name": "_price",
                                "type": "tuple"
                            }
                        ],
                        "name": "providerStakeCalcute",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "pure",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "name": "recipientBillings",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "user",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "leaseId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "providerBlockedFund",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "recipientBlockedFunds",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "enum billingStatus",
                                "name": "status",
                                "type": "uint8"
                            },
                            {
                                "internalType": "enum billingType",
                                "name": "billType",
                                "type": "uint8"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_endTime",
                                "type": "uint256"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "serverPrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "storagePrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "upbandWidth",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "downbandWidth",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct Price",
                                "name": "_price",
                                "type": "tuple"
                            }
                        ],
                        "name": "recipientStakeCalcute",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "pure",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_leaseId",
                                "type": "uint256"
                            }
                        ],
                        "name": "terminateLease",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "expireTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "deviceId",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct leaseInfo",
                                "name": "",
                                "type": "tuple"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "number",
                                "type": "uint256"
                            }
                        ],
                        "name": "uintToString",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "pure",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_deviceId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_endTime",
                                "type": "uint256"
                            }
                        ],
                        "name": "rentServer",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_leaseId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_endTime",
                                "type": "uint256"
                            }
                        ],
                        "name": "RenewalLeaseServer",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_leaseId",
                                "type": "uint256"
                            }
                        ],
                        "name": "terminateInstance",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "_machineId",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "_serverInfo",
                                "type": "string"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "serverPrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "storagePrice",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "upbandWidth",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "downbandWidth",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct Price",
                                "name": "_price",
                                "type": "tuple"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_startTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_endTime",
                                "type": "uint256"
                            }
                        ],
                        "name": "onlineServer",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_deviceId",
                                "type": "uint256"
                            }
                        ],
                        "name": "offlineServer",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "_limit",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_offset",
                                "type": "uint256"
                            }
                        ],
                        "name": "listDevices",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "enum DeviceStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "machineId",
                                        "type": "string"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "serverInfo",
                                        "type": "string"
                                    },
                                    {
                                        "components": [
                                            {
                                                "internalType": "uint256",
                                                "name": "serverPrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "storagePrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "upbandWidth",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "downbandWidth",
                                                "type": "uint256"
                                            }
                                        ],
                                        "internalType": "struct Price",
                                        "name": "price",
                                        "type": "tuple"
                                    }
                                ],
                                "internalType": "struct deviceInfo[]",
                                "name": "_allDevices",
                                "type": "tuple[]"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "_provider",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_limit",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "_offset",
                                "type": "uint256"
                            }
                        ],
                        "name": "listOwnDevices",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "enum DeviceStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "machineId",
                                        "type": "string"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "serverInfo",
                                        "type": "string"
                                    },
                                    {
                                        "components": [
                                            {
                                                "internalType": "uint256",
                                                "name": "serverPrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "storagePrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "upbandWidth",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "downbandWidth",
                                                "type": "uint256"
                                            }
                                        ],
                                        "internalType": "struct Price",
                                        "name": "price",
                                        "type": "tuple"
                                    }
                                ],
                                "internalType": "struct deviceInfo[]",
                                "name": "_ownDevices",
                                "type": "tuple[]"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "getAll",
                        "outputs": [
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "user",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "providerBlockedFund",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "recipientBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "amount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "enum billingStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "enum billingType",
                                        "name": "billType",
                                        "type": "uint8"
                                    }
                                ],
                                "internalType": "struct billingInfo[]",
                                "name": "",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "user",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "providerBlockedFund",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "recipientBlockedFunds",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "amount",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "enum billingStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "enum billingType",
                                        "name": "billType",
                                        "type": "uint8"
                                    }
                                ],
                                "internalType": "struct billingInfo[]",
                                "name": "",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "expireTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "deviceId",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct leaseInfo[]",
                                "name": "",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "leaseId",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "startTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "expireTime",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "deviceId",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct leaseInfo[]",
                                "name": "",
                                "type": "tuple[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "uint256",
                                        "name": "id",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "address",
                                        "name": "owner",
                                        "type": "address"
                                    },
                                    {
                                        "internalType": "enum DeviceStatus",
                                        "name": "status",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "machineId",
                                        "type": "string"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "serverInfo",
                                        "type": "string"
                                    },
                                    {
                                        "components": [
                                            {
                                                "internalType": "uint256",
                                                "name": "serverPrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "storagePrice",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "upbandWidth",
                                                "type": "uint256"
                                            },
                                            {
                                                "internalType": "uint256",
                                                "name": "downbandWidth",
                                                "type": "uint256"
                                            }
                                        ],
                                        "internalType": "struct Price",
                                        "name": "price",
                                        "type": "tuple"
                                    }
                                ],
                                "internalType": "struct deviceInfo[]",
                                "name": "",
                                "type": "tuple[]"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    }
                ],
                "contract_address": "0x5dD0c595B7eb5B6aDb60F70788396eA5b77cE4C8",
                "name": "helper_contract"
            }
        ],
        "public_to_private_keys": {
            "0x17c66CD3A22287F12c8953cfe19F6Fe36f2d5d40": "0xb8782645368dc1cc70e7fa0a79a77ad95f8a226e75054de9fdd4b1a43fc5ac27",
            "0x3cb432EE97677f21e71C38A5E9c7d5BD528c9f32": "0x17ef0709c5be3977c573c44944c4a57486f1b28914762907b8514e656d6fb961",
            "0x62DA151Df793d2E8eDB721BBa899FA55168A979A": "0x2bd1570a01dd4d8591822bd3b2f5832df1935aa6bbd1a6d3edf3c4abd77634df",
            "0x68c1d55a42b6D1bbE95176e5F2C8F0fBd27A330B": "0xf0ba8304f469d6cd9354cd15c64d3e6e0ec224d21e0e213ccaed1dc7cba8604a",
            "0x7929ee254982B00E0eAB67571a4058Ce16C0C6C8": "0x9804de8cf7f0e1b839c7522167decde90a254fa6f646373f978470e0b5ebb492",
            "0xB5B6ac8b55E03DA2440fE9803215b0A15cBcd9e3": "0xbc20ffa0e4b4ebcde1a4e5dd463837fefaf3387534ea486b4d7462f6339d00f6",
            "0xC05E11d8727FB6Ce050dA9769FB8AFD241F00a9b": "0x4952d70ba57e8d64cf7996404384899a95d16441ba04faf2215670a407f8d6a4",
            "0xC73D43c392299866662f4BEd2c0e902a3A987647": "0x724d84ca0a09cff0444a55f271a846204095a53f4c78b8c2b3cfb5a4a9146921"
        },
        "rpc_url": "http://7.tcp.cpolar.top:11719"
    }
} as const