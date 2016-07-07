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
var injectIntl = require('../../../utils/injectIntl');

var Input = require('../../Input');
var I18nMixin = require('../../../i18n/I18nMixin');
var WizardStore = require('../../../stores/WizardStore');

var Description = React.createClass({
    mixins: [I18nMixin],

    getInitialState: function () {
        var description = WizardStore.getData().statement.description;
        return {
            description: description ? description : ''
        };
    },

    componentDidMount: function () {
        if (this.state.description.trim().length !== 0) {
            this.props.enableNext();
        }
        this.refs.description.focus();
    },

    onChange: function (e) {
        var value = e.target.value,
            statement = WizardStore.getData().statement;
        statement.description = value;
        WizardStore.updateData({statement: statement});
        if (value.trim().length === 0) {
            this.props.disableNext();
        } else {
            this.props.enableNext();
        }
        this.setState({description: value});
    },
    render: function () {
        return (
            <div>
                <Input type='textarea' rows='8' label={this.i18n('description') + '*'} ref='description'
                       placeholder={this.i18n('report.corrective.description-placeholder')}
                       value={this.state.description} onChange={this.onChange}
                       title={this.i18n('report.corrective.description-tooltip')}/>
            </div>
        );
    }
});

module.exports = injectIntl(Description);
