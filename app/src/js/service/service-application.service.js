angular.module('dog-system')
    .factory('ServiceApplication', ['$rootScope',
        function ($rootScope) {

            var ROLE_USER = ['/permission', '/user', '/pet', '/agenda', '/relatorio', '/login', '/logout'];
            var ROLE_EMPLOYEE = ['/breed', '/services'];

            var service = {
                isAuthenticated: isAuthenticated,
                hasAnyPermission: hasAnyPermission,
                getNameUsuLogado: getNameUsuLogado,
                hasAnyPathPermission: hasAnyPathPermission,
                getIdLogado: getIdLogado
            };

            function isAuthenticated() {
                return $rootScope.authDetails.authenticated;
            }

            function hasAnyPathPermission(path) {

                if (hasAnyPermission('ROLE_USER')) {
                    return ROLE_USER.indexOf(path) > -1;
                }

                if (hasAnyPermission('ROLE_EMPLOYEE')) {
                    return ROLE_USER.indexOf(path) > -1 || ROLE_EMPLOYEE.indexOf(path) > -1;
                }

                return true;
            }

            function hasAnyPermission(authority) {
                var hasPermission = false;

                var permissions = ["ROLE_ADMIN", "ROLE_EMPLOYEE", "ROLE_USER"];
                    
                    for (var i = 0; i < permissions.length; i++) {
                        if(permissions[i].toUpperCase() == authority.toUpperCase()){
                            hasPermission = true;
                            break;
                        }
                    }
                
                return hasPermission;
            }

            function getNameUsuLogado() {
                return $rootScope.authDetails.name;
            }

            function getIdLogado() {
                return $rootScope.authDetails.id;
            }

            return service;
        }]);