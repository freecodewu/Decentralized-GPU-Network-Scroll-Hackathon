'use client'

import { CommonDialog } from "@/components/CommonDialog"
import { MachineInstance } from "@/components/Instance"
import { web3Context } from "@/contexts/web3"
import { CommonResponse, getFetcher } from "@/utils/fetcher"
import { Button } from "@mui/joy"
import { useContext, useState } from "react"
import useSWR from 'swr'
import { InputNumber, Form, DatePicker, Modal } from 'antd'
import dayjs from 'dayjs'
import { InstanceInfo } from "@/constant/api"
import { useOnline, useUnList } from "@/constant/contract"
import { toast } from "sonner"

export interface MachinesResponse {
    contract_server_info: string;
    owner: string;
    machine_id: string;
    market_id: number;
    host: string;
    port: string;
    server_info: InstanceInfo;
    status: 0 | 1 | 2 | 3; // enum DeviceStatus {Created, Online, Running, Offline} 
}


export default function InstancePage() {
    const { account, helperContract } = useContext(web3Context)

    const [currentMachine, setCurrentMachine] = useState<MachinesResponse | null>(null)
    const [listDialogOpen, setListDialogOpen] = useState(false)

    const { data: instansListRes, mutate: refreshMachines } = useSWR<CommonResponse<MachinesResponse[]>>(account ? ['/apus_network/server/provider/list', { address: account }] : null, getFetcher)

    const [priceForm] = Form.useForm()
    const [durationForm] = Form.useForm()

    const {
        unList,
        isUnListing
    } = useUnList(helperContract)

    const {
        online,
        isOnlining,
    } = useOnline(helperContract)

    const listMachine = async () => {
        try {
            if (currentMachine !== null) {
                const price = await priceForm.validateFields()
                const { endDate } = await durationForm.validateFields()
                await online(account, currentMachine.machine_id, currentMachine.contract_server_info, price, endDate)
                await refreshMachines()
                toast.success('List success')
            }
        } catch (e) {
            console.error(e)
            toast.error('List failed')
        } finally {
            setListDialogOpen(false)
        }
    }

    return <section className="p-5">
        {instansListRes?.data?.map((v, index) => <MachineInstance key={index} {...v} onList={(machine: MachinesResponse) => {
            setCurrentMachine(machine)
            setListDialogOpen(true)
        }} onUnList={async (props) => {
            await unList(account, props.market_id)
            await refreshMachines()
            toast.success('Unlist success')
        }} isLoading={isUnListing} />)}
        <Modal title="List Instance" width="59rem" confirmLoading={isOnlining} open={listDialogOpen} onOk={listMachine} onCancel={() => {
            setListDialogOpen(false)
        }}>
            <div>
                <div className="my-4 border-0 border-l-4 border-solid border-primary pl-4 font-bold text-xl text-main">SLA Level</div>
                <div className="flex flex-row gap-4">
                    {[{
                        item: 'Bronze',
                        desc: '99% uptime, 8 hours response time, 16 hours resolution time',
                        disabled: false,
                        variant: "soft" as const
                    }, {
                        item: 'Silver',
                        desc: '99.5% uptime, 4 hours response time, 8 hours resolution time',
                        disabled: true,
                        variant: "outlined" as const
                    }, {
                        item: 'Gold',
                        desc: '99.9% uptime, 2 hours response time, 4 hours resolution time',
                        disabled: true,
                        variant: "outlined" as const
                    }].map(({ item, desc, disabled, variant }) => <Button key={item} variant={variant} color="primary" disabled={disabled}>
                        <div className="flex flex-col w-64">
                            <div className="text-primary text-lg font-medium">{item}</div>
                            <div className=" text-secondary text-base">{desc}</div>
                        </div>
                    </Button>)}

                </div>
                <div className="my-4 border-0 border-l-4 border-solid border-primary pl-4 font-bold text-xl text-main">Price</div>
                <Form layout="vertical" rootClassName="grid grid-cols-2 gap-2" form={priceForm}>
                    <Form.Item label="Server Price (eth/s)" name="server_price" required>
                        <InputNumber min="0" max="10" step="0.00000000000001" rootClassName="w-full" />
                    </Form.Item>
                    <Form.Item label="Storage Price (eth/G*s)" name="storage_price" required>
                        <InputNumber min="0" max="10" step="0.00000000000001" rootClassName="w-full" />
                    </Form.Item>
                    <Form.Item label="Up Bandwidth Price (eth/MB)" name="upband_width" required>
                        <InputNumber min="0" max="10" step="0.00000000000001" rootClassName="w-full" />
                    </Form.Item>
                    <Form.Item label="Down Bandwidth Price (eth/MB)" name="downband_width" required>
                        <InputNumber min="0" max="10" step="0.00000000000001" rootClassName="w-full" />
                    </Form.Item>
                </Form>
                <div className="my-4 border-0 border-l-4 border-solid border-primary pl-4 font-bold text-xl text-main">List Duration</div>
                <Form layout="vertical" rootClassName="grid grid-cols-2 gap-2" form={durationForm}>
                    <Form.Item label="End Date" name="endDate" required>
                        <DatePicker disabledDate={(current: any) => current && current < dayjs().endOf('day')} />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    </section>
}