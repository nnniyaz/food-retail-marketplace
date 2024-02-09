export class URLWrapper {
    private _url: URL | null;

    constructor(url: string) {
        try {
            this._url = new URL(url);
        } catch (error) {
            this._url = null;
        }
    }

    getHostname(): string {
        return this._url?.host ?? "";
    }

    getPathname(): string {
        return this._url?.pathname ?? "";
    }

    getQueryParams(): URLSearchParams | null {
        return this._url?.searchParams ?? null;
    }
}
