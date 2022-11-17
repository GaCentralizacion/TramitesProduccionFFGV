registrationModule.controller('ordenDePagoFFAGController', function ($scope, $rootScope, $location, localStorageService, ordenDePagoRepository, aprobarDevRepository, aprobarRepository, devolucionesRepository, fondoFijoRepository, aprobarFondoRepository, ordenDePagoFFAGRepository, anticipoGastoRepository,apiBproRepository, traspasosFondoFijoRepository) {
                               
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
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";

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
            $scope.complementoPolizas = res.data[0].complementoPoliza;
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
            $scope.complementoPolizas = res.data[0].complementoPoliza;
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
                //$('#loading').modal('hide');
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
                $scope.evidenciasReembolsoHistorico = res.data[1] == undefined ? []: res.data[1];
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

            /**  */
            if($scope.idTramite == 10)
            {
                $scope.getDataOrdenPagoFF();
                $scope.insertaPolizaFF(documento);
                $scope.nombreTramite ='FONDO FIJO'
                // $scope.avanzaReembolso();
            }
            if($scope.idTramite == 9)
            {
                if($scope.EsTGM == 1){
                    $scope.sendPoliza();
                    $scope.nombreTramite ='GASTOS DE MAS'
                }
                else{
                    $scope.getDataOrdenPagoGV();
                    $scope.insertaPolizaGV(documento);
                    $scope.nombreTramite ='ANTICIPO DE GASTOS'
                    
                }
            }
            if($scope.idTramite == 16)
            {
                $scope.getDataOrdenPagoFFTramite();
                $scope.insertaPolizaFF(documento);
                $scope.nombreTramite ='FONDO FIJO'
            }

        } else {
            $("#loading").modal("hide");
            swal( 'Alto', `Carga el documento  "${ documento.nombreDoc }" para poder guardar.`, 'warning' );
        }

    }

    function GuardarDocumento(documento){
        return new Promise((resolve, reject) => {
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
                        resolve(true)
                        
                        
                    } else {
                        resolve(false)
                        swal( 'Alto', 'Error al guardar el documento, intentelo mas tarde', 'error' );
                    }
                });
            }, 500);
        })
    }

    $scope.saveDocumentosFATramite = (documento) => {
        $("#loading").modal("show");
        if (documento.archivo != undefined) {

            /**  */
            if($scope.idTramite == 10)
            {
                $scope.getDataOrdenPagoFF();
                $scope.insertaPolizaFF(documento);
                $scope.nombreTramite ='FONDO FIJO'
                // $scope.avanzaReembolso();
            }
            if($scope.idTramite == 9)
            {
                if($scope.EsTGM == 1){
                    $scope.sendPoliza();
                    $scope.nombreTramite ='GASTOS DE MAS'
                }
                else{
                    $scope.getDataOrdenPagoGV();
                    $scope.insertaPolizaGV(documento);
                    $scope.nombreTramite ='ANTICIPO DE GASTOS'
                }
            }
            if($scope.idTramite == 16)
            {
                $scope.getDataOrdenPagoFFTramite();
                $scope.insertaPolizaFF(documento);
                $scope.nombreTramite ='FONDO FIJO'
            }

        } else {
            $("#loading").modal("hide");
            swal( 'Alto', `Carga el documento  "${ documento.nombreDoc }" para poder guardar.`, 'warning' );
        }

    }

    function GuardarDocumentoReembolso(documento){
        return new Promise((resolve, reject) => {
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
                        resolve(true)
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
                      // swal( 'Listo', ` Se guardo el documento "${ documento.nombreDoc }"`, 'success' );
                      // $("#loading").modal("hide");
                    } else {
                        resolve(false)
                    }
                });
            }, 500);
        })
    }


    // $scope.changeEstatus = function(){
        
    //             if($scope.idTramite == 10)
    //             {
    //                 $scope.getDataOrdenPagoFF();
    //                 $scope.insertaPolizaFF();
    //                 $scope.nombreTramite ='FONDO FIJO'
    //                 // $scope.avanzaReembolso();
    //             }
    //             if($scope.idTramite == 9)
    //             {
    //                 if($scope.EsTGM == 1){
    //                     $scope.sendPoliza();
    //                     $scope.nombreTramite ='GASTOS DE MAS'
    //                 }
    //                 else{
    //                     $scope.getDataOrdenPagoGV();
    //                     $scope.insertaPolizaGV();
    //                     $scope.nombreTramite ='ANTICIPO DE GASTOS'
    //                 }
    //             }
    //             if($scope.idTramite == 16)
    //             {
    //                 $scope.getDataOrdenPagoFFTramite();
    //                 $scope.insertaPolizaFF();
    //                 $scope.nombreTramite ='FONDO FIJO'
    //                 $scope.avanzaReembolso();
    //             }

    // };

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

    $scope.insertaPolizaFF = async function (documento) {
        let CCDepto = zeroDelete($scope.cuentaContable);
        let banco = zeroDelete($scope.cuentaContableSalida);
        let respRFOP
        let respRFCS

        let validaRFOP = await ValidaPolizaCaja($scope.idSucursal, $scope.idPerTra, 'RFOP')

        if(validaRFOP[0].success == 1)
        {
           //No existe poliza y se genera
           respRFOP = await AplicaPolizaRFOP(documento)
        }
        else
        {
            respRFOP = true;
            swal({
                title:"Aviso",
                type:"success",
                width: 1000,
                text:validaRFOP[0].msg,
                showConfirmButton: true,
                showCloseButton:  false        
            }) 
            if(validaRFOP[0].msg == 'La poliza se encuentra procesada')
            {
                let respuetaDoc = await GuardarDocumentoReembolso(documento)
                if(respuetaDoc == true)
                {
                $scope.avanzaReembolso();
                ordenDePagoFFAGRepository.changeEstatusFA($scope.idPerTra,$scope.tipoTramite, $scope.consecutivoTramite).then((res)=>{
                    if( res.data[0].success == 1 ){

                    }
                });
               
                $scope.nombreTramite ='REEMBOLSO ORDEN PAGO RFOP'
                html = $scope.html1 + 'Se Proceso el Reembolso al fondo fijo:  ' + $scope.idFondoFijo +' ' + "<br><br> Se realizó reembolso por orden de pago por el monto de:  $"+ formatMoney($scope.monto) + "  " + $scope.html2;
                //$scope.sendMail('luis.bonnet@grupoandrade.com,eduardo.yebra@coalmx.com', $scope.nombreTramite, html);
                }
                else{
                swal( 'Alto', 'Error al guardar el documento, intentelo mas tarde', 'error' );
                 }
                // $scope.avanzaReembolso();
                // ordenDePagoFFAGRepository.changeEstatusFA($scope.idPerTra,$scope.tipoTramite, $scope.consecutivoTramite).then((res)=>{
                //     if( res.data[0].success == 1 ){
    
                //     }
                // });

            }       
           
        }

         if(respRFOP == true){
            $location.path('/tesoreriaHome');
            //     respRFCS = await AplicaPolizaRFCS()
         }

        // var tipoProceso = true;
        // tipoProceso = await promiseInsertaDatos($rootScope.user.usu_idusuario, $scope.idSucursal, $scope.tipo == 'FS' ? 1 : 12, $scope.idFondoFijo, $scope.monto, 'FONFIJ', $scope.tipo == 'FS' ? 'FFOP' : $scope.nombreDep, $scope.idPerTra, banco, CCDepto);
        // if(!tipoProceso)
        // {   swal('Alto', 'Ocurrio un error al crear la poliza', 'warning');}



    }

    $scope.insertaPolizaGV = async function (documento) {
        let banco = zeroDelete($scope.cuentaContableSalida);
        let respGVOP
        let respGVTE
        let respDocument
        let AG = `AG-${$scope.emp_nombrecto}-${$scope.suc_nombrecto}-${$scope.dep_nombrecto}-${$scope.idPerTra}-${$scope.incremental}`

        let existePoliza = await ValidaPolizaGV($scope.idSucursal,$scope.idPerTra,'GVOP',AG,$scope.monto)

        /** si success == 1 la poliza no existe y se puede insertar */
        if(existePoliza.success == 1){
            respGVOP = await AplicaPolizaGVOP(AG)
            if(respGVOP == true){
                respGVTE = await AplicaPolizaGVTE()

                if(respGVTE == true){
                    respDocument = await GuardarDocumento(documento)
                    $scope.getComprobanteFA();

                    /** Generamos la notificacion al solicitante */
                    

                    let body = 'La orden de pago esta lista para ser descargada, puedes consultarla en la pantalla de comprobaciones'
                    SendNotificacionSolicitantePromise('Orden de pago lista', body,6)

                }

            }     
  
        }
    
        /** Si success == 2 la poliza existe y esta procesada */
       if(existePoliza.success == 2 ){

            /** Validamos si existe la poliza GVTE */
            existePoliza = await ValidaPolizaGV($scope.idSucursal,$scope.idPerTra,'GVTE',AG,$scope.monto)

            if(existePoliza.success == 1){
                respGVTE = await AplicaPolizaGVTE()
                
                if(respGVTE == true){
                    respDocument = await GuardarDocumento(documento)
                    $scope.getComprobanteFA();
                }
            }

            if(existePoliza.success == 2 ){
                swal('AVISO',existePoliza.msg,'info')
            }

            if(existePoliza.success == 3){
                swal('Aviso',existePoliza.msg, 'info')
            }

       }

       if(existePoliza.success == 3){
        swal('Aviso',existePoliza.msg, 'info')
       }
    
    }

    async function ValidaPolizaGV(idSucursal,idPertra,tipoPol,documento,importe){
        return new Promise((resolve, reject) => {
            anticipoGastoRepository.BuscaPolizaGV(idSucursal,idPertra,tipoPol,documento,importe).then(resp =>{
                resolve(resp.data[0])
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

    async function promiseAutBPRO(){
        return new Promise((resolve, reject) => {
            apiBproRepository.GetTokenBPRO().then(resp =>{
                console.log('resp: ',resp)
                resolve(resp.data)
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
         * @param {string} ordenCompra 
         * @param {number} consPol 
         * @param {number} mesPol 
         * @param {number} anioPol 
         * @returns 
         */
    async function promiseActualizaTramite(id_perTra,poliza,documentoConcepto= '',incremental = 0,ordenCompra = '', consPol = 0, mesPol= 0, anioPol = 0 )  {
        return new Promise((resolve, reject) => {
            anticipoGastoRepository.ActualizaTramitePoliza(id_perTra,poliza,documentoConcepto,incremental,ordenCompra, consPol, mesPol, anioPol).then(function (result) {
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

        let existePoliza = await ValidaPolizaGV($scope.idSucursal,$scope.idPerTra,'CGFR',$scope.idComprobacionConcepto,$scope.monto)
        
        if(existePoliza.success == 2 ){
            swal('AVISO',existePoliza.msg,'info')
            return
        }

        if(existePoliza.success == 3){
            swal('Aviso',existePoliza.msg, 'info')
            return
        }

        $scope.apiJson.ContabilidadMasiva.Polizas[0].Proceso = `CGFR${$scope.complementoPolizas}`
        $scope.apiJson.ContabilidadMasiva.Polizas[0].DocumentoOrigen = $scope.idComprobacionConcepto
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Canal = `CGFR${$scope.complementoPolizas}`
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Documento = $scope.ordenCompra
        $scope.apiJson.ContabilidadMasiva.Polizas[0].Referencia2 =  $scope.ordenCompra
        $scope.apiJson.ContabilidadMasiva.Polizas[0].ReferenciaA = $scope.ordenCompra

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

        if(AuthToken.Token.includes('Error al generar el token de api')){

            datalog.tokenGenerado = AuthToken.Token
            datalog.unniqIdGenerado = ''
            datalog.jsonEnvio = JSON.stringify($scope.apiJson)
            datalog.mensajeError = JSON.stringify(AuthToken.Error) 

            let respLog = await LogApiBpro(datalog)

            swal({
                title:"Aviso",
                type:"error",
                width: 1000,
                text: `Se presento un problema al generar el token del api de BPRO
                El trámite no ha sido procesado, favor de notificar al área de sistemas 
                
                Codigo: Error al generar el token de api \n folio bitácora: ${respLog.folio}
                
                Reitentar cuando se le notifique la solución a la incidencia`,
                showConfirmButton: true,
                showCloseButton:  false,
                //timer:10000
            })
            
            resolve(false)
            return
        }

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

            respUpdate = await promiseActualizaTramite($scope.idPerTra,'CGFR', $scope.idComprobacionConcepto, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

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
                //timer:10000
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
               // timer:10000
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
                            if( value.detEstatusIne === 3 ){
                                $scope.rechazoDeDocs = true;
                            }
                        }
                    }); 
        })
    }

    async function AplicaPolizaGVTE (){
        return new Promise( async (resolve, reject) => {
            let banco = zeroDelete($scope.cuentaContableSalida);
            let AuthToken;
            let AG = `AG-${$scope.emp_nombrecto}-${$scope.suc_nombrecto}-${$scope.dep_nombrecto}-${$scope.idPerTra}-${$scope.incremental}`
            let resPoliza
            let respUpdate

            //$('#loading').modal('show');

            let apiJson1Detalle = structuredClone(apiJsonBPRO1detalle)
    
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Proceso = `GVTE${$scope.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].DocumentoOrigen = AG
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Canal = `GVTE${$scope.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Documento = AG
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Referencia2 = AG
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].ReferenciaA = AG
    
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= AG
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '0'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto= 'AC'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Origen = banco
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.idCliente
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado =  AG
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario =  $scope.monto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = AG

            apiJson1Detalle.IdEmpresa = $scope.idEmpresa
            apiJson1Detalle.IdSucursal = $scope.idSucursal
            apiJson1Detalle.Tipo = 2

            console.log(JSON.stringify(apiJson1Detalle))

            let datalog = structuredClone(datalogAPI)
        
                datalog.idSucursal = $scope.idSucursal
                datalog.id_perTra = $scope.idPerTra
                datalog.opcion = 1        

            AuthToken = await promiseAutBPRO();

            if(AuthToken.Token.includes('Error al generar el token de api')){

                datalog.tokenGenerado = AuthToken.Token
                datalog.unniqIdGenerado = ''
                datalog.jsonEnvio = JSON.stringify($scope.apiJson)
                datalog.mensajeError = JSON.stringify(AuthToken.Error) 
    
                let respLog = await LogApiBpro(datalog)

                swal({
                    title:"Aviso",
                    type:"error",
                    width: 1000,
                    text: `Se presento un problema al generar el token del api de BPRO
                    El trámite no ha sido procesado, favor de notificar al área de sistemas 
                    
                    Codigo: Error al generar el token de api \n folio bitácora: ${respLog.folio}
                    
                    Reitentar cuando se le notifique la solución a la incidencia`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })
                
                resolve(false)
                return
            }

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

                respUpdate = await promiseActualizaTramite($scope.idPerTra,'GVTE', AG, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

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
                    //timer:10000
                })

                resolve(true)
                
            }else{

                //$('#loading').modal('hide');


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

        })
    }


    async function AplicaPolizaGVOP (AG){
        return new Promise( async (resolve, reject) => {
            let AuthToken;
            
            let resPoliza
            let respUpdate

            // $('#loading').modal('show');

            $scope.apiJson.ContabilidadMasiva.Polizas[0].Proceso = `GVOP${$scope.complementoPolizas}`
            $scope.apiJson.ContabilidadMasiva.Polizas[0].DocumentoOrigen = AG
            $scope.apiJson.ContabilidadMasiva.Polizas[0].Canal = `GVOP${$scope.complementoPolizas}`
            $scope.apiJson.ContabilidadMasiva.Polizas[0].Documento = AG
            $scope.apiJson.ContabilidadMasiva.Polizas[0].Referencia2 =  AG
            $scope.apiJson.ContabilidadMasiva.Polizas[0].ReferenciaA = AG

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
            //AuthToken = await AuthApi()

            if(AuthToken.Token.includes('Error al generar el token de api')){

                datalog.tokenGenerado = AuthToken.Token
                datalog.unniqIdGenerado = ''
                datalog.jsonEnvio = JSON.stringify($scope.apiJson)
                datalog.mensajeError = JSON.stringify(AuthToken.Error) 
    
                let respLog = await LogApiBpro(datalog)

                swal({
                    title:"Aviso",
                    type:"error",
                    width: 1000,
                    text: `Se presento un problema al generar el token del api de BPRO
                    El trámite no ha sido procesado, favor de notificar al área de sistemas 
                    
                    Codigo: Error al generar el token de api \n folio bitácora: ${respLog.folio}
                    
                    Reitentar cuando se le notifique la solución a la incidencia`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })
                
                resolve(false)
                return
            }

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

                respUpdate = await promiseActualizaTramite($scope.idPerTra,'GVOP', AG, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

                $scope.getDataOrdenPagoGV();
                $scope.nombreTramite ='ANTICIPO DE GASTOS'

                // $('#loading').modal('hide');

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
                    //timer:10000
                })

                resolve(true)
                
            }else{

                // $('#loading').modal('hide');


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

        })
    }


    async function AplicaPolizaRFOP (documento){
        return new Promise( async (resolve, reject) => {
            let SubProducto = zeroDelete($scope.cuentaContable);   
            let Origen = zeroDelete($scope.cuentaContableSalida);   
            let AuthToken;
            let FF =  $scope.idFondoFijo
            let resPoliza
            let respUpdate

            $('#loading').modal('show');

            let apiJson1Detalle = structuredClone(apiJsonBPRO1detalle)

            apiJson1Detalle.IdEmpresa = $scope.idEmpresa
            apiJson1Detalle.IdSucursal = $scope.idSucursal
            apiJson1Detalle.Tipo = 2

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Proceso = `RFOP${$scope.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].DocumentoOrigen = FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Canal = `RFOP${$scope.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Documento = FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Referencia2 =  FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].ReferenciaA =  $scope.idPerTra.toString()


            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '1'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto= $scope.nombreDep
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto = SubProducto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Origen = Origen
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoCambio = '1'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.monto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.idCliente
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = FF 
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = FF

            console.log(JSON.stringify(apiJson1Detalle))

            let datalog = structuredClone(datalogAPI)
        
                datalog.idSucursal = $scope.idSucursal
                datalog.id_perTra = $scope.idPerTra
                datalog.opcion = 1        

            AuthToken = await promiseAutBPRO();
            
            if(AuthToken.Token.includes('Error al generar el token de api')){

                datalog.tokenGenerado = AuthToken.Token
                datalog.unniqIdGenerado = ''
                datalog.jsonEnvio = JSON.stringify($scope.apiJson)
                datalog.mensajeError = JSON.stringify(AuthToken.Error) 
    
                let respLog = await LogApiBpro(datalog)

                swal({
                    title:"Aviso",
                    type:"error",
                    width: 1000,
                    text: `Se presento un problema al generar el token del api de BPRO
                    El trámite no ha sido procesado, favor de notificar al área de sistemas 
                    
                    Codigo: Error al generar el token de api \n folio bitácora: ${respLog.folio}
                    
                    Reitentar cuando se le notifique la solución a la incidencia`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })
                
                resolve(false)
                return
            }

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

                //respUpdate = await promiseActualizaTramite($scope.idPerTra,'GVOP', AG, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)
                let respuetaDoc = await GuardarDocumentoReembolso(documento)
                if(respuetaDoc == true)
                {
                $scope.avanzaReembolso();
                ordenDePagoFFAGRepository.changeEstatusFA($scope.idPerTra,$scope.tipoTramite, $scope.consecutivoTramite).then((res)=>{
                    if( res.data[0].success == 1 ){

                    }
                });
               

               // $scope.getDataOrdenPagoFF();
                $scope.nombreTramite ='REEMBOLSO ORDEN PAGO RFOP'

                html = $scope.html1 + 'Se Proceso el Reembolso al fondo fijo:  ' + $scope.idFondoFijo +' ' + "<br><br> Se realizó reembolso por orden de pago por el monto de:  $"+ formatMoney($scope.monto) + "  " + $scope.html2;
                $scope.sendMail('luis.bonnet@grupoandrade.com,eduardo.yebra@coalmx.com', $scope.nombreTramite, html);
                //$scope.sendMail(respUpdate.correo, respUpdate.asunto, html);
            }
            else{
                swal( 'Alto', 'Error al guardar el documento, intentelo mas tarde', 'error' );
            }
                $('#loading').modal('hide');

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

        })
    }

    async function AplicaPolizaRFCS (){
        return new Promise( async (resolve, reject) => {
            let SubProducto = zeroDelete($scope.cuentaContable);   
            let Origen = zeroDelete($scope.cuentaContableSalida);   
            let AuthToken;
            let FF =  $scope.idFondoFijo
            let resPoliza
            let respUpdate

            $('#loading').modal('show');

            let apiJson1Detalle = structuredClone(apiJsonBPRO1detalle)

            apiJson1Detalle.IdEmpresa = $scope.idEmpresa
            apiJson1Detalle.IdSucursal = $scope.idSucursal
            apiJson1Detalle.Tipo = 2

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Proceso = `RFCS${$scope.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].DocumentoOrigen = FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Canal = `RFCS${$scope.complementoPolizas}`
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Documento = FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Referencia2 =  FF

            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= FF
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '1'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto= $scope.nombreDep
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto = SubProducto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Origen = Origen
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoCambio = '1'
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.monto
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.idCliente
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = FF 
            apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = FF

            console.log(JSON.stringify(apiJson1Detalle))

            let datalog = structuredClone(datalogAPI)
        
                datalog.idSucursal = $scope.idSucursal
                datalog.id_perTra = $scope.idPerTra
                datalog.opcion = 1        

            AuthToken = await promiseAutBPRO();
            
            if(AuthToken.Token.includes('Error al generar el token de api')){

                datalog.tokenGenerado = AuthToken.Token
                datalog.unniqIdGenerado = ''
                datalog.jsonEnvio = JSON.stringify($scope.apiJson)
                datalog.mensajeError = JSON.stringify(AuthToken.Error) 
    
                let respLog = await LogApiBpro(datalog)

                swal({
                    title:"Aviso",
                    type:"error",
                    width: 1000,
                    text: `Se presento un problema al generar el token del api de BPRO
                    El trámite no ha sido procesado, favor de notificar al área de sistemas 
                    
                    Codigo: Error al generar el token de api \n folio bitácora: ${respLog.folio}
                    
                    Reitentar cuando se le notifique la solución a la incidencia`,
                    showConfirmButton: true,
                    showCloseButton:  false,
                    //timer:10000
                })
                
                resolve(false)
                return
            }

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

                //respUpdate = await promiseActualizaTramite($scope.idPerTra,'GVOP', AG, $scope.consecutivoTramite,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

                //$scope.getDataOrdenPagoFF();
                $scope.nombreTramite ='REEMBOLSO ORDEN PAGO'

                html = $scope.html1 + 'Se Proceso el Reembolso al fondo fijo:  ' + $scope.idFondoFijo +' ' + "<br><br> Se realizó reembolso por orden de pago por el monto de:  $"+ formatMoney($scope.monto) + "  " + $scope.html2;
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

        })
    }

    $scope.sendRechazo = function (){
        if ($scope.razonesRechazo == '' || $scope.razonesRechazo === undefined || $scope.razonesRechazo=== null) {
            swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
        } else {
            $("#rechazarDoc").modal("hide");
            $("#loading").modal("show");
            ordenDePagoFFAGRepository.rechazarDocumento($scope.sendDetIdPerTra, $scope.razonesRechazo, $scope.idPerTra, $scope.id_documento, $rootScope.user.usu_idusuario).then((res) => {
                if (res.data[0].success == 1) {
                    $("#loading").modal("hide");
                    $scope.sendMail(res.data[0].destinatarios, ` INE incorrecto trámite ${$scope.idPerTra} de Gastos de Viaje`, res.data[0].html);
                    $scope.getDocumentosUsuarioGV($scope.idPerTra)
                    $scope.razonesRechazo = '';
                    $scope.sendDetIdPerTra = 0;
                    swal('Listo', `${res.data[0].msg} \n El usuario solicitante ha sido notificado`, 'success');
                } else {
                    $scope.sendDetIdPerTra = 0;
                    $("#loading").modal("hide");
                    swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
                }
            });
        }
    }

    async function ValidaPolizaCaja (idsucursal, id_perTraReembolso, tipoPol) {
        return new Promise((resolve, reject) => {
            traspasosFondoFijoRepository.validaPoliza(idsucursal, id_perTraReembolso, tipoPol).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
        });
    });
    }

    function SendNotificacionSolicitantePromise(asunto, body, tipoNot,correo='',idUsuarioAux= 0, nombre= ''){
        return new Promise((resolve, reject) =>{

            var usuario
            var nombreSol
            var descripcion
            let correoSolicitante 

               
            if(tipoNot == 5){
                usuario = idUsuarioAux
                correoSolicitante = correo
                nombreSol = nombre
                descripcion = body
            }


            $scope.dominioCorreoValido = false;
    
            for(let i = 0 ; i < $scope.dominiosValidos.length ; i++){
    
                if(correoSolicitante.includes($scope.dominiosValidos[i].dominio)){
                    $scope.dominioCorreoValido = true;
                }
            }
    
            if(!$scope.dominioCorreoValido){
                swal('Aviso','El correo no pertenece a Grupo Andrade, es necesario levantar un ticket y solicitar su cuenta de correo institucional para poder solicitar sus gastos', 'warning');
                return;
            }

            var notG = {
                "identificador": parseInt($scope.idSolicitud),
                "descripcion": descripcion, //"El usuario " + nombreSol + " a solicitado un anticipo de gasto ",
                //" por la cantidad de $" + $scope.monto.toFixed(2) + " pesos.",
                "idSolicitante":  usuario,
                "idTipoNotificacion": tipoNot,
                "linkBPRO": '',//global_settings.urlCORS + "aprobarAnticipoGasto?idSolicitud=" + $scope.idSolicitud,
                "notAdjunto": "",
                "notAdjuntoTipo": "",
                "idEmpresa": $scope.selEmpresa,
                "idSucursal": $scope.selSucursal,
                "departamentoId":  $scope.selDepartamento
            };

            $scope.sendMail(correoSolicitante, asunto, body);            
            $scope.guardarBitacoraProceso(usuario, localStorage.getItem('id_perTra'), 0, JSON.stringify(notG), 1, 1);

            anticipoGastoRepository.notificaInformaGV(notG).then(function (result) {
                if (result.data[0].success == true) {

                    resolve(true)
                } else {
                    swal("Atencion!", "No fue posible generar la notificación ...", "warning");
                    resolve(false)
                }
            });

        })
    }

     function DominiosGA(){
        return new Promise((resolve, reject)  => {
            anticipoGastoRepository.DominiosGA().then(res => {
                resolve(res.data)
            });
        })
    }

    $scope.guardarBitacoraProceso = function (idUsuario,id_perTra,idEstatus,accion,bitacora, proceso) {
        dataSave = {
            idUsuario:  idUsuario,
            id_perTra: id_perTra,
            idEstatus : idEstatus,
            accion : accion,
            bitacora : bitacora,
            proceso : proceso}
        fondoFijoRepository.saveBitProceso(dataSave).then((res) => {
        });
    }

});