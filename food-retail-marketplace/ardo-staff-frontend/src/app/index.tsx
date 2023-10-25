import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import AppRouter, {RouteNames} from "@pages//";
import {useActions} from "@shared/lib/hooks/useActions";
import {ReactNotifications} from "react-notifications-component"
import "./index.scss";
import "react-notifications-component/dist/theme.css"
import 'animate.css';

export function App() {
    const navigate = useNavigate();
    const {getCurrentUser} = useActions();

    useEffect(() => {
        getCurrentUser({navigate: navigate, to: RouteNames.LOGIN}, true);
    }, []);

    return (
        <React.Fragment>
            <ReactNotifications className={"notifications"}/>
            <AppRouter/>
        </React.Fragment>
    );
}

