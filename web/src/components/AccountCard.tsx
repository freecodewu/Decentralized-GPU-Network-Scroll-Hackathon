import { CopyAll } from "@mui/icons-material"
import { toast } from "sonner"
import cns from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function CopyableText({ account, className }: { account: string; className?: string }) {
    return <div className={cns("flex justify-between items-center bg-light text-primary px-4 py-2 h-10 rounded-5 leading-none", className)}>
        <span>{account}</span>
        <span className="inline-flex ml-2 cursor-pointer">
            <CopyToClipboard text={account} onCopy={() => {
                toast.success('Copied Successfully')
            }}>
                <CopyAll width={20} height={20} color="primary" />
            </CopyToClipboard>
        </span>
    </div>
}
