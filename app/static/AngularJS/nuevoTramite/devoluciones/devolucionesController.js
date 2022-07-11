registrationModule.controller('devolucionesController', function($scope, $rootScope, $location, localStorageService, devolucionesRepository, aprobarDevRepository,$timeout, utils) {

    $scope.empresas = [];
    $scope.sucursales = [];
    $scope.formasPago = [];
    $scope.departamentos = [];
    $scope.documentos = [];
    $scope.selDepartamento = 0;
    $scope.selEmpresa = 0;
    $scope.selSucursal = 0;
    $scope.selFormaPago = 0;
    $scope.observaciones = '';
    $scope.disabledSuc = true;
    $scope.disabledSearch = true;
    $scope.saldo = 0;
    $scope.errDocs = 0;
    $scope.nuevo_Actualiza = true;
    $scope.verImagen = '';
    $scope.modalTitle = '';
    $scope.traEstatus = 0;
    $scope.nombreEstatus = 0;
    $scope.numeroSolicitud = '';
    $scope.verComentarios = false;
    $scope.obervacionesDoc = '';
    $scope.observacionesDelTramite = '';
    $scope.verObservacionesTramite = false;
    $scope.amount = 0;
    $scope.idCliente;
    $scope.verDocumentacion = false
    $scope.dataCliente = [];
    $scope.documentosCliente = [];
    $scope.checkAll;
    $scope.validaIdPerTra;
    $scope.estatusDevolucion;
    $scope.allEstatusDevolucion = [];
    $scope.dataDevDocumento = [];
    $scope.email = '';
    $scope.datosBancos = false;
    $scope.cuentaBancaria = '';
    $scope.numeroCLABE = '';
    $scope.bancoCveBanxico = []
    $scope.cveBanxico = '';
    $scope.bancoTipoCuenta =[];
    $scope.tipoCuenta = '';
    $scope.idPertra = 0;
    $scope.showDocumenosRechazados = true;
    $scope.documentoComprobante = []
    $scope.habilitaEditarCuenta = true;
    $scope.estatusProceso = null;
    $scope.origenBpro = 0;
    $scope.idPertraDisponible = 0;
    $scope.arrayTramitePendiente  = [];

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.validaIdPerTra = null;
        var p = [];
        p.push(devolucionesRepository.allEmpresas($rootScope.user.usu_idusuario));
        p.push(devolucionesRepository.allFormaPago());
       // p.push(devolucionesRepository.getBancoConcentra($scope.selEmpresa));
         p.push(devolucionesRepository.getBancoTipoCuenta());
         p.push(devolucionesRepository.motivoDevolucion());
        

        Promise.all(p).then(function (results) {
            console.log(results);
             $scope.empresas = results[0].data;
             $scope.formasPago = results[1].data;
            // $scope.bancoCveBanxico = res.data;
             $scope.bancoTipoCuenta = results[2].data;
             $scope.motivoDevolucionLst = results[3].data;
            if (!localStorage.getItem('borrador')) {
                $scope.nuevo_Actualiza = true;
                $scope.getDocumentosByTramite();
                $scope.numeroSolicitud = ''
                $scope.estatusDevolucion = 0;
            } else {
                $scope.numeroSolicitud = 'Devolución No. ' + JSON.parse(localStorage.getItem('borrador')).idPerTra;
                $scope.idPertraDisponible = JSON.parse(localStorage.getItem('borrador')).idPerTra ;
                $scope.getDataBorrador();
                $scope.getComprobante();
                $scope.getDocumentosByTramite();
                $scope.nuevo_Actualiza = false;
                $scope.validaIdPerTra = JSON.parse(localStorage.getItem('borrador')).idPerTra;
            }   

        });

        
        // $scope.getAllEmpresas();
        // $scope.getAllFormaPago();
        // $scope.getBancoCVEBanxico();
        // $scope.getBancoTipoCuenta();
        // $scope.getMotivoDevolucion();
       
       
    };

    $scope.getDataBorrador = function() {
        devolucionesRepository.dataBorrador(JSON.parse(localStorage.getItem('borrador')).idPerTra).then((res) => {
            $scope.estatusDevolucion = res.data[0].orden;
            $scope.idCliente = res.data[0].persona;
            $scope.observacionesDelTramite = res.data[0].observacionesTramite;
            $scope.traEstatus = res.data[0].petr_estatus;
            $scope.nombreEstatus = res.data[0].est_nombre;
            $scope.selEmpresa = res.data[0].id_empresa;
            $scope.getSucursal();
            $scope.selFormaPago = res.data[0].id_formaPago;
            $scope.observaciones = res.data[0].observaciones;
            $scope.selSucursal = res.data[0].id_sucursal;
            $scope.getImagesBorrador();
            $scope.selDepartamento = res.data[0].id_departamento;
            $scope.getDepartamentos();
            $scope.cuentaBancaria = res.data[0].cuentaBancaria;
            $scope.numeroCLABE = res.data[0].numeroCLABE;
            $scope.cveBanxico = res.data[0].cveBanxico;
            $scope.tipoCuenta = res.data[0].tipoCuentaBancaria;
            $scope.estatusProceso = res.data[0].esDe_IdEstatus;
            $scope.origenBpro = res.data[0].origenBpro;
            res.data[0].devTotal == null ? $scope.amount = '' : $scope.amount = res.data[0].devTotal;
            $scope.estatustramite = res.data[0].esDe_IdEstatus;
           
            if ($scope.observacionesDelTramite != '') {
                $scope.verObservacionesTramite = true;
            } else {
                $scope.verObservacionesTramite = false;
            }
            if ($scope.selFormaPago != 0 && $scope.selDepartamento != 0 || $scope.selSucursal != 0) {
                $scope.disabledSearch = false;
            };
            $scope.verDocumentacion = true;
            $scope.getBancoCVEBanxico();
            $scope.getDataCliente(1);
            $scope.openWizard();
            $scope.bloquearCampos = true;
            $scope.motivoDev = res.data[0].idMotivo;
            $scope.motivoDevolucionLst.idMotivo = res.data[0].idMotivo;
        });
    }

    $scope.getImagesBorrador = function() {
        devolucionesRepository.imageBorrador(
                JSON.parse(localStorage.getItem('borrador')).idPerTra,
                JSON.parse(localStorage.getItem('borrador')).idTramite)
            .then((res) => {
                $scope.documentos = res.data;
                console.log('$scope.documentos', $scope.documentos)
                var totalDocumentosRechazados = 0
                angular.forEach($scope.documentos, (value, key)=>{
                    if( value.estatusDocumento === 3 ){
                        totalDocumentosRechazados += 1;
                    }
                    if(value.id_documento === 13 && value.estatusDocumento === 3 ){
                        $scope.habilitaEditarCuenta = false;
                    }
                    if($scope.origenBpro){
                        $scope.habilitaEditarCuenta = false;
                    }
                });
                
                if( totalDocumentosRechazados > 0 ){
                    $scope.showDocumenosRechazados = false;
                }else{
                    $scope.showDocumenosRechazados = true;
                };
            });
    }

    $scope.getAllEmpresas = function() {
        devolucionesRepository.allEmpresas($rootScope.user.usu_idusuario).then((res) => {
            $scope.empresas = res.data;
        });
    }

    $scope.getAllFormaPago = function() {
        devolucionesRepository.allFormaPago().then((res) => {
            $scope.formasPago = res.data;
        });
    }

    $scope.getSucuesales = function() {
        if ($scope.selEmpresa == null || $scope.selEmpresa == undefined) {
            $scope.selSucursal = 0;
            $scope.selEmpresa = 0;
            $scope.disabledSuc = true;
            $scope.disabledSearch = true;
            $scope.idCliente = '';
            $scope.selSucursal = 0;
            $scope.verDocumentacion = false;
        } else {
            $scope.getSucursal();
            $scope.getBancoCVEBanxico();
        }
    }

    $scope.getSucursal = function() {
        devolucionesRepository.sucByidEmpresa($scope.selEmpresa, $rootScope.user.usu_idusuario).then((res) => {
            $scope.sucursales = res.data;
            $scope.disabledSuc = false;
        });
    }

    $scope.habilitarSearch = function() {
        if ($scope.selSucursal == null || $scope.selSucursal == undefined) {
            $scope.idCliente = '';
            $scope.selSucursal = 0;
            $scope.verDocumentacion = false;
            $scope.disabledSearch = true;
        } else {
            $scope.getDepartamentos();
            $scope.disabledSearch = false;
        }
    }

    $scope.getDepartamentos = function() {
        devolucionesRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then((res) => {
            $scope.departamentos = res.data;
        });
    }

    $scope.getDocumentosByTramite = function() {
        $scope.documentos = [];
        devolucionesRepository.documentosByTramite($scope.selTramite).then((res) => {
            $scope.documentos = res.data;
            $scope.documentosCompletos = res.data;
        });
    };

    $scope.getComprobante = () => {
        aprobarDevRepository.imageComprobante(JSON.parse(localStorage.getItem('borrador')).idPerTra, 4).then((res)=>{
            $scope.documentoComprobante = res.data;
            console.log('$scope.documentoComprobante', $scope.documentoComprobante)
        });
    };

    $scope.getDataCliente = function(tipo) {
        $scope.datosBancos = false;
        $scope.arrayTramitePendiente  = [];
        $('#loading').modal('show');
        if( tipo == 0 ){
            $scope.amount = 0;
        }
        if ($scope.idCliente == '' || $scope.idCliente == 0) {
            swal('Alto', 'Ingresa el id del cliente', 'warning');
        } else {

            devolucionesRepository.tramitePendiente($scope.idCliente, $scope.selEmpresa, $scope.selSucursal).then((respuesta) => {
                
                if (respuesta.data.length> 0){
                    $scope.arrayTramitePendiente = respuesta.data;

               
                     if (tipo == 0) {
                        $('#modalTramPendiente').modal('show');
                    }
                }
              
                devolucionesRepository.clientePerPersona($scope.idCliente, $scope.selEmpresa, $scope.selSucursal).then((res) => {
                    if (res.data.length > 0) {
                        // if( res.data[0].saldo > 0 ){
                            $scope.dataCliente = res.data[0];
                            $scope.getDocumentosCliente(tipo);
                            $scope.verDocumentacion = true;
                        // }else{
                        //     $scope.dataCliente = res.data[0];
                        //     $scope.verDocumentacion = true;
                        //     $scope.documentosCliente = [];
                        //     $('#tableDocumentos').DataTable().destroy();
                        //     setTimeout(() => {
                        //         $('#tableDocumentos').DataTable({
                        //             destroy: true,
                        //             "responsive": true,
                        //             searching: true,
                        //             paging: true,
                        //             autoFill: false,
                        //             fixedColumns: true,
                        //             pageLength: 5,
                        //             "order": [[ 1, "desc" ]],
                        //             "language": {
                        //                 search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        //                 searchPlaceholder: 'Buscar',
                        //                 oPaginate: {
                        //                     sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        //                     sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        //                 }
                        //             }       
                        //         });
                        //         $('#tableDocumentos_length').hide();
                        //     }, 500);
                        // }
                        $('#loading').modal('hide');
                    } else {
                        $('#loading').modal('hide');
                        $scope.verDocumentacion = false;
                        swal('Alto', 'No existen datos para ese cliente', 'warning');
                    }
                });



            })

      
        }
    }

    $scope.getDocumentosCliente = function(tipo) {
        var cont = 0;
        devolucionesRepository.clienteDocumentos(
            $scope.idCliente,
            $scope.selEmpresa,
            $scope.selSucursal,
            tipo,
            !localStorage.getItem('borrador') ? 0 : JSON.parse(localStorage.getItem('borrador')).idPerTra
        ).then((res) => {
            $scope.documentosCliente = res.data;
            angular.forEach($scope.documentosCliente, (value, key) => {
                if (value.devFinal == 0) {
                    value.devFinal = '';
                }
            });
            $scope.showDatosBanco()
            $('#tableDocumentos').DataTable().destroy();
            setTimeout(() => {
                $('#tableDocumentos').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[ 1, "desc" ]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }       
                });
                $('#tableDocumentos_length').hide();
            }, 500);
        });
    };

    $scope.getBancoCVEBanxico = function(){
        // devolucionesRepository.getBancoCVEBanxico().then((res)=>{
        //     $scope.bancoCveBanxico = res.data;
        // });
        devolucionesRepository.getBancoConcentra($scope.selEmpresa).then((res)=>{
            $scope.bancoCveBanxico = res.data;
        });
    }

    $scope.checkDocumento = function(documento) {
        console.log($scope.documentosCliente, 'Documentos devoluciones')
        var noEfectivo = 0;
        var siEfectivo = 0;
        var auxiliarDocumentos = [];
        $scope.documentos = $scope.documentosCompletos;
        angular.forEach($scope.documentosCliente, (value, item) => {
            if (value.checado && value.efectivo == 0) {
                siEfectivo = 1;
            } else if (value.checado && value.efectivo == 1) {
                noEfectivo = 1;
            }
        });
        if (siEfectivo == 1 && noEfectivo == 0) {
            angular.forEach($scope.documentos, (value, item) => {
                if (value.efectivo == 1) {
                    value.opcional = !value.mandatorioEfectivo;
                    auxiliarDocumentos.push(value);
                }
            });
            $scope.documentos = auxiliarDocumentos;
        } else if (siEfectivo == 0 && noEfectivo == 1) {
            angular.forEach($scope.documentos, (value, item) => {
                if (value.bancario == 1) {
                    value.opcional = !value.mandatorioBancario;
                    auxiliarDocumentos.push(value);
                }
            });
            $scope.documentos = auxiliarDocumentos;
        } 
        else if (siEfectivo == 1 && noEfectivo == 1) {
            // $scope.documentos = $scope.documentosCompletos;
            angular.forEach($scope.documentos, (value, item) => {
                if (value.bancario == 1 || value.efectivo == 1) {
                    value.opcional = (value.mandatorioBancario || value.mandatorioEfectivo) == 1 ? 0 : 1;
                    auxiliarDocumentos.push(value);
                }
            });
            $scope.documentos = auxiliarDocumentos;
        }
        if (documento.checado) {
            documento.devFinal = parseFloat(documento.saldofinal).toFixed(2);
        } else {
            documento.devFinal = '';
        }
        $scope.sumarValores();
        $scope.showDatosBanco();
    }

    $scope.showDatosBanco = function(){
        var contador = 0
        
        angular.forEach($scope.documentosCliente, (value, item) =>{
            if( value.checado && value.efectivo == 1 ){
                contador += 1;
            }
        });

        if( contador > 0 ){
            $scope.datosBancos = true;
        }else{
            $scope.datosBancos = false;
            $scope.cuentaBancaria = '';
            $scope.numeroCLABE = '';
        }
    }

    $scope.selAll = function(checkAll) {
        if (checkAll) {
            angular.forEach($scope.documentosCliente, (value, key) => {
                if (!value.checado) {
                    value.checado = true;
                    value.devFinal = parseFloat(value.saldofinal).toFixed(2);
                }
            });
        } else {
            angular.forEach($scope.documentosCliente, (value, key) => {
                if (value.checado) {
                    value.checado = false;
                    value.devFinal = '';
                }
            });
        }
        $scope.sumarValores();
        $scope.showDatosBanco();
    }

    $scope.sumarValores = function() {
        $scope.amount = 0.00;
        angular.forEach($scope.documentosCliente, (value, key) => {
            if (value.checado) {
                if (value.devFinal > value.saldofinal) {
                    value.devFinal = value.saldofinal.toFixed(2);
                    swal('Alto', 'No puedes devolver mas del valor del documento', 'warning');
                    $scope.amount += parseFloat(value.devFinal);
                } else {
                    $scope.amount += parseFloat(value.devFinal);
                }
            }
        });
    }

    $scope.guardarTramite = function() {
        
        var dataSave = {
            idUsuario: $rootScope.user.usu_idusuario,
            idTramite: $scope.selTramite,
            idEmpresa: $scope.selEmpresa,
            idSucursal: $scope.selSucursal,
            idFormaPago: $scope.selFormaPago,
            idDepartamento: $scope.selDepartamento,
            observaciones: $scope.observaciones,
            estatus: 5,
            devTotal: parseFloat($scope.amount),
            idCliente: $scope.idCliente,
            cuentaBancaria: $scope.cuentaBancaria,
            numeroCLABE: $scope.numeroCLABE,
            cveBanxico: $scope.cveBanxico,
            bancoTipoCuenta: $scope.tipoCuenta,
            esDeIdEstatus: 0, // este estatus se debe de actualizar a 1 cuando se solicite el tramite
            idMotivo:$scope.motivoDev
        }
        
        swal({
                title: '¿Deseas guardar tu trámite?',
                text: 'Se guardara informacion del trámite',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Solicitar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {
                    $('#loading').modal('show');
                    $scope.guardarBorrador(dataSave);
                } else {
                    swal(
                        'Cancelado',
                        'No se guardaron el trámite',
                        'error'
                    );
                }
            });
    }

    $scope.guardarBorrador = function(dataSave) {
        devolucionesRepository.saveTramite(dataSave).then((res) => {
            if (res.data[0].success == 1) {
                $scope.saveDocsBorrador(res.data[0].idPerTra, res.data[0].saveUrl, $scope.documentos, 0);
            }
        });
    }

    $scope.saveDocsBorrador = function(idPertra, saveUrl, documentos, contDocs) {
        var sendData = {};
        if (contDocs <= documentos.length - 1) {
            if (documentos[contDocs].archivo != undefined) {
                sendData = {
                    idDocumento: documentos[contDocs].id_documento,
                    idTramite: documentos[contDocs].id_tramite,
                    idPerTra: idPertra,
                    saveUrl: saveUrl + 'Devoluciones\\' + 'Devolucion_' + idPertra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                    archivo: documentos[contDocs].archivo['archivo']
                }
                devolucionesRepository.saveDocumentos(sendData).then((res) => {
                    if (res.data[0].success == 1) {
                        $scope.saveDocsBorrador(idPertra, saveUrl, documentos, contDocs + 1);
                    } else {
                        $scope.errDocs += 1;
                        $scope.saveDocsBorrador(idPertra, saveUrl, documentos, contDocs + 1);
                    }
                });
            } else {
                $scope.saveDocsBorrador(idPertra, saveUrl, documentos, contDocs + 1);
            }
        } else {
            $scope.saveDocumentosSeleccionados(idPertra);
        }
    }

    $scope.saveDocumentosSeleccionados = function(idPerTra) {
        var data = '';
        var efectivo = false;
        var noEfectivo = false;
        var formaPago = 0;

        for (var i = 0; i < $scope.documentosCliente.length; i++) {
            if ($scope.documentosCliente[i].checado) {
                if($scope.documentosCliente[i].efectivo == 1) // Transferencia
                {
                    noEfectivo = true;
                    formaPago = 2;
                }
                if($scope.documentosCliente[i].efectivo == 0) // Efectivo
                {
                    efectivo =  true;
                    formaPago = 1;
                }
               
            }
        }
        if(efectivo && noEfectivo){ //Mixto
            formaPago = 3;        
        }

        for (var i = 0; i < $scope.documentosCliente.length; i++) {
            if ($scope.documentosCliente[i].checado) {
    
                data = data + '' + $scope.documentosCliente[i].documento + ',' + $scope.documentosCliente[i].checado + ',' 
                + $scope.documentosCliente[i].devFinal + ',' + $scope.documentosCliente[i].tipoDoc + ',' + $scope.documentosCliente[i].cartera + ',' + $scope.documentosCliente[i].PAR_IDENPARA +','+formaPago+','+$scope.documentosCliente[i].docCancelacion+ '|';
            }
        }
        console.log( 'data',data );
        setTimeout(() => {
            devolucionesRepository.saveClienteDocumentos(idPerTra, data.substring(0, data.length - 1)).then((res) => {
                if (res.data[0].success == 1) {
                    $('#loading').modal('hide');
                    $scope.limpiarVariables();
                    if ($scope.errDocs > 0) {
                        swal('Atencion', 'No se guardo correctamente la devolución, intentelo mas tarde', 'warning');
                        $location.path('/misTramites');
                    } else {
                        swal('Listo', 'Se guardo la devolución correctamente', 'success');
                        $location.path('/misTramites');
                    }
                } else {
                    $('#loading').modal('hide');
                    $scope.limpiarVariables();
                    if ($scope.errDocs > 0) {
                        swal('Atencion', 'No se guardo correctamente la devolución, intentelo mas tarde', 'warning');
                        $location.path('/misTramites');
                    } else {
                        swal('Listo', 'Se guardo la devolución correctamente', 'success');
                        $location.path('/misTramites');
                    }
                }
            });
        }, 500)
    }

    $scope.solicitarTramite = function() {
        var docsCompleto = 0;
        var dataSave = {};

        angular.forEach($scope.documentos, (value, key) => {
            if (value.opcional == false && value.archivo == undefined)
                docsCompleto += 1;
        });
        if(!$scope.motivoDev){
            swal('Alto', 'Debe seleccionar un motivo de devolución', 'warning');

        }else if (docsCompleto > 0) {
            swal('Alto', 'Para solicitar el trámite debes adjuntar todos los documentos', 'warning');
        } else {
            if ($scope.selEmpresa == 0 || $scope.selSucursal == 0) {
                swal('Alto', 'Para solicitar el trámite debes seleccionar todos los campos', 'warning');
            } else {
                if ($scope.amount == '' || $scope.amount == undefined || parseInt($scope.amount) == 0) {
                    swal('Alto', 'Debes proprocionar el total de dinero de la devolución', 'warning');
                } else {
                    if(($scope.datosBancos) && 
                    ($scope.cuentaBancaria == '' || $scope.cuentaBancaria == null || $scope.cuentaBancaria == undefined ||
                    $scope.numeroCLABE == '' || $scope.numeroCLABE == null || $scope.numeroCLABE == undefined || 
                    $scope.cveBanxico == '' || $scope.cveBanxico == null ||$scope.cveBanxico == undefined || 
                    $scope.tipoCuenta == '' || $scope.tipoCuenta == null || $scope.tipoCuenta == undefined)){
                        setTimeout(() => { swal('Alto', 'Llena todos los campos del banco para poder solicitar el trámite', 'warning'); }, 100);
                    }else{
                        if($scope.datosBancos){
                            if ( $scope.numeroCLABE.length == 18 ){
                                if ($scope.numeroCLABE.substring(0, 3) == $scope.cveBanxico) {
                                    dataSave = {
                                        idUsuario: $rootScope.user.usu_idusuario,
                                        idTramite: $scope.selTramite,
                                        idEmpresa: $scope.selEmpresa,
                                        idSucursal: $scope.selSucursal,
                                        idFormaPago: $scope.selFormaPago,
                                        idDepartamento: $scope.selDepartamento,
                                        observaciones: $scope.observaciones,
                                        estatus: 6,
                                        devTotal: parseFloat($scope.amount),
                                        idCliente: $scope.idCliente,
                                        cuentaBancaria: $scope.cuentaBancaria,
                                        numeroCLABE: $scope.numeroCLABE,
                                        cveBanxico: $scope.cveBanxico,
                                        bancoTipoCuenta: $scope.tipoCuenta,
                                        esDeIdEstatus: 1,
                                        idMotivo:$scope.motivoDev
                                    }
                                    swal({
                                            title: '¿Deseas solicitar tu trámite?',
                                            text: 'Se enviará el trámite a aprobación',
                                            type: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Solicitar',
                                            cancelButtonText: 'Cancelar',
                                            closeOnConfirm: true,
                                            closeOnCancel: true
                                        },
                                        function(isConfirm) {
                                            if (isConfirm) {
                                                $('#loading').modal('show');
                                                devolucionesRepository.saveTramite(dataSave).then((res) => {
                                                    if (res.data[0].success == 1) {
                                                        $scope.saveDocumentosTramite(res.data[0].idPerTra, res.data[0].saveUrl, 0, $scope.documentos);
                                                        $scope.idPertra = res.data[0].idPerTra;
                                                        $scope.sendMailNotificacion();
                                                    }else{
                                                        $('#loading').modal('hide');
                                                        swal('Alto', 'Ocurrio un error al realizar el trámite.', 'warning');

                                                    }
            
                                                });
                                            } else {
                                                swal(
                                                    'Cancelado',
                                                    'No se aplicaron los cambios',
                                                    'error'
                                                );
                                            }
                                        });
    
                                }else{
                                    setTimeout(() => { swal('Alto', 'Digite una CLABE válida', 'warning'); }, 100);
    
                                }
    
                            }else{
                                setTimeout(() => { swal('Alto', 'La CLABE no contiene el número de carácteres permitidos', 'warning'); }, 100);
    
                            }

                        }else{
                            dataSave = {
                                idUsuario: $rootScope.user.usu_idusuario,
                                idTramite: $scope.selTramite,
                                idEmpresa: $scope.selEmpresa,
                                idSucursal: $scope.selSucursal,
                                idFormaPago: $scope.selFormaPago,
                                idDepartamento: $scope.selDepartamento,
                                observaciones: $scope.observaciones,
                                estatus: 6,
                                devTotal: parseFloat($scope.amount),
                                idCliente: $scope.idCliente,
                                cuentaBancaria: $scope.cuentaBancaria,
                                numeroCLABE: $scope.numeroCLABE,
                                cveBanxico: $scope.cveBanxico,
                                bancoTipoCuenta: $scope.tipoCuenta,
                                esDeIdEstatus: 1,
                                idMotivo:$scope.motivoDev
                            }
                            swal({
                                    title: '¿Deseas solicitar tu trámite?',
                                    text: 'Se enviará el trámite a aprobación',
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Solicitar',
                                    cancelButtonText: 'Cancelar',
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                function(isConfirm) {
                                    if (isConfirm) {
                                        $('#loading').modal('show');
                                        devolucionesRepository.saveTramite(dataSave).then((res) => {
                                            if (res.data[0].success == 1) {
                                                $scope.saveDocumentosTramite(res.data[0].idPerTra, res.data[0].saveUrl, 0, $scope.documentos);
                                                $scope.idPertra = res.data[0].idPerTra;
                                                $scope.sendMailNotificacion();
                                            }
    
                                        });
                                    } else {
                                        swal(
                                            'Cancelado',
                                            'No se aplicaron los cambios',
                                            'error'
                                        );
                                    }
                                });

                        }
                     


                       
                    }
                }
            }
        }
    };

    $scope.saveDocumentosTramite = function(idPertra, saveUrl, contDocs, documentos) {
        var sendData = {};

        if (contDocs <= documentos.length - 1) {

            if (documentos[contDocs].hasOwnProperty('archivo')) {
                sendData = {
                    idDocumento: documentos[contDocs].id_documento,
                    idTramite: documentos[contDocs].id_tramite,
                    idPerTra: idPertra,
                    saveUrl: saveUrl + 'Devoluciones\\' + 'Devolucion_' + idPertra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                    archivo: documentos[contDocs].archivo['archivo']
                }

                devolucionesRepository.saveDocumentos(sendData).then((res) => {
                    if (res.data[0].success == 1) {
                        $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos);
                    } else {
                        $scope.errDocs += 1;
                        $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos);
                    }
                });
            } else { $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos); }

        } else {
            $scope.saveDocumentosSeleccionados(idPertra);
        }

    };

    $scope.salirTramite = function() {
        $location.path('/misTramites');
    }

    $scope.actualizarTramite = function () {
        if ($scope.selEmpresa != 0) {
            if ($scope.amount == 0) {
                setTimeout(() => { swal('Alto', 'No puedes actualizar el monto en 0', 'warning'); }, 250);
            } else {
                if (($scope.datosBancos) && ($scope.cuentaBancaria == '' || $scope.cuentaBancaria == null || $scope.cuentaBancaria == undefined ||
                    $scope.numeroCLABE == '' || $scope.numeroCLABE == null || $scope.numeroCLABE == undefined || $scope.cveBanxico == '' || $scope.tipoCuenta === '')) {
                    setTimeout(() => { swal('Alto', 'No puedes actualizar sin agregar los datos bancarios', 'warning'); }, 250);
                } else {
                    if($scope.datosBancos){
                        if ($scope.numeroCLABE.length == 18) {
                            if ($scope.numeroCLABE.substring(0, 3) == $scope.cveBanxico) {
                                swal({
                                    title: '¿Deseas actualizar tu trámite?',
                                    text: 'Se sobreescribiran los datos del trámite',
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Actualizar',
                                    cancelButtonText: 'Cancelar',
                                    closeOnConfirm: true,
                                    closeOnCancel: true
                                },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $('#loading').modal('show');
                                            devolucionesRepository.updateBorrador(
                                                JSON.parse(localStorage.getItem('borrador')).idPerTra,
                                                $scope.selEmpresa,
                                                $scope.selFormaPago,
                                                $scope.observaciones,
                                                $scope.selSucursal,
                                                $scope.selDepartamento,
                                                parseFloat($scope.amount),
                                                $scope.idCliente,
                                                $scope.cuentaBancaria,
                                                $scope.numeroCLABE,
                                                $scope.cveBanxico,
                                                $scope.tipoCuenta
                                            ).then((res) => {
                                                if (res.data[0].success == 1) {
                                                    $scope.updateBorradorImages(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.documentos, 0);
                                                    $('#loading').modal('hide');
                                                }
                                            });
    
                                        } else {
                                            swal(
                                                'Cancelado',
                                                'No se aplicaron los cambios',
                                                'error'
                                            );
                                        }
                                    });
    
                            } else {
                                swal('Alto', 'Digite una CLABE válida', 'warning');
    
                            }
    
                        } else {
                            swal('Alto', 'La CLABE no contiene el número de carácteres permitidos', 'warning');
    
                        }

                    }else{
                        swal({
                            title: '¿Deseas actualizar tu trámite?',
                            text: 'Se sobreescribiran los datos del trámite',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Actualizar',
                            cancelButtonText: 'Cancelar',
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $('#loading').modal('show');
                                    devolucionesRepository.updateBorrador(
                                        JSON.parse(localStorage.getItem('borrador')).idPerTra,
                                        $scope.selEmpresa,
                                        $scope.selFormaPago,
                                        $scope.observaciones,
                                        $scope.selSucursal,
                                        $scope.selDepartamento,
                                        parseFloat($scope.amount),
                                        $scope.idCliente,
                                        $scope.cuentaBancaria,
                                        $scope.numeroCLABE,
                                        $scope.cveBanxico,
                                        $scope.tipoCuenta
                                    ).then((res) => {
                                        if (res.data[0].success == 1) {
                                            $scope.updateBorradorImages(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.documentos, 0);
                                            $('#loading').modal('hide');
                                        }
                                    });

                                } else {
                                    swal(
                                        'Cancelado',
                                        'No se aplicaron los cambios',
                                        'error'
                                    );
                                }
                            });

                    }
     





                }
            }
        }




    }

    $scope.updateBorradorImages = function(idPerTra, documentos, contDocs) {
        if (contDocs <= documentos.length - 1) {
            if (documentos[contDocs].existe > 0) {
                if (documentos[contDocs].archivo != undefined) {
                    sendData = {
                        idDocumento: documentos[contDocs].id_documento,
                        idTramite: documentos[contDocs].id_tramite,
                        idPerTra: idPerTra,
                        saveUrl: documentos[contDocs].saveUrl + 'Devoluciones\\' + 'Devolucion_' + idPerTra,
                        idUsuario: $rootScope.user.usu_idusuario,
                        extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                        archivo: documentos[contDocs].archivo['archivo'],
                        det_idPerTra: documentos[contDocs].det_idPerTra
                    }
                    devolucionesRepository.updateDocumentos(sendData).then((res) => {
                        $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
                    });
                } else {
                    $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
                }
            } else {
                if (documentos[contDocs].archivo != undefined) {
                    sendData = {
                        idDocumento: documentos[contDocs].id_documento,
                        idTramite: documentos[contDocs].id_tramite,
                        idPerTra: idPerTra,
                        saveUrl: documentos[contDocs].saveUrl + 'Devoluciones\\' + 'Devolucion_' + idPerTra,
                        idUsuario: $rootScope.user.usu_idusuario,
                        extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                        archivo: documentos[contDocs].archivo['archivo']
                    }
                    devolucionesRepository.saveDocumentos(sendData).then((res) => {
                        $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
                    });
                } else {
                    $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
                }
            }
        } else {
            $scope.saveDocumentosSeleccionados(idPerTra)
        }
    }

    $scope.solicitarTramiteBorrador = function() {
        swal({
                title: '¿Deseas solicitar tu trámite?',
                text: 'Se mandara la solicitud a revisión',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Solicitar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {
                    if ($scope.amount == '' || parseInt($scope.amount) == 0) {
                        setTimeout(() => { swal('Alto', 'Debes proprocionar el total de dinero de la devolución', 'warning'); }, 200);
                    } else {
                        var docsCompleto = 0;
                        angular.forEach($scope.documentos, (value, key) => {
                            if (value.existe == 0) {
                                if (value.archivo == undefined && value.opcional == false) {
                                    docsCompleto += 1;
                                }
                            }
                        });
                        
                        if (docsCompleto > 0) {
                            setTimeout(() => { swal('Alto', 'Carga todos los documentos para solicitar el trámite', 'warning'); }, 200);
                        } else {
                            if ($scope.selEmpresa == 0 || $scope.selSucursal == 0) {
                                setTimeout(() => { swal('Alto', 'Llena todos los campos para poder solicitar el trámite', 'warning'); }, 200);
                            } else {
                                if( ($scope.datosBancos) && ($scope.cuentaBancaria == '' || $scope.cuentaBancaria == null || $scope.cuentaBancaria == undefined ||
                                $scope.numeroCLABE == '' || $scope.numeroCLABE == null || $scope.numeroCLABE == undefined || $scope.cveBanxico == '' || $scope.tipoCuenta === '') ){
                                    setTimeout(() => { swal('Alto', 'Llena todos los campos del banco para poder solicitar el trámite', 'warning'); }, 200);
                                }else{
                                    $('#loading').modal('show');
                                    devolucionesRepository.updateBorradorSolicitado(JSON.parse(localStorage.getItem('borrador')).idPerTra).then((res) => {
                                        if (res.data[0].success == 1) {
                                            $scope.updateDatasSolicitar();
                                            $scope.sendMailNotificacion();
                                        } else {
                                            $('#loading').modal('hie');
                                            swal('Alto', 'Este trámite no se puede solicitar, intentelo mas tarde', 'warning')
                                        }
                                    });
                                }
                            }
                        }
                    }
                } else {
                    swal(
                        'Cancelado',
                        'No se envio el trámite',
                        'error'
                    );
                }
            });
    }

    $scope.updateDatasSolicitar = function() {
        devolucionesRepository.updateBorrador(
            JSON.parse(localStorage.getItem('borrador')).idPerTra,
            $scope.selEmpresa,
            $scope.selFormaPago,
            $scope.observaciones,
            $scope.selSucursal,
            $scope.selDepartamento,
            $scope.amount,
            $scope.idCliente,
            $scope.cuentaBancaria,
            $scope.numeroCLABE,
            $scope.cveBanxico,
            $scope.tipoCuenta
        ).then((res) => {
            if (res.data[0].success == 1) {
                $scope.updateBorradorImages(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.documentos, 0);
                $('#loading').modal('hide');
            } else {
                $('#loading').modal('hide');
                swal('Alto', 'No se puede solictar el trámite en este momento, intentalo mas tarde', 'error');
            }
        });
    }

    $scope.verImagenModal = function(documento) {
        if (documento.estatusDocumento == 3) {
            $scope.verComentarios = true;
            $scope.obervacionesDoc = documento.Observaciones;
        } else {
            $scope.verComentarios = false;
        }
        $scope.modalTitle = documento.doc_nomDocumento;
        $scope.verImagen = documento.url;
        $("#mostrarImagen").modal("show");
    }

    $scope.verPdf = function(documento) {
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
        $("#mostrarPdf").modal("show");
    }

    $scope.limpiarVariables = function() {
        $scope.selEmpresa = 0;
        $scope.selSucursal = 0; 
        $scope.selFormaPago = 0;
        $scope.selDepartamento = 0;
        $scope.observaciones = '';
        $scope.getDocumentosByTramite();
    }

    $scope.openWizard = function() {
        devolucionesRepository.estatusDevoluciones(JSON.parse(localStorage.getItem('borrador')).idPerTra).then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusDevolucion = res.data;
                $scope.tiempoTotal = res.data[0].tiempoTotal;
            } else {
                swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
            }
        });
    }

    $scope.finalizarTramite = function(){
        $('#finaizarTramite').modal('show');
    }

    $scope.cancelFinalizar = function(){
        $('#finaizarTramite').modal('hide');
    }

    $scope.sendMain = function(){
        $('#finaizarTramite').modal('hide');
        $('#loading').modal('show');
        var html = "<div style=\"width:310px;height:140px\">" + 
                    "<center>" + 
                        "<img style=\"width: 80% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" + 
                    "</center>" + 
                "</div>" +
                "<div>" + 
                    "<p>" + 
                        "Estimado " + $scope.dataCliente.paterno + ' ' + $scope.dataCliente.materno + ' ' + $scope.dataCliente.nombre + " su devolución se realizó con éxito." + 
                        "<br>Monto: $" + parseFloat($scope.amount).toFixed(2) + 
                    "</p>" +
                "</div>";
        devolucionesRepository.sendMailCliente($scope.email, "Devolución de pago en Grupo Andrade", html).then((res)=>{
            if( res.data.response.success == 1 ){
                $scope.sendFinalizarTramite(res.data.response.msg );
                $('#loading').modal('hide');
            }else{
                swal( 'Alto', res.data.response.msg, 'warning' );
                $('#loading').modal('hide');
            }
        });
    };

    $scope.sendFinalizarTramite = function(msg){
        $('#finaizarTramite').modal('hide');
        devolucionesRepository.updFinalizado(JSON.parse(localStorage.getItem('borrador')).idPerTra).then((res)=>{
            if( res.data[0].success == 1 ){
                setTimeout(() => {
                    $('#loading').modal('hide');
                    swal( 'Listo', msg, 'success' );
                    $scope.getDataBorrador();
                }, 500);
            }else{
                $('#loading').modal('hide');
                swal( 'Alto', 'Ocurrio un error', 'warning' );
            }
        });
    }

    $scope.getBancoTipoCuenta = function (){
        devolucionesRepository.getBancoTipoCuenta().then((res)=>{
            $scope.bancoTipoCuenta = res.data;
        });
    }

    $scope.sendMailNotificacion = function(){

        var data= {
            idTramite: 0,  
            idRol: 0,  
            idEmpresa: 0,
            idSucursal: 0
        }

        data.idTramite = $scope.selTramite;
        data.idRol = $rootScope.user.idRol;
        data.idEmpresa = $scope.selEmpresa;
        data.idSucursal = $scope.selSucursal;

       

        devolucionesRepository.getObtieneCorreoRol(data).then((resp)=>{
            if(resp.data[0].success === 1){

                var html = "<div style=\"width:310px;height:140px\">" + 
                                "<center>" + 
                                    "<img style=\"width: 80% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" + 
                                "</center>" + 
                            "</div>" +
                            "<div>" + 
                                "<p>" + 
                                    `El trámite número ${$scope.idPertra} para el cliente ${$scope.dataCliente.paterno} ${$scope.dataCliente.materno} ${$scope.dataCliente.nombre} debe ser revisado y aprobado por alguna de las siguientes personas ${resp.data[0].nombreUsuarioMail} para poder continuar con el proceso` + 
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
    }

    $scope.cancelarTramite = function() {
        swal({
            title: '¿Deseas cancelar tu trámite?',
            text: 'Se sobreescribirán los datos del trámite',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cancelar Trámite',
            cancelButtonText: 'Deshacer',
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $('#cancelTramite').modal('show');
                    // devolucionesRepository.cancelarTramite(JSON.parse(localStorage.getItem('borrador')).idPerTra).then((res) => {
                    //     $('#loading').modal('hide');
                    //     if(res.data[0].result == 1){
                           
                    //         $location.path('/misTramites');
                    //     }else{
                    //         swal( 'Alto', 'Ocurrió un error al realizar la cancelación del trámite', 'warning' );
                    //     }
                        
                       
                    // });

                } else {
                    swal(
                        'Acción Cancelada',
                        'No se aplicaron los cambios',
                        'error'
                    );
                }
            });
    }

    $scope.cancelar = function(){
        $('#cancelTramite').modal('hide');
    }
    $scope.enviarCancelacion = function () {

        devolucionesRepository.cancelarTramite(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.razonesCancelacion).then((res) => {
            $('#loading').modal('hide');
            if (res.data[0].result == 1) {
                swal('Éxito', 'Se canceló la devolución con éxito.', 'success');
                $timeout(function () {
                    $location.path('/misTramites');
                }, 5000);
             
            } else {
                swal('Alto', 'Ocurrió un error al realizar la cancelación del trámite', 'warning');
            }


        });

    }
    $scope.verComprobanteTransferencia = function() {
        aprobarDevRepository.documentoTransferencia(JSON.parse(localStorage.getItem('borrador')).idPerTra).then(function success(result) {
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

    $scope.getMotivoDevolucion = function (){
        devolucionesRepository.motivoDevolucion().then((res)=>{
            $scope.motivoDevolucionLst = res.data;
        });
    }

    $scope.validaCuenta = function () {

        devolucionesRepository.validaCuentaBancaria($scope.cuentaBancaria, '',  $scope.idCliente).then((res) => {
            if (res.data[0].estatus == 0) {
                swal("Atención!", "El número de cuenta ya se encuentra registrado para otro Id de cliente. Favor de revisar sus datos.", "warning");
                $scope.cuentaBancaria = "";
            }
        });


    }

});