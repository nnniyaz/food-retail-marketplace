import {useEffect} from "react";
import {Routing} from "@pages/index.tsx";
import {useActions} from "@pkg/hooks/useActions.ts";
import {PublishedCatalog} from "@domain/catalog/catalog.ts";
import "@app/app.scss";

interface EntryProps {
    catalog: PublishedCatalog;
    cfg: {
        mode: "development" | "production";
        assetsUri: string;
    }
}

export const App = (props: EntryProps) => {
    const {initCatalogState, initSystemState} = useActions();

    function populateStoreWithData() {
        initCatalogState(props.catalog);
        initSystemState(props.cfg);
    }

    useEffect(() => {
        if (props.catalog !== null) {
            populateStoreWithData();
        }
    }, []);

    if (props.catalog === null) {
        return null;
    }
    return (
        <Routing/>
    )
}
