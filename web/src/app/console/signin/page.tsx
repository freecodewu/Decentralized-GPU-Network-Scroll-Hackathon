'use client'

import IconMetamask from '@/assets/icons/metamask-icon.svg'
import { web3Context } from '@/contexts/web3'
import { Button, Checkbox, Link } from '@mui/joy'
import Image from 'next/image'
import { useContext, useState } from 'react'

export default function SignInPage() {
    const [isAgreementChecked, setIsAgreementChecked] = useState(false)
    const { hasMetamask, connectMetamask, isConnecting, isScroll, switchScroll } = useContext(web3Context)
    const isBtnDisabled = !isAgreementChecked || !hasMetamask

    return <div className='flex flex-col items-center pt-36'>
        <Image src={IconMetamask.src} width={180} height={180} alt="metamask-icon" />
        <Button className='mt-5 mb-3 btn-primary h-14 rounded-7 text-base px-9 leading-14' disabled={isBtnDisabled} loading={isConnecting} onClick={() => {
            isScroll ? connectMetamask() : switchScroll()
        }}>{isScroll ? 'Sign in with metamask' : 'Switch to Scroll'}</Button>
        {
            hasMetamask ? <div className='flex items-center'>
                <Checkbox checked={isAgreementChecked} onChange={e => {
                    setIsAgreementChecked(e.target.checked)
                }} />
                <div className="ml-3 text-secondary">accept <Link href="/legal/aggrement">Aggrement</Link> and <Link href="/legal/privacy-policy">Privacy Policy</Link></div>
            </div> : <>
                <div className='text-secondary'>Hello, since your browser does not have metamask installed, please click here to install it.</div>
                <Link href="https://metamask.io/download/" target="_blank">Download</Link>
            </>
        }
    </div>
}