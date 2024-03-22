import "dotenv/config.js";
import fs from "node:fs/promises";
import express from "express";
import {getEnv} from "./lib/env/env.js";
import {Logger} from "./lib/logger/logger.js";

// =====================================================================================================================
// Init Application
const templateHtml = process.env.NODE_ENV === "production" ? await fs.readFile("./dist/client/index.html", "utf-8") : "";
const ssrManifest = process.env.NODE_ENV === "production" ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8") : undefined;
const app = express();
// =====================================================================================================================

// =====================================================================================================================
// Vite SSR
let vite;
if (process.env.NODE_ENV !== "production") {
    const {createServer} = await import("vite");
    vite = await createServer({
        server: {middlewareMode: true},
        appType: "custom",
        base: "/",
    });
    app.use(vite.middlewares);
} else {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use("/", sirv("./dist/client", {extensions: []}));
}

// =====================================================================================================================

async function main() {
    // =================================================================================================================
    // Environment Variables
    const cfg = {
        PORT: getEnv("PORT"),
        NODE_ENV: getEnv("NODE_ENV"),
        MONGO_URI: getEnv("MONGO_URI"),
        MONGO_MAIN_DB: getEnv("MONGO_MAIN_DB"),
        API_URI: getEnv("API_URI"),
        ASSETS_URI: getEnv("ASSETS_URI"),
    }
    // =================================================================================================================

    // =================================================================================================================
    // Import necessary modules after project build
    let render;
    let getPublishedCatalog;
    if (cfg.NODE_ENV !== "production") {
        // Always read fresh template in development
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
        getPublishedCatalog = (await vite.ssrLoadModule("/src/server/pkg/mongo/getPublishedCatalog.ts")).getPublishedCatalog;
    } else {
        render = (await import("./dist/server/entry-server.js")).render;
        getPublishedCatalog = (await import("./dist/server/entry-server.js")).getPublishedCatalog;
    }
    // =================================================================================================================

    // =================================================================================================================\
    const logger = new Logger();
    // =================================================================================================================

    // =================================================================================================================
    // Middleware
    app.use(logger.logHttp);
    // =================================================================================================================

    // =================================================================================================================
    // Serve CSR Pages
    app.get("*", async (req, res) => {
        const startTime = Date.now();
        let url = new URL(req.protocol + "://" + req.headers.host + req.originalUrl);
        try {
            // ---------------------------------------------------------------------------------------------------------
            // Import necessary modules on request
            let template;
            if (cfg.NODE_ENV !== "production") {
                // Always read fresh template in development
                template = await fs.readFile("./index.html", "utf-8");
                template = await vite.transformIndexHtml(url.pathname, template);
            } else {
                template = templateHtml;
            }
            // ---------------------------------------------------------------------------------------------------------

            // ---------------------------------------------------------------------------------------------------------
            // Fetch data from database
            let catalog;
            let report;
            try {
                const data = await getPublishedCatalog({...cfg});
                catalog = data.publishedCatalog;
                report = data.report;
            } catch (e) {
                logger.error(url.toString(), e.message);
                catalog = null;
                report = null;
            }
            // ---------------------------------------------------------------------------------------------------------

            // ---------------------------------------------------------------------------------------------------------
            // Log request durations
            logger.logRequestDurations({
                url: url.toString(),
                publishedCatalogLatency: report?.publishedCatalogLatency ?? 0,
                totalDuration: Date.now() - startTime,
            });
            // ---------------------------------------------------------------------------------------------------------

            // ---------------------------------------------------------------------------------------------------------
            // Wrap response
            const result = {
                catalog: catalog,
                cfg: {
                    mode: cfg.NODE_ENV ?? "development",
                    apiUri: cfg.API_URI ?? "",
                    assetsUri: cfg.ASSETS_URI ?? "",
                },
            };
            const script = `<script>window.__data__ = ${JSON.stringify(result)}</script>`;
            const rendered = await render(result, url, ssrManifest);
            const html = template
                .replace(`<!--app-head-->`, rendered.head ?? "")
                .replace(`<!--app-html-->`, rendered.html ?? "")
                .replace(`<!--app-data-script-->`, script ?? "")
            // ---------------------------------------------------------------------------------------------------------

            // ---------------------------------------------------------------------------------------------------------
            // Send response
            res.status(200).set({"Cache-Control": "max-age=0", "Content-Type": "text/html"}).send(html);
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            logger.error(url.toString(), e.stack);
            res.status(500).redirect("/error");
        }
    });
    // =================================================================================================================

    // =================================================================================================================
    // Start http server
    app.listen(cfg.PORT, () => console.log(`Server listening on PORT: ${cfg.PORT}`));
    // =================================================================================================================
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
