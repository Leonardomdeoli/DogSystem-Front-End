/**
 * @author Leonardo Mendes 24-02-2018
 */

var path = 'src/partials/';

angular.module('dog-system')
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('httpRequestInterceptor');
    })
    .config(function ($routeProvider, $locationProvider) {

        $locationProvider.hashPrefix('');

        $routeProvider
            .when('/', {
                templateUrl: path + 'home.tpl.html',
                controller: 'HomeCtrl as  ctrl'
            })
            .when('/login', {
                templateUrl: path + 'login.tpl.html',
                controller: 'LoginCtrl as ctrl'
            })
            .when('/usuario', {
                templateUrl: path + 'user.tpl.html',
                controller: 'UserCtrl as ctrl'
            })
            .when('/perfil', {
                templateUrl: path + 'perfil.tpl.html',
                controller: 'perfilCtrl as ctrl'
            })
            .when('/dogLove', {
                templateUrl: path + 'doglove.tpl.html',
                controller: 'DogloveCtrl as ctrl'
            })
            .when('/servico', {
                templateUrl: path + 'servico.tpl.html',
                controller: 'ServicoCtrl as  ctrl'
            })
            .when('/agenda', {
                templateUrl: path + 'agenda.tpl.html',
                controller: 'AgendaCtrl as ctrl'
            })
            .when('/agenda/:id', {
                templateUrl: path + 'agenda.tpl.html',
                controller: 'AgendaCtrl as ctrl'
            })
            .when('/animal', {
                templateUrl: path + 'pet.tpl.html',
                controller: 'PetCtrl as ctrl'
            })
            .when('/contato', {
                templateUrl: path + 'contact.tpl.html',
                controller: 'ContactCtrl as ctrl'
            })
            .when('/raca', {
                templateUrl: path + 'breed.tpl.html',
                controller: 'BreedCtrl as ctrl'
            })
            .when('/404', {
                templateUrl: path + '404.html'
            })
            .otherwise({
                redirectTo: '/404'
            });
    });
