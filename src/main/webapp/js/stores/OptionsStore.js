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
'use strict';

var Reflux = require('reflux');
var jsonld = require('jsonld');

var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Ajax = require('../utils/Ajax');
var Logger = require('../utils/Logger');

var options = {};

var OptionsStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.loadOptions, this.onLoadOptions);
    },

    onLoadOptions: function (type) {
        if (type) {
            this._loadOptions(type);
        } else {
            this._loadOptions(Constants.OPTIONS.OCCURRENCE_CLASS);
        }
    },

    _loadOptions: function (type) {
        if (options[type] && options[type].length !== 0) {
            this.trigger(type, options[type]);
            return;
        }
        Ajax.get('rest/options?type=' + type).end(function (data) {
            if (data.length > 0) {
                jsonld.frame(data, {}, null, function (err, framed) {
                    options[type] = framed['@graph'];
                    this.trigger(type, options[type]);
                }.bind(this));
            } else {
                Logger.warn('No data received when loading options of type ' + type + '.');
                this.trigger(type, this.getOptions(type));
            }

        }.bind(this), function () {
            this.trigger(type, this.getOptions(type));
        }.bind(this));
    },

    getOptions: function (type) {
        return options[type] ? options[type] : [];
    }
});

module.exports = OptionsStore;
