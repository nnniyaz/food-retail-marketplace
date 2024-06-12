import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {ReactNotifications} from "react-notifications-component";
import {notification} from "antd";
import AppRouter, {RouteNames} from "@pages//";
import {Loader} from "@shared/ui/Loader";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import "./index.scss";
import "react-notifications-component/dist/theme.css"
import 'animate.css';

export function App() {
    const navigate = useNavigate();
    const {isLoadingGetUser} = useTypedSelector(state => state.user);
    const {getCurrentUser} = useActions();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        getCurrentUser({navigate: navigate, to: RouteNames.LOGIN}, true);
    }, []);

    if (isLoadingGetUser) {
        return (
            <div className="window">
                <Loader/>
            </div>
        )
    }

    return (
        <React.Fragment>
            <ReactNotifications className={"notifications"}/>
            <AppRouter/>
        </React.Fragment>
    );
}

