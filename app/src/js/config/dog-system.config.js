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

        $routeProvider.when('/', {
            templateUrl: path + 'home.tpl.html',
            controller: 'HomeCtrl as  ctrl'
        });

        $routeProvider.when('/login', {
            templateUrl: path + 'login.tpl.html',
            controller: 'LoginCtrl as ctrl'
        });

        $routeProvider.when('/usuario', {
            templateUrl: path + 'user.tpl.html',
            controller: 'UserCtrl as ctrl'
        });

        $routeProvider.when('/perfil', {
            templateUrl: path + 'perfil.tpl.html',
            controller: 'perfilCtrl as ctrl'
        });

        $routeProvider.when('/dogLove', {
            templateUrl: path + 'doglove.tpl.html',
            controller: 'DogloveCtrl as ctrl'
        });

        $routeProvider.when('/animal', {
            templateUrl: path + 'pet.tpl.html',
            controller: 'PetCtrl as ctrl'
        });

        $routeProvider.when('/servico', {
            templateUrl: path + 'servico.tpl.html',
            controller: 'ServicoCtrl as  ctrl'
        });

        $routeProvider.when('/agenda', {
            templateUrl: path + 'agenda.tpl.html',
            controller: 'AgendaCtrl as ctrl'
        });

        $routeProvider.when('/agenda/:id', {
            templateUrl: path + 'agenda.tpl.html',
            controller: 'AgendaCtrl as ctrl'
        });

        $routeProvider.when('/amigopet', {
            templateUrl: path + 'amigopet.tpl.html',
            controller: 'amigopetCtrl as ctrl'
        });

        $routeProvider.when('/contato', {
            templateUrl: path + 'contact.tpl.html',
            controller: 'ContactCtrl as ctrl'
        });

        $routeProvider.when('/raca', {
            templateUrl: path + 'breed.tpl.html',
            controller: 'BreedCtrl as ctrl'
        });

        $routeProvider.when('/404', {
            templateUrl: path + '404.html'
        });

        $routeProvider.otherwise({
            redirectTo: '/404'
        });
    });
