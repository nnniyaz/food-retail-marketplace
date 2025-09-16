import {NavigateFunction} from "react-router-dom";
import {RouteNames} from "@pages/index";

// This function is used to navigate back to the previous page in the same domain, otherwise goes to fallbackRoute.
export const back = (fallbackRoute: RouteNames, navigate: NavigateFunction) => {
    if (document.referrer) {
        const url = new URL(document.referrer);
        if (url.host === window.location.host) {
            navigate(-1);
            return;
        }
    }
    navigate(fallbackRoute);
}
