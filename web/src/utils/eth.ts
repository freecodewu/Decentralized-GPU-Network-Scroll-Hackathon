export const eth_accounts = (): Promise<string[]> => {
    return window.ethereum.request({ method: 'eth_accounts' })
}