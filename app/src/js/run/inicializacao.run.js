/**
 * @author Leonardo Mendes 24-02-2018
 */

'use strict';

angular.module('dog-system')
    .run(function ($rootScope, MessageUtils, LoginLogoutSrv) {
        $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
        LoginLogoutSrv.verifyAuth();
    });