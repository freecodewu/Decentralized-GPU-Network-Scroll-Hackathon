'use client'

import Header from '@/components/header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main><Header />{children}</main>
  )
}
