'use strict';

angular.module('dog-system')
    .controller('HomeCtrl', ['ServiceApplication', '$location', 'ServicePathConstants', 'ServiceProxy', 'AngularUtils', 'DateUtisConstants',
        function (ServiceApplication, $location, ServicePathConstants, ServiceProxy, AngularUtils, DateUtisConstants) {
            var self = this;

            self.gridOptions = {
                rowData: null,
                columnDefs: [
                    { headerName: "#", field: "id", width: 90, hide: true },
                    { headerName: "Hora", field: "time" },
                    { headerName: "Serviço", field: "service.name", width: 300 },
                    { headerName: "Animal", field: "pet.name" },
                    { headerName: "Porte", field: "pet.breed.porte" },
                    { headerName: "Raça", field: "pet.breed.name" },
                    { headerName: "Observações", field: "note", width: 265 }
                ]
            };

            init();
            function init() {
                if (!ServiceApplication.isAuthenticated()) {
                    $location.path('/login');
                    return;
                }
                var today = AngularUtils.getToday();
                
                self.titulo = 'Lista de agendamento do dia ' + AngularUtils.formatDate(today);

                var _url = ServicePathConstants.PRIVATE_PATH + '/agenda';

                _url = _url + '?datainicial=' + today + '&datafinal=' + today;

                ServiceProxy.find(_url, function (data) {
                    self.gridOptions.api.setRowData(data);
                    var rowData = self.gridOptions.api.getRowNode(0);
                    if (rowData) {
                        rowData.setSelected(true);
                    }
                    self.showFilter = !self.showFilter;
                });
            }
        }]);
