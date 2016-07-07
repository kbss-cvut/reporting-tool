/**
 * @jsx
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');
var Typeahead = require('react-bootstrap-typeahead');
var TypeaheadResultList = require('../../typeahead/EventTypeTypeaheadResultList').default;

var injectIntl = require('../../../utils/injectIntl');

var Actions = require('../../../actions/Actions');
var Select = require('../../Select');
var OptionsStore = require('../../../stores/OptionsStore');
var TypeaheadStore = require('../../../stores/TypeaheadStore');
var I18nMixin = require('../../../i18n/I18nMixin');
var Constants = require('../../../constants/Constants');
var Vocabulary = require('../../../constants/Vocabulary');
var ExternalLink = require('../../misc/ExternalLink').default;
var Utils = require('../../../utils/Utils');

var OccurrenceClassification = React.createClass({
    mixins: [Reflux.ListenerMixin, I18nMixin],

    propTypes: {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            occurrenceClasses: OptionsStore.getOptions(Constants.OPTIONS.OCCURRENCE_CLASS),
            occurrenceCategories: Utils.processTypeaheadOptions(TypeaheadStore.getOccurrenceCategories())
        };
    },

    componentDidMount: function () {
        this.listenTo(OptionsStore, this.onOccurrenceClassesLoaded);
        this.listenTo(TypeaheadStore, this.onOccurrenceCategoriesLoaded)
    },

    onOccurrenceClassesLoaded: function (type, data) {
        if (type !== Constants.OPTIONS.OCCURRENCE_CLASS) {
            return;
        }
        this.setState({occurrenceClasses: data});
    },

    _transformOccurrenceClasses: function () {
        return this.state.occurrenceClasses.map((item) => {
            return {
                value: item['@id'],
                label: Utils.getJsonAttValue(item, Vocabulary.RDFS_LABEL),
                title: Utils.getJsonAttValue(item, Vocabulary.RDFS_COMMENT)
            };
        });
    },

    onOccurrenceCategoriesLoaded: function (data) {
        if (data.action !== Actions.loadOccurrenceCategories) {
            return;
        }
        var options = data.data;
        this.setState({occurrenceCategories: Utils.processTypeaheadOptions(options)});
        var selected = this._resolveSelectedCategory();
        if (selected) {
            this.refs.occurrenceCategory.selectOption(selected);
        }
    },

    onChange: function (e) {
        var change = {};
        change[e.target.name] = e.target.value;
        this.props.onChange(change);
    },

    onCategorySelect: function (cat) {
        var occurrence = this.props.report.occurrence;
        occurrence.eventType = cat.id;
        this.props.onChange({'occurrence': occurrence});
    },

    _onShowCategories: function () {
        this.refs.occurrenceCategory.showOptions();
    },

    render: function () {
        var classes = {
                input: 'form-control'
            },
            report = this.props.report;
        return (
            <div className='row'>
                <div className='col-xs-4'>
                    <Select label={this.i18n('occurrence.class') + '*'} name='severityAssessment'
                            title={this.i18n('occurrence.class-tooltip')} addDefault={true}
                            value={report.severityAssessment} options={this._transformOccurrenceClasses()}
                            onChange={this.onChange}/>
                </div>
                <div className='col-xs-4'>
                    <label className='control-label'>
                        {this.i18n('report.occurrence.category.label') + '*'}
                    </label>
                    <Typeahead className='form-group form-group-sm' name='occurrenceCategory'
                               ref='occurrenceCategory' formInputOption='id' optionsButton={true}
                               placeholder={this.i18n('report.occurrence.category.label')}
                               onOptionSelected={this.onCategorySelect} filterOption='name'
                               value={this._resolveCategoryValue()}
                               displayOption='name' options={this.state.occurrenceCategories}
                               customClasses={classes} customListComponent={TypeaheadResultList}/>
                </div>
                {this._renderCategoryLink()}
            </div>
        );
    },

    _resolveCategoryValue: function () {
        var cat = this._resolveSelectedCategory();
        return cat ? cat.name : '';
    },

    _resolveSelectedCategory: function () {
        var catId = this.props.report.occurrence.eventType,
            categories = this.state.occurrenceCategories;
        return categories.find(function (item) {
            return item.id === catId;
        });
    },

    _renderCategoryLink: function () {
        var cat = this.props.report.occurrence.eventType;
        return cat ?
            <div className='col-xs-1'><ExternalLink url={cat} title={this._resolveCategoryValue() + '\n' + cat}/>
            </div> : null;
    }
});

module.exports = injectIntl(OccurrenceClassification);
