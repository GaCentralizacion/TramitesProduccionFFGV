registrationModule.controller('aprobarDevController', function ($scope, $rootScope, $location, localStorageService, devolucionesRepository, aprobarDevRepository, aprobarRepository, clientesRepository, documentosRepository, ordenDePagoRepository, proveedoresRepository,utils) {

    $scope.dataAprobar = [];
    $scope.empresas = [];
    $scope.nombreEstatus = '';
    $scope.traEstatus;
    $scope.selEmpresa = 0;
    $scope.sucursales = 0;
    $scope.selFormaPago = 0;
    $scope.selDepartamento = 0;
    $scope.aprobarDocs = [];
    $scope.verPdfDocumento = '';
    $scope.modalTitle = '';
    $scope.verImagen = '';
    $scope.razonesRechazo = '';
    $scope.activarAprobar = true;
    $scope.observacionesTramite = '';
    $scope.observacionesDelTramite = ''
    $scope.idCliente = 0;
    $scope.documentosUsados = [];
    $scope.cliente = [];
    $scope.titleAprobar = '';
    $scope.todayDate;
    $scope.estatusDevolucion;
    $scope.amountNontificaciones;
    $scope.areaUser;
    $scope.nuevoDoc = {
        nombre: '',
        extension: 0,
        porSolicita: ''
    };
    $scope.extensiones;
    $scope.showCuentaBancaria = false;
    $scope.showDatasEfectivo = false;
    $scope.cuentaBancaria = '';
    $scope.numeroCLABE = '';
    $scope.docCorrecto = false;
    $scope.docTesoreria = [];
    $scope.bancoEmpresa = [];
    $scope.activaInputCuenta = true;
    $scope.activaInputBanco = false;
    $scope.bancoCuenta;
    $scope.cuentaActual;
    $scope.cveBanxico = '';
    $scope.tipoTramite = 0;
    $scope.tipoCuenta = '';
    $scope.estatusCuenta = 0;
    $scope.estatusMixNoEfectico = 0;
    $scope.estatusMixEfectico = 0;
    $scope.esCC = 0;
    $scope.banderaCC = 0;
    $scope.tipoPago = '';
    $scope.disabledValidarCuenta = true;
    $scope.nombreBancoModal = '';
    $scope.rechazarDocumentoTesoreria;
    $scope.rechazoDeDocs = false;
    $scope.showDocumenosRechazados = true;
    $scope.showOrdenPagoBtn = 0;
    $scope.documentos = [];
    $scope.origenBpro= 0;

    $scope.init = () => {
        var p = [];
        p.push(aprobarDevRepository.allEmpresas());
        p.push(devolucionesRepository.motivoDevolucion());
        Promise.all(p).then(function (results) {
            $scope.empresas = results[0].data;
            $scope.motivoDevolucionLst = results[1].data;


            if (getParameterByName('idTramite') != '') {
                $scope.id_perTra = getParameterByName('idTramite');
                $rootScope.user = {};
                $rootScope.user.usu_idusuario = getParameterByName('employee');
                $scope.getDatas($scope.id_perTra);
                $scope.getDocumentosAprobar($scope.id_perTra);
            } else {
                $scope.id_perTra = localStorage.getItem('id_perTra');
                $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
                $scope.titleAprobar = 'Devolución No. ' + localStorage.getItem('id_perTra');
                $scope.areaUser = $rootScope.user.id_area;
                $scope.getDatas($scope.id_perTra);
                $scope.getAllFormaPago();
                $scope.getDocumentosAprobar($scope.id_perTra);
                $scope.getActivarAprobarTramite();
                $scope.getParamNotificacion();
            }

        });


        // $scope.getAllEmpresas();
       
    };

    $scope.getParamNotificacion = function () {
        aprobarDevRepository.paramNotificacion().then((res) => {
            $scope.amountNontificaciones = parseInt(res.data[0].pr_descripcion);
        });
    }

    $scope.getDatas = function (id_perTra) {
        aprobarDevRepository.aprobarData(id_perTra).then((res) => {
            $scope.esCC = res.data[0].traDe_conCC;
            $scope.banderaCC = res.data[0].traDe_banderaCC;
            $scope.idCliente = res.data[0].PER_IDPERSONA;
            $scope.dataAprobar = res.data;
            $scope.nombreEstatus = res.data[0].est_nombre;
            $scope.traEstatus = res.data[0].id_estatus;
            $scope.selEmpresa = res.data[0].id_empresa;
            $scope.getSucuesales(res.data[0].id_empresa);
            $scope.selFormaPago = res.data[0].id_formaPago;
            $scope.observacionesTramite = res.data[0].traDe_Observaciones;
            $scope.traEstatus == 3 ? $scope.estatusDevolucion = 0 : $scope.estatusDevolucion = res.data[0].orden; //res.data[0].esDe_IdEstatus;
            $scope.cuentaBancaria = res.data[0].cuentaBancaria;
            $scope.numeroCLABE = res.data[0].numeroCLABE;
            $scope.cveBanxico = res.data[0].cveBanxico;
            $scope.tipoCuenta = res.data[0].tipoCuentaBancaria;
            $scope.esIdEstatus = res.data[0].esDe_IdEstatus;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            $scope.tipoTramite = res.data[0].id_tipoTramite;
            $scope.estatusCuenta = res.data[0].estatus;
            $scope.tipoPago = res.data[0].tipoPago;
            $scope.nombreBancoModal = res.data[0].nombreBanco;
            $scope.estatustramite = res.data[0].esDe_IdEstatus;
            $scope.estatusMixNoEfectico = res.data[0].e_noEfectivo;
            $scope.estatusMixEfectico = res.data[0].e_efectivo

            $scope.todayDate = mm + '/' + dd + '/' + yyyy;
            $scope.openWizard();
            $scope.getBancos();
            $scope.motivoDev = res.data[0].idMotivo;
            $scope.motivoDevolucionLst.idMotivo = res.data[0].idMotivo;
            $scope.origenBpro = res.data[0].origenBpro;
            // if (res.data[0].esDe_IdEstatus > 3 && ($scope.tipoTramite == 3 || $scope.tipoTramite == 1 || $scope.tipoTramite == null)) {
            if (res.data[0].esDe_IdEstatus > 1 && res.data[0].esDe_IdEstatus != 7 && res.data[0].esDe_IdEstatus != 8 && ($scope.tipoTramite == 3 || $scope.tipoTramite == 1 || $scope.tipoTramite == null)) {
                
                if($scope.selFormaPago != 2){
                    $scope.bancoActual = parseInt(res.data[0].efectivoBanco);
                    $scope.getCuenta($scope.bancoActual == null ? 0 : $scope.bancoActual);
                    $scope.cuentaActual = res.data[0].efectivoCuenta;

                }
                
            }
           
            

            if( $scope.areaUser == 2 && $scope.esCC == 1 && $scope.estatusDevolucion == 2){
                if( $scope.banderaCC == 0 ){
                    setTimeout(() => {
                        swal( 'Atención!', 'Este tramite contiene un CC, se debera enviar a validación antes de continuar', 'warning' );
                    }, 500);
                } else if( $scope.banderaCC == 1 ){
                    setTimeout(() => {
                        swal( 'Atención!', 'Este tramite contiene un CC, aun se encuentra en validación', 'warning' );
                    }, 500);
                }
            }
        });
    };

    $scope.getBancos = function () {
        aprobarDevRepository.getBancos($scope.selEmpresa).then((res) => {
            $scope.bancoEmpresa = res.data;
        });
    };

    $scope.getCuenta = function (idBanco) {
        $scope.activaBotonBuscar = true;
        if (idBanco == undefined || idBanco == null || idBanco == '') {
            swal(
                'Alto',
                'Seleccione una Banco',
                'warning'
            );
            $scope.activaInputCuenta = true;
            $scope.cuentaActual = []
        } else if (idBanco === 0) {
            $scope.activaInputCuenta = true;
            $scope.cuentaActual = []
        }else{
            aprobarDevRepository.getCuentas($scope.selEmpresa, idBanco).then(function (result) {
                if (result.data.length > 0) {
                    $scope.bancoCuenta = result.data;
                    if( $scope.estatusDevolucion == 2 ){
                        $scope.activaInputCuenta = false;
                    }else{
                        $scope.activaInputCuenta = true;
                        $scope.activaInputBanco = true;
                    }
                } else
                    $scope.bancoCuenta = [];
            });
        }
    }

    $scope.getClienteData = function () {
        aprobarDevRepository.dataCliente($scope.idCliente, $scope.selEmpresa, $scope.selSucursal).then((res) => {
            $scope.cliente = res.data[0];
        });
    }

    $scope.getDocumentosUsados = function () {
        var contador = 0;
        var efectivo = 0;
        aprobarDevRepository.documentosUsados($scope.idCliente, $scope.selEmpresa, $scope.selSucursal, $scope.id_perTra).then((res) => {
            $scope.documentosUsados = res.data;

            angular.forEach($scope.documentosUsados, (value, key) => {
                if (value.tipoPago != 'EF') {
                    if(value.tipoPago == $scope.tipoPago){ 
                        efectivo += 1
                    }else{
                        if( value.tipoPago === '39' ){
                            contador += 1;
                            efectivo += 1
                            // if( value.PAR_DESCRIP1.indexOf('UNIDADES') === -1 ){
                            //     contador += 1;
                            // }else{
                            //     efectivo += 1
                            // }
                        }else{
                            contador += 1;
                        }
                    }
                } else {
                    
                    if( value.PAR_DESCRIP1.indexOf('UNIDADES') === -1 ){
                        contador += 1;
                    }else{
                        efectivo += 1
                    }
                }
            });
            
            if (contador > 0 && efectivo > 0) {
                $scope.showCuentaBancaria = true;
                $scope.showDatasEfectivo = true;
            } else if (contador > 0) {
                $scope.showCuentaBancaria = true;
                $scope.showDatasEfectivo = false;
            } else {
                $scope.showDatasEfectivo = true;
                $scope.showCuentaBancaria = false;
            }
        });
    }

    $scope.getAllEmpresas = function () {
        aprobarDevRepository.allEmpresas().then((res) => {
            $scope.empresas = res.data;
        });
    };

    $scope.getSucuesales = function (idEmpresa) {
        aprobarDevRepository.sucByidEmpresa(idEmpresa).then((res) => {
            $scope.sucursales = res.data;
            $scope.selSucursal = $scope.dataAprobar[0].id_sucursal;
            $scope.getDepartamentos();
            $scope.getClienteData();
            $scope.getDocumentosUsados();

            angular.forEach($scope.sucursales, function (value, key) {
                if(value.idSucursal == $scope.selSucursal ){
                    $scope.nomSucursal = value.nombre
                }

            });
            angular.forEach($scope.empresas, function (value, key) {
                if(value.emp_idempresa == idEmpresa ){
                    $scope.nomEmpresa = value.emp_nombre
                }

            });
          
            console.log(' $scope.nomSucursal',  $scope.nomSucursal)
            console.log(' $scope.nomEmpresa',  $scope.nomEmpresa)
        });
    }

    $scope.getDepartamentos = function () {
        devolucionesRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then((res) => {
            $scope.departamentos = res.data;
            $scope.selDepartamento = $scope.dataAprobar[0].id_departamento;
        });
    }

    $scope.getAllFormaPago = function () {
        devolucionesRepository.allFormaPago().then((res) => {
            $scope.formasPago = res.data;
        });
    }

    $scope.getDocumentosAprobar = function (idPerTra) {
        $scope.docTesoreria = [];
        aprobarDevRepository.documentosAprobar(idPerTra).then((res) => {
            $scope.aprobarDocs = res.data;
            angular.forEach($scope.aprobarDocs, (value, key) => {
                if (value.id_documento == 13 || value.id_documento == 4 || value.id_documento == 7) {
                    $scope.docTesoreria.push(value);
                    if( value.estatus === 3 ){
                        $scope.rechazoDeDocs = true;
                    }
                }
            });
            
            var totalDocumentosRechazados = 0
            angular.forEach($scope.aprobarDocs, (value, key)=>{
                if( value.estatus === 3 ){
                    totalDocumentosRechazados += 1;
                }
            });

            if( totalDocumentosRechazados > 0 ){
                $scope.showDocumenosRechazados = false;
            }else{
                $scope.showDocumenosRechazados = true;
            };
        });
        
        if( $scope.user.idRol == 6 || $scope.user.idRol == 8 ||  $scope.user.idRol == 10){
            $scope.getComprobante();
        }
    }

    $scope.getComprobante = () => {
        aprobarDevRepository.imageComprobante(localStorage.getItem('id_perTra'), 4).then((res)=>{
            $scope.documentos = res.data;
        });
    };

    $scope.saveDocumentos = (documento) => {
        $("#loading").modal("show");
        if (documento.archivo != undefined) {
            sendData = {
                idDocumento: documento.id_documento,
                idTramite: documento.id_tramite,
                idPerTra: localStorage.getItem('id_perTra'),
                saveUrl: documento.saveUrl + 'Devoluciones\\' + 'Devolucion_' + localStorage.getItem('id_perTra'),
                idUsuario: $rootScope.user.usu_idusuario,
                extensionArchivo: documento.archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documento.archivo['nombreArchivo'].split('.')[1],
                archivo: documento.archivo['archivo']
            }
            setTimeout(() => {
                devolucionesRepository.saveDocumentos(sendData).then((res) => {
                    if (res.data[0].success == 1) {
                        $scope.getComprobante();
                        swal( 'Listo', ` Se guardo el documento "${ documento.nombreDoc }"`, 'success' );
                        $("#loading").modal("hide");
                    } else {
                        swal( 'Alto', 'Error al guardar el documento, intentelo mas tarde', 'error' );
                        $("#loading").modal("hide");
                    }
                });
            }, 500);
        } else {
            $("#loading").modal("hide");
            swal( 'Alto', `Guarda el documento  "${ documento.nombreDoc }" para poder guardar.`, 'warning' );
        }

    }

    $scope.getActivarAprobarTramite = function () {
        aprobarRepository.activarAprobarTramite(localStorage.getItem('id_perTra')).then(function (res) {
            if (res.data[0].success == 1) {
                $scope.activarAprobar = false;
            } else {
                $scope.activarAprobar = true;
            }
        });
    }

    $scope.verPdf = function (documento) {
        $scope.rechazarDocumentoTesoreria = documento;
        if (documento.estatusDocumento == 3) {
            $scope.verComentarios = true;
            $scope.obervacionesDoc = documento.observaciones;
        } else {
            $scope.verComentarios = false;
        }


        if (documento.id_documento == 13 || documento.id_documento == 4) {

            $scope.docCorrecto = true;
            if(documento.id_documento == 13){
                $scope.esEstadoCuenta = true;
            }else{
                $scope.esEstadoCuenta = false;
            }

            if( documento.estatus == 2 ){
                $scope.disabledValidarCuenta = false;
            }else{
                $scope.disabledValidarCuenta = true;
            }

        } else {
            $scope.docCorrecto = false;
        }
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = documento.nombreDoc;
        var pdf = documento.rutaDocumento;
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $("#mostrarPdf").modal("show");
    }

    $scope.verImagenModal = function (documento) {
        $scope.modalTitle = documento.nombreDoc;
        $scope.verImagen = documento.rutaDocumento;
        $("#mostrarImagen").modal("show");
    }

    $scope.rechazarDocTesoreria = function(){
        $("#mostrarPdf").modal("hide");
        $scope.rechazarDocumento($scope.rechazarDocumentoTesoreria)     
    }

    $scope.rechazarDocumento = function (documento) {
        $scope.sendDetIdPerTra = documento.detIdPerTra;
        $scope.modalTitle = documento.nombreDoc;
        $scope.id_documento = documento.id_documento;
        $("#rechazarDoc").modal("show");
    }

    $scope.aprobarDocumento = function (documento) {
        $("#loading").modal("show");
        aprobarRepository.aprobarDocumento(documento.detIdPerTra, $rootScope.user.usu_idusuario).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                $scope.getDocumentosAprobar($scope.id_perTra);
                $scope.getActivarAprobarTramite();
                swal('Listo', 'Se revisó el documento', 'success');
            } else {
                $("#loading").modal("hide");
                swal('Alto', 'Ocurrio un error al aprobar el documento intentelo mas tarde', 'warning');
            }
        });
    }

    $scope.solicitarDocumento = function(documento){
        $scope.sendDetIdPerTra = documento.detIdPerTra;
        $scope.id_documento = documento.id_documento
        $scope.razonesRechazo = 'Tesoreria requiere que se adjunte el documento.';
        
        swal({
            title: '¿Estas seguro de solicitar el ' + documento.nombreDoc + ' para el trámite?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Solicitar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.sendRechazo();
                } else {
                    swal(
                        'Cancelado',
                        'No se solicito la el ' + documento.nombreDoc,
                        'error'
                    );
                }
            });
    }

    $scope.sendRechazo = function () {
        if ($scope.razonesRechazo == '') {
            swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
        } else {
            $("#rechazarDoc").modal("hide");
            $("#loading").modal("show");
            aprobarRepository.rechazarDocumento($scope.sendDetIdPerTra, $scope.razonesRechazo, $scope.id_perTra, $scope.id_documento, $rootScope.user.usu_idusuario).then((res) => {
                if (res.data[0].success == 1) {
                    $("#loading").modal("hide");
                    $scope.getDocumentosAprobar($scope.id_perTra);
                    $scope.razonesRechazo = '';
                    $scope.sendDetIdPerTra = 0;
                    $scope.getActivarAprobarTramite();
                    swal('Listo', res.data[0].msg, 'success');
                } else {
                    $scope.sendDetIdPerTra = 0;
                    $("#loading").modal("hide");
                    swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
                }
            });
        }
    }

    $scope.cancelRechazo = function () {
        $("#rechazarDoc").modal("hide");
        $scope.razonesRechazo = '';
    }

    $scope.aprobarRechazarTramite = function (estatus) {
        var aproRech = estatus == 2 ? ' Aprobar ' : ' Rechazar '
        swal({
            title: '¿Estas seguro de' + aproRech + 'el trámite?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: estatus == 2 ? 'Aprobar' : 'Rechazar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    if (estatus == 2) {
                        $scope.sendNotificacion();
                    } else {
                        $("#loading").modal("show");
                        aprobarDevRepository.aprobarRechazarTramite(localStorage.getItem('id_perTra'), estatus, $scope.observacionesDelTramite, $rootScope.user.usu_idusuario).then((res) => {
                            if (res.data[0].success == 1) {
                                $scope.getDatas(localStorage.getItem('id_perTra'));
                                $("#loading").modal("hide");
                                estatus == 2 ? swal('Listo', 'Se aprobó con éxito el trámite', 'success') : swal('Listo', 'Se rechazo con éxito el trámite', 'success')
                            } else {
                                $("#loading").modal("hide");
                                estatus == 2 ? swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning') : swal('Alto', 'No se pudo rechazar el trámite intentalo mas tarde', 'warning')
                            }
                        });
                    }
                } else {
                    swal(
                        'Cancelado',
                        'No se cancelo la acción',
                        'error'
                    );
                }
            });
    }

    $scope.aprobarGerente = function () {
        $('#loading').modal('show');
        aprobarDevRepository.updateEstatusSendAutorizar($scope.id_perTra, 1, 2, $rootScope.user.usu_idusuario).then((res) => {
            if (res.data[0].success == 1) {
                $('#loading').modal('hide');
                $scope.sendMailNotificacion();
                swal('Listo', res.data[0].msg, 'success');
                $scope.init();
            } else {
                $('#loading').modal('hide');
                swal('Alto', 'Ocurrio un error intentalo mas tarde.', 'warning');
            }
        });
    }

    $scope.backDashboard = function () {
        if ($rootScope.user.idRol != 8) {
            if( $rootScope.user.idRol != 6 ){
                $location.path('/home');
            }else{
                $location.path('/tesoreriaHome');
            }
        } else {
            $location.path('/tesoreriaHome');
        }
    }

    $scope.openWizard = function () {
        devolucionesRepository.estatusDevoluciones($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusDevolucion = res.data;
                $scope.tiempoTotal = res.data[0].tiempoTotal;
            } else {
                swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
            }
        });
    }

    $scope.sendNotificacion = function () {

        if (($scope.showDatasEfectivo) && ($scope.cuentaActual == '' || $scope.cuentaActual == null || $scope.cuentaActual == undefined ||
            $scope.bancoActual == '' || $scope.bancoActual == null || $scope.bancoActual == undefined || $scope.cveBanxico === '' || $scope.tipoCuenta === '')) {
            setTimeout(() => {
                swal('Alto', 'Los datos bancarios son necesarios', 'warning');
            }, 200);
        } else {
            $("#loading").modal("show");
            if ($scope.dataAprobar[0].traDe_devTotal <= $scope.amountNontificaciones) {
                var tipoNot = 7

            } else {
                var tipoNot = 8

            }


            var notG = {
                "identificador": parseInt(localStorage.getItem('id_perTra')),
                "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la Devolucion para el cliente " +
                    $scope.cliente.nombre + ' ' + $scope.cliente.paterno + ' ' + $scope.cliente.materno + " por la cantidad de $" + $scope.dataAprobar[0].traDe_devTotal.toFixed(2) + " pesos. Empresa: " + $scope.nomEmpresa + " Sucursal: " + $scope.nomSucursal,
                "idSolicitante": $scope.user.usu_idusuario,
                "idTipoNotificacion": tipoNot,
                "linkBPRO": global_settings.urlCORS + "aprobarDev?employee=70&idTramite=" + localStorage.getItem('id_perTra'),
                "notAdjunto": $scope.cliente.nombre + ' ' + $scope.cliente.paterno + ' ' + $scope.cliente.materno,
                "notAdjuntoTipo": "",
                "idEmpresa": $scope.selEmpresa,
                "idSucursal": $scope.selSucursal,
                "departamentoId": 0
            };

            clientesRepository.notGerente(notG).then(function (result) {
                if (result.data[0].success == true) {
                    $scope.not_id = result.data[0].not_id;
                    aprobarDevRepository.updateEstatusAutorizar(
                        localStorage.getItem('id_perTra'),
                        $scope.showDatasEfectivo ? $scope.bancoActual : 0,
                        $scope.showDatasEfectivo ? $scope.cuentaActual : '',
                        $rootScope.user.usu_idusuario
                    ).then((res) => {
                        if (res.data[0].success == 1) {
                            /*** Enviamos el correo de generacion de Notificacion */
                            $scope.sendMailNotificacion(tipoNot == 8 ? 8 : 1, tipoNot);
                            // if( $scope.showDatasEfectivo){
                            if ($scope.showCuentaBancaria) {
                                $scope.sendMailPagos();
                            } else {
                                $scope.getDatas(localStorage.getItem('id_perTra'));
                                $('#loading').modal('hide');
                                swal('Listo', 'Se envió a revisión final', 'success');
                            }
                        } else {
                            swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                        }
                    });
                } else if (result.data[0].result == 2) {
                    aprobarDevRepository.updateEstatusAutorizar(
                        localStorage.getItem('id_perTra'),
                        $scope.showDatasEfectivo ? $scope.bancoActual : 0,
                        $scope.showDatasEfectivo ? $scope.cuentaActual : '',
                        $rootScope.user.usu_idusuario
                    ).then((res) => {
                        if (res.data[0].success == 1) {
                            /*** Enviamos el correo de generacion de Notificacion */
                            $scope.sendMailNotificacion(1, tipoNot);
                            // if( $scope.showDatasEfectivo){
                            if ($scope.showCuentaBancaria) {
                                $scope.sendMailPagos();
                            } else {
                                $scope.getDatas(localStorage.getItem('id_perTra'));
                                $('#loading').modal('hide');
                                swal('Listo', 'Se envió a revisión final', 'success');
                            }
                        } else {
                            swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                        }
                    });
                }
                else {
                    swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                }
            });
        }
    };

    $scope.validarCC = function(){
        $('#loading').modal('show');
        var notG = {
            "identificador": parseInt(localStorage.getItem('id_perTra')),
            "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la aprobación de un CC en el tramite número " + parseInt(localStorage.getItem('id_perTra')) +
                ' para el cliente ' + $scope.cliente.nombre + ' ' + $scope.cliente.paterno + ' ' + $scope.cliente.materno,
            "idSolicitante": $scope.user.usu_idusuario,
            "idTipoNotificacion": 14,
            "linkBPRO": global_settings.urlCORS + "aprobarDev?employee=70&idTramite=" + localStorage.getItem('id_perTra'),
            "notAdjunto": $scope.cliente.nombre + ' ' + $scope.cliente.paterno + ' ' + $scope.cliente.materno,
            "notAdjuntoTipo": "",
            "idEmpresa": $scope.selEmpresa,
            "idSucursal": $scope.selSucursal,
            "departamentoId": 0
        };
        
        clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success) {
                aprobarDevRepository.updEstatusCC(localStorage.getItem('id_perTra')).then((res) => {
                    if (res.data[0].success == 1) {
                        $('#loading').modal('hide');
                        swal( 'Listo', 'Se envio a revisión', 'success' );
                        $scope.getDatas(localStorage.getItem('id_perTra'));

                        $scope.sendMailNotificacion(1,14);

                    } else {
                        swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                    }
                });
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
            }
        });
    }

    $scope.insertTesoreria = function () {
        aprobarDevRepository.insertTesoreria(localStorage.getItem('id_perTra')).then((res) => {
            if (res.data[0].success == 1) {
                if( res.data[0].idInsertado != 1 ){
                    $scope.sendMailPagos();
                }else{
                    $scope.getDatas(localStorage.getItem('id_perTra'));
                    $('#loading').modal('hide');
                    swal('Listo', 'Se envió a revisión final', 'success');
                }
            } else {
                swal("Atencion", "Hubo un error al capturar las cuentas ...", "warning");
            }
        });
    }

    $scope.nuevoDocumentoModal = function () {
        documentosRepository.getExtensiones().then(function (res) {
            if (res.data.length > 0) {
                $scope.extensiones = res.data;
                $scope.nuevoDoc.nombre = '';
                $scope.nuevoDoc.extension = 0;
                $scope.nuevoDoc.porSolicita = '';
                $('#nuevoDocumento').modal('show');
            } else {
                swal('Alto', 'Hubo un error al traer las extensiones', 'warning');
            }
        });
    };

    $scope.cancelNuevoDoc = function () {
        $('#nuevoDocumento').modal('hide');
    };

    $scope.guardarNuevoDoc = function () {
        if ($scope.nuevoDoc.nombre == '' || $scope.nuevoDoc.nombre == undefined || $scope.nuevoDoc.nombre == null
            || $scope.nuevoDoc.extension == 0 || $scope.nuevoDoc.extension == null || $scope.nuevoDoc.extension == undefined
            || $scope.nuevoDoc.porSolicita == '' || $scope.nuevoDoc.porSolicita == null || $scope.nuevoDoc.porSolicita == undefined) {
            swal('Alto', 'Completa los campos', 'warning');
        } else {
            swal({
                title: '¿Estás seguro de guardar el documento?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $('#nuevoDocumento').modal('hide');
                        $("#loading").modal("show");
                        aprobarDevRepository.saveDocsTramiteEnProceso(
                            $scope.id_perTra,
                            $scope.nuevoDoc.nombre,
                            $scope.nuevoDoc.extension,
                            $rootScope.user.usu_idusuario,
                            4,
                            $scope.nuevoDoc.porSolicita
                        ).then(function (res) {
                            if (res.data[0].success == 1) {
                                $scope.init();
                                $("#loading").modal("hide");
                                swal('Listo', res.data[0].msg, 'success');
                            } else {
                                swal('Alto', 'No se pudo agregar el documento al trámite, intentelo mas tarde', 'warning');
                            }
                        });
                    } else {
                        swal(
                            'Cancelado',
                            'No se guardo el documento',
                            'error'
                        );
                    }
                });
        }
    };

    $scope.validarCuentaBancaria = function(){
        if( $scope.cuentaBancaria == '' || $scope.cuentaBancaria == undefined || $scope.cuentaBancaria == null ){
            swal( 'Alto', 'No se tiene la cuenta bancaria... intentalo mas tarde', 'warning' );
        }else{
            $('#mostrarPdf').modal('hide');
            $('#loading').modal('show');
            aprobarDevRepository.validaCuentaBancaria($scope.cuentaBancaria, '').then((res)=>{
                if( res.data[0].estatus == 1 ){
                    $scope.insertCuentaBancario();
                }else if( res.data[0].estatus == 0 ){
                    $scope.getActualizaEstatusMixto(1);
                }else{
                    $('#loading').modal('hide');
                    swal('Alto', 'Ocurrio un error', 'error')
                }
            });
        }
    };

    $scope.insertCuentaBancario = function(){
        aprobarDevRepository.insCuentaBancaria($rootScope.user.usu_idusuario, $scope.id_perTra).then((res)=>{
            if( res.data[0].result == 1 ){
                $scope.getActualizaEstatusMixto(1);
            }else{
                swal( 'Atencion', 'No se pudo capturar la cuenta bancaria', 'warning' );
            }
        });
    }

    $scope.getActualizaEstatusMixto = function (opcion) {
        $('#loading').modal('show');
        aprobarDevRepository.getActualizaEstatusMixto(opcion, $scope.id_perTra).then(function (res) {
            if (res.data[0].success == 1) {
                swal('Listo', 'Se proceso la solicitud', 'success');
                $scope.getDatas($scope.id_perTra);
                $('#loading').modal('hide');
            }else{
                swal('Alto', 'Error al procesar la solicitud', 'error');
                $scope.getDatas($scope.id_perTra);
                $('#loading').modal('hide');
            }
        });
    }


    //=========================== SECCION PARA FUNCIONAMIENTO DE MODAL DE ORDEN DE PAGO ========================================
    $scope.openModalPO = function () {
        $('#loading').modal('show');
        $scope.initPO();
        
    }

    $scope.cancelOrdenPago = function () {
        $('#loading').modal('hide');
        $("#ordenPago").modal('hide');
    }

    $scope.initPO = function () {
        $scope.id_perTra = localStorage.getItem('id_perTra')
        if($scope.tipoTramite === 3){
            $scope.getDataOrdenPago();
        }
        $scope.today = new Date();

        var dd = $scope.today.getDate();
        var mm = $scope.today.getMonth() + 1;
        var yyyy = $scope.today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        $scope.today = mm + '/' + dd + '/' + yyyy;
    }

    $scope.getDataOrdenPago = function () {
      
        ordenDePagoRepository.getDataOrdenPagoMixto($scope.id_perTra).then((res) => {
            console.log( 'res', res );
            $scope.cuenta = res.data[0].efectivoCuenta;
            $scope.monto = res.data[0].traDe_devTotal;
            $scope.idEmpresa = res.data[0].id_empresa;
            $scope.idBanco = res.data[0].efectivoBanco;
            $scope.idSucursal = res.data[0].id_sucursal;
            $scope.idCliente = res.data[0].PER_IDPERSONA;
            $scope.estatus = res.data[0].estatus;
            $scope.showOrdenPagoBtn = res.data[0].e_efectivo;
            if ($scope.tipoTramite == 3 || $scope.tipoTramite == 1) {
                $scope.getNombreBanco();
                $scope.getDataCliente();
                $scope.getReference();
            }
        });
    };

    $scope.getNombreBanco = function () {
        ordenDePagoRepository.nombreBanco($scope.idBanco, $scope.idEmpresa, $scope.idSucursal).then((res) => {
            $scope.bancoNombre = res.data[0][0].BancoNombre;
            $scope.titularCuenta = res.data[1][0].emp_nombre;
            $scope.nombreSucursal = res.data[2][0].nombre_sucursal;
        });
    };

    $scope.getDataCliente = function () {
        ordenDePagoRepository.getNombreCliente($scope.idCliente, $scope.idEmpresa, $scope.idSucursal).then((res) => {
            $scope.nombreCliente = res.data[0][0].nombre + ' ' + res.data[0][0].paterno + ' ' + res.data[0][0].materno;
        });
    }

    $scope.getReference = function () {
        ordenDePagoRepository.getObtenerReferencia($scope.id_perTra).then((res) => {
            if (res.data[0].estatus == 1) {
                  $scope.referencia = res.data[0].referencia;
              
                $('#loading').modal('hide');
                $("#ordenPago").modal('show');
            } else {
                $('#loading').modal('hide');
                swal('Advertencia', 'Ocurrio un error al generar la referencia', 'warning');
                
                
            }
        });
        // var documento = '';
        // var idDepartamento = 0;
        // ordenDePagoRepository.getCountDocs($scope.id_perTra, $scope.idEmpresa, $scope.idSucursal).then((res) => {
        //     if (res.data[0][0].totalDocs == 1) {
               
        //         documento = res.data[1][0].docDe_documento;
        //         ordenDePagoRepository.getIdDepartamento(
        //             res.data[1][0].CCP_CARTERA,
        //             $scope.idEmpresa,
        //             $scope.idSucursal)
        //             .then((res) => {
        //                 idDepartamento = res.data[0][0].idDepartamento;

        //                 var dataReferencia = {
        //                     idEmpresa: $scope.idEmpresa,
        //                     idSucursal: $scope.idSucursal,
        //                     idDepartamento: idDepartamento,
        //                     idTipoDocumento: 1,
        //                     serie: documento.substring(0, 2),
        //                     folio: documento.substring(2, documento.length),
        //                     idCliente: $scope.idCliente,
        //                     idAlma: 0,
        //                     importeDocumento: $scope.monto.toFixed(2),
        //                     idTipoReferencia: 1
        //                 }
        //                 $scope.consumirReferencias(dataReferencia);
        //             });
        //     } else {
                
        //         $scope.variosDocs();
        //     }
        // });
    };

    $scope.consumirReferencias = function (dataReferencia) {
        ordenDePagoRepository.getReference(dataReferencia).then((res) => {
            if (res.data.idReferencia > 0) {
                $scope.referencia = res.data.REFERENCIA;
                $('#loading').modal('hide');
                $("#ordenPago").modal('show');
            } else {
                swal('Advertencia', 'Ocurrio un error al generar el PDF', 'warning');
            }
        });
    }

    $scope.variosDocs = function () {
        var documento = '';
        var idDepartamento = 0;
        var allDocumentos = [];
        ordenDePagoRepository.allDocsByIdPerTra($scope.id_perTra, $scope.idEmpresa, $scope.idSucursal).then((res) => {
            if (res.data.length > 0) {
                documento = res.data[0].docDe_documento;
                allDocumentos = res.data;

                ordenDePagoRepository.getIdDepartamento(
                    res.data[0].CCP_CARTERA,
                    $scope.idEmpresa,
                    $scope.idSucursal)
                    .then((res) => {
                        if (res.data.length > 0) {
                            idDepartamento = res.data[0][0].idDepartamento;
                            var dataReferencia = {
                                idEmpresa: $scope.idEmpresa,
                                idSucursal: $scope.idSucursal,
                                idDepartamento: idDepartamento,
                                idTipoDocumento: 1,
                                serie: documento.substring(0, 2),
                                folio: documento.substring(2, documento.length),
                                idCliente: $scope.idCliente,
                                idAlma: 0,
                                importeDocumento: $scope.monto.toFixed(2),
                                idTipoReferencia: 2
                            }
                            $scope.referenceVariosInsertN0(dataReferencia, allDocumentos);
                        } else {
                            swal('Alto', 'Error al crear la referencia', 'warning');
                        }
                    });
            } else {
                swal('Alto', 'Error al crear la referencia', 'warning');
            }
        });
    };

    $scope.referenceVariosInsertN0 = function (dataReferencia, allDocumentos) {
        ordenDePagoRepository.getReference(dataReferencia).then((res) => {
            if (res.data.idReferencia > 0) {
                $scope.referenceVariosInsertAll(allDocumentos, 0, res.data.idReferencia, res.data.REFERENCIA);
            } else {
                swal('Advertencia', 'Ocurrio un error al generar el PDF', 'warning');
            }
        });
    };

    $scope.referenceVariosInsertAll = function (allDocumentos, aux, idReferencia, referencias) {
        if (aux <= allDocumentos.length - 1) {
            ordenDePagoRepository.getIdDepartamento(
                allDocumentos[aux].CCP_CARTERA,
                $scope.idEmpresa,
                $scope.idSucursal)
                .then((res) => {
                    if (res.data.length > 0) {
                        idDepartamento = res.data[0][0].idDepartamento;
                        var dataReferencia = {
                            idReferencia: idReferencia,
                            idSucursal: $scope.idSucursal,
                            idDepartamento: idDepartamento,
                            idTipoDocumento: 1,
                            serie: allDocumentos[aux].docDe_documento.substring(0, 2),
                            folio: allDocumentos[aux].docDe_documento.substring(2, allDocumentos[aux].docDe_documento.length),
                            idCliente: $scope.idCliente,
                            // idEmpresa: $scope.idEmpresa,
                            idAlma: 0,
                            importeDocumento: $scope.monto.toFixed()
                            // idTipoReferencia: 1
                        }
                        ordenDePagoRepository.addDetailsReference(dataReferencia).then((res) => {
                            if (res.data.length > 0) {
                                $scope.referenceVariosInsertAll(allDocumentos, aux + 1, idReferencia, referencias);
                            }
                        });
                        $('#loading').modal('hide');
                        $("#ordenPago").modal('show');
                    } else {
                        swal('Alto', 'Error al crear la referencia', 'warning');
                    }
                });
        } else {
            $scope.referencia = referencias;
        
        }
    }

    $scope.changeEstatus = function () {
        //$('#loading').modal('show');
        $scope.getActualizaEstatusMixto(2);
        $scope.cancelOrdenPago();
    };

    //========================= FIN SECCION PARA FUNCIONAMIENTO DE MODAL DE ORDEN DE PAGO ========================================


    /**
     * @description Envia correo dependiendo del tipo
     * @param {number} tipoCorreo 0 por default envia correos de generacion de tramite, 1 envia correo de generacion Notificaciones
     * @param {number} tipoNot tipo de notificaccion del cual se obtendra el correo
     */
    $scope.sendMailNotificacion = function(tipoCorreo =  0, tipoNot = 0){

        var html='';

        if ( tipoCorreo === 0 ) {

            var data= {
                idTramite: 0,  
                idRol: 0,  
                idEmpresa: 0,
                idSucursal: 0
            }

            data.idTramite= $scope.dataAprobar[0].id_tramite;
            data.idRol = $rootScope.user.idRol;
            data.idEmpresa = $scope.selEmpresa;

        

            devolucionesRepository.getObtieneCorreoRol(data).then((resp)=>{
                if(resp.data[0].success === 1){

                    var html = "<div style=\"width:310px;height:140px\">" + 
                                    "<center>" + 
                                        "<img style=\"width: 80% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" + 
                                    "</center>" + 
                                "</div>" +
                                "<div>" + 
                                    "<p>" + 
                                        `El trámite número ${$scope.id_perTra} para el cliente ${$scope.cliente.paterno} ${$scope.cliente.materno} ${$scope.cliente.nombre} debe ser revisado y aprobado por alguna de las siguientes personas ${resp.data[0].nombreUsuarioMail}  para poder continuar con el proceso` + 
                                    "</p>" +
                                "</div>";


                    devolucionesRepository.sendMailCliente(resp.data[0].email, "Revisión de trámite", html).then((res)=>{
                        if( res.data.response.success == 1 ){
                            $('#loading').modal('hide');
                        }else{
                            swal( 'Alto', res.data.response.msg, 'warning' );
                            $('#loading').modal('hide');
                        }
                    });
                }
            });
        } else if (tipoCorreo == 8){
            aprobarDevRepository.obtieneCorreosComite($scope.not_id, global_settings.urlApiNoty,$scope.id_perTra ).then((resp) => {
               
                console.log("Resp", resp)
                
              
            });

        }else{
            aprobarDevRepository.getCorreoNotificacion(tipoNot).then((resp) => {
                
                if(resp.data[0].success === 1){
                    
                    html = "<div style=\"width:310px;height:140px\">" + 
                                    "<center>" + 
                                        "<img style=\"width: 80% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" + 
                                    "</center>" + 
                                "</div>" +
                                "<div>" + 
                                    "<p>" + 
                                        `Se le ha asignado una notificación con numero ${$scope.id_perTra} para el cliente ${$scope.cliente.paterno} ${$scope.cliente.materno} ${$scope.cliente.nombre} debe ser revisado y aprobado por usted ${resp.data[0].nombreUsuarioMail}  para poder continuar con el proceso` + 
                                    "</p>" +
                                "</div>";

                    devolucionesRepository.sendMailCliente(resp.data[0].email, "Asignacion de notificación", html).then((res)=>{
                        if( res.data.response.success == 1 ){
                            $('#loading').modal('hide');
                        }else{
                            swal( 'Alto', res.data.response.msg, 'warning' );
                            $('#loading').modal('hide');
                        }
                    });

                }
            });
        }
    }

    $scope.sendMailPagos = function(){
        aprobarDevRepository.correosPagos().then((res)=>{
            if( res.data[0].success == 1 ){
                var html = "<div style=\"width:310px;height:140px\">" + 
                                    "<center>" + 
                                        "<img style=\"width: 80% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" + 
                                    "</center>" + 
                                "</div>" +
                                "<div>" + 
                                    "<p>" + 
                                        `Estimados ${res.data[0].nombreUsuarioMail} para el tramite numero ${$scope.id_perTra} del cliente ${$scope.cliente.paterno} ${$scope.cliente.materno} ${$scope.cliente.nombre} de devoluciones se requerira la creacion de un lote de pago.` + 
                                    "</p>" +
                                "</div>";
                devolucionesRepository.sendMailCliente(res.data[0].email, "Alerta de creacion de lote", html).then((res)=>{
                    if( res.data.response.success == 1 ){
                        $scope.getDatas(localStorage.getItem('id_perTra'));
                        $('#loading').modal('hide');
                        swal('Listo', 'Se envió a revisión final', 'success');
                    }else{
                        $scope.getDatas(localStorage.getItem('id_perTra'));
                        swal( 'Alto', 'Se autorizo el tramite correctamente pero ' + res.data.response.msg, 'warning' );
                        $('#loading').modal('hide');
                    }
                });
            }else{
                $scope.getDatas(localStorage.getItem('id_perTra'));
                swal( 'Warning', 'Se autorizo el tramite correctamente... el correo no se envió a pagos', 'warning' );
                $('#loading').modal('hide');
            };
        })
    }
    $scope.verComprobanteTransferencia = function() {
        aprobarDevRepository.documentoTransferencia($scope.id_perTra).then(function success(result) {
            console.log(result.data[0].dpa_iddocumento, 'El documento pagado')
            aprobarDevRepository.pdfArray(result.data[0].dpa_iddocumento).then(function success(result) {
                console.log(result)
                $scope.pdf = [];
                $scope.arregloBytes = result.data.arrayBits.base64Binary;
                angular.forEach($scope.arregloBytes, function(value, key) {
                    var consecutivo = key + 1;
                    $scope.pdf.push({
                        urlPdf: URL.createObjectURL(utils.b64toBlob(value, "application/pdf")),
                        id: key + 1
                    });

                });
                $('#transferenciaBancaria object').remove();
                var pdf =  $scope.pdf[0].urlPdf;
                $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#transferenciaBancaria');
                $("#modalTransferencia").modal("show");
            }, function error(err) {
                console.log('Ocurrio un error ')
            });
        }, function error(err) {
            console.log('Ocurrio un error ')
        });
        // aprobarDevRepository.getPdfArray()
    };

    var getMotivoDevolucion = function (idMotivo){
        devolucionesRepository.motivoDevolucion().then((res)=>{
            $scope.motivoDevolucionLst = res.data;
            $scope.motivoDevolucionLst.idMotivo = idMotivo;


        });
    }

});