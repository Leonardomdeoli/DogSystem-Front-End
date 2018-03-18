/**
 * @author Leonardo Mendes 24-02-2018
 */

angular.module('dog-system')
    .controller('LoginCtrl', ['LoginLogoutSrv', '$localStorage', '$rootScope', 'AngularUtils',
        function (LoginLogoutSrv, $localStorage, $rootScope, AngularUtils) {
            var self = this;

            self.textInfo = "";
            self.login = login;
            self.showPassword = showPassword;
            self.forgotPassword = forgotPassword;
            self.mostar = false;
            self.MostarSenha = 0;

            init();
            function init(params) {
                delete $localStorage.authDetails;
                $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
            }

            function login(email, password) {
                LoginLogoutSrv.login(email, password);
            }

            function forgotPassword(email) {
                var promisse = LoginLogoutSrv.forgotPassword(email);

                self.mostar = true;
                promisse.then(
                    function success(response) {
                        var data = response.data.atributeMessage;
                        self.textInfo = data.mensagem;
                        self.mostar = false;
                    },
                    function failure(response) {
                        var mensagem = AngularUtils.getProperty(response, 'data.atributeMessage.mensagem');

                        self.mostar = false;

                        self.textInfo = mensagem ? mensagem : 'Ocorreu um ao erro ao solicitar sua nova senha';
                    }
                );
            }

            function showPassword(indice) {
                var key_attr = $('#key').attr('type');

                if (key_attr != 'text') {
                    $('#key').attr('type', 'text');
                } else {
                    $('#key').attr('type', 'password');
                }
                self.MostarSenha = indice;
            }

        }]);