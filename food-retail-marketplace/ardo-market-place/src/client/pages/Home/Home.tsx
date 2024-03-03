import React from "react";
import {Header} from "./components/Header/Header.tsx";
import {Products} from "./components/Products/Products.tsx";
import {Carousel} from "./components/Carousel/Carousel.tsx";

export const Home = () => {
    return (
        <React.Fragment>
            <Header/>
            <Carousel/>
            <Products/>
        </React.Fragment>
    );
}
