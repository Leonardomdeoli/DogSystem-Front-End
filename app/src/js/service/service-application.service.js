angular.module('dog-system')
    .factory('ServiceApplication', ['$rootScope',
        function ($rootScope) {
            var service = {
                isAuthenticated: isAuthenticated,
                hasAnyPermission: hasAnyPermission,
                getNameUsuLogado: getNameUsuLogado
            };

            function isAuthenticated() {
                return $rootScope.authDetails.authenticated;
            }

            function hasAnyPermission(authorities) {
                var hasPermission = false;

                $rootScope.authDetails.permissions
                    .forEach(function (permission) {
                        authorities.forEach(function (authority) {
                            if (permission.authority === authority) {
                                hasPermission = true;
                            }
                        });
                    });
                return hasPermission;
            }

            function getNameUsuLogado() {
                return $rootScope.authDetails.name;
            }

            return service;
        }]);