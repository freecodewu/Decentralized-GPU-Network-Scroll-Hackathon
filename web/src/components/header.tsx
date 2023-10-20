'use client'

import IconLogo from '@/assets/icons/logo.svg'
import IconDiscord from '@/assets/icons/discord'
import IconMetamask from '@/assets/icons/metamask-icon.svg'
import React, { ReactNode, useContext, useState } from 'react'
import Link from 'next/link'
import SvgImage from './SvgImage'
import { web3Context } from '@/contexts/web3'
import Image from 'next/image'

const menuItems: {
    item: ReactNode,
    href: string,
}[] = [
        {
            item: 'Docs',
            href: '/docs',
        },
        {
            item: IconDiscord,
            href: 'https://discord.gg/9Wb2f5Z',
        },
    ]

export default function Header() {
    return <header className="flex justify-between bg-dark text-base text-inverse h-16 px-5">
        <div className='flex items-center mr-12'>
            <SvgImage src={IconLogo} alt="logo" />
            <h1 className='ml-3 text-2xl font-bold'>Apus Network</h1>
        </div>
        <ul className='nav-menu'>
            {menuItems.map(({ item, href }, index) =>
                <Link className='inline-flex' href={href} key={index}><li className='text-subtle-inverse hover:text-inverse cursor-pointer'>{item}</li></Link>
            )}
        </ul>
        <div>
            <UserMenu />
        </div>
    </header>
}

function UserMenu() {
    const {
        isLogin,
        isProvider,
        account,
        balance,
    } = useContext(web3Context)

    return <div className='h-full flex items-center'>
        {
            isLogin ? <div className='flex items-center'>
                <Image src={IconMetamask.src} width={32} height={32} alt="metamask-icon" />
                <div className='ml-3'>{account}</div>
                <div className="divider-verticle mx-3"></div>
                <div className='mr-10'>{balance.toString()}</div>
                {!isProvider ? <Link href="/console/host"><div className='btn-sign'>Host</div></Link> : null}
            </div> : <Link href="/console/signin">
                <div className='btn-sign'>Sign In</div></Link>
        }
    </div>
}