'use strict';

angular.module('dog-system')
    .controller('perfilCtrl', ['ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location',
        function (ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location) {
            var self = this;

            var _userUrl = ServicePathConstants.PRIVATE_PATH + '/user';

            self.user = {};
            self.rgxEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            self.rgxLetras = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/;

            self.enviar = enviar;

            init();
            function init() {
                ServiceProxy.find(_userUrl + '/id/' + $rootScope.authDetails.id, function (data) {
                    self.user = data;
                });
            }

            function enviar(condicao) {
                try {
                    if (!condicao) {
                        throw "Formulário está inválido, favor verfique.";
                    }

                    ServiceProxy.edit(_userUrl, self.user);

                } catch (error) {
                    MessageUtils.error(error);
                }
            }
        }]);


