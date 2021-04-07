import { ExampleContent } from '../types/Common';

type LoadExampleContentStartAction = {
    type: 'example-page/load-example-content-start',
};

type LoadExampleContentCompleteAction = {
    type: 'example-page/load-example-content-complete',
    examples: ExampleContent[],
};

type LoadExampleContentStopAction = {
    type: 'example-page/load-example-content-stop',
};

type UrlInitiateAction = {
    type: 'example-page/initiate-url'
    page: number,
    query: string,
};

export type ExamplePageAction =
    LoadExampleContentStartAction
    | LoadExampleContentCompleteAction
    | LoadExampleContentStopAction
    | UrlInitiateAction;