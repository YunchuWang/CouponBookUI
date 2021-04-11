import React from 'react';
import './noFoundPage.styles.scss';

export const NoFoundPage: React.FunctionComponent<any> = () => {
    return (
        <div className="error-page-text">
            Sorry, the page you are looking for does not exist. Please try other pages.
        </div>
    );
};