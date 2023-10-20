'use client'

import { TenantInstance } from "@/components/Instance"
import { InstanceInfo, InstanceInfoResponse } from "@/constant/api"
import { useRenewal, useTerminateLease } from "@/constant/contract"
import { web3Context } from "@/contexts/web3"
import { CommonResponse, CommonResponse2, getFetcher } from "@/utils/fetcher"
import { DatePicker, Form, Modal } from "antd"
import { useForm } from "antd/es/form/Form"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { toast } from "sonner"
import useSWR from 'swr'
import { toWei } from "web3-utils"
export interface TenantInstancesResponse {
    connection: Connection;
    info: InstanceInfoResponse;
    status: Status;
    instance_id: string;
}

export interface Connection {
    ssh_password: string;
    ssh_user_name: string;
    ssh_ip: string;
    ssh_port: number;
}

/**
 * GPU Server Instance
 */
export interface GPUServerInstance {
    market_id: string;
    cpu: Cpu;
    disk: Disk;
    gpu: Gpu;
    guid: string;
    health: Health;
    motherboard: Motherboard;
    network: Network;
    /**
     * address
     */
    owner: string;
    price: Price;
    ram: Ram;
}

export interface Cpu {
    cores: string;
    model: string;
    threads: string;
}

export interface Disk {
    iops: number;
    /**
     * MB/s
     */
    readBandwidth: number;
    /**
     * GB
     */
    size: string;
    /**
     * nvme;sata
     */
    type: string;
    /**
     * MB/s
     */
    writeBandwidth: number;
}

export interface Gpu {
    count: number;
    maxCUDAVersion: string;
    model: string;
    /**
     * GB
     */
    ram: number;
    /**
     * GB/s
     */
    ramBandwidth: number;
    tflops: number;
}

export interface Health {
    /**
     * %
     */
    reliability: number;
    /**
     * UnixTimestamp
     */
    scheduledMaintenanceTimestamp: number;
}

export interface Motherboard {
    model: string;
    /**
     * GB/s
     */
    pcieBandwidth: number;
    pcieLanes: number;
    pcieVersion: string;
}

export interface Network {
    /**
     * Mbps
     */
    downBandwidth: number;
    ports: number;
    /**
     * Mbps
     */
    upBandwidth: number;
}

/**
 * Price
 */
export interface Price {
    /**
     * $/hr
     */
    downbandwidth: number;
    /**
     * $/hr
     */
    server: number;
    /**
     * $/
     */
    storage: number;
    /**
     * $/hr
     */
    upbandwidth: number;
}

export interface Ram {
    /**
     * Mhz
     */
    frequency: number;
    /**
     * GB
     */
    size: number;
}

export interface Status {
    lease_expire: number;
    lease_start: number;
    rent_from: string;
    state: string;
}


export default function InstancePage() {
    const { account, helperContract, accountInfo } = useContext(web3Context)

    const { data: instansListRes, mutate: refreshInstanceList } = useSWR<CommonResponse2<TenantInstancesResponse[]>>(account ? ['/apus_network/server/instance/list', { address: account }] : null, getFetcher)

    const [form] = useForm()
    const [currentInstance, setCurrentInstance] = useState<TenantInstancesResponse>()
    const [renewDialogOpen, setRenewDialogOpen] = useState(false)
    const {
        renewal,
        isRenewaling
    } = useRenewal(helperContract)
    const {
        terminateLease,
        isTerminating,
    } = useTerminateLease(helperContract)

    return <section className="p-5">
        {instansListRes?.items?.map((v, index) =>
            <TenantInstance
                key={index}
                {...v}
                onTerminate={async props => {
                    try {
                        await terminateLease(account, props.instance_id)
                        return refreshInstanceList()
                    } catch {
                        toast.error('Terminate failed')
                    }
                }}
                onRenew={props => {
                    setCurrentInstance(props)
                    setRenewDialogOpen(true)
                }}
            />
        )}
        <Modal title="Rent Instance" open={renewDialogOpen} confirmLoading={isRenewaling} okText="rent" onOk={async () => {
            const { endDate } = await form.validateFields()

            try {
                if (currentInstance) {
                    const toPay = BigInt(endDate.diff(dayjs(), 'second')) * BigInt(currentInstance.info.price.server_price)
                    const balance = BigInt(toWei(accountInfo.balance, 'ether'))
                    if (toPay > balance) {
                        toast.error('Insufficient balance')
                        return
                    }
                    await renewal(account, currentInstance.instance_id, endDate)
                    setRenewDialogOpen(false)
                    refreshInstanceList()
                    toast.success('Renew success')
                }
            } catch {
                toast.error('Renew failed')
            }
        }} onCancel={() => {
            setRenewDialogOpen(false)
        }}>
            <Form form={form}>
                <Form.Item label="End Date" name="endDate" required>
                    <DatePicker
                        disabledDate={(current: any) => current && current < dayjs().endOf('day')}
                    />
                </Form.Item>
            </Form>
        </Modal>
    </section>
}