import {IRoute} from "@pages//";

export interface SystemState {
    breadcrumbs: IRoute[];
}

export enum SystemActionEnum {
    SET_BREADCRUMBS = 'SET_BREADCRUMBS',
}

export interface SetBreadcrumbsAction {
    type: SystemActionEnum.SET_BREADCRUMBS;
    payload: IRoute[];
}

export type SystemAction = SetBreadcrumbsAction;
