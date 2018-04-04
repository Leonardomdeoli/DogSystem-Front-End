angular.module('dog-system')
    .controller('ModalInstanceCtrl', ['$uibModalInstance', 'ServiceProxy', 'data', 'MessageUtils', '$timeout',
        function ($uibModalInstance, ServiceProxy, data, MessageUtils, $timeout) {
            var self = this;

            self.aplicar = aplicar;
            self.sair = sair;
            self.cellClicked = cellClicked;

            init();
            function init() {
                self.title = data.title;

                self.gridOptions = {
                    columnDefs: data.columnDefs,
                    paginationPageSize: 10
                };

                $timeout(recarregar, 300);
            }

            function cellClicked(event) {
                self.selecionado = event.data.name;
                self.selecionado = "teste";
            }

            function recarregar() {
                ServiceProxy.find(data.url, function (data) {
                    self.gridOptions.api.setRowData(data);
                    self.gridOptions.api.getRowNode(0).setSelected(true);
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