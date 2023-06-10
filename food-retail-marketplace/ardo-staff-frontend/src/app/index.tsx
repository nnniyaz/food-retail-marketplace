import React from "react";
import {ReactNotifications} from "react-notifications-component"
import AppRouter from "../pages";
import "./index.scss";
import "react-notifications-component/dist/theme.css"
import 'animate.css';

export function App() {
    return (
        <React.Fragment>
            <ReactNotifications className={"notifications"}/>
            <AppRouter/>
        </React.Fragment>
    );
}

