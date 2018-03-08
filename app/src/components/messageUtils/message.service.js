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

                return openPopup(title, msg, 'btn-primary');
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

            function openPopup(title, messagem, tipo) {
                var template = '<div class="modal-content text-center\">'
                    + '<div class="modal-header" ng-class="tipo\">'
                    + '<h4 class="modal-title" ng-bind="title\"></h4></div>'
                    + '<div class="modal-body" style="height: 120px\">'
                    + '<h4 class="text-center" ng-bind="message\"></h4></div>';

                if (tipo == 'btn-primary') {
                    template += '<div><button type="button" class="btn btn-sm btn-info" style="width: 50%" ng-click="ok()\">'
                        + 'SIM</button><button type="button" class="btn btn-sm btn-danger" style="width: 50%" ng-click="cancel()\">'
                        + 'NÃO</button></div>';
                } else {
                    template += '<div><button type="button" class="btn btn-sm"ng-click="ok()" style="width: 100%;">OK</button></div>';
                }

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
