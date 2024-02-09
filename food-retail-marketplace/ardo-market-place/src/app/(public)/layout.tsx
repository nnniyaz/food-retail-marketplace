import React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import {Footer} from "./_components/Footer";
import "./layout.scss"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Ardo Market Place",
    description: "Market ",
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <main className={"main"}>
            <div className={"container"}>
                {children}
                <Footer/>
            </div>
        </main>
        </body>
        </html>
    )
}
