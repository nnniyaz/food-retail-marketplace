import {Organization} from "entities/organization/organization";

export type OrganizationsState = {
    organizations: Organization[];
    organizationsCount: number;
    isLoadingGetOrganizations: boolean;
    isLoadingAddOrganization: boolean;
}

export enum OrganizationsActionEnum {
    SET_ORGANIZATIONS = "SET_ORGANIZATIONS",
    SET_ORGANIZATIONS_COUNT = "SET_ORGANIZATIONS_COUNT",
    SET_IS_LOADING_GET_ORGANIZATIONS = "SET_IS_LOADING_GET_ORGANIZATIONS",
    SET_IS_LOADING_ADD_ORGANIZATION = "SET_IS_LOADING_ADD_ORGANIZATION",
}

export interface SetOrganizationsAction {
    type: OrganizationsActionEnum.SET_ORGANIZATIONS;
    payload: Organization[];
}

export interface SetOrganizationsCountAction {
    type: OrganizationsActionEnum.SET_ORGANIZATIONS_COUNT;
    payload: number;
}

export interface SetIsLoadingGetOrganizationsAction {
    type: OrganizationsActionEnum.SET_IS_LOADING_GET_ORGANIZATIONS;
    payload: boolean;
}

export interface SetIsLoadingAddOrganizationAction {
    type: OrganizationsActionEnum.SET_IS_LOADING_ADD_ORGANIZATION;
    payload: boolean;
}

export type OrganizationsAction =
    SetOrganizationsAction |
    SetOrganizationsCountAction |
    SetIsLoadingGetOrganizationsAction |
    SetIsLoadingAddOrganizationAction;
