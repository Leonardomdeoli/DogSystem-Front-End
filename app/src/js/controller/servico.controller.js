angular.module('dog-system')
  .controller('ServicoCtrl', ['MessageUtils', 'ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location', 'AngularUtils',
    function (MessageUtils, ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location, AngularUtils) {
      var self = this;

      var _serviceUrl = ServicePathConstants.PRIVATE_PATH + '/services';

      self.service = {};
      self.services = [];
      self.facePanel = 0;
      self.sizes = {
        options: ['Pequeno', 'Medio', 'Grande', 'Gigante']
      };

      self.gridOptions = {
        columnDefs: [
          { headerName: "Código", field: "id", width: 150, cellClass: 'number-cell' },
          { headerName: "Name", field: "name", width: 300 },
          { headerName: "Preço", field: "price", width: 200, cellClass: 'number-cell', valueFormatter: currencyFormatter },
          { headerName: "Porte", field: "size", width: 200 }
        ]
      };

      self.edit = edit;
      self.add = add;
      self.remover = remover;
      self.recarregar = recarregar;
      self.setFacePanel = setFacePanel;

      init();
      function init() {
        getServices();
      }


      function currencyFormatter(params) {
        return 'R$ ' + AngularUtils.formatNumber(params.value);
      }


      function getServices() {
        ServiceProxy.find(_serviceUrl, function (data) {
          self.gridOptions.api.setRowData(data);
          var rowData = self.gridOptions.api.getRowNode(0);
          if (rowData) {
            rowData.setSelected(true);
          }
        });
      }

      function add() {
        self.service = {};
        setFacePanel(1);
      }

      function setFacePanel(index) {
        self.facePanel = index;
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

      function edit(user) {
        var selected = self.gridOptions.api.getSelectedRows();
        self.service = selected[0];
        self.facePanel = 1;
      }

      function remover(service) {
        MessageUtils.confirmeDialog('Deseja realmente apagar este registo')
          .then(function () {
            ServiceProxy.remove(_serviceUrl, service);
          });
      };

      function recarregar() {
        getServices();
      }

    }]);


