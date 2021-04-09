export class RequestInfo {
    method: string;
    url: string;
    payload?: object;
    requestUid?: string;

    constructor(method: string, url: string, payload: object) {
        this.method = method;
        this.url = url;
        this.payload = payload;
    }

    summary(): string {
        return `${this.method} ${this.url} ${this.payload ? '(with payload)' : ''}`;
    }
}

export class ApiError extends Error {
    request: RequestInfo;
    reason: string;
    constructor(request: RequestInfo, reason: string) {
        super(`${request.summary()} faild. reason: ${reason}`);
        this.request = request;
        this.reason = reason;
    }
}

export class ConnectionError extends ApiError {
    constructor(request: RequestInfo, reason: string) {
        super(request, `Connection Error -- ${reason}`);
    }
}

export class ClientError extends ApiError {
    constructor(request: RequestInfo, reason: string) {
        super(request, `Client Error -- ${reason}`);
    }
}

export class ServerError extends ApiError {
    stacktrace?: string;
    remoteStacktrace?: string;
    constructor(request: RequestInfo, reason: string, stacktracce?: string, remoteStracktrace?: string) {
        super(request, `Server Error -- ${reason}`);
        this.stacktrace = stacktracce;
        this.remoteStacktrace = remoteStracktrace;
    }
}