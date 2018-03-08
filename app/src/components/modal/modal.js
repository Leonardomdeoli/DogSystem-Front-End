angular.module('dog-system')
    .controller('ModalInstanceCtrl', ['$uibModalInstance', 'data',
        function ($uibModalInstance, data) {
            var $ctrl = this;

            $ctrl.items = data.items;


            $ctrl.content = 'Deseja realmente excluir esse registro da base de dados?';

            $ctrl.title = 'Confirmação';
            $ctrl.lblBtnOk = 'OK';
            $ctrl.lblBtnCancel = 'Cancelar';

            if (angular.isDefined(data)) {

                if (angular.isDefined(data.title)) {
                    $ctrl.title = data.title;
                }

                if (angular.isDefined(data.content)) {
                    $ctrl.content = data.content;
                }

                if (angular.isDefined(data.lblBtnOk)) {
                    $ctrl.lblBtnOk = data.lblBtnOk;
                }
                $ctrl.showBtnOk = data.showBtnOk != false;

                if (angular.isDefined(data.lblBtnCancel)) {
                    $ctrl.lblBtnCancel = data.lblBtnCancel;
                }
                $ctrl.showBtnCancel = data.showBtnCancel != false;
            }

            $ctrl.selected = {
                item: $ctrl.items[0]
            };

            $ctrl.ok = function () {
                $uibModalInstance.close(data);
            };

            $ctrl.cancel = function () {
                $uibModalInstance.dismiss(data);
            };
        }]);