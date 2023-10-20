'use client'

import { Price } from "@/constant/api"
import { web3Context } from "@/contexts/web3"
import { CommonResponse, CommonResponse2, getFetcher } from "@/utils/fetcher"
import { Button, Link } from "@mui/joy"
import dayjs from "dayjs"
import { useContext } from "react"
import useSWR from 'swr'
import Web3 from "web3"
import cns from 'classnames'

/**
 * Billing
 */
export interface BillingResponse {
    amount: number;
    instance_id: string;
    provider_address: string;
    recipient_address: string;
    merchantAddress: string;
    server_id: number;
    setlle_at: number;
    start_time: number;
    /**
     * Server;Storage;Up Bandwidth;Down Bandwidth
     */
    sku: string;
    price: Price;
}

export default function BillingPage() {
    const {
        account,
        accountInfo,
        balance,
    } = useContext(web3Context)

    const {
        data: billingList
    } = useSWR<CommonResponse2<BillingResponse[]>>(account ? [`/apus/account/bill/consume`, { address: account }] : null, getFetcher)
    return <section className="p-5">
        <div className="flex items-center gap-12 mb-5">
            {
                [{
                    label: 'Account Balance',
                    value: balance,
                }, {
                    label: 'Contract Balance',
                    value: accountInfo.balance,
                }, {
                    label: 'Stake Funds',
                    value: accountInfo.recipient_blocked_funds,
                }].map(({ label, value }) => {
                    return <div key={label} className="flex flex-row items-center gap-1 text-base text-main">
                        <span>{label}: </span>
                        <span className="font-bold">{value} ETH</span>
                    </div>
                })
            }
        </div>
        <div className="flex flex-col gap-3">
            {billingList?.items?.map((v, index) => {
                return <Transaction key={index} {...v} />
            })}
        </div>
    </section>
}

function Transaction({ amount, instance_id, provider_address, recipient_address, merchantAddress, server_id, setlle_at, start_time, sku, price }: BillingResponse) {
    return <div className="border-0 border-l-4 border-solid border-primary p-4 bg-accent rounded">
        {
            [
                [
                    {
                        label: 'Consumption Type: ',
                        value: sku
                    },
                    {
                        label: 'Instance ID: ',
                        value: instance_id
                    },
                    {
                        label: 'Settle Time: ',
                        value: dayjs.unix(setlle_at).format('YYYY-MM-DD HH:mm:ss'),
                    }
                ],
                [
                    {
                        label: 'Unit Price: ',
                        value: Web3.utils.fromWei(price.server_price, 'ether') + '/hr'
                    },
                    {
                        label: 'Comsuption: ',
                        value: Web3.utils.fromWei(amount, 'ether') + ' ETH'
                    },
                    {
                        label: 'Paid To: ',
                        value: provider_address,
                    }
                ]
            ].map((v, index) => {
                return <div className="mb-3" key={index}>
                    <div className="flex flex-row text-base">
                        {
                            v.map(({ label, value }, index) => {
                                return <div key={label} className={cns("flex gap-1 text-left", index === 2 ? 'w-auto' : 'w-1/5')}>
                                    <span className="text-secondary">{label}</span>
                                    <span className="text-main">{value}</span>
                                </div>
                            })
                        }
                    </div>
                </div>
            })
        }
    </div>
}