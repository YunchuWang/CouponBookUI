import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import { Routes } from '../routes/Routes';
import {
    CouponWebappState,
    ExampleState,
    PageKind,
    SampleState,
} from '../../types/Common';

type Props = {
    pageKind: PageKind,
    exampleState: ExampleState,
    sampleState: SampleState,
};
class _NavBar extends React.PureComponent<Props> {

    _getClassName(page: PageKind) {
        return classNames('item', { 'active': page === this.props.pageKind });
    }

    render() {
        const { pageKind, exampleState, sampleState } = this.props;
        const onClick: any = (pageKind === 'unknown') ? this.forceUpdate : undefined;
        return (
            <div className="ui menu">
                <div className="header item">
                    <Link onClick={onClick} to={Routes.index()}>LOGO</Link>
                </div>
                <a className={this._getClassName('home')}>
                    <Link onClick={onClick} to={Routes.index()}>Home</Link>
                </a>
                <a className={this._getClassName('example')}>
                    <Link onClick={onClick} to={Routes.example(exampleState.query, exampleState.page)}>example</Link>
                </a>
                <a className={this._getClassName('sample')}>
                    <Link onClick={onClick} to={Routes.sample(sampleState.query, sampleState.page)}>sample</Link>
                </a>
            </div>
        );
    }
}

export default connect(
    (state: CouponWebappState) => ({
        exampleState: state.example,
        sampleState: state.sample,
    })
)(_NavBar);