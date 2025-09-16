import type {Metadata} from "next";
import type {Viewport} from "next";
import {Roboto} from "next/font/google";
import {headers} from "next/headers";
import NextTopLoader from 'nextjs-toploader';
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import "./layout.scss";
import {Langs} from "@/domain/mlString/mlString";

const roboto = Roboto({subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"]});

export const metadata: Metadata = {
    metadataBase: new URL("https://app.ardogroup.org/"),
    title: "Ardo: Products for Restaurants, Cafes and Hotels | Hong Kong",
    description: "ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices. Online food vendor company for restaurants, cafes and hotels in Hong Kong - HK.",
    publisher: "Ardo Group Ltd.",
    creator: "Ardo Group Ltd.",
    manifest: "/site.webmanifest",
    openGraph: {
        title: "Ardo: Products for Restaurants, Cafes and Hotels | Hong Kong",
        description: "ARDO is an AI-driven platform that helps F&B suppliers sell surplus at best prices. Online food vendor company for restaurants, cafes and hotels in Hong Kong - HK.",
        type: "website",
        url: "https://ardogroup.org/",
        images: [
            {
                url: "https://ardodev.fra1.digitaloceanspaces.com/logos/ardo-logo.jpeg",
                width: 897,
                height: 330,
                alt: "Ardo: Products for Restaurants, Cafes and Hotels | Hong Kong",
            },
        ],
        siteName: "Ardo: Products for Restaurants, Cafes and Hotels | Hong Kong",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const headersList = headers();
    const lang = () => {
        let langFromThePath = headersList.get("x-pathname")?.split("/")?.[2] as Langs;
        if (!(langFromThePath in Langs)) {
            langFromThePath = Langs.EN;
        }
        return langFromThePath.toLowerCase();
    };
    return (
        <html lang={lang()}>
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        </head>
        <body className={roboto.className} suppressHydrationWarning={true}>
        <main className={"main"}>
            <div className={"container"}>
                <NextTopLoader color={"#005FF9"}/>
                <Header/>
                {children}
                <Footer/>
            </div>
        </main>
        </body>
        </html>
    );
}
