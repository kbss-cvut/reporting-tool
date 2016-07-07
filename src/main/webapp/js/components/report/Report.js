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

var React = require('react');

var I18nMixin = require('../../i18n/I18nMixin');
var injectIntl = require('../../utils/injectIntl');
var Mask = require('../Mask').default;
var ReportType = require('../../model/ReportType');
var ResourceNotFound = require('../ResourceNotFound');
var ReportNotRenderable = require('../ReportNotRenderable');
var ReportValidator = require('../../validation/ReportValidator');

var Report = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        report: React.PropTypes.object,
        revisions: React.PropTypes.array,
        loading: React.PropTypes.bool
    },

    render: function () {
        if (this.props.loading) {
            return (
                <Mask text={this.i18n('detail.loading')}/>
            );
        }
        if (!this.props.report) {
            return (<ResourceNotFound resource={this.i18n('detail.not-found.title')}/>);
        }
        if (!ReportValidator.canRender(this.props.report)) {
            return (<ReportNotRenderable messageId={ReportValidator.getRenderError(this.props.report)}/>);
        }
        return this.renderDetail();
    },

    renderDetail: function () {
        var report = this.props.report,
            detailComponent = ReportType.getDetailController(report);

        return React.createElement(detailComponent, {
            report: report,
            revisions: this.props.revisions
        });
    }
});

module.exports = injectIntl(Report);
