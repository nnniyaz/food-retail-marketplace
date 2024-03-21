import React, {useEffect} from "react";
import * as ReactNotificationsImport from "react-notifications-component";
import {Routing} from "@pages/index.tsx";
import {useActions} from "@pkg/hooks/useActions.ts";
import {PublishedCatalog} from "@domain/catalog/catalog.ts";
import "react-notifications-component/dist/theme.css"
import "animate.css/animate.min.css"
import "@app/app.scss";

const {ReactNotifications} = ReactNotificationsImport;

interface EntryProps {
    catalog: PublishedCatalog;
    cfg: {
        mode: "development" | "production";
        assetsUri: string;
    }
}

export const App = (props: EntryProps) => {
    const {initCatalogState, initSystemState, initCartState} = useActions();

    function populateStoreWithData() {
        initCatalogState(props.catalog);
        initSystemState(props.cfg);
        initCartState({});
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
        <React.Fragment>
            <ReactNotifications isMobile={true} className={"notifications"}/>
            <Routing/>
        </React.Fragment>
    )
}
