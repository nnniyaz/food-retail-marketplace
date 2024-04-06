import type {Metadata} from "next";
import {Inter, Roboto} from "next/font/google";
import "./layout.scss";

const roboto = Roboto({subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"]});

export const metadata: Metadata = {
    metadataBase: new URL("https://app.ardogroup.org/"),
    title: "Ardo Group Ltd.",
    description: "ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices",
    publisher: "Ardo Group Ltd.",
    creator: "Ardo Group Ltd.",
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Ardo Group Ltd. - From waste to value",
        description: "ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices. Online food vendor company for restaurants, cafes and hotels in Hong Kong - HK.",
        type: "website",
        url: "https://app.ardogroup.org/",
        images: [
            {
                url: "https://ardodev.fra1.digitaloceanspaces.com/logos/ardo-logo.jpeg",
                width: 897,
                height: 330,
                alt: "Ardo Group Ltd.",
            },
        ],
        siteName: "ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices. Online food vendor company for restaurants, cafes and hotels in Hong Kong - HK.",
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        </head>
        <body className={roboto.className}>{children}</body>
        </html>
    );
}
