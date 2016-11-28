'use strict';

describe('RouterStore tests', function () {

    var RouterStore = require('../../js/stores/RouterStore');

    it('Resets route payload when none is received on transition payload set', function () {
        var routeName = 'editReport',
            payload = {id: 12345};
        RouterStore.setTransitionPayload(routeName, payload);
        expect(RouterStore.getTransitionPayload(routeName)).toEqual(payload);
        RouterStore.setTransitionPayload(routeName);
        expect(RouterStore.getTransitionPayload(routeName)).toBeUndefined();
    });
});
