export function withoutExtraBrowserHistory<T>(action: T): T {
    const a: any = action;
    a.withoutExtraBrowserHistory = true;
    return a;
}

export function preventUrlUpdate<T>(action: T): T {
    const a: any = action;
    a.__url_mapper_prevent_update = true;
    return a;
}