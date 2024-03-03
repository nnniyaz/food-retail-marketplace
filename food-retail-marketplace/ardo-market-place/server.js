import "dotenv/config.js";
import fs from "node:fs/promises";
import express from "express";
import {getEnv} from "./lib/env/env.js";
import {Logger} from "./lib/logger/logger.js";
import {isEmpty} from "./lib/isEmpty/isEmpty.js";

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
    }
    // =================================================================================================================

    // =================================================================================================================
    // Импорт необходимых модулей после сборки проект
    let txts;
    let render;
    let connectToDatabase;
    if (cfg.NODE_ENV !== "production") {
        // Always read fresh template in development
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
        connectToDatabase = (await vite.ssrLoadModule("/src/server/pkg/mongo/connectMongo.ts")).connectToDatabase;
        txts = (await vite.ssrLoadModule("/src/server/pkg/core/txts.ts")).txts;
    } else {
        render = (await import("./dist/server/entry-server.js")).render;
        connectToDatabase = (await import("./dist/server/entry-server.js")).connectToDatabase;
        txts = (await import("./dist/server/entry-server.js")).txts;
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
        try {
            let url = new URL(req.protocol + "://" + req.headers.host + req.originalUrl);

            // ---------------------------------------------------------------------------------------------------------
            // Импорт необходимых модулей после сборки проект
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
            // Логгирование длительности запросов
            logger.logRequestDurations({
                publishedCatalogLatency: Date.now() - startTime,
                totalDuration: Date.now() - startTime,
            });
            // ---------------------------------------------------------------------------------------------------------

            // ---------------------------------------------------------------------------------------------------------
            // Wrap response
            const result = {

            };
            const script = `<script>window.__data__ = ${JSON.stringify(result)}</script>`;
            const rendered = await render(result, url.toString(), ssrManifest);
            const html = template
                .replace(`<!--app-head-->`, rendered.head ?? "")
                .replace(`<!--app-html-->`, rendered.html ?? "")
                .replace(`<!--app-data-script-->`, script ?? "");
            // ---------------------------------------------------------------------------------------------------------

            // ---------------------------------------------------------------------------------------------------------
            // Отправка ответа
            res.status(200).set({"Content-Type": "text/html"}).send(html);
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            logger.error(e.stack);
            res.status(500).redirect("/500");
        }
    });
    // =================================================================================================================

    // =================================================================================================================
    // 404
    app.get("/404", (req, res) => {
        const lang = req.acceptsLanguages(["ru", "kk", "en", "tr", "az", "zh", "ja", "ar", "uz", "id", "ky", "uk"]);
        let message;
        switch (lang) {
            case "ru":
                message = "Страница не найдена";
                break;
            case "kk":
                message = "Бет табылмады";
                break;
            case "en":
                message = "Page not found";
                break;
            case "tr":
                message = "Sayfa bulunamadı";
                break;
            case "az":
                message = "Səhifə tapılmadı";
                break;
            case "zh":
                message = "找不到页面";
                break;
            case "ja":
                message = "ページが見つかりません";
                break;
            case "ar":
                message = "الصفحة غير موجودة";
                break;
            case "uz":
                message = "Sahifa topilmadi";
                break;
            case "id":
                message = "Halaman tidak ditemukan";
                break;
            case "ky":
                message = "Барак табылган жок";
                break;
            case "uk":
                message = "Сторінка не знайдена";
                break;
            default:
                message = "Страница не найдена";
                break;
        }
        res.status(404).set({'Content-Type': 'text/html'}).render("templates/404", {
            message: message,
        });
    });
    // =================================================================================================================

    // =================================================================================================================
    // 500
    app.get("/500", (req, res) => {
        const lang = req.acceptsLanguages(["ru", "kk", "en", "tr", "az", "zh", "ja", "ar", "uz", "id", "ky", "uk"]);
        let message;
        switch (lang) {
            case "ru":
                message = "Возникла ошибка! Пожалуйста свяжитесь со службой поддержки";
                break;
            case "kk":
                message = "Қате орын алды! Қолдау қызметіне хабарласыңыз";
                break;
            case "en":
                message = "Error occurred! Please contact support";
                break;
            case "tr":
                message = "Bir hata oluştu! Lütfen teknik ekibi ile iletişim kurun";
                break;
            case "az":
                message = "Səhv baş verdi! Zəhmət olmasa dəstək xidməti ilə əlaqə saxlayın";
                break;
            case "zh":
                message = "發生錯誤! 請聯繫技術支持";
                break;
            case "ja":
                message = "エラーが発生しました！ サポートにお問い合わせください";
                break;
            case "ar":
                message = "Սխալ է տեղի ունեցել! Խնդրում ենք կապվել աջակցության հետ";
                break;
            case "uz":
                message = "Xatolik yuz berdi! Iltimos qo'llab-quvvatlash xizmatiga murojaat qiling";
                break;
            case "id":
                message = "Terjadi kesalahan! Silakan hubungi layanan bantuan";
                break;
            case "ky":
                message = "Ката чыкты! Колдоо кызматына кайрылыңыз";
                break;
            case "uk":
                message = "Виникла помилка! Будь ласка, зв'яжіться зі службою підтримки";
                break;
            default:
                message = "Возникла ошибка! Пожалуйста свяжитесь со службой поддержки";
                break;
        }
        res.status(500).set({'Content-Type': 'text/html'}).render("templates/500", {
            message: message,
        });
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
