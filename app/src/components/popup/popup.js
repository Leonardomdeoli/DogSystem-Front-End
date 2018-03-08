angular.module('dog-system')
    .controller('ModalInstanceCtrl', ['$uibModalInstance', 'ServiceProxy', 'data', 'MessageUtils',
        function ($uibModalInstance, ServiceProxy, data, MessageUtils) {
            var self = this;

            self.aplicar = aplicar;
            self.sair = sair;

            init();
            function init() {
                self.title = data.title;

                self.gridOptions = {
                    columnDefs: data.columnDefs,
                    paginationPageSize: 5
                };

                recarregar();
            }

            function recarregar() {
                ServiceProxy.find(data.url, function (data) {
                    try {
                        self.gridOptions.api.setRowData(data);
                        self.gridOptions.api.getRowNode(0).setSelected(true);
                    } catch (error) {
                        recarregar();
                    }
                });
            }

            function aplicar() {
                var selected = self.gridOptions.api.getSelectedRows();
                if (angular.isUndefined(selected)) {
                    MessageUtils.alert('Favor selecione um animal para aplicar');
                    return;
                }
                $uibModalInstance.close(selected[0]);
            };

            function sair() {
                $uibModalInstance.dismiss();
            };
        }]);