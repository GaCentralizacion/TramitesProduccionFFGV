registrationModule.controller('traspasosFondoFijoController', function ($scope, $rootScope, $location, localStorageService, traspasosFondoFijoRepository, devolucionesRepository, aprobarFondoRepository, fondoFijoRepository, anticipoGastoRepository, rx, ordenDePagoFFAGRepository,ordenDePagoFFAGRepository,apiBproRepository) {

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
    $scope.selTipoSalida = 0;
    $scope.idPerTraSolicitante = 0,
    $scope.consecutivo = 0;
    $scope.idTramiteSolicitud = 0;
    $scope.archivoCargado = true;
    $scope.documentos = []
    $scope.complementoPolizas = '';
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";

    $scope.init = () => {
        $scope.id_perTra = localStorage.getItem('id_perTra');
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        

        // var observaArchivo = rx.Observable.interval(2000);
        // observaArchivo.subscribe(resp => {

        //     if ($scope.documentos.length > 0) {
        //         if (($scope.documentos[0].archivo !== undefined && $scope.documentos[0].archivo !== '') && $scope.archivoCargado === true) {
        //             var documentos
        //             console.log('documento.archivo: ', $scope.documentos[0].archivo)
        //             $scope.documentos[0].existe = 1
        //             $scope.documentos[0].idExtension = 2
        //             $scope.archivoCargado = false;
        //             // documentos = [...$scope.documentos]
        //             // $scope.documentos = []
        //             // $scope.documentos = documentos
        //         }
        //     }
        // })

        $scope.cuentaOrigen = traspasosFondoFijoRepository.obtieneDatosTransferencia($scope.id_perTra).then(resp => {
            $scope.datosTransferencia = resp.data[0];
            console.log($scope.datosTransferencia)
            $scope.datosTransferencia.fechaSolicita = $scope.datosTransferencia.fechaSolicita.replace('Z','');
            $scope.datosTransferencia.fechaAtencion =   $scope.datosTransferencia.fechaAtencion.replace('Z','');
            $scope.datosTransferencia.fechaAutorizadaRechazada =  $scope.datosTransferencia.fechaAutorizadaRechazada.replace('Z','');
            $scope.selTipoSalida = $scope.datosTransferencia.tiposalida;
            $scope.idPerTraSolicitante = $scope.datosTransferencia.idPerTraSolicitante;
            $scope.consecutivo = $scope.datosTransferencia.consecutivo
            $scope.idTramiteSolicitud = $scope.datosTransferencia.idTramiteSolicitud

            $scope.estatusDevolucion = $scope.datosTransferencia.esDe_IdEstatus;
            $scope.activarAprobar = $scope.datosTransferencia.esDe_IdEstatus === 1 ? false : true;
            $scope.activarRechazo = $scope.datosTransferencia.esDe_IdEstatus === 3 ? true : false;
            $scope.observacionesTramite =  $scope.datosTransferencia.observaciones
            if($scope.idTramiteSolicitud == 9)
            {
                if($scope.selTipoSalida == 0)
                {
                    $scope.getPolizaCajaGV();
                }
                else
                {
                    $scope.getPolizaTranferenciaGV();
                }
            }
            else
            {
             $scope.getPolizaCaja();
            }
            

            if ($scope.datosTransferencia.esDe_IdEstatus > 1) {
                $scope.loadDocument();
            }
            else {
                $scope.getDocumentosByTramite();
                $scope.updateTramite($scope.id_perTra,1,1);
                if( $scope.idTramiteSolicitud === 9){
                getDocumentosGV()
                }
            }

            console.log("$scope.datosTransferencia.EsGDM", $scope.datosTransferencia.EsGDM);
            try{
                if( $scope.datosTransferencia.EsGDM == 1 ){
                    traspasosFondoFijoRepository.DatosPoliza( $scope.id_perTra ).then( (res)=>{
                        console.log("DatosPoliza", res.data[0]);
                        var solicitudes = res.data;

                        $scope.paramsPolizaCGFN = {
                            idusuario: solicitudes[0].idusuario,
                            idsucursal: solicitudes[0].idsucursal,
                            tipoProceso: 21,
                            documentoOrigen: solicitudes[0].idComprobacionConcepto,
                            ventaUnitario: solicitudes[0].monto,
                            tipoProducto: '',
                            canal: solicitudes[0].canal,
                            id_perTra: 0,
                            banco: '',
                            departamento: ''
                        }

                        console.log("$scope.paramsPolizaCGFN", $scope.paramsPolizaCGFN);
                    });
                }
            }
            catch(e){
                console.log("Error EsGDM", e);
            }

            $scope.openWizard();
        })
    }


    $scope.getPolizaCaja = function () {
        aprobarFondoRepository.infoPolizaCaja($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.id_perTraFF = res.data[0].id_perTraFF;
                $scope.polizaCaja = res.data[0];
                $scope.polizaCaja.bancoE = zeroDelete($scope.polizaCaja.cuentaContableEntrada);
                $scope.polizaCaja.CCDepto = zeroDelete($scope.polizaCaja.cuentaContable);
                $scope.polizaCaja.bancoS = zeroDelete($scope.polizaCaja.cuentaContableSalida);
                //$scope.obtieneEvidenciasReembolso();
                $scope.id_perTraReembolso = res.data[0].id_perTraReembolso
                $scope.complementoPolizas = res.data[0].complementoPoliza;
                $scope.obtieneEvidenciasReembolsoTramite();
            } 
        });
    }

    $scope.getPolizaCajaGV = function () {
        traspasosFondoFijoRepository.infoPolizaCajaGV($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.polizaCaja = res.data[0];
                $scope.polizaCaja.bancoE = zeroDelete($scope.polizaCaja.cuentaContableEntrada);
                $scope.polizaCaja.CCDepto = zeroDelete($scope.polizaCaja.cuentaContable);
                $scope.polizaCaja.bancoS = zeroDelete($scope.polizaCaja.cuentaContableSalida);
            } 
        });
    }

    
    $scope.getPolizaTranferenciaGV = function () {
    ordenDePagoFFAGRepository.getDataOrdenPagoGV($scope.idPerTraSolicitante, $scope.selTipoSalida, $scope.consecutivo).then((res) => {
        $scope.cuenta = res.data[0].efectivoCuenta;
        $scope.monto = res.data[0].traDe_devTotal;
        $scope.idEmpresa = res.data[0].id_empresa;
        $scope.idBanco = res.data[0].efectivoBanco;
        $scope.idSucursal = res.data[0].id_sucursal;
        $scope.idCliente = res.data[0].PER_IDPERSONA;
        $scope.estatus = res.data[0].estatus;
        $scope.idDepartamento = res.data[0].id_departamento;
        $scope.tipo = res.data[0].identificador;
        $scope.cuentaContableSalida  = res.data[0].cuentaContableSalida;
        $scope.nombreDep = res.data[0].dep_nombrecto;
    });  
}

    $scope.obtieneEvidenciasReembolso = function () {
        aprobarFondoRepository.obtieneEvidenciasReembolso($scope.id_perTraFF).then((res) => {
            if (res.data.length > 0) {
                $scope.evidenciasReembolso = [];
                var sum = 0;
                res.data[0].forEach(t => {
                    if(t.estatusReembolso == 0)
                    {$scope.evidenciasReembolso.push(t)}
                 });
            } 
        });
    };

    
    $scope.obtieneEvidenciasReembolsoTramite = function () {
        fondoFijoRepository.obtieneEvidenciasReembolsoTramite($scope.id_perTraReembolso).then((res) => {
            if (res.data.length > 0) {
                $scope.evidenciasReembolso = res.data;
                var sum = 0;
                $scope.evidenciasReembolso.forEach(t => {
                    if(t.estatusReembolso == 0)
                    { sum+= t.monto}   
                    $scope.verSalidaReembolso = t.estatusPerTraReembolso
                 });
                $scope.montoReembolso =  sum.toFixed(2);
                $scope.evidenciasReembolsoHistorico = res.data[1];
                $scope.verHistorico = $scope.evidenciasReembolsoHistorico.length > 0 ? true : false;
            } 
        });
    }

function zeroDelete (item)
{
    var x = '';
    var values = item.split('-');
    values.forEach(f => {
        if(values[0] == f)
        {  var str = f;
            var res = str.split("0");
            res.forEach(t => {
                if(t != "")
                { x+= t}
             });
           }
        else
        {x+='-' +parseFloat(f).toFixed(0)}
     });

return x;
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
        traspasosFondoFijoRepository.obtieneEstatusTramites().then((res) => {
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

    $scope.aprobarTramite = async function () {

        var docsCompleto = 0
        angular.forEach($scope.documentos, (value, key) => {
            if (value.opcional === false )
                if(value.archivo === undefined ){
                    docsCompleto += 1;
                }else if(value.archivo === ''){
                    docsCompleto += 1;
                }
        });

        if (docsCompleto > 0) {
            swal('Alto', 'Para aprobar el trámite debes adjuntar todos los documentos', 'warning');
            $('#loading').modal('hide');
        }
        else {
            ////Ismael pide que no se genere la poliza de traspaso.
            //$scope.traspasoCuentas();
            $('#loading').modal('show');
            $scope.activarAprobar = true;
            $scope.activarRechazo = false;


            $scope.polizaCaja
            var tipoProceso = true;
            if ($scope.selTipoSalida !== 5) {
               
                if ($scope.polizaCaja.esReembolso == 0 && $scope.polizaCaja.tramite == 'FF') {
                    tipoProceso = await promiseInsertaDatos($scope.polizaCaja.idUsuario, $scope.polizaCaja.idSucursal, 2, $scope.polizaCaja.idFondoFijo, $scope.polizaCaja.monto, 'FONFIJ', 'FFCE', 0, $scope.polizaCaja.bancoE, '');
                    tipoProceso = await promiseInsertaDatos($scope.polizaCaja.idUsuario, $scope.polizaCaja.idSucursal, 3, $scope.polizaCaja.idFondoFijo, $scope.polizaCaja.monto, 'FONFIJ', 'FFCS', $scope.polizaCaja.id_perTraFF, $scope.polizaCaja.bancoS, $scope.polizaCaja.CCDepto);

                }
                else if ($scope.polizaCaja.esReembolso == 1 && $scope.polizaCaja.tramite == 'FF') {
                    // aplicacion api
                    // tipoProceso = await promiseInsertaDatos($scope.polizaCaja.idUsuario, $scope.polizaCaja.idSucursal, 13, $scope.polizaCaja.idFondoFijo, $scope.polizaCaja.monto, 'FONFIJ', $scope.polizaCaja.dep_nombrecto, $scope.polizaCaja.id_perTraFF, $scope.polizaCaja.bancoE, '');
                    // tipoProceso = await promiseInsertaDatos($scope.polizaCaja.idUsuario, $scope.polizaCaja.idSucursal, 14, $scope.polizaCaja.idFondoFijo, $scope.polizaCaja.monto, 'FONFIJ', $scope.polizaCaja.dep_nombrecto, $scope.polizaCaja.id_perTraFF, $scope.polizaCaja.bancoS, $scope.polizaCaja.CCDepto);
                  

                    let respRFCE
                    let respRFCS
            
                    respRFCE = await AplicaPolizaRFCE()
            
                    if(respRFCE == true){
                        respRFCS = await AplicaPolizaRFCS()
                        $location.path('/tesoreriaHome');
                    }

                    //$scope.avanzaReembolso();

                }
                else if ($scope.polizaCaja.esReembolso == 0 && $scope.polizaCaja.tramite == 'GV') {
                    tipoProceso = await promiseInsertaDatos($scope.polizaCaja.idUsuario, $scope.polizaCaja.idSucursal, 17, 'AG', $scope.polizaCaja.monto, $scope.polizaCaja.dep_nombrecto, $scope.polizaCaja.dep_nombrecto, $scope.polizaCaja.id_perTraGV, $scope.polizaCaja.bancoE, '');
                    tipoProceso = await promiseInsertaDatos($scope.polizaCaja.idUsuario, $scope.polizaCaja.idSucursal, 18, 'AG', $scope.polizaCaja.monto, $scope.polizaCaja.dep_nombrecto, $scope.polizaCaja.dep_nombrecto, $scope.polizaCaja.id_perTraGV, $scope.polizaCaja.bancoS, '');
               
                }
            }
            else
            {
                let banco = zeroDelete($scope.cuentaContableSalida);
                tipoProceso = await promiseInsertaDatos($rootScope.user.usu_idusuario, $scope.idSucursal, 15,'AG', $scope.monto,'AC', $scope.nombreDep, $scope.idPerTraSolicitante, banco,'');
                tipoProceso = await promiseInsertaDatos($rootScope.user.usu_idusuario, $scope.idSucursal, 16,'AG', $scope.monto,'AC', $scope.nombreDep, $scope.idPerTraSolicitante, banco,'');
              
            }
            if (tipoProceso) {

                var documentoToSave = [];
                for(let i=0; i < $scope.documentos.length; i++){
                    if($scope.documentos[i].id_documento !== 13){
                        documentoToSave.push($scope.documentos[i])
                    }
                }

                console.log(documentoToSave)

                traspasosFondoFijoRepository.aprobarRechazarTramite($scope.id_perTra, 2, $scope.observacionesTramite).then((res) => {
                    $scope.saveDocumentosTramite($scope.id_perTra, res.data[0].ruta, 0, documentoToSave)

                    if($scope.selTipoSalida === 5){
                       
                        $scope.saveDocumentosTramiteAG($scope.idPerTraSolicitante,0,documentoToSave[0])
                    }
                    $scope.sendMailNotificacion(2);
                    $scope.backDashboard();
                })
            }

            if( $scope.datosTransferencia.EsGDM == 1 ){
                $scope.sendPoliza();
            }
            // //tesoreriaHome
            //             $('#loading').modal('hide');
            //             $scope.backTramites = function () {
            //               }
            $scope.backDashboard();
        }

    }

    $scope.avanzaReembolso = function () {
        fondoFijoRepository.cambiaEstatusReembolso($scope.id_perTraReembolso).then((res) => {
            if (res.data[0].success == 1) {
                console.log('Se actualizo correctamente')
            } else {
                console.log('Ocurrio un error')
            }
        });
    }

    $scope.traspasoCuentas = function () {
        aprobarFondoRepository.transferenciaBancos($scope.datosTransferencia.idEmpresa, $scope.polizaCaja.idSucursal, $scope.datosTransferencia.cuentaContableOrigen,$scope.datosTransferencia.CuentaContableDestino, $scope.datosTransferencia.importe, $scope.polizaCaja.idUsuario, $scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
            }
        });

    }


    $scope.rechazarTramite = function () {
        $scope.activarAprobar = false;
        $scope.activarRechazo = true;
        $scope.backDashboard();

        // traspasosFondoFijoRepository.aprobarRechazarTramite($scope.id_perTra, 3, $scope.observacionesTramite).then((res) => {
        //     $scope.sendMailNotificacion(3);
        //     console.log(res);
        //     $scope.backDashboard();
        // })
    }

    $scope.getDocumentosByTramite = function () {
        $scope.documentos = [];
        devolucionesRepository.documentosByTramite($scope.selTramite).then((res) => {
            
            if($scope.documentos.length === 0){
                $scope.documentos = res.data;
                $scope.documentos[0].archivo = '';
                $scope.documentos[0].existe = 0
                $scope.documentos[0].idExtension=0
                $scope.documentos[0].opcional = false
            }
            else{
                res.data[0].archivo = '';
                res.data[0].existe = 0
                res.data[0].idExtension = 0
                res.data[0].opcional = false
                $scope.documentos.push(res.data[0])
            
            }

        });
    }

    $scope.saveDocumentosTramite = function (idPertra, saveUrl, contDocs, documentos) {
        var sendData = {};

        if (contDocs <= documentos.length - 1) {

            if (documentos[contDocs].hasOwnProperty('archivo')) {
                sendData = {
                    idDocumento: documentos[contDocs].id_documento,
                    idTramite: 13,
                    idPerTra: idPertra,
                    saveUrl: saveUrl + 'Transferencia_' + idPertra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                    archivo: documentos[contDocs].archivo['archivo']
                }

                traspasosFondoFijoRepository.saveDocumentos(sendData).then((res) => {
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
        traspasosFondoFijoRepository.loadDocument(
            $scope.id_perTra,
            13)
            .then((res) => {
                if($scope.documentos.length === 0){
                    $scope.documentos = res.data;
                }
                else{
                    $scope.documentos.push(res.data[0])
                }
                
                console.log('Documentos',$scope.documentos)
            });
    }

    $scope.verPdf = function (documento) {


        if (validURL(documento.url) === false) {
            documento.url = undefined
        }

        if((documento.url === null || document.url === undefined) && documento.archivo !== null && documento.archivo !== undefined && documento.archivo !== ''){
            documento.url = documento.archivo.archivo
        }

        if (documento.url === null || documento.url === undefined) {
            swal('Aviso', 'El estado de cuenta no ha sido cargado', 'warning')
        } else {
            if (documento.estatusDocumento == 3) {
                $scope.verComentarios = true;
                $scope.obervacionesDoc = documento.Observaciones;
            } else {
                $scope.verComentarios = false;
            }
            $('#pdfReferenceContent object').remove();
            $scope.modalTitle = documento.doc_nomDocumento;
            $("#mostrarPdf").modal("show");
            var pdf = documento.url === undefined ? documento.archivo.archivo : documento.url;
            $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
            $('#mostrarPdf').insertAfter($('body'));
            
        }

    }

    /**
     *opcion: 1: revisada, 2: aprobada, 3: rechada
     */
    $scope.sendMailNotificacion = function (opcion, url) {

        var tipo='';
        var fecha = new Date().toLocaleDateString("es-MX");
        var observaciones = ($scope.observacionesTramite === undefined || $scope.observacionesTramite === null) ? '' : $scope.observacionesTramite;
        var importe = $scope.formatMoney($scope.datosTransferencia.importe,2)
        var destinatarios = ($scope.polizaCaja === undefined || $scope.polizaCaja === null || $scope.polizaCaja === '') ? $scope.datosTransferencia.email : $scope.polizaCaja.correo;
        var bancoDestino = ($scope.datosTransferencia.bancoDestino === null || $scope.datosTransferencia.bancoDestino === undefined) ? '' : $scope.datosTransferencia.bancoDestino ;

        if(opcion === 1){
            tipo = 'revisada';
        }
        else if(opcion === 2){
            tipo= 'aprobada';
        }
        else{
            tipo = 'rechazada'
        }

        var html=''
        if($scope.idTramiteSolicitud !== 9){
                html = `
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
                                <td>${bancoDestino} - ${$scope.datosTransferencia.cuentaDestino}</td>
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
                `}
                else{
                    html = `
                <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                <div>
                    <p>La solicitud del transferencia bancaria ha sido ${tipo}, puede visualizar el comprobante en el folio ${$scope.datosTransferencia.idPerTraSolicitante} de su tablero de tramites</p>
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
                </div>`
                }


                devolucionesRepository.sendMailCliente(destinatarios, "Tramite de Transferencia", html).then((res) => {
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

      $scope.updateTramite = function(idPerTra, idEstatus, esDeEstatus){
        traspasosFondoFijoRepository.updateTramite(idPerTra, idEstatus, esDeEstatus).then(resp => {
            console.log(resp);
        })
      }

      async function promiseInsertaDatos(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento) {
        return new Promise((resolve, reject) => {
            fondoFijoRepository.insertaPoliza(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento).then(function (result) {
                if (result.data.length > 0) {
                    resolve(true);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    function getDocumentosGV() {

        anticipoGastoRepository.loadDocument(
            $scope.idPerTraSolicitante,
            9).then((res) => {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].id_documento === 13 && $scope.selTipoSalida === 5) {
                        console.log('edo Cuenta: ', res.data[i])
                        res.data[i].opcional = true;
                        $scope.documentos.push(res.data[i])
                    }
                }
            });
    }

    $scope.saveDocumentosTramiteAG = function (idPertra,  contDocs, documento) {
        var sendData = {};
        var saveUrl = 'C:\\app\\public\\Imagenes\\Comprobaciones\\';
        var posicion = documento.archivo.nombreArchivo.indexOf('.');
        var nombre = documento.archivo.nombreArchivo.substring(0,posicion);

            if (documento.hasOwnProperty('archivo')) {
                sendData = {
                    idDocumento: 65,
                    idTramite: 9,
                    idPerTra: idPertra,
                    saveUrl: saveUrl + 'Comprobacion\\' + 'Comprobacion_' + idPertra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: 'pdf',
                    archivo: documento.archivo.archivo,
                    nombreArchivo:'comprobacion',
                    idArchivo: 65,
                    idProceso: 1,
                    consecutivo: $scope.consecutivo
                }

                anticipoGastoRepository.saveEdoCuentas(sendData.idDocumento, sendData.idTramite, $scope.idPerTraSolicitante).then(res => {
                   anticipoGastoRepository.saveDocumentos(sendData).then((res) => {
                                        if (res.data.ok) {
                                            console.log(res.data);
                                            anticipoGastoRepository.loadDocument($scope.idSolicitud,$scope.idTramite ).then(res => {
                
                                                $scope.documento = res.data[0];
                                                
                                                console.log($scope.documento)
                                            })  
                                        }
                                    }); 
                })
                    
                }
 
            

    };

    function validURL(myURL) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(myURL);
     }

     $scope.verImagenModalVale = function(item) {
        if(item.tipoEvidencia == 'pdf')
        {$scope.verPdfVale(item)}
        else
        {
        $scope.modalTitle = 'Evidencia';
        $scope.comentario = item.comentario;
        $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
        $scope.verImagen = item.urlEvidencia;
        $("#mostrarImagen").modal("show");
    }
    }

    $scope.verPdfVale = function(item) {
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = 'Evidencia';
        $scope.comentario = item.comentario;
        $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
        var pdf = item.urlEvidencia;
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $("#mostrarPdf").modal("show");
    }

    
    $scope.sendPoliza = function(){
        traspasosFondoFijoRepository.sendPoliza( $scope.paramsPolizaCGFN ).then( (res) => {
            console.log("La poliza se ha creado", res);
        });
    }


    async function AplicaPolizaRFCE (){
        return new Promise( async (resolve, reject) => {
            // let SubProducto = zeroDelete($scope.cuentaContable);   
            // let Origen = zeroDelete($scope.cuentaContableSalida);   
            let AuthToken;
            let FF =  $scope.idFondoFijo
            let resPoliza
            let respUpdate

            $('#loading').modal('show');

            let apiJson1Detalle = structuredClone(apiJsonBPRO1detalle)

            apiJson1Detalle.IdEmpresa = $scope.polizaCaja.id_Empresa
            apiJson1Detalle.IdSucursal = $scope.polizaCaja.id_Sucursal
            apiJson1Detalle.Tipo = 2

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Proceso = `RFCE${$scope.polizaCaja.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].DocumentoOrigen = $scope.polizaCaja.idFondoFijo
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Canal = `RFCE${$scope.polizaCaja.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Documento = $scope.polizaCaja.idFondoFijo
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Referencia2 =  $scope.polizaCaja.idFondoFijo

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= $scope.polizaCaja.idFondoFijo
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '0'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto= $scope.polizaCaja.dep_nombrecto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto = ''
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Origen = $scope.polizaCaja.bancoE
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoCambio = '1'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.polizaCaja.monto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = '0'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = $scope.polizaCaja.idFondoFijo 
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = $scope.polizaCaja.idFondoFijo

            console.log(JSON.stringify(apiJson1Detalle))

            let datalog = structuredClone(datalogAPI)
        
                datalog.idSucursal = $scope.polizaCaja.id_Sucursal
                datalog.id_perTra = $scope.polizaCaja.id_perTraReembolso
                datalog.opcion = 1        

            AuthToken = await promiseAutBPRO();
            //AuthToken = await AuthApi()

            datalog.tokenGenerado = AuthToken.Token
            datalog.unniqIdGenerado = AuthToken.UnniqId
            datalog.jsonEnvio = JSON.stringify(apiJson1Detalle)

            let respLog = await LogApiBpro(datalog)

            datalog.consecutivo = respLog.folio
            datalog.opcion = 2

            resPoliza = await GeneraPolizaBPRO(AuthToken.Token,JSON.stringify(apiJson1Detalle))

            if(resPoliza.Codigo === '200 OK'){
                datalog.anioPol = resPoliza.Poliza[0].añoPoliza
                datalog.consPol = resPoliza.Poliza[0].ConsecutivoPoliza
                datalog.empresaPol = resPoliza.Poliza[0].EmpresaPoliza
                datalog.mesPol =  resPoliza.Poliza[0].MesPoliza
                datalog.tipoPol = resPoliza.Poliza[0].TipoPoliza
                datalog.jsonRespuesta = JSON.stringify(resPoliza.Poliza[0])
                datalog.codigo = resPoliza.Codigo
                datalog.resuelto = 1

                //respUpdate = await promiseActualizaTramite($scope.idPerTra,'RFCE', AG, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

               // $scope.getDataOrdenPagoFF();
                $scope.nombreTramite ='REEMBOLSO ORDEN PAGO RFCE'

                //$('#loading').modal('hide');

                swal({
                    title:"Aviso",
                    type:"success",
                    width: 1000,
                    text:`El rembolso por orden de pago genero la siguiente póliza
                    Año póliza: ${datalog.anioPol}
                    Mes póliza: ${datalog.mesPol}
                    Cons póliza: ${datalog.consPol}
                    Tipo póliza: ${datalog.tipoPol}
                    
                    No olvide subir el archivo PDF de la orden de pago al sistema`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })

                resolve(true)
                
            }else{

                $('#loading').modal('hide');


                datalog.jsonRespuesta = JSON.stringify(resPoliza)

                if(resPoliza.data !== undefined){
                    datalog.mensajeError = resPoliza.data.Message 
                    datalog.codigo = resPoliza.status.toString()
                    datalog.resuelto = 0
                }else{
                    datalog.mensajeError = resPoliza.Mensaje
                    datalog.codigo = resPoliza.Codigo
                    datalog.resuelto = 0
                }

                swal({
                    title:"Aviso",
                    type:"error",
                    width: 1000,
                    text: `Se presento un problema al procesar la póliza en BPRO
                    El trámite no ha sido procesado, favor de notificar al área de sistemas 
                    
                    Codigo: ${datalog.codigo }
                    Respuesta BPRO:  ${datalog.mensajeError}
                    
                    Reitentar cuando se le notifique la solución a la incidencia`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })

                resolve(false)
            }

            respLog = await LogApiBpro(datalog)

            console.log(respUpdate)

            //$scope.backDashboard();

        })
    }

    $scope.AplicaPolizaRFCE = function async (){        
    }

    async function AplicaPolizaRFCS (){
        return new Promise( async (resolve, reject) => {
            let AuthToken;
            let FF =  $scope.idFondoFijo
            let resPoliza
            let respUpdate

            $('#loading').modal('show');

            let apiJson1Detalle = structuredClone(apiJsonBPRO1detalle)

            apiJson1Detalle.IdEmpresa = $scope.polizaCaja.id_Empresa
            apiJson1Detalle.IdSucursal = $scope.polizaCaja.id_Sucursal
            apiJson1Detalle.Tipo = 2

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Proceso = `RFCS${$scope.polizaCaja.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].DocumentoOrigen = $scope.polizaCaja.idFondoFijo
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Canal = `RFCS${$scope.polizaCaja.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Documento = $scope.polizaCaja.idFondoFijo
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Referencia2 =  $scope.polizaCaja.idFondoFijo

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= $scope.polizaCaja.idFondoFijo
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '0'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto= $scope.polizaCaja.dep_nombrecto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto = $scope.polizaCaja.CCDepto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Origen = $scope.polizaCaja.bancoS
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoCambio = '1'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.polizaCaja.monto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.polizaCaja.PER_IDPERSONA
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = $scope.polizaCaja.idFondoFijo 
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = $scope.polizaCaja.idFondoFijo

            console.log(JSON.stringify(apiJson1Detalle))

            let datalog = structuredClone(datalogAPI)
        
            datalog.idSucursal = $scope.polizaCaja.id_Sucursal
            datalog.id_perTra = $scope.polizaCaja.id_perTraReembolso
            datalog.opcion = 1       

            AuthToken = await promiseAutBPRO();
            //AuthToken = await AuthApi()

            datalog.tokenGenerado = AuthToken.Token
            datalog.unniqIdGenerado = AuthToken.UnniqId
            datalog.jsonEnvio = JSON.stringify(apiJson1Detalle)

            let respLog = await LogApiBpro(datalog)

            datalog.consecutivo = respLog.folio
            datalog.opcion = 2

            resPoliza = await GeneraPolizaBPRO(AuthToken.Token,JSON.stringify(apiJson1Detalle))

            if(resPoliza.Codigo === '200 OK'){
                datalog.anioPol = resPoliza.Poliza[0].añoPoliza
                datalog.consPol = resPoliza.Poliza[0].ConsecutivoPoliza
                datalog.empresaPol = resPoliza.Poliza[0].EmpresaPoliza
                datalog.mesPol =  resPoliza.Poliza[0].MesPoliza
                datalog.tipoPol = resPoliza.Poliza[0].TipoPoliza
                datalog.jsonRespuesta = JSON.stringify(resPoliza.Poliza[0])
                datalog.codigo = resPoliza.Codigo
                datalog.resuelto = 1

                //respUpdate = await promiseActualizaTramite($scope.idPerTra,'RFCS', AG, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

                //$scope.getDataOrdenPagoFF();
                $scope.nombreTramite ='REEMBOLSO POR SALIDA DE CAJA'

                $scope.avanzaReembolso();

                html = $scope.html1 + 'Se proceso el reembolso al fondo fijo:  ' + $scope.polizaCaja.idFondoFijo +'. ' + "<br><br> Se realizó reembolso por Reembolso Caja por el monto de:  $"+ formatMoney($scope.polizaCaja.monto) + "  " + $scope.html2;
                $scope.sendMail('luis.bonnet@grupoandrade.com,eduardo.yebra@coalmx.com', $scope.nombreTramite, html);
                //$scope.sendMail(respUpdate.correo, respUpdate.asunto, html);
                $('#loading').modal('hide');

                swal({
                    title:"Aviso",
                    type:"success",
                    width: 1000,
                    text:`El rembolso por orden de pago genero la siguiente póliza
                    Año póliza: ${datalog.anioPol}
                    Mes póliza: ${datalog.mesPol}
                    Cons póliza: ${datalog.consPol}
                    Tipo póliza: ${datalog.tipoPol}
                    
                    No olvide subir el archivo PDF de la orden de pago al sistema`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })

                resolve(true)
                
            }else{

                $('#loading').modal('hide');


                datalog.jsonRespuesta = JSON.stringify(resPoliza)

                if(resPoliza.data !== undefined){
                    datalog.mensajeError = resPoliza.data.Message 
                    datalog.codigo = resPoliza.status.toString()
                    datalog.resuelto = 0
                }else{
                    datalog.mensajeError = resPoliza.Mensaje
                    datalog.codigo = resPoliza.Codigo
                    datalog.resuelto = 0
                }

                swal({
                    title:"Aviso",
                    type:"error",
                    width: 1000,
                    text: `Se presento un problema al procesar la póliza en BPRO
                    El trámite no ha sido procesado, favor de notificar al área de sistemas 
                    
                    Codigo: ${datalog.codigo }
                    Respuesta BPRO:  ${datalog.mensajeError}
                    
                    Reitentar cuando se le notifique la solución a la incidencia`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })

                resolve(false)
            }

            respLog = await LogApiBpro(datalog)

            console.log(respUpdate)
            
          
            $('#loading').modal('hide');
        })
    }

    async function GeneraPolizaBPRO(token, data){
        return new Promise((resolve, reject) => {
            apiBproRepository.GeneraPolizaBPRO(token, data).then(resp =>{
                console.log('respuesta: ',resp.data)
                resolve(resp.data)
            }).catch(error => {
                resolve(error)
            })
        })
    }

    async function LogApiBpro(data){
        return new Promise((resolve, reject) => {
            apiBproRepository.LogApiBpro(data).then(resp =>{
                console.log('resp: ',resp)
                resolve(resp.data[0])
            })
        })
    }

    async function promiseAutBPRO(){
        return new Promise((resolve, reject) => {
            apiBproRepository.GetTokenBPRO().then(resp =>{
                console.log('resp: ',resp)
                resolve(resp.data)
            })

        })
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

    $scope.sendMail = function(to, subject, html) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito ")')
            } else {
                console.log('Ocuerrio un error al emviar el correo "( ')
            }
        });
    };


});