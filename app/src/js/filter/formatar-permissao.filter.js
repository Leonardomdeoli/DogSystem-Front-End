'use strict';

angular.module('dog-system')
  .filter('formatPermission', function() {
    return function(input) {
      switch (input) {
        case 'ROLE_ADMIN':
          return 'Administrador';
        break;

        case 'ROLE_USER':
          return 'Usuário';
        break;

        case 'ROLE_EMPLOYEE':
          return 'Funcionário';
        break;

        default:
          return 'Unknown';
        break;
      };
    };
  });  