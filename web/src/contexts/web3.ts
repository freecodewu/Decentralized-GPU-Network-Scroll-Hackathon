'use client'

import { accountContractABI, accountContractAddress, helperContractABI, helperContractAddress } from "@/constant/contract";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { Web3, Contract } from "web3";
import useSWR from 'swr'
import { CommonResponse, getFetcher } from "@/utils/fetcher";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { toChecksumAddress, fromWei, toWei } from 'web3-utils'

export const web3Context = createContext<ReturnType<typeof useWeb3Context>>(null!)

export const Web3ContextProvider = web3Context.Provider

export type AccountInfoResponse = {
    /**
     * 用户公钥地址
     */
    address: string;
    /**
     * 用户的金额, 是一个字符串形式的float "1.11", 单位是BNB
     */
    balance: string;
    /**
     * 是否是provider
     */
    is_provider: boolean;
    /**
     * 因provider质押的金额, 格式同balance
     */
    provider_blocked_funds: string;
    /**
     * provider的信息 @jax,  需要提供下
     */
    provider_info: { [key: string]: any };
    info: { [key: string]: any };
    /**
     * 租用机器质押的金额, 格式同balance
     */
    recipient_blocked_funds: string;
}

export type AccountContract = Contract<typeof accountContractABI>
export type HelperContract = Contract<typeof helperContractABI>

export const Web3jsLoadEvent = new EventTarget()

const scrollChainConfig = {
    chainId: '0x8274f',
    chainName: 'Scroll Sepolia',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['https://sepolia-rpc.scroll.io'],
    blockExplorerUrls: ['https://sepolia-explorer.scroll.io'],
}


export function useWeb3Context() {
    const web3 = useRef<Web3>()
    const accountContract = useRef<AccountContract>()
    const helperContract = useRef<HelperContract>()
    const [hasMetamask, setHasMetamask] = useState(false)
    const [account, setAccount] = useState<string>("")
    const [balance, setBalance] = useState<string>("0.")
    const [isScroll, setIsScroll] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { data: accountInfo, isLoading, mutate: refreshAccountInfo } = useSWR<CommonResponse<AccountInfoResponse>>(account ? ['/apus/account/info', {
        address: account
    }] : null, getFetcher, {
        onSuccess: (data) => {
            if (data.code === 200 && pathname === '/console/signin') {
                router.push('/console/dashboard/market')
            }
        }
    })
    const [isConnecting, setIsConnecting] = useState(false)

    const initAccount = async (requestAccount?: boolean) => {
        try {
            const accounts = await window.ethereum.request({
                method: requestAccount ? 'eth_requestAccounts' : 'eth_accounts',
            })
            if (!accounts?.length) {
                return { account: '', balance: '0' }
            }
            const account = toChecksumAddress(accounts[0])
            setAccount(account)
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            })
            const etherBalance = fromWei(balance, 'ether')
            setBalance(etherBalance)
            return {
                account,
                balance: etherBalance,
            }
        } catch (e) {
            console.error(e)
            return { account: '', balance: '0' }
        }
    }

    const connectMetamask = useCallback(async () => {
        setIsConnecting(true)
        try {
            const { account, balance } = await initAccount(true)
            if (Number(balance) <= 0) {
                toast.error('Your need to have some BNB to register')
                return
            }
            console.info(accountContract.current?.methods.register())
            await accountContract.current?.methods.register().send({
                from: account,
            }).on('error', console.error).on('confirmation', (e) => {
                if (e.receipt.status === BigInt(1)) {
                    toast.success('Sing up successfully')
                    accountContract.current?.methods?.getAccount
                    refreshAccountInfo()
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            setIsConnecting(false)
        }
    }, [refreshAccountInfo])

    const switchScroll = useCallback(async () => {
        if (window.ethereum !== undefined) {
            await window.ethereum
                .request({
                    method: 'wallet_addEthereumChain',
                    params: [scrollChainConfig],
                })
            await window.ethereum
                .request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: scrollChainConfig.chainId
                        },
                    ],
                })
            setIsScroll(true)
        }
    }, [])

    useEffect(() => {
        if (window.ethereum !== undefined) {
            setHasMetamask(true)
            initAccount()
        }
        const initWeb3 = () => {
            console.log('initWeb3')
            web3.current = new window.Web3(window.ethereum)
            accountContract.current = new web3.current.eth.Contract(accountContractABI, accountContractAddress)
            helperContract.current = new web3.current.eth.Contract(helperContractABI, helperContractAddress)
            web3.current.eth.getChainId().then((chainId) => {
                setIsScroll(chainId === BigInt(scrollChainConfig.chainId))
            })
        }
        Web3jsLoadEvent.addEventListener('load', initWeb3);
        window.ethereum.on('accountsChanged', () => {
            initAccount()
        });
        window.ethereum.on('chainChanged', () => {
            initAccount()
        });
        return () => {
            window.ethereum.removeAllListeners('accountsChanged')
            Web3jsLoadEvent.removeEventListener('load', initWeb3)
        }
    }, [])

    return {
        refreshAccount: initAccount,
        hasMetamask,
        isLogin: accountInfo?.code === 200,
        needLogin: !isLoading && accountInfo?.code === 400,
        connectMetamask,
        account,
        web3,
        accountContract: accountContract,
        helperContract: helperContract,
        balance,
        accountInfo: {
            balance: fromWei(accountInfo?.data?.balance || '0', 'ether'),
            recipient_blocked_funds: fromWei(accountInfo?.data?.recipient_blocked_funds || '0', 'ether'),
            provider_blocked_funds: fromWei(accountInfo?.data?.provider_blocked_funds || '0', 'ether'),
        },
        isProvider: Boolean(accountInfo?.data?.info),
        isConnecting,
        refreshAccountInfo,
        isScroll,
        switchScroll,
    }
}