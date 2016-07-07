'use strict';

describe('Question answer processor', () => {

    var Constants = require('../../js/constants/Constants'),
        Generator = require('../environment/Generator').default,
        Vocabulary = require('../../js/constants/Vocabulary'),
        QuestionAnswerProcessor = require('../../js/model/QuestionAnswerProcessor').default;

    it('transforms answers for a question', () => {
        var question = {},
            result;
        generateAnswers(question);
        result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);
        verifyAnswers(question, result);
    });

    function generateAnswers(question) {
        var codeValue;
        question[Constants.FORM.HAS_ANSWER] = [];
        for (var i = 0, cnt = Generator.getRandomPositiveInt(1, 5); i < cnt; i++) {
            codeValue = Generator.getRandomBoolean();
            var answer = {};
            answer['@id'] = Generator.getRandomUri();
            answer[Constants.FORM.HAS_ANSWER_ORIGIN] = Generator.getRandomUri();
            if (codeValue) {
                answer[Constants.FORM.HAS_OBJECT_VALUE] = {
                    '@id': Generator.getRandomUri()
                }
            } else {
                answer[Constants.FORM.HAS_DATA_VALUE] = {
                    '@value': i
                };
            }
            question[Constants.FORM.HAS_ANSWER].push(answer);
        }
    }

    function verifyAnswers(expectedQuestion, actualQuestion) {
        if (!expectedQuestion[Constants.FORM.HAS_ANSWER]) {
            return;
        }
        expect(actualQuestion.answers).toBeDefined();
        expect(actualQuestion.answers.length).toEqual(expectedQuestion[Constants.FORM.HAS_ANSWER].length);
        for (var i = 0, len = actualQuestion.answers.length; i < len; i++) {
            expect(actualQuestion.answers[i].uri).toEqual(expectedQuestion[Constants.FORM.HAS_ANSWER][i]['@id']);
            if (expectedQuestion[Constants.FORM.HAS_ANSWER][i][Constants.FORM.HAS_DATA_VALUE]) {
                expect(actualQuestion.answers[i].textValue).toEqual(expectedQuestion[Constants.FORM.HAS_ANSWER][i][Constants.FORM.HAS_DATA_VALUE]['@value']);
            } else {
                expect(actualQuestion.answers[i].codeValue).toEqual(expectedQuestion[Constants.FORM.HAS_ANSWER][i][Constants.FORM.HAS_OBJECT_VALUE]['@id']);
            }
        }
    }

    it('transforms hierarchy of questions and answers', () => {
        var question = generateQuestions(),
            result;
        result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);

        verifyQuestions(question, result);
    });

    function generateQuestions() {
        var question = {};
        question['@id'] = Generator.getRandomUri();
        question[Vocabulary.RDFS_LABEL] = 'Test0';
        question[Vocabulary.RDFS_COMMENT] = 'Test0 Comment';
        question[Constants.FORM.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();
        question[Constants.FORM.HAS_SUBQUESTION] = [];
        for (var i = 0, cnt = Generator.getRandomPositiveInt(1, 5); i < cnt; i++) {
            question[Constants.FORM.HAS_SUBQUESTION].push(generateSubQuestions(0, 5));
        }
        return question;
    }

    function generateSubQuestions(depth, maxDepth) {
        var question = {};
        question['@id'] = Generator.getRandomUri();
        question[Constants.FORM.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();
        question[Vocabulary.RDFS_LABEL] = 'Test' + Generator.getRandomInt();
        question[Vocabulary.RDFS_COMMENT] = 'Test Comment';
        if (depth < maxDepth) {
            question[Constants.FORM.HAS_SUBQUESTION] = [];
            for (var i = 0, cnt = Generator.getRandomPositiveInt(1, 5); i < cnt; i++) {
                question[Constants.FORM.HAS_SUBQUESTION].push(generateSubQuestions(depth + 1, maxDepth));
            }
        }
        generateAnswers(question);
        return question;
    }

    function verifyQuestions(expected, actual) {
        expect(actual.uri).toEqual(expected['@id']);
        verifyAnswers(expected, actual);
        if (expected[Constants.FORM.HAS_SUBQUESTION]) {
            expect(actual.subQuestions).toBeDefined();
            expect(actual.subQuestions.length).toEqual(expected[Constants.FORM.HAS_SUBQUESTION].length);
            for (var i = 0, len = actual.subQuestions.length; i < len; i++) {
                verifyQuestions(expected[Constants.FORM.HAS_SUBQUESTION][i], actual.subQuestions[i]);
            }
        }
    }

    it('Stores origin of questions', () => {
        var question = generateQuestions(),
            result;
        result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);

        verifyPresenceOfQuestionOrigin(question, result);
    });

    function verifyPresenceOfQuestionOrigin(expected, actual) {
        expect(actual.origin).toBeDefined();
        expect(actual.origin).toEqual(expected[Constants.FORM.HAS_QUESTION_ORIGIN]);
        if (expected[Constants.FORM.HAS_SUBQUESTION]) {
            for (var i = 0, len = actual.subQuestions.length; i < len; i++) {
                verifyQuestions(expected[Constants.FORM.HAS_SUBQUESTION][i], actual.subQuestions[i]);
            }
        }
    }

    it('Stores origin of answers', () => {
        var question = {},
            result;
        generateAnswers(question);
        result = QuestionAnswerProcessor.processQuestionAnswerHierarchy(question);
        verifyPresenceOfAnswerOrigin(question, result);
    });

    function verifyPresenceOfAnswerOrigin(actualQuestion, expectedQuestion) {
        if (!expectedQuestion[Constants.FORM.HAS_ANSWER]) {
            return;
        }
        expect(actualQuestion.answers).toBeDefined();
        expect(actualQuestion.answers.length).toEqual(expectedQuestion[Constants.FORM.HAS_ANSWER].length);
        for (var i = 0, len = actualQuestion.answers.length; i < len; i++) {
            expect(actualQuestion.answers[i].origin).toEqual(expectedQuestion[Constants.FORM.HAS_ANSWER][i][Constants.FORM.HAS_ANSWER_ORIGIN]);
        }
    }

    it('builds QAM from the specified questions and answers, including form root', () => {
        var data = {
                root: {}
            },
            questions = [generateQuestions()],
            result;
        data.root['@id'] = Generator.getRandomUri();
        data.root[Constants.FORM.HAS_QUESTION_ORIGIN] = Generator.getRandomUri();

        result = QuestionAnswerProcessor.buildQuestionAnswerModel(data, questions);
        expect(result.uri).toEqual(data.root['@id']);
        expect(result.origin).toEqual(data.root[Constants.FORM.HAS_QUESTION_ORIGIN]);
        expect(result.subQuestions.length).toEqual(1);
        verifyQuestions(questions[0], result.subQuestions[0]);
    });
});
