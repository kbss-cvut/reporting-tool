'use strict';

const Constants = require('../constants/Constants');
const Utils = require('../utils/Utils');

const MILLIS_IN_MINUTE = 60 * 1000;

function roundToMinutes(time) {
    return Math.floor(time / MILLIS_IN_MINUTE) * MILLIS_IN_MINUTE;
}

module.exports = {
    createOccurrenceReport: function () {
        return {
            occurrence: {
                javaClass: Constants.OCCURRENCE_JAVA_CLASS,
                referenceId: Utils.randomInt(),
                name: '',
                // Round the time to whole seconds
                startTime: roundToMinutes(Date.now()),
                endTime: roundToMinutes(Date.now())
            },
            isNew: true,
            javaClass: Constants.OCCURRENCE_REPORT_JAVA_CLASS
        };
    },

    createFactor: function (parent = null) {
        const factor = {
            javaClass: Constants.EVENT_JAVA_CLASS,
            types: []
        };
        if (parent) {
            factor.startTime = parent.startTime;
            factor.endTime = parent.endTime;
        }
        return factor;
    }
};
