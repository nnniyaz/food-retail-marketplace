import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {composeWithDevTools} from '@redux-devtools/extension';
import reducers from "./reducers";

const rootReducer = combineReducers(reducers);

const middlewares: any = [];

if (!import.meta.env.SSR && typeof window !== `undefined`) {
    middlewares.push(thunk);
}

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
