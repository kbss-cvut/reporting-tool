'use strict';


describe('Factor detail dialog', function () {

    var React = require('react'),
        assign = require('object-assign'),
        TestUtils = require('react-addons-test-utils'),
        QuestionAnswerProcessor = require('semforms').QuestionAnswerProcessor,
        Environment = require('../environment/Environment'),
        Actions = require('../../js/actions/Actions'),
        Constants = require('../../js/constants/Constants'),
        FactorDetail = require('../../js/components/factor/FactorDetail'),
        ReportFactory = require('../../js/model/ReportFactory'),
        DateTimePicker = require('kbss-react-bootstrap-datetimepicker').default,
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
        spyOn(Actions, 'loadOptions');
    });

    it('Updates factor with new values upon save', function () {
        var detail, newDuration = 10,
            eventType = {
                name: 'Runway Incursion',
                id: 'http://incursion'
            },
            value = 'SomeImportantValue',
            statement = {
                question: {
                    subQuestions: [{
                        answers: [{
                            textValue: value
                        }]
                    }]
                }
            };
        spyOn(gantt, 'calculateEndDate').and.callThrough();
        detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.MINUTE} factor={factor}
                                                  onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                  onDelete={callbacks.onDelete} getReport={callbacks.getReport}/>);
        detail.onDurationSet({target: {value: newDuration}});
        detail.onEventTypeChange(eventType);
        detail.setState({statement: statement});
        detail.onSave();
        expect(gantt.calculateEndDate).toHaveBeenCalledWith(factor.start_date, newDuration, gantt.config.duration_unit);
        expect(factor.end_date).toBeDefined();
        expect(callbacks.onSave).toHaveBeenCalled();
        expect(factor.statement).toEqual(statement);
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
            statement = {
                question: {
                    subQuestions: [{
                        answers: [{
                            textValue: "someValue"
                        }]
                    }]
                }
            };
        detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.MINUTE} factor={factor}
                                                  onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                  onDelete={callbacks.onDelete} getReport={callbacks.getReport}/>);
        detail.onDurationSet({target: {value: newDuration}});
        detail.onEventTypeChange(eventType);
        detail.setState({statement: statement});

        expect(factor).toEqual(origFactor);
    });

    it('Calculates event duration based on scale', () => {
        var detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.SECOND} factor={factor}
                                                      onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                      onDelete={callbacks.onDelete} getReport={callbacks.getReport}/>);
        expect(detail.state.duration).toEqual(factor.duration * 60);    // factor duration is in minutes
    });

    it('shows start time picker when absolute scale is used', () => {
        var detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.MINUTE} factor={factor}
                                                      onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                      show={true}
                                                      onDelete={callbacks.onDelete} getReport={callbacks.getReport}/>),
            pickers = TestUtils.scryRenderedComponentsWithType(detail._modalContent, DateTimePicker);
        expect(pickers.length).toEqual(1);
    });

    it('shows no start time picker when relative scale is used', () => {
        var detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.RELATIVE} factor={factor}
                                                      onSave={callbacks.onSave} onClose={callbacks.onClose} show={true}
                                                      onDelete={callbacks.onDelete} getReport={callbacks.getReport}/>),
            pickers = TestUtils.scryRenderedComponentsWithType(detail._modalContent, DateTimePicker);
        expect(pickers.length).toEqual(0);
    });

    it('updates statement question answer tree upon wizard finish', () => {
        var detail = Environment.render(<FactorDetail scale='second' factor={factor} onSave={callbacks.onSave}
                                                      onClose={callbacks.onClose}
                                                      onDelete={callbacks.onDelete}
                                                      getReport={callbacks.getReport}/>),
            question = {uri: 'http://very.important.question'},
            wizardCallback = jasmine.createSpy('wizardCallback');
        spyOn(QuestionAnswerProcessor, 'buildQuestionAnswerModel').and.returnValue(question);
        detail.onUpdateFactorDetails({data: {}, stepData: []}, wizardCallback);

        expect(QuestionAnswerProcessor.buildQuestionAnswerModel).toHaveBeenCalled();
        expect(detail.state.statement.question).toEqual(question);
        expect(wizardCallback).toHaveBeenCalled();
    });
});
