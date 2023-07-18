import {isEmpty} from "lodash";
import {AppDispatch} from "app/store";
import {UserActionCreators} from "app/store/reducers/user/action-creators";
import {RouteNames} from "pages";
import {NavigateCallback} from "entities/base/navigateCallback";
import {LangsList, MlString} from "entities/base/MlString";
import {txt} from "../../core/i18ngen";
import {Notify} from "../notification/notification";

interface HttpHandlerProps {
    error: any;
    httpStatus: number;
    dispatch: AppDispatch;
    currentLang: LangsList;
    navigateCallback?: NavigateCallback;
}

export const httpHandler = ({error, httpStatus, dispatch, currentLang, navigateCallback}: HttpHandlerProps) => {
    if (httpStatus === 401) {
        dispatch(UserActionCreators.setAuth(false));
        Notify.Warning({title: txt.authorization[currentLang], message: txt.session_expired[currentLang]});
        navigateCallback?.navigate(RouteNames.LOGIN);
    } else if (httpStatus === 403) {
        Notify.Warning({
            title: txt.internal_system[currentLang],
            message: txt.you_dont_have_access[currentLang]
        });
        navigateCallback?.navigate(-1);
    } else if (httpStatus === 404) {
        Notify.Warning({title: txt.page_not_found[currentLang], message: ""});
        navigateCallback?.navigate(-1);
    } else if (httpStatus >= 400 && httpStatus < 500) {
        return;
    } else {
        Notify.Error({
            title: txt.critical_error[currentLang],
            message: txt.please_try_again_or_contact_support[currentLang]
        });
        navigateCallback?.navigate(-1);
        console.log(error)
    }
}

interface FailedResponseHandlerProps {
    message: MlString;
    httpStatus: number;
    currentLang: LangsList;
}

export const FailedResponseHandler = ({message, httpStatus, currentLang}: FailedResponseHandlerProps) => {
    if (httpStatus >= 400 && httpStatus < 500 && !isEmpty(message)) {
        Notify.Warning({title: message[currentLang], message: ""});
    }
}
