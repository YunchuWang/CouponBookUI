import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { globalUrlMapper } from './middlewares/globalUrlMapper';
import reducers from './reducers';

const middlewares = [
    thunkMiddleware,
    routerMiddleware(browserHistory),
    createLogger(),
    globalUrlMapper,
];

export const store = createStore(
    combineReducers({
        ...reducers as any,
        routing: routerReducer,
    }),
    applyMiddleware(...middlewares as any)
);