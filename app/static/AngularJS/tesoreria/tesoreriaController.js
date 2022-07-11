registrationModule.controller('tesoreriaController', function ($scope, $rootScope, $location, localStorageService, tesoreriaRespository, ValidacionCuentaRepository, devolucionesRepository,globalFactory, homeRepository) {

    $scope.vencidos = 0;
    $scope.proxVencidos = 0;
    $scope.tiempo = 0;
    $scope.tab = 1;
    $scope.tramites = [];

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
       // $scope.getTramites(1);
        $scope.getDifDay();
        empresaResumen();
        tipoTramite();

        $scope.fechaIni = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        $scope.fechaFin = new Date();
    };

    $scope.setTab = function (newTab) {
        $('#tableTramite').DataTable().destroy();
        $('#tableTramiteFin').DataTable().destroy();
        $('#tableTramiteAtendidos').DataTable().destroy();
        $scope.tab = newTab;
        if (newTab == 1) {
            $scope.getTramites(1);
        } else if (newTab == 2) {
            $scope.getTramites(2);
        } else {
            $scope.getTramites(3);
        }
    };

    $scope.isSet = function (tabNum) {
        return $scope.tab === tabNum;
    };

    $scope.getTramites = function (idEstatus) {
        $scope.tramites = [];
        var ban = 1;

        $scope.selEmpresa = $scope.selEmpresa ? $scope.selEmpresa : 0;
        $scope.selSucursal = $scope.selSucursal ? $scope.selSucursal : 0;
        $scope.selTramite = $scope.selTramite ? $scope.selTramite : 0;

        if ( $scope.fechaIni && !$scope.fechaFin){
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }
        if ( !$scope.fechaIni && $scope.fechaFin){
            ban = 0;
            swal('Alto', 'Favor de seleccionar un rango de Fechas o bien colocar Fecha Inicio y Fecha Fin sin valor', 'warning');
        }

        if(ban ==1 ){
            tesoreriaRespository.allTramites(idEstatus,$scope.selEmpresa, $scope.selSucursal, $scope.fechaIni, $scope.fechaFin).then((res) => {
                if (res.data.length > 0) {
                    if($scope.selTramite != 0){
                        $scope.tramites = res.data.filter(tram => tram.id_tramite == $scope.selTramite );    
                    }else{
                        $scope.tramites = res.data;
                    }
                   
                    if (idEstatus == 1) {
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
                            //     "order": [[1, "asc"]],
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
                        }, 500);
                    } else if (idEstatus == 3) {
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
                            //     "order": [[1, "asc"]],
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
                        }, 500);
                    }
                    else {
                        // $('#tableTramiteFin').DataTable().destroy();
                        globalFactory.filtrosTablaTramites('tableTramiteAtendidos', 'MIS TRAMITES', 5);
                        setTimeout(() => {
                            // $('#tableTramiteFin').DataTable({
                            //     destroy: true,
                            //     "responsive": true,
                            //     searching: true,
                            //     paging: true,
                            //     autoFill: false,
                            //     fixedColumns: true,
                            //     pageLength: 5,
                            //     "order": [[1, "asc"]],
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
                        }, 500);
                    }
                } else {
                    swal('Alto', 'No hay tramites para revisar', 'warning');
                }
            });

        }



    
    };

    $scope.getDifDay = function () {
        tesoreriaRespository.difDay().then((res) => {
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
    };

    $scope.goAprobar = (data) => {
        if (data.id_tramite == 10 || data.id_tramite == 9 || data.id_tramite == 16) {
            var consecutivo = data.consecutivo;
            var tipo = ''
            switch (data.tra_nomTramite) {
                case 'Fondo Fijo-Salida Efectivo':
                    tipo = 1;
                    break;
                case 'Fondo Fijo-Reembolso Efectivo':
                    tipo = 2;
                    break;
                case 'Reembolso Fondo Fijo-Reembolso Efectivo':
                    tipo = 2;
                    break;
                case 'Anticipo de Gastos - Orden de Pago':
                    tipo = 4;
                    break;
            }
            tesoreriaRespository.updateEnRevisionFA(data.id_perTra, tipo, consecutivo).then((res) => {
                if (res.data[0][0].success == 1) {
                    if (!(localStorage.getItem('id_perTra'))) {
                        localStorage.setItem('id_perTra', data.id_perTra);
                        localStorage.removeItem('idTramite');
                        localStorage.setItem('idTramite', data.id_tramite);
                        $location.path(res.data[0][0].urlAprobar);
                    } else {
                        localStorage.removeItem('id_perTra');
                        localStorage.setItem('id_perTra', data.id_perTra);
                        localStorage.removeItem('idTramite');
                        localStorage.setItem('idTramite', data.id_tramite);
                        localStorage.removeItem('tipoTramite');
                        localStorage.setItem('tipoTramite', tipo);
                        localStorage.removeItem('consecutivoTramite');
                        localStorage.setItem('consecutivoTramite', consecutivo);
                        $location.path(res.data[0][0].urlAprobar);
                    }
                } else {
                    swal('Alto', 'Lo sentimos no podemos mostrar el trámite muestrelo mas tarde', 'warning');
                }
            });
        }

        else if (data.id_tramite == 14) {
            localStorage.removeItem('vc_cuenta');
            localStorage.setItem('vc_cuenta', JSON.stringify(data));
            $location.path('validacioncuenta');
        }
        else {
            tesoreriaRespository.updateEnRevision(data.id_perTra).then((res) => {
                if (res.data[0][0].success == 1) {
                    if (!(localStorage.getItem('id_perTra'))) {
                        localStorage.setItem('id_perTra', data.id_perTra);
                        localStorage.removeItem('idTramite');
                        localStorage.setItem('idTramite', data.id_tramite);
                        $location.path(res.data[0][0].urlAprobar);

                    } else {
                        localStorage.removeItem('id_perTra');
                        localStorage.setItem('id_perTra', data.id_perTra);
                        localStorage.removeItem('idTramite');
                        localStorage.setItem('idTramite', data.id_tramite);
                        $location.path(res.data[0][0].urlAprobar);


                    }
                } else {
                    swal('Alto', 'Lo sentimos no podemos mostrar el trámite muestrelo mas tarde', 'warning');
                }
            });
        }
    };


    $scope.initBusqueda = function(){
        $scope.flagBusqueda = false;
        $scope.busquedaparam = '';
        $scope.DataCuentas = [];
    }

    $scope.openModalCuentas = function(){
        $scope.initBusqueda();
        $("#modalCuentas").modal('show');
    }

    $scope.flagRespuesta = 0;
    $scope.buscarCuentas = function(){
        $scope.flagBusqueda = true;
        $scope.flagRespuesta = 0;
        $scope.comentariorechazo = '';
        tesoreriaRespository.CuentaSearch( $scope.busquedaparam ).then( (res)=>{
            $scope.flagRespuesta = 1;
            $scope.DataCuentas = res.data;
        });
        // $scope.DataCuentas = [
        //     {nombre: '', CLABE: '', cuenta: '', banco: '', plaza: '32', sucursal: '12',  idEstatus: 1},
        //     {nombre: '', CLABE: '', cuenta: '', banco: '', plaza: '32', sucursal: '12',  idEstatus: 1},
        //     {nombre: '', CLABE: '', cuenta: '', banco: '', plaza: '32', sucursal: '12',  idEstatus: 1},
        // ];
    }

    $scope.getkeys = function (event) {
        if( event.keyCode == 13 )  $scope.buscarCuentas();
    }

    $scope.perTraRow;
    $scope.openModalEliminar = function( item ){
        $scope.perTraRow = item;
        $("#exampleModal").modal('show');
    }

    $scope.rechazar = function(){
        if( $scope.comentariorechazo != '' ){
            swal({
                title: 'Aviso',
                type: 'warning',
                text: '¿Está seguro de eliminar esta cuenta?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.cambioestatus( 4 );
                } 
            });
        }
        else{
            swal('Alto', 'Debe proporcionar un motivo del rechazo.', 'warning');
        }
    }

    $scope.comentariorechazo = '';
    $scope.cambioestatus = function( estatus ){
        $("#exampleModal").modal('hide');
        // console.log( "estatus", estatus );
        // $(".modal-backdrop").hide();
        ValidacionCuentaRepository.estatuscuenta( $scope.perTraRow.id_perTra, estatus, $scope.comentariorechazo ).then( res =>{
            html = $scope.bodyTramitesCuenta( $scope.perTraRow, $scope.perTraRow.nombre, 'RECHAZADA', "<small>Motivo del rechazo:</small> <b>" + $scope.comentariorechazo + "</b>" );
            $scope.sendMail($scope.perTraRow.correo, "PRUEBAS - Solicitud de validación de cuenta RECHAZADA para Gastos de Viaje", html);
            
            // $scope.regresar()
            swal('Estatus de Cuenta', 'La cuenta ha cambiado de estatus satisfactoriamente', 'success');
            $scope.buscarCuentas();
        });
    }

    $scope.sendMail = function(to, subject, html) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito ")')
            } else {
                console.log('Ocuerrio un error al emviar el correo "( ')
                
            }
        });
    };

    $scope.bodyTramitesCuenta = function( cuenta, solicitante, estatus, motivo ){
        var html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                    <div>
                        <p>Solicitud validación de cuenta bancaria</p><br>
                        <small>Estatus:</small> ` + estatus + `<br>
                        ` + motivo + `
                        <br><br>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="text-align: center;" colspan="2"><strong>Detalle de la solicitud</strong></td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Tr&aacute;mite:</span></td>
                                    <td>` + cuenta.id_perTra + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                    <td>` + solicitante + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">CLABE:</span></td>
                                    <td>` + cuenta.CLABE + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">No. Cuenta:</span></td>
                                    <td>` + cuenta.cuenta + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Banco:</span></td>
                                    <td>` + cuenta.banco + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Plaza:</span></td>
                                    <td>` + cuenta.plaza + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                                    <td>` + cuenta.sucursal + `</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;

        return html;
    } 
    var tipoTramite = function(){
        
        homeRepository.tipoTramite( $rootScope.user.usu_idusuario).then((res) => {
           
            if (res.data.length > 0) {
               $scope.tipoTramite = res.data;
            }
        });

     

    }
    var empresaResumen = function(){
        
        homeRepository.empresaResumen( $rootScope.user.usu_idusuario).then((res) => {
           
            if (res.data.length > 0) {
               $scope.empresas = res.data;
            }
        });

     

    }
    $scope.seleccionarEmpresa = function(){
       
        homeRepository.sucursalResumen( $rootScope.user.usu_idusuario, $scope.selEmpresa).then((res) => {
           
            if (res.data.length > 0) {
               $scope.sucursales = res.data;
            }
        });

     

    }
    $scope.buscar = function() {
        var ban = 1;
        $scope.selEmpresa = $scope.selEmpresa ? $scope.selEmpresa : 0;
        $scope.selSucursal = $scope.selSucursal ? $scope.selSucursal : 0;
        $scope.selTramite = $scope.selTramite ? $scope.selTramite : 0;
        console.log($scope.selEmpresa, 'empresa');
        console.log($scope.selSucursal, 'sucursal');
        console.log($scope.selTramite, 'tramite');
       
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
                $scope.getTramites(1);
            } else if ($scope.tab == 2) {
                $scope.getTramites(2);
            } else {
                $scope.getTramites(3);
            }
    
            
            tesoreriaRespository.buscaResumen($scope.selEmpresa, $scope.selSucursal, $scope.selTramite, $scope.fechaIni, $scope.fechaFin).then(function success(result) {
                console.log(result);
                $scope.vencidos = result.data[0].totalProcesados;
                $scope.proxVencidos = result.data[0].pendientes;
            }, function error(err) {
                console.log('Ocurrio un error al obtener el resumen de los tramites')
            });
        };

        }
      

});