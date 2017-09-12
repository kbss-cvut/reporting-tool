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

const injectIntl = require('react-intl').injectIntl;

/**
 * Our version of react-intl's injectIntl.
 *
 * Decorates the basic instance returned by injectIntl with accessors to the wrapped component or element (needed by
 * tests).
 */
module.exports = function (component, props) {
    if (!props) {
        props = {};
    }
    // Store this only for development purposes
    if (process.env.NODE_ENV !== 'production') {
        props.withRef = true;
        return injectIntl(component, props);
    } else {
        return injectIntl(component, props);
    }
};
