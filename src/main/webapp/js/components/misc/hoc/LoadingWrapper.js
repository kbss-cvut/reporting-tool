/*
 * Copyright (C) 2017 Czech Technical University in Prague
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
import getDisplayName from "../../../utils/getDisplayName";
import Mask from "../../Mask";

/**
 * Higher order component which provides loading mask facilities to the wrapped component.
 * @param Component The component to wrap
 * @param options Allows configuration of the wrapper component. Supported options are:
 * <ul>
 *     <li>tag - the tag to wrap the Component and the loading mask in, default is div,</li>
 *     <li>maskClass - class name to pass to the mask component.</li>
 * </ul>
 */
const LoadingWrapper = (Component, options) => {
    class Wrapped extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: false,
                msg: undefined
            };
            this.wrappedComponent = Component.wrappedComponent ? Component.wrappedComponent : Component;
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
            const tag = options && options.tag ? options.tag : 'div',
                maskClass = options && options.maskClass ? options.maskClass : null;
            return React.createElement(tag, {className: 'relative'},
                this.state.loading && <Mask text={this.state.msg} classes={maskClass}/>,
                <Component ref={(c) => this._wrappedComponent = c} loadingOn={this.loadingOn}
                           loadingOff={this.loadingOff} {...this.props}/>
            );
        }
    }
    Wrapped.displayName = "LoadingWrapper(" + getDisplayName(Component) + ")";
    Wrapped.WrappedComponent = Component.WrappedComponent ? Component.WrappedComponent : Component;
    return Wrapped;
};

export default LoadingWrapper;
