/*
 * Copyright (C) 2017 Czech Technical University in Prague
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
import React from "react";
import PropTypes from "prop-types";
import {Modal} from "react-bootstrap";
import assign from "object-assign";

import Wizard from "./Wizard";

const WizardWindow = (props) => {
    const properties = assign({}, props, {onClose: props.onHide}),
        modalProps = assign({}, props);
    delete modalProps.steps;
    delete modalProps.onFinish;
    delete modalProps.start;
    delete modalProps.readOnly;
    delete modalProps.enableForwardSkip;

    return <Modal {...modalProps} show={props.show} bsSize="large" title={props.title}
                  animation={true} dialogClassName="large-modal">
        <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>

        <div className="modal-body" style={{overflow: 'hidden'}}>
            <Wizard {...properties}/>
        </div>
    </Modal>;
};

WizardWindow.propTypes = {
    onHide: PropTypes.func,
    title: PropTypes.string,
    show: PropTypes.bool
};

export default WizardWindow;
