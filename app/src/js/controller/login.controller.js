/**
 * @author Leonardo Mendes 24-02-2018
 */

'use strict';

angular.module('dog-system')
    .controller('LoginCtrl', function ($scope, LoginLogoutSrv, ServiceProxy, ServicePathConstants) {

        $scope.login = function (email, password) {
            LoginLogoutSrv.login(email, password);
        };

    });