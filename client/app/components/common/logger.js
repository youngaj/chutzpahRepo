(function () {
    'use strict';

    angular
        .module('app.components.common')
        .factory('logger', logger);

    logger.$inject = ['$log'];

    function logger($log) {
        var service = {
            getLogFn: getLogFn,
            log: log,
            logError: logError,
            logSuccess: logSuccess,
            logWarning: logWarning

        };

        return service;

        function getLogFn(moduleId, fnName) {
            fnName = fnName || 'log';
            switch (fnName.toLowerCase()) { // convert aliases
                case 'success':
                    fnName = 'logSuccess'; break;
                case 'error':
                    fnName = 'logError'; break;
                case 'warn':
                    fnName = 'logWarning'; break;
                case 'warning':
                    fnName = 'logWarning'; break;
            }

            var logFn = service[fnName] || service.log;
            return function (msg, data, showToast) {
                logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);

            };
        }

        function log(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'info');
        }

        function logWarning(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'warning');
        }

        function logSuccess(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'success');
        }

        function logError(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'error');
        }

        function warningMessage(title, message, timeout) {
            var icon = "fa fa-warning shake animated";
            var color = "#C46A69";
            var size = "big";
            stickySmartMessage(title, message, icon, color, size);
        }

        function infoMessage(title, message, timeout) {
            var icon = "fa fa-bell swing animated";
            var color = "#3276B1";
            var size = "small";
            smartMessage(title, message, icon, color, size, timeout);
        }

        function successMessage(title, message, timeout) {
            var icon = "fa fa-check";
            var color = "#739E73";
            var size = "small";
            smartMessage(title, message, icon, color, size, timeout);
        }

        function smartMessage(title, message, icon, color, size, timeout) {
            if (title !== undefined && message !== undefined) {
                title = title ? title : '';
                message = message ? message : '';
                size = size ? size : 'small';
                timeout = timeout ? timeout : '6000';
                icon = icon ? icon : 'fa fa-thumbs-up bounce animated"';
                color = color ? color : '#3276B1';

                if (size == "big") {
                    $.bigBox({
                        title: title,
                        content: message,
                        color: color,
                        icon: icon,
                        number: "1",
                        timeout: timeout
                    });
                }

                if (size == "small") {

                    $.smallBox({
                        title: title,
                        content: "<i class='fa fa-clock-o'></i> <i>" + message + "</i>",
                        color: color,
                        iconSmall: icon,
                        timeout: timeout
                    });

                }

            }

        }

        //TODO: Merge the logic for sticky and regular timeout Smart Message
        function stickySmartMessage(title, message, icon, color, size) {
            if (title !== undefined && message !== undefined) {
                title = title ? title : '';
                message = message ? message : '';
                size = size ? size : 'small';
                icon = icon ? icon : 'fa fa-thumbs-up bounce animated"';
                color = color ? color : '#3276B1';

                if (size == "big") {
                    $.bigBox({
                        title: title,
                        content: message,
                        color: color,
                        icon: icon,
                        number: "1",
                    });
                }

                if (size == "small") {
                    $.smallBox({
                        title: title,
                        content: "<i class='fa fa-clock-o'></i> <i>" + message + "</i>",
                        color: color,
                        iconSmall: icon,
                    });
                }

            }

        }

        function logIt(message, data, source, showToast, toastType) {
            var write = (toastType === 'error') ? $log.error : $log.log;
            source = source ? '[' + source + '] ' : '';
            write(source, message, data);
            if (showToast) {
                if (toastType === 'error') {
                    //toastr.error(message);
                    warningMessage("Error", message, 6000);
                } else if (toastType === 'warning') {
                    //toastr.warning(message);
                    warningMessage("Warning", message);
                } else if (toastType === 'success') {
                    //toastr.success(message);
                    successMessage("Success", message);
                } else {
                    //toastr.info(message);
                    infoMessage("Information", message);

                }

            }
        }
    }
})();