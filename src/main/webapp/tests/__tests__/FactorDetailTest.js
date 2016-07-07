'use strict';


describe('Factor detail dialog', function () {

    var React = require('react'),
        assign = require('object-assign'),
        Environment = require('../environment/Environment'),
        Constants = require('../../js/constants/Constants'),
        GanttController = require('../../js/components/factor/GanttController'),
        FactorDetail = require('../../js/components/factor/FactorDetail'),
        ReportFactory = require('../../js/model/ReportFactory'),
        callbacks,
        gantt = {
            calculateEndDate: function () {
                return new Date();
            },
            config: {
                duration_unit: 'second'
            },
            render: function () {
            }
        },
        factor;

    beforeEach(function () {
        callbacks = jasmine.createSpyObj('callbacks', ['onSave', 'onClose', 'onDelete', 'getReport']);
        jasmine.getGlobal().gantt = gantt;
        factor = {
            id: 1,
            text: 'Test',
            start_date: new Date(),
            duration: 1,
            durationUnit: 'minute',
            statement: ReportFactory.createFactor()
        };
    });

    it('Updates factor with new values upon save', function () {
        var detail, newDuration = 10,
            eventType = {
                name: 'Runway Incursion',
                id: 'http://incursion'
            },
            question = {},
            value = 'SomeImportantValue';
        question[Constants.FORM.HAS_ANSWER] = [{}];
        question[Constants.FORM.HAS_ANSWER][0][Constants.FORM.HAS_DATA_VALUE] = {
            '@value': value
        };
        spyOn(gantt, 'calculateEndDate').and.callThrough();
        detail = Environment.render(<FactorDetail scale='minute' factor={factor} onSave={callbacks.onSave}
                                                  onClose={callbacks.onClose}
                                                  onDelete={callbacks.onDelete}
                                                  getReport={callbacks.getReport}/>);
        detail.onDurationSet({target: {value: newDuration}});
        detail.onEventTypeChange(eventType);
        detail.onUpdateFactorDetails({stepData: [question]}, function () {
        });
        detail.onSave();
        expect(gantt.calculateEndDate).toHaveBeenCalledWith(factor.start_date, newDuration, gantt.config.duration_unit);
        expect(factor.end_date).toBeDefined();
        expect(callbacks.onSave).toHaveBeenCalled();
        expect(factor.statement.question.subQuestions[0]).toBeDefined();
        expect(factor.statement.question.subQuestions[0].answers[0]).toBeDefined();
        expect(factor.statement.question.subQuestions[0].answers[0].textValue).toEqual(value);
    });

    it('Preserves factor state until save is called', function () {
        var detail, newDuration = 10,
            eventType = {
                name: 'Runway Incursion',
                id: 'http://incursion'
            },
            origFactor = assign({}, factor),
            question = {};
        question[Constants.FORM.HAS_ANSWER] = [{
            value: 'someValue'
        }];
        detail = Environment.render(<FactorDetail scale='minute' factor={factor} onSave={callbacks.onSave}
                                                  onClose={callbacks.onClose}
                                                  onDelete={callbacks.onDelete}
                                                  getReport={callbacks.getReport}/>);
        detail.onDurationSet({target: {value: newDuration}});
        detail.onEventTypeChange(eventType);
        detail.onUpdateFactorDetails({stepData: [question]}, function () {
        });

        expect(factor).toEqual(origFactor);
    });

    it('Calculates event duration based on scale', () => {
        var origDuration = factor.duration,
            detail, nextProps;

        detail = Environment.render(<FactorDetail scale='second' factor={factor} onSave={callbacks.onSave}
                                                  onClose={callbacks.onClose}
                                                  onDelete={callbacks.onDelete}
                                                  getReport={callbacks.getReport}/>);
        expect(detail.state.duration).toEqual(factor.duration * 60);    // factor duration is in minutes
    })
});
