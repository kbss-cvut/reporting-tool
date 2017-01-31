/*
 * Copyright (C) 2016 Czech Technical University in Prague
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
'use strict';

import React from "react";
import {Col, Grid, Jumbotron, Row} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Tile from "./DashboardTile";
import RecentlyEdited from "./RecentlyEditedReports";

class Dashboard extends React.Component {

    static propTypes = {
        createEmptyReport: React.PropTypes.func.isRequired,
        showAllReports: React.PropTypes.func.isRequired,
        openReport: React.PropTypes.func.isRequired,
        userFirstName: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    render() {
        return <div className='row'>
            <div className='dashboard-left'>
                <Jumbotron>
                    {this.renderTitle()}
                    {this.renderDashboardContent()}
                </Jumbotron>
            </div>
            <div className='dashboard-right'>
                <div>
                    <RecentlyEdited reports={this.props.reports} onOpenReport={this.props.openReport}/>
                </div>
            </div>
        </div>;
    }

    renderTitle() {
        return <h3><FormattedMessage id='dashboard.welcome'
                                     values={{name: <span className='bold'>{this.props.userFirstName}</span>}}/>
        </h3>;
    }

    renderDashboardContent() {
        return this._renderMainDashboard();
    }

    _renderMainDashboard() {
        return <Grid fluid={true}>
            <Row>
                <Col xs={6} className='dashboard-sector'>
                    <Tile onClick={this.props.createEmptyReport}>{this.i18n('dashboard.create-tile')}</Tile>
                </Col>
                <Col xs={6} className='dashboard-sector'>
                    <Tile
                        onClick={this.props.showAllReports}>{this.i18n('dashboard.view-all-tile')}</Tile>
                </Col>
            </Row>
        </Grid>;
    }
}

export default injectIntl(I18nWrapper(Dashboard));
