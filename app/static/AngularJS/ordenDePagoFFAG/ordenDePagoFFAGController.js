registrationModule.controller('ordenDePagoFFAGController', function ($scope, $rootScope, $location, localStorageService, ordenDePagoRepository, aprobarDevRepository, aprobarRepository, devolucionesRepository, fondoFijoRepository, aprobarFondoRepository, ordenDePagoFFAGRepository, anticipoGastoRepository,apiBproRepository) {
                               
    $scope.referencia = '';
    $scope.EsTGM = 0;
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
    $scope.documentos = [];
    $scope.tipoTramite = 0; 
    $scope.consecutivoTramite = 0;
    $scope.esAGV = false;

    //----------BPRO ENPOINT GV------------
    $scope.complementoPolizas = '';
    $scope.emp_nombrecto = '';
    $scope.suc_nombrecto = '';
    $scope.dep_nombrecto = '';
    $scope.incremental = 0;
    $scope.idComprobacionConcepto = ''
    $scope.ordenCompra=''
    $scope.documentoConcepto= ''
    $scope.idPersonaRFC = 0
    $scope.cuentaEnvio = ''

    $scope.apiJson = structuredClone(apiJsonBPRO2detalles)

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.idPerTra = localStorage.getItem('id_perTra');
        $scope.idTramite = localStorage.getItem('idTramite');
       
        if($scope.idTramite == 10)
        {
            $scope.tipoTramite = localStorage.getItem('tipoTramite');
            $scope.consecutivoTramite = localStorage.getItem('consecutivoTramite');
            $scope.nomTramite = 'FondoFijo';
            $scope.getDataOrdenPagoFF();
        }
        if($scope.idTramite == 16)
        {
            $scope.tipoTramite = localStorage.getItem('tipoTramite');
            $scope.consecutivoTramite = localStorage.getItem('consecutivoTramite');
            $scope.nomTramite = 'FondoFijo';
            $scope.getDataOrdenPagoFFTramite();
        }
        if($scope.idTramite == 9)
        {
            $scope.tipoTramite = localStorage.getItem('tipoTramite');
            $scope.consecutivoTramite = localStorage.getItem('consecutivoTramite');
            $scope.nomTramite = 'AnticipoGastos';
            $scope.getDataOrdenPagoGV();
            $scope.nombreTramite ='ANTICIPO DE GASTOS'
            $scope.esAGV = true;
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
        $scope.today = dd + '/' + mm + '/' + yyyy;

    };
    $scope.getDataOrdenPagoFF = function () {
        ordenDePagoFFAGRepository.getDataOrdenPagoFF($scope.idPerTra,$scope.tipoTramite,$scope.consecutivoTramite).then((res) => {
            console.log( "!!!!!!!!!!!!!!!1getDataOrdenPagoFF", res );
            //$scope.EsTGM = res.data[0].EsTGM;
            $scope.cuenta = res.data[0].efectivoCuenta;
            $scope.monto = res.data[0].traDe_devTotal;
            $scope.idEmpresa = res.data[0].id_empresa;
            $scope.idBanco = res.data[0].efectivoBanco;
            $scope.idSucursal = res.data[0].id_sucursal;
            $scope.idCliente = res.data[0].PER_IDPERSONA;
            $scope.estatus = res.data[0].estatus;
            $scope.idDepartamento = res.data[0].id_departamento;
            $scope.tipo = res.data[0].identificador;
            $scope.cuentaContable = res.data[0].cuentaContable;
            $scope.cuentaContableSalida  = res.data[0].cuentaContableSalida;
            $scope.idFondoFijo = res.data[0].idFondoFijo;
            $scope.nombreDep = res.data[0].dep_nombrecto;
            $scope.nombreTramite = $scope.tipo == 'FS' ? 'SALIDA FONDO FIJO' : 'REEMBOLSO FONDO FIJO'
            $scope.docsReembolso = $scope.tipo == 'FS' ? false : true;
            $scope.getNombreBanco();
            $scope.getDataClienteFA();
            $scope.getDocumentosAprobarFF();
            $scope.getComprobanteFA();
            $scope.obtieneEvidenciasReembolso();
            var dataReferencia = {
                idEmpresa: $scope.idEmpresa,
                idSucursal: $scope.idSucursal,
                idDepartamento: $scope.idDepartamento,
                idTipoDocumento: 1,
                serie: $scope.tipo,
                //folio: '000000' + $scope.idPerTra,
                folio: zfill(Number($scope.consecutivoTramite), 6) + $scope.idPerTra,
                idCliente: $scope.idCliente,
                idAlma: 0,
                importeDocumento: $scope.monto.toFixed(2),
                idTipoReferencia: 1
            }
            $scope.consumirReferencias(dataReferencia);

            if($scope.EsTGM == 1){
                $scope.nombreTramite ='GASTOS DE MAS'
            }
        });
    };

    $scope.getDataOrdenPagoFFTramite = function () {
        ordenDePagoFFAGRepository.getDataOrdenPagoFFTramite($scope.idPerTra,$scope.tipoTramite,$scope.consecutivoTramite).then((res) => {
            $scope.id_perTraFF =  res.data[0].id_perTra;
            $scope.cuenta = res.data[0].efectivoCuenta;
            $scope.monto = res.data[0].traDe_devTotal;
            $scope.idEmpresa = res.data[0].id_empresa;
            $scope.idBanco = res.data[0].efectivoBanco;
            $scope.idSucursal = res.data[0].id_sucursal;
            $scope.idCliente = res.data[0].PER_IDPERSONA;
            $scope.estatus = res.data[0].estatus;
            $scope.idDepartamento = res.data[0].id_departamento;
            $scope.tipo = res.data[0].identificador;
            $scope.cuentaContable = res.data[0].cuentaContable;
            $scope.cuentaContableSalida  = res.data[0].cuentaContableSalida;
            $scope.idFondoFijo = res.data[0].idFondoFijo;
            $scope.nombreDep = res.data[0].dep_nombrecto;
            $scope.nombreTramite = $scope.tipo == 'FS' ? 'SALIDA FONDO FIJO' : 'REEMBOLSO FONDO FIJO'
            $scope.docsReembolso = $scope.tipo == 'FS' ? false : true;
            $scope.cajero =  res.data[0].cajero,
            $scope.correoCajero = res.data[0].correo,
            $scope.getNombreBanco();
            $scope.getDataClienteFA();
            $scope.getDocumentosAprobarFFTramite($scope.id_perTraFF);
            $scope.getComprobanteFATramite($scope.id_perTraFF);
            $scope.obtieneEvidenciasReembolsoTramite();
            var dataReferencia = {
                idEmpresa: $scope.idEmpresa,
                idSucursal: $scope.idSucursal,
                idDepartamento: $scope.idDepartamento,
                idTipoDocumento: 1,
                serie: $scope.tipo,
                //folio: '000000' + $scope.idPerTra,
                folio: zfill(Number($scope.consecutivoTramite), 6) + $scope.idPerTra,
                idCliente: $scope.idCliente,
                idAlma: 0,
                importeDocumento: $scope.monto.toFixed(2),
                idTipoReferencia: 1
            }
            $scope.consumirReferencias(dataReferencia);

        });
    };

    $scope.DatosPolizaOP = function( cuenta ){
        console.log( "$scope.EsTGM",$scope.EsTGM );
        if( $scope.EsTGM == 1 ){
            ordenDePagoFFAGRepository.DatosPolizaOP( cuenta ).then((res)=>{
                console.log("DatosPolizaOP", res);
                var solicitudes = res.data;

                $scope.paramsPolizaCGFN = {
                    idusuario: solicitudes[0].idusuario,
                    idsucursal: solicitudes[0].idsucursal,
                    tipoProceso: 20,  //20
                    documentoOrigen: solicitudes[0].idComprobacionConcepto,
                    ventaUnitario: $scope.monto,//solicitudes[0].monto,
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

    $scope.getDataOrdenPagoGV = function () {
        ordenDePagoFFAGRepository.getDataOrdenPagoGV($scope.idPerTra,$scope.tipoTramite,$scope.consecutivoTramite).then((res) => {
            console.log("%%%%%%%%%%%%%%%% getDataOrdenPagoGV", res);
            $scope.EsTGM = res.data[0].EsTGM;
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
            //-----ENDPOINT GV ----------------------------------
            $scope.complementoPolizas = res.data[0].complementoPoliza;
            $scope.emp_nombrecto = res.data[0].emp_nombrecto;
            $scope.suc_nombrecto = res.data[0].suc_nombrecto;
            $scope.dep_nombrecto = res.data[0].dep_nombrecto;
            $scope.incremental = res.data[0].incremental;
            $scope.idComprobacionConcepto = res.data[0].idComprobacionConcepto
            $scope.ordenCompra = res.data[0].ordenCompra
            $scope.documentoConcepto = res.data[0].documentoConcepto
            $scope.idPersonaRFC = res.data[0].idPersonaRFC
            $scope.cuentaEnvio = res.data[0].cuentaEnvio
            //----------------------------------------------------

            $scope.DatosPolizaOP( res.data[0].id_cuenta );
            $scope.getNombreBanco();
            $scope.getDataClienteFA();
            $scope.getComprobanteFA();
            $scope.getDocumentosUsuarioGV($scope.idPerTra)
            var dataReferencia = {
                idEmpresa: $scope.idEmpresa,
                idSucursal: $scope.idSucursal,
                idDepartamento: $scope.idDepartamento,
                idTipoDocumento: 1,
                serie: $scope.tipo,
                //folio: '000000' + $scope.idPerTra,
                folio: zfill(Number($scope.consecutivoTramite), 6) + $scope.idPerTra,
                idCliente: $scope.idCliente,
                idAlma: 0,
                importeDocumento: $scope.monto.toFixed(2),
                idTipoReferencia: 1
            }
            $scope.consumirReferencias(dataReferencia);
        });
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


    $scope.obtieneEvidenciasReembolso = function () {
        aprobarFondoRepository.obtieneEvidenciasReembolso($scope.idPerTra).then((res) => {
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
        fondoFijoRepository.obtieneEvidenciasReembolsoTramite($scope.idPerTra).then((res) => {
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

    $scope.documentosReembolso = function () {
        $("#modalEvidencias").modal("show");
    }

    $scope.getNombreBanco = function () {
        ordenDePagoRepository.nombreBanco($scope.idBanco, $scope.idEmpresa, $scope.idSucursal).then((res) => {
            $scope.bancoNombre = res.data[0][0].BancoNombre;
            $scope.titularCuenta = res.data[1][0].emp_nombre;
            $scope.nombreSucursal = res.data[2][0].nombre_sucursal;
        });
    };

    $scope.getDataClienteFA = function () {
        ordenDePagoFFAGRepository.getNombreClienteFA($scope.idCliente).then((res) => {
            $scope.nombreCliente = res.data[0].Nombre;
        });
    }

    $scope.getDocumentosAprobarFF = function () {
        $scope.docTesoreria = [];
          fondoFijoRepository.imageBorrador($scope.idPerTra).then((res) => {
            angular.forEach(res.data, (value, key) => {
                value.detIdPerTra = value.det_idPerTra;
                value.nombreDoc = value.doc_nomDocumento;
                value.rutaDocumento = value.url;
                value.estatusDoc = 'TRUE';
                value.estatus = value.estatusTramite;
             });
                angular.forEach(res.data, (value, key) => {
                        if (value.id_documento == 4 || value.id_documento == 46 || value.id_documento == 47 ) {
                            //|| value.id_documento == 46 || value.id_documento == 47) {
                            $scope.docTesoreria.push(value);
                            if( value.estatus === 3 ){
                                $scope.rechazoDeDocs = true;
                            }
                        }
                    });
                });
        // aprobarDevRepository.documentosAprobar($scope.idPerTra).then((res) => {
        //     angular.forEach(res.data, (value, key) => {
        //         if (value.id_documento == 4 || value.id_documento == 46 || value.id_documento == 47) {
        //             $scope.docTesoreria.push(value);
        //             if( value.estatus === 3 ){
        //                 $scope.rechazoDeDocs = true;
        //             }
        //         }
        //     });
        // });
    };

    $scope.getDocumentosAprobarFFTramite = function (id_perTra) {
        $scope.docTesoreria = [];
          fondoFijoRepository.imageBorrador(id_perTra).then((res) => {
            angular.forEach(res.data, (value, key) => {
                value.detIdPerTra = value.det_idPerTra;
                value.nombreDoc = value.doc_nomDocumento;
                value.rutaDocumento = value.url;
                value.estatusDoc = 'TRUE';
                value.estatus = value.estatusTramite;
             });
                angular.forEach(res.data, (value, key) => {
                    if (value.id_documento == 4 || value.id_documento == 46 || value.id_documento == 47 ) {
                        //|| value.id_documento == 46 || value.id_documento == 47) {
                            $scope.docTesoreria.push(value);
                            if( value.estatus === 3 ){
                                $scope.rechazoDeDocs = true;
                            }
                        }
                    });
                });
    };
    

    $scope.getComprobanteFA = () => {
        ordenDePagoFFAGRepository.imageComprobante(localStorage.getItem('id_perTra'), $scope.idTramite, $scope.tipo, $scope.consecutivoTramite).then((res)=>{
            $scope.documentos = res.data;
        });
    };
    $scope.getComprobanteFATramite = (id_perTra) => {
        ordenDePagoFFAGRepository.imageComprobante(id_perTra, 10, $scope.tipo, $scope.consecutivoTramite).then((res)=>{
            $scope.documentos = res.data;
        });
    };

    $scope.saveDocumentosFA = (documento) => {
        $("#loading").modal("show");
        if (documento.archivo != undefined) {
            sendData = {
                idDocumento: documento.id_documento,
                idTramite: documento.id_tramite,
                idPerTra: localStorage.getItem('id_perTra'),
                saveUrl: documento.saveUrl + $scope.nomTramite +  '\\' +  $scope.nomTramite +'_' + localStorage.getItem('id_perTra'),
                idUsuario: $rootScope.user.usu_idusuario,
                extensionArchivo: documento.archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documento.archivo['nombreArchivo'].split('.')[1],
                archivo: documento.archivo['archivo'],
                observaciones: $scope.tipo,
                consecutivoTramite:$scope.consecutivoTramite
            }
            setTimeout(() => {
                ordenDePagoFFAGRepository.saveDocumentosFA(sendData).then((res) => {
                    if (res.data[0].success == 1) {
                        $scope.getComprobanteFA();
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

    $scope.saveDocumentosFATramite = (documento) => {
        $("#loading").modal("show");
        if (documento.archivo != undefined) {
            sendData = {
                idDocumento: documento.id_documento,
                idTramite: documento.id_tramite,
                idPerTra: $scope.id_perTraFF,
                saveUrl: documento.saveUrl + $scope.nomTramite +  '\\' +  $scope.nomTramite +'_' + $scope.id_perTraFF,
                idUsuario: $rootScope.user.usu_idusuario,
                extensionArchivo: documento.archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documento.archivo['nombreArchivo'].split('.')[1],
                archivo: documento.archivo['archivo'],
                observaciones: $scope.tipo,
                consecutivoTramite:$scope.consecutivoTramite
            }
            setTimeout(() => {
                ordenDePagoFFAGRepository.saveDocumentosFA(sendData).then((res) => {
                    if (res.data[0].success == 1) {
                        $scope.getComprobanteFATramite($scope.id_perTraFF);
                        let body = 
                        '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                        '<p>Estimado ' +$scope.cajero  +'</p>' +
                        '<p>Se Pago el siguiente Reembolso Fondo Fijo por Orden de Pago</p>' +
                        '<p>Favor de verificar la Orden de Pago en los documentos del Fondo Fijo</p>' +
                        '<p>Folio de Fondo Fijo: ' +  $scope.idFondoFijo +'</p>' +
                        '<p>Empresa: '+ $scope.titularCuenta + '</p>' +
                        '<p>Banco: '+ $scope.bancoNombre+ '</p>' +
                        '<p>Número Cuenta: '+ $scope.cuenta + '</p>'+
                        '<p>Cantidad: $'+ formatMoney($scope.monto)  + '</p>';   
                        $scope.sendMail($scope.correoCajero, 'Reembolso de Efectivo por Orden de Pago, Fondo Fijo ' + $scope.idFondoFijo, body);                  
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

    $scope.changeEstatus = function(){
        //TODO: changeEstatusFA SE IMPLEMENTARA CUANDO SE EJECUTE CORRECTAMENTE EL API DE BPRO
       
        // $('#loading').modal('show');
       // ordenDePagoFFAGRepository.changeEstatusFA($scope.idPerTra,$scope.tipoTramite, $scope.consecutivoTramite).then((res)=>{
        //    if( res.data[0].success == 1 ){
        //        $('#loading').modal('hide');
        //        swal( 'Listo', 'Se compro la orden de pago', 'success' );
        
                if($scope.idTramite == 10)
                {
                    $scope.getDataOrdenPagoFF();
                    $scope.insertaPolizaFF();
                    $scope.nombreTramite ='FONDO FIJO'
                    $scope.avanzaReembolso();
                }
                if($scope.idTramite == 9)
                {
                    if($scope.EsTGM == 1){
                        $scope.sendPoliza();
                        $scope.nombreTramite ='GASTOS DE MAS'
                    }
                    else{
                        $scope.getDataOrdenPagoGV();
                        $scope.insertaPolizaGV();
                        $scope.nombreTramite ='ANTICIPO DE GASTOS'
                    }
                }
                if($scope.idTramite == 16)
                {
                    $scope.getDataOrdenPagoFFTramite();
                    $scope.insertaPolizaFF();
                    $scope.nombreTramite ='FONDO FIJO'
                    $scope.avanzaReembolso();
                }
    //TODO SE DEBE DE EJECUTAR SI FALLA BPRO
            // }else{
            //     $('#loading').modal('hide');
            //     swal( 'Alto', 'Error al compar la orden de pago', 'error' );

            //     if($scope.idTramite == 10)
            //     {
            //         $scope.getDataOrdenPagoFF();
            //         $scope.nombreTramite ='FONDO FIJO'
            //     }
            //     if($scope.idTramite == 9)
            //     {
            //         $scope.getDataOrdenPagoGV();
            //         $scope.nombreTramite ='ANTICIPO DE GASTOS'
            //     }
            // };
        //});
    };

    $scope.avanzaReembolso = function () {
        fondoFijoRepository.cambiaEstatusReembolso($scope.idPerTra).then((res) => {
            if (res.data[0].success == 1) {
                console.log('Se actualizo correctamente')
            } else {
                console.log('Ocurrio un error')
            }
        });
    }
    $scope.goHome = function(){
        $location.path('/tesoreriaHome');
    }

    $scope.verPdf = function (documento) {
        if( documento.id_documento == 4 ){
            $scope.showRechazar = true;
        }
        if( documento.id_documento == 4 && $scope.idTramite === '9'){
            $scope.showRechazar = false;
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

    $scope.insertaPolizaFF = async function () {
    let CCDepto = zeroDelete($scope.cuentaContable);
    let banco = zeroDelete($scope.cuentaContableSalida);
    var tipoProceso = true;
    tipoProceso = await promiseInsertaDatos($rootScope.user.usu_idusuario, $scope.idSucursal, $scope.tipo == 'FS' ? 1 : 12, $scope.idFondoFijo, $scope.monto, 'FONFIJ', $scope.tipo == 'FS' ? 'FFOP' : $scope.nombreDep, $scope.idPerTra, banco, CCDepto);
    if(!tipoProceso)
    {   swal('Alto', 'Ocurrio un error al crear la poliza', 'warning');}

    }

    $scope.insertaPolizaGV = async function () {
        let banco = zeroDelete($scope.cuentaContableSalida);
        let AuthToken;
        let AG = `AG-${$scope.emp_nombrecto}-${$scope.suc_nombrecto}-${$scope.dep_nombrecto}-${$scope.idPerTra}-${$scope.incremental}`
        let resPoliza
        let respUpdate

        $('#loading').modal('show');

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Proceso = `GVOP${$scope.complementoPolizas}`
        $scope.apiJson.ContabilidadMasiva.Polizas[0].DocumentoOrigen = AG
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Canal = `GVOP${$scope.complementoPolizas}`
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Documento = AG
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Referencia2 =  AG

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= AG
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '1'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto='AC'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Origen = 'FF'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.idCliente
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = AG 
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.monto
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = AG

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoOrigen= AG
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Partida = '2'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].TipoProducto='DD'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Origen = 'FF'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Persona1 = $scope.idCliente
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoAfectado = AG 
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Moneda = 'PE'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Referencia2 = AG 
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].VentaUnitario = $scope.monto

        $scope.apiJson.IdEmpresa = $scope.idEmpresa
        $scope.apiJson.IdSucursal = $scope.idSucursal
        $scope.apiJson.Tipo = 2

        console.log(JSON.stringify($scope.apiJson))

        let datalog = structuredClone(datalogAPI)
      
            datalog.idSucursal = $scope.idSucursal
            datalog.id_perTra = $scope.idPerTra
            datalog.opcion = 1        

        AuthToken = await promiseAutBPRO();

        datalog.tokenGenerado = AuthToken.Token
        datalog.unniqIdGenerado = AuthToken.UnniqId
        datalog.jsonEnvio = JSON.stringify($scope.apiJson)

        let respLog = await LogApiBpro(datalog)

        datalog.consecutivo = respLog.folio
        datalog.opcion = 2

        resPoliza = await GeneraPolizaBPRO(AuthToken.Token,JSON.stringify($scope.apiJson))

        if(resPoliza.Codigo === '200 OK'){
            datalog.anioPol = resPoliza.Poliza[0].añoPoliza
            datalog.consPol = resPoliza.Poliza[0].ConsecutivoPoliza
            datalog.empresaPol = resPoliza.Poliza[0].EmpresaPoliza
            datalog.mesPol =  resPoliza.Poliza[0].MesPoliza
            datalog.tipoPol = resPoliza.Poliza[0].TipoPoliza
            datalog.jsonRespuesta = JSON.stringify(resPoliza.Poliza[0])
            datalog.codigo = resPoliza.Codigo
            datalog.resuelto = 1

            respUpdate = await promiseActualizaTramite($scope.idPerTra,'GVOP', AG, $scope.incremental)

            $scope.getDataOrdenPagoGV();
            $scope.nombreTramite ='ANTICIPO DE GASTOS'

            $('#loading').modal('hide');

            swal({
                title:"Aviso",
                type:"info",
                width: 1000,
                text:`La orden de pago genero la siguiente póliza
                Año póliza: ${datalog.anioPol}
                Mes póliza: ${datalog.mesPol}
                Cons póliza: ${datalog.consPol}
                Tipo póliza: ${datalog.tipoPol}
                
                No olvide subir el archivo PDF de la orden de pago al sistema`,
                showConfirmButton: true,
                showCloseButton:  false,
                timer:10000
            })
            
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
                timer:10000
            })
        }

        respLog = await LogApiBpro(datalog)

        console.log(respUpdate)

        //var tipoProceso = true;
        // tipoProceso = await promiseInsertaDatos($rootScope.user.usu_idusuario, $scope.idSucursal, 15,'AG', $scope.monto,'AC', $scope.nombreDep, $scope.idPerTra,banco,'');
        // tipoProceso = await promiseInsertaDatos($rootScope.user.usu_idusuario, $scope.idSucursal, 16,'AG', $scope.monto,'AC', $scope.nombreDep, $scope.idPerTra,banco,'');
                
        // if(!tipoProceso)
        // {   swal('Alto', 'Ocurrio un error al crear la poliza', 'warning');}
    
    }

    async function promiseAutBPRO(){
        return new Promise((resolve, reject) => {
            apiBproRepository.GetTokenBPRO().then(resp =>{
                console.log('token: ',resp.data)
                resolve(resp.data)
            })
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

    /**
     * 
     * @param {number} id_perTra 
     * @param {string} poliza 
     * @param {string} documentoConcepto 
     * @param {number} incremental 
     * @returns 
     */
    async function promiseActualizaTramite(id_perTra,poliza,documentoConcepto,incremental) {
        return new Promise((resolve, reject) => {
            anticipoGastoRepository.ActualizaTramitePoliza(id_perTra,poliza,documentoConcepto,incremental).then(function (result) {
                if (result.data.length > 0) {
                    resolve(result.data[0]);
                }
            }).catch(err => {
                reject(result.data[0]);
            });
    
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

    function zfill(number, width) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */ 
        var zero = "0"; /* String de cero */  
        
        if (width <= length) {
            if (number < 0) {
                 return ("-" + numberOutput.toString()); 
            } else {
                 return numberOutput.toString(); 
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString()); 
            }
        }
    }

    $scope.sendPoliza = async function(){
        $('#loading').modal('show');
        let resPoliza
        let respUpdate
        let AuthToken;

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Proceso = `CGFR${$scope.complementoPolizas}`
        $scope.apiJson.ContabilidadMasiva.Polizas[0].DocumentoOrigen = $scope.idComprobacionConcepto
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Canal = `CGFR${$scope.complementoPolizas}`
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Documento = $scope.ordenCompra
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Referencia2 =  $scope.ordenCompra

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= $scope.idComprobacionConcepto
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '1'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto='OT'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto = 'PA'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Origen = 'FAC'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 =  $scope.idPersonaRFC 
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = $scope.ordenCompra 
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.monto
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = $scope.idComprobacionConcepto

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoOrigen= $scope.idComprobacionConcepto
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Partida = '2'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].TipoProducto='OT'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].SubProducto =  $scope.cuentaEnvio
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Origen = 'FAC'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Persona1 =  $scope.idCliente 
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoAfectado = $scope.documentoConcepto  
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Moneda = 'PE'
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Referencia2 = $scope.ordenCompra  
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].VentaUnitario = $scope.monto

        $scope.apiJson.IdEmpresa = $scope.idEmpresa
        $scope.apiJson.IdSucursal = $scope.idSucursal
        $scope.apiJson.Tipo = 2

        console.log(JSON.stringify($scope.apiJson))

        let datalog = structuredClone(datalogAPI)
      
            datalog.idSucursal = $scope.idSucursal
            datalog.id_perTra = $scope.idPerTra
            datalog.opcion = 1        

        AuthToken = await promiseAutBPRO();

        datalog.tokenGenerado = AuthToken.Token
        datalog.unniqIdGenerado = AuthToken.UnniqId
        datalog.jsonEnvio = JSON.stringify($scope.apiJson)

        let respLog = await LogApiBpro(datalog)

        datalog.consecutivo = respLog.folio
        datalog.opcion = 2

        resPoliza = await GeneraPolizaBPRO(AuthToken.Token,JSON.stringify($scope.apiJson))

        if(resPoliza.Codigo === '200 OK'){
            datalog.anioPol = resPoliza.Poliza[0].añoPoliza
            datalog.consPol = resPoliza.Poliza[0].ConsecutivoPoliza
            datalog.empresaPol = resPoliza.Poliza[0].EmpresaPoliza
            datalog.mesPol =  resPoliza.Poliza[0].MesPoliza
            datalog.tipoPol = resPoliza.Poliza[0].TipoPoliza
            datalog.jsonRespuesta = JSON.stringify(resPoliza.Poliza[0])
            datalog.codigo = resPoliza.Codigo
            datalog.resuelto = 1

            respUpdate = await promiseActualizaTramite($scope.idPerTra,'CGFR', $scope.idComprobacionConcepto, $scope.incremental)

            $scope.getDataOrdenPagoGV();

            $('#loading').modal('hide');

            swal({
                title:"Aviso",
                type:"info",
                width: 1000,
                text:`La orden de pago genero la siguiente póliza
                Año póliza: ${datalog.anioPol}
                Mes póliza: ${datalog.mesPol}
                Cons póliza: ${datalog.consPol}
                Tipo póliza: ${datalog.tipoPol}
                
                No olvide subir el archivo PDF de la orden de pago al sistema`,
                showConfirmButton: true,
                showCloseButton:  false,
                timer:10000
            })
            
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
                timer:10000
            })
        }

        respLog = await LogApiBpro(datalog)

        // ordenDePagoFFAGRepository.sendPoliza( $scope.paramsPolizaCGFN ).then( (res) => {
        //     console.log("La poliza se ha creado", res);
        //     $scope.getDataOrdenPagoGV();
        // });
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

    $scope.getDocumentosUsuarioGV = function(idPertra){
        $scope.docTesoreria = [];
        anticipoGastoRepository.DocumentosGVOP(idPertra).then(res => {
            angular.forEach(res.data, (value, key) => {
                value.detIdPerTra = value.det_idPerTra;
                value.nombreDoc = value.doc_nomDocumento;
                value.rutaDocumento = value.url;
                value.estatusDoc = 'TRUE';
                value.estatus = value.estatusTramite;
             });
                angular.forEach(res.data, (value, key) => {
                    if (value.id_documento == 4) {
                        //|| value.id_documento == 46 || value.id_documento == 47) {
                            $scope.docTesoreria.push(value);
                            if( value.estatus === 3 ){
                                $scope.rechazoDeDocs = true;
                            }
                        }
                    }); 
        })
    }

});