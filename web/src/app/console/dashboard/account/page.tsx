'use client'

import AccountCard from "@/components/AccountCard";
import { useStake, useUnStake } from "@/constant/contract";
import { web3Context } from "@/contexts/web3";
import { Button } from "@mui/joy";
import { Form, Input, InputNumber, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { useContext, useState } from "react";
import { toast } from "sonner";
import Web3 from "web3";

export default function AccountPage() {
    const {
        account,
        balance,
        accountInfo,
        isProvider,
        refreshAccount,
        accountContract,
        refreshAccountInfo,
    } = useContext(web3Context)
    const {
        stake,
        isStaking,
    } = useStake(accountContract)
    const {
        unstake,
        isUnStaking,
    } = useUnStake(accountContract)

    const balanceList = [
        {
            label: 'Contract Balance',
            value: accountInfo.balance
        },
        {
            label: 'Tenant Stake Funds',
            value: accountInfo.recipient_blocked_funds
        },
    ]
    if (isProvider) {
        balanceList.push(
            {
                label: 'Provider Stake Funds',
                value: accountInfo.provider_blocked_funds
            },)
    }

    const [topUpDialogOpen, setTopUpDialogOpen] = useState(false)
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
    const [form] = useForm()

    const topUp = async () => {
        const { amount } = await form.validateFields()
        try {
            await stake(account, amount)
            setTopUpDialogOpen(false)
            refreshAccount()
            refreshAccountInfo()
            form.resetFields()
            toast.success('Top up success')
        } catch (error) {
            console.log(error)
            toast.error('Top up failed')
        }
    }

    const withdraw = async () => {
        const { amount } = await form.validateFields()
        try {
            await unstake(account, amount)
            setWithdrawDialogOpen(false)
            form.resetFields()
            refreshAccount()
            refreshAccountInfo()
            toast.success('Withdraw success')
        } catch (error) {
            console.log(error)
            toast.error('Withdraw failed')
        }
    }

    return <section className="pt-16 flex flex-col items-center">
        <AccountCard account={account} className="mb-6" />
        <div className="flex fle-col items-center mb-14">
            <span className="text-4xl text-main font-semibold">
                <span>{balance}</span>
                <span className="text-2xl font-medium"> ETH</span>
            </span>
        </div>
        <div className="flex gap-14">
            {balanceList.map(({ label, value }) => {
                return <div className="flex flex-col items-center gap-1" key={label}>
                    <span className="text-sm text-main">{label}</span>
                    <span className="text-base text-secondary">{value} ETH</span>
                </div>
            })}
        </div>
        <div className="flex gap-8 mt-20">
            <Button color="primary" variant="outlined" onClick={() => {
                setTopUpDialogOpen(true)
            }}>Top UP</Button>
            <Button color="primary" onClick={() => {
                setWithdrawDialogOpen(true)
            }}>Withdraw</Button>
        </div>
        <Modal title="Top Up" open={topUpDialogOpen} confirmLoading={isStaking} onOk={topUp} onCancel={() => {
            setTopUpDialogOpen(false)
        }
        }>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Form form={form} layout="vertical">
                        <Form.Item label="top up amount" required name="amount">
                            <InputNumber min="0" max={balance} step="0.00000000000001" placeholder="0.0" rootClassName="w-full" />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
        <Modal title="Withdraw" open={withdrawDialogOpen} confirmLoading={isUnStaking} onOk={withdraw} onCancel={() => {
            setWithdrawDialogOpen(false)
        }
        }>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="text-main font-semibold text-lg">Withdraw Amount</div>
                    <Form form={form} layout="vertical">
                        <Form.Item label="withdraw amount" required name="amount" rules={[{
                            required: true,
                            message: 'Please input withdraw amount'
                        }]}>
                            <InputNumber min="0" max={accountInfo.balance} step="0.00000000000001" placeholder="0.0" rootClassName="w-full" />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
    </section>
}