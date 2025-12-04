import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'RenderFlux Dashboard',
    description: 'High-Performance PDF Generation',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
