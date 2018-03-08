angular.module('dog-system')
  .controller('ServicoCtrl', ['MessageUtils', 'ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location',
    function (MessageUtils, ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location) {
      var self = this;

      var _serviceUrl = ServicePathConstants.PRIVATE_PATH + '/services';

      self.service = {};
      self.services = [];
      self.showAddEditService = false;
      self.showList = true;
      self.sizes = {
        options: ['Pequeno', 'Medio', 'Grande', 'Gigante']
      };

      self.listService = listService;
      self.newService = newService;
      self.buscarService = buscarService;
      self.formatNumber = formatNumber;
      self.pageChanged = pageChanged;

      self.maxSize = 5;
      self.numPerPage = 6;

      init();
      function init() {
        if (!$rootScope.authDetails.authenticated) {
          $location.path("/login");
        } else {
          listService(1);
        }
      }

      function formatNumber(number) {
        return parseFloat(number).toFixed(2);
      }

      self.sort = function (keyname) {
        self.sortKey = keyname;   //set the sortKey to the param passed
        self.reverse = !self.reverse; //if true make it false and vice versa
      }


      function pageChanged() {
        listService(self.currentPage);
      }

      function listService(pageNo) {
        var page = pageNo - 1;

        ServiceProxy.find(_serviceUrl + '/pagina/' + page + '/qtd/' + self.numPerPage, function (data) {
          self.services = data.content;
          self.totalItems = data.totalElements;
          modifyTela(false);
        });
        self.currentPage = pageNo;
      }

      function newService() {
        self.service = {};
        modifyTela(true);
      }

      function modifyTela(condicao) {
        self.showAddEditService = condicao;
        self.showList = !condicao;
      };

      function buscarService() {
        self.nameService
        ServiceProxy.find(_serviceUrl + "/" + self.nameService, function (data) {
          self.services = data;
          modifyTela(false);
        });
      }

      self.enviar = function (condicao) {
        if (condicao) {
          if (angular.isUndefined(self.service.id)) {
            ServiceProxy.add(_serviceUrl, self.service);

          } else {
            ServiceProxy.edit(_serviceUrl, self.service);
          }
        }
      }

      self.editservice = function (service) {
        self.service = angular.copy(service);
        modifyTela(true);
      }

      self.deleteservice = function (service) {
        MessageUtils.confirmeDialog('Deseja realmente apagar este registo')
          .then(function () {
            ServiceProxy.remove(_serviceUrl, service);
          });
      };

    }]);


