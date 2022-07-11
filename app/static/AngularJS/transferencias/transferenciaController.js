registrationModule.controller('transferenciaController', function ($scope, $rootScope, $location, localStorageService, transferenciaRepository, devolucionesRepository) {

    $scope.dataAprobar = [];
    $scope.empresas = [{
        emp_idempresa: 4,
        emp_nombre: 'Zaragoza Motriz'
    }];
    $scope.nombreEstatus = '';
    $scope.traEstatus = 0;
    $scope.selEmpresa = 4;
    $scope.sucursales = 0;
    $scope.selFormaPago = 0;
    $scope.selDepartamento = 0;
    $scope.aprobarDocs = [];
    $scope.verPdfDocumento = '';
    $scope.modalTitle = '';
    $scope.verImagen = '';
    $scope.razonesRechazo = '';
    $scope.activarAprobar = false;
    $scope.observacionesTramite = '';
    $scope.observacionesDelTramite = ''
    $scope.idCliente = 0;
    $scope.documentosUsados = [];
    $scope.cliente = [];
    $scope.titleAprobar = '';
    $scope.todayDate;
    $scope.estatusDevolucion = 0;
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

    $scope.datosTransferencia = {};
    $scope.fileArray = [];
    $scope.activarRechazo = false;
    $scope.selTramite = 11

    $scope.init = () => {
        $scope.id_perTra = localStorage.getItem('id_perTra');
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.cuentaOrigen = transferenciaRepository.obtieneDatosTransferencia($scope.id_perTra).then(resp => {
            $scope.datosTransferencia = resp.data[0];
            console.log($scope.datosTransferencia)
            $scope.datosTransferencia.fechaSolicita = $scope.datosTransferencia.fechaSolicita.replace('Z','');
            $scope.datosTransferencia.fechaAtencion = $scope.datosTransferencia.fechaAtencion.replace('Z','');
            $scope.datosTransferencia.fechaAutorizadaRechazada = $scope.datosTransferencia.fechaAutorizadaRechazada.replace('Z','');

            $scope.estatusDevolucion = $scope.datosTransferencia.esDe_IdEstatus;
            $scope.activarAprobar = $scope.datosTransferencia.esDe_IdEstatus === 1 ? false : true;
            $scope.activarRechazo = $scope.datosTransferencia.esDe_IdEstatus === 3 ? true : false;
            $scope.observacionesTramite =  $scope.datosTransferencia.observaciones

            $scope.openWizard();

            if ($scope.datosTransferencia.esDe_IdEstatus > 1) {
                $scope.loadDocument();
            }
            else {
                $scope.getDocumentosByTramite();
            }
        })
    }

    $scope.backDashboard = function () {
        if ($rootScope.user.idRol != 8) {
            if ($rootScope.user.idRol != 6) {
                $location.path('/home');
            } else {
                $location.path('/tesoreriaHome');
            }
        } else {
            $location.path('/tesoreriaHome');
        }
    }

    $scope.openWizard = function () {
        var newListStatus = [];
        transferenciaRepository.obtieneEstatusTramites().then((res) => {
            console.log(res.data)
            if (res.data.length > 0) {
                $scope.allEstatusDevolucion = res.data;
                if ($scope.estatusDevolucion > 1) {
                    var estatusActual = $scope.allEstatusDevolucion.filter(x => x.idEstatus === $scope.datosTransferencia.esDe_IdEstatus)[0];
                    for (var i = 0; i < 2; i++) {
                        newListStatus.push($scope.allEstatusDevolucion[i]);
                    }
                    newListStatus.push(estatusActual);
                    $scope.allEstatusDevolucion = [];
                    $scope.allEstatusDevolucion = [...newListStatus];
                }
            } else {
                swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
            }
        });
    }

    $scope.aprobarTramite = function () {

        var docsCompleto = 0
        angular.forEach($scope.documentos, (value, key) => {
            if (value.opcional == false && value.archivo == undefined)
                docsCompleto += 1;
        });

        if (docsCompleto > 0) {
            swal('Alto', 'Para aprobar el trámite debes adjuntar todos los documentos', 'warning');
        }
        else {
            transferenciaRepository.aprobarRechazarTramite($scope.id_perTra, 2, $scope.observacionesTramite).then((res) => {

                $scope.saveDocumentosTramite($scope.id_perTra, res.data[0].ruta, 0, $scope.documentos)
                $scope.sendMailNotificacion(2);
                $scope.backDashboard();
            })
        }

    }

    $scope.rechazarTramite = function () {
        transferenciaRepository.aprobarRechazarTramite($scope.id_perTra, 3, $scope.observacionesTramite).then((res) => {
            $scope.sendMailNotificacion(3);
            console.log(res);
            $scope.backDashboard();
        })
    }

    $scope.getDocumentosByTramite = function () {
        $scope.documentos = [];
        devolucionesRepository.documentosByTramite($scope.selTramite).then((res) => {
            $scope.documentos = res.data;
        });
    }

    $scope.saveDocumentosTramite = function (idPertra, saveUrl, contDocs, documentos) {
        var sendData = {};

        if (contDocs <= documentos.length - 1) {

            if (documentos[contDocs].hasOwnProperty('archivo')) {
                sendData = {
                    idDocumento: documentos[contDocs].id_documento,
                    idTramite: documentos[contDocs].id_tramite,
                    idPerTra: idPertra,
                    saveUrl: saveUrl + 'Transferencia_' + idPertra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                    archivo: documentos[contDocs].archivo['archivo']
                }

                transferenciaRepository.saveDocumentos(sendData).then((res) => {
                    if (res.data[0].success == 1) {
                        console.log(res.data[0]);
                        // $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos);
                    }
                    // else {
                    //     $scope.errDocs += 1;
                    //     $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos);
                    // }
                });
            } else { $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos); }

        } else {
            $scope.saveDocumentosSeleccionados(idPertra);
        }

    };


    $scope.loadDocument = function () {
        $scope.documentos = [];
        transferenciaRepository.loadDocument(
            $scope.id_perTra,
            $scope.selTramite)
            .then((res) => {
                $scope.documentos = res.data;
            });
    }

    $scope.verPdf = function (documento) {
        
        if (documento.estatusDocumento == 3) {
            $scope.verComentarios = true;
            $scope.obervacionesDoc = documento.Observaciones;
        } else {
            $scope.verComentarios = false;
        }
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = documento.doc_nomDocumento;
        var pdf = documento.url;
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $('#mostrarPdf').insertAfter($('body'));
        $("#mostrarPdf").modal("show");

    }

    /**
     *opcion: 1: revisada, 2: aprobada, 3: rechada
     */
    $scope.sendMailNotificacion = function (opcion, url) {

        var tipo='';
        var fecha = new Date().toLocaleDateString("es-MX");
        var observaciones = $scope.observacionesTramite === undefined ? '' : $scope.observacionesTramite;
        var importe = $scope.formatMoney($scope.datosTransferencia.importe,2)

        if(opcion === 1){
            tipo = 'revisada';
        }
        else if(opcion === 2){
            tipo= 'aprobada';
        }
        else{
            tipo = 'rechazada'
        }
                var html = `
                <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                <div>
                    <p>La solicitud del transferencia bancaria ha sido ${tipo}</p>
                    <table>
                        <tbody>
                            <tr>
                                <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                            </tr>
                            <tr>
                            <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de Tramite:</span></td>
                                <td>${$scope.datosTransferencia.idtransferencia}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de Transferencia:</span></td>
                                <td>${$scope.id_perTra}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                <td>${$scope.datosTransferencia.nomEmpresa}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Origen:</span></td>
                                <td>${$scope.datosTransferencia.bancoOrigen} - ${$scope.datosTransferencia.cuentaOrigen}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                                <td>${$scope.datosTransferencia.bancoDestino} - ${$scope.datosTransferencia.cuentaDestino}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                <td>${$scope.datosTransferencia.nombreSolicitante}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                                <td>${importe}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Fecha y Hora Autorizada:</span></td>
                                <td>${fecha}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Observaciones:</span></td>
                                <td>${observaciones}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `


                devolucionesRepository.sendMailCliente('roberto.almanza@coalmx.com', "Tramite de Transferencia", html).then((res) => {
                    if (res.data.response.success == 1) {
                        $('#loading').modal('hide');
                    } else {
                        swal('Alto', res.data.response.msg, 'warning');
                        $('#loading').modal('hide');
                    }
                });
            
        
    }

    $scope.formatMoney= function (amount, decimalCount = 2, decimal = ".", thousands = ",") {
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