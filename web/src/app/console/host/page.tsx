'use client'

import { web3Context } from "@/contexts/web3"
import { Button, Input } from "@mui/joy"
import { useContext, useState } from "react"
import { CopyAll, Mail } from '@mui/icons-material'
import ImageHost from '@/assets/images/host-bg.png'
import Image from 'next/image'
import { toast } from "sonner"
import AccountCard from "@/components/AccountCard"
import { useRouter } from "next/navigation"

export default function HostPage() {
    const {
        account,
        balance,
        accountContract,
        refreshAccountInfo,
    } = useContext(web3Context)
    const router = useRouter()
    const [email, setEmail] = useState('')

    return <div className="flex pt-40 px-12">
        <Image className="fixed right-0 bottom-0 opacity-10" src={ImageHost} alt="host bg" />
        <ul className="flex-1 font-medium text-base list-disc text-main">
            <li className="mb-4">If you are looking for a way to earn money from your unused GPU power, you might want to consider becoming a host on our platform. Here are some benefits of hosting with us</li>
            <li className="mb-4">Low-cost and easy setup: You can use your existing hardware and software, and deploy your machines with Docker-based containers. No need to buy or install any special equipment or software.</li>
            <li className="mb-4">Flexible and fair pricing: You can set your own prices and availability for your machines, and choose between on-demand or interruptible rentals. You can also participate in spot auctions to maximize your profits.</li>
            <li className="mb-4">Wide and diverse market: You can reach a large and growing number of customers who need GPU compute for various tasks, such as machine learning, gaming, rendering, and more. You can also offer different levels of security and reliability to suit different needs.</li>
            <li className="mb-4">Support and community: You can get help from our team and other hosts through our chat, discord, or email. You can also share your feedback and suggestions to improve our platform and services.</li>
        </ul>
        <div className="flex-1 flex flex-col items-center">
            <AccountCard account={account} />
            <div className="text-main font-semibold my-9">
                <span className="text-5xl mr-2">{balance.toString()}</span>
                <span className="text-2xl">Eth</span>
            </div>
            <Input
                size="lg"
                startDecorator={<Mail />}
                value={email}
                onChange={e => {
                    setEmail(e.target.value)
                }}
                endDecorator={<Button variant="solid" onClick={async () => {
                    try {
                        accountContract?.current?.methods.setProviderInfo(JSON.stringify({
                            email
                        })).send({
                            from: account,
                        }).on('error', console.error).on('confirmation', e => {
                            if (e.receipt.status === BigInt(1)) {
                                refreshAccountInfo().then(() => {
                                    toast.success('Success')
                                    router.push('/console/dashboard/market')
                                })
                            }
                        })
                    } catch (error: any) {
                        toast.error(error)
                    }
                }}>Become Providor</Button>}
            ></Input>
        </div>
    </div>
}


