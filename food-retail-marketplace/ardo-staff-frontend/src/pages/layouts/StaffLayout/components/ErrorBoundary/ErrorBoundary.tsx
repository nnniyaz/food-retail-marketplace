import React from "react";
import {Link} from "react-router-dom";
import {RouteNames} from "@pages/index";
import {Translate} from "@features/Translate";
import classes from "@pages/staff/NotFound/NotFound.module.scss";

export class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        //@ts-ignore
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className={classes.main}>
                    <div className={classes.container}>
                        <div className={classes.title}>{`Page Not Found 404`}</div>
                        <a href={RouteNames.USERS} className={classes.btn}>Reload</a>
                    </div>
                </div>
            );
        }
        //@ts-ignore
        return this.props.children;
    }
}
