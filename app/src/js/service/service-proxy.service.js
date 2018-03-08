angular.module('dog-system')
    .service('ServiceProxy', function (HttpRequestSrv, $http) {
        var restFactory = {};

        // Find all data.
        restFactory.find = function (url, callback) {
            HttpRequestSrv(url, 'GET', {}, callback);
        };

        // Add a new data.
        restFactory.add = function (url, data, callback) {
            HttpRequestSrv(url, 'POST', data, callback);
        };

        // Edit a data.
        restFactory.edit = function (url, data, callback) {
            HttpRequestSrv(url, 'PUT', data, callback);
        };

        restFactory.option = function (url, data, callback) {
            HttpRequestSrv(url, 'OPTIONS', data, callback);
        };

        // Delete a data.
        restFactory.remove = function (url, data, callback) {
            HttpRequestSrv(url, 'DELETE', data, callback);
        };

        return restFactory;
    })