import {IRoute} from "pages";
import {SystemActionEnum, SetBreadcrumbsAction} from "./types";

export const SystemActionCreators = {
    setBreadcrumbs: (payload: IRoute[]): SetBreadcrumbsAction => ({
        type: SystemActionEnum.SET_BREADCRUMBS,
        payload
    }),
}
