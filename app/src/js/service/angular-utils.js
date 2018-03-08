angular.module('dog-system')
  .factory('AngularUtils', ['DateUtisConstants',
    function (DateUtisConstants) {

      var service = {
        formatDate: formatDate,
        getToday: getToday,

        formatNumber: formatNumber,
        stringToNumber: stringToNumber,
        roundNumber: roundNumber,
        getNumberOrZero: getNumberOrZero,

        emptyAsUndefined: emptyAsUndefined,
        getProperty:getProperty
      };


      function emptyAsUndefined(s) {
        if (s == undefined || s.length == 0) {
          return undefined;
        }

        var trimed = '';

        if (angular.isFunction(s.trim)) {
          trimed = s.trim();
        }

        return trimed.length == 0 ? undefined : trimed;
      }


      /*  Datas Inicio  */
      function formatDate(date, format) {
        if (angular.isUndefined(date)) {
          return undefined;
        }

        return moment(date).format(format || DateUtisConstants.DEFAULT_DATE_FORMAT);
      }

      function getToday(doClearTime) {
        if (arguments.length == 0) {
          doClearTime = true;
        }

        if (doClearTime) {
          return clearTime();
        } else {
          return moment().toDate();
        }
      }

      function clearTime(date) {
        return moment(date).startOf('day').toDate();
      }
      /*  Datas Fim  */


      /*  Números Inicio  */
      function formatNumber(value, acceptDecimals) {
        if (value) {
          value = value.toString();

          var negative = (value.charAt(0) == '-');

          if (acceptDecimals == false) {
            value = value.replace(/[^\d]/g, '');
          } else {
            value = value.replace(/[^\d.,]/g, '');
          }

          if (negative) {
            value = '-' + value;
          }
        }

        return value;
      }

      function stringToNumber(value) {
        if (angular.isUndefined(value) || value === '' || value === null) {
          return NaN;
        }

        if (value) {
          value = value.toString();

          var negative = (value.charAt(0) === '-');

          value = value.replace(/[^\d.,]/g, '');

          var indexV = value.indexOf(',');
          var indexP = value.indexOf('.');

          if (indexP > indexV) {
            value = value.replace(',', '');
          } else if (indexP < indexV) {
            value = value.replace(/\./g, '@').replace(',', '.').replace(/@/g, '');
          }

          if (negative) {
            value = '-' + value;
          }
        }

        return Number(value);
      }

      function roundNumber(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
      }

      function getNumberOrZero(value) {
        value = StringUtils.isEmpty(value) ? undefined : value;
        value = Number(value);

        if (isNaN(value)) {
          return Number(0);
        }

        return value;
      }
      /*  Números Fim  */


      function getProperty(obj, path) {
        if (angular.isDefined(obj) && obj != null) {
          var pathArr = path.split('.');

          if (pathArr.length > 1) {
            var currObj = obj;

            for (var i = 0, len = pathArr.length; i < len; i++) {
              var currPath = pathArr[i];

              if ((i + 1) == len) {
                return currObj[currPath];
              } else {
                if (angular.isDefined(currObj[currPath])) {
                  currObj = currObj[currPath];
                }
                if (angular.isUndefined(currObj)) {
                  return undefined;
                }
              }
            }
          } else {
            return obj[path];
          }
        }
        return undefined;
      }

      return service;
    }]);

