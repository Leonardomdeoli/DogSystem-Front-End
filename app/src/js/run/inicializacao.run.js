/**
 * @author Leonardo Mendes 24-02-2018
 */

angular.module('dog-system')
    .run(function ($rootScope, MessageUtils, LoginLogoutSrv) {
        $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
        LoginLogoutSrv.verifyAuth();

    }).run(function ($rootScope, $route, $routeParams, $location, ServiceApplication, ngNotify) {

        $rootScope.$on('$routeChangeStart', function (evt, next, current) {
            if (!$rootScope.authDetails.authenticated) {
                $location.path("/login");
            } else if (current && !ServiceApplication.hasAnyPathPermission(next.$$route.originalPath)) {
                $location.path(current.$$route.originalPath);
            }
        });

        $rootScope.$route = $route;
        $rootScope.$location = $location;
        $rootScope.$routeParams = $routeParams;

        ngNotify.config({
            theme: 'pure',
            position: 'bottom',
            duration: 3000,
            type: 'info',
            sticky: false,
            button: true,
            html: false
        });
    });