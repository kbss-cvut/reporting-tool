'use strict';

var instanceMap;

function resolve(object, refProperty) {
    if (typeof object === 'object' && object !== null && !(object instanceof Boolean) && !(object instanceof Date) && !(object instanceof Number) && !(object instanceof RegExp) && !(object instanceof String)) {
        if (Array.isArray(object)) {
            for (var i = 0, len = object.length; i < len; i++) {
                if ((typeof object[i] === 'number' || typeof object[i] === 'string') && instanceMap[object[i]]) {
                    object[i] = instanceMap[object[i]];
                } else {
                    resolve(object[i], refProperty);
                }
            }
        } else {
            Object.getOwnPropertyNames(object).forEach(n => {
                if (n === refProperty) {
                    instanceMap[object[refProperty]] = object;
                } else if ((typeof object[n] === 'number' || typeof object[n] === 'string') && instanceMap[object[n]]) {
                    object[n] = instanceMap[object[n]];
                } else {
                    resolve(object[n], refProperty);
                }
            });
        }
    }
}

function encode(parent, property, object, refProperty) {
    if (typeof object === 'object' && object !== null && !(object instanceof Boolean) && !(object instanceof Date) && !(object instanceof Number) && !(object instanceof RegExp) && !(object instanceof String)) {
        if (Array.isArray(object)) {
            for (var i = 0, len = object.length; i < len; i++) {
                encode(parent, property, object[i], refProperty);
            }
        } else {
            if (object[refProperty]) {
                if (!instanceMap[object[refProperty]]) {
                    instanceMap[object[refProperty]] = object;
                } else {
                    replace(parent, property, object, object[refProperty]);
                    return;
                }
            }
            Object.getOwnPropertyNames(object).filter(n => n !== refProperty).forEach(n => {
                encode(object, n, object[n], refProperty);
            });
        }
    }
}

function replace(owner, property, oldValue, newValue) {
    if (Array.isArray(owner[property])) {
        for (var i = 0, len = owner[property].length; i < len; i++) {
            if (owner[property][i] === oldValue) {
                owner[property][i] = newValue;
                break;  // Break, if there are multiple instances, they will be caught by the iteration in encode
            }
        }
    } else {
        owner[property] = newValue;
    }
}

export default class JsonReferenceResolver {

    /**
     * Resolves JSON references in the specified object.
     *
     * I.e. in case a reference (a number or a string) is used as a value of some attribute/array element, it replaces
     * it with the already visited object with the same reference.
     * @param object Root of the object graph
     * @param refProperty Property used to define object reference id, defaults to 'referenceId'
     */
    static resolveReferences(object, refProperty = 'referenceId') {
        instanceMap = {};
        resolve(object, refProperty);
    }

    /**
     * Replaces multiple occurrences of the same object with its reference.
     *
     * It traverses the object graph, caching objects with reference ids. In case an object with the same reference id
     * is encountered again, it is replaced by the reference id.
     * @param object Root of the object graph
     * @param refProperty Property used to define object reference id, defaults to 'referenceId'
     */
    static encodeReferences(object, refProperty = 'referenceId') {
        instanceMap = {};
        encode(null, null, object, refProperty);
    }
}
