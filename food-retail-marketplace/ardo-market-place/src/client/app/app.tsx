import React, {useEffect, useState} from "react";
import * as ReactNotificationsImport from "react-notifications-component";
import * as AntdIcons from "@ant-design/icons";
import {Routing} from "@pages/index.tsx";
import {useActions} from "@pkg/hooks/useActions.ts";
import {Cfg} from "@domain/base/cfg/cfg.ts";
import {PublishedCatalog} from "@domain/catalog/catalog.ts";
import "react-notifications-component/dist/theme.css"
import "animate.css/animate.min.css"
import "@app/app.scss";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";

const {ReactNotifications} = ReactNotificationsImport;
const {LoadingOutlined} = AntdIcons;

interface EntryProps {
    catalog: PublishedCatalog;
    cfg: Cfg
}

export const App = (props: EntryProps) => {
    const {isLoadingGetUser} = useTypedSelector(state => state.userState);
    const {initCatalogState, initSystemState, initCartState, fetchUser} = useActions();
    const [isPopulated, setIsPopulated] = useState<boolean>(false);

    function populateStoreWithData() {
        initCatalogState(props.catalog);
        initSystemState(props.cfg);
        initCartState({});
        fetchUser(true);
        setIsPopulated(true);
    }

    useEffect(() => {
        if (props.catalog !== null) {
            populateStoreWithData();
        }
    }, []);

    if (props.catalog === null || !isPopulated) {
        return null;
    }

    if (isLoadingGetUser) {
        return (
            <div style={{
                width: "100%",
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <LoadingOutlined/>
            </div>
        )
    }

    return (
        <React.Fragment>
            <ReactNotifications isMobile={true} className={"notifications"}/>
            <Routing/>
        </React.Fragment>
    )
}
