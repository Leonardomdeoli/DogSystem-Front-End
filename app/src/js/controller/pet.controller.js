'use strict';

angular.module('dog-system')
    .controller('PetCtrl', ['ServiceApplication', 'base64', '$uibModal', 'ServicePathConstants', 'ServiceProxy', '$q', '$scope', 'MessageUtils', '$rootScope', '$location', 'AngularUtils',
        function (ServiceApplication, base64, $uibModal, ServicePathConstants, ServiceProxy, $q, $scope, MessageUtils, $rootScope, $location, AngularUtils) {
            var self = this;

            var _msg = 'Verifique o formulário pois pode conter erros';
            var page = 0;
            var ehPermissionUser = false;
            var _petUrl = ServicePathConstants.PRIVATE_PATH + '/pet';

            self.sexs = ["macho", "femea"];
            self.pets = [];

            self.gridOptions = {
                columnDefs: getColumnDefs('pet')
            };

            self.pageChanged = pageChanged;
            self.getPet = getPet;
            self.eventKeyPro = eventKeyPro;
            self.eventKeyBreed = eventKeyBreed;
            self.openPopup = openPopup;
            self.setFacePanel = setFacePanel;
            self.agendar = agendar;
            self.add = add;
            self.edit = edit;
            self.recarregar = recarregar;
            self.remover = remover;

            self.maxSize = 5;
            self.numPerPage = 6;


            init();
            function init() {
                self.facePanel = 0;
                ehPermissionUser = ServiceApplication.hasAnyPermission('ROLE_USER');
                getPet();
            }

            function recarregar() {
                getPet();
            }

            self.sort = function (keyname) {
                self.sortKey = keyname;   //set the sortKey to the param passed
                self.reverse = !self.reverse; //if true make it false and vice versa
            }

            function pageChanged() {
                getPet(self.currentPage);
            }

            function getPet() {
                var user = '';
                if (ehPermissionUser) {
                    user = '?user=' + ServiceApplication.getIdLogado();
                }

                self.pets = [];
                ServiceProxy.find(_petUrl + user, function (data) {
                    if (data.length > 0) {
                        self.gridOptions.api.setRowData(data);
                        var rowData = self.gridOptions.api.getRowNode(0);
                        rowData.setSelected(true);
                    } else {
                        self.gridOptions.api.setRowData(undefined);
                    }
                });
            }

            function setFacePanel(indice) {
                self.facePanel = indice;
            }

            self.modifyTipoAnimal = function () {
                self.pet.breed = undefined;
            }

            function add() {
                self.pet = {
                    image: {
                        filetype: 'image/svg+xml;utf8',
                        base64: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4IiB2aWV3Qm94PSIwIDAgMzkwLjEyNiAzOTAuMTI1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzOTAuMTI2IDM5MC4xMjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTMyLjY0LDE3Ny44NTljMzEuMTYyLDAsNTYuNTA4LTM0LjAxNCw1Ni41MDgtNzUuODM0YzAtNDEuODE3LTI1LjM0Ny03NS44NDEtNTYuNTA4LTc1Ljg0MSAgICBjLTMxLjE1MywwLTU2LjUwMiwzNC4wMjMtNTYuNTAyLDc1Ljg0MUM3Ni4xMzgsMTQzLjg0NSwxMDEuNDg3LDE3Ny44NTksMTMyLjY0LDE3Ny44NTl6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTMwMC4yNDYsMjUxLjYyOGMtMS4xNTktMS41NzktMi4yNy0zLjA2OC0yLjg2NC00LjM0OGMtMTIuNjM1LTI3LjA0Ni00Ny4yNy01OC45MzEtMTAzLjM4Mi01OS43MjRsLTIuMTU5LTAuMDEyICAgIGMtNTUuMjUsMC04OS42MjcsMzAuMTk3LTEwMy4zODEsNTguNDY5Yy0wLjQ3NSwwLjk2Ny0xLjUyLDIuMjIyLTIuNjI3LDMuNTQ5Yy0xLjMxLDEuNTU1LTIuNjA2LDMuMTQ2LTMuNzE0LDQuODc1ICAgIGMtMTEuNjE5LDE4LjA3NS0xNy41NDMsMzguNDI2LTE2LjY2OSw1Ny4yOTljMC45MTYsMjAuMDM3LDkuMzA1LDM2LjEzMSwyMy41ODEsNDUuMzEyYzUuNzY4LDMuNzA1LDExLjk5Miw1LjU3MiwxOC41MjIsNS41NzIgICAgYzEzLjQ2NSwwLDI1Ljc5My03LjU4NCw0MC4wNzktMTYuMzY4YzkuMDgzLTUuNTk4LDE4LjQ2NS0xMS4zNzQsMjguODg2LTE1LjY5N2MxLjE2OC0wLjM4NSw1Ljk1NC0wLjk3MywxMy43ODEtMC45NzMgICAgYzkuMzA3LDAsMTUuOTkxLDAuODI4LDE3LjQxOSwxLjMyMWMxMC4xNzMsNC40OTEsMTkuMTA3LDEwLjM4MiwyNy43NDgsMTYuMDY4YzEzLjI0Nyw4LjczMSwyNS43NTUsMTYuOTcsMzkuMzI2LDE2Ljk3ICAgIGM1LjgyNCwwLDExLjQ2OS0xLjUzNywxNi43OTUtNC41NjNjMjkuMzgyLTE2LjY5MywzNC45NzktNjIuNDkyLDEyLjQ4NC0xMDIuMDg4QzMwMi45NDIsMjU1LjMwMywzMDEuNTk3LDI1My40NDgsMzAwLjI0NiwyNTEuNjI4ICAgIHoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMjUyLjc5NiwxNzcuODU5YzMxLjE0NywwLDU2LjQ5OS0zNC4wMTQsNTYuNDk5LTc1LjgzNGMwLTQxLjgxNy0yNS4zNTItNzUuODQxLTU2LjQ5OS03NS44NDEgICAgYy0zMS4xNjUsMC01Ni41MTEsMzQuMDIzLTU2LjUxMSw3NS44NDFDMTk2LjI4NSwxNDMuODQ1LDIyMS42MzEsMTc3Ljg1OSwyNTIuNzk2LDE3Ny44NTl6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTM0NS41OTUsMTM4LjkxOGMtMjQuOTc1LDAtNDQuNTIxLDI1LjkwMS00NC41MjEsNTguOTY3YzAsMzMuMDUxLDE5LjU1OCw1OC45NTUsNDQuNTIxLDU4Ljk1NSAgICBjMjQuOTYxLDAsNDQuNTMxLTI1LjkwNCw0NC41MzEtNTguOTU1QzM5MC4xMjYsMTY0LjgyLDM3MC41NjgsMTM4LjkxOCwzNDUuNTk1LDEzOC45MTh6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTg5LjA0OCwxOTcuODg1YzAtMzMuMDY1LTE5LjU1OC01OC45NjctNDQuNTIyLTU4Ljk2N0MxOS41NjEsMTM4LjkxOCwwLDE2NC44MiwwLDE5Ny44ODUgICAgYzAsMzMuMDUxLDE5LjU2MSw1OC45NTUsNDQuNTI2LDU4Ljk1NUM2OS40OTEsMjU2Ljg0LDg5LjA0OCwyMzAuOTM2LDg5LjA0OCwxOTcuODg1eiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo='
                    },
                    tipoAnimal: 'Cão',
                    size: 'Pequeno',
                    sex: 'macho',
                    usaDogLove: true
                };
                setFacePanel(1);
            }

            function edit() {
                var selected = self.gridOptions.api.getSelectedRows();
                self.pet = selected[0];
                if (self.pet) {
                    setFacePanel(1);
                } else {
                    add();
                }
            }


            self.formatDate = function (date) {
                return new Date(date).toLocaleDateString("pt-BR");
            }


            function openPopup(tipo) {
                self.isBreedInvalido = false;
                self.isProInvalido = false;

                var title = tipo != 'user' ? ' UMA RAÇA' : ' UM PROPRIETÁRIO';
                var url = tipo != 'user' ? '/breed' : '/user';

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'src/components/popup/popup.html',
                    controller: 'ModalInstanceCtrl',
                    controllerAs: 'ctrl',
                    size: 'lg',
                    backdrop: false,
                    resolve: {
                        data: function () {
                            return {
                                columnDefs: getColumnDefs(tipo),
                                url: ServicePathConstants.PRIVATE_PATH + url,
                                title: title
                            }
                        }
                    }
                }).result.then(
                    function (data) {
                        self.pet[tipo] = data;
                    });
            }

            function getColumnDefs(tipo) {
                if (tipo == 'user') {
                    return [
                        { headerName: "Código", field: "id", width: 100, cellStyle: { 'text-align': 'right' }},
                        { headerName: "Name", field: "name", width: 250 },
                        { headerName: "Email", field: "email", suppressFilter: true, width: 200 },
                        {
                            headerName: "Telefone", field: "phone", suppressFilter: true, width: 130, cellRenderer: function (params) {
                                return params.data.phone
                                    .replace(/(\d{2})(\d)/, "($1) $2")
                                    .replace(/(\d{3})(\d{1,4})$/, "$1-$2");
                            }
                        },
                        { headerName: "Rua", suppressFilter: true, field: "address.name", width: 180 },
                        { headerName: "Número", suppressFilter: true, field: "number", width: 100 },
                    ];

                } else if (tipo == 'breed') {

                    return [
                        { headerName: "Código", field: "id", width: 100, cellStyle: { 'text-align': 'right' }},
                        { headerName: "Nome", field: "name", width: 300 },
                        { headerName: "Vida", suppressFilter: true, field: "life", width: 150 },
                        { headerName: "Peso", suppressFilter: true, field: "weight", width: 160 },
                        { headerName: "Altura", suppressFilter: true, field: "height", width: 160 }
                    ];

                } else if (tipo == 'pet') {
                    return [
                        { headerName: "Código", field: "id", width: 100, cellStyle: { 'text-align': 'right' }},
                        { headerName: "Nome propriétario", field: "user.name", width: 265 },
                        { headerName: "Nome pet", field: "name" },
                        {
                            headerName: "Data Nascimento", field: "dateBirth", valueGetter: function chainValueGetter(params) {
                                return AngularUtils.formatDate(params.data.dateBirth);
                            }
                        },
                        { headerName: "Sexo", field: "sex" },
                        {
                            headerName: "Usa DogLove", width: 150, suppressFilter: true, field: "usaDogLove",
                            cellRenderer: function (params) {
                                var icon = params.data.usaDogLove ? 'fa-toggle-on' : 'fa-toggle-off';
                                return '<i class="fa ' + icon + '" aria-hidden="true" style="font-size: 26px;" ></i>';
                            }

                        },
                        { headerName: "Porte", field: "breed.porte" },
                        {
                            headerName: "Especie", field: "tipoAnimal", width: 129, suppressFilter: true,
                            cellRenderer: function (params) {
                                var icon = params.data.breed.tipoAnimal == 'Cão' ? 'dog.svg' : 'cat.svg';
                                return '<img src="img/' + icon + '" style="width: 24px;"></i>';
                            }
                        },
                        { headerName: "Raça", field: "breed.name" }
                    ];
                }
            }

            function eventKeyPro($event) {
                if ($event.keyCode == 9) {
                    self.openPopup('user', self.pet.user ? self.pet.user.name : undefined);
                }
            }

            function eventKeyBreed($event) {
                if ($event.keyCode == 9) {
                    self.openPopup('breed', (self.pet.breed ? self.pet.breed.name : undefined), self.pet.tipoAnimal);
                }
            }

            //Redimensionamento
            self.resizeImage = function (file, base64) {
                var deferred = $q.defer();
                // Criamos uma imagem para receber o URI de dados
                var img = document.createElement('img');

                // Quando o evento "onload" é acionado, podemos redimensionar a imagem.
                img.onload = function () {
                    // Criamos uma tela e obtemos seu contexto.
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');

                    // Nós definimos as dimensões no tamanho desejado.
                    var MAX_WIDTH = 350;
                    var MAX_HEIGHT = 350;

                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    // Nós redimensionamos a imagem com o método canvasImage ();
                    ctx.drawImage(this, 0, 0, width, height);

                    var dataURI = canvas.toDataURL(1.0);
                    base64.base64 = dataURI.replace('data:image/png;base64,', '');
                    deferred.resolve(base64);

                    $scope.$apply();
                };
                img.src = 'data:' + base64.filetype + ';base64,' + base64.base64;
                return deferred.promise;
            };

            function agendar() {
                var selected = self.gridOptions.api.getSelectedRows();
                self.pet = selected[0];

                if (angular.isUndefined(self.pet)) {
                    MessageUtils.alert('Selecione um animal para efetuar o agendamento');
                    return;
                }

                $location.path('/agenda/' + base64.encode(self.pet.id.toString()));
            }

            self.enviar = function (condicao) {

                try {
                    if (!condicao) {
                        throw _msg;
                    }

                    if (AngularUtils.getProperty(self.pet, 'user.id') == undefined) {
                        self.isProInvalido = true;
                        throw _msg;
                    }

                    if (AngularUtils.getProperty(self.pet, 'breed.id') == undefined) {
                        self.isBreedInvalido = true;
                        throw _msg;
                    }

                    if (self.pet.id) {
                        ServiceProxy.edit(_petUrl, self.pet, function (response) {
                            self.gridOptions.api.refreshCells();
                            setFacePanel(0);
                        });
                    } else {
                        ServiceProxy.add(_petUrl, self.pet, function (response) {
                            self.gridOptions.api.updateRowData({ add: [response.data] });
                            setFacePanel(0);
                        });
                    }

                } catch (error) {
                    MessageUtils.error(error);
                }
            }

            function remover() {
                var selectedData = self.gridOptions.api.getSelectedRows();
                var pet = selectedData[0];
                if (pet) {
                    MessageUtils.confirmeDialog('Deseja realmente apagar este registo')
                        .then(function () {
                            ServiceProxy.remove(_petUrl, pet, function () {
                                self.gridOptions.api.updateRowData({ remove: selectedData });
                                var rowData = self.gridOptions.api.getRowNode(0);
                                if (rowData) {
                                    rowData.setSelected(true);
                                }
                            });
                        });
                }
            };

            $scope.dateOptions = {
                dateDisabled: false,
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(1989, 5, 22),
                startingDay: 1
            };

            $scope.open = function () {
                $scope.popup.opened = true;
            };

            $scope.popup = {
                opened: false
            };

            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.popup1 = {
                opened: false
            };
        }]);

