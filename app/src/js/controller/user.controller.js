angular.module('dog-system')
    .controller('UserCtrl', ['ServiceApplication', 'ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location',
        function (ServiceApplication, ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location) {
            var self = this;

            var _userUrl = ServicePathConstants.PRIVATE_PATH + '/user';

            self.user = {};
            self.users = [];
            self.permissions = [{ id: 1, role: "ROLE_ADMIN" }, { id: 2, role: "ROLE_EMPLOYEE" }, { id: 3, role: "ROLE_USER" }];
            self.facePanel = 0;
            self.showList = false;
            self.isEditFields = true;
            self.showBoxPassword = false;
            self.btnSalvar = 'Salvar';

            self.rgxEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            self.rgxLetras = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/;


            self.listUser = listUser;
            self.buscarUser = buscarUser;
            self.setFacePanel = setFacePanel;
            self.edit = edit;
            self.recarregar = recarregar;
            self.remover = remover;
            self.add = add;

            self.maxSize = 5;
            self.numPerPage = 6;
            self.gridOptions = {
                columnDefs: [
                    { headerName: "Código", field: "id", width: 100, cellStyle: { 'text-align': 'right' } },
                    {
                        headerName: "CPF", field: "cpf", suppressFilter: true, width: 200, cellStyle: { 'text-align': 'right' },
                        cellRenderer: function (params) {
                            return params.data.cpf
                                .replace(/(\d{3})(\d)/, "$1.$2")
                                .replace(/(\d{3})(\d)/, "$1.$2")
                                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                        }
                    },
                    { headerName: "Name", field: "name", width: 300 },
                    { headerName: "Email", field: "email", width: 200 },
                    {
                        headerName: "Telefone", field: "phone", cellStyle: { 'text-align': 'right' }, suppressFilter: true, width: 200, cellRenderer: function (params) {
                            return params.data.phone
                                .replace(/(\d{2})(\d)/, "($1) $2")
                                .replace(/(\d{3})(\d{1,4})$/, "$1-$2");
                        }
                    },
                    {
                        headerName: "CEP", field: "address.zipcode", cellStyle: { 'text-align': 'right' }, width: 150, cellRenderer: function (params) {
                            return params.data.address.zipcode
                                .replace(/(\d{3})(\d{1,3})$/, "$1-$2");
                        }
                    },
                    { headerName: "Rua", field: "address.name", width: 200 },
                    { headerName: "Número", field: "number", width: 150, suppressFilter: true, cellStyle: { 'text-align': 'right' } },
                    { headerName: "Bairro", field: "address.neighborhood.name", width: 200 },
                    { headerName: "Cidade", field: "address.neighborhood.city.name", width: 200 },
                    { headerName: "Estado", field: "address.neighborhood.city.uf.sigla", width: 100 },
                ]
            };

            init();
            function init() {
                if (!$rootScope.authDetails.authenticated) {
                    $location.path("/login");
                } else {
                    listUser();
                }
            }
            function listUser() {
                ServiceProxy.find(_userUrl, function (data) {
                    self.gridOptions.api.setRowData(data);
                    var rowData = self.gridOptions.api.getRowNode(0);
                    if (rowData) {
                        rowData.setSelected(true);
                    }
                    modifyTela(false);
                });
            }

            function setFacePanel(index) {
                self.facePanel = index;
            }

            self.sort = function (keyname) {
                self.sortKey = keyname;   //set the sortKey to the param passed
                self.reverse = !self.reverse; //if true make it false and vice versa
            }

            function add() {
                self.user = {
                    permissions: 1
                };
                modifyTela(true);
                self.showBoxPassword = true;
                self.isEditFields = false;
            }

            function modifyTela(condicao) {
                self.facePanel = condicao;
                self.showList = !condicao;
                self.permissionInvalid = false;
            };

            function buscarUser() {
                ServiceProxy.find(_userUrl + "/" + self.nameuser, function (data) {
                    self.users = data;
                    modifyTela(false);
                });
            }

            self.enviar = function (condicao) {
                try {
                    if (!condicao) {
                        throw "Formulário está inválido, favor verfique.";
                    }

                    if (!self.isEditFields && self.user.permissions[0] == undefined) {
                        self.permissionInvalid = true;
                        throw "Selecione uma permissão antes de continuar.";
                    }
                    self.permissionInvalid = false;

                    if (angular.isUndefined(self.user.id)) {
                        ServiceProxy.add(_userUrl, self.user, function (response) {
                            self.gridOptions.api.updateRowData({ add: [response.data] });
                        });
                    } else {
                        ServiceProxy.edit(_userUrl, self.user, function (response) {
                            self.gridOptions.api.refreshCells();
                        });
                    }
                } catch (error) {
                    MessageUtils.error(error);
                } finally {
                    self.showBoxPassword = false;
                }
            }

            function edit(param) {
                var selected = self.gridOptions.api.getSelectedRows();
                self.user = selected[0];

                if (self.user) {
                    self.showBoxPassword = $rootScope.authDetails.id != self.user.id;
                    self.isEditFields = !self.showBoxPassword;
                    self.facePanel = 1;
                }else if(angular.isUndefined(param)){
                    MessageUtils.error('Selecione um usuário para editar');
                }
            }

            function remover() {
                var selectedData = self.gridOptions.api.getSelectedRows();
                self.user = selectedData[0];

                if (ServiceApplication.getIdLogado() == self.user.id) {
                    MessageUtils.error('Somente outro usuário com acesso a exclusão pode remover seu usuário');
                } else {
                    if (self.user) {
                        MessageUtils.confirmeDialog('Deseja realmente apagar o usuário ' + self.user.name)
                            .then(function () {
                                ServiceProxy.remove(_userUrl + '/id/' + self.user.id, function () {

                                    self.gridOptions.api.updateRowData({ remove: selectedData });
                                    var rowData = self.gridOptions.api.getRowNode(0);
                                    if (rowData) {
                                        rowData.setSelected(true);
                                    }

                                });
                            });
                    } else {
                        MessageUtils.error('Selecione um usuário para remover');
                    }
                }
            };

            function recarregar() {
                listUser();
            }

        }]);


