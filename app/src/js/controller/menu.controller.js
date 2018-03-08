'user strict';

angular.module('dog-system').
  controller('headerSrv',
    function ($scope, $rootScope, $location, LoginLogoutSrv, ServicePathConstants, $uibModal, MessageUtils, $http, reportUtils) {

      $scope.hasAnyPermission = function (authorities) {
        var hasPermission = false;

        $rootScope.authDetails.permissions.forEach(function (permission) {
          authorities.forEach(function (authority) {
            if (permission.authority === authority) {
              hasPermission = true;
            }
          });
        });

        return hasPermission;
      };

      $scope.authenticated = function () {
        return $rootScope.authDetails.authenticated;
      }

      $scope.logout = function () {
        LoginLogoutSrv.logout();
      };


      $scope.reportBreed = function () {
        reportUtils.buildReport(null, 'Raças dos animais', '/report-racas');
      }

      $scope.reportClientePet = function () {
        reportUtils.buildReport(null, 'Clientes e pets', '/report-clientes-pet');
      }
    });
