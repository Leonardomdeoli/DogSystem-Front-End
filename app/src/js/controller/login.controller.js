/**
 * @author Leonardo Mendes 24-02-2018
 */

angular.module('dog-system')
    .controller('LoginCtrl', ['LoginLogoutSrv',
        function (LoginLogoutSrv) {
            var self = this;

            self.textInfo = "";
            self.login = login;
            self.showPassword = showPassword;
            self.forgotPassword = forgotPassword;
            self.mostar = false;
            
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
                        var data = response.data;
                        if (data.atributeMessage.mensagem) {
                            self.textInfo = data.atributeMessage.mensagem;
                        } else {
                            self.textInfo = 'Ocorreu um ao erro ao solicitar sua nova senha';
                        }
                        self.mostar = false;
                    }
                );
            }

            function showPassword() {
                var key_attr = $('#key').attr('type');

                if (key_attr != 'text') {

                    $('.checkbox').addClass('show');
                    $('#key').attr('type', 'text');

                } else {

                    $('.checkbox').removeClass('show');
                    $('#key').attr('type', 'password');

                }
            }

        }]);