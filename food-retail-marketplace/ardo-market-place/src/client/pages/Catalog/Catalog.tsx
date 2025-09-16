import React from "react";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {Search} from "./components/Search";
import {Sections} from "./components/Sections";
import SearchedProductsList from "@pages/Catalog/components/SearchedProductsList/SearchedProductsList.tsx";

export const Catalog = () => {
    const {search} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);
    return (
        <React.Fragment>
            <Search/>
            {
                !!search
                    ? <SearchedProductsList search={search}/>
                    : <Sections catalog={catalog}/>
            }
        </React.Fragment>
    );
}
