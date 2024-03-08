import React from "react";
import {useParams} from "react-router-dom";
import {ProductsList} from "@widgets/ProductsList";

export const List = () => {
    const {sectionId} = useParams();
    return (
        <React.Fragment>
            <ProductsList sectionId={sectionId} withCategoryBar={true}/>
        </React.Fragment>
    );
}
