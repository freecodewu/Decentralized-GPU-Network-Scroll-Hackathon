'use client'

import { Button, Slider } from "@mui/joy"
import { useContext, useEffect, useState } from "react"
import useSWR from 'swr'
import { CommonResponse, getFetcher } from "@/utils/fetcher"
import { InstanceInfo, InstanceInfoResponse, InstanceResponse } from "@/constant/api"
import { MarketInstance } from "@/components/Instance"
import { DatePicker, Form, Modal } from "antd"
import dayjs from "dayjs"
import { useForm } from "antd/es/form/Form"
import { web3Context } from "@/contexts/web3"
import { useRent } from "@/constant/contract"
import { toast } from "sonner"
import IconDocker from '@/assets/icons/file-type-docker.svg'
import Image from 'next/image'
import { useRouter } from "next/navigation"
import { toWei } from "web3-utils"

const dockerStartScriptStr = `env | grep >> /etc/environment; touch ~/.no_auto_tmux; sleep 5;
sed -i '/rsync -au --remove-source-files \/venv\/ \/workspace\/venv\//a source \/workspace\/venv\/bin\/activate\n cd zkevm\n cargo install circom' /start.sh;
/start.sh`

export default function MarketPage() {
    const [diskSize, setDiskSize] = useState(200)
    const { data: instanceList, mutate: refreshMarketList } = useSWR<CommonResponse<InstanceResponse>>(['/apus_network/server/market/list', { offset: 0, limit: 9999 }], getFetcher)
    const {
        accountInfo,
        helperContract,
        account,
    } = useContext(web3Context)
    const router = useRouter()
    const { isRenting, rent } = useRent(helperContract)
    const [form] = useForm()
    const [rentDialogOpen, setRentDialogOpen] = useState(false)
    const [currentInstance, setCurrentInstance] = useState<InstanceInfoResponse>()

    const [imageDialogOpen, setImageDialogOpen] = useState(false)

    return <div className="grid" style={{
        gridTemplateColumns: '22.5rem 1fr'
    }}>
        <div className="bg-accent flex flex-col p-5">
            <div className="bg-default p-4 flex flex-col gap-3 rounded-2xl">
                <div className="font-medium text-xl">Instance Configuration</div>
                {
                    [
                        {
                            label: 'Image:',
                            item: 'Circom zkSNARK'
                        },
                        {
                            label: 'Image CUDA version:',
                            item: '12.1'
                        },
                        {
                            label: 'Launch Type:',
                            item: 'ssh'
                        }
                    ].map(({ label, item }) => {
                        return <div className="text-sm" key={label}>
                            <span className="mr-2 text-secondary">{label}</span>
                            <span className="text-main font-medium">{item}</span>
                        </div>
                    })
                }
                <Button className="mt-4 text-center text-base font-medium h-14 rounded-7" onClick={() => {
                    setImageDialogOpen(true)
                }}>
                    CHOOSE IMAGE
                </Button>
                <div>
                    <div className="flex justify-between">
                        <div className=" text-secondary">Disk Space To Allocate</div>
                        <div className="font-medium text-main">{diskSize} GB</div>
                    </div>
                    <Slider value={diskSize}
                        onChange={(e, value) => {
                            setDiskSize(value as number)
                        }}
                        valueLabelDisplay="auto"
                        step={50}
                        min={100}
                        max={10000} />
                </div>
            </div>
        </div>
        <div className="p-5">
            {instanceList?.data?.map((v, index) => <MarketInstance key={index} {...v} onRent={instance => {
                setCurrentInstance(instance)
                setRentDialogOpen(true)
            }} />)}
        </div>
        <Modal title="Rent Instance" open={rentDialogOpen} confirmLoading={isRenting} okText="rent" onOk={async () => {
            const { endDate } = await form.validateFields()
            try {
                if (currentInstance) {
                    const toPay = BigInt(endDate.diff(dayjs(), 'second')) * BigInt(currentInstance.price.server_price)
                    const balance = BigInt(toWei(accountInfo.balance, 'ether'))
                    if (toPay > balance) {
                        toast.error('Insufficient balance')
                        return
                    }
                    await rent(account, currentInstance.market_id, endDate)
                    setRentDialogOpen(false)
                    toast.success('Rent success')
                    router.push('/console/dashboard/instances')
                }
            } catch (e) {
                console.error(e)
                toast.error('Rent failed')
            }
        }} onCancel={() => {
            setRentDialogOpen(false)
        }}>
            <Form form={form}>
                <Form.Item label="End Date" name="endDate" required>
                    <DatePicker disabledDate={(current: any) => current && current < dayjs().endOf('day')} />
                </Form.Item>
            </Form>
        </Modal>
        <Modal title="Image Templates" open={imageDialogOpen} footer={null} onCancel={() => {
            setImageDialogOpen(false)
        }}>
            <div className="flex flex-col gap-5">
                <Button variant="soft" color="primary" onClick={() => {
                    setImageDialogOpen(false)
                }}>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-main w-full">
                            <Image src={IconDocker.src} width={64} height={64} alt="docker icon" />
                            <div className="flex-1 text-primary font-semibold text-left">zerochl/zksnarks:latest</div>
                            <div>ssh/jupyter</div>
                        </div>
                        <div className="rounded-lg border border-solid border-slate-200 p-2">{dockerStartScriptStr}</div>
                    </div>
                </Button>
                <Button variant="outlined" color="primary" disabled>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2 text-main">
                            <Image src={IconDocker.src} width={64} height={64} alt="docker icon" />
                            <div className="flex-1 text-primary font-semibold text-left">cuda:12.0.1-devel-ubuntu20.04</div>
                            <div>ssh/jupyter</div>
                        </div>
                        <div className=" rounded-lg border border-solid border-slate-200 p-2">
                            None
                        </div>
                    </div>
                </Button>
            </div>
        </Modal>
    </div>
}


