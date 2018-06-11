angular.module('dog-system')
    .factory('ServiceApplication', ['$rootScope',
        function ($rootScope) {

            var ROLE_USER = ['/login', '/usuario', '/perfil', '/dogLove', '/agenda', '/animal', '/404', '/'];
            var ROLE_ADMIN = ['/raca', '/servico'];

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
                return((ROLE_USER.indexOf(path) > -1 && hasAnyPermission('ROLE_USER')) || hasAnyPermission('ROLE_ADMIN'));
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