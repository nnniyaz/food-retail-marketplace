import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {composeWithDevTools} from '@redux-devtools/extension';
// import logger from 'redux-logger'
import reducers from "./reducers";

const rootReducer = combineReducers(reducers);

// @ts-ignore
const middlewares: any = [!import.meta.env.SSR ? thunk : thunk.default];

if (process.env.NODE_ENV === `development` && typeof window !== `undefined`) {
    // const logger = reduxLogger.createLogger({
    //     collapsed: true
    // });
    // middlewares.push(logger);
}

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
