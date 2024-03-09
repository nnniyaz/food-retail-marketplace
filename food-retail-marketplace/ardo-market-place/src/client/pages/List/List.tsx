import React from "react";
import {useParams} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import {ProductsList} from "@widgets/ProductsList";
import {ReturnButton} from "@widgets/ReturnButton";
import {translate} from "@pkg/translate/translate.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

export const List = () => {
    const {sectionId} = useParams();
    const {catalog} = useTypedSelector(state => state.catalogState);
    return (
        <React.Fragment>
            <ReturnButton to={RouteNames.CATALOG} title={translate(catalog.sections[sectionId].name)}/>
            <ProductsList sectionId={sectionId}/>
        </React.Fragment>
    );
}
