'use strict';


angular.module('dog-system')
    .controller('UserCtrl', ['ServiceApplication', 'ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location',
        function (ServiceApplication, ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location) {
            var self = this;

            var _permissionUrl = ServicePathConstants.PRIVATE_PATH + '/permission';
            var _userUrl = ServicePathConstants.PRIVATE_PATH + '/user';

            self.user = {};
            self.users = [];
            self.permissions = [];
            self.facePanel = 0;
            self.showList = false;
            self.isEditFields = true;
            self.btnSalvar = 'Salvar';

            self.rgxEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            self.rgxLetras = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/;


            self.listUser = listUser;
            self.newUser = newUser;
            self.buscarUser = buscarUser;
            self.setFacePanel = setFacePanel;
            self.edit = edit;
            self.recarregar = recarregar;
            self.remover = remover;

            self.maxSize = 5;
            self.numPerPage = 6;
            self.gridOptions = {
                columnDefs: [
                    { headerName: "#", field: "id", width: 90, valueGetter: 'node.id', hide: true },
                    {
                        headerName: "CPF", field: "cpf", suppressFilter: true, width: 200, cellRenderer: function (params) {
                            return params.data.cpf
                                .replace(/(\d{3})(\d)/, "$1.$2")
                                .replace(/(\d{3})(\d)/, "$1.$2")
                                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                        }
                    },
                    { headerName: "Name", field: "name", width: 300 },
                    { headerName: "Email", field: "email", width: 200 },
                    {
                        headerName: "Telefone", field: "phone", suppressFilter: true, width: 200, cellRenderer: function (params) {
                            return params.data.phone
                                .replace(/(\d{2})(\d)/, "($1) $2")
                                .replace(/(\d{3})(\d{1,4})$/, "$1-$2");
                        }
                    },
                    {
                        headerName: "CEP", field: "address.zipcode", width: 150, cellRenderer: function (params) {
                            return params.data.address.zipcode
                                .replace(/(\d{3})(\d{1,3})$/, "$1-$2");
                        }
                    },
                    { headerName: "Rua", field: "address.name", width: 200 },
                    { headerName: "Número", field: "number", width: 100, suppressFilter: true },
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

            function newUser() {
                getPermission();
                self.user = {};
                modifyTela(true);
            }

            function modifyTela(condicao) {
                self.facePanel = condicao;
                self.showList = !condicao;
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

                    if (angular.isUndefined(self.user.id)) {
                        ServiceProxy.add(_userUrl, self.user);
                    } else {
                        ServiceProxy.edit(_userUrl, self.user);
                    }
                } catch (error) {
                    MessageUtils.error(error);
                }
            }

            function edit(user) {
                var selected = self.gridOptions.api.getSelectedRows();
                self.user = selected[0];

                if ($rootScope.authDetails.user.id == self.user.id) {
                    self.isEditFields = false;
                }

                self.facePanel = 1;
            }

            function remover() {
                var selected = self.gridOptions.api.getSelectedRows();
                self.user = selected[0];

                MessageUtils.confirmeDialog('Deseja realmente apagar o ' + self.user.name + ' usuário')
                    .then(function () {
                        ServiceProxy.remove(_userUrl, self.user);
                    });
            };

            function recarregar() {
                listUser();
            }

        }]);


