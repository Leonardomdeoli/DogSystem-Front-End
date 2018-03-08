'use strict';

angular.module('dog-system')
    .controller('HomeCtrl', ['ServiceApplication', '$location', 'ServicePathConstants', 'ServiceProxy', 'AngularUtils', 'DateUtisConstants',
        function (ServiceApplication, $location, ServicePathConstants, ServiceProxy, AngularUtils, DateUtisConstants) {
            var self = this;

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
                    self.titulo = 'Lista de agendamento do dia ' + AngularUtils.formatDate(AngularUtils.getToday());
                    getAgenda(1);
                }
            }

            function pageChanged() {
                getAgenda(self.currentPage);
            }

            function getAgenda(pageNo) {
                var page = pageNo - 1;

                var _url = ServicePathConstants.PRIVATE_PATH.concat('/agenda') + '/pagina/' + page + '/qtd/' + self.numPerPage;

                _url = _url.concat('/datainicial/').concat(new Date()).concat('/datafinal/').concat(new Date());

                ServiceProxy.find(_url, function (data) {
                    self.agendas = data.content;
                    self.totalItems = data.totalElements;
                });

                self.currentPage = pageNo;
            }
        }]);
