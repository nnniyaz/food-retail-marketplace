import {OrganizationsAction, OrganizationsActionEnum, OrganizationsState} from "./types";

const initialState: OrganizationsState = {
    organizations: [],
    organizationsCount: 0,
    isLoadingGetOrganizations: false,
}

export default function (state: OrganizationsState = initialState, action: OrganizationsAction): OrganizationsState {
    switch (action.type) {
        case OrganizationsActionEnum.SET_ORGANIZATIONS:
            return {...state, organizations: action.payload}
        case OrganizationsActionEnum.SET_ORGANIZATIONS_COUNT:
            return {...state, organizationsCount: action.payload}
        case OrganizationsActionEnum.SET_IS_LOADING_GET_ORGANIZATIONS:
            return {...state, isLoadingGetOrganizations: action.payload}
        default:
            return state;
    }
}
