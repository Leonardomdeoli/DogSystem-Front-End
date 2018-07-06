/**
 * @ngdoc directive
 * @name ag-grid.directive:ag-grid
 * @restrict E
 * @scope
 * @description
    Esse componente é responsável por criar a grid do sistema
 *
 * @param {array=} grid-options Recebe as configurações da grid
 *
 * @example
     <example module="app">
         <file name="FormExample.html">
            <ag-grid grid-options="ctrl.gridOptions" flex></ag-grid>
         </file>
     </example>
 */
angular.module('dog-system')
    .directive('agGrid', function () {
        var ddo = {};

        ddo.restrict = 'E';
        ddo.templateUrl = '../src/components/grid/grid.tpl.html';

        ddo.scope = {
            gridOptions: '=',
            rowSelected: '&?',
            rowDoubleClicked:'&?',
            cellClicked:'&?',
            cellDoubleClicked:'&?'
        };

        ddo.controller = 'AgGridController';

        return ddo;
    });