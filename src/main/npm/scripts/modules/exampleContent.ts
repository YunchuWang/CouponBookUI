import * as API from '../common/actions/Api';
import { withoutExtraBrowserHistory } from "../middlewares/browserHistory";
import { URLParams } from '../middlewares/globalUrlMapper';
import {
    CouponWebappDispatch,
    CouponWebappPureAction,
    CouponWebappState,
    ExampleContent,
    ExampleState,
} from '../types/Common';

// Define Selectors
export const getExampleState = (state: CouponWebappState): ExampleState => {
    return state.example;
};

// entity types

// pure actions
type LoadExampleContentStartAction = {
    type: 'example-page/load-example-content-start',
};

type LoadExampleContentCompleteAction = {
    type: 'example-page/load-example-content-complete',
    page: number,
    query: string,
    displayStr: string,
    examples: ExampleContent[],
};

type LoadExampleContentStopAction = {
    type: 'example-page/load-example-content-stop',
};

type ChangeExampleContentPageAction = {
    type: 'example-page/change-page',
    page: number,
};

type UpdateExampleContentQueryAction = {
    type: 'example-page/update-query',
    query: string,
};

type UrlInitiateAction = {
    type: 'example-page/url-init',
    page: number,
    query: string,
};

export type ExamplePageAction =
    LoadExampleContentStartAction
    | LoadExampleContentCompleteAction
    | LoadExampleContentStopAction
    | ChangeExampleContentPageAction
    | UpdateExampleContentQueryAction
    | UrlInitiateAction;

// Actions
const loadExampleContentStart = (): LoadExampleContentStartAction => {
    return {
        type: 'example-page/load-example-content-start',
    };
};

const loadContentCompleted = (page: number, query: string, displayStr: string, examples: ExampleContent[]): LoadExampleContentCompleteAction => {
    return {
        type: 'example-page/load-example-content-complete',
        query,
        page,
        displayStr,
        examples,
    };
};

const stopLoadingExamples = (): LoadExampleContentStopAction => {
    return {
        type: 'example-page/load-example-content-stop',
    };
};

export const loadExamples: any = (page: number, query: string) => async (dispatch: CouponWebappDispatch, getState: any) => {
    dispatch(withoutExtraBrowserHistory(loadExampleContentStart()));
    try {
        const response: string = await API.Example.withRequestParams({
            query,
            page,
        }).get();
        dispatch(loadContentCompleted(page, query, response, []));
    } catch (e) {
        // TODO: extra steps to handle exception
        throw e;
    } finally {
        stopLoadingExamples();
    }
};

export const changeExamplePage = (page: number) => async (dispatch: CouponWebappDispatch, getState: any) => {
    const state = getState();
    const { query } = getExampleState(state);
    dispatch({
        type: 'example-page/change-page',
        page,
    });
    dispatch(loadExamples(page, query));
};

export const updateExampleQuery = (query: string) => async (dispatch: CouponWebappDispatch, getState: any) => {
    const state = getState();
    const { page } = getExampleState(state);
    dispatch({
        type: 'example-page/update-query',
        query,
    });
    dispatch(loadExamples(page, query));
};

const INITIAL_STATE: ExampleState = {
    loading: false,
    page: 0,
    query: '',
    displayStr: '',
    examples: [],
};

// reducer
export function reducer(state: ExampleState = INITIAL_STATE, action: ExamplePageAction): ExampleState {
    switch (action.type) {
        case 'example-page/load-example-content-start':
            return {
                ...state,
                loading: true,
            };
        case 'example-page/load-example-content-stop':
            return {
                ...state,
                loading: false,
            };
        case 'example-page/load-example-content-complete':
            return {
                ...state,
                page: action.page,
                query: action.query,
                displayStr: action.displayStr,
                examples: action.examples,
            };
        case 'example-page/change-page':
            return {
                ...state,
                page: action.page,
            };
        case 'example-page/update-query':
            return {
                ...state,
                query: action.query,
            };
        case 'example-page/url-init':
            return {
                ...state,
                page: action.page,
                query: action.query,
            };
        default:
            return state;
    }
}

// url mapper
export const urlMapper = {
    encode(state: CouponWebappState) {
        const { page, query } = getExampleState(state);
        return {
            page: String(page),
            query,
        };
    },

    decode(params: URLParams, dispatch: CouponWebappDispatch) {
        dispatch({
            type: 'example-page/url-init',
            page: parseInt(String(params.page), 10) || 0,
            query: params.query || '',
        });
    },

    matchAction(action: CouponWebappPureAction) {
        return action.type.startsWith('example-page/');
    }
};
