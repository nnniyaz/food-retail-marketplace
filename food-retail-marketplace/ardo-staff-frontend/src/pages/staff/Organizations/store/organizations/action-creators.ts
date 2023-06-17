import {Organization, OrganizationsGetRequest} from "entities/organization/organization";
import {AppDispatch, RootState} from "app/store";
import {FailedResponseHandler, httpHandler} from "shared/lib/http-handler/httpHandler";
import {
    SetOrganizationsAction,
    SetOrganizationsCountAction,
    SetIsLoadingGetOrganizationsAction,
    OrganizationsActionEnum
} from "./types";
import OrganizationsService from "../../api/organizationsService";

export const OrganizationActionCreators = {
    setOrganizations: (payload: Organization[]): SetOrganizationsAction => ({
        type: OrganizationsActionEnum.SET_ORGANIZATIONS,
        payload: payload
    }),
    setOrganizationsCount: (payload: number): SetOrganizationsCountAction => ({
        type: OrganizationsActionEnum.SET_ORGANIZATIONS_COUNT,
        payload: payload
    }),
    setIsLoadingGetOrganizations: (payload: boolean): SetIsLoadingGetOrganizationsAction => ({
        type: OrganizationsActionEnum.SET_IS_LOADING_GET_ORGANIZATIONS,
        payload: payload
    }),
    fetchOrganizations: (request: OrganizationsGetRequest, controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrganizationActionCreators.setIsLoadingGetOrganizations(true));
            const res = await OrganizationsService.getOrganizations(request, controller);
            if (res.data.success) {
                dispatch(OrganizationActionCreators.setOrganizations(res.data.data.organizations));
                dispatch(OrganizationActionCreators.setOrganizationsCount(res.data.data.organizationsCount));
            } else {
                FailedResponseHandler({
                    message: res.data?.message,
                    httpStatus: res.status,
                    currentLang: currentLang,
                });
            }
        } catch (e: any) {
            httpHandler({
                error: e,
                httpStatus: e?.response?.status,
                dispatch: dispatch,
                currentLang: currentLang,
            });
        } finally {
            dispatch(OrganizationActionCreators.setIsLoadingGetOrganizations(false));
        }
    },
}
