import {Paginate} from "entities/base/paginate";
import {Organization} from "entities/organization/organization";
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
    fetchOrganizations: (request: Paginate, controller: AbortController) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(OrganizationActionCreators.setIsLoadingGetOrganizations(true));
            const res = await OrganizationsService.getOrganizations(request, controller);
            if (res.data.success) {
                dispatch(OrganizationActionCreators.setOrganizations(res.data.data.orgs));
                dispatch(OrganizationActionCreators.setOrganizationsCount(res.data.data.count));
            } else {
                FailedResponseHandler({
                    messages: res.data?.messages,
                    httpStatus: res.status,
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
