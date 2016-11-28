'use strict';

import React from "react";
import {ClipLoader} from "halogen";
import I18Store from "../stores/I18nStore";

const Mask = (props) => {
    var text = props.text ? props.text : I18Store.i18n('please-wait');
    return (
        <div className={props.classes ? props.classes : 'mask'}>
            <div className='spinner-container'>
                <div style={{width: 32, height: 32, margin: 'auto'}}>
                    <ClipLoader color='#337ab7' size='32px'/>
                </div>
                <div className='spinner-message'>{text}</div>
            </div>
        </div>
    );
};

Mask.propTypes = {
    text: React.PropTypes.string,
    classes: React.PropTypes.string
};

export default Mask;
