describe('Client IT Module', function () {
    var ctrl;
    var scope;
    var rootScope;
    var loggedInUser = { "isActive": true, "uupic": "202012426", "auId": "ayoung", "firstName": "Andre", "middleName": null, "lastName": "Young", "lastNameFirst": "Young, Andre", "emailAddress": "andre.j.young@nasa.gov ", "mobileNumber": "301-286-2613", "officeNumber": "301.286.2613", "gender": "Male", "connections": null, "id": 300, "name": "Young, Andre", "description": null, "classType": "User", "compositeKey": "User-300", "avatar": { "extension": null, "largeImageUrl": "api/Actors/User-300/LargeAvatar", "smallImageUrl": "api/Actors/User-300/SmallAvatar", "actorCompositeKey": "User-300", "uploadDate": "0001-01-01T00:00:00", "uploaderId": 0 }, "state": { "id": 339, "actorCompositeKey": "User-300", "status": "offline", "statusMessage": null, "connections": [] } };

    angular.module('app', []);
    angular.module('SignalR', []);
    angular.module('common', []);
    beforeEach(module('app.modules.it'));

    beforeEach(function () {
        inject(function ($rootScope) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
        })
    });

    describe("softwareService", function () {
        var softwareService, httpBackend;

        beforeEach(inject(function (_softwareService_, _$httpBackend_, $q) {
            // Service instance and dependencies
            softwareService = _softwareService_;
            httpBackend = _$httpBackend_;
            q = $q;

            httpBackend.when('GET', 'api/Actors')
                .respond([{
                    id: 40,
                    name: "ARCHIVE",
                    description: null,
                    classType: "Group",
                    compositeKey: "Group-40",
                    avatar: {
                        extension: null,
                        largeImageUrl: "api/Generic/Group/Avatar",
                        smallImageUrl: "api/Generic/Group/Avatar",
                        actorCompositeKey: "Group-40",
                        uploadDate: "0001-01-01T00:00:00",
                        uploaderId: 0
                    },
                    state: null
                },
                {
                    id: 53,
                    name: "ARGON",
                    description: null,
                    classType: "Group",
                    compositeKey: "Group-53",
                    avatar: {
                        extension: null,
                        largeImageUrl: "api/Generic/Group/Avatar",
                        smallImageUrl: "api/Generic/Group/Avatar",
                        actorCompositeKey: "Group-53",
                        uploadDate: "0001-01-01T00:00:00",
                        uploaderId: 0
                    },
                    state: null
                },
                {
                    id: 48,
                    name: "ARRM",
                    description: null,
                    classType: "Group",
                    compositeKey: "Group-48",
                    avatar: {
                        extension: null,
                        largeImageUrl: "api/Generic/Group/Avatar",
                        smallImageUrl: "api/Generic/Group/Avatar",
                        actorCompositeKey: "Group-48",
                        uploadDate: "0001-01-01T00:00:00",
                        uploaderId: 0
                    },
                    state: null
                }]);

            httpBackend.when('GET', 'api/SecurityManager/LoggedInUser')
                .respond(loggedInUser);

            httpBackend.when('GET', 'api/Software')
                .respond([]);
        }));

        beforeEach(function () {
            httpBackend.expectGET('/api/Actors').respond(200, []);
            httpBackend.expectGET('/api/SecurityManager/LoggedInUser').respond(200, loggedInUser);
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it("spec starts", function () {
            expect(true).toBe(true);
            httpBackend.flush();
        });

        describe("getAll", function () {
            it("returns list of software", function () {
                httpBackend.expectGET('/api/Software').respond(200, [{id: 1, name: 'Test software'}]);

                var promise = softwareService.getAll();
                promise.then(function (result) {
                    expect(result).toBeDefined();
                    expect(result.length).toBe(1);
                });

                httpBackend.flush();

            });
        });

    });
});
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
