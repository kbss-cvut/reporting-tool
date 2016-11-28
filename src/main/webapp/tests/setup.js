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
// this handles setup of the fake DOM when the tests are run in Node
// Based on https://github.com/robertknight/react-testing

import jsdom from 'jsdom';

var FAKE_DOM_HTML = `
<html>
<body>
</body>
</html>
`;

function setupFakeDOM() {
    if (typeof document !== 'undefined') {
        // if the fake DOM has already been set up, or
        // if running in a real browser, do nothing
        return;
    }

    // setup the fake DOM environment.
    //
    // Note that we use the synchronous jsdom.jsdom() API
    // instead of jsdom.env() because the 'document' and 'window'
    // objects must be available when React is require()-d for
    // the first time.
    //
    // If you want to do any async setup in your tests, use
    // the before() and beforeEach() hooks.
    global.document = jsdom.jsdom(FAKE_DOM_HTML);
    global.window = document.defaultView;
    global.navigator = window.navigator;
}

setupFakeDOM();
