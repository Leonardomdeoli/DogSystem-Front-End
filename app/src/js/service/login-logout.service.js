'use strict';

angular.module('dog-system')
  .service('LoginLogoutSrv', ['$http', '$cookies', '$rootScope', '$location', '$localStorage', 'MessageUtils', 'ServicePathConstants',
    function ($http, $cookies, $rootScope, $location, $localStorage, MessageUtils, ServicePathConstants) {

      var serviceFactory = {};
      var urlLogin = ServicePathConstants.PUBLIC_PATH + '/login';
      var urlLogout = ServicePathConstants.PUBLIC_PATH + '/logout';

      serviceFactory.login = function (email, password) {
        var requestParams = {
          method: 'GET',
          url: urlLogin,
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'Basic ' + btoa(email + ':' + password)
          }
        };

        $http(requestParams).then(
          function success(response) {
            var data = response.data;

            if (data.name) {
              $rootScope.authDetails = { name: data.name, authenticated: data.authenticated, permissions: data.authorities, user: data.principal.user };
              $localStorage.authDetails = $rootScope.authDetails;
              $location.path('/');
            } else {
              $rootScope.authDetails = { name: '', authenticated: false, permissions: [], user: '' };
              MessageUtils.error('O e-mail ou a senha que você digitou não correspondem aos nossos registros.');
            }
          },
          function failure(response) {
            $rootScope.authDetails = { name: '', authenticated: false, permissions: [], user: '' };
            MessageUtils.error('O e-mail ou a senha que você digitou não correspondem aos nossos registros.');
          }
        );
      };

      serviceFactory.logout = function () {
        var requestParams = {
          method: 'POST',
          url: urlLogout,
          headers: { 'Content-Type': 'application/json' }
        };

        $http(requestParams).finally(function success(response) {
          delete $localStorage.authDetails;
          $rootScope.authDetails = { name: '', authenticated: false, permissions: [], id: '' };
          $location.path("/login");
        });
      };

      serviceFactory.verifyAuth = function () {
        if ($localStorage.authDetails) {
          $rootScope.authDetails = $localStorage.authDetails;
        }
      };

      return serviceFactory;
    }]);

