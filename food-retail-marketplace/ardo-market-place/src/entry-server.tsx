import ReactDOMServer from "react-dom/server"
import {StaticRouter} from "react-router-dom/server";
import {getPublishedCatalog as getPublishedCatalogImport} from "./server/pkg/mongo/getPublishedCatalog.ts";
import {Main} from "./main.tsx";

export const render = (pageContext: any) => {
    const html = ReactDOMServer.renderToString(
        <StaticRouter location={"/"}>
            <Main {...pageContext}/>
        </StaticRouter>
    )
    return {html};
}
export const getPublishedCatalog = getPublishedCatalogImport;
