import { formattedDate } from '../date/format.js';

export class Logger {
    url;

    constructor() {
        this.url = '';
    }

    error(log) {
        process.stderr.write(`${formattedDate(new Date())} [${this.url}] ${log}\n`);
    }

    logRequestDurations({ publishedCatalogLatency, totalDuration }) {
        const formattedCurrentDate = formattedDate(new Date());
        process.stdout.write(`${formattedCurrentDate} published-catalog-latency - ${publishedCatalogLatency}ms\n`);
        process.stdout.write(`${formattedCurrentDate} total duration - ${totalDuration}ms\n\n`);
    }

    logHttp(req, res, next) {
        const start = Date.now();
        const formattedCurrentDate = formattedDate(new Date());

        const url = req.headers["referer"];
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
