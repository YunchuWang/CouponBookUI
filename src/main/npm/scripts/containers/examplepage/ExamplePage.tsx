import React, {FormEvent} from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import {changeExamplePage, getExampleState, loadExamples, updateExampleQuery} from '../../modules/exampleContent';
import {
    CouponWebappDispatch,
    CouponWebappState,
    ExampleContent
} from '../../types/Common';

type Props = {
    dispatch: CouponWebappDispatch,
    page: number,
    query: string,
    displayStr: string,
    examples: ExampleContent[],
};

class _ExamplePage extends React.Component<Props> {
    state = {
        query: '',
    };

    componentDidMount() {
        const { page, query, displayStr, dispatch } = this.props;
        if (!displayStr) {
            dispatch(loadExamples(page, query));
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.query !== prevProps.query) {
            this.setState({ query: this.props.query });
        }
    }

    @autobind
    _handlePageChange(page: number) {
        this.props.dispatch(changeExamplePage(page));
    }

    @autobind
    _handleInputSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.dispatch(updateExampleQuery(this.state.query));
    }

    render() {
        const { page, displayStr } = this.props;
        const { query } = this.state;
        return (
            <div id="example-page-id">
                <div>
                    <button className="ui button" onClick={() => this._handlePageChange(page - 1)}>
                        Prev page
                    </button>
                    <span style={{fontSize: '24px', color: 'red'}}>{displayStr}</span>
                    <button className="ui button" onClick={(e) => this._handlePageChange(page + 1)}>
                        Next page
                    </button>
                </div>
                <br/>
                <form className="ui input" onSubmit={this._handleInputSubmit}>
                    <input type="text"
                           value={query}
                           onChange={(e) => this.setState({ query: e.target.value })}
                           placeholder="example value..."
                    />
                    <button type="submit">
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export const ExamplePage = connect((state: CouponWebappState) => {
    const exampleState = getExampleState(state);
    const { page, query, displayStr, examples } = exampleState;
    return {
        page,
        query,
        displayStr,
        examples,
    };
})(_ExamplePage);