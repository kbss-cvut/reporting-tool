'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');

var SearchStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.fullTextSearch, this.onFullTextSearch);
    },

    onFullTextSearch: function (expr) {
        Ajax.get('rest/search?expression=' + encodeURIComponent(expr)).end((data) => {
            this.trigger({
                action: Actions.fullTextSearch,
                data: data
            });
        });
    }
});

module.exports = SearchStore;
