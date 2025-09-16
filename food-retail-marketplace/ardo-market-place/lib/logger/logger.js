import { formattedDate } from '../date/format.js';

export class Logger {
    constructor() {
    }

    error(url, log) {
        process.stderr.write(`${formattedDate(new Date())} [${url}] ${log}\n`);
    }

    logRequestDurations({ url, publishedCatalogLatency, totalDuration }) {
        const formattedCurrentDate = formattedDate(new Date());
        process.stdout.write(`${formattedCurrentDate} [${url}] published-catalog-latency - ${publishedCatalogLatency}ms\n`);
        process.stdout.write(`${formattedCurrentDate} [${url}] total duration - ${totalDuration}ms\n`);
    }

    logHttp(req, res, next) {
        const url = req.protocol + "://" + req.headers.host + req.originalUrl;
        const start = Date.now();
        const formattedCurrentDate = formattedDate(new Date());

        const { method, ip } = req;
        const { statusCode } = res;

        const oldWrite = res.write;
        const oldEnd = res.end;

        const chunks = [];

        res.write = (...restArgs) => {
            chunks.push(Buffer.from(restArgs[0]));
            oldWrite.apply(res, restArgs);
        };

        res.end = (...restArgs) => {
            if (restArgs[0]) {
                chunks.push(Buffer.from(restArgs[0]));
            }
            process.stdout.write(`${formattedCurrentDate} [${url}] ${method} ${statusCode} from ${ip} - ${Buffer.byteLength(Buffer.concat(chunks).toString('utf8'), 'utf8')}B in ${Date.now() - start}ms\n`);
            oldEnd.apply(res, restArgs);
        };
        next();
    }
}
