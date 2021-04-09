import { Dispatch } from 'redux';
import { RouterAction } from 'react-router-redux';
import { ExamplePageAction } from '../modules/exampleContent';
import { SamplePageAction } from '../modules/sampleContent';

export type Location = {
    pathname: string,
    search: string,
    query: {
        [key: string]: string | string[] | null | undefined,
    },
};

// example page
export type ExampleContent = {
    name: string,
    title: string,
    value: number,
};

export type ExampleState = {
    loading: boolean,
    page: number,
    query: string,
    displayStr: string,
    examples: ExampleContent[],
};

// sample page
export type SampleContent = {
    name: string,
    title: string,
    value: number,
};

export type SampleState = {
    loading: boolean,
    page: number,
    query: string,
    displayStr: string,
    samples: SampleContent[],
};

// redux state
export type CouponWebappState = {
    example: ExampleState,
    sample: SampleState,
};

export type CouponWebappPureAction =
    ExamplePageAction
    | SamplePageAction
    | RouterAction;

export type CouponWebappAction =
    CouponWebappPureAction
    | ((dispatch: CouponWebappDispatch, getState: () => CouponWebappState) => any);

export type CouponWebappDispatch = Dispatch<CouponWebappAction>;
