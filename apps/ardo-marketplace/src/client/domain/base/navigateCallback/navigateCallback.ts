import {NavigateFunction} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";

export type NavigateCallback = {
    navigate: NavigateFunction,
    path: RouteNames
}
