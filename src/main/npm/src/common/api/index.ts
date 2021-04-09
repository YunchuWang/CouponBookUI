import {ApiError, ClientError, ConnectionError, RequestInfo, ServerError} from "../errors";
import * as queryString from 'querystring';

export type Payload = {
    [key: string]: any,
};

type PathVariables = {
    [key: string]: string,
};

export class ApiCallable<T> {

    getId: () => string;
    callApi: () => Promise<T | undefined>;

    constructor(getId: () => string, callApi: () => Promise<T | undefined>) {
        this.getId = getId;
        this.callApi = callApi;
    }

    map<S>(transformer: (value: T | undefined) => S | undefined): ApiCallable<S> {
        return new ApiCallable<S>(this.getId, async () => {
            const value = await this.callApi();
            return transformer(value);
        });
    }

    static of<T>(value: T): ApiCallable<T> {
        return new ApiCallable(() => '_constant_', async () => value);
    }
}

async function _sendRequest<T>(url: string, config: any): Promise<T> {
    const requestInfo = new RequestInfo(config.method, url, config.body || {});
    let json: any;
    try {
        const response = await fetch(url, {
            ...config,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        });
        json = await response.json();
        if (response.ok) {
            if (Object.prototype.hasOwnProperty.call(json, 'body')) {
                return json.body;
            }
            return json;
        } else {
            requestInfo.requestUid = json.requestUid;
            if (response.status >= 400 && response.status < 500) {
                throw new ClientError(requestInfo, json.body.error);
            } else if (response.status >= 500) {
                throw new ServerError(requestInfo, json.body.error, json.body.stackTrace, json.body.remoteStacktrace);
            } else {
                throw new ApiError(requestInfo, json.body.error);
            }
        }
    } catch (e) {
        if (e instanceof TypeError) {
            throw new ConnectionError(requestInfo, e.message);
        } else {
            throw e;
        }
    }
}

export class Api {
    url: string;
    pathVariables: PathVariables;

    constructor(url: string, pathVariables: PathVariables = {}) {
        this.url = url;
        this.pathVariables = pathVariables;
    }

    withPath(path: string) {
        return new Api(`${this.url}/${path}`, this.pathVariables)
    }

    withRequestParams(requestParams: Payload) {
        const query = queryString.stringify(requestParams);
        return new Api(`${this.url}?${query}`, this.pathVariables);
    }

    bindPathVariables(pathVariables: PathVariables) {
        return new Api(this.url, pathVariables);
    }

    renderUrl() {
        let template = this.url;
        Object.keys(this.pathVariables).forEach((key) => {
            template = template.replace(`:${key}`, this.pathVariables[key]);
        });
        return template;
    }

    async get<T>(): Promise<T> {
        const config = {
            method: 'GET',
        };
        return _sendRequest<T>(this.renderUrl(), config);
    }

    async post<T>(payload?: any): Promise<T> {
        const config = {
            method: 'POST',
            body: JSON.stringify(payload),
        };
        return _sendRequest<T>(this.renderUrl(), config);
    }

    async put<T>(payload?: any): Promise<T> {
        const config = {
            method: 'PUT',
            body: JSON.stringify(payload),
        };
        return _sendRequest<T>(this.renderUrl(), config);
    }

    async delete<T>(payload: any = {}): Promise<T> {
        const config = {
            method: 'DELETE',
            body: JSON.stringify(payload),
        };
        return _sendRequest<T>(this.renderUrl(), config);
    }
}
