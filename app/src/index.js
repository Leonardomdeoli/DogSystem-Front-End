/**
 * @author Leonardo Mendes 24-02-2018
 */

agGrid.initialiseAgGridWithAngular1(angular);

var dependencias = [
  'ngRoute', 
  'agGrid', 
  'ngCookies', 
  'ngAnimate',
  'ngStorage', 
  'angular.viacep', 
  'ui.utils.masks',
  'ngSanitize', 
  'ui.bootstrap', 
  'checklist-model', 
  'naif.base64', 
  'ngMessages',
  'ngMaterial',
  'ngAria',
  'ngCrypto'
];

angular.module('dog-system', dependencias);