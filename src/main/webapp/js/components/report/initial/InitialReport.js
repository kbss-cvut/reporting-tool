'use strict';

import React from "react";
import {Button, Modal} from "react-bootstrap";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Input from "../../Input";
import TextAnalysisResult from "./TextAnalysisResult";

class InitialReport extends React.Component {
    static propTypes = {
        initialReport: React.PropTypes.object.isRequired,
        onClose: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    render() {
       const initialReport = this.props.initialReport;
        return <Modal show={true} bsSize="large" onHide={this.props.onClose} animation={true}>
            <Modal.Header closeButton>
                <Modal.Title>{this.i18n('report.initial.label')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input type='textarea' rows={12} label={this.i18n('report.initial.text.label')}
                       title={this.i18n('narrative')} value={initialReport.description} readOnly/>
                <TextAnalysisResult items={initialReport.extractedItems}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.props.onClose} bsSize='small'>{this.i18n('close')}</Button>
            </Modal.Footer>
        </Modal>;
    }
}

export default injectIntl(I18nWrapper(InitialReport));
