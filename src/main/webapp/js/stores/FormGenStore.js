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
var Ajax = require('../utils/Ajax');
var Logger = require('../utils/Logger');

var options = {};

var FormGenStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.loadFormOptions, this.onLoadFormOptions);
    },

    onLoadFormOptions: function (id, query) {
        if (options[id] && options[id].length !== 0) {
            this.trigger(id, options[id]);
            return;
        }
        Ajax.get('rest/formGen/possibleValues?query=' + encodeURIComponent(query)).end(function (data) {
            if (data.length > 0) {
                jsonld.frame(data, {}, null, function (err, framed) {
                    options[id] = framed['@graph'];
                    this.trigger(id, options[id]);
                }.bind(this));
            } else {
                Logger.warn('No data received when loading options using query' + query + '.');
                this.trigger(id, this.getOptions(id));
            }

        }.bind(this), function () {
            this.trigger(id, this.getOptions(id));
        }.bind(this));
    },

    getOptions: function (id) {
        return options[id] ? options[id] : [];
    }
});

module.exports = FormGenStore;
