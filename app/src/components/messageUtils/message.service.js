angular.module('dog-system')
    .factory('MessageUtils', ['$uibModal', '$q',
        function ($uibModal, $q) {

            var message = {};

            message.error = function (title, msg) {
                if (arguments.length === 1) {
                    msg = title;
                    title = 'Erro';
                }

                return openPopup(title, msg, 'btn-danger');
            }

            message.confirmeDialog = function (title, msg) {
                if (arguments.length === 1) {
                    msg = title;
                    title = 'Confirmação';
                }

                return openPopup(title, msg, 'btn-primary', true);
            }

            message.alert = function (title, msg) {
                if (arguments.length === 1) {
                    msg = title;
                    title = 'Alerta';
                }
                return openPopup(title, msg, 'btn-warning');
            }

            message.info = function (title, msg) {
                if (arguments.length === 1) {
                    msg = title;
                    title = 'Informação';
                }
                return openPopup(title, msg, 'btn-info');
            }

            function openPopup(title, messagem, tipo, isConfirme) {
                var btnTemplate;
                if (isConfirme) {
                    btnTemplate = ''
                        + ' <div layout="row" layout-align="space-between center">'
                        + '   <button type="button" class="btn btn-danger" ng-click="ok()" style="font-weight: bold;" flex>SIM</button>'
                        + '   <button type="button" class="btn" ng-click="cancel()" style="font-weight: bold;" flex>NÃO</button>'
                        + ' </div>';
                } else {
                    btnTemplate = ''
                    + ' <div div layout="row" layout-align="center center">'
                    + '     <button type="button" class="btn" ng-click="ok()" style="font-weight: bold;" flex>OK</button>'
                    +' </div>';
                }

                var template = ''
                    + ' <div class="modal-content text-center">'
                    + '   <div class="modal-header" ng-class="tipo">'
                    + '      <h4 class="modal-title" ng-bind="title" style="font-weight: bold;"></h4>'
                    + '  </div>'
                    + '  <div class="modal-body">'
                    + '     <h4 class="text-center" ng-bind-html="message" style="min-height: 100px;"></h4>'
                    + ' </div>'
                    + btnTemplate;

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: template,
                    size: 'md',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return {
                                title: title.toUpperCase(),
                                message: messagem,
                                tipo: tipo
                            };
                        }
                    },
                    controller: function ($uibModalInstance, items, $scope) {
                        $scope.title = items.title;
                        $scope.message = items.message;
                        $scope.tipo = tipo;

                        $scope.ok = function () {
                            $uibModalInstance.close({});
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss();
                        };
                    }
                });

                return modalInstance.result;
            }

            return message;
        }]);
