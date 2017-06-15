'use strict';

import React from "react";
import {Button, Modal} from "react-bootstrap";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";

const DeleteFactorDialog = (props) => {
    return <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header>
            <Modal.Title>{props.i18n('factors.detail.delete.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.i18n('factors.detail.delete.text')}
        </Modal.Body>
        <Modal.Footer>
            <Button bsSize='small' bsStyle='warning' onClick={props.onSubmit}>{props.i18n('delete')}</Button>
            <Button bsSize='small' onClick={props.onCancel}>{props.i18n('cancel')}</Button>
        </Modal.Footer>
    </Modal>;
};

DeleteFactorDialog.propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired
};

export default injectIntl(I18nWrapper(DeleteFactorDialog));
