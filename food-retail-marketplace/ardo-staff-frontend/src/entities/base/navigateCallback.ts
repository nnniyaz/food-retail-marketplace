import {NavigateFunction} from "react-router-dom";
import {RouteNames} from "pages";

export interface NavigateCallback {
    navigate: NavigateFunction;
    to?: RouteNames;
}
