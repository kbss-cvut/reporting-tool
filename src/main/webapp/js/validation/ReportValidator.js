'use strict';

const Constants = require('../constants/Constants');

const validators = {};

const ReportValidator = {

    /**
     * Checks whether all the required fields are filled.
     * @param report Report to validate
     * @return {boolean} Validity status
     */
    isValid: function (report) {
        return this.getValidationMessage(report) === null;
    },

    getValidationMessage: function (report) {
        if (validators[report.javaClass]) {
            return validators[report.javaClass].getValidationMessage(report);
        }
        return null;
    },

    /**
     * Checks whether the application will be able to render the specified report.
     *
     * For instance, reports with too large difference between occurrence start and end time cannot be rendered, because
     * the gantt component hangs when trying to render such data and it causes the whole browser to freeze.
     * @param report The report to check
     */
    canRender: function (report) {
        return this.getRenderError(report) === null;
    },

    /**
     * Gets error because of which the specified report cannot be rendered.
     * @param report The report to check
     * @return {*} Error message identifier, or {@code null}, if the report can be rendered
     */
    getRenderError: function (report) {
        if (!report) {
            return {messageId: '', canFix: false};
        }
        if (validators[report.javaClass]) {
            return validators[report.javaClass].getRenderError(report);
        }
        return null;
    }
};

/**
 * Occurrence report validator.
 */
const OccurrenceReportValidator = {

    getValidationMessage: function (report) {
        if (!report.occurrence) {
            return 'detail.invalid-tooltip';
        }
        if (!report.occurrence.name || report.occurrence.name.length === 0) {
            return 'detail.invalid-tooltip';
        }
        if (!report.occurrence.startTime) {
            return 'detail.invalid-tooltip';   // Don't expect this to happen, but just to be sure
        }
        if (!report.severityAssessment) {
            return 'detail.invalid-tooltip';
        }
        if (!report.summary || report.summary.length === 0) {
            return 'detail.invalid-tooltip';
        }
        if (!report.occurrence.eventType) {
            return 'detail.invalid-tooltip';
        }
        if (!this._isOccurrenceStartEndTimeDiffValid(report)) {
            return 'detail.large-time-diff-tooltip';
        }
        return null;
    },

    _isOccurrenceStartEndTimeDiffValid: function (report) {
        return report.occurrence.endTime - report.occurrence.startTime <= Constants.MAX_OCCURRENCE_START_END_DIFF;
    },

    _isOccurrenceAndEventTimeDiffValid: function (report) {
        const start = report.occurrence.startTime;
        if (report.factorGraph) {
            const nodes = report.factorGraph.nodes;
            // Skip the root of the graph
            for (let i = 1, len = nodes.length; i < len; i++) {
                if (Math.abs(nodes[i].startTime - start) > Constants.MAX_OCCURRENCE_START_END_DIFF) {
                    return false;
                }
            }
        }
        return true;
    },

    getRenderError: function (report) {
        const error = {canFix: true};
        if (!this._isOccurrenceStartEndTimeDiffValid(report)) {
            error.messageId = 'detail.large-time-diff-tooltip';
        }
        if (!this._isOccurrenceAndEventTimeDiffValid(report)) {
            error.messageId = 'detail.large-time-diff-event-tooltip';
        }
        // More checks can be added
        return error.messageId ? error: null;
    }
};

validators[Constants.OCCURRENCE_REPORT_JAVA_CLASS] = OccurrenceReportValidator;

module.exports = ReportValidator;
