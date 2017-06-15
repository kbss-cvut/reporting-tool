'use strict';

var Reflux = require('reflux');
var assign = require('object-assign');

var WizardStore = Reflux.createStore({

    _stepData: [],
    _data: {},

    initWizard: function (data, stepData) {
        this._data = data ? assign({}, data) : {};
        this._stepData = [];
        if (stepData) {
            for (var i = 0, len = stepData.length; i < len; i++) {
                this._stepData.push(assign({}, stepData[i]));
            }
        }
    },

    updateData: function (update) {
        if (!update) {
            return;
        }
        // Defensive copy
        this._data = assign({}, this._data, update);
        this.trigger();
    },

    updateStepData: function (index, update) {
        if (!update || index < 0 || index >= this._stepData.length) {
            return;
        }
        var step = this._stepData[index];
        // Defensive copy
        this._stepData[index] = assign({}, step, update);
        this.trigger();
    },

    /**
     * Inserts the specified step data at the specified index, shifting the existing step data (if present) to the
     * right.
     * @param index Index at which to insert step data
     * @param stepData The data to insert
     */
    insertStep: function (index, stepData) {
        this._stepData.splice(index, 0, stepData ? assign({}, stepData) : {});
        this.trigger();
    },

    removeStep: function (index) {
        this._stepData.splice(index, 1);
        this.trigger();
    },

    reset: function () {
        this._data = {};
        this._stepData = [];
    },

    getData: function () {
        return this._data;
    },

    getStepData: function (index) {
        return (index !== undefined && index !== null) ? this._stepData[index] : this._stepData;
    }
});

module.exports = WizardStore;
