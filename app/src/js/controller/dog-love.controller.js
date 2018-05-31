'use strict';

angular.module('dog-system')
    .controller('DogloveCtrl', ['$timeout', '$uibModal', 'ServicePathConstants', 'ServiceProxy', '$q', '$scope', 'MessageUtils', '$rootScope', '$location', 'AngularUtils',
        function ($timeout, $uibModal, ServicePathConstants, ServiceProxy, $q, $scope, MessageUtils, $rootScope, $location, AngularUtils) {
            var self = this;

            var _petUrl = ServicePathConstants.PRIVATE_PATH + '/pet';

            self.buscarAnimais = buscarAnimais;
            self.openPopup = openPopup;
            self.gridOptions = {
                columnDefs: getColumnDefs('pet'),
                enableFilter: false,
                floatingFilter: false,
                enableSorting: false,
            };

            self.showFilter = true;
            self.eventKey = eventKey;
            self.pets = [];
            self.sexs = ["macho", "femea"];
            self.pet = {
                user: {
                    name: undefined
                },
                breed: {
                    name: undefined
                }
            };

            init();
            function init() {
                if (!$rootScope.authDetails.authenticated) {
                    $location.path("/login");
                }
            }

            self.formatDate = function (date) {
                return new Date(date).toLocaleDateString("pt-BR");
            }

            function eventKey($event) {
                if ($event.keyCode == 9) {
                    self.openPopup('breed', self.pet.breed ? self.pet.breed.name : undefined);
                }
            }

            $timeout(function () {
                self.gridOptions.api.setRowData(undefined);
            }, 500);

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
                        { headerName: "#", field: "id", width: 90, valueGetter: 'node.id', hide: true },
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
                        { headerName: "#", field: "id", valueGetter: 'node.id', hide: true },
                        { headerName: "Nome", field: "name", width: 300 },
                        { headerName: "Vida", suppressFilter: true, field: "life", width: 150 },
                        { headerName: "Peso", suppressFilter: true, field: "weight", width: 160 },
                        { headerName: "Altura", suppressFilter: true, field: "height", width: 160 }
                    ];

                } else if (tipo == 'pet') {
                    return [
                        { headerName: "#", field: "id", width: 90, hide: true },
                        { headerName: "Nome propriétario", field: "user.name", width: 265 },
                        { headerName: "Nome pet", field: "name" },
                        { headerName: "Data Nascimento", field: "dateBirth", valueGetter: function chainValueGetter(params) { return AngularUtils.formatDate(params.data.dateBirth); } },
                        { headerName: "Porte", field: "breed.porte" },
                        {
                            headerName: "Visualizar", field: "ver", pinned: "right", width: 100, suppressFilter: true, suppressSorting: true, cellRenderer: function (params) {
                                var eDiv = document.createElement('div');
                                eDiv.innerHTML = '<button type="button" style="width: 100%;" class="btn btn-primary btn-xs">Ver</button>';

                                var eButton = eDiv.querySelectorAll('.btn-primary')[0];

                                self.data = params.data;
                                eButton.addEventListener('click', function () {
                                    console.log(self.data);
                                });

                                return eDiv;
                            }
                        }
                    ];
                }
            }

            //Redimensionamento
            self.resizeImage = function (file, base64) {
                var deferred = $q.defer();
                // We create an image to receive the Data URI
                var img = document.createElement('img');

                // When the event "onload" is triggered we can resize the image.
                img.onload = function () {
                    // We create a canvas and get its context.
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');

                    // We set the dimensions at the wanted size.
                    canvas.width = 100;
                    canvas.height = 100;

                    // We resize the image with the canvas method drawImage();
                    ctx.drawImage(this, 0, 0, 100, 100);

                    var dataURI = canvas.toDataURL(1.0);
                    base64.base64 = dataURI.replace('data:image/png;base64,', '');
                    deferred.resolve(base64);

                    $scope.$apply();

                    /////////////////////////////////////////
                    // Use and treat your Data URI here !! //
                    /////////////////////////////////////////
                };
                img.src = 'data:' + base64.filetype + ';base64,' + base64.base64;
                return deferred.promise;
            };

            self.touched = function () {
                self.pet.image.id = undefined;;
            }

            function buscarAnimais() {
                try {
                    if (self.pet.sex == undefined) {
                        throw 'Um sexo deve ser escolhido, Favor verifique';
                    }

                    if (self.pet.breed.name == undefined) {
                        throw 'Uma raça deve ser escolhida, Favor verifique';
                    }

                    ServiceProxy.find(_petUrl + '/getPetSexoRaca?sex=' + self.pet.sex + '&breed=' + self.pet.breed.id, function (data) {
                        self.showFilter = false;
                        if (data.length > 0) {
                            self.gridOptions.api.setRowData(data);
                            var rowData = self.gridOptions.api.getRowNode(0);
                            rowData.setSelected(true);
                        } else {
                            self.gridOptions.api.setRowData(undefined);
                        }
                    });
                } catch (error) {
                    MessageUtils.error(error);
                }

            }
        }]);

