'use strict';

angular.module('dog-system')
    .controller('HomeCtrl', ['ServiceApplication', '$location', 'ServicePathConstants', 'ServiceProxy', 'AngularUtils', 'DateUtisConstants',
        function (ServiceApplication, $location, ServicePathConstants, ServiceProxy, AngularUtils, DateUtisConstants) {
            var self = this;

            var  today = AngularUtils.getToday();

            self.pageChanged = pageChanged;
            self.getAgenda = getAgenda;
            self.maxSize = 5;
            self.numPerPage = 6;


            init();
            function init() {
                if (!ServiceApplication.isAuthenticated()) {
                    $location.path("/login");
                    return;
                }

                if (ServiceApplication.hasAnyPermission(['ROLE_ADMIN'])) {
                    self.isAdmin = true;
                    self.name = ServiceApplication.getNameUsuLogado();
                    self.titulo = 'Lista de agendamento do dia ' + AngularUtils.formatDate(today);
                    getAgenda(1);
                }
            }

            function pageChanged() {
                getAgenda(self.currentPage);
            }

            function getAgenda(pageNo) {
                var page = pageNo - 1;

                var _url = ServicePathConstants.PRIVATE_PATH + '/agenda';

                _url = _url + '/datainicial/' + today + '/datafinal/' + today;

                ServiceProxy.find(_url, function (data) {
                    self.agendas = data.content;
                    self.totalItems = data.totalElements;
                });

                self.currentPage = pageNo;
            }
        }]);
