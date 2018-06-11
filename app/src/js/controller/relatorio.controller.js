angular.module('dog-system')
    .controller('RelatorioCtrl', ['reportUtils',
        function (reportUtils) {
            var self = this;

            self.items = [
                {
                    codigo: 1,
                    descricao: 'Raça'
                },
                {
                    codigo: 2,
                    descricao: 'Clientes e Pet'
                },
                {
                    codigo: 3,
                    descricao: 'Clientes'
                },
                {
                    codigo: 4,
                    descricao: 'Serviços'
                },
                {
                    codigo: 5,
                    descricao: 'Agendamentos'
                }
            ];

            self.openRelatorio = openRelatorio;

            function openRelatorio(codigo) {
                switch (codigo) {
                    case 1:
                        reportUtils.buildReport(null, 'Relátorios de Raças', '?descrRel=breed');
                        break;
                    case 2:
                        reportUtils.buildReport(null, 'Relátorios de Clientes e Pet ', '?descrRel=cliente-pet-grupo');
                        break;
                    case 3:
                        reportUtils.buildReport(null, 'Relátorios de Clientes ', '?descrRel=clientes');
                        break;
                    case 4:
                        reportUtils.buildReport(null, 'Relátorios de Serviços ', '?descrRel=servicos');
                        break;
                    case 5:
                        reportUtils.buildReport(null, 'Relátorios de Agendamentos ', '?descrRel=agendamentos&data=' + new Date());
                        break;
                }
            }
        }]);

