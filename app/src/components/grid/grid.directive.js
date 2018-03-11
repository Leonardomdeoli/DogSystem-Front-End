angular.module('dog-system')
    .directive('agGrid', function () {
        var ddo = {};

        ddo.restrict = 'E';
        ddo.templateUrl = '../src/components/grid/grid.tpl.html';

        ddo.scope = {
            gridOptions: '=',
            rowSelected: '&?',
            rowDoubleClicked:'&?',
            cellClicked:'&?'
        };

        ddo.controller = 'AgGridController';

        return ddo;
    });