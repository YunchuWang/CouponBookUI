import { browserHistory } from 'react-router';
import { urlMapper as exampleUrlMapper } from '../modules/exampleContent';
import { urlMapper as sampleUrlMapper } from '../modules/sampleContent';
import {
    CouponWebappPureAction,
    CouponWebappDispatch,
    CouponWebappState,
    Location,
} from '../types/Common';

export type URLParams = {[key: string]: string | null | undefined};

type MappingSpec = {
    pathRegex: RegExp,
    mappers: URLMapper[],
};

interface URLMapper {
    encode: (state: CouponWebappState) => URLParams,
    decode: (params: URLParams, dispatch: CouponWebappDispatch) => void,
    matchAction: (action: CouponWebappPureAction) => boolean,
}

const registeredMappers: MappingSpec[] = [];
registeredMappers.push({ pathRegex: /^\/example$/, mappers: [exampleUrlMapper]});
registeredMappers.push({ pathRegex: /^\/sample$/, mappers: [sampleUrlMapper]});

const getActiveMappers = (location: Location): URLMapper[] => {
    const specification = registeredMappers.find((spec) => spec.pathRegex.exec(location.pathname) != null);
    if (specification) {
        return specification.mappers;
    }
    return [];
};

function decodeParams(search: string): URLParams {
    if (search === '') {
        return {};
    }
    return search.slice(1) // Drop first '?'
        .split('&')
        .reduce((urlParams: URLParams, param) => {
            const [ key, val ] = param.split('=');
            if (key != null && val != null) {
                urlParams[key] = decodeURIComponent(val.replace(/\+/g, ' '));
            }
            return urlParams;
        }, {});
}

export function decodeURL(location: Location, dispatch: any): void {
    const params = decodeParams(location.search);
    getActiveMappers(location).forEach((mapper) => {
        mapper.decode(params, dispatch);
    });
}

function encodeParams(params: URLParams): string {
    const queryStr = Object.keys(params)
        .filter((key) => params[key] != null)
        .sort()
        .map((key) => `${key}=${encodeURIComponent((params[key] as string))}`)
        .join('&');
    if (!queryStr) {
        return '';
    }
    return queryStr;
}

function remapParams(state: CouponWebappState, action: any): URLParams | undefined {
    const activeMappers = getActiveMappers(browserHistory.getCurrentLocation());
    if (activeMappers.find((mapper) => mapper.matchAction(action))) {
        return activeMappers.reduce((dict, mapper) => ({ ...dict, ...mapper.encode(state) }), {});
    }
}

function updateParams(params: URLParams, withoutExtraBrowserHistory: boolean): void {
    const currentLocation = browserHistory.getCurrentLocation();
    const search = encodeParams({ ...params });
    if (search === currentLocation.search) {
        return;
    }
    if (!withoutExtraBrowserHistory) {
        browserHistory.push({
            pathname: currentLocation.pathname,
            search,
        });
    } else {
        browserHistory.replace({
            pathname: currentLocation.pathname,
            search,
        });
    }
}

export const globalUrlMapper = (store: any) => (next: any) => (action: any) => {
    next(action);

    // url-init is a conventional action that decodes url params into state
    // it is originated from url and thus should not sync back to url
    if (/url-init$/.exec(action.type) || action.__url_mapper_prevent_update) {
        return;
    }

    const params = remapParams(store.getState(), action);
    if (params) {
        updateParams(params, action.withoutExtraBrowserHistory);
    }
};