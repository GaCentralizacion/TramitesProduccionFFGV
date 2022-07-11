registrationModule.controller('aprobarGastosDeMasController',  function ($scope, $rootScope, $location, anticipoGastoRepository, $window, devolucionesRepository,fondoFijoRepository,aprobarDevRepository, aprobarFondoRepository) {
    console.log("Este es un ejemplo");
    $scope.usuario = {};
    $scope.accionForm = 'solicitud';
    $scope.titulo = 'Solicitud de Gasto';
    $scope.totalComprobacion = 599;
    $scope.totalAutorizado = 2750;
    $scope.idSolicitud = 0;
    $scope.mostrarDocumentos = false;
    $scope.conceptosSolicitud = [];
    $scope.comentarioRechazo = '';
    $scope.idTipoProceso = 0;
    $scope.activarImporte = 0;
    $scope.idEstatusConcepto = 0;
    $scope.archivos = [];
    $scope.montoGastado = 0;
    $scope.montoDiferencia = 0;
    $scope.montoAprobado = 0;
    $scope.conceptoXmlList = [];
    $scope.archivo = {};
    $scope.archivoRecibo = { nombre: '', urlArchivo: '', extension: '' };
    $scope.conceptoSeleccionado = '';
    $scope.tramite = {
        idSolicitud: 0,
        concepto: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        importe: '',
        estatus: 'En revisión',
        idEstatus: 0,
        observaciones: '',
        idEstatusAnterior: 0
    };

    $scope.concepto = {
        id: 0,
        concepto: '',
        importe: 0,
        comentario: '',
        idEstatus: 0,
        estatus: '',
        idEmpleado: 0,
        idTramiteDevolucion: 0,
        idUsuario: 0,
        idTipoProceso: 0,
        archivos: '',
        expanded: false
    };

    $scope.montoMaximoGV = 0;
    $scope.idtipoViaje = -1
    $scope.disabledTipoViaje = true;
    $scope.selUsuario = 0
    $scope.empleadoSolicitante = ''
    

    $scope.init = () => {
        $('.cargando').hide();
        
        if (getParameterByName('idSolicitud') != '') {    
            $scope.idSolicitud = getParameterByName('idSolicitud');
            $scope.idConceptoGasto = getParameterByName('idConceptoGasto');
            $scope.idConceptoArchivo =  getParameterByName('idConceptoArchivo');
            $scope.importeAprobar = getParameterByName('m');
            $scope.cerrarNoti = getParameterByName('n');
            $scope.ac = getParameterByName('ac');
            $scope.numeroSolicitud = 'Solicitud número: ' + $scope.idSolicitud;
            $scope.getAnticipoGastoItem();
            //Se pone otro estatus para que no aparezcan los botones de rechazar y autorizar
            $scope.idestatus = -1;
            $scope.importeAprobar = atob($scope.importeAprobar);
            $scope.cerrarNoti = atob($scope.cerrarNoti);
        }
        
    };

    $scope.getAnticipoGastoItem = function () {
        anticipoGastoRepository.getAnticipoGastoById($scope.idSolicitud, 1).then((res) => {
            if (res.data != null && res.data.length > 0) {
                $scope.tramite = {
                    idSolicitud: res.data[0].idSolicitud,
                    concepto: res.data[0].concepto,
                    fechaInicio: res.data[0].fechaInicio,
                    fechaFin: res.data[0].fechaFin,
                    importe: res.data[0].importe,
                    estatus: res.data[0].estatus,
                    idEstatus: res.data[0].idEstatus,
                    observaciones: res.data[0].observaciones,
                    motivo: res.data[0].motivo,
                    idCompania: res.data[0].idCompania,
                    idSucursal: res.data[0].idSucursal,
                    idDepartamento: res.data[0].idDepartamento,
                    nombreCliente: res.data[0].nombreCliente,
                    empresa: res.data[0].empresa,
                    sucursal: res.data[0].sucursal,
                    departamento: res.data[0].departamento,
                    icono: res.data[0].icono,
                    dep_nombrecto: res.data[0].dep_nombrecto,
                    cuentaClabeSolicitante:res.data[0].ca_clabe,
                    bancoSolicitante: res.data[0].ca_banconombre,
                    nombreEmpleadoAdicional: res.data[0].nombreEmpleadoAdicional,
                    usuario: res.data[0].usuario,
                    correoSolicitante: res.data[0].correoSolicitante
                };
                console.log( "$scope.tramite", $scope.tramite );
                $scope.concepto.idEstatus = $scope.tramite.idEstatus;
                $scope.correoTesoreria = res.data[0].correoTesoreria;
                $scope.Comprobar =  res.data[0].Comprobar;
                $scope.estatusAnticipo = res.data[0].idEstatus;
                $scope.selEmpresa = $scope.tramite.idCompania;
                $scope.selSucursal = $scope.tramite.idSucursal;
                $scope.selDepartamento = $scope.tramite.idDepartamento;
                $scope.empleadoSolicitante = $scope.tramite.nombreEmpleadoAdicional === '' ? $scope.tramite.usuario : $scope.tramite.nombreEmpleadoAdicional ;
                var idEstatus = $scope.tramite.idEstatus;
                $scope.bancoEmpleado = $scope.tramite.bancoSolicitante;
                $scope.cuentaClabe = $scope.tramite.cuentaClabeSolicitante;
                $scope.getConceptosPorSolicitud();
                $scope.getEmpleadosPorIdSolicitud();
                $scope.getArchivosPorConcepto();
                $scope.openWizard();
                $scope.archivos = [];

                if( $scope.ac == 1 ){
                    swal('Aprobación de gastos de mas', 'Estamos procesando tu solicitud', 'success');
                    setTimeout( function(){
                        $scope.actualizaEstatusNotificacionDeMas($scope.archivos[0].idConceptoArchivo, 3);
                    }, 3000);
                }

            } else {
                swal('Anticipo de Saldo', 'No se encontro el registro', 'success');
                $location.path('/misTramites');
            }
        });
        $('#spinner-loading').modal('show');
    };

    $scope.getEmpleadosPorIdSolicitud = function () {
        anticipoGastoRepository.getEmpleadosPorIdSolicitud($scope.tramite.idSolicitud).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.empleados = response.data;
                for (var i = 0; i < $scope.empleados.length; i++) {
                    $scope.empleados[i].expanded = false;
                }
            }
        });
    };

    $scope.getConceptosPorSolicitud = function (opcion) {
        $scope.conceptoSeleccionado = '';
        $('#spinner-loading').modal('show');
        $scope.montoGastado = 0;
        $scope.montoAprobado = 0;
        $scope.montoDiferencia = 0;
        $scope.conceptosSolicitud = [];
        anticipoGastoRepository.conceptosGastoPorSolicitud($scope.idSolicitud, 2).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptosSolicitud = response.data;
                var sumtotalPed = 0;
                var sumtotalSol = 0;
                 angular.forEach( $scope.conceptosSolicitud, function (item, key) {
                    sumtotalPed += item.importeAprobado;
                    sumtotalSol  += item.importeSolicitado;
                });
                $scope.monto = sumtotalPed.toFixed(2);
                $scope.montoSolicitado = sumtotalSol.toFixed(2);
    
               
                if ($scope.idTipoProceso == 4) {
                    for (var i = 0; i < $scope.conceptosSolicitud.length; i++) {
                        $scope.montoGastado = $scope.montoGastado + $scope.conceptosSolicitud[i].importeComprobado;
                        $scope.montoAprobado = $scope.montoAprobado + $scope.conceptosSolicitud[i].importeAprobado;
                    }
                    $scope.montoDiferencia = $scope.montoAprobado - $scope.montoGastado;
                }
            }
            $('#spinner-loading').modal('hide');
        });
    };

    $scope.getArchivosPorConcepto = function () {
        $scope.archivos = [];
        anticipoGastoRepository.getArchivosPorConceptoComp($scope.idConceptoGasto).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.archivos = response.data;
                $scope.archivos =   $scope.archivos.filter(tipo => tipo.idConceptoArchivo == $scope.idConceptoArchivo);
            }
        });

    };

    $scope.verArchivo = function (archivo) {
        archivo.activaApro = true;
        $scope.modalTitle = archivo.nombre;
        let ruta = 'http://docs.google.com/gview?url='
     
        if (archivo.extension == 'pdf') {
            $('#pdfReferenceContent object').remove();
            //  $("<object class='lineaCaptura' data='" + archivo.urlArchivo + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
              $("<object class='lineaCaptura' data='" + ruta+ archivo.urlArchivo + "&embedded=true' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
              
                $('#mostrarPdf').insertAfter($('body'));
                $("#mostrarPdf").modal("show");
       
        } else if (archivo.extension == 'jpg' || archivo.extension == 'png') {
            $scope.verImagen = archivo.urlArchivo;
            $("#mostrarImagen").modal("show");
        } else if (archivo.extension == 'xml') {
            window.open(archivo.urlArchivo, archivo.nombre);

        }
    };

    $scope.openWizard = function () {
        anticipoGastoRepository.estatusAnticipoGasto().then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusAnticipo = res.data;
            } else {
                swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
            }
        });
    }

    $scope.conceptosGastoPorSolicitud = function () {
        $scope.conceptosSolicitud = [];
        anticipoGastoRepository.conceptosGastoPorSolicitud($scope.idSolicitud, $scope.idTipoProceso).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptosSolicitud = response.data;
                if ($scope.idTipoProceso == 1) {
                    $scope.accionEnviar = false;
                }
                for (var i = 0; i < $scope.conceptosSolicitud.length; i++) {
                    $scope.conceptosSolicitud[i].archivo = null;
                    //$scope.conceptosSolicitud[i].expanded = false;
                    if ($scope.idTipoProceso == 1) {
                        if ($scope.conceptosSolicitud[i].idEstatus == 0) {
                            $scope.accionEnviar = true;
                        }
                    }
                }
            } else {
                $scope.accionEnviar = false;
            }
        });
    };

    $scope.actualizaEstatusNotificacionDeMas = function (idConceptoArchivo, tipo) {
        $(".btn-accion").attr("disabled", "disabled");
        anticipoGastoRepository.actualizaEstatusNotificacionDeMas(idConceptoArchivo, tipo).then((res) => {
            if (res.data[0].success == 1) {
                var parametros = {
                    perTraPadre: $scope.idSolicitud,
                    idConceptoArhivo: idConceptoArchivo,
                    importe: $scope.importeAprobar
                }

                if( tipo == 3 ){
                    $scope.creacionTramiteEntregaEfectivo( parametros, tipo );
                }
                else{
                    location.href = $scope.cerrarNoti + "0"
                }

                swal('Gastos de más', 'Se ha cambiado el estatus correctamente', 'success');
                console.log('Ok al actualizar la notificación')
                } else {
                console.log('Error al actualizar la notificación')
            }
        });
    }

    $scope.creacionTramiteEntregaEfectivo = function( parameros, tipo ){
        // console.log( $scope.tramite );
        var parametrosEmail = {
            empresa: $scope.tramite.empresa,
            sucursal: $scope.tramite.sucursal,
            departamento: $scope.tramite.departamento,
            viaje: $scope.tramite.concepto,
            motivo: $scope.tramite.motivo,
            fecha: $scope.tramite.fechaInicio + ' al ' + $scope.tramite.fechaFin,
            concepto: $scope.conceptosSolicitud[0].concepto,
            aprobacion: $scope.conceptosSolicitud[0].importeAprobado,
            comp_aprobado: $scope.archivos[0].total,
            importe: $scope.importeAprobar,
            solicitante: $scope.empleados !== undefined && $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.tramite.usuario
        }


        var estatus = ( tipo == 3 ) ? 'APROBADA' : 'RECHAZADA';

        // console.log("parametrosEmail", parametrosEmail);
        
        html = $scope.bodyAprobacionRechazo( $scope.tramite.idSolicitud, parametrosEmail, estatus );

        $scope.sendMail($scope.tramite.correoSolicitante, "Gastos de Viaje - Entrega de efectivo de gastos de más aprobados", html, tipo)
    }

    // $scope.creacionTramiteEntregaEfectivo = function( parameros, tipo ){
    //     anticipoGastoRepository.creacionTramiteEntregaEfectivo( parameros ).then( response =>{
    //         console.log( "Respuesta de la creacion del tramite", response.data[0].id_perTra );

    //         var parametrosEmail = {
    //             empresa: $scope.tramite.empresa,
    //             sucursal: $scope.tramite.sucursal,
    //             departamento: $scope.tramite.departamento,
    //             viaje: $scope.tramite.concepto,
    //             motivo: $scope.tramite.motivo,
    //             fecha: $scope.tramite.fechaInicio + ' al ' + $scope.tramite.fechaFin,
    //             concepto: $scope.conceptosSolicitud[0].concepto,
    //             aprobacion: $scope.conceptosSolicitud[0].importeAprobado,
    //             comp_aprobado: $scope.archivos[0].total,
    //             importe: $scope.importeAprobar,
    //             solicitante: $scope.empleados !== undefined && $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.tramite.usuario
    //         }
            
    //         html = $scope.bodyTramitesCuenta( response.data[0].id_perTra, parametrosEmail );
    //         $scope.sendMail("alex9abril@gmail.com", "PRUEBAS - Gastos de Viaje - Entrega de efectivo de gastos de más aprobados", html, tipo)
    //         // html = $scope.bodyTramitesCuenta( 12344, $scope.tramite.cuenta, $scope.nombrePersona );
    //         // $scope.sendMail("alex9abril@gmail.com", "PRUEBAS - Solicitud de validación de cuenta para Gastos de Viaje", html)
    //     });
    // }

    $scope.sendMail = function(to, subject, html, tipo) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito')
                if( tipo == 3 ){
                    location.href = $scope.cerrarNoti + "1"
                }
                else{
                    location.href = $scope.cerrarNoti + "0"
                }
                

            } else {
                console.log('Ocuerrio un error al emviar el correo')
            }
        });
    };

    $scope.bodyTramitesCuenta = function( tramite, data ){
        var html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                    <div>
                        <h3>Salida de efectivo de gastos de más</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="text-align: center;" colspan="2"><strong>Detalle de la solicitud</strong></td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Tr&aacute;mite:</span></td>
                                    <td>` + tramite + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                    <td>` + data.solicitante + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                    <td>` + data.empresa + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                                    <td>` + data.sucursal + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Departamento:</span></td>
                                    <td>` + data.departamento + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Viaje:</span></td>
                                    <td>` + data.viaje + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Motivo:</span></td>
                                    <td>` + data.motivo + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Fecha:</span></td>
                                    <td>` + data.fecha + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Concepto:</span></td>
                                    <td>` + data.concepto + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Monto aprobado:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.aprobacion ) + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Monto de Comprobación:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.comp_aprobado ) + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Gasto de más aprobado:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.importe ) + `</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;

        return html;
    } 

    $scope.bodyAprobacionRechazo = function( tramite, data, estatus ){
        var html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                    <div>
                        <h3>COMPROBACIÓN DE MÁS `+ estatus +` </h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="text-align: center;" colspan="2"><strong>Detalle de la solicitud</strong></td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Tr&aacute;mite:</span></td>
                                    <td>` + tramite + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                    <td>` + data.solicitante + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                    <td>` + data.empresa + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                                    <td>` + data.sucursal + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Departamento:</span></td>
                                    <td>` + data.departamento + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Viaje:</span></td>
                                    <td>` + data.viaje + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Motivo:</span></td>
                                    <td>` + data.motivo + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Fecha:</span></td>
                                    <td>` + data.fecha + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Concepto:</span></td>
                                    <td>` + data.concepto + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Monto aprobado:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.aprobacion ) + `</td>
                                </tr>
                                
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Gasto de más aprobado:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.importe ) + `</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;

        return html;
    } 

    $scope.formatNumber = function(n) {
        n = n.toFixed(2);
        n = n.toString()
         while (true) {
           var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
           if (n == n2) break
           n = n2
         }
         return n
    }
});