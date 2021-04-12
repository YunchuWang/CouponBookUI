import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
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
        return (
            <div className="ui menu">
                <div className="header item">LOGO</div>
                <a className={this._getClassName('home')}>Home</a>
                <a className={this._getClassName('example')}>Example</a>
                <a className={this._getClassName('sample')}>Sample</a>
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