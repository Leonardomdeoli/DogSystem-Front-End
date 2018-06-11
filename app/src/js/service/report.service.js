angular.module('dog-system')
  .factory('reportUtils', ['ServicePathConstants', 'MessageUtils', '$http', '$rootScope',
    function (ServicePathConstants, MessageUtils, $http, $rootScope) {
      var report = {};
      report.buildReport = function (param, name, url) {
        $rootScope.$emit('loading-started');
        $http({
          method: 'GET',
          url: ServicePathConstants.PRIVATE_PATH + '/relatorio' + url,
          params: { param },
          responseType: 'arraybuffer'
        }).then(function (data) {
          try {

            var ieEDGE = navigator.userAgent.match(/Edge/g);
            var ie = navigator.userAgent.match(/.NET/g); // IE 11+
            var oldIE = navigator.userAgent.match(/MSIE/g);
            var blob = new window.Blob([data.data], { type: 'application/pdf' });

            if (ie || oldIE || ieEDGE) {
              var fileName = name + '.pdf';
              window.navigator.msSaveBlob(blob, fileName);
            }
            else {
              var file = new Blob([data.data], {
                type: 'application/pdf'
              });
              var fileURL = URL.createObjectURL(file);
              var a = document.createElement('a');
              a.href = fileURL;
              a.target = '_blank';
              a.download = name + '.pdf';
              document.body.appendChild(a);
              a.click();
            }

          } catch (error) {
            MessageUtils.error('Ocorreu um erro ao gerar o relárorio ' + name);
          }
        }, function (erro) {
          MessageUtils.error('Ocorreu um erro ao gerar o relárorio ' + erro);
        }).finally(function () {
          $rootScope.$emit('loading-complete');
        });
      };
      return report;
    }]);
