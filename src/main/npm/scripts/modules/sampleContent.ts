import * as API from '../common/actions/Api';
import { withoutExtraBrowserHistory } from "../middlewares/browserHistory";
import { URLParams } from '../middlewares/globalUrlMapper';
import {
    CouponWebappDispatch,
    CouponWebappPureAction,
    CouponWebappState,
    SampleContent,
    SampleState
} from '../types/Common';

// Define Selectors
export const getSampleState = (state: CouponWebappState): SampleState => {
    return state.sample;
};
// entity types

// pure actions
type LoadSampleContentStartAction = {
    type: 'sample-page/load-sample-content-start',
};

type LoadSampleContentCompleteAction = {
    type: 'sample-page/load-sample-content-complete',
    page: number,
    query: string,
    displayStr: string,
    samples: SampleContent[],
};

type LoadSampleContentStopAction = {
    type: 'sample-page/load-sample-content-stop',
};

type ChangeSampleContentPageAction = {
    type: 'sample-page/change-page',
    page: number,
};

type UpdateSampleContentQueryAction = {
    type: 'sample-page/update-query',
    query: string,
};

type UrlInitiateAction = {
    type: 'sample-page/url-init',
    page: number,
    query: string,
};

export type SamplePageAction =
    LoadSampleContentStartAction
    | LoadSampleContentCompleteAction
    | LoadSampleContentStopAction
    | ChangeSampleContentPageAction
    | UpdateSampleContentQueryAction
    | UrlInitiateAction;

// Actions
const loadSampleContentStart = (): LoadSampleContentStartAction => {
    return {
        type: 'sample-page/load-sample-content-start',
    };
};

const loadContentCompleted = (page: number, query: string, displayStr: string, samples: SampleContent[]): LoadSampleContentCompleteAction => {
    return {
        type: 'sample-page/load-sample-content-complete',
        query,
        page,
        displayStr,
        samples,
    };
};

const stopLoadingSamples = (): LoadSampleContentStopAction => {
    return {
        type: 'sample-page/load-sample-content-stop',
    };
};

export const loadSamples: any = (page: number, query: string) => async (dispatch: CouponWebappDispatch, getState: any) => {
    dispatch(withoutExtraBrowserHistory(loadSampleContentStart()));
    try {
        const response: string = await API.Sample.withRequestParams({
            query,
            page,
        }).get();
        dispatch(loadContentCompleted(page, query, response, []));
    } catch (e) {
        // TODO: extra steps to handle exception
        throw e;
    } finally {
        stopLoadingSamples();
    }
};

export const changeSamplePage = (page: number) => async (dispatch: CouponWebappDispatch, getState: any) => {
    const state = getState();
    const { query } = getSampleState(state);
    dispatch({
        type: 'sample-page/change-page',
        page,
    });
    dispatch(loadSamples(page, query));
};

export const updateSampleQuery = (query: string) => async (dispatch: CouponWebappDispatch, getState: any) => {
    const state = getState();
    const { page } = getSampleState(state);
    dispatch({
        type: 'sample-page/update-query',
        query,
    });
    dispatch(loadSamples(page, query));
};

const INITIAL_STATE: SampleState = {
    loading: false,
    page: 0,
    query: '',
    displayStr: '',
    samples: [],
};

export function reducer(state: SampleState = INITIAL_STATE, action: SamplePageAction): SampleState {
    switch (action.type) {
        case 'sample-page/load-sample-content-start':
            return {
                ...state,
                loading: true,
            };
        case 'sample-page/load-sample-content-stop':
            return {
                ...state,
                loading: false,
            };
        case 'sample-page/load-sample-content-complete':
            return {
                ...state,
                page: action.page,
                query: action.query,
                displayStr: action.displayStr,
                samples: action.samples,
            };
        case 'sample-page/change-page':
            return {
                ...state,
                page: action.page,
            };
        case 'sample-page/update-query':
            return {
                ...state,
                query: action.query,
            };
        case 'sample-page/url-init':
            return {
                ...state,
                page: action.page,
                query: action.query,
            };
        default:
            return state;
    }
}

export const urlMapper = {
    encode(state: CouponWebappState) {
        const { page, query } = getSampleState(state);
        return {
            page: String(page),
            query,
        };
    },

    decode(params: URLParams, dispatch: CouponWebappDispatch) {
        dispatch({
            type: 'sample-page/url-init',
            page: parseInt(String(params.page), 10) || 0,
            query: params.query || '',
        });
    },

    matchAction(action: CouponWebappPureAction) {
        return action.type.startsWith('sample-page/');
    },
};
