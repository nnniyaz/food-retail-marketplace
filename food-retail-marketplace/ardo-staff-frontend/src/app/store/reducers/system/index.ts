import {SystemActionEnum, SystemState} from "./types";

const initialState: SystemState = {
    breadcrumbs: [],
}

export default function systemReducer(state = initialState, action: any): SystemState {
    switch (action.type) {
        case SystemActionEnum.SET_BREADCRUMBS:
            return {...state, breadcrumbs: action.payload};
        default:
            return state;
    }
}
