'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var DeleteReportDialog = require('../report/DeleteReportDialog').default;

/**
 * Aggregates some of the functionality of the report detail view.
 */
var ReportDetailMixin = {

    onChange: function (e) {
        var attributeName = e.target.name;
        var change = {};
        change[attributeName] = e.target.value;
        this.props.handlers.onChange(change);
    },

    onLoading: function () {
        this.setState({submitting: true});
    },

    onLoadingEnd: function () {
        this.setState({submitting: false});
    },

    onSaveSuccess: function () {
        this.onLoadingEnd();
        this.props.handlers.onSuccess();
        if (!this.props.report || !this.props.report.isNew) {
            this.showSuccessMessage(this.i18n('save-success-message'));
        }
    },

    onSaveError: function (error) {
        this.onLoadingEnd();
        this.showErrorMessage(this.i18n('save-failed-message') + error.message);
    },

    onSubmitSuccess: function (key) {
        this.onLoadingEnd();
        this.showSuccessMessage(this.i18n('detail.submit-success-message'));
        this.props.handlers.onSuccess(key);
    },

    onSubmitError: function (error) {
        this.onLoadingEnd();
        this.showErrorMessage(this.i18n('detail.submit-failed-message') + error.message);
    },

    onPhaseTransitionSuccess: function () {
        this.onLoadingEnd();
        this.showSuccessMessage(this.i18n('detail.phase-transition-success-message'));
        this.props.handlers.onSuccess();
    },

    onPhaseTransitionError: function (error) {
        this.onLoadingEnd();
        this.showErrorMessage(this.i18n('detail.phase-transition-failed-message') + error.message);
    },

    _onDeleteClick: function () {
        this.setState({showDeleteDialog: true});
    },

    onDeleteCancel: function () {
        this.setState({showDeleteDialog: false});
    },

    _onDelete: function () {
        this.props.handlers.onRemove(this.onDeleteError);
    },

    onDeleteError: function (error) {
        this.showErrorMessage(this.i18n('detail.remove-failed-message') + error.message);
    },


    renderDeleteButton: function () {
        return this.props.report.isNew ? null :
            <Button bsStyle='warning' bsSize='small' title={this.i18n('reports.delete-tooltip')}
                    onClick={this._onDeleteClick}>{this.i18n('delete')}</Button>;
    },

    renderDeleteDialog: function () {
        return <DeleteReportDialog show={this.state.showDeleteDialog} onClose={this.onDeleteCancel}
                                   onSubmit={this._onDelete}/>;
    },

    renderReadOnlyButtons: function (notice = 'revisions.readonly-notice') {
        return <div>
            <ButtonToolbar className='float-right detail-button-toolbar'>
                <Button bsStyle='link' bsSize='small' title={this.i18n('cancel-tooltip')}
                        onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
            </ButtonToolbar>
            <div style={{clear: 'both'}}/>
            <div className='notice-small float-right'>
                {this.i18n(notice)}
            </div>
        </div>;
    }
};

module.exports = ReportDetailMixin;
