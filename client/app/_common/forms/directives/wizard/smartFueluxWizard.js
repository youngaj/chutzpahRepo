'use strict';

angular.module('SmartAdmin.Forms').directive('smartFueluxWizard', function () {
    return {
        restrict: 'A',
        scope: {
            smartWizardCallback: '&',
            stepChangedCallback: '&',
            stepChangingCallback: '&'
        },
        link: function (scope, element, attributes) {

            var wizard = element.wizard();

            var $form = element.find('form');

            wizard.on('actionclicked.fu.wizard', function (e, data) {
                if ($form.data('validator')) {
                    if (!$form.valid()) {
                        $form.data('validator').focusInvalid();
                        e.preventDefault();
                    }
                }
                if (typeof scope.stepChangingCallback() === 'function') {
                    scope.stepChangingCallback()(e, data)
                }
            });

            wizard.on('changed.fu.wizard', function (e, data) {
                var formData = {};
                _.each($form.serializeArray(), function (field) {
                    formData[field.name] = field.value
                });
                if (typeof scope.stepChangedCallback() === 'function') {
                    scope.stepChangedCallback()(e, data)
                }
            });

            wizard.on('finished.fu.wizard', function (e, data) {
                var formData = {};
                _.each($form.serializeArray(), function (field) {
                    formData[field.name] = field.value
                });
                if (typeof scope.smartWizardCallback() === 'function') {
                    scope.smartWizardCallback()(formData)
                }
            });
        }
    }
});