'use strict';

angular.module('dog-system')
    .controller('amigopetCtrl', ['$uibModal', 'ServicePathConstants', 'ServiceProxy', '$q', '$scope', 'MessageUtils', '$rootScope', '$location',
        function ($uibModal, ServicePathConstants, ServiceProxy, $q, $scope, MessageUtils, $rootScope, $location) {
            var self = this;


            var _petUrl = ServicePathConstants.PRIVATE_PATH + '/pet';

            self.id = $rootScope.authDetails.user.id;

            self.sizes = {
                options: ['Pequeno', 'Medio', 'Grande', 'Gigante']
            };

            self.tipoAnimais = {
                options: ['Cão', 'Gato']
            };

            self.sexs = ["macho", "femea"];
            self.pets = [];

            self.pet = {
                user: {
                    name: undefined
                },
                breed: {
                    name: undefined
                },
                tipoAnimal: 'Cão'
            };



            self.pageChanged = pageChanged;
            self.getPet = getPet;
            self.visualizar = visualizar;

            self.maxSize = 5;
            self.numPerPage = 6;


            init();
            function init() {
                if (!$rootScope.authDetails.authenticated) {
                    $location.path("/login");
                } else {
                    getPet(1);
                }
            }

            function pageChanged() {
                getPet(self.currentPage);
            }

            function getPet(pageNo) {
                var page = pageNo - 1;
                self.pets = [];
                ServiceProxy.find(_petUrl + '/amigoPet/' + true + '/pagina/' + page + '/qtd/' + self.numPerPage, function (data) {
                    data.content.forEach(function (el) {
                        el.usadogLove = el.usadogLove == 'True';
                        self.pets.push(el);
                    }, this);
                    self.totalItems = data.totalElements;
                });
                self.currentPage = pageNo;
            }

            self.show = function () {
                self.showAddEdit = true;
            }

            self.hide = function () {
                self.showAddEdit = false;
            }

            self.sort = function (keyname) {
                self.sortKey = keyname;   //set the sortKey to the param passed
                self.reverse = !self.reverse; //if true make it false and vice versa
            }

            self.add = function () {
                self.pet = {
                    image: {
                        filetype: 'image/svg+xml;utf8',
                        base64: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4IiB2aWV3Qm94PSIwIDAgMzkwLjEyNiAzOTAuMTI1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzOTAuMTI2IDM5MC4xMjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTMyLjY0LDE3Ny44NTljMzEuMTYyLDAsNTYuNTA4LTM0LjAxNCw1Ni41MDgtNzUuODM0YzAtNDEuODE3LTI1LjM0Ny03NS44NDEtNTYuNTA4LTc1Ljg0MSAgICBjLTMxLjE1MywwLTU2LjUwMiwzNC4wMjMtNTYuNTAyLDc1Ljg0MUM3Ni4xMzgsMTQzLjg0NSwxMDEuNDg3LDE3Ny44NTksMTMyLjY0LDE3Ny44NTl6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTMwMC4yNDYsMjUxLjYyOGMtMS4xNTktMS41NzktMi4yNy0zLjA2OC0yLjg2NC00LjM0OGMtMTIuNjM1LTI3LjA0Ni00Ny4yNy01OC45MzEtMTAzLjM4Mi01OS43MjRsLTIuMTU5LTAuMDEyICAgIGMtNTUuMjUsMC04OS42MjcsMzAuMTk3LTEwMy4zODEsNTguNDY5Yy0wLjQ3NSwwLjk2Ny0xLjUyLDIuMjIyLTIuNjI3LDMuNTQ5Yy0xLjMxLDEuNTU1LTIuNjA2LDMuMTQ2LTMuNzE0LDQuODc1ICAgIGMtMTEuNjE5LDE4LjA3NS0xNy41NDMsMzguNDI2LTE2LjY2OSw1Ny4yOTljMC45MTYsMjAuMDM3LDkuMzA1LDM2LjEzMSwyMy41ODEsNDUuMzEyYzUuNzY4LDMuNzA1LDExLjk5Miw1LjU3MiwxOC41MjIsNS41NzIgICAgYzEzLjQ2NSwwLDI1Ljc5My03LjU4NCw0MC4wNzktMTYuMzY4YzkuMDgzLTUuNTk4LDE4LjQ2NS0xMS4zNzQsMjguODg2LTE1LjY5N2MxLjE2OC0wLjM4NSw1Ljk1NC0wLjk3MywxMy43ODEtMC45NzMgICAgYzkuMzA3LDAsMTUuOTkxLDAuODI4LDE3LjQxOSwxLjMyMWMxMC4xNzMsNC40OTEsMTkuMTA3LDEwLjM4MiwyNy43NDgsMTYuMDY4YzEzLjI0Nyw4LjczMSwyNS43NTUsMTYuOTcsMzkuMzI2LDE2Ljk3ICAgIGM1LjgyNCwwLDExLjQ2OS0xLjUzNywxNi43OTUtNC41NjNjMjkuMzgyLTE2LjY5MywzNC45NzktNjIuNDkyLDEyLjQ4NC0xMDIuMDg4QzMwMi45NDIsMjU1LjMwMywzMDEuNTk3LDI1My40NDgsMzAwLjI0NiwyNTEuNjI4ICAgIHoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMjUyLjc5NiwxNzcuODU5YzMxLjE0NywwLDU2LjQ5OS0zNC4wMTQsNTYuNDk5LTc1LjgzNGMwLTQxLjgxNy0yNS4zNTItNzUuODQxLTU2LjQ5OS03NS44NDEgICAgYy0zMS4xNjUsMC01Ni41MTEsMzQuMDIzLTU2LjUxMSw3NS44NDFDMTk2LjI4NSwxNDMuODQ1LDIyMS42MzEsMTc3Ljg1OSwyNTIuNzk2LDE3Ny44NTl6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTM0NS41OTUsMTM4LjkxOGMtMjQuOTc1LDAtNDQuNTIxLDI1LjkwMS00NC41MjEsNTguOTY3YzAsMzMuMDUxLDE5LjU1OCw1OC45NTUsNDQuNTIxLDU4Ljk1NSAgICBjMjQuOTYxLDAsNDQuNTMxLTI1LjkwNCw0NC41MzEtNTguOTU1QzM5MC4xMjYsMTY0LjgyLDM3MC41NjgsMTM4LjkxOCwzNDUuNTk1LDEzOC45MTh6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTg5LjA0OCwxOTcuODg1YzAtMzMuMDY1LTE5LjU1OC01OC45NjctNDQuNTIyLTU4Ljk2N0MxOS41NjEsMTM4LjkxOCwwLDE2NC44MiwwLDE5Ny44ODUgICAgYzAsMzMuMDUxLDE5LjU2MSw1OC45NTUsNDQuNTI2LDU4Ljk1NUM2OS40OTEsMjU2Ljg0LDg5LjA0OCwyMzAuOTM2LDg5LjA0OCwxOTcuODg1eiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo='
                    },
                    tipoAnimal: 'Cão',
                    size: 'Pequeno',
                    sex: 'macho',
                    usadogLove: false
                };
                self.show();
            }

            self.edit = function (pet) {
                self.pet = pet;
                self.pet.dateBirth = new Date(pet.dateBirth);
                if (self.pet.fertilePeriod) {
                    self.pet.fertilePeriod = new Date(pet.fertilePeriod);
                }
                self.show();
            }


            self.formatDate = function (date) {
                return new Date(date).toLocaleDateString("pt-BR");
            }

            self.modifyTipoAnimal = function () {
                self.pet.breed = undefined;
            }

            self.openPopup = function (name, criteria) {

                var header = 'Raças';
                var title = ' a Raça do animal';
                var url = '/breed/';

                if (name == 'user') {
                    header = 'Proprietários';
                    title = ' o proprietário';
                    url = '/user';
                }

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'src/components/popup/popup.html',
                    controller: 'ModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: '',
                    resolve: {
                        data: function () {
                            return {
                                criteria: criteria,
                                name: name,
                                header: header,
                                title: title,
                                url: url
                            }
                        }
                    }
                });

                modalInstance.result.then(
                    function (data) {
                        self.pet[name] = data;
                    }, function (data) {
                        self.pet[name] = undefined;
                    });
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
                self.pet.image.id = undefined;
            }

            self.enviar = function (condicao) {
                if (condicao) {
                    self.pet.usadogLove = 'False';
                    self.pet.amigoPet = 'True';
                    self.pet.user = $rootScope.authDetails.user;

                    if (self.pet.id) {
                        ServiceProxy.edit(_petUrl, self.pet, function (response) {
                            for (var pet in self.pets) {
                                if (self.pets[pet].id == self.pet.id) {
                                    self.pet.usadogLove = self.pet.usadogLove == 'True';
                                    self.pets[pet] = self.pet;
                                    break;
                                }
                            }
                            self.hide();
                        });
                    } else {
                        ServiceProxy.add(_petUrl, self.pet, function (response) {
                            self.pets.push(self.pet);
                            self.hide();
                        });
                    }
                }
            }

            function visualizar(pet) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'imageComponent',
                    resolve: {
                        data: function () {
                            return {
                                pet
                            }
                        }
                    }
                });
            }

            self.delete = function (pet) {
                MessageUtils.confirmeDialog('Deseja realmente remover este registro')
                    .then(function () {
                        ServiceProxy.delete(_petUrl, pet, init)
                    });
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

