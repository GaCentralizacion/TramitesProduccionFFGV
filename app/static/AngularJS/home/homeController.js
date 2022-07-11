registrationModule.controller('homeController', function ($scope, $rootScope, $location, homeRepository, globalFactory) {

    $scope.tramites = [];
    $scope.vencidos = 0;
    $scope.proxVencidos = 0;
    $scope.tiempo = 0;
    $scope.tab = 1;
    $scope.selEmpresa = 0;
    $scope.selSucursal = 0;
    $scope.selTramite = 0;

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        // $scope.getTramitesByArea();
        $scope.getDiasDiferencias();
        empresaResumen();
        tipoTramite();

        // var fecha = new Date();
        // $scope.fechaIni = fecha.addMonths(-1);

        //$scope.fechaIni = new Date();


        $scope.fechaIni = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        $scope.fechaFin = new Date();

      


    }

    $scope.setTab = function (newTab) {
        var ban = 1;
        // $('#tableTramite').DataTable().destroy();
        $('#tableTramiteFin').DataTable().destroy();
        $scope.tab = newTab;
       
       
            if (newTab == 1) {
                $scope.getTramitesByArea();
            } else if (newTab == 2) {
                $scope.getTramitesByAreaAtendidos();
            } else {
                $scope.getTramitesByAreaFin();
            }
       
        
    };

    $scope.isSet = function (tabNum) {
        return $scope.tab === tabNum;
    };

    $scope.getTramitesByAreaFin = function() {
        $scope.tramites = [];
        var ban = 1;
        if ( $scope.fechaIni && !$scope.fechaFin){
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }
        if ( !$scope.fechaIni && $scope.fechaFin){
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }

        if(ban == 1){
            $('#loading').modal('show');
            $scope.selEmpresa = $scope.selEmpresa ? $scope.selEmpresa : 0;
            $scope.selSucursal = $scope.selSucursal ? $scope.selSucursal : 0;
            $scope.selTramite = $scope.selTramite ? $scope.selTramite : 0;
           
    
    
            homeRepository.getTramitesByAreaFinalizados($rootScope.user.id_area, $rootScope.user.usu_idusuario, $scope.selEmpresa, $scope.selSucursal, $scope.fechaIni, $scope.fechaFin).then((res) => {
                if (res.data.length > 0) {
                   // $scope.tramites = res.data;
                    if($scope.selTramite != 0){
                        $scope.tramites = res.data.filter(tram => tram.id_tramite == $scope.selTramite );    
                    }else{
                        $scope.tramites = res.data;
                    }
                   

                    // $('#tableTramiteFin').DataTable().destroy();
                    globalFactory.filtrosTablaTramites('tableTramiteFin', 'MIS TRAMITES', 5);
                    setTimeout(() => {
                        // $('#tableTramiteFin').DataTable({
                        //     destroy: true,
                        //     "responsive": true,
                        //     searching: true,
                        //     paging: true,
                        //     autoFill: false,
                        //     fixedColumns: true,
                        //     pageLength: 5,
                        //     "order": [[ 1, "desc" ]] ,
                        //     "language": {
                        //         search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        //         searchPlaceholder: 'Buscar',
                        //         oPaginate: {
                        //             sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        //             sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        //         }
                        //     }                      
                        // });
                        $('#tableTramiteFin_length').hide();
                        $('#loading').modal('hide');
                    }, 1000);
                } else {
                    $('#tableTramiteFin').DataTable().destroy();
                  
                        // $('#tableTramiteFin').DataTable({
                        //     destroy: true,
                        //     "responsive": true,
                        //     searching: true,
                        //     paging: true,
                        //     autoFill: false,
                        //     fixedColumns: true,
                        //     pageLength: 5,
                        //     "order": [[ 1, "desc" ]],
                        //     "language": {
                        //         search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        //         searchPlaceholder: 'Buscar',
                        //         oPaginate: {
                        //             sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        //             sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        //         }
                        //     }
                        // });
                        $('#tableTramiteFin_length').hide();
                        $('#loading').modal('hide');
                   
                    swal('', 'No hay trámites en el historial', 'warning');
                }
            });

        }

   
    }

    $scope.getTramitesByArea = () => {
        $scope.tramites = [];

        var ban = 1;
        if ($scope.fechaIni && !$scope.fechaFin) {
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }
        if (!$scope.fechaIni && $scope.fechaFin) {
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }

        if (ban == 1) {
            $('#loading').modal('show');
            $scope.selEmpresa = $scope.selEmpresa ? $scope.selEmpresa : 0;
            $scope.selSucursal = $scope.selSucursal ? $scope.selSucursal : 0;
            $scope.selTramite = $scope.selTramite ? $scope.selTramite : 0;




            homeRepository.getTramitesByArea($rootScope.user.id_area, $rootScope.user.usu_idusuario, $scope.selEmpresa, $scope.selSucursal, $scope.fechaIni, $scope.fechaFin).then((res) => {
                if (res.data.length > 0) {
                  //  $scope.tramites = res.data;
                    if($scope.selTramite != 0){
                        $scope.tramites = res.data.filter(tram => tram.id_tramite == $scope.selTramite );    
                    }else{
                        $scope.tramites = res.data;
                    }
                    console.log('$scope.tramites', $scope.tramites);
                    globalFactory.filtrosTablaTramites('tableTramite', 'MIS TRAMITES', 5);
                    // $('#tableTramite').DataTable().destroy();
                    setTimeout(() => {
                        // $('#tableTramite').DataTable({
                        //     destroy: true,
                        //     "responsive": true,
                        //     searching: true,
                        //     paging: true,
                        //     autoFill: false,
                        //     fixedColumns: true,
                        //     pageLength: 5,
                        //     "order": [[ 1, "asc" ]],
                        //     "language": {
                        //         search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        //         searchPlaceholder: 'Buscar',
                        //         oPaginate: {
                        //             sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        //             sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        //         }
                        //     }
                        // });
                        $('#tableTramite_length').hide();
                        $('#loading').modal('hide');
                    }, 1000);
                } else {
                    $('#tableTramite').DataTable().destroy();
                    // setTimeout(() => {
                    //     $('#tableTramite').DataTable({
                    //         destroy: true,
                    //         "responsive": true,
                    //         searching: true,
                    //         paging: true,
                    //         autoFill: false,
                    //         fixedColumns: true,
                    //         pageLength: 5,
                    //         "order": [[ 1, "asc" ]],
                    //         "language": {
                    //             search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    //             searchPlaceholder: 'Buscar'
                    //         }
                    //     });
                    //     $('#tableTramite_length').hide();
                    //     $('#loading').modal('hide');
                    // }, 1000);
                    $('#loading').modal('hide');
                    swal('', 'No hay trámites para revisar', 'warning');
                }
            });
        }
    }
    $scope.getTramitesByAreaAtendidos = () => {
        $scope.tramites = [];

        var ban = 1;
        if ($scope.fechaIni && !$scope.fechaFin) {
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }
        if (!$scope.fechaIni && $scope.fechaFin) {
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }

        if (ban == 1) {

            $('#loading').modal('show');

            $scope.selEmpresa = $scope.selEmpresa ? $scope.selEmpresa : 0;
            $scope.selSucursal = $scope.selSucursal ? $scope.selSucursal : 0;
            $scope.selTramite = $scope.selTramite ? $scope.selTramite : 0;
            homeRepository.getTramitesByAreaAtendidos($rootScope.user.id_area, $rootScope.user.usu_idusuario, $scope.selEmpresa, $scope.selSucursal, $scope.fechaIni, $scope.fechaFin).then((res) => {
                if (res.data.length > 0) {
                    if($scope.selTramite != 0){
                        $scope.tramites = res.data.filter(tram => tram.id_tramite == $scope.selTramite );    
                    }else{
                        $scope.tramites = res.data;
                    }

                   // $scope.tramites = res.data;
                    console.log('$scope.tramites', $scope.tramites);
                    globalFactory.filtrosTablaTramites('tableTramiteAtendidos', 'MIS TRAMITES ATENDIDOS', 5);
                    // $('#tableTramite').DataTable().destroy();
                    setTimeout(() => {
                        // $('#tableTramite').DataTable({
                        //     destroy: true,
                        //     "responsive": true,
                        //     searching: true,
                        //     paging: true,
                        //     autoFill: false,
                        //     fixedColumns: true,
                        //     pageLength: 5,
                        //     "order": [[ 1, "asc" ]],
                        //     "language": {
                        //         search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        //         searchPlaceholder: 'Buscar',
                        //         oPaginate: {
                        //             sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        //             sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        //         }
                        //     }
                        // });
                        $('#tableTramite_length').hide();
                        $('#loading').modal('hide');
                    }, 1000);
                } else {
                    $('#loading').modal('hide');
                    $('#tableTramite').DataTable().destroy();
                    // setTimeout(() => {
                    //     $('#tableTramite').DataTable({
                    //         destroy: true,
                    //         "responsive": true,
                    //         searching: true,
                    //         paging: true,
                    //         autoFill: false,
                    //         fixedColumns: true,
                    //         pageLength: 5,
                    //         "order": [[ 1, "asc" ]],
                    //         "language": {
                    //             search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    //             searchPlaceholder: 'Buscar'
                    //         }
                    //     });
                    //     $('#tableTramite_length').hide();
                    //     $('#loading').modal('hide');
                    // }, 1000);
                    swal('', 'No hay trámites para revisar', 'warning');
                }
            });
        }
    }

    $scope.getDiasDiferencias = () => {
        homeRepository.getDiasDiferencias($rootScope.user.id_area, $rootScope.user.usu_idusuario).then((res) => {
            console.log("aqui estoy", res.data);
            if (res.data[0].length > 0) {
                $scope.dayMin = parseInt(res.data[1][1].pr_descripcion);
                $scope.dayMax = parseInt(res.data[1][0].pr_descripcion);

                angular.forEach(res.data[0], function (value, key) {
                    if (value.dias >= $scope.dayMax) {
                        $scope.vencidos += 1;
                    } else if (value.dias >= $scope.dayMin && value.dias < $scope.dayMax) {
                        $scope.proxVencidos += 1;
                    } else if (value.dias < $scope.dayMin) {
                        $scope.tiempo += 1;
                    }
                });
                $scope.buscar();
            }
        });
    }

    $scope.goAprobar = (id_perTra) => {
        homeRepository.updateEnRevision(id_perTra).then((res) => {
            if (res.data[0].success == 1) {
                if (!(localStorage.getItem('id_perTra'))) {
                    localStorage.setItem('id_perTra', id_perTra);
                    $location.path(res.data[0].urlAprobar);
                } else {
                    localStorage.removeItem('id_perTra');
                    localStorage.setItem('id_perTra', id_perTra);
                    $location.path(res.data[0].urlAprobar);
                }
            } else {
                swal('Alto', 'Lo sentimos no podemos mostrar el trámite muestrelo mas tarde', 'warning');
            }
        });
    };

    $scope.go = (path) => {
        $location.path(path);
    };

    var tipoTramite = function () {

        homeRepository.tipoTramite($rootScope.user.usu_idusuario).then((res) => {

            if (res.data.length > 0) {
                $scope.tipoTramite = res.data;
            }
        });



    }
    var empresaResumen = function () {

        homeRepository.empresaResumen($rootScope.user.usu_idusuario).then((res) => {

            if (res.data.length > 0) {
                $scope.empresas = res.data;
            }
        });



    }
    $scope.seleccionarEmpresa = function () {

        homeRepository.sucursalResumen($rootScope.user.usu_idusuario, $scope.selEmpresa).then((res) => {

            if (res.data.length > 0) {
                $scope.sucursales = res.data;
            }
        });



    }
    $scope.buscar = function () {
        var ban = 1;
        $scope.selEmpresa = $scope.selEmpresa ? $scope.selEmpresa : 0;
        $scope.selSucursal = $scope.selSucursal ? $scope.selSucursal : 0;
        $scope.selTramite = $scope.selTramite ? $scope.selTramite : 0;
        console.log($scope.selEmpresa, 'empresa');
        console.log($scope.selSucursal, 'sucursal');
        console.log($scope.selTramite, 'tramite');

        console.log($scope.fechaIni);
        console.log($scope.fechaFin);
        if ( $scope.fechaIni && !$scope.fechaFin){
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }
        if ( !$scope.fechaIni && $scope.fechaFin){
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }


        if(ban == 1){
            if ($scope.tab == 1) {
                $scope.getTramitesByArea();
            } else if ($scope.tab == 2) {
                $scope.getTramitesByAreaAtendidos();
            } else {
                $scope.getTramitesByAreaFin();
            }
    
    
            homeRepository.buscaResumen($scope.selEmpresa, $scope.selSucursal, $scope.selTramite, $scope.fechaIni, $scope.fechaFin).then(function success(result) {
                console.log(result);
                $scope.vencidos = result.data[0].totalTramites;
                $scope.proxVencidos = result.data[0].pendientes;
            }, function error(err) {
                console.log('Ocurrio un error al obtener el resumen de los tramites')
            });
        }

       
    };
});