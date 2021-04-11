import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { store } from './store';
import { decodeURL } from './middlewares/globalUrlMapper';
import { NavBar } from './components/navbar/NavBar';
import { HomePage } from './containers/homepage/HomePage';
import { ExamplePage } from './containers/examplepage/ExamplePage';
import { SamplePage } from './containers/samplepage/SamplePage';
import { NoFoundPage } from './containers/errorpage/NoFoundPage';
import { CouponWebappDispatch, Location, PageKind } from './types/Common';
// @ts-ignore
import MyImage from './images/banner.jpg';
// @ts-ignore
import FavIcon from './images/favicon.ico';
import './styles/main.scss';

type Props = {
    location: Location,
    dispatch: CouponWebappDispatch,
    children: React.ReactElement<any>,
};

class _App extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        decodeURL(props.location, props.dispatch);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props>): void {
        if (nextProps.location.pathname !== this.props.location.pathname || nextProps.location.search !== this.props.location.search) {
            decodeURL(nextProps.location, nextProps.dispatch)
        }
    }

    _getPageKind(): PageKind {
        const { location } = this.props;
        if (location.pathname.startsWith('/example')) {
            return 'example';
        }
        if (location.pathname.startsWith('/sample')) {
            return 'sample';
        }
        return 'home';
    }

    render() {
        const pageKind = this._getPageKind();
        return (
            <div>
                <NavBar pageKind={pageKind}/>
                <div className="test-style">
                    This is placeholder for main app js.
                </div>
                <img src={MyImage} />
                <img src={FavIcon} />
                {this.props.children}
            </div>
        );
    }
}

const App = connect()(_App);

document.addEventListener('DOMContentLoaded', () => {
    const history = syncHistoryWithStore(browserHistory, store);
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={HomePage}/>
                    <Route path="/home" component={HomePage}/>
                    <Route path="/example" component={ExamplePage}/>
                    <Route path="/sample" component={SamplePage}/>
                </Route>
                <Route path="/*" component={() => {
                    return (
                        <div>
                            <NavBar pageKind="unknown"/>
                            <NoFoundPage/>
                        </div>
                    );
                }}/>
            </Router>
        </Provider>,
        document.getElementById('content'));
});