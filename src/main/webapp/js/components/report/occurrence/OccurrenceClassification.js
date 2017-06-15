'use strict';

var React = require('react');
var Reflux = require('reflux');
var Typeahead = require('react-bootstrap-typeahead');
var TypeaheadResultList = require('../../typeahead/EventTypeTypeaheadResultList').default;
var JsonLdUtils = require('jsonld-utils').default;

var injectIntl = require('../../../utils/injectIntl');

var Select = require('../../Select');
var OptionsStore = require('../../../stores/OptionsStore');
var I18nMixin = require('../../../i18n/I18nMixin');
var Constants = require('../../../constants/Constants');
var Vocabulary = require('../../../constants/Vocabulary');
var ExternalLink = require('../../misc/ExternalLink').default;

var OccurrenceClassification = React.createClass({
    mixins: [Reflux.ListenerMixin, I18nMixin],

    propTypes: {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            occurrenceClasses: OptionsStore.getOptions(Constants.OPTIONS.OCCURRENCE_CLASS),
            occurrenceCategories: JsonLdUtils.processTypeaheadOptions(OptionsStore.getOptions(Constants.OPTIONS.OCCURRENCE_CATEGORY))
        };
    },

    componentDidMount: function () {
        this.listenTo(OptionsStore, this._onOptionsLoaded);
    },

    _onOptionsLoaded: function (type, data) {
        if (type === Constants.OPTIONS.OCCURRENCE_CLASS) {
            this.setState({occurrenceClasses: data});
        } else if (type === Constants.OPTIONS.OCCURRENCE_CATEGORY) {
            this.setState({occurrenceCategories: JsonLdUtils.processTypeaheadOptions(data)});
            var selected = this._resolveSelectedCategory();
            if (selected) {
                this.refs.occurrenceCategory.selectOption(selected);
            }
        }
    },

    _transformOccurrenceClasses: function () {
        return this.state.occurrenceClasses.map((item) => {
            return {
                value: item['@id'],
                label: JsonLdUtils.getJsonAttValue(item, Vocabulary.RDFS_LABEL),
                title: JsonLdUtils.getJsonAttValue(item, Vocabulary.RDFS_COMMENT)
            };
        });
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
        var report = this.props.report;
        return <div className='row'>
            <div className='col-xs-4'>
                <Select label={this.i18n('occurrence.class') + '*'} name='severityAssessment'
                        title={this.i18n('occurrence.class-tooltip')} addDefault={true}
                        value={report.severityAssessment} options={this._transformOccurrenceClasses()}
                        onChange={this.onChange}/>
            </div>
            <div className='col-xs-4'>
                <Typeahead name='occurrenceCategory' label={this.i18n('report.occurrence.category.label') + '*'}
                           ref='occurrenceCategory' formInputOption='id' optionsButton={true}
                           placeholder={this.i18n('report.occurrence.category.label')}
                           onOptionSelected={this.onCategorySelect} filterOption='name'
                           value={this._resolveCategoryValue()} size='small'
                           displayOption='name' options={this.state.occurrenceCategories}
                           customListComponent={TypeaheadResultList}/>
            </div>
            {this._renderCategoryLink()}
        </div>;
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
