import { ConnectWithoutContactOutlined, ConnectingAirportsOutlined, DeleteOutline, LocationOnOutlined, RefreshOutlined, RouteOutlined } from '@mui/icons-material'
import Image from 'next/image'
import IconLogo from '@/assets/icons/logo.svg'
import { Button, Typography } from '@mui/joy'
import AccountCard from './AccountCard'
import { useState } from 'react'
import { InstanceInfo, InstanceInfoResponse } from '@/constant/api'
import { CommonDialog } from './CommonDialog'
import { Modal, Popconfirm } from 'antd'
import Web3 from 'web3'
import { TenantInstancesResponse } from '@/app/console/dashboard/instances/page'
import dayjs from 'dayjs'
import { MachinesResponse } from '@/app/console/dashboard/machines/page'

export function MarketInstance(props: InstanceInfoResponse & {
    onRent: (instance: InstanceInfoResponse) => void
}) {
    return <><InstanceProto
        {...props.server_info}
        operation={<>
            <div className="text-secondary text-sm font-normal">from: {props.owner}</div>
            <div>{Web3.utils.fromWei((props?.price?.server_price || 0) * 3600, 'ether')}/hr</div>
            <Button className="btn-primary-middle" onClick={() => {
                props.onRent(props)
            }}>RENT</Button>
        </>} />
    </>
}

export function MachineInstance(props: MachinesResponse & {
    onList: (instance: MachinesResponse) => void
    onUnList: (instance: MachinesResponse) => void
    isLoading: boolean
}) {
    const isOnlineOrRunning = props.status === 1 || props.status === 2
    return <InstanceProto
        {...props.server_info}
        operation={
            <>
                {/* <Button className="btn-primary-middle">Schedule Maintainence</Button> */}
                <Button className="btn-primary-middle" loading={props.isLoading} disabled={props.status === 3} onClick={e => {
                    isOnlineOrRunning ? props.onUnList(props) : props.onList(props)
                }}>{isOnlineOrRunning ? 'UnList' : 'List'}</Button>
                {/* <Button className="btn-primary-middle">Set Price</Button> */}
            </>
        }
    />
}

function ConnectDialog({ open, setOpen, sshInfo, sshPassword }: {
    open: boolean
    setOpen: (open: boolean) => void
    sshInfo: string
    sshPassword: string
}) {
    return <CommonDialog title="Connect Instance" open={open} setOpen={setOpen} footer={null}>
        <div className=" w-96 py-8 flex flex-col gap-2">
            <div className='text-main font-semibold text-lg text-center mb-2'>Your SSH Connection Info</div>
            <AccountCard account={sshInfo} />
            <AccountCard account={sshPassword} />
        </div>
    </CommonDialog>
}

export function TenantInstance(props: TenantInstancesResponse & {
    onRenew: (instance: TenantInstancesResponse) => void
    onTerminate: (instance: TenantInstancesResponse) => Promise<void>
}) {
    const [ConnectDialogOpen, setConnectDialogOpen] = useState(false)
    const rentStart = dayjs.unix(props?.status?.lease_start)
    const rentExpires = dayjs.unix(props?.status?.lease_expire)
    let rentRemaining: number | string = rentExpires.diff(dayjs(), 'hour')
    let rentDuration: number | string = dayjs().diff(rentStart, 'hour')
    if (rentRemaining > 24) {
        rentRemaining = Math.floor(rentRemaining / 24) + 'd'
    } else {
        rentRemaining = rentRemaining + 'h'
    }
    if (rentDuration > 24) {
        rentDuration = Math.floor(rentDuration / 24) + 'd'
    } else {
        rentDuration = rentDuration + 'h'
    }

    const [terminating, setTerminating] = useState(false)

    return <><InstanceProto
        {...props.info.server_info}
        operation={
            <>
                <div>{Web3.utils.fromWei((props?.info.price.server_price || 0) * 3600, 'ether')}/hr</div>
                <Popconfirm title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => {
                        setTerminating(true)
                        props.onTerminate(props).finally(() => {
                            setTerminating(false)
                        })
                    }}
                    okButtonProps={{ danger: true }}
                    showCancel={false}
                    okText="Delete">
                    <Button variant="outlined" color="primary" loading={terminating}><DeleteOutline /></Button>
                </Popconfirm>
                <Button variant="outlined" color="primary" onClick={() => {
                    props.onRenew(props)
                }}><RefreshOutlined /></Button>
                <Button variant="outlined" color="primary" onClick={() => {
                    setConnectDialogOpen(true)
                }}><RouteOutlined /></Button>
            </>
        }
        additionalInfo={
            <div className='mt-3 '>
                <div className="mb-1 text-main font-medium">Running Info</div>
                <div className="flex gap-2">
                    {
                        [{
                            label: 'Age',
                            value: rentDuration,
                        }, {
                            label: 'Status',
                            value: props?.status?.state || 'N/A'
                        }, {
                            label: 'Remaining',
                            value: rentRemaining,
                        }].map(({ label, value }, index) => {
                            return <div key={index}>
                                <span className=" text-secondary">{label}: </span>
                                <span className=" text-main font-medium">{value}</span>
                            </div>
                        })
                    }
                </div>
            </div>
        }
    />
        <ConnectDialog
            open={ConnectDialogOpen}
            setOpen={setConnectDialogOpen}
            sshInfo={props?.connection ? `ssh -p ${props?.connection.ssh_port} ${props?.connection.ssh_user_name}@${props?.connection.ssh_ip}` : ''}
            sshPassword={props?.connection?.ssh_password || ''} />
    </>
}

function InstanceProto({ operation, additionalInfo, ...props }: InstanceInfo & { operation?: React.ReactNode, additionalInfo?: React.ReactNode }) {
    const {
        cpu,
        disk,
        gpu,
        guid,
        health,
        motherboard,
        network,
        owner,
        price,
        ram,
    } = props
    return <div className="mb-5 py-3 px-4 bg-accent">
        <div className="pb-3 flex justify-between items-center border-0 border-b border-solid border-slate-200 text-main font-bold text-xl">
            <div className="flex gap-4 items-center">
                <Image src={IconLogo.src} width={35} height={35} alt="logo icon" />
                <div>{gpu?.count || 1}X</div>
                <div>{gpu?.model || 'N/A'}</div>
                <div className="text-base font-normal">{guid}</div>
                {/* <div className="flex items-center">
                    <LocationOnOutlined />
                    <span>{ }</span>
                </div> */}
            </div>
            <div className="flex gap-5 items-center">
                {operation}
            </div>
        </div>
        <div className="pt-3 text-sm gap-1 flex flex-col">
            {
                [[
                    {
                        label: 'TFLOPS',
                        value: gpu?.tflops || 0
                    },
                    {
                        label: 'Max CUDA Version',
                        value: gpu?.maxCUDAVersion || 'N/A',
                    },
                    {
                        label: 'GPU RAM: ',
                        value: (gpu?.ram || 0) + 'GB'
                    },
                    {
                        label: 'GPU RAM Bandwidth',
                        value: (gpu?.ramBandwidth || 0) + 'GB/s',
                    },
                    {
                        label: 'Model',
                        value: gpu?.model || 'N/A'
                    },
                ], [
                    {
                        label: 'PCIE Version',
                        value: motherboard?.pcieVersion || 'N/A'
                    },
                    {
                        label: 'PCIE Number',
                        value: (motherboard?.pcieLanes || 0) + 'x'
                    },
                    {
                        label: 'PCIE bandwidth',
                        value: (motherboard?.pcieBandwidth || 0) + 'GB/s'
                    },
                    {
                        label: 'CPU Count',
                        value: cpu?.cores || 0
                    },
                    {
                        label: 'CPU Model',
                        value: cpu?.model || 'N/A'
                    }
                ], [
                    {
                        label: 'RAM frequency',
                        value: (ram?.frequency || 0) + 'Mhz'
                    },
                    {
                        label: 'RAM Size',
                        value: (ram?.size || 0) + 'GB'
                    },
                    {
                        label: 'Up Bandwidth',
                        value: (network?.upBandwidth || 0) + 'Mbps'
                    },
                    {
                        label: 'Down Bandwidth',
                        value: (network?.downBandwidth || 0) + 'Mbps'
                    },
                    {
                        label: 'Port Numbers',
                        value: (network?.ports || 0)
                    }
                ], [
                    {
                        label: 'Disk Type',
                        value: disk?.type || 'N/A'
                    },
                    {
                        label: 'Disk Size',
                        value: (disk?.size || 0) + 'GB'
                    },
                    {
                        label: 'Disk Read Bandwidth',
                        value: (disk?.readBandwidth || 0) + 'MB/s'
                    },
                    {
                        label: 'Disk Write Bandwidth',
                        value: (disk?.writeBandwidth || 0) + 'MB/s'
                    },
                ]].map((itemGroup, index) => {
                    return <div className="flex gap-2" key={index}>
                        {
                            itemGroup.map(({ label, value }, index) => {
                                return <div key={index} className="w-80">
                                    <span className=" text-secondary">{label}: </span>
                                    <span className=" text-main font-medium">{value}</span>
                                </div>
                            })
                        }
                    </div>
                })
            }
            {additionalInfo}
        </div>
    </div>
}

