/**
 * @author Leonardo Mendes 24-02-2018
 */

angular.module('dog-system')
  .service('LoginLogoutSrv', ['$http', '$cookies', '$rootScope', '$location', '$localStorage', 'MessageUtils', 'ServicePathConstants',
    function ($http, $cookies, $rootScope, $location, $localStorage, MessageUtils, ServicePathConstants) {

      var urlEmail = ServicePathConstants.PUBLIC_PATH + '/email-send';
      var urlLogin = ServicePathConstants.PUBLIC_PATH + '/login';
      var urlLogout = ServicePathConstants.PUBLIC_PATH + '/logout';
      
      var serviceFactory = {
        login: login,
        logout: logout,
        verifyAuth: verifyAuth,
        forgotPassword: forgotPassword
      };

      function forgotPassword(email) {
        var requestParams = {
          method: 'GET',
          url: urlEmail + '/?email=' + email,
          headers: {'Content-Type': 'application/json'}
        };

        return $http(requestParams);
      }

      function login(email, password) {
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
              $rootScope.authDetails = { name: data.name, authenticated: data.authenticated, permissions: data.authorities};
              $localStorage.authDetails = $rootScope.authDetails;
              $location.path('/');
            } else {
              $rootScope.authDetails = { name: '', authenticated: false, permissions: []};
              MessageUtils.error('O e-mail ou a senha que você digitou não correspondem aos nossos registros.');
            }
          },
          function failure(response) {
            $rootScope.authDetails = { name: '', authenticated: false, permissions: []};
            if (response.status == 401) {
              MessageUtils.error('O e-mail ou a senha que você digitou não correspondem aos nossos registros, favor verifique.');
            } else {
              MessageUtils.error('Ocorreu um erro ao conectar ao nossos servidores, verifique sua conexão.');
            }
          }
        );
      }

      function logout() {
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
      }

      function verifyAuth() {
        if ($localStorage.authDetails) {
          $rootScope.authDetails = $localStorage.authDetails;
        }
      }

      return serviceFactory;
    }]);

