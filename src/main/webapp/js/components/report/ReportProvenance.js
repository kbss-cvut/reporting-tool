'use strict';

import React from "react";
import {Label} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import JsonLdUtils from "../../utils/JsonLdUtils";
import OptionsStore from "../../stores/OptionsStore";
import Utils from "../../utils/Utils";
import Vocabulary from "../../constants/Vocabulary";

class ReportProvenance extends React.Component {
    static propTypes = {
        report: React.PropTypes.object.isRequired,
        revisions: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            phase: this._resolvePhase()
        }
    }

    componentDidMount() {
        if (!this.state.phase) {
            this.unsubscribe = OptionsStore.listen(this._onPhasesLoaded);
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    _resolvePhase() {
        var phase = this.props.report.phase;
        return OptionsStore.getOptions('reportingPhase').find((item) => {
            return item['@id'] === phase;
        });
    }

    _onPhasesLoaded = (type) => {
        if (type === 'reportingPhase') {
            this.setState({phase: this._resolvePhase()});
        }
    };

    _renderProvenanceInfo() {
        var report = this.props.report;
        if (report.isNew) {
            return null;
        }
        var author = report.author ? report.author.firstName + ' ' + report.author.lastName : '',
            created = Utils.formatDate(new Date(report.dateCreated)),
            lastEditor, lastModified;
        if (!report.lastModified) {
            return <div className='notice-small'>
                <FormattedMessage id='report.created-by-msg'
                                  values={{date: created, name: <b>{author}</b>}}/>
            </div>;
        }
        lastEditor = report.lastModifiedBy ? report.lastModifiedBy.firstName + ' ' + report.lastModifiedBy.lastName : '';
        lastModified = Utils.formatDate(new Date(report.lastModified));
        return <div className='notice-small'>
            <FormattedMessage id='report.created-by-msg'
                              values={{date: created, name: <b>{author}</b>}}/>
            &nbsp;
            <FormattedMessage id='report.last-edited-msg'
                              values={{date: lastModified, name: <b>{lastEditor}</b>}}/>
        </div>;
    }

    _renderPhaseInfo() {
        var i18n = this.props.i18n,
            phaseSpec = this.state.phase;
        if (phaseSpec) {
            return <div className='form-group'>
                <Label
                    title={i18n('reports.phase')}>{JsonLdUtils.getLocalized(phaseSpec[Vocabulary.RDFS_LABEL], this.props.intl)}</Label>
            </div>;
        } else {
            return null;
        }
    }

    render() {
        return <div>
            <div className='row'>
                <div className='col-xs-4'>
                    {this.props.revisions}
                </div>
            </div>
            {this._renderPhaseInfo()}
            {this._renderProvenanceInfo()}
        </div>;
    }
}

export default injectIntl(I18nWrapper(ReportProvenance));
