'use strict';

angular.module('dog-system')
    .controller('DogloveCtrl', ['$uibModal', 'ServicePathConstants', 'ServiceProxy', '$q', '$scope', 'MessageUtils', '$rootScope', '$location', 'AngularUtils',
        function ($uibModal, ServicePathConstants, ServiceProxy, $q, $scope, MessageUtils, $rootScope, $location, AngularUtils) {
            var self = this;

            var _petUrl = ServicePathConstants.PRIVATE_PATH + '/pet';

            self.buscarAnimais = buscarAnimais;

            self.pageChanged = pageChanged;
            self.eventKey = eventKey;
            self.maxSize = 5;
            self.numPerPage = 6;

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

            function pageChanged() {
                buscarAnimais(self.currentPage);
            }

            self.formatDate = function (date) {
                return new Date(date).toLocaleDateString("pt-BR");
            }

            function eventKey($event) {
                if ($event.keyCode == 9) {
                    self.openPopup('breed', self.pet.breed ? self.pet.breed.name : undefined);
                }
            }

            self.openPopup = function (name, criteria, param) {

                var header = 'Raças';
                var title = ' a Raça do animal';
                var url = '/breed/';

                if (name == 'user') {
                    header = 'Proprietários';
                    title = ' o proprietário';
                    url = '/user';
                }

                if (criteria) {
                    url = url.concat('/criteria/').concat(criteria);
                }

                if (param) {
                    url = url.concat('/param/').concat(param);
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
                                param: param,
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
                self.pet.image.id = undefined;;
            }


            function buscarAnimais(pageNo) {

                try {
                    self.pets = [];

                    if (AngularUtils.isEmptyOrNull(self.pet.sex)) {
                        throw 'Um sexo deve ser escolhido, Favor verifique';
                    }

                    if (AngularUtils.isEmptyOrNull(self.pet.breed.id)) {
                        throw 'Uma raça deve ser escolhida, Favor verifique';
                    }

                    var page = pageNo - 1;

                    ServiceProxy.find(_petUrl + '/sex/' + self.pet.sex + '/breed/' + self.pet.breed.id + '/pagina/' + page + '/qtd/' + self.numPerPage, function (data) {
                        self.pets = data.content;
                        self.totalItems = data.totalElements;
                    });
                    self.currentPage = pageNo;

                } catch (error) {
                    MessageUtils.error(error);
                }

            }
        }]);

