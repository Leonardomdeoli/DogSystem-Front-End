'use strict';


angular.module('dog-system')
    .controller('UserCtrl', ['ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location',
        function (ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location) {
            var self = this;

            var _permissionUrl = ServicePathConstants.PRIVATE_PATH + '/permission';
            var _userUrl = ServicePathConstants.PRIVATE_PATH + '/user';

            self.user = {};
            self.users = [];
            self.permissions = [];
            self.showAddEditUser = false;
            self.showList = false;
            self.isEditFields = true;
            self.btnSalvar = 'Salvar';

            self.rgxEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            self.rgxLetras = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/;


            self.listUser = listUser;
            self.newUser = newUser;
            self.buscarUser = buscarUser;
            self.pageChanged = pageChanged;

            self.maxSize = 5;
            self.numPerPage = 6;

            init();
            function init() {
                if (!$rootScope.authDetails.authenticated) {
                    $location.path("/login");
                } else {
                    listUser(1);
                }
            }

            function pageChanged() {
                listUser(self.currentPage);
            }

            function listUser(pageNo) {
                var page = pageNo - 1;

                ServiceProxy.find(_userUrl + '/pagina/' + page + '/qtd/' + self.numPerPage, function (data) {
                    self.users = data.content;
                    self.totalItems = data.totalElements;
                    modifyTela(false);
                });
                self.currentPage = pageNo;
            }

            self.sort = function (keyname) {
                self.sortKey = keyname;   //set the sortKey to the param passed
                self.reverse = !self.reverse; //if true make it false and vice versa
            }

            function getPermission() {
                self.btnSalvar = 'Salvar';
                self.isEditFields = true;
                ServiceProxy.find(_permissionUrl, function (data) {
                    self.permissions = data;
                });
            }

            function newUser() {
                getPermission();
                self.user = {};
                modifyTela(true);
            }

            function modifyTela(condicao) {
                self.showAddEditUser = condicao;
                self.showList = !condicao;
            };

            function buscarUser() {
                self.nameuser
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

            self.editUser = function (user) {
                self.user = angular.copy(user);

                if ($rootScope.authDetails.user.id != self.user.id) {
                    getPermission();
                } else {
                    self.isEditFields = false;
                    self.btnSalvar = 'Atualizar';
                }

                modifyTela(true);
            }

            self.deleteUser = function (user) {
                MessageUtils.confirmeDialog('Deseja realmente apagar este registo')
                    .then(function () {
                        ServiceProxy.remove(_userUrl, user);
                });
            };

        }]);


