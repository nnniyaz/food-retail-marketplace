import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './page.scss'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Ardo Market Place',
    description: 'Market ',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className={"main"}>
            {children}
        </div>
        </body>
        </html>
    )
}
