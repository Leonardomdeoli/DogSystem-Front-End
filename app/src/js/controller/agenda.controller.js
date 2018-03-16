angular.module('dog-system')
  .controller('AgendaCtrl', ['base64','$scope', 'ServiceProxy', 'ServicePathConstants', 'MessageUtils', '$uibModal', '$rootScope', '$location', 'AngularUtils', '$routeParams',
    function (base64, $scope, ServiceProxy, ServicePathConstants, MessageUtils, $uibModal, $rootScope, $location, AngularUtils, $routeParams) {
      var self = this;
      var _msg = 'Verifique o formulário pois pode conter erros';

      self.agenda = {};
      self.agendas = [];
      self.showAddEditagenda = false;
      self.showList = true;

      self.buscar = buscar;
      self.newagenda = newagenda;
      self.buscaragenda = buscaragenda;
      self.limpar = limpar;
      self.buscarHoras = buscarHoras;
      self.podeCancelar = podeCancelar;
      self.formatNumber = formatNumber;
      self.formateDate = formateDate;
      self.pageChanged = pageChanged;
      self.eventKeyPet = eventKeyPet;
      self.eventKeyService = eventKeyService;

      self.maxSize = 5;
      self.numPerPage = 6;

      var _agendaUrl = ServicePathConstants.PRIVATE_PATH.concat('/agenda');
      var _petUrl = ServicePathConstants.PRIVATE_PATH + '/pet';

      self.horas = {
        options: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
      };


      init();
      function init() {
        if (!$rootScope.authDetails.authenticated) {
          $location.path('/login');
        } else {
          if ($routeParams.id) {
            findyPet(base64.decode($routeParams.id));
          } else {
            buscar(true, 1);
          }
        }
      }

      function findyPet(id) {
        ServiceProxy.find(_petUrl + /id/ + id, function (data) {
          self.agenda.pet = data;
          modifyTela(true);
        });
      }

      function pageChanged() {
        buscar(false, self.currentPage);
      }

      function formateDate(date) {
        return AngularUtils.formatDatePtBr(date);
      }

      function limpar() {
        self.agenda.schedulingDate = undefined;
        self.agenda.time = undefined;
      }


      function eventKeyPet($event) {
        if ($event.keyCode == 9) {
          self.openPopup('pet', self.agenda.pet ? self.agenda.pet.name : undefined);
        }
      }

      function eventKeyService($event) {
        if ($event.keyCode == 9) {
          self.openPopup('service', (self.agenda.service ? self.agenda.service.name : undefined), self.agenda.pet.size);
        }
      }

      function buscar(isInit, pageNo) {

        try {

          if (self.final != null && self.inicial == null) {
            throw 'Data inicial não pode ser vazia, favor verifique.';
          }
          if (self.final && self.final < self.inicial) {
            throw 'Data inicial não pode ser menor que a final, favor verifique.';
          }

          if (AngularUtils.emptyAsUndefined(self.inicial) == undefined) {
            self.inicial = getToday();
          }

          var page = pageNo - 1;

          var _url = ServicePathConstants.PRIVATE_PATH + '/agenda';

          _url = _url.concat('/datainicial/').concat(self.inicial);

          if (isInit || self.final) {
            self.final = AngularUtils.emptyAsUndefined(self.final) == undefined ? getToday() : self.final;
            _url = _url.concat('/datafinal/').concat(self.final);
          }

          ServiceProxy.find(_url, function (data) {
            self.agendas = data.content;
            self.totalItems = data.totalElements;
            modifyTela(false);
          });
          self.currentPage = pageNo;

        } catch (error) {
          MessageUtils.error(error);
        }
      }

      function getToday() {
        return AngularUtils.getToday();
      }

      function formatNumber(number) {
        return parseFloat(number).toFixed(2);
      }

      function buscarHoras() {

        if (self.agenda.schedulingDate) {
          ServiceProxy.find(_agendaUrl + '/data/' + self.agenda.schedulingDate, function (data) {
            self.horas = {
              options: data
            };
          });
        } else {
          self.horas = {
            options: undefined
          };
        }
      }

      function newagenda() {
        self.agenda = {};

        self.agenda = {
          pet: {
            image: {
              filetype: 'image/svg+xml;utf8',
              base64: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyOHB4IiBoZWlnaHQ9IjEyOHB4IiB2aWV3Qm94PSIwIDAgMzkwLjEyNiAzOTAuMTI1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzOTAuMTI2IDM5MC4xMjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTMyLjY0LDE3Ny44NTljMzEuMTYyLDAsNTYuNTA4LTM0LjAxNCw1Ni41MDgtNzUuODM0YzAtNDEuODE3LTI1LjM0Ny03NS44NDEtNTYuNTA4LTc1Ljg0MSAgICBjLTMxLjE1MywwLTU2LjUwMiwzNC4wMjMtNTYuNTAyLDc1Ljg0MUM3Ni4xMzgsMTQzLjg0NSwxMDEuNDg3LDE3Ny44NTksMTMyLjY0LDE3Ny44NTl6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTMwMC4yNDYsMjUxLjYyOGMtMS4xNTktMS41NzktMi4yNy0zLjA2OC0yLjg2NC00LjM0OGMtMTIuNjM1LTI3LjA0Ni00Ny4yNy01OC45MzEtMTAzLjM4Mi01OS43MjRsLTIuMTU5LTAuMDEyICAgIGMtNTUuMjUsMC04OS42MjcsMzAuMTk3LTEwMy4zODEsNTguNDY5Yy0wLjQ3NSwwLjk2Ny0xLjUyLDIuMjIyLTIuNjI3LDMuNTQ5Yy0xLjMxLDEuNTU1LTIuNjA2LDMuMTQ2LTMuNzE0LDQuODc1ICAgIGMtMTEuNjE5LDE4LjA3NS0xNy41NDMsMzguNDI2LTE2LjY2OSw1Ny4yOTljMC45MTYsMjAuMDM3LDkuMzA1LDM2LjEzMSwyMy41ODEsNDUuMzEyYzUuNzY4LDMuNzA1LDExLjk5Miw1LjU3MiwxOC41MjIsNS41NzIgICAgYzEzLjQ2NSwwLDI1Ljc5My03LjU4NCw0MC4wNzktMTYuMzY4YzkuMDgzLTUuNTk4LDE4LjQ2NS0xMS4zNzQsMjguODg2LTE1LjY5N2MxLjE2OC0wLjM4NSw1Ljk1NC0wLjk3MywxMy43ODEtMC45NzMgICAgYzkuMzA3LDAsMTUuOTkxLDAuODI4LDE3LjQxOSwxLjMyMWMxMC4xNzMsNC40OTEsMTkuMTA3LDEwLjM4MiwyNy43NDgsMTYuMDY4YzEzLjI0Nyw4LjczMSwyNS43NTUsMTYuOTcsMzkuMzI2LDE2Ljk3ICAgIGM1LjgyNCwwLDExLjQ2OS0xLjUzNywxNi43OTUtNC41NjNjMjkuMzgyLTE2LjY5MywzNC45NzktNjIuNDkyLDEyLjQ4NC0xMDIuMDg4QzMwMi45NDIsMjU1LjMwMywzMDEuNTk3LDI1My40NDgsMzAwLjI0NiwyNTEuNjI4ICAgIHoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMjUyLjc5NiwxNzcuODU5YzMxLjE0NywwLDU2LjQ5OS0zNC4wMTQsNTYuNDk5LTc1LjgzNGMwLTQxLjgxNy0yNS4zNTItNzUuODQxLTU2LjQ5OS03NS44NDEgICAgYy0zMS4xNjUsMC01Ni41MTEsMzQuMDIzLTU2LjUxMSw3NS44NDFDMTk2LjI4NSwxNDMuODQ1LDIyMS42MzEsMTc3Ljg1OSwyNTIuNzk2LDE3Ny44NTl6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTM0NS41OTUsMTM4LjkxOGMtMjQuOTc1LDAtNDQuNTIxLDI1LjkwMS00NC41MjEsNTguOTY3YzAsMzMuMDUxLDE5LjU1OCw1OC45NTUsNDQuNTIxLDU4Ljk1NSAgICBjMjQuOTYxLDAsNDQuNTMxLTI1LjkwNCw0NC41MzEtNTguOTU1QzM5MC4xMjYsMTY0LjgyLDM3MC41NjgsMTM4LjkxOCwzNDUuNTk1LDEzOC45MTh6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTg5LjA0OCwxOTcuODg1YzAtMzMuMDY1LTE5LjU1OC01OC45NjctNDQuNTIyLTU4Ljk2N0MxOS41NjEsMTM4LjkxOCwwLDE2NC44MiwwLDE5Ny44ODUgICAgYzAsMzMuMDUxLDE5LjU2MSw1OC45NTUsNDQuNTI2LDU4Ljk1NUM2OS40OTEsMjU2Ljg0LDg5LjA0OCwyMzAuOTM2LDg5LjA0OCwxOTcuODg1eiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo='
            }
          }
        };

        modifyTela(true);
      }

      function modifyTela(condicao) {
        self.showAddEditagenda = condicao;
        self.showList = !condicao;
      };

      function buscaragenda() {
        self.nameagenda
        ServiceProxy.find(_agendaUrl + '/' + self.nameagenda, function (data) {
          self.agendas = data;
          modifyTela(false);
        });
      }

      self.modifyAnimal = function () {
        self.agenda.service = undefined;
      }

      self.openPopup = function (name, criteria, param) {
        self.isPetInvalido = false;
        self.isServiInvalido = false;

        var header = 'Serviços';
        var title = ' o serviço';
        var url = '/services';

        if (name == 'pet') {
          header = 'Animais';
          title = ' o animal';
          url = '/pet';
        }

        if (criteria) {
          url = url.concat('/criteria/').concat(criteria);
        }

        if (param) {
          url = url.concat('/param/').concat(param);
        }

        self.sort = function (keyname) {
          self.sortKey = keyname;   //set the sortKey to the param passed
          self.reverse = !self.reverse; //if true make it false and vice versa
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
            self.agenda[name] = data;
          }, function (data) {
            self.agenda[name] = undefined;
          });
      }

      self.enviar = function (condicao) {

        try {

          if (!condicao) {
            throw _msg;
          }

          if (AngularUtils.isEmptyOrNull(self.agenda.pet.id)) {
            self.isPetInvalido = true;
            throw _msg;
          }

          if (AngularUtils.isEmptyOrNull(self.agenda.service.id)) {
            self.isServiInvalido = true;
            throw _msg;
          }

          if (angular.isUndefined(self.agenda.id)) {
            ServiceProxy.add(_agendaUrl, self.agenda);

          } else {
            ServiceProxy.edit(_agendaUrl, self.agenda);
          }

        } catch (error) {
          MessageUtils.error(error);
        }

      }

      self.editagenda = function (agenda) {
        self.agenda = angular.copy(agenda);
        var schedulingDate = new Date(self.agenda.schedulingDate);
        schedulingDate.setDate(schedulingDate.getDate() + 1);
        self.agenda.schedulingDate = schedulingDate;
        modifyTela(true);
      }

      self.deleteagenda = function (agenda) {
        MessageUtils.confirmeDialog('Deseja realmente cancelar esse agendamento?').then(
          function () {
            ServiceProxy.delete(_agendaUrl, agenda, function () {
              buscar(true);
            });
          });
      }

      function podeCancelar(date) {
        var schedulingDate = new Date(date);
        schedulingDate.setDate(schedulingDate.getDate() + 1);
        return schedulingDate > getToday();
      }

      // Disable weekend selection
      function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0);
      }

      $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        startingDay: 1
      };

      $scope.dateOptions2 = {
        dateDisabled: false,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: getToday(),
        startingDay: 1
      };

      $scope.open1 = function () {
        $scope.popup1.opened = true;
      };

      $scope.popup1 = {
        opened: false
      };

      $scope.open2 = function () {
        $scope.popup2.opened = true;
      };

      $scope.popup2 = {
        opened: false
      };

      $scope.open3 = function () {
        $scope.popup3.opened = true;
      };

      $scope.popup3 = {
        opened: false
      };
    }]);


