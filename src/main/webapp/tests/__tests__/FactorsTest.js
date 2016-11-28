'use strict';

describe('Factors component tests', function () {

    var React = require('react'),
        rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Factors = rewire('../../js/components/factor/Factors'),
        FactorRenderer = rewire('../../js/components/factor/FactorRenderer'),
        Actions = require('../../js/actions/Actions'),
        Constants = require('../../js/constants/Constants'),
        Utils = require('../../js/utils/Utils'),
        GanttController = null, onChange,
        report = {
            occurrence: {
                name: 'TestOccurrence',
                startTime: Date.now() - 10000,
                endTime: Date.now()
            }
        };

    beforeEach(function () {
        GanttController = jasmine.createSpyObj('GanttController', ['init', 'getFactor', 'setScale', 'addFactor', 'setRootEventId', 'expandSubtree', 'updateRootEvent', 'getChildCount']);
        Factors.__set__('GanttController', GanttController);
        FactorRenderer.__set__('GanttController', GanttController);
        Factors.__set__('FactorRenderer', FactorRenderer);
        GanttController.getFactor.and.returnValue({
            text: report.occurrence.name,
            start_date: new Date(report.occurrence.startTime)
        });
        GanttController.getChildCount.and.returnValue(0);
        onChange = jasmine.createSpy('onChange');
        spyOn(Actions, 'loadOptions');
        jasmine.getGlobal().gantt = {
            config: {
                duration_unit: 'second'
            }
        };
    });

    it('Determines correct scale on component mount', function () {
        spyOn(Utils, 'determineTimeScale').and.callThrough();
        Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>);
        expect(GanttController.init).toHaveBeenCalled();
        expect(GanttController.setScale).toHaveBeenCalled();
        expect(Utils.determineTimeScale).toHaveBeenCalledWith(report.occurrence);
    });

    it('Adds event of the occurrence into gantt on initialization', function () {
        var factor = null;
        GanttController.addFactor.and.callFake(function (arg) {
            factor = arg;
        });
        var factors = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>);
        factors.renderFactors([]);
        expect(GanttController.addFactor).toHaveBeenCalled();
        expect(factor).toBeDefined();
        expect(factor.text).toEqual(report.occurrence.name);
        expect(factor.start_date).toEqual(new Date(report.occurrence.startTime));
    });

    it('Sets scale to seconds when seconds are selected', function () {
        var evt = {target: {value: 'second'}},
            factors = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>);
        factors.onScaleChange(evt);
        expect(GanttController.setScale).toHaveBeenCalledWith('second');
    });

    it('Adds new factor without parent to gantt when factor at top level is created', () => {
        var factors = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>),
            newFactor = {
                duration: 2,
                durationUnit: 'minute',
                isNew: true,
                id: Generator.getRandomInt(),
                start_date: new Date(Date.now()),
                end_date: new Date(Date.now() + 2 * 60 * 60 * 1000),
                text: '2180100 - Loss of Separation',
                statement: {}
            };
        factors.renderFactors([]);
        factors.state.currentFactor = newFactor;
        factors.onSaveFactor();
        expect(GanttController.addFactor).toHaveBeenCalled();
        expect(GanttController.getFactor).not.toHaveBeenCalled();
        // First call is to add the occurrence event itself
        var added = GanttController.addFactor.calls.argsFor(1)[0];
        expect(added.id).toEqual(newFactor.id);
        expect(added.parent).not.toBeDefined();
    });

    it('Assigns reference id to new factors', () => {
        var referenceId = 117,
            newFactor = {
                isNew: true,
                text: 'Test',
                start_date: new Date(),
                end_date: new Date(),
                statement: {},
                parent: referenceId
            }, parent = {
                id: referenceId,
                statement: report.occurrence
            },
            component;
        report.occurrence.referenceId = referenceId;
        GanttController.getFactor.and.returnValue(parent);
        component = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>);
        component.renderFactors([]);
        component.onCreateFactor(newFactor);

        expect(newFactor.statement.referenceId).toEqual(referenceId + 1);
        expect(component.state.currentFactor).toEqual(newFactor);
    });

    it('Renders factor graph only after event types have been loaded', () => {
        spyOn(FactorRenderer, 'renderFactors');
        var factors = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>),
            eventTypes = Generator.getJsonLdSample(),
            OptionsStore = require('../../js/stores/OptionsStore');
        expect(FactorRenderer.renderFactors).not.toHaveBeenCalled();
        OptionsStore.trigger('eventType', eventTypes);
        expect(FactorRenderer.renderFactors).toHaveBeenCalledWith(report, eventTypes);
    });

    it('Sets event position when new child event is added to a parent', () => {
        var factors = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>),
            childCount = Generator.getRandomPositiveInt(1, 5),
            referenceId = 117,
            newFactor = {
                isNew: true,
                text: 'Test',
                statement: {},
                parent: referenceId
            }, parent = {
                id: referenceId,
                statement: report.occurrence
            },
            component;
        report.occurrence.referenceId = referenceId;
        GanttController.getChildCount.and.returnValue(childCount);
        GanttController.getFactor.and.returnValue(parent);
        component = Environment.render(<Factors report={report} rootAttribute='occurrence' onChange={onChange}/>);
        component.renderFactors([]);
        component.setState({
            currentFactor: newFactor
        });
        component.onSaveFactor();

        expect(newFactor.statement.index).toEqual(childCount);
    });
});
