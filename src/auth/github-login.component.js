/*
Implementation tp pop up the github login screen and doing the authentication
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from './PopupWindow';
import { toQuery } from '../utils';

class GitHubLogin extends Component {
    static propTypes = {
        buttonText: PropTypes.string,
        children: PropTypes.node,
        className: PropTypes.string,
        clientId: PropTypes.string.isRequired,
        onRequest: PropTypes.func,
        onSuccess: PropTypes.func,
        onFailure: PropTypes.func,
        redirectUri: PropTypes.string,
        scope: PropTypes.string,
    }

    //set the default prop values for variables
    static defaultProps = {
        buttonText: 'Sign in with GitHub',
        redirectUri: '', //the redirect url is defined in the
        scope: 'user:email',
        onRequest: () => {},
        onSuccess: () => {},
        onFailure: () => {},
    }

    //Pop up the window an authorize the github account
    onSubmit = () => {
        const { clientId, scope, redirectUri } = this.props;
        const search = toQuery({
            client_id: clientId,
            scope,
            redirect_uri: redirectUri,
        });
        const popup = this.popup = PopupWindow.open(
            'github-oauth-authorize',
            //call the github authorization server
            //This will return an authorization code from github
            `https://github.com/login/oauth/authorize?${search}`,
            { height: 1000, width: 600 }
        );

        this.onRequest();
        popup.then(
            data => this.onSuccess(data),
            error => this.onFailure(error)
        );
    }

    //handle the on request event
    onRequest = () => {
        this.props.onRequest();
    }

    //handle the on success event
    onSuccess = (data) => {
        if (!data.code) {
            return this.onFailure(new Error('\'code\' not found'));
        }

        this.props.onSuccess(data);
    }

    //handle the on failure event
    onFailure = (error) => {
        this.props.onFailure(error);
    }

    render() {
        const { className, buttonText, children } = this.props;
        const attrs = { onClick: this.onSubmit };

        if (className) {
            attrs.className = className;
        }

        return <button {...attrs}>{ children || buttonText }</button>;
    }
}

export default GitHubLogin;