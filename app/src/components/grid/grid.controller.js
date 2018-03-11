angular.module('dog-system')
    .controller('AgGridController', ['$scope',
        function ($scope) {

            init();
            function init() {
                $scope.gridOptions.debug = true;

                $scope.gridOptions.animateRows = true;

                $scope.gridOptions.enableRangeSelection = true;

                $scope.gridOptions.rowData = null;

                $scope.gridOptions.enableSorting = true;

                $scope.gridOptions.enableColResize = true;

                $scope.gridOptions.pagination = true;

                if (angular.isUndefined($scope.gridOptions.enableFilter)) {
                    $scope.gridOptions.enableFilter = true;
                }

                if (angular.isUndefined($scope.gridOptions.paginationPageSize)) {
                    $scope.gridOptions.paginationPageSize = 15;
                }

                if (angular.isUndefined($scope.gridOptions.floatingFilter)) {
                    $scope.gridOptions.floatingFilter = true;
                }


                $scope.gridOptions.rowSelection = "single";

                $scope.gridOptions.components = {
                    loadingRenderer: function (params) {
                        if (params.value !== undefined) {
                            return params.value;
                        } else {
                            return '<img src="../img/loading.gif">'
                        }
                    }
                }

                $scope.gridOptions.icons = {
                    sortAscending: '<i class="fa fa-sort-asc"/>',
                    sortDescending: '<i class="fa fa-sort-desc"/>',
                    sortUnSort: '<i class="fa fa-sort"/>'
                }


                $scope.gridOptions.defaultColDef = {
                    enableValue: true,
                    width: 230,
                    filter: 'agTextColumnFilter',
                    unSortIcon: true
                }

                if (angular.isFunction($scope.rowSelected)) {
                    $scope.gridOptions.onRowSelected = function (event) {
                        $scope.rowSelected({ event: event });
                    }
                }

                if (angular.isFunction($scope.rowDoubleClicked)) {
                    $scope.gridOptions.onRowDoubleClicked = function (event) {
                        $scope.rowDoubleClicked({ event: event });
                    }
                }

                if (angular.isFunction($scope.cellClicked)) {
                    $scope.gridOptions.onCellClicked = function (event) {
                        $scope.cellClicked({ event: event });
                    }
                }

                $scope.gridOptions.localeText = {

                    // for filter panel
                    page: 'página',
                    more: 'mais',
                    to: 'para',
                    of: 'do',
                    next: 'próximo',
                    last: 'último',
                    first: 'primeiro',
                    previous: 'anterior',
                    loadingOoo: 'carregando...',

                    // for set filter
                    selectAll: 'selecione tudo',
                    searchOoo: 'pesquisando...',
                    blanks: 'espaços em branco',

                    // for number filter and text filter
                    filterOoo: 'filtro...',
                    applyFilter: 'aplicar filtro...',

                    // for number filter
                    equals: 'Igual',
                    lessThan: 'Menos que',
                    greaterThan: 'Mais que',
                    notEqual: 'Diferente',
                    notContains: 'Não contém',

                    // for text filter
                    contains: 'Contém',
                    startsWith: 'Começa com',
                    endsWith: 'Termina com',

                    // the header of the default group column
                    group: 'Grupo',

                    // tool panel
                    columns: 'Colunas',
                    rowGroupColumns: 'Colunas de grupo de linha',
                    rowGroupColumnsEmptyMessage: 'Arraste aqui para definir os grupos',
                    valueColumns: 'Valor colunas',
                    pivotMode: 'Modo pivô',
                    groups: 'Grupos',
                    values: 'Valores',
                    pivots: 'Pivôs',
                    valueColumnsEmptyMessage: 'Arraste aqui para agregar',
                    pivotColumnsEmptyMessage: 'Arraste aqui para pivotear',

                    // other
                    noRowsToShow: 'sem linhas para mostrar',

                    // enterprise menu
                    pinColumn: 'Coluna pino',
                    valueAggregation: 'Agregação de valor',
                    autosizeThiscolumn: 'Ajustar tamanho coluna',
                    autosizeAllColumns: 'Ajustar tamanho todas as colunas',
                    groupBy: 'Agrupar por',
                    ungroupBy: 'Desagrupar por',
                    resetColumns: 'Desfazer alterações',
                    expandAll: 'Expandir tudo',
                    collapseAll: 'Fechar tudo',
                    toolPanel: 'Mostar configurações',
                    export: 'Exportar',
                    csvExport: 'Exportar CSV',
                    excelExport: 'Exportar Excel',

                    // enterprise menu pinning
                    pinLeft: 'Fixar a esquerda <<',
                    pinRight: 'Fixar a direita >>',
                    noPin: 'Não fixar <>',

                    // enterprise menu aggregation and status panel
                    sum: 'Soma',
                    min: 'Mínimo',
                    max: 'Máximo',
                    first: 'Primeiro',
                    last: 'Último',
                    none: 'Nenhuma',
                    count: 'Contar',
                    average: 'Média',

                    // standard menu
                    copy: 'Copiar',
                    copyWithHeaders: 'Copiar com cabeçalhos',
                    ctrlC: 'Ctrl + C',
                    paste: 'Colar aqui',
                    ctrlV: 'Ctrl + V'
                };
            }

        }]);