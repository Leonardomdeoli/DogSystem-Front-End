angular.module('dog-system')
    .factory('ServiceApplication', ['$rootScope',
        function ($rootScope) {

            var ROLE_USER = ['/login', '/usuario', '/perfil', '/dogLove', '/agenda', '/animal', '/404', '/'];

            var service = {
                isAuthenticated: isAuthenticated,
                hasAnyPermission: hasAnyPermission,
                getNameUsuLogado: getNameUsuLogado,
                hasAnyPathPermission: hasAnyPathPermission,
                getIdLogado: getIdLogado,
                hasPermissionUser: hasPermissionUser
            };

            function isAuthenticated() {
                return $rootScope.authDetails.authenticated;
            }

            function hasAnyPathPermission(path) {
                return ((ROLE_USER.indexOf(path) > -1 && hasAnyPermission('ROLE_USER')) || hasAnyPermission('ROLE_ADMIN'));
            }

            function hasAnyPermission(authority) {
                var hasPermission = false;

                var permissions = $rootScope.authDetails.permissions ? $rootScope.authDetails.permissions : [];
                for (var i = 0; i < permissions.length; i++) {
                    if (permissions[i].authority.toUpperCase() == authority.toUpperCase()) {
                        hasPermission = true;
                        break;
                    }
                }

                return hasPermission;
            }

            function hasPermissionUser() {
                return !(hasAnyPermission('ROLE_ADMIN') || hasAnyPermission('ROLE_EMPLOYEE'));
            }

            function getNameUsuLogado() {
                return $rootScope.authDetails.name;
            }

            function getIdLogado() {
                return $rootScope.authDetails.id;
            }

            return service;
        }]);