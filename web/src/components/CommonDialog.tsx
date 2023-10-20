import { Box, Button, Divider, Modal, ModalDialog } from '@mui/joy';

export function CommonDialog({ title, children, open, setOpen, footer, onOK, onCancel }: {
    title: string;
    children: React.ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    footer?: React.ReactNode;
    onOK?: () => void;
    onCancel?: () => void;
}) {
    return <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
            variant="outlined"

        >
            <div className='pb-5 text-center w-full bg-accent font-semibold text-xl text-main'>
                {title}
            </div>
            <Divider />
            {children}
            {footer === undefined ? <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
                <Button variant="plain" color="neutral" onClick={() => {
                    setOpen(false);
                    onCancel?.();
                }}>
                    Cancel
                </Button>
                <Button variant="solid" color="primary" onClick={() => {
                    setOpen(false);
                    onOK?.();
                }}>
                    Confirm
                </Button>
            </Box> : footer}
        </ModalDialog>
    </Modal>;
}
