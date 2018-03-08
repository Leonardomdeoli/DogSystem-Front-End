'use strict';

angular.module('dog-system')
  .filter('formatSex', function() {
    return function(input) {
      switch (input) {
        case 'femea':
          return 'Fêmea';
        break;

        case 'macho':
          return 'Macho';
        break;

        default:
          return 'Unknown';
        break;
      };
    };
  });
