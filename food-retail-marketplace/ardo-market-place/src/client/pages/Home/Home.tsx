import React from "react";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {Header} from "./components/Header/Header.tsx";
import {ProductsList} from "@widgets/ProductsList";
import {Carousel} from "./components/Carousel/Carousel.tsx";

export const Home = () => {
    const {catalog} = useTypedSelector(state => state.catalogState);
    if (catalog === null) {
        return null;
    }
    return (
        <React.Fragment>
            <Header/>
            <Carousel/>
            {catalog.promo.map((promoSection) => (
                <ProductsList
                    key={promoSection.sectionId}
                    sectionId={promoSection.sectionId}
                    withCategoryBar={false}
                />
            ))}
        </React.Fragment>
    );
}
