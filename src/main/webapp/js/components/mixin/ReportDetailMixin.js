'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;

/**
 * Aggregates some of the functionality of the report detail view.
 */
var ReportDetailMixin = {

    onChange: function (e) {
        var attributeName = e.target.name;
        this.onAttributeChange(attributeName, e.target.value);
    },

    onLoading: function() {
        this.setState({submitting: true});
    },
    
    onLoadingEnd: function() {
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
    
    onPhaseTransitionSuccess: function() {
        this.onLoadingEnd();
        this.showSuccessMessage(this.i18n('detail.phase-transition-success-message'));
        this.props.handlers.onSuccess();
    },
    
    onPhaseTransitionError: function(error) {
        this.onLoadingEnd();
        this.showErrorMessage(this.i18n('detail.phase-transition-failed-message') + error.message);
    },


    renderReadOnlyButtons: function () {
        return (
            <div>
                <div className='float-right'>
                    <Button bsStyle='link' bsSize='small' title={this.i18n('cancel-tooltip')}
                            onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
                </div>
                <div style={{clear: 'both'}}/>
                <div className='notice-small float-right'>
                    {this.i18n('revisions.readonly-notice')}
                </div>
            </div>);
    }
};

module.exports = ReportDetailMixin;
