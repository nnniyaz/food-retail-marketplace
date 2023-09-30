import {isEmpty} from "lodash";
import {AppDispatch} from "app/store";
import {UserActionCreators} from "app/store/reducers/user/action-creators";
import {RouteNames} from "pages";
import {LangsList} from "entities/base/MlString";
import {NavigateCallback} from "entities/base/navigateCallback";
import {txt} from "../../core/i18ngen";
import {Notify} from "../notification/notification";

interface HttpHandlerProps {
    error: any;
    httpStatus: number;
    dispatch: AppDispatch;
    currentLang: LangsList;
    navigateCallback?: NavigateCallback;
    hideNotify?: boolean;
}

export const httpHandler = (
    {
        error,
        httpStatus,
        dispatch,
        currentLang,
        navigateCallback,
        hideNotify
    }: HttpHandlerProps
) => {
    if (httpStatus === 401) {
        dispatch(UserActionCreators.setAuth(false));
        if (!hideNotify) {
            Notify.Warning({title: txt.authorization[currentLang], message: txt.session_expired[currentLang]});
        }
        navigateCallback?.navigate(RouteNames.LOGIN);
    } else if (httpStatus === 403) {
        if (!hideNotify) {
            Notify.Warning({
                title: txt.internal_system[currentLang],
                message: txt.you_dont_have_access[currentLang]
            });
        }
    } else if (httpStatus === 404) {
        if (!hideNotify) {
            Notify.Warning({title: txt.page_not_found[currentLang], message: ""});
        }
    } else if (httpStatus >= 400 && httpStatus < 500) {
        return;
    } else if (error?.code === "ERR_CANCELED") {
        return;
    } else {
        if (!hideNotify) {
            Notify.Error({
                title: txt.critical_error[currentLang],
                message: txt.please_try_again_or_contact_support[currentLang]
            });
        }
        console.log(error)
    }
}

interface FailedResponseHandlerProps {
    messages: string[];
    httpStatus: number;
    hideNotify?: boolean;
}

export const FailedResponseHandler = ({messages, httpStatus, hideNotify}: FailedResponseHandlerProps) => {
    if (hideNotify) {
        return;
    }
    if (httpStatus >= 400 && httpStatus < 500 && !isEmpty(messages)) {
        messages.forEach((msg) => {
            Notify.Warning({title: msg, message: ""});
        });
    }
}
