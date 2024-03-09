import React from "react";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {Search} from "./components/Search";
import {Sections} from "./components/Sections";

export const Catalog = () => {
    const {catalog} = useTypedSelector(state => state.catalogState);
    return (
        <React.Fragment>
            <Search/>
            <Sections catalog={catalog}/>
        </React.Fragment>
    );
}
