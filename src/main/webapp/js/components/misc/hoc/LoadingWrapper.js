/*
 * Copyright (C) 2016 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';

import React from "react";
import Mask from "../../Mask";

/**
 * Higher order component which provides loading mask facilities to the wrapped component.
 * @param Component The component to wrap
 * @param options Allows to specify what container tag should be used. Default is 'div'
 */
const LoadingWrapper = (Component, options) => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            msg: undefined
        };
    }

    getWrappedComponent() {
        // Enable composition of multiple HOCs.
        return this._wrappedComponent && this._wrappedComponent.getWrappedComponent ?
            this._wrappedComponent.getWrappedComponent() : this._wrappedComponent;
    }

    loadingOn = (msg) => {
        this.setState({loading: true, msg: msg});
    };

    loadingOff = () => {
        this.setState({loading: false, msg: undefined});
    };

    render() {
        const tag = options && options.tag ? options.tag : 'div';
        return React.createElement(tag, null,
            this.state.loading && <Mask text={this.state.msg}/>,
            <Component ref={(c) => this._wrappedComponent = c} loadingOn={this.loadingOn}
                       loadingOff={this.loadingOff} {...this.props}/>
        );
    }
};

export default LoadingWrapper;
