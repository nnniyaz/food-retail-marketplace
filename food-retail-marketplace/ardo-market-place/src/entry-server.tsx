import ReactDOMServer from "react-dom/server"
import {StaticRouter} from "react-router-dom/server";
import {txts as txtsMap} from "./server/pkg/core/txts.ts";
import {connectToDatabase as connectToDatabaseImport} from "./server/pkg/mongo/connectMongo.ts";
import {Main} from "./main.tsx";

export const render = (pageContext: any) => {
    const html = ReactDOMServer.renderToString(
        <StaticRouter location={pageContext.pathname}>
            <Main {...pageContext}/>
        </StaticRouter>
    )
    return {html};
}
export const txts = txtsMap;
export const connectToDatabase = connectToDatabaseImport;
