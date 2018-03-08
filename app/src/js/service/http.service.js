/**
 * @author Leonardo Mendes 24-02-2018
 */
'use strict';

angular.module('dog-system')
  .service('HttpRequestSrv', ['MessageUtils', '$http', '$rootScope', '$location', '$localStorage',
    function (MessageUtils, $http, $rootScope, $location, $localStorage) {

      var builHttp = builHttp;

      function builHttp(url, method, data, callback) {
        $rootScope.$emit('loading-started');

        $http({
          method: method,
          url: url,
          headers: { 'Content-Type': 'application/json' },
          data: data
        })
          .then(function (response) {

            callback && callback(response.data);

          }, function (error) {

            if (404 == error.status) {

              $location.path("/404"); $location.path("/404");

            } else if (500 == error.status) {

              MessageUtils.error('Erro interno do servidor Erro, interno: Ocorreu um erro no servidor.');

            } else if (409 == error.status) {

              MessageUtils.error('Conflito, Erro interno: Houve um conflito na requisição.');

            } else if ('@401@403@-1@'.indexOf('@' + error.status + '@')) {

              MessageUtils.error('Sua sessão expirou. efetue seu login novamente.')
                .then(function () {
                  delete $localStorage.authDetails;
                  $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
                  $location.path("/login");
                });

            } else {
              var retorno = 'Sem mensagem de erro, Informe ao suporte administador do sistema.';
              if (error) {
                if (error.data) {
                  if (error.data.message) {
                    retorno = error.data.message;
                  }
                }
              }
              MessageUtils.error(retorno);
            }
          })
          .finally(function () {
            $rootScope.$emit('loading-complete');
          });

      }

      return builHttp;
    }]);
