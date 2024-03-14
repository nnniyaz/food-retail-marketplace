import {AppDispatch, RootState} from "@app/store";
import {AddSectionReq, EditSectionReq, SectionService} from "@pages/staff/Sections/api/sectionService";
import {Section} from "@entities/section/section";
import {Paginate} from "@entities/base/paginate";
import {NavigateCallback} from "@entities/base/navigateCallback";
import {FailedResponseHandler, httpHandler} from "@shared/lib/http-handler/httpHandler";
import {
    SectionActionEnum,
    SetSectionsAction,
    SetSectionByIdAction,
    SetSectionsCountAction,
    SetIsLoadingGetSectionsAction,
    SetIsLoadingAddSectionAction,
    SetIsLoadingGetSectionByIdAction,
    SetIsLoadingEditSectionAction,
    SetIsLoadingDeleteSectionAction,
    SetIsLoadingRecoverSectionAction
} from "./types";
import {txt} from "@shared/core/i18ngen";
import {Notify} from "@shared/lib/notification/notification";

export const SectionActionCreators = {
    setSections: (payload: Section[]): SetSectionsAction => ({
        type: SectionActionEnum.SET_SECTIONS,
        payload
    }),
    setSectionById: (payload: Section): SetSectionByIdAction => ({
        type: SectionActionEnum.SET_SECTION_BY_ID,
        payload
    }),
    setSectionsCount: (payload: number): SetSectionsCountAction => ({
        type: SectionActionEnum.SET_SECTIONS_COUNT,
        payload
    }),
    setIsLoadingGetSections: (payload: boolean): SetIsLoadingGetSectionsAction => ({
        type: SectionActionEnum.SET_IS_LOADING_GET_SECTIONS,
        payload
    }),
    setIsLoadingAddSection: (payload: boolean): SetIsLoadingAddSectionAction => ({
        type: SectionActionEnum.SET_IS_LOADING_ADD_SECTION,
        payload
    }),
    setIsLoadingGetSectionById: (payload: boolean): SetIsLoadingGetSectionByIdAction => ({
        type: SectionActionEnum.SET_IS_LOADING_GET_SECTION_BY_ID,
        payload
    }),
    setIsLoadingEditSection: (payload: boolean): SetIsLoadingEditSectionAction => ({
        type: SectionActionEnum.SET_IS_LOADING_EDIT_SECTION,
        payload
    }),
    setIsLoadingDeleteSection: (payload: boolean): SetIsLoadingDeleteSectionAction => ({
        type: SectionActionEnum.SET_IS_LOADING_DELETE_SECTION,
        payload
    }),
    setIsLoadingRecoverSection: (payload: boolean): SetIsLoadingRecoverSectionAction => ({
        type: SectionActionEnum.SET_IS_LOADING_RECOVER_SECTION,
        payload
    }),

    fetchSections: (request: Paginate, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SectionActionCreators.setIsLoadingGetSections(true));
            const res = await SectionService.getSections(request, controller);
            if (res.data.success) {
                dispatch(SectionActionCreators.setSections(res.data.data.sections));
                dispatch(SectionActionCreators.setSectionsCount(res.data.data.count));
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SectionActionCreators.setIsLoadingGetSections(false));
        }
    },

    getSectionById: (id: UUID, controller: AbortController, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SectionActionCreators.setIsLoadingGetSectionById(true));
            const res = await SectionService.getSectionById(id, controller);
            if (res.data.success) {
                dispatch(SectionActionCreators.setSectionById(res.data.data));
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SectionActionCreators.setIsLoadingGetSectionById(false));
        }
    },

    addSection: (request: AddSectionReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SectionActionCreators.setIsLoadingAddSection(true));
            const res = await SectionService.addSection(request);
            if (res.data.success) {
                Notify.Success({title: txt.section_successfully_added[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SectionActionCreators.setIsLoadingAddSection(false));
        }
    },

    editSection: (sectionId: string, request: EditSectionReq, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SectionActionCreators.setIsLoadingEditSection(true));
            const res = await SectionService.editSection(sectionId, request);
            if (res.data.success) {
                Notify.Success({title: txt.section_successfully_edited[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SectionActionCreators.setIsLoadingEditSection(false));
        }
    },

    recoverSection: (id: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SectionActionCreators.setIsLoadingRecoverSection(true));
            const res = await SectionService.recoverSection(id);
            if (res.data.success) {
                Notify.Success({title: txt.section_successfully_recovered[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SectionActionCreators.setIsLoadingRecoverSection(false));
        }
    },

    deleteSection: (id: UUID, navigationCallback: NavigateCallback) => async (dispatch: AppDispatch, getState: () => RootState) => {
        const {currentLang} = getState().lang;
        try {
            dispatch(SectionActionCreators.setIsLoadingDeleteSection(true));
            const res = await SectionService.deleteSection(id);
            if (res.data.success) {
                Notify.Success({title: txt.section_successfully_deleted[currentLang], message: ""});
                if (navigationCallback?.navigate && navigationCallback?.to) {
                    navigationCallback?.navigate(navigationCallback?.to);
                }
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
                navigateCallback: navigationCallback,
            });
        } finally {
            dispatch(SectionActionCreators.setIsLoadingDeleteSection(false));
        }
    }
}
