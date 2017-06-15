'use strict';

export default class EventValidator {

    static validate(event) {
        if (event.startTime > event.endTime) {
            return {valid: false, message: 'validation.error.start-after-end'};
        }
        return {valid: true};
    }
}
