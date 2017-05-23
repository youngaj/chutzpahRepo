describe('Client Virtual Folders Module', function () {
    var ctrl;
    var scope;
    var rootScope;

    angular.module('app', []);
    angular.module('SignalR', []);
    angular.module('common', []);
    beforeEach(module('app.modules.virtualFolders'));

    beforeEach(function () {
        inject(function ($rootScope) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
        })
    });

    describe("virtualFolderService", function () {
        var virtualFolderService, httpBackend;

        beforeEach(inject(function (_virtualFolderService_, $httpBackend, $q) {
            // Service instance and dependencies
            virtualFolderService = _virtualFolderService_;
            httpBackend = $httpBackend;
            q = $q;
        }));

        describe("isFileUploadType", function () {
            it("with VirtualTree parameter", function () {
                var result = virtualFolderService.isFileUploadType('VirtualTree')
                expect(result).toBeFalsy();
            });

            it("with VirtualPhoto", function () {
                var result = virtualFolderService.isFileUploadType('VirtualPhoto')
                expect(result).toBe(true);
            });

            it("with VirtualSharedFile", function () {
                var result = virtualFolderService.isFileUploadType('VirtualPhoto')
                expect(result).toBe(true);
            });
        });

    });
});
