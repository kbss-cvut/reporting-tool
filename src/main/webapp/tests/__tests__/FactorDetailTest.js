'use strict';


describe('Factor detail dialog', function () {

    const React = require('react'),
        assign = require('object-assign'),
        TestUtils = require('react-addons-test-utils'),
        QuestionAnswerProcessor = require('semforms').QuestionAnswerProcessor,
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Actions = require('../../js/actions/Actions'),
        Constants = require('../../js/constants/Constants'),
        Vocabulary = require('../../js/constants/Vocabulary'),
        FactorDetail = require('../../js/components/factor/FactorDetail').default,
        OptionsStore = require('../../js/stores/OptionsStore'),
        ReportFactory = require('../../js/model/ReportFactory'),
        DateTimePicker = require('react-bootstrap-datetimepicker').default;
    let callbacks,
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
        report, factor;

    beforeEach(function () {
        callbacks = jasmine.createSpyObj('callbacks', ['onSave', 'onClose', 'onDelete']);
        jasmine.getGlobal().gantt = gantt;
        report = Generator.generateOccurrenceReport();
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
        const newDuration = 10,
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
        let detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.MINUTE} factor={factor}
                                                      onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                      onDelete={callbacks.onDelete} report={report}/>);
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
        const newDuration = 10,
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
        let detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.MINUTE} factor={factor}
                                                      onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                      onDelete={callbacks.onDelete} report={report}/>);
        detail.onDurationSet({target: {value: newDuration}});
        detail.onEventTypeChange(eventType);
        detail.setState({statement: statement});

        expect(factor).toEqual(origFactor);
    });

    it('Calculates event duration based on scale', () => {
        const detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.SECOND} factor={factor}
                                                        onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                        onDelete={callbacks.onDelete} report={report}/>);
        expect(detail.state.duration).toEqual(factor.duration * 60);    // factor duration is in minutes
    });

    it('shows start time picker when absolute scale is used', () => {
        const detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.MINUTE} factor={factor}
                                                        onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                        show={true} onDelete={callbacks.onDelete}
                                                        report={report}/>),
            pickers = TestUtils.scryRenderedComponentsWithType(detail._modalContent, DateTimePicker);
        expect(pickers.length).toEqual(1);
    });

    it('shows no start time picker when relative scale is used', () => {
        const detail = Environment.render(<FactorDetail scale={Constants.TIME_SCALES.RELATIVE} factor={factor}
                                                        onSave={callbacks.onSave} onClose={callbacks.onClose}
                                                        show={true} onDelete={callbacks.onDelete}
                                                        report={report}/>),
            pickers = TestUtils.scryRenderedComponentsWithType(detail._modalContent, DateTimePicker);
        expect(pickers.length).toEqual(0);
    });

    it('updates statement question answer tree upon wizard finish', () => {
        const detail = Environment.render(<FactorDetail scale='second' factor={factor} onSave={callbacks.onSave}
                                                        onClose={callbacks.onClose} onDelete={callbacks.onDelete}
                                                        report={report}/>),
            question = {uri: 'http://very.important.question'},
            wizardCallback = jasmine.createSpy('wizardCallback');
        spyOn(QuestionAnswerProcessor, 'buildQuestionAnswerModel').and.returnValue(question);
        detail.onUpdateFactorDetails({data: {}, stepData: []}, wizardCallback);

        expect(QuestionAnswerProcessor.buildQuestionAnswerModel).toHaveBeenCalled();
        expect(detail.state.statement.question).toEqual(question);
        expect(wizardCallback).toHaveBeenCalled();
    });

    it('does not display the details button when owning report is invalid', () => {
        const report = ReportFactory.createOccurrenceReport(),
            eventType = Generator.getJsonLdSample()[0];
        factor.statement.eventType = [eventType['@id']];
        spyOn(OptionsStore, 'getOptions').and.returnValue(Generator.getJsonLdSample());
        const detail = Environment.render(<FactorDetail scale='second' factor={factor} onSave={callbacks.onSave}
                                                        onClose={callbacks.onClose} onDelete={callbacks.onDelete}
                                                        show={true} report={report}/>),
            detailsButton = Environment.getComponentByTagAndText(detail._modalFooter, 'button',
                require('../../js/i18n/en').messages['factors.detail.details']);
        expect(detailsButton.disabled).toBeTruthy();
    });

    it('removes the \'suggested\' type on save', () => {
        spyOn(OptionsStore, 'getOptions').and.returnValue(Generator.getJsonLdSample());
        const et = Generator.getJsonLdSample()[0]['@id'];
        factor.statement.types = [Vocabulary.SUGGESTED, et];
        factor.statement.eventType = et;
        const detail = Environment.render(<FactorDetail scale='second' factor={factor} onSave={callbacks.onSave}
                                                        onClose={callbacks.onClose} onDelete={callbacks.onDelete}
                                                        show={true} report={report}/>);
        detail.onSave();
        const statement = factor.statement;
        expect(statement.types.indexOf(Vocabulary.SUGGESTED)).toEqual(-1);
    });
});
