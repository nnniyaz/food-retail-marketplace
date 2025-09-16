import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import {ProductsList} from "@widgets/ProductsList";
import {ReturnButton} from "@widgets/ReturnButton";
import {translate} from "@pkg/translate/translate";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

export const List = () => {
    const navigate = useNavigate();
    const {sectionId} = useParams();
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);

    useEffect(() => {
        if (!catalog.sections[sectionId]) {
            navigate(RouteNames.CATALOG);
        }
    }, [catalog, sectionId]);

    return (
        <React.Fragment>
            <ReturnButton
                to={RouteNames.CATALOG} title={translate(catalog.sections[sectionId]?.name, currentLang, langs)}
            />
            <ProductsList sectionId={sectionId}/>
        </React.Fragment>
    );
}
