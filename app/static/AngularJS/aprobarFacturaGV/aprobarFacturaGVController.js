    registrationModule.controller('aprobarFacturaGVController', function ($scope, $rootScope, $location, anticipoGastoRepository, $window, devolucionesRepository,fondoFijoRepository,aprobarDevRepository, aprobarFondoRepository) {
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
        $scope.motivoRechazo =''
        $scope.motivoAutorizacionFactura
        var html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
        var html2 = "</p></div>";
    
        $scope.init = () => {
            if (getParameterByName('idSolicitud') != '') {    
                $scope.idSolicitud = getParameterByName('idSolicitud');
                $scope.idConceptoGasto = getParameterByName('idConceptoGasto');
                $scope.idConceptoArchivo = getParameterByName('idConceptoArchivo');
                $scope.numeroSolicitud = 'Solicitud número: ' + $scope.idSolicitud;
                $scope.getAnticipoGastoItem();
                //Se pone otro estatus para que no aparezcan los botones de rechazar y autorizar
                $scope.idestatus = -1;
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
                        usuario: res.data[0].usuario
                    };
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
                    $scope.estatusNotificacion = response.data[0].estatusNotificacion
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
                //$("<object class='lineaCaptura' data='" + archivo.urlArchivo + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
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

        /**
         * Opcion: 1 aprobar, 0 rechacr
         */
        $scope.cierraNotificacion = function(opcion){
            
            if ($scope.archivos[0].mesCorriente === 5){
                $("#modalSolicitudAutorizacion").modal({backdrop: 'static', keyboard: false})
                $('#modalSolicitudAutorizacion').modal('show');
            }else{
                anticipoGastoRepository.updNotificacionParametrosFacturas($scope.idConceptoArchivo).then(resp => {
                    if(resp.data[0].idAprobacion > 0){
                        link = `${global_settings.urlApiNoty}api/notification/approveNotificationMail/?idAprobacion=${resp.data[0].idAprobacion}&identificador=${resp.data[0].identificador }&idUsuario=${resp.data[0].idUsuarioAuto}&respuesta=${opcion}`
                        console.log('link ', link)
                        window.open(link,'_self');
                        }
                })
            }
        }

        $scope.justificaRechazo = function(){
            //$("viewRechazo").show();
            $("#modalrechazarSolicitudGasto").modal({backdrop: 'static', keyboard: false})
            $('#modalrechazarSolicitudGasto').modal('show');
        }

        $scope.rechazarSolicitud = function (){

            if(($scope.motivoRechazo === undefined || $scope.motivoRechazo.length < 15) || $scope.motivoRechazo.length > 50){
                swal('Aviso', 'El motivo de rechazo debe de tener mínimo 15 caracteres máximo 50 caracteres', 'warning')
            }else{
                anticipoGastoRepository.updRechazoConceptoArchivo($scope.idConceptoArchivo, $scope.motivoRechazo).then(resp => {
                    $('#modalrechazarSolicitudGasto').modal('show');
                    $scope.cierraNotificacion(0)
                    $scope.envioCorreoSolicitante($scope.idConceptoArchivo, $scope.motivoRechazo);
                })
            }
        }

        $scope.envioCorreoSolicitante = function(idConceptoArchivo, motivoRechazo){
                anticipoGastoRepository.datosSolicitanteByConceptoArchivo(idConceptoArchivo).then(resp => {
                    if(resp.data[0].estatus == 1){
                       let total =  formatMoney(resp.data[0].total);
                        html = ` ${html1} Rechazo de Factura<br><br> ${html2}
                        <p><strong>Empresa: </strong> ${resp.data[0].empresa} </p> 
                        <p><strong>Sucursal: </strong> ${resp.data[0].sucursal} </p>
                        <p><strong>Motivo: </strong> ${motivoRechazo} </p>
                        <p><strong>Solicitante: </strong> ${resp.data[0].Empleado} </p>
                        <p><strong>Factura: </strong> ${resp.data[0].documento} </p>
                        <p><strong>Importe: </strong> $${total} </p>`;
                        $scope.sendMail(resp.data[0].correo, 'Rechazo de Factura,  Anticipo de Gastos N° ' + resp.data[0].idSolicitud, html);
                        }
                })
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
        $scope.solicitudAutorizacion =function(){

            if(($scope.motivoAutorizacionFactura === undefined || $scope.motivoAutorizacionFactura.length < 15) || $scope.motivoAutorizacionFactura.length > 50){
                swal('Aviso', 'El motivo de rechazo debe de tener mínimo 15 caracteres máximo 50 caracteres', 'warning')
            }else{
                anticipoGastoRepository.updSolicitudFacturaAprobacion($scope.idConceptoArchivo, $scope.motivoAutorizacionFactura).then(resp => {
                    console.log(resp)
                    $('#modalSolicitudAutorizacion').modal('show')
                    anticipoGastoRepository.updNotificacionParametrosFacturas($scope.idConceptoArchivo).then(resp => {
                        if(resp.data[0].idAprobacion > 0){
                            link = `${global_settings.urlApiNoty}api/notification/approveNotificationMail/?idAprobacion=${resp.data[0].idAprobacion}&identificador=${resp.data[0].identificador }&idUsuario=${resp.data[0].idUsuarioAuto}&respuesta=1`
                            console.log('link ', link)
                            window.open(link,'_self');
                            }
                    })
                })
            }

        }

        function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
            try {
              decimalCount = Math.abs(decimalCount);
              decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
          
              const negativeSign = amount < 0 ? "-" : "";
          
              let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
              let j = (i.length > 3) ? i.length % 3 : 0;
          
              return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
            } catch (e) {
              console.log(e)
            }
        };
    
    });