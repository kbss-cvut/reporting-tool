'use strict';

describe('Tests for the gantt component controller', function () {

    var GanttController = require('../../js/components/factor/GanttController'),
        gantt, props, report;

    beforeEach(function () {
        gantt = jasmine.createSpyObj('gantt', ['init', 'clearAll', 'attachEvent', 'updateTask', 'refreshData', 'getChildren', 'open', 'render']);
        props = jasmine.createSpyObj('props', ['onLinkAdded', 'onCreateFactor', 'onEditFactor', 'onDeleteLink', 'updateOccurrence']);
        gantt.config = {
            scale_unit: 'second',
            duration_unit: 'second'
        };
        gantt.templates = {};
        gantt.date = {};
        // The function that we want to mock have to exist
        gantt.getTask = function () {
        };
        gantt.getLink = function () {
        };
        gantt.calculateDuration = function (start, end) {
            return (end.getTime() - start.getTime()) / 1000;
        };
        gantt.calculateEndDate = function (start, duration) {
            return new Date(start.getTime() + duration * 1000);
        };
        gantt.addTask = function (task) {
            return task.id;
        };
        gantt.batchUpdate = function (callback) {
            callback();
        };
        gantt.config.links = {
            "finish_to_start": "0",
            "start_to_start": "1",
            "finish_to_finish": "2",
            "start_to_finish": "3"
        };
        jasmine.getGlobal().gantt = gantt;
        report = {
            occurrence: {
                name: 'Test occurrence',
                startTime: Date.now(),
                endTime: Date.now() + 10000
            }
        };
        GanttController.init(props);
    });

    it('Prevents editing of the occurrence event', function () {
        var id = 1;
        spyOn(gantt, 'getTask');
        GanttController.occurrenceEventId = id;
        GanttController.onEditFactor(id, {
            preventDefault: function () {
            }
        });
        expect(gantt.getTask).not.toHaveBeenCalled();
        expect(props.onEditFactor).not.toHaveBeenCalled();
    });

    it('Initializes new factor with default values', function () {
        var factor = {};
        gantt.config.duration_unit = 'minute';
        GanttController.onCreateFactor(factor);
        expect(props.onCreateFactor).toHaveBeenCalledWith(factor);
        expect(factor.isNew).toBeTruthy();
        expect(factor.text).toEqual('');
        expect(factor.durationUnit).toEqual('minute');
    });

    it('Updates occurrence event when occurrence name is updated', function () {
        var occurrence = report.occurrence, occurrenceEvent = {
            start_date: new Date(report.occurrence.startTime),
            end_date: new Date(report.occurrence.endTime),
            text: 'Test'
        };
        spyOn(gantt, 'getTask').and.returnValue(occurrenceEvent);
        spyOn(GanttController, 'applyUpdates').and.callThrough();
        occurrence.name = 'Updated text';
        GanttController.updateOccurrenceEvent(report);

        expect(occurrenceEvent.text).toEqual(occurrence.name);
        expect(occurrenceEvent.start_date.getTime()).toEqual(report.occurrence.startTime);
        expect(GanttController.applyUpdates).toHaveBeenCalled();
    });

    it('Updates occurrence event when occurrence time is updated', function () {
        var occurrence = report.occurrence, occurrenceEvent = {
            start_date: new Date(report.occurrence.startTime),
            end_date: new Date(report.occurrence.endTime),
            text: occurrence.name
        };
        spyOn(gantt, 'getTask').and.returnValue(occurrenceEvent);
        gantt.getChildren.and.returnValue([]);
        spyOn(GanttController, 'applyUpdates').and.callThrough();
        report.occurrence.endTime = Date.now() + 100000;
        GanttController.updateOccurrenceEvent(report);

        expect(occurrenceEvent.text).toEqual(occurrence.name);
        expect(occurrenceEvent.start_date.getTime()).toEqual(report.occurrence.startTime);
        expect(occurrenceEvent.end_date.getTime()).toEqual(report.occurrence.endTime);
        expect(GanttController.applyUpdates).toHaveBeenCalled();
    });

    it('Ensures that the occurrence event has never a duration less than 1 time unit', function () {
        gantt.config.scale_unit = "second";
        var occurrenceEvent = {
            start_date: new Date(report.occurrence.startTime),
            end_date: new Date(report.occurrence.endTime),
            text: 'Test'
        };
        gantt.getChildren.and.returnValue([]);
        spyOn(gantt, 'getTask').and.returnValue(occurrenceEvent);
        spyOn(gantt, 'calculateDuration').and.callFake(function (start, end) {
            return (end.getTime() - start.getTime()) / 1000;
        });
        spyOn(gantt, 'calculateEndDate').and.callFake(function (start, duration) {
            return new Date(start.getTime() + duration * 1000);
        });
        report.occurrence.endTime = report.occurrence.startTime + 100;    // Less than 1 second
        GanttController.updateOccurrenceEvent(report);

        expect(gantt.calculateEndDate).toHaveBeenCalled();
        expect(occurrenceEvent.end_date.getTime()).toEqual(report.occurrence.startTime + 1000);
    });

    it('Ensures parent event contains a newly added child event by expanding its time interval', function () {
        var parent = {
            id: 1,
            start_date: new Date(),
            end_date: new Date(Date.now() + 10000)
        }, child = {
            id: 2,
            parent: 1,
            start_date: new Date(Date.now() - 1000),
            end_date: new Date(Date.now() + 1000)
        };
        spyOn(gantt, 'getTask').and.returnValue(parent);
        spyOn(GanttController, 'extendAncestorsIfNecessary').and.callThrough();
        GanttController.onFactorAdded(2, child);

        expect(GanttController.extendAncestorsIfNecessary).toHaveBeenCalled();
        expect(parent.start_date).toEqual(child.start_date);
    });

    it('Ensures parent event contains an updated child by expanding its time interval', function () {
        var parent = {
            id: 1,
            start_date: new Date(),
            end_date: new Date(Date.now() + 10000)
        }, child = {
            id: 2,
            parent: 1,
            start_date: new Date(Date.now() - 1000),
            end_date: new Date(Date.now() + 200000)
        };
        spyOn(gantt, 'getTask').and.callFake(function (id) {
            return id === parent.id ? parent : child;
        });
        spyOn(GanttController, 'extendAncestorsIfNecessary').and.callThrough();
        spyOn(GanttController, 'updateDescendantsTimeInterval');
        GanttController.onFactorUpdated(2);

        expect(GanttController.extendAncestorsIfNecessary).toHaveBeenCalled();
        expect(GanttController.updateDescendantsTimeInterval).toHaveBeenCalled();
        expect(parent.start_date).toEqual(child.start_date);
        expect(parent.end_date).toEqual(child.end_date);
        expect(gantt.refreshData).toHaveBeenCalled();
    });

    it('Ensures child events shrink when parent event time interval is decreased', function () {
        var parent = {
            id: 1,
            start_date: new Date(),
            end_date: new Date(Date.now() + 10000)
        }, child = {
            id: 2,
            parent: 1,
            start_date: new Date(Date.now() - 1000),
            end_date: new Date(Date.now() + 2000)
        };
        spyOn(gantt, 'getTask').and.callFake(function (id) {
            return id === parent.id ? parent : child;
        });
        gantt.getChildren.and.returnValue([child]);
        spyOn(GanttController, 'ensureNonZeroDuration');
        spyOn(GanttController, 'extendAncestorsIfNecessary');
        spyOn(GanttController, 'updateDescendantsTimeInterval').and.callThrough();
        GanttController.onFactorUpdated(1);

        expect(GanttController.extendAncestorsIfNecessary).toHaveBeenCalled();
        expect(GanttController.updateDescendantsTimeInterval).toHaveBeenCalled();
        expect(GanttController.ensureNonZeroDuration).toHaveBeenCalled();
        expect(child.start_date).toEqual(parent.start_date);
        expect(gantt.updateTask).toHaveBeenCalledWith(child.id);
    });

    it('Extends occurrence event accordingly if event is added which starts after occurrence event end', function () {
        var start = new Date(),
            occurrenceEvt = {
                id: 1,
                start_date: start,
                end_date: new Date(Date.now() + 1000)
            }, added = {
                id: 2,
                parent: 1,
                start_date: new Date(Date.now() + 2000),
                end_date: new Date(Date.now() + 3000)
            };
        spyOn(gantt, 'getTask').and.returnValue(occurrenceEvt);
        spyOn(gantt, 'addTask').and.callFake(function (task) {
            GanttController.onFactorAdded(task.id, task);
            return task.id;
        });
        GanttController.addFactor(added, occurrenceEvt.id);

        expect(gantt.addTask).toHaveBeenCalled();
        expect(occurrenceEvt.start_date).toEqual(start);
        expect(occurrenceEvt.end_date).toEqual(added.end_date);
        expect(props.updateOccurrence).toHaveBeenCalledWith(occurrenceEvt.start_date.getTime(), added.end_date.getTime());
    });

    it('Passes the link, its source and target to the delete link handler', function () {
        var evt = {
            id: 1
        }, link = {
            id: 2,
            source: 1,
            target: 1
        };
        spyOn(gantt, 'getTask').and.returnValue(evt);
        spyOn(gantt, 'getLink').and.returnValue(link);
        GanttController.onDeleteLink(link.id);

        expect(props.onDeleteLink).toHaveBeenCalledWith(link, evt, evt);
    });

    it('Shrinks the occurrence event to span exactly its children', function () {
        var start = new Date(report.occurrence.startTime),
            occurrenceEvt = {
                id: 1,
                start_date: start,
                end_date: new Date(report.occurrence.endTime)
            }, child = {
                id: 2,
                parent: 1,
                start_date: start,
                end_date: new Date(start.getTime() + 5000)
            };
        spyOn(gantt, 'getTask').and.callFake(function (id) {
            return id === occurrenceEvt.id ? occurrenceEvt : child;
        });
        gantt.getChildren.and.returnValue([child.id]);
        spyOn(GanttController, 'shrinkRootIfNecessary').and.callThrough();
        spyOn(gantt, 'calculateEndDate').and.callThrough();
        GanttController.occurrenceEventId = occurrenceEvt.id;
        GanttController.onFactorUpdated(2);

        expect(GanttController.shrinkRootIfNecessary).toHaveBeenCalled();
        expect(gantt.calculateEndDate).toHaveBeenCalled();
        expect(occurrenceEvt.start_date).toEqual(start);
        expect(occurrenceEvt.end_date).toEqual(child.end_date);
    });

    it('Supports only adding links from finish to start', function () {
        var invalidLink = {
                id: 2,
                source: 1,
                target: 2,
                type: '1'
            },
            validLink = {
                id: 3,
                source: 1,
                target: 2,
                type: '0'
            };
        GanttController.onLinkAdded(invalidLink.id, invalidLink);

        expect(props.onLinkAdded).not.toHaveBeenCalled();

        GanttController.onLinkAdded(validLink.id, validLink);
        expect(props.onLinkAdded).toHaveBeenCalledWith(validLink);
    });

    it('Resizes factors when occurrence start time changes (forward)', function () {
        var occurrence = report.occurrence,
            start = new Date(report.occurrence.startTime),
            occurrenceEvt = {
                id: 1,
                text: occurrence.name,
                start_date: start,
                duration: 2,
                end_date: new Date(start.getTime() + 2000)
            }, child = {
                id: 2,
                parent: 1,
                start_date: start,
                duration: 1,
                end_date: new Date(start.getTime() + 2000)
            },
            timeDiff = 1000;
        report.occurrence.endTime = report.occurrence.startTime + 2000;
        initSpies(occurrenceEvt, child);

        report.occurrence.startTime += timeDiff;
        GanttController.updateOccurrenceEvent(report);

        expect(occurrenceEvt.start_date).toEqual(new Date(report.occurrence.startTime));
        expect(occurrenceEvt.end_date).toEqual(new Date(report.occurrence.endTime));
        expect(occurrenceEvt.duration).toEqual(1);
        expect(child.start_date).toEqual(new Date(report.occurrence.startTime));
        expect(props.updateOccurrence).not.toHaveBeenCalled();
    });

    function initSpies(occurrenceEvt, child) {
        spyOn(gantt, 'getTask').and.callFake(function (id) {
            return id === occurrenceEvt.id ? occurrenceEvt : child;
        });
        gantt.getChildren.and.callFake(function (id) {
            return id === occurrenceEvt.id ? [child] : [];
        });
        GanttController.occurrenceEventId = occurrenceEvt.id;
    }

    it('Resizes child factors when occurrence end time changes (backward)', function () {
        var occurrence = report.occurrence,
            start = new Date(report.occurrence.startTime),
            occurrenceEvt = {
                id: 1,
                text: occurrence.name,
                start_date: start,
                duration: 2,
                end_date: new Date(start.getTime() + 2000)
            }, child = {
                id: 2,
                parent: 1,
                start_date: start,
                duration: 1,
                end_date: new Date(start.getTime() + 2000)
            },
            timeDiff = 1000;
        report.occurrence.endTime = report.occurrence.startTime + 2000;
        initSpies(occurrenceEvt, child);

        report.occurrence.endTime -= timeDiff;
        GanttController.updateOccurrenceEvent(report);

        expect(occurrenceEvt.start_date).toEqual(start);
        expect(occurrenceEvt.end_date).toEqual(new Date(report.occurrence.endTime));
        expect(occurrenceEvt.duration).toEqual(1);
        expect(child.start_date).toEqual(start);
        expect(child.end_date).toEqual(new Date(report.occurrence.endTime));
        expect(props.updateOccurrence).not.toHaveBeenCalled();
    });

    it('Prevents child event duration to get below 1 time unit when occurrence start time changes by moving it forward', function () {
        var occurrence = report.occurrence,
            occurrenceEvt = {
                id: 1,
                start_date: new Date(report.occurrence.startTime),
                duration: report.occurrence.endTime - report.occurrence.endTime / 1000,    // to seconds
                end_date: new Date(occurrence.endTime)
            }, child = {
                id: 2,
                parent: 1,
                start_date: new Date(report.occurrence.startTime),
                duration: 1,
                end_date: new Date(report.occurrence.startTime + 1000)
            };
        initSpies(occurrenceEvt, child);
        occurrence.startTime += 1000;   // Causes child duration to become 0

        GanttController.updateOccurrenceEvent(report);

        expect(occurrenceEvt.start_date).toEqual(new Date(report.occurrence.startTime));
        expect(occurrenceEvt.end_date).toEqual(new Date(report.occurrence.endTime));
        expect(child.start_date).toEqual(new Date(report.occurrence.startTime));
        expect(child.end_date).toEqual(new Date(child.start_date.getTime() + 1000));
        expect(child.duration).toEqual(1);
    });

    it('Prevents child event duration to get below 1 time unit when occurrence end time change by moving it backward', function () {
        var occurrence = report.occurrence,
            occurrenceEvt = {
                id: 1,
                start_date: new Date(report.occurrence.startTime),
                duration: report.occurrence.endTime - report.occurrence.endTime / 1000,    // to seconds
                end_date: new Date(report.occurrence.endTime)
            }, child = {
                id: 2,
                parent: 1,
                start_date: new Date(report.occurrence.endTime - 1000),
                duration: 1,
                end_date: new Date(report.occurrence.endTime)
            };
        initSpies(occurrenceEvt, child);
        occurrence.endTime -= 1000;   // Causes child duration to become 0

        GanttController.updateOccurrenceEvent(report);

        expect(occurrenceEvt.start_date).toEqual(new Date(report.occurrence.startTime));
        expect(occurrenceEvt.end_date).toEqual(new Date(report.occurrence.endTime));
        expect(child.start_date).toEqual(new Date(report.occurrence.endTime - 1000));
        expect(child.end_date).toEqual(new Date(report.occurrence.endTime));
        expect(child.duration).toEqual(1);
    });

    it('Prevents occurrence event update when updates are being applied', function () {
        var oldName = 'Old name',
            occurrenceEvt = {
                id: 1,
                text: 'Old name',
                start_date: new Date(),
                end_date: new Date(Date.now() + 1000)
            },
            occurrence = {
                name: occurrenceEvt.text,
                occurrenceTime: occurrenceEvt.start_date.getTime()
            };
        spyOn(gantt, 'getTask').and.returnValue(occurrenceEvt);
        props.updateOccurrence.and.callFake(function () {
            occurrence.name = 'Updated name';
            expect(GanttController.applyChangesRunning).toBeTruthy();
            GanttController.updateOccurrenceEvent(report);
        });

        GanttController.applyUpdates([occurrenceEvt.id], false);

        expect(props.updateOccurrence).toHaveBeenCalled();
        expect(occurrenceEvt.text).toEqual(oldName);
        expect(GanttController.applyChangesRunning).toBeFalsy();
    });

    it('Expands subtrees recursively', function () {
        var root = {
                id: 1,
                text: 'Root',
                start_date: new Date(report.occurrence.startTime),
                end_date: new Date(report.occurrence.endTime)
            }, child = {
                id: 2,
                parent: 1,
                text: 'Child',
                start_date: new Date(report.occurrence.startTime),
                end_date: new Date(report.occurrence.endTime)
            },
            grandChild = {
                id: 3,
                parent: 2,
                text: 'GrandChild',
                start_date: new Date(report.occurrence.startTime),
                end_date: new Date(report.occurrence.endTime)
            };
        gantt.getChildren.and.callFake(function (nodeId) {
            switch (nodeId) {
                case 1:
                    return [2];
                case 2:
                    return [3];
                default:
                    return [];
            }
        });
        GanttController.expandSubtree(root.id);

        expect(gantt.open).toHaveBeenCalled();
        var args = gantt.open.calls.allArgs();
        expect(args[0][0]).toEqual(1);
        expect(args[1][0]).toEqual(2);
        expect(args[2][0]).toEqual(3);
    });

    it('Prevents creation of self-referencing links', function () {
        var linkId = 1,
            link = {
                id: linkId,
                source: 1,
                target: 1,
                type: gantt.config.links.finish_to_start,
                factorType: 'cause'
            };
        var res = GanttController.onLinkAdded(linkId, link);
        expect(res).toEqual(false);
        expect(props.onLinkAdded).not.toHaveBeenCalled();
    });

    it('Returns number of children when getChildCount is called', function() {
        var id = 117,
            children = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];
        gantt.getChildren.and.returnValue(children);

        var result = GanttController.getChildCount(id);
        expect(result).toEqual(children.length);
    });
});
