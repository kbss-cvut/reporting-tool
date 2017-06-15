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

import Constants from "../../js/constants/Constants";
import ReportFactory from "../../js/model/ReportFactory";

describe('ReportFactory', () => {

    describe('createFactor', () => {

        it('creates empty factor with java class set when no parent is specified', () => {
            const result = ReportFactory.createFactor();
            expect(result.javaClass).toEqual(Constants.EVENT_JAVA_CLASS);
            expect(result.startTime).not.toBeDefined();
            expect(result.endTime).not.toBeDefined();
        });

        it('creates new factor with start and end time of the specified parent', () => {
            const parent = {
                startTime: Date.now() - 100000,
                endTime: Date.now() - 90000
            };
            const result = ReportFactory.createFactor(parent);
            expect(result.javaClass).toEqual(Constants.EVENT_JAVA_CLASS);
            expect(result.startTime).toEqual(parent.startTime);
            expect(result.endTime).toEqual(parent.endTime);
        });
    });
});
