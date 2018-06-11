angular.module('dog-system')
    .controller('ModalImageCtrl', ['AngularUtils', '$uibModalInstance', 'ServiceProxy', 'data', 'MessageUtils', '$timeout', 'textAngularManager', '$http', 'ServicePathConstants',
        function (AngularUtils, $uibModalInstance, ServiceProxy, data, MessageUtils, $timeout, textAngularManager, $http, ServicePathConstants) {
            var self = this;

            self.aplicar = aplicar;
            self.sair = sair;

            self.toolbar = [[], ['bold', 'italics', 'ul', 'ol', 'redo'], ['justifyLeft', 'justifyCenter', 'justifyRight'], ['insertImage', 'insertLink', 'insertVideo']];


            init();
            function init() {
                self.pet = data.params;
                // var newDate = new Date(self.pet.dateBirth);
                // var ano_aniversario = newDate.getFullYear();
                // var mes_aniversario = newDate.getMonth() + 1;
                // var dia_aniversario = newDate.getDate();

                // var dateBirth = idade(ano_aniversario, mes_aniversario, dia_aniversario);

                self.descricao = self.pet.name;
            }

            function aplicar() {
                if (AngularUtils.emptyAsUndefined(self.htmlVariable) == undefined) {
                    MessageUtils.alert('E nessário informar alguma mensagem para o proprietário do animal');
                    return;
                }

                if (self.htmlVariable.toString().length < 50) {
                    MessageUtils.alert('E nessário informar 50 caracteres na mensagem para o proprietário do animal');
                    return;
                }

                var urlEmail = ServicePathConstants.PUBLIC_PATH + '/email-send/sendMailDogLove?texto=' + self.htmlVariable + '&email=' + self.pet.user.email;
                var requestParams = {
                    method: 'GET',
                    url: urlEmail,
                    headers: { 'Content-Type': 'application/json' }
                };

                return $http(requestParams);
                //$uibModalInstance.close();
            };

            function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
                var d = new Date,
                    ano_atual = d.getFullYear(),
                    mes_atual = d.getMonth() + 1,
                    dia_atual = d.getDate(),

                    ano_aniversario = +ano_aniversario,
                    mes_aniversario = +mes_aniversario,
                    dia_aniversario = +dia_aniversario,

                    quantos_anos = ano_atual - ano_aniversario;

                if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
                    quantos_anos--;
                }

                return quantos_anos < 0 ? 0 : quantos_anos;
            }

            function sair() {
                $uibModalInstance.dismiss();
            };
        }]);