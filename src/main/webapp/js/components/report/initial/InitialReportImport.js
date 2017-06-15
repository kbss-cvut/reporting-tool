'use strict';

import React from "react";
import {Button, Modal} from "react-bootstrap";
import Actions from "../../../actions/Actions";
import Input from "../../Input";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";
import MessageWrapper from "../../misc/hoc/MessageWrapper";

class InitialReportImport extends React.Component {
    static propTypes = {
        onImportFinish: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            content: ''
        };
    }

    componentDidMount() {
        this.input.focus();
    }

    _onChange = (e) => {
        this.setState({content: e.target.value});
    };

    _onImport = () => {
        // This will be replaced by a call to backend, which will execute analysis of the text content
        this.props.loadingOn(this.i18n('report.initial.import.importing-msg'));
        Actions.importInitialReport({description: this.state.content}, this._onImportSuccess, this._onImportError);
    };

    _onImportSuccess = (report) => {
        this.props.loadingOff();
        this.props.onImportFinish(report);
    };

    _onImportError = (err) => {
        this.props.loadingOff();
        this.props.showErrorMessage(err.message);
    };

    render() {
        return <Modal show={true} bsSize="large" onHide={this.props.onCancel} animation={true}>
            <Modal.Header closeButton>
                <Modal.Title>{this.i18n('report.initial.import.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body ref={c => this.modalBody = c}>
                <Input ref={c => this.input = c} type='textarea' rows={12}
                       label={this.i18n('report.initial.text.label')}
                       title={this.i18n('report.initial.import.text.tooltip')}
                       placeholder={this.i18n('report.initial.import.text.tooltip')}
                       value={this.state.content} onChange={this._onChange}/>
            </Modal.Body>
            <Modal.Footer ref={c => this.modalFooter = c}>
                <Button onClick={this._onImport} bsStyle='primary' bsSize='small'
                        disabled={this.state.content.length === 0}>
                    {this.i18n('report.initial.import.run')}
                </Button>
                <Button onClick={this.props.onCancel} bsSize='small'>{this.i18n('cancel')}</Button>
            </Modal.Footer>
        </Modal>;
    }
}

export default injectIntl(MessageWrapper(LoadingWrapper(I18nWrapper(InitialReportImport))));
