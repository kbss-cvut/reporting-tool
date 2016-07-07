'use strict';

import React from "react";
import assign from "object-assign";
import Typeahead from "react-bootstrap-typeahead";
import TypeaheadResultList from "../../typeahead/TypeaheadResultList";
import Input from "../../Input";
import Actions from "../../../actions/Actions";
import Constants from "../../../constants/Constants";
import FormGenStore from "../../../stores/FormGenStore";
import FormUtils from "./FormUtils";
import I18nStore from "../../../stores/I18nStore";
import JsonLdUtils from "../../../utils/JsonLdUtils";
import Utils from "../../../utils/Utils";
import Vocabulary from "../../../constants/Vocabulary";

export default class Answer extends React.Component {
    static propTypes = {
        answer: React.PropTypes.object.isRequired,
        question: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        index: React.PropTypes.number
    };

    constructor(props) {
        super(props);
        if (FormUtils.isTypeahead(this.props.question)) {
            this._queryHash = Utils.getStringHash(FormUtils.getPossibleValuesQuery(this.props.question));
        }
        this.state = {
            options: this._queryHash ? FormGenStore.getOptions(this._queryHash) : []
        }
    }

    componentWillMount() {
        var question = this.props.question;
        if (FormUtils.isTypeahead(question)) {
            if (!question[Constants.FORM.HAS_OPTION] && FormUtils.getPossibleValuesQuery(question)) {
                Actions.loadFormOptions(this._queryHash, FormUtils.getPossibleValuesQuery(question));
            } else {
                this.setState({options: Utils.processTypeaheadOptions(question[Constants.FORM.HAS_OPTION])});
            }
        }
    }

    componentDidMount() {
        this.unsubscribe = FormGenStore.listen(this._onOptionsLoaded);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onOptionsLoaded = (type, options) => {
        if (type !== this._queryHash) {
            return;
        }
        options = Utils.processTypeaheadOptions(options);
        var value = FormUtils.resolveValue(this.props.answer),
            selected = options.find((item) => {
                return item.id === value;
            });
        this.setState({options: options});
        this.refs.typeahead.selectOption(selected);
    };

    onChange = (e) => {
        var change = assign({}, this.props.answer);
        this._setValue(change, e.target.value);
        this.props.onChange(this.props.index, change);
    };

    _setValue(change, value) {
        if (this.props.answer[Constants.FORM.HAS_OBJECT_VALUE]) {
            change[Constants.FORM.HAS_OBJECT_VALUE] = {
                '@id': value
            };
        } else {
            change[Constants.FORM.HAS_DATA_VALUE] = {
                '@value': value
            };
        }
    }

    _onOptionSelected = (option) => {
        var change = assign({}, this.props.answer);
        this._setValue(change, option.id);
        this.props.onChange(this.props.index, change);
    };
    

    render() {
        return this._renderInputComponent();
    }

    _renderInputComponent() {
        var question = this.props.question,
            value = FormUtils.resolveValue(this.props.answer),
            label = JsonLdUtils.getLocalized(question[Vocabulary.RDFS_LABEL], I18nStore.getIntl()),
            title = JsonLdUtils.getLocalized(question[Vocabulary.RDFS_COMMENT], I18nStore.getIntl()),
            component;

        if (FormUtils.isTypeahead(question)) {
            value = Utils.idToName(this.state.options, value);
            var inputProps = {
                disabled: FormUtils.isDisabled(question)
            };
            component = <div>
                <label className='control-label'>{label}</label>
                <Typeahead ref='typeahead' className='form-group form-group-sm' formInputOption='id'
                           inputProps={inputProps}
                           title={title} value={value} label={label} placeholder={label} filterOption='name'
                           displayOption='name' onOptionSelected={this._onOptionSelected} optionsButton={true}
                           options={this.state.options} customListComponent={TypeaheadResultList}/>
            </div>;
        } else if (Answer._hasOptions(question)) {
            component =
                <Input type='select' label={label} value={value} title={title} onChange={this.onChange}
                       disabled={FormUtils.isDisabled(question)}>
                    {this._generateSelectOptions(question[Constants.FORM.HAS_OPTION])}
                </Input>;
        } else {
            var answer = this.props.answer;
            // TODO This is temporary to show labels for IRI-based values
            if (answer[Constants.FORM.HAS_OBJECT_VALUE] && answer[Constants.FORM.HAS_OBJECT_VALUE][Vocabulary.RDFS_LABEL]) {
                value = Utils.getJsonAttValue(answer[Constants.FORM.HAS_OBJECT_VALUE], Vocabulary.RDFS_LABEL);
            }
            var inputType = FormUtils.isTextarea(question, value) ? 'textarea' : 'text';
            component = <Input type={inputType} label={label} title={title} value={value} onChange={this.onChange}
                               disabled={FormUtils.isDisabled(question)} rows={5}/>;
        }
        return component;
    }

    static _hasOptions(item) {
        return item[Constants.FORM.HAS_OPTION] && item[Constants.FORM.HAS_OPTION].length !== 0;
    }

    _generateSelectOptions(options) {
        var rendered = [];
        options.sort(function (a, b) {
            var aLabel = Utils.getJsonAttValue(a, Vocabulary.RDFS_LABEL),
                bLabel = Utils.getJsonAttValue(b, Vocabulary.RDFS_LABEL);
            if (aLabel < bLabel) {
                return -1;
            }
            if (aLabel > bLabel) {
                return 1;
            }
            return 0;
        });
        for (var i = 0, len = options.length; i < len; i++) {
            rendered.push(<option value={Utils.getJsonAttValue(options[i], Vocabulary.RDFS_LABEL)}
                                  key={'opt-' + i}>{Utils.getJsonAttValue(options[i], Vocabulary.RDFS_LABEL)}</option>);
        }
        return rendered;
    }
}
