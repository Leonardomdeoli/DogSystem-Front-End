'user strict';

angular.module('dog-system').
  controller('headerSrv', ['$scope', '$rootScope', 'LoginLogoutSrv', 'reportUtils',
    function ($scope, $rootScope, LoginLogoutSrv, reportUtils) {

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

      $scope.setType = function (tipo) {
        $scope.selectCode = tipo;
      };

    }]);
