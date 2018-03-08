angular.module('dog-system')
    .directive('agGrid', function () {
        var ddo = {};

        ddo.restrict = 'E';
        ddo.templateUrl = '../src/components/grid/grid.tpl.html';

        ddo.scope = {
            gridOptions: '=',
            rowSelected: '&?',
            rowDoubleClicked:'&?'
        };

        ddo.controller = 'AgGridController';

        return ddo;
    });