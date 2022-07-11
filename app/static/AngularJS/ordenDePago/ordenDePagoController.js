registrationModule.controller('ordenDePagoController', function ($scope, $rootScope, $location, localStorageService, ordenDePagoRepository, aprobarDevRepository, aprobarRepository, devolucionesRepository) {

    $scope.referencia = '';
    $scope.idPerTra = 0;
    $scope.cuenta = '';
    $scope.monto = 0;
    $scope.idEmpresa = 0;
    $scope.idBanco = 0;
    $scope.idSucursal = 0;
    $scope.idCliente = 0;
    $scope.bancoNombre = '';
    $scope.titularCuenta = '';
    $scope.nombreCliente = '';
    $scope.nombreSucursal = '';
    $scope.estatus = 0;
    $scope.docTesoreria = [];
    $scope.rechazoDeDocs = false;
    $scope.rechazarDocumentoTesoreria;
    $scope.showRechazar = false;
    $scope.documentos = []

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.idPerTra = localStorage.getItem('id_perTra');
        $scope.getDataOrdenPago();
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
        $scope.today = dd + '/' + mm + '/' + yyyy;

    };

    $scope.getDataOrdenPago = function () {
        ordenDePagoRepository.getDataOrdenPago($scope.idPerTra).then((res) => {
            $scope.cuenta = res.data[0].efectivoCuenta;
            $scope.monto = res.data[0].traDe_devTotal;
            $scope.idEmpresa = res.data[0].id_empresa;
            $scope.idBanco = res.data[0].efectivoBanco;
            $scope.idSucursal = res.data[0].id_sucursal;
            $scope.idCliente = res.data[0].PER_IDPERSONA;
            $scope.estatus = res.data[0].estatus;

            $scope.getNombreBanco();
            $scope.getDataCliente();
            $scope.getReference();
            $scope.getDocumentosAprobar();
            $scope.getComprobante();
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
        $('#loading').modal('show');
        ordenDePagoRepository.getObtenerReferencia($scope.idPerTra).then((res) => {
            if (res.data[0].estatus == 1) {
                  $scope.referencia = res.data[0].referencia;
                $('#loading').modal('hide');
            } else {
                $('#loading').modal('hide');
                swal('Advertencia', 'Ocurrio un error al generar la referencia', 'warning');
                
                
            }
        });


        // ordenDePagoRepository.getCountDocs($scope.idPerTra, $scope.idEmpresa, $scope.idSucursal).then((res) => {
        //     if (res.data[0][0].totalDocs == 1) {
        //         $('#loading').modal('show');
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
        //         $('#loading').modal('show');
        //         $scope.variosDocs();
        //     }
        // });
    };

    $scope.consumirReferencias = function (dataReferencia) {
        ordenDePagoRepository.getReference(dataReferencia).then((res) => {
            if (res.data.idReferencia > 0) {
                $scope.referencia = res.data.REFERENCIA;
                $('#loading').modal('hide');
            } else {
                swal('Advertencia', 'Ocurrio un error al generar el PDF', 'warning');
            }
        });
    }

    $scope.variosDocs = function () {
        var documento = '';
        var idDepartamento = 0;
        var allDocumentos = [];
        ordenDePagoRepository.allDocsByIdPerTra($scope.idPerTra, $scope.idEmpresa, $scope.idSucursal).then((res) => {
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

    $scope.getDocumentosAprobar = function () {
        $scope.docTesoreria = [];
        aprobarDevRepository.documentosAprobar($scope.idPerTra).then((res) => {
            angular.forEach(res.data, (value, key) => {
                if (value.id_documento == 4 || value.id_documento == 7) {
                    $scope.docTesoreria.push(value);
                    if( value.estatus === 3 ){
                        $scope.rechazoDeDocs = true;
                    }
                }
            });
        });
    };

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
                        ordenDePagoRepository.addDetailsReference(dataReferencia).then((res)=>{
                            if( res.data.length > 0 ){
                                $scope.referenceVariosInsertAll(allDocumentos, aux + 1, idReferencia, referencias);
                            }
                        });
                    } else {
                        swal('Alto', 'Error al crear la referencia', 'warning');
                    }
                });
        } else {
            $scope.referencia = referencias;
            $('#loading').modal('hide');
        }
    }

    $scope.changeEstatus = function(){
        $('#loading').modal('show');
        ordenDePagoRepository.changeEstatus($scope.idPerTra).then((res)=>{
            if( res.data[0].success == 1 ){
               
                swal( 'Listo', 'Se compró la orden de pago', 'success' );
                $scope.getDataOrdenPago();
                $('#loading').modal('hide');
            }else{
              
                swal( 'Alto', 'Error al comprar la orden de pago', 'error' );
                $scope.getDataOrdenPago();
                $('#loading').modal('hide');
            };
        });
    };

    $scope.goHome = function(){
        $location.path('/tesoreriaHome');
    }

    $scope.verPdf = function (documento) {
        if( documento.id_documento == 4 ){
            $scope.showRechazar = true;
        }
        $scope.rechazarDocumentoTesoreria = documento;
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = documento.nombreDoc;
        var pdf = documento.rutaDocumento;
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $("#mostrarPdf").modal("show");
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
    };

    $scope.cancelRechazo = function () {
        $("#rechazarDoc").modal("hide");
        $scope.razonesRechazo = '';
    }

    $scope.sendRechazo = function () {
        if ($scope.razonesRechazo == '') {
            swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
        } else {
            $("#rechazarDoc").modal("hide");
            $("#loading").modal("show");
            aprobarRepository.rechazarDocumento($scope.sendDetIdPerTra, $scope.razonesRechazo, $scope.idPerTra, $scope.id_documento, $rootScope.user.usu_idusuario).then((res) => {
                if (res.data[0].success == 1) {
                    $("#loading").modal("hide");
                    $scope.getDocumentosAprobar();
                    $scope.razonesRechazo = '';
                    $scope.sendDetIdPerTra = 0;
                    swal('Listo', res.data[0].msg, 'success');
                } else {
                    $scope.sendDetIdPerTra = 0;
                    $("#loading").modal("hide");
                    swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
                }
            });
        }
    }

});