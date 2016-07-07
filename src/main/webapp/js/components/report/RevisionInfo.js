'use strict';

var React = require('react');
var Input = require('../Input');

var Logger = require('../../utils/Logger');
var Utils = require('../../utils/Utils');
var injectIntl = require('../../utils/injectIntl');
var I18nMixin = require('../../i18n/I18nMixin');

var RevisionInfo = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        revisions: React.PropTypes.array.isRequired,
        selectedRevision: React.PropTypes.number.isRequired,
        onSelect: React.PropTypes.func.isRequired
    },

    onSelect: function (e) {
        var revision = Number(e.target.value),
            revisions = this.props.revisions;
        for (var i = 0, len = revisions.length; i < len; i++) {
            if (revisions[i].revision === revision) {
                this.props.onSelect(revisions[i]);
                return;
            }
        }
        Logger.error('Revision ' + revision + ' not found!');
    },


    render: function () {
        return (
            <Input type='select' label={this.i18n('revisions.label')} value={this.props.selectedRevision}
                   onChange={this.onSelect}>
                {this.renderOptions()}
            </Input>
        )
    },

    renderOptions: function () {
        var revisions = this.props.revisions,
            options = [],
            formattedDate, label;
        for (var i = 0, len = revisions.length; i < len; i++) {
            if (i > 0 && revisions[i - 1].phase !== revisions[i].phase) {
                options.push(<option key={'phase_trans_' + i} disabled>──────────────────────────</option>);
            }
            formattedDate = Utils.formatDate(new Date(revisions[i].created));
            label = revisions[i].revision + ' - ' + this.i18n('revisions.created') + ': ' + formattedDate;
            options.push(<option key={'rev_' + revisions[i].revision} value={revisions[i].revision}
                                 title={this.i18n('revisions.show-tooltip')}>{label}</option>);
        }
        return options;
    }
});

module.exports = injectIntl(RevisionInfo);
