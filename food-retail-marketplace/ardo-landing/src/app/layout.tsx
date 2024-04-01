import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.scss";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Ardo Group Ltd.",
    description: "ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices",
    publisher: "Ardo Group Ltd.",
    creator: "Ardo Group Ltd.",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <head>
            <meta property="og:title"
                  content="Ardo Group Ltd. - From waste to value"/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://app.ardogroup.org/"/>
            <meta property="og:description"
                  content="ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices. Online food vendor company for restaurants, cafes and hotels in Hong Kong - HK."/>
            <meta property="og:image" content="https://ardodev.fra1.digitaloceanspaces.com/logos/ardo-logo.jpeg"/>
            <meta property="og:image:alt" content="Ardo Group Ltd."/>
            <meta property="og:image:width" content="897"/>
            <meta property="og:image:height" content="330"/>
            <meta property="og:site_name"
                  content="ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices. Online food vendor company for restaurants, cafes and hotels in Hong Kong - HK."/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <title>Ardo Group Ltd.</title>
        </head>
        <body className={inter.className}>{children}</body>
        </html>
    );
}
