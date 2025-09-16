import {BrowserRouter} from "react-router-dom";
import ReactDOM from "react-dom/client";
import {Main} from "./main.tsx";

let pageContext: any;

if (typeof window !== 'undefined') {
    // @ts-ignore
    pageContext = window.__data__;
}

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <BrowserRouter basename={"/"}>
        <Main {...pageContext}/>
    </BrowserRouter>
)
