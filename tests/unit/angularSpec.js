describe('Unit: Testing RequireJS', function () {
    var ctrl;
    var scope;
    var rootScope;

    angular.module('ui.bootstrap', []);
    angular.module('SignalR', []);
    beforeEach(module('app.components.common'));

    beforeEach(function () {
        inject(function ($rootScope) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
        })
    });

    it("should be hello world", function () {
        var test = false;
        expect(test).toBeFalsy();
    });

    it("Yay it works", function () {
        var test = false;
        expect(test).toBeFalsy();
    });
});


