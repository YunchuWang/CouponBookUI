import { Dispatch } from 'redux';
import { RouterAction } from 'react-router-redux';
import { ExamplePageAction } from '../modules/exampleContent';

// example page
export type ExampleContent = {
    name: string,
    title: string,
    value: number,
};

export type ExampleState = {
    loading: boolean,
    examples: ExampleContent[],
};

// redux state
export type CouponWebappState = {
    example: ExampleState,
};

export type CouponWebappPureAction =
    ExamplePageAction
    | RouterAction;

export type CouponWebappAction =
    CouponWebappPureAction
    | ((dispatch: CouponWebappDispatch, getState: () => CouponWebappState) => any);

export type CouponWebappDispatch = Dispatch<CouponWebappAction>;
