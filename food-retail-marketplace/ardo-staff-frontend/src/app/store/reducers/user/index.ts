import {User} from "entities/user/user";
import {UserAction, UserActionEnum, UserState} from "./types";

const initialState: UserState = {
    user: {
        id: "4d4520a6-1333-4d4d-8354-f173aaf512a2",
        firstName: "Niyaz",
        lastName: "Nassyrov",
        email: "nassyrovich@gmail.com",
        userType: "STAFF",
        isDeleted: false,
        createdAt: "2023-06-10T19:21:35.360Z",
        updatedAt: "2023-06-10T19:21:35.360Z",
    } as User,
    isLoadingGetUser: false,
}

export default function userReducer(state = initialState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionEnum.SET_USER:
            return {...state, user: action.payload}
        case UserActionEnum.SET_IS_LOADING_GET_USER:
            return {...state, isLoadingGetUser: action.payload}
        default:
            return state;
    }
}
