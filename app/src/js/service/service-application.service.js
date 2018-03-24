angular.module('dog-system')
    .factory('ServiceApplication', ['$rootScope',
        function ($rootScope) {

            var ROLE_USER = ['/permission', '/user', '/pet', '/agenda', '/relatorio', '/login', '/logout'];
            var ROLE_EMPLOYEE = ['/breed', '/services'];

            var service = {
                isAuthenticated: isAuthenticated,
                hasAnyPermission: hasAnyPermission,
                getNameUsuLogado: getNameUsuLogado,
                hasAnyPathPermission:hasAnyPathPermission
            };

            function isAuthenticated() {
                return $rootScope.authDetails.authenticated;
            }

            function hasAnyPathPermission(path) {

                 if(hasAnyPermission('ROLE_USER')){
                    return ROLE_USER.indexOf(path) > -1;
                 }

                 if(hasAnyPermission('ROLE_EMPLOYEE')){
                    return ROLE_USER.indexOf(path) > -1 || ROLE_EMPLOYEE.indexOf(path) > -1;
                 }
                
                return true;
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