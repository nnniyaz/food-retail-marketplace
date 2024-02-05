import React from "react";
import {Header} from "@/app/(public)/_components/Header/Header";
import {Carousel} from "@/app/(public)/_components/Slider";
import {Products} from "@/app/(public)/_components/Products";

export default function Home() {
    return (
        <React.Fragment>
            <Header/>
            <Carousel/>
            <Products/>
        </React.Fragment>
    )
}
