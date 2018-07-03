angular.module('dog-system')
    .controller('BreedCtrl', ['ServiceProxy', 'ServicePathConstants', '$uibModal', 'MessageUtils', '$rootScope', '$http', '$scope', '$q',
        function (ServiceProxy, ServicePathConstants, $uibModal, MessageUtils, $rootScope, $http, $scope, $q) {
            var self = this;

            var _breedUrl = ServicePathConstants.PRIVATE_PATH + '/breed';

            self.pageChanged = pageChanged;
            self.getBreed = getBreed;
            self.setFacePanel = setFacePanel;
            self.edit = edit;
            self.recarregar = recarregar;
            self.remover = remover;
            self.add = add;

            self.breed = {};
            self.enableValid = true;
            self.facePanel = 0;
            self.gridOptions = {
                columnDefs: [
                    { headerName: "#", field: "id", width: 90, valueGetter: 'node.id', hide: true,cellStyle: { 'text-align': 'right' } },
                    {
                        headerName: "Especie", field: "tipoAnimal", width: 129, suppressFilter: true,cellStyle: { 'text-align': 'center' },
                        cellRenderer: function (params) {
                            var icon = params.data.tipoAnimal == 'Cão' ? 'dog.svg' : 'cat.svg';
                            return '<img src="img/' + icon + '" style="width: 24px;"></i>';
                        }
                    },
                    { headerName: "Nome", field: "name", width: 300 },
                    { headerName: "Porte", field: "porte", width: 200 },
                    { headerName: "Vida", field: "life", cellStyle: { 'text-align': 'right' } },
                    { headerName: "Peso", field: "weight", cellStyle: { 'text-align': 'right' } },
                    { headerName: "Altura", field: "height",cellStyle: { 'text-align': 'right' } }
                ],

            };

            self.tipoAnimais = {
                options: ['Cão', 'Gato']
            };

            self.portes = {
                options: ['Pequeno', 'Médio', 'Grande', 'Gigante']
            };

            init();
            function init() {
                if (!$rootScope.authDetails.authenticated) {
                    $location.path("/login");
                } else {
                    getBreed();
                }
            }

            function pageChanged() {
                getBreed(self.currentPage);
            }

            function getBreed() {
                ServiceProxy.find(_breedUrl, function (data) {
                    self.gridOptions.api.setRowData(data);
                    var rowData = self.gridOptions.api.getRowNode(0);
                    if (rowData) {
                        rowData.setSelected(true);
                    }
                    self.countRow = self.gridOptions.api.getDisplayedRowCount();
                });
            }

            function setFacePanel(face) {
                self.facePanel = face;
            }

            function edit(param) {
                var selected = self.gridOptions.api.getSelectedRows();
                self.breed = selected[0];
                if (self.breed) {
                    setFacePanel(1);
                } else if(angular.isUndefined(param)){
                    MessageUtils.error('Selecione uma raça para editar');
                }
            }

            function add() {
                self.breed = undefined;
                setFacePanel(1);
            }

            self.enviar = function (condicao) {
                if (condicao) {
                    if (self.breed.id) {
                        ServiceProxy.edit(_breedUrl, self.breed, function (response) {
                            self.gridOptions.api.refreshCells();
                            setFacePanel(0);
                        });

                    } else {
                        ServiceProxy.add(_breedUrl, self.breed, function (response) {
                            self.gridOptions.api.updateRowData({ add: [response.data] });
                            setFacePanel(0);
                        });
                    }

                }
                self.enableValid = condicao;
            }

            function recarregar() {
                getBreed();
            }

            function remover() {
                var selectedData = self.gridOptions.api.getSelectedRows();
                var breed = selectedData[0];
                if (breed) {
                    MessageUtils.confirmeDialog('Deseja realmente apagar esta raça ' + breed.name)
                        .then(function () {
                            ServiceProxy.remove(_breedUrl, breed, function () {
                                self.gridOptions.api.updateRowData({ remove: selectedData });
                                var rowData = self.gridOptions.api.getRowNode(0);
                                if (rowData) {
                                    rowData.setSelected(true);
                                }
                            });
                        });

                }else{
                    MessageUtils.error('Selecione uma raça para remover');
                }
            }
        }]);