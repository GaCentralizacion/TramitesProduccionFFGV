registrationModule.controller('OcController', function ($scope, $rootScope, $location, homeRepository) {

    $scope.ordenescompra = [];
    $scope.vencidos = 0;
    $scope.proxVencidos = 0;
    $scope.tiempo = 0;
    $scope.tab = 1;

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.getTramitesByArea();
    }

    $scope.getTramitesByArea = () => {
        $scope.ordenescompra = [];
        $('#loading').modal('show');
        homeRepository.ordenescompraanticipo().then((res) => {
            console.log( "res", res );
            if (res.data.length > 0) {
                $scope.ordenescompra = res.data;
                console.log( '$scope.tramites', $scope.ordenescompra );
                $('#tableTramite').DataTable().destroy();
                setTimeout(() => {
                    $('#tableTramite').DataTable({
                        destroy: true,
                        "responsive": true,
                        searching: true,
                        paging: true,
                        autoFill: false,
                        fixedColumns: true,
                        pageLength: 25,
                        "order": [[ 1, "asc" ]],
                        "language": {
                            search: '<i class="fa fa-search" aria-hidden="true"></i>',
                            searchPlaceholder: 'Buscar',
                            oPaginate: {
                                sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                                sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                            }
                        }
                    });
                    $('#tableTramite_length').hide();
                    $('#loading').modal('hide');
                }, 1000);
            } else {
                $('#tableTramite').DataTable().destroy();
                setTimeout(() => {
                    $('#tableTramite').DataTable({
                        destroy: true,
                        "responsive": true,
                        searching: true,
                        paging: true,
                        autoFill: false,
                        fixedColumns: true,
                        pageLength: 5,
                        "order": [[ 1, "asc" ]],
                        "language": {
                            search: '<i class="fa fa-search" aria-hidden="true"></i>',
                            searchPlaceholder: 'Buscar'
                        }
                    });
                    $('#tableTramite_length').hide();
                    $('#loading').modal('hide');
                }, 1000);
                swal('', 'No hay Ordenes de Compra por revisar', 'warning');
            }
        });
    }

    $scope.abrirCarrucel = function( item ){
        console.log( $rootScope.user.usu_idusuario );
        window.open( global_settings.urlDigitalizacion + "?id="+ item.odm_ordencompra +"&employee="+ $rootScope.user.usu_idusuario +"&proceso=1");
    }
    

    $scope.go = (path) => {
        $location.path(path);
    };
});