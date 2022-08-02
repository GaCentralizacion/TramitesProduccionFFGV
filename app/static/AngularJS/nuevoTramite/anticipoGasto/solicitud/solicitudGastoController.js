registrationModule.controller('solicitudGastoController', function ($sce,$scope, $rootScope, $location, anticipoGastoRepository, devolucionesRepository, fondoFijoRepository, clientesRepository, $http, misTramitesValesRepository,rx) {
    $scope.subjetTest = '[PRUEBAS] ';
    $scope.usuario = {};
    $scope.empresas = [];
    $scope.sucursales = [];
    $scope.departamentos = [];
    $scope.areaAfectacionList = [];
    $scope.tipoComprobanteList = [];
    $scope.empleados = [];
    $scope.selDepartamento = 0;
    $scope.selEmpresa = 0;
    $scope.selSucursal = 0;
    $scope.selEmpleado = 0;
    $scope.idConceptoSeleccion = 0;
    $scope.idEmpleado = 0;
    $scope.accionTramite = 0;
    $scope.accionFormulario = 0;
    $scope.accionEnviar = false;
    $scope.idTipoProceso = 1;
    $scope.currentDate = '';
    $scope.nombreEmpleado = '';
    $scope.IDEmpleadoBPRO = 0;
    $scope.tieneEmpleado = false;
    $scope.idSolicitud = 0;
    $scope.idTramite = 0;
    $scope.subTitulo = '';
    $scope.conceptosSolicitud = [];
    $scope.conceptoGastoList = [];
    $scope.tramite = {};
    $scope.conceptoEdit = {};
    $scope.disabledSucursal = true;
    $scope.disabledDepto = true;
    $scope.disabledFechaFin = true;
    $scope.archivos = [];
    $scope.departamentosArchivo = [];
    $scope.conceptoArchivo = {};
    $scope.porcentaje = 0;
    $scope.porcentajeTotal = 0;
    $scope.errorMensaje = '';
    $scope.idEstatus = 0;
    $scope.politicaGasto = '';
    $scope.selCNC_CONCEPTO1 = '';
    $scope.empleadoList = [];
    $scope.conceptoXmlList = [];
    $scope.archivoRecibo = { nombreArchivo: '', archivo: null };
    $scope.concepto = {};
    $scope.registro = false;
    $scope.empresa = {};
    $scope.tipoRetencion = false;
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";
    $scope.aplicaUpdate = false;

    $scope.montoMaximoGV = 0;
    $scope.idtipoViaje = -1
    $scope.disabledTipoViaje = true;
    $scope.disabledConcepto = true;
    $scope.disabledMonto = true;
    $scope.mostrarCuentas = false;

    $scope.documento = {url:'',archivo:'', ext_nombre:'pdf', idDocumento:13};
    $scope.documentoINE =  {url:'',archivo:'', ext_nombre:'pdf', idDocumento:4};

    $scope.documentosCuentaUsuario = [];

    $scope.documentoComprobacion=[];

    $scope.general = {
        'template': {},
        'data': {},
        'options':{
            'reports': {
                'save': true
              }
        }
    };
    $scope.template = {
        'shortid': 'H1Jd0IiJD'
    }
    $scope.data = {
        'importes': {'monto':0},
        'usuario': {'nombre': ''},
        'empresa': {'nombre': ''}
    };

    $scope.salidaEfectivo = -1


    $scope.tramite = {
        kilometro: 50,
        idSolicitud: 0,
        concepto: '',
        fechaInicio: null,
        fechaFin: null,
        importe: 0,
        estatus: '',
        idEstatus: 1,
        idCompania: 0,
        idSucursal: 0,
        idDepartamento: 0,
        nombreCliente: '',
        empresa: '',
        sucursal: '',
        departamento: '',
        motivo: '',
        idPersona1: 0,
        idPersona:0,
        cuenta:{
            cveBanxico: '',
            clabe: '',
            cuenta: '',
            idBanco:'',
            banco:'',
            plaza:'',
            sucursal:'',
            estatus: 0
        }
    };
   
    $scope.selConceptoGasolina = false;
    $scope.hiddenOrdenCompra = true
    $scope.distancia = 50;
    $scope.token = ''
    $scope.checkmark = 0
    $scope.checkAll = false
    $scope.idpersonaAdicional = 0;
    $scope.dominiosValidos = [];
    $scope.usuarioActivo = 0;

    $scope.init = () => {
        $rootScope.usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log('usuarioActivo: ', $scope.usuarioActivo)
        $scope.ValidaEstatusActivo();
    }

    $scope.ValidaEstatusActivo = function (){
        anticipoGastoRepository.ValidaEstatusActivo($rootScope.usuario.usu_idusuario).then(resp => {
            console.log(resp.data)
            if(resp.data[0].estatusFinal === 1){
                $scope.usuarioActivo = 1;
                console.log('usuarioActivo: ', $scope.usuarioActivo)
                $scope.GetCorreosTesoreria();
                $scope.DominiosGA();
        
                $scope.currentDate = new Date().toISOString().substring(0, 10);
                if (!localStorage.getItem('borrador')) {
                    
                    $scope.traeEmpleado()
                    $scope.getAllEmpresas();
                    
                    $scope.titulo = 'Registro de Anticipo de Gasto';
                    $scope.accionTramite = 0;
                    $scope.controlCuentas = 0;
                    $scope.accionFormulario = 0;
                    $scope.recuperaCuentaAnterior(0);
                    $scope.checkAll = false
                    $scope.validaDistancia()
                } else {
                    $scope.idTramite = JSON.parse(localStorage.getItem('borrador')).idTramite;
                    $scope.idSolicitud = JSON.parse(localStorage.getItem('borrador')).idPerTra;
                    $scope.traeEmpleado();
                    $scope.getAnticipoGastoItem();
                    $scope.accionTramite = 1; 
                    $scope.aplicaUpdate = false;
                    $scope.controlCuentas = 1; 

                    anticipoGastoRepository.imageComprobanteOrdenPagoGV($scope.idSolicitud, $scope.idTramite , 'GV' ).then(res => {
                        if(res.data[0].url === undefined || res.data[0].url === null){
                            $scope.hiddenOrdenCompra = true
                        }
                        else{
                            $scope.hiddenOrdenCompra = false
                            $scope.documentoComprobacion = res.data;
                        }
                    })
                    anticipoGastoRepository.loadDocumentBanco($scope.idSolicitud,$scope.idTramite ).then(res => {
                        
                        for(let i=0; i < res.data.length; i++ ){
                            if(res.data[i].id_documento === 13 ){
                                $scope.documento = res.data[i];
                                if($scope.documento.archivo === undefined && $scope.documento.id_perTra=== null){
                                    $scope.documento.archivo = ''
                                }
                                
                            }else if(res.data[i].id_documento === 4 )
                            {
                                $scope.documentoINE=res.data[i];
                                if($scope.documentoINE.archivo === undefined && $scope.documentoINE.id_perTra === null){
                                    $scope.documentoINE.archivo = ''
                                }
                                //$scope.documentoINE = $scope.rutaDocumentosGV 'Persona_'
                            }
                        }
                       
                        
                        console.log('Documento: ',$scope.documento)
                        console.log('documentoComprobacion ', $scope.documentoComprobacion)
                    })  
                }  
            }else{
                $scope.usuarioActivo = 0;
                console.log('usuarioActivo: ', $scope.usuarioActivo)
                swal('Aviso','Usuario dado de baja','warning');
            }
        });
    }

    $scope.BuscaIne = function(){
        anticipoGastoRepository.BuscaIne($scope.selUsuario).then(res =>{
            for(let i=0; i < res.data.length; i++ ){
                if(res.data[i].id_documento === 13 ){
                    $scope.documento = res.data[i];
                    if($scope.documento.archivo === undefined && $scope.documento.id_perTra=== null){
                        $scope.documento.archivo = ''
                    }
                    
                }else if(res.data[i].id_documento === 4 )
                {
                    $scope.documentoINE=res.data[i];
                    if($scope.documentoINE.archivo === undefined && $scope.documentoINE.id_perTra === null){
                        $scope.documentoINE.archivo = ''
                    }
                   
                }
            }
        })
    }

    $scope.recuperaCuentaAnterior = function( flagUpdate ){
        anticipoGastoRepository.CuentaByPersona( $rootScope.usuario.usu_idusuario ).then( res => {
            if( res.data.length  != 0 ){
                $scope.tramite.cuenta = res.data[0];
                $scope.controlCuentas = 1

                if( flagUpdate == 1 ){
                    $scope.validaCuentaUpdate();
                }
            }
        });
    }

    $scope.nuevaCuenta = function(){
        $scope.aplicaUpdate = true;
        $scope.controlCuentas = 0;
        $("#cb_clave").focus();
        $scope.tramite.cuenta = {
                cveBanxico: '',
                clabe:'',
                cuenta:'',
                idBanco:'',
                banco:'',
                plaza:'',
                sucursal:'',
                estatus: 0
            }
    }

    $scope.traeEmpleado=function(){
        anticipoGastoRepository.getidPersonabyUsuario($rootScope.usuario.usu_idusuario).then(function successCallback(response) {
            $scope.tramite.idPersona1  = response.data[0].PER_IDPERSONA;
            $scope.selUsuario = response.data[0].PER_IDPERSONA;
            $scope.BuscaIne();
            if($scope.tramite.idPersona1 != 0){
                {$scope.buscarPersona($scope.tramite.idPersona1.toString(),1);} 
            }
            else{
                swal('Aviso','No se encontro usaurio en BPRO, favor de solicitar su alta','warning');
            }
            
        }, function errorCallback(response) {});
    }

    $scope.getAnticipoGastoItem = function () {
        anticipoGastoRepository.getAnticipoGastoById($scope.idSolicitud, 5).then((res) => {
            if (res.data != null && res.data.length > 0) {
                $scope.tramite = {
                    kilometro: res.data[0].kilometro,
                    idSolicitud: res.data[0].idSolicitud,
                    concepto: res.data[0].concepto,
                    fechaInicio: new Date(res.data[0].fechaInicio.substring(6, 10), res.data[0].fechaInicio.substring(3, 5) - 1, res.data[0].fechaInicio.substring(0, 2)),
                    fechaFin: new Date(res.data[0].fechaFin.substring(6, 10), res.data[0].fechaFin.substring(3, 5) - 1, res.data[0].fechaFin.substring(0, 2)),
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
                    urlServerDoctos: res.data[0].urlServerDoctos,
                    idPersona:  res.data[0].PER_IDPERSONA,
                    salidaEfectivo: res.data[0].idSalidaEfectivo,
                    cuenta:{
                        cveBanxico: '',
                        clabe: '',
                        cuenta: '',
                        idBanco:'',
                        banco:'',
                        plaza:'',
                        sucursal:'',
                        estatus: 0
                    }
                };

                $scope.checkAll = $scope.tramite.kilometro > 0 && $scope.tramite.kilometro !== undefined ? true : false; 
                $scope.tramite.cuenta.clabe = res.data[0].numeroCLABE;
                $scope.tramite.cuenta.cuenta = res.data[0].cuentaBancaria;

                anticipoGastoRepository.EstatusCuenta( res.data[0].cuentaBancaria ).then(resCuentaBanco =>{
                    console.log( "resCuentaBanco.data", resCuentaBanco.data );

                    $scope.tramite.cuenta.plaza = resCuentaBanco.data.length === undefined ? '' : resCuentaBanco.data.length < 1 ? '': resCuentaBanco.data[0].ca_plaza;
                    $scope.tramite.cuenta.sucursal = resCuentaBanco.data.length === undefined ? '' : resCuentaBanco.data.length < 1 ? '' : resCuentaBanco.data[0].ca_sucursal;
                    $scope.tramite.cuenta.estatus = resCuentaBanco.data.length === undefined ? '1' : resCuentaBanco.data.length < 1 ? '1' : resCuentaBanco.data[0].ca_estatus;
                    $scope.tramite.cuenta.banco = resCuentaBanco.data.length === undefined ? '' : resCuentaBanco.data.length < 1 ?'' : resCuentaBanco.data[0].ca_banconombre;
                    $scope.tramite.cuenta.cveBanxico = resCuentaBanco.data.length === undefined ? '' : resCuentaBanco.data.length < 1 ? '' : resCuentaBanco.data[0].ca_cvebanxico;
                    $scope.tramite.cuenta.idBanco = resCuentaBanco.data.length === undefined ? '' : resCuentaBanco.data.length < 1 ?'': resCuentaBanco.data[0].ca_idbanco;
                    $scope.comentariosrechazos = resCuentaBanco.data.length === undefined ? '' : resCuentaBanco.data.length < 1 ? '' : resCuentaBanco.data[0].observaciones;
                    $scope.mostrarCuentas = true;
                });

                //$scope.getBancoByCLABE();
                //$scope.GetDataByCuenta( $scope.tramite.cuenta.cuenta, $scope.tramite.idCompania );

                $scope.selEmpresa = $scope.tramite.idCompania;
                $scope.selSucursal = $scope.tramite.idSucursal;
                $scope.selDepartamento = $scope.tramite.idDepartamento;
                $scope.estatusAnticipo = res.data[0].idEstatus;
                $scope.salidaEfectivo = $scope.tramite.salidaEfectivo;
                $scope.openWizard();
                $scope.getAllEmpresas();
                $scope.getSucuesales($scope.selEmpresa);
                $scope.getDepartamentos($scope.selSucursal);
                $scope.getEmpleadosPorIdSolicitud();
                $scope.conceptosGastoPorSolicitud();
                $scope.disabledSucursal = false;
                $scope.disabledDepto = false;
                $scope.disabledFechaFin = false;
                $scope.accionFormulario = 0;
                $scope.idTipoProceso = 1
                $scope.titulo = 'Solicitud Anticipo de Gasto N° ' + res.data[0].idSolicitud;
                $scope.registro = true;

                ObtieneAutorizador()

            } else {
                swal('Anticipo de Gasto', 'No se encontró el registro', 'success');
                $location.path('/misTramites');
            }
        });
    };

    $scope.getAllEmpresas = function () {
        devolucionesRepository.allEmpresas($rootScope.usuario.usu_idusuario).then((res) => {
            $scope.empresas = res.data;
        });
    }

    $scope.changeFechaInicio = function () {
        $scope.tramite.fechaFin = null;
        if ($scope.tramite.fechaInicio == null) {
            $scope.disabledFechaFin = true;
        } else {
            $scope.disabledFechaFin = false;
        }
    }

    $scope.getSucuesales = function (idEmpresa) {
        $scope.selEmpresa = idEmpresa;
        if ($scope.selEmpresa == null || $scope.selEmpresa == undefined || $scope.selEmpresa == 0) {
            $scope.disabledSucursal = true;
            $scope.disabledDepto = true;
            $scope.selEmpresa = 0;
            $scope.selSucursal = 0;
            $scope.selDepartamento = 0;
        } else {
            devolucionesRepository.sucByidEmpresa($scope.selEmpresa,$rootScope.usuario.usu_idusuario).then((res) => {
                $scope.sucursales = res.data;
                $scope.disabledSucursal = false;
            });
        }

        // $scope.GetDataBancoByIdPersona();
    }

    $scope.getDepartamentos = function (idSucursal) {
        $scope.departamentos = [];
        $scope.selSucursal = idSucursal;
        if ($scope.selSucursal == null || $scope.selSucursal == undefined || $scope.selSucursal == 0) {
            $scope.disabledDepto = true;
            $scope.selSucursal = 0;
            $scope.selDepartamento = 0;
        } else {
            // devolucionesRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then((res) => {
            //     $scope.departamentos = res.data;
            //     $scope.disabledDepto = false;
            // });
            anticipoGastoRepository.getDepartametoAreaAfectacion($scope.selEmpresa, $scope.selSucursal).then((res) => {
                $scope.departamentos = res.data;
                $scope.disabledDepto = false;
            });
        }
    };

    $scope.getAreaAfectacion = function (accion) {
        $scope.areaAfectacionList = [];
        anticipoGastoRepository.getDepartametoAreaAfectacion($scope.selEmpresa, $scope.selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.areaAfectacionList = res.data;
                if(accion == 0){
                    $scope.areaAfectacionList.forEach(el => {
                        if(el.idDepartamento === $scope.selDepartamento){
                            $scope.selCNC_CONCEPTO1 = el.PAR_IDENPARA
                            $scope.asignarAreaAfectacion($scope.selCNC_CONCEPTO1)
                        }
                    })
                }
                if(accion == 1) {
                    var areaAfectacion = $scope.areaAfectacionList.filter(areaAfectacion => areaAfectacion.PAR_IDENPARA == $scope.conceptoEdit.areaAfectacion);
                    if (areaAfectacion.length > 0) {
                        $scope.conceptoEdit.areaDescripcion = areaAfectacion[0].descripcion;
                    }
                }
            }
        });
    }

    $scope.getCuentaContable = function () {
        var data = {
            idEmpresa: $scope.selEmpresa,
            idSucursal: $scope.selSucursal,
            CNC_CONCEPTO1: $scope.selCNC_CONCEPTO1,
            CNC_CONCEPTO2: $scope.idConceptoSeleccionContable//$scope.idConceptoSeleccion
        };
        anticipoGastoRepository.getCuentaContable(data).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.concepto.CNC_CUENTA = res.data[0].CNC_CUENTA
                //$scope.concepto.CNC_ID = res.data[0].CNC_ID;
                $scope.concepto.numeroCuenta = res.data[0].CNC_CUENTA;
            }
        });
    };

    $scope.asignarDepartamento = function (idDepartamento) {
        $scope.GeneraCambio();
        $scope.selDepartamento = idDepartamento;
    }

    $scope.salirTramite = function () {
        $location.path('/misTramites');
    }

    $scope.asignarAreaAfectacion = function (selCNC_CONCEPTO1) {

    

        if (selCNC_CONCEPTO1 != null && selCNC_CONCEPTO1 != '') {
            $scope.disabledConcepto = false;
            $scope.selCNC_CONCEPTO1 = selCNC_CONCEPTO1;
            $scope.concepto.selCNC_CONCEPTO1 = selCNC_CONCEPTO1;


            if ($scope.idConceptoSeleccion != null && $scope.idConceptoSeleccion > 0 && $scope.selCNC_CONCEPTO1 != null && $scope.selCNC_CONCEPTO1 != '') {
                $scope.getCuentaContable();
            }
        } else {
            $scope.selCNC_CONCEPTO1 = '';
        }
    }

    $scope.getTipoComprobante = function (accion) {
        $scope.tipoComprobanteList = [];
        misTramitesValesRepository.getTipoComprobante($scope.selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.tipoComprobanteList = res.data;
                if(accion == 1) {
                    var concepto = $scope.tipoComprobanteList.filter(concepto => concepto.PAR_IDENPARA == $scope.conceptoEdit.tipoComprobante);
                    if (concepto.length > 0) {
                        $scope.conceptoEdit.tipoconcepto = concepto[0].PAR_DESCRIP1;
                    }
                }
            }
        });
    };

    $scope.getIVABySucursal = function (accion) {
        $scope.IVAList = [];
        fondoFijoRepository.obtieneIVAbySucursal($scope.selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.IVAList = res.data;
                if(accion == 1) {
                    var iva = $scope.IVAList.filter(iv => iv.PAR_IDENPARA == $scope.conceptoEdit.tipoIVA);
                    if (iva.length > 0) {
                        $scope.conceptoEdit.iva = iva[0].PAR_DESCRIP1;
                    }
                }
            }
        });
    };


    $scope.asignarConcepto = function (idConcepto) {
        $scope.concepto.politicaGasto = '';
        $scope.selConceptoGasolina = false;
        $scope.concepto.importeSolicitado = 0;
        $scope.mostrarDistancia = false;

        if (idConcepto != null && idConcepto != 0) {
            
            $scope.disabledTipoViaje = false;
            $scope.idConceptoSeleccion = idConcepto;
            $scope.concepto.id = idConcepto;
            var concepto = $scope.conceptoGastoList.filter(concepto => concepto.id == idConcepto);
            if (concepto.length > 0) {
                $scope.concepto.politicaGasto = concepto[0].politicaGasto;
                $scope.idConceptoSeleccionContable  = concepto[0].idConceptoContable;
                $scope.concepto.conceptoContable = $scope.idConceptoSeleccionContable;
            }

            if ($scope.idConceptoSeleccion != null && $scope.idConceptoSeleccion > 0 && $scope.selCNC_CONCEPTO1 != null && $scope.selCNC_CONCEPTO1 != '') {
                
                $scope.conceptoGastoList.forEach(el => {
                    if(el.concepto === 'GTOS DE VIAJE GASOLINA'){
                        if(el.id === idConcepto){
                            $scope.selConceptoGasolina = true;
                        }else{
                            $scope.selConceptoGasolina = false;
                        }
                    }
                    
                    if(el.id === idConcepto){

                        if(el.concepto === 'GTOS DE VIAJE GASOLINA' || el.concepto === 'GTOS DE VIAJE CASETAS' || el.concepto === 'GTOS DE VIAJE RENTA AUTOMOVIL' || el.concepto.indexOf('TRANSPORTACIÓN')>0 || el.concepto.indexOf('TRANSPORTACION')>0){
                            $scope.mostrarDistancia = true;
                        }else{
                            $scope.mostrarDistancia = false;
                        }
                    }
                });
    
                $scope.getCuentaContable();
            }

            if($scope.disabledTipoViaje === false && $scope.idtipoViaje > -1){
                $scope.ObtineMaximoTabulador()
            }
        } else {
            $scope.idConceptoSeleccion = 0;
        }
    }

    $scope.mostrarConceptos = function (idTramiteEmpleado) {
        $scope.idEmpleado = idTramiteEmpleado;
        $scope.conceptosGastoPorSolicitud();

    }

    

    $scope.validarTramite = function (tramiteItem) {
        if ($scope.selEmpresa == 0) {
            return 'Debe seleccionar una empresa';
        } else if ($scope.selSucursal == 0) {
            return 'Debe seleccionar una sucursal';
        } else if ($scope.selDepartamento == 0) {
            return 'Debe seleccionar un departamento';
        } else if (tramiteItem.concepto == '') {
            return 'Debe ingresar a donde viaja';
        } else if (tramiteItem.motivo == '') {
            return 'Debe ingresar el motivo';
        } else if (tramiteItem.fechaInicio == null) {
            return 'Debe seleccionar una fecha inicio';
        } else if (tramiteItem.fechaFin == null) {
            return 'Debe seleccionar una fecha fin';
        } else if ((tramiteItem.fechaFin < tramiteItem.fechaInicio)) {
            return 'La fecha fin debe ser mayor a la fecha inicio';
        } else if ((tramiteItem.idPersona == 0 || tramiteItem.idPersona == '' || tramiteItem.idPersona == undefined)) {
            return 'El ID Persona no puede ser vació o cero';
        } else if (tramiteItem.motivo === undefined || tramiteItem.motivo.length < 15){
            return 'El motivo del viaje debe ser mas detallado máximo 150 caracteres mínimo 15 caracteres'
        } else if( 
            (tramiteItem.cuenta.clabe == '' || tramiteItem.cuenta.clabe == undefined) 
            && (tramiteItem.cuenta.cuenta == '' || tramiteItem.cuenta.cuenta == undefined)
            && (tramiteItem.cuenta.plaza == '' || tramiteItem.cuenta.plaza == undefined)
            && (tramiteItem.cuenta.sucursal == '' || tramiteItem.cuenta.sucursal == undefined)
        ){
            return 'Los datos de la cuenta son obligatorios'
        }
        else if ((tramiteItem.cuenta.clabe == '' || tramiteItem.cuenta.clabe == undefined)) {
            return 'La cuenta CLABE es obligatoria';
        } 
        else if ((tramiteItem.cuenta.clabe.length  != 18 )) {
            return 'La cuenta CLABE debe ser de 18 dígitos';
        } 
        else if ((tramiteItem.cuenta.cuenta == '' || tramiteItem.cuenta.cuenta == undefined)) {
            return 'El número de cuenta es obligatoria';
        } 
        else if ((tramiteItem.cuenta.plaza == '' || tramiteItem.cuenta.plaza == undefined)) {
            return 'El campo Plaza es obligatorio';
        } 
        else if ((tramiteItem.cuenta.sucursal == '' || tramiteItem.cuenta.sucursal == undefined)) {
            return 'El campo Sucursal es obligatorio';
        } 
        else if ((tramiteItem.cuenta.idBanco == '' || tramiteItem.cuenta.idBanco == undefined)) {
            return 'El Banco es obligatorio, verifique su cuenta CLABE';
        } 
        else if( ( tramiteItem.cuenta.estatus == 2 || tramiteItem.cuenta.estatus == 4 ) && ( $scope.documento.archivo === '' || $scope.documento.archivo === undefined )) {
            return 'El estado de cuenta es obligatorio';
        }
        else{
            return ''
        }
        /*else if( tramiteItem.kilometro == 0 ){
            return 'Debes pr';
        } */
        

        //return '';
    };

    $scope.validaCuenta = function( tramiteItem ){
        if( 
            (tramiteItem.cuenta.clabe == '' || tramiteItem.cuenta.clabe == undefined) 
            && (tramiteItem.cuenta.cuenta == '' || tramiteItem.cuenta.cuenta == undefined)
            && (tramiteItem.cuenta.plaza == '' || tramiteItem.cuenta.plaza == undefined)
            && (tramiteItem.cuenta.sucursal == '' || tramiteItem.cuenta.sucursal == undefined)
        ){
            return ''
        }
        else if ((tramiteItem.cuenta.clabe == '' || tramiteItem.cuenta.clabe == undefined)) {
            return 'La cuenta CLABE es obligatoria';
        } 
        else if ((tramiteItem.cuenta.clabe.length  != 18 )) {
            return 'La cuenta CLABE debe ser de 18 dígitos';
        } 
        else if ((tramiteItem.cuenta.cuenta == '' || tramiteItem.cuenta.cuenta == undefined)) {
            return 'El número de cuenta es obligatoria';
        } 
        else if ((tramiteItem.cuenta.plaza == '' || tramiteItem.cuenta.plaza == undefined)) {
            return 'El campo Plaza es obligatorio';
        } 
        else if ((tramiteItem.cuenta.sucursal == '' || tramiteItem.cuenta.sucursal == undefined)) {
            return 'El campo Sucursal es obligatorio';
        } 
        else if ((tramiteItem.cuenta.idBanco == '' || tramiteItem.cuenta.idBanco == undefined)) {
            return 'El Banco es obligatorio, verifique su cuenta CLABE';
        } 
        else if( ( tramiteItem.cuenta.estatus == 2 || tramiteItem.cuenta.estatus == 4 ) && ( $scope.documento.archivo === '' || $scope.documento.archivo === undefined )) {
            return 'El estado de cuenta es obligatorio';
        }
        else if(tramiteItem.motivo === undefined || tramiteItem.motivo.length < 15){
            return 'El motivo del viaje debe ser mas detallado máximo 150 caracteres mínimo 15 caracteres'
        }
    }

    $scope.guardarEmpleado = function (nombreEmpleado, IDEmpleadoBPRO) {
        $scope.aplicaUpdate = true;
        $("#guardarEmpleado").attr("disabled", "disabled");
       // $('#spinner-loading').modal('show');
        var empleadoItem = {
            idEmpleado: 0,
            nombreEmpleado: nombreEmpleado,
            idEstatus: 0,
            idTramiteDevolucion: $scope.tramite.idSolicitud,
            idPersona: IDEmpleadoBPRO
        };
        if (nombreEmpleado == '' || nombreEmpleado == null || nombreEmpleado == undefined) {
            swal('Anticipo de Gasto', 'Debe ingresar un nombre de empleado', 'warning');
         //   $('#spinner-loading').modal('hide');
            $("#guardarEmpleado").removeAttr("disabled");
        } else if (IDEmpleadoBPRO == 0 || IDEmpleadoBPRO == '' || IDEmpleadoBPRO == undefined) {
            swal('Anticipo de Gasto', 'El ID Persona no puede ser vació o cero', 'warning');
          //  $('#spinner-loading').modal('hide');
            $("#guardarEmpleado").removeAttr("disabled");
        }
        else
        {
            anticipoGastoRepository.guardarEmpleado(empleadoItem).then((res) => {
               
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    $('#modalEmpleado').modal('hide');
                    swal('Anticipo de Gasto', 'Se actualizó la solicitud correctamente', 'success');
                  //  $('#spinner-loading').modal('hide');
                    $scope.getEmpleadosPorIdSolicitud();
                    $scope.nombreEmpleado = '';

                    console.log("empleadosempleadosempleadosempleadosempleados", $scope.empleados);
                    $scope.cuentaEmpleado( IDEmpleadoBPRO );
                    $scope.validaCuentaUpdate();

                } else {
                    //$('#spinner-loading').modal('hide');
                    swal('Anticipo de Gasto', 'Ocurrió un error al generar la actualización', 'warning');
                }
                $("#guardarEmpleado").removeAttr("disabled");
            });
        }

        
//$('#spinner-loading').modal('hide');
    };

    $scope.cuentaEmpleado = function( IDEmpleadoBPRO1 ){
        anticipoGastoRepository.CuentaByPersona( $scope.IDEmpleadoBPROUsuario ).then( res => {
            if( res.data.length  != 0 ){
                $scope.tramite.cuenta = res.data[0];
                $scope.controlCuentas = 1
            }
            else{
                $scope.tramite.cuenta = {
                    cveBanxico: '',
                    clabe:'',
                    cuenta:'',
                    idBanco:'',
                    banco:'',
                    plaza:'',
                    sucursal:'',
                    estatus: 0
                }
                $scope.controlCuentas = 0;
            }
        });
    }

    $scope.eliminarEmpleado = function (idTramiteEmpleado) {
//        $('#spinner-loading').modal('show');
        anticipoGastoRepository.eliminarEmpleado(idTramiteEmpleado).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.getEmpleadosPorIdSolicitud();
                $scope.recuperaCuentaAnterior(1);
                swal('Anticipo de Gasto', 'Se realizo la solicitud correctamente', 'success');
               // $('#spinner-loading').modal('hide');
            } else {
              //  $('#spinner-loading').modal('hide');
                swal('Anticipo de Gasto', 'Ocurrió un error al generar la solicitud', 'warning');
            }
        });
    };

    $scope.guardarConceptoPorSolicitud =async function () {
        if ($scope.idConceptoSeleccion <= 0) {
            swal('Anticipo de Gasto', 'Debe seleccionar un concepto', 'warning');
        } else if ($scope.concepto.importeSolicitado <= 0) {
            swal('Concepto de Viaje', 'Debe ingresar un importe', 'warning');
        } else {
            //var validaRet = await ValidaRetenciones($scope.selSucursal, $scope.idtipoComprobante.PAR_IDENPARA, $scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion);
            // if(validaRet[0].estatus == 1)
            // {
            $('#spinner-loading').modal('show');
            $scope.concepto.idEstatus = $scope.idEstatus;
            $scope.concepto.idUsuario = $rootScope.usuario.usu_idusuario;
            $scope.concepto.idTipoProceso = $scope.idTipoProceso;
            $scope.concepto.distanciaKm = $scope.distancia
            //$scope.concepto.idtipoComprobante =  $scope.idtipoComprobante.PAR_IDENPARA;
            //$scope.concepto.tipoIVA =  $scope.idtipoIVA.PAR_IDENPARA;
            //$scope.concepto.IVA =  $scope.ivaVale;
            //$scope.concepto.IVAretencion =  $scope.retencion;
            //$scope.concepto.ISRretencion =  $scope.ISRretencion;
            //$scope.concepto.subTotal =  $scope.subtotalVale;
            anticipoGastoRepository.guardarConceptoPorSolicitud($scope.concepto, $scope.idSolicitud, $scope.idtipoViaje).then((res) => {
                if (res != null && res.data != null && res.data.resppuesta != 0) {
                    swal('Concepto de Viaje', 'Se agregó el concepto correctamente', 'success');
                    $("#modalConceptoGasto").modal("hide");
                    $('#spinner-loading').modal('hide');
                    $scope.conceptosGastoPorSolicitud();
                    $scope.idConceptoSeleccion = 0;
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Concepto de viaje', 'Ocurrió un error al agregar el concepto a la solicitud', 'warning');
                }
            });
        // }
        // else
        // { swal("Atención",validaRet[0].mensaje , "warning"); }
        }
    };

    $scope.actualizaImporteConcepto = function () {
        if ($scope.conceptoEdit.importeSolicitado <= 0) {
            swal('Concepto de viaje', 'Debe ingresar un importe', 'warning');
        } else {
            $("#modalConceptoGastoEdicion").modal("hide");
            $('#spinner-loading').modal('show');
            $scope.conceptoEdit.idEstatus = 0;
            $scope.conceptoEdit.idTipoProceso = $scope.idTipoProceso;
            $scope.conceptoEdit.distancia = $scope.distancia;
            anticipoGastoRepository.actualizaImporteConcepto($scope.conceptoEdit, $rootScope.usuario.usu_idusuario, $scope.idtipoViaje).then((res) => {
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    $scope.conceptosGastoPorSolicitud();
                    $('#spinner-loading').modal('hide');
                    swal('Concepto de viaje', 'Se actualizó la información correctamente', 'success');
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Concepto de viaje', 'Ocurrió un error al generar la actualización', 'warning');
                }
            });
        }
    };

    $scope.actualizaEstatusTramiteComprobar = function () {
        anticipoGastoRepository.actualizaEstatusTramite($scope.tramite.idSolicitud, 2).then((res) => {
            if (res == null || res.data == null || res.data.respuesta == 0) {
                swal('Anticipo de Gasto', 'Ocurrió un error al obtener la información', 'error');
                $location.path('/misTramites');
            } else {
                $scope.tramite.idEstatus = 7;
            }
        });
    };

    $scope.actualizaEstatusTramite = function  () {
        if( $scope.aplicaUpdate ){
            swal('Anticipo de Gasto', 'Tienes cambios de la solicitud que no han sido actualizados, favor de actualizarlos antes de enviar.', 'warning');
            // $scope.validaCuentaUpdate( 1 );
        }
        else{
            //Buscar al autorizador al que se le va a enviar la notificación
            var error = $scope.validarTramite($scope.tramite);
            // if( $scope.documentoINE.id_perTra !== null && $scope.documentoINE.id_perTra !== undefined){
            if(error == ''){
                $scope.accionEnviar = true;
                $scope.buscarAutorizador($scope.selEmpresa);
            }
            // }
            // else
            // swal('Anticipo de Gastos','El documento INE es obligatorio ')

        }
    };

    $scope.eliminarConcepto = function (concepto) {
        $('#spinner-loading').modal('show');
        anticipoGastoRepository.eliminarConcepto(concepto.id).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.conceptosGastoPorSolicitud();
                swal('Concepto de viaje', 'Se elimino el concepto correctamente', 'success');
                $('#spinner-loading').modal('hide');
            } else {
                $('#spinner-loading').modal('hide');
                swal('Concepto de viaje', 'Ocurrió un error al eliminar el concepto', 'warning');
            }
        });
    };

    $scope.getConceptosGasto = function () {
        anticipoGastoRepository.getconceptosGastoList($scope.idSolicitud, $scope.selEmpresa, $scope.selSucursal).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptoGastoList = response.data;
            }
        });
    };

    $scope.idBproEmplead = 0;
    $scope.getEmpleadosPorIdSolicitud = function () {
        anticipoGastoRepository.getEmpleadosPorIdSolicitud($scope.idSolicitud).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.empleados = response.data;
                $scope.tieneEmpleado = true;
                $scope.selUsuario = response.data[0].IdPersona;
                $scope.idpersonaAdicional = response.data[0].idUsuario;

            } else {
                $scope.empleados = [];
                $scope.tieneEmpleado = false;
            }
        });
    };

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

    $scope.frmModalConceptoGasto = function (idEstatus) {
        $scope.idEstatus = idEstatus;
        $scope.getConceptosGasto();
        $scope.idConceptoSeleccion = 0;
        $scope.concepto.importeSolicitado = 0;
        $scope.concepto.comentario = '';
        $scope.idConceptoSeleccion = 0;
        $scope.getAreaAfectacion(0);
        $scope.getTipoComprobante(0);
        $scope.getIVABySucursal(0);
        $scope.claveDescGasto = '';
        $scope.selCNC_CONCEPTO1 = '';
        $scope.concepto.CNC_CUENTA = '';
        $scope.concepto.CNC_ID = '';
        $scope.tipoRetencion = false;
        $scope.idtipoViaje = String(-1);
        $scope.disabledTipoViaje = true;
        $scope.disabledMonto = true;
        $scope.disabledConcepto = false;
        $scope.selConceptoGasolina = false;
        $scope.mostrarDistancia = false;
        $scope.distancia = 50;
        $("#modalConceptoGasto").modal({backdrop: 'static', keyboard: false})
        $("#modalConceptoGasto").modal("show");
    };

    $scope.editarConcepto = function (concepto) {
        $scope.conceptoEdit = concepto;
        $scope.idtipoViaje = String(concepto.idTipoViaje);
        $scope.concepto.comentario = '';     
        $scope.idConceptoSeleccion = concepto.idConceptoContable;
        $scope.distancia = concepto.distanciaKilometros
        if(concepto.concepto === 'GTOS DE VIAJE GASOLINA'){
            $scope.selConceptoGasolina = true
        }
        else{
            $scope.selConceptoGasolina = false
        }
        $scope.getAreaAfectacion(1);
        $scope.getTipoComprobante(1);
        $scope.getIVABySucursal(1);
        $scope.ObtineMaximoTabulador();
        $("#modalConceptoGastoEdicion").modal({backdrop: 'static', keyboard: false})
        $("#modalConceptoGastoEdicion").modal("show");
    };

    $scope.modalAgregarEmpleado = function () {
        $scope.IDEmpleadoBPRO1 = 0;
        $scope.nombreEmpleado = '';
        $("#modalEmpleado").modal("show");
    };

    $scope.guardarImporteConcepto = function (importe, idUsuario, idTipoProceso, idTramiteConcepto, importeiVA, folio, fecha, idConceptoArchivo) {
        anticipoGastoRepository.guardarImporteConcepto(importe, idUsuario, idTipoProceso, idTramiteConcepto, importeiVA, folio, fecha, idConceptoArchivo).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.conceptosGastoPorSolicitud();
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Gasto', 'Se proceso correctamente la solicitud.', 'success');
            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Gasto', 'Ocurrió un error al guardar el comentario', 'warning');
            }
        });
    }
    $scope.openWizard = function () {
        anticipoGastoRepository.estatusAnticipoGasto().then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusAnticipo = res.data;
            } else {
                swal('Alto', 'Ocurrió un error al mostrar el proceso, intento mas tarde', 'warning');
            }
        });
    }

    $scope.sendMail = function(to, subject, html) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito ")')
                 //insertar en la bitácora para registrar que el correo se envió exitosamente
                 $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Correo enviado con éxito a '+to+' Asunto: '+subject, 1, 1);
            } else {
                console.log('Ocuerrio un error al emviar el correo "( ')
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'No se pudo entregar el correo a '+to+' Asunto: '+subject, 1, 1);
            }
        });
    };

    $scope.verDatos = function() {
        var idEmpresa = $scope.selEmpresa
        anticipoGastoRepository.datosEmpresa(idEmpresa).then((res) => {
            if(res.data.length > 0)
            {
                $scope.empresa = res.data[0];
                $("#modalDatosEmpresa").modal("show");
            }
            else {
                swal('Alto', 'No se encontró registro de la empresa.', 'warning');
            }
        });
    };

    // $scope.verPDF = function() {
    //     var ep = $scope.empresa;

    //     var date = new Date();
    //     var fecha = ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear();
    //     var doc = new jsPDF('p','px','letter');

    //     var lMargin=15; //left margin in mm
    //     var rMargin=15; //right margin in mm
    //     var pdfInMM=410;  

    //     doc.setFontSize(12);
    //     doc.text('Fecha: ' + fecha, 45,50);
    //     doc.text(ep.nombre + ' (' + ep.nombre_corto + ')', 45 ,90);
    //     doc.text('Razón social: ' + ep.razon_social, 45,110);
    //     doc.text('RFC: ' + ep.registro_federal, 45,130);
    //     doc.text('Direccion:', 45,150);

    //     var lines1=doc.splitTextToSize(ep.direccion, (pdfInMM-lMargin-rMargin));

    //     var dim = doc.getTextDimensions('Text');
    //     var lineHeight = dim.h;
    //     lineTop = (lineHeight/2)*lines1.length + 10;

    //     for(var i=0;i<lines1.length;i++){
    //         lineTop = (lineHeight/2) * i;
    //         doc.text(lines1[i],45,170 + lineTop);
    //     }

    //     //doc.text('Página Web: ' + ep.paginaweb, 45,210);

    //     doc.save(ep.nombre + '_DATOS.pdf');
    // }

    $scope.sendNotificacion = function (asunto, body) {
        $("#loading").modal("show");
        var tipoNot = 1;

        var usuario = $scope.empleados.length > 0 ? $scope.empleados[0].idUsuario : $scope.user.usu_idusuario
        var nombreSol = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado :  $rootScope.user.nombre
        var descripcion = `<p>Favor de revisar, el usuario ${nombreSol} a solicitado un anticipo de gasto con número de tramite ${$scope.idSolicitud} para los siguientes conceptos: </p></br>`+ 
        '<table border="1">' +
                            '<thead><tr>' +
                            '<td style="font-weight: bold; padding-right: 30px; text-align: center;">Concepto</td>' +
                            '<td style="font-weight: bold; padding-right: 30px; text-align: center;">Monto Solicitado</td>' +
                            '</tr><thead>' +
                            '<tbody>' +
                            $scope.listaCorreo.map(item => {
                                return `<tr>
                                            <td>${item.concepto}</td>
                                            <td style="text-align: right;">$${ formatMoney( item.importeSolicitado )}</td>
                                        </tr>`
                            }).join('') +
                            '</tbody>' +
                            '</table>'

        // $scope.listaCorreo.map(item => {
        //     return `${item.concepto} $${ formatMoney( item.importeSolicitado )}`
        // }).join(' ')

        let correoSolicitante = $scope.empleados.length > 0 ? $scope.empleados[0].correo : $scope.correoPersona;

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
            "linkBPRO": global_settings.urlCORS + "aprobarAnticipoGasto?idSolicitud=" + $scope.idSolicitud,
            "notAdjunto": "",
            "notAdjuntoTipo": "",
            "idEmpresa": $scope.selEmpresa,
            "idSucursal": $scope.selSucursal,
            "departamentoId":  $scope.selDepartamento
        };
        
        anticipoGastoRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
    
                //let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMailJerarquizado/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                let link = `${global_settings.urlApiNoty}api/notification/approveNotificationMailJerarquizado/?idAprobacion=${ result.data[0].apr_id}&identificador=${result.data[0].not_id}&idUsuario=${result.data[0].idUsuario}&respuesta=`
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a aprobación a Corporativo', 1, 1);
                html = ` ${body}
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Tramite</a></p>
                <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
    
                var correoAutorizador = $scope.correoAutorizador;
                $scope.sendMail(correoAutorizador, asunto, html);
                $scope.sendMail(correoSolicitante, asunto, body);
                //$scope.sendMail("jorge.conelly@coalmx.com", asunto, html);

                $("#loading").modal("hide");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                $("#loading").modal("hide");
            }
        });
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

    // $scope.actualizarMontos = function () {
    //     $scope.comprobante = $scope.idtipoComprobante;
    //     if($scope.concepto.importeSolicitado != undefined && $scope.concepto.importeSolicitado != 0)
    //     {
    //         if($scope.comprobante.PAR_DESCRIP1.toUpperCase == 'FACTURA')
    //         {
    //             $scope.ivaVale = (Number($scope.montoEvidenciaVale) * .16).toFixed(2);
    //             $scope.retencion = 0;
    //             $scope.subtotalVale = (Number($scope.montoEvidenciaVale) / 1.16).toFixed(2);
    //         }
    //         else
    //         {
    //             let ret = (100 / Number($scope.comprobante.PAR_IMPORTE1)).toFixed(2);
    //             $scope.ivaVale = (Number($scope.concepto.importeSolicitado) * .16).toFixed(2);
    //             $scope.retencion = ((Number($scope.concepto.importeSolicitado) - Number($scope.ivaVale))/  ret).toFixed(2);
    //             $scope.subtotalVale = (Number($scope.concepto.importeSolicitado) - Number($scope.ivaVale) - Number($scope.retencion)).toFixed(2);

    //         }
    //         $scope.tipoRetencion = true;
    //     }
    //     else
    //     {
    //         $scope.tipoRetencion = false;
    //     }
    // }; 
    $scope.actualizarMontos = function () {
        $scope.comprobante = $scope.idtipoComprobante;
        $scope.ivaCalc = $scope.idtipoIVA;
        if($scope.concepto.importeSolicitado != undefined && $scope.concepto.importeSolicitado != 0)
        {
            let retIVA = (Number($scope.comprobante.PAR_IMPORTE1 / 100));
            let retISR = (Number($scope.comprobante.PAR_IMPORTE2 / 100));
            let subTotal =(Number($scope.concepto.importeSolicitado)  /(1 + (Number($scope.ivaCalc.PAR_IMPORTE1)/100))).toFixed(2);
            let IVA = (Number($scope.ivaCalc.PAR_IMPORTE1)/100);
            $scope.ivaVale = (subTotal * IVA).toFixed(2);
            $scope.retencion = retIVA == 0 ? 0 :(subTotal *  retIVA).toFixed(2);
            $scope.ISRretencion = retISR == 0 ? 0 : (subTotal *  retISR).toFixed(2);
            if(retIVA == 0 && retISR == 0)
            {
                $scope.subtotalVale = (Number($scope.concepto.importeSolicitado) - Number($scope.ivaVale));
            }
            else if (retIVA != 0 && retISR == 0)
            {
                let iva =  Number($scope.ivaVale) - Number($scope.retencion);
                $scope.subtotalVale = (Number(subTotal) - Number(iva));
            }
            else
            {
                $scope.subtotalVale =  (Number(subTotal) + Number($scope.ivaVale) - Number($scope.retencion) - Number($scope.ISRretencion)).toFixed(2);
            }
            // let retIVA = (Number($scope.comprobante.PAR_IMPORTE1 / 100));
            // let retISR = (Number($scope.comprobante.PAR_IMPORTE2 / 100));
            // $scope.ivaVale = (Number($scope.concepto.importeSolicitado) * (Number($scope.ivaCalc.PAR_IMPORTE1)/100)).toFixed(2);
            // $scope.retencion = retIVA == 0 ? 0 :(Number($scope.concepto.importeSolicitado) *  retIVA).toFixed(2);
            // $scope.ISRretencion = retISR == 0 ? 0 : (Number($scope.concepto.importeSolicitado) *  retISR).toFixed(2);
            // if(retIVA == 0 && retISR == 0)
            // {
            //     $scope.subtotalVale = (Number($scope.concepto.importeSolicitado) - Number($scope.ivaVale));
            // }
            // else if (retIVA != 0 && retISR == 0)
            // {
            //     let iva =  Number($scope.ivaVale) - Number($scope.retencion);
            //     $scope.subtotalVale = (Number($scope.concepto.importeSolicitado) - Number(iva));
            // }
            // else
            // {
            //     $scope.subtotalVale =  (Number($scope.concepto.importeSolicitado) + Number($scope.ivaVale) - Number($scope.retencion) - Number($scope.ISRretencion)).toFixed(2);
            // }
          
            // // if($scope.comprobante.PAR_DESCRIP1.toUpperCase == 'FACTURA')
            // // {
            // //     $scope.ivaVale = (Number($scope.montoEvidenciaVale) * .16).toFixed(2);
            // //     $scope.retencion = 0;
            // //     $scope.subtotalVale = (Number($scope.montoEvidenciaVale) / 1.16).toFixed(2);
            // // }
            // // else
            // // {
            // //     let ret = (100 / Number($scope.comprobante.PAR_IMPORTE1)).toFixed(2);
            // //     $scope.ivaVale = (Number($scope.montoEvidenciaVale) * .16).toFixed(2);
            // //     $scope.retencion = ((Number($scope.montoEvidenciaVale) - Number($scope.ivaVale))/  ret).toFixed(2);
            // //     $scope.subtotalVale = (Number($scope.montoEvidenciaVale) - Number($scope.ivaVale) - Number($scope.retencion)).toFixed(2);

            // // }
            $scope.tipoRetencion = true;
        }
        else
        {
            $scope.tipoRetencion = false;
        }
    
    }; 
    /////////Se agrega verificar a qué autorizador se le va a enviar la notificación
    $scope.buscarAutorizador = async function () {
        
        $scope.existeConfiguracion = false
        
        $scope.selUsuario = $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : ($scope.tramite.idPersona1 === undefined ? $scope.tramite.idPersona : $scope.tramite.idPersona1)

       anticipoGastoRepository.getBuscarAutorizador($scope.selEmpresa, $scope.selSucursal, $scope.selDepartamento, $scope.selUsuario, 1).then((res) => {    
           
        if(res.data[0].estatus === 1){
        
            $scope.existeConfiguracion = true
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].usu_correo;
            $scope.nombreAutorizador = res.data[0].nombreUsuario;

            let usuarioSolicitante = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.nombrePersona ;
            let empresaSeleccionada= $scope.empresas.filter(x => x.emp_idempresa === $scope.selEmpresa)[0].emp_nombre;
            let sucursalSeleccionada = $scope.sucursales.filter(x=>x.idSucursal === $scope.selSucursal)[0].nombre ;
            let fecha = new Date();
            let fechaHora = `${fecha.today()} ${fecha.timeNow()}`
            

            $('#spinner-loading').modal('show');
            anticipoGastoRepository.actualizaEstatusTramite($scope.tramite.idSolicitud, $scope.idTipoProceso).then((res) => {
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    if (res.data.idRegistro == 1) {
                        $scope.listaCorreo = $scope.conceptosSolicitud.filter(f => f.idEstatus == 0);
                        let asunto = 'Solicitud de Anticipo de Gastos N° de tramite ' + $scope.tramite.idSolicitud;
                        let body = $scope.html1 +
                            '<p>La siguiente solicitud Anticipo de Gastos fue enviada a aprobación:</p>'+
                            '<p><strong>Empresa: </strong>'+empresaSeleccionada +'</p>'+ 
                            '<p><strong>Sucursal: </strong>'+ sucursalSeleccionada+'</p>' +
                            '<p><strong>Solicitante: </strong>'+ usuarioSolicitante+'</p>' +
                            '<p><strong>Autorizador: </strong>'+  $scope.nombreAutorizador +'</p>' +
                            '<p><strong>Fecha: </strong>'+ fechaHora+'</p>' +
                            '<table border="1">' +
                            '<thead><tr>' +
                            '<td style="font-weight: bold; padding-right: 30px; text-align: center;">Concepto</td>' +
                            '<td style="font-weight: bold; padding-right: 30px; text-align: center;">Monto Solicitado</td>' +
                            '<td style="font-weight: bold; padding-right: 30px; text-align: center;">Estatus</td>' +
                            '</tr><thead>' +
                            '<tbody>' +
                            $scope.listaCorreo.map(item => {
                                return `<tr>
                                            <td>${item.concepto}</td>
                                            <td style="text-align: right;">$${ formatMoney( item.importeSolicitado )}</td>
                                            <td>${item.estatus}</td>
                                        </tr>`
                            }).join('') +
                            '</tbody>' +
                            '</table>'+ $scope.html2;
                            //$scope.sendMail($scope.correoAutorizador, asunto, body);
                            //envía notificación
                            $scope.sendNotificacion(asunto, body);
                        $('#spinner-loading').modal('hide');
                        swal('Anticipo de Gasto', 'Se envió la solicitud a aprobar correctamente', 'success');
                        $location.path('/misTramites');
    
                    } else if (res.data.idRegistro == -2) {
                        $('#spinner-loading').modal('hide');
                        swal('Anticipo de Gasto', 'Todos los conceptos deben tener al menos un archivo adjunto', 'info');
                    } else if (res.data.idRegistro == -1) {
                        $('#spinner-loading').modal('hide');
                        swal('Anticipo de Gasto', 'Todos los archivos .XML deben tener 100% en departamentos', 'info');
                    }
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Anticipo de Gasto', 'Ocurrió un error al generar la actualización', 'success');
                }
            });
        }
        else{
            // $scope.accionEnviar = false;
            $scope.existeConfiguracion = false
            swal({
                title: 'Aviso',
                type: 'warning',
                text: res.data[0].mensaje,
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            })
        }
        });
    }
    ////////////////FIN

    async function ValidaRetenciones (idsucursal, tipoComprobante, areaAfectacion, conceptoContable) {
        return new Promise((resolve, reject) => {
        fondoFijoRepository.validaRetencionesOC(idsucursal, tipoComprobante, areaAfectacion, conceptoContable).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
        });
    });
    }

    $scope.buscarPersona = function (idPersona, tipo) {
        if(idPersona == 0  || idPersona == undefined || idPersona == '' || idPersona == null)
        {
            swal("Atención", "El Id BPRO es necesario.", "warning");
        }
        else
        {

            var esid = 0;
            var esnombre = 0;
            var nombre ='';
            var esRFC = Number.isInteger(idPersona) ? 0 : rfcValido(idPersona);
            if(esRFC == 0)           
            {
                esid = tiene_numeros(idPersona);
                if(esid == 0)
                {
                var divisiones = idPersona.split(" ");
                esnombre = 1;
                nombre = divisiones[0];
                }
            }
            
            anticipoGastoRepository.getBuscarPersona(idPersona, esid, esRFC, esnombre, nombre, $scope.selSucursal).then((res) => {
                if (res.data[0].estatus == 1) {
                    if(tipo == 1)
                    {
                        $scope.tramite.idPersona = res.data[0].idPersona;
                        $scope.nombrePersona = res.data[0].nombre;
                        $scope.verNombrePersona = true;
                        $scope.activabtn = true;
                        $scope.correoPersona = res.data[0].correo
                    }
                    else{
                        $scope.nombreEmpleado = res.data[0].nombre;
                        $scope.IDEmpleadoBPRO= res.data[0].idPersona;
                        $scope.IDEmpleadoBPROUsuario= res.data[0].idUsuario;

                    }
                } else {
                    swal("Atención", res.data[0].msj, "warning");
                    if(tipo == 1)
                    {
                    $scope.verNombrePersona = false;
                    $scope.activabtn = false;
                    }
                    else{
                        $scope.verNombrePersona1 = false;
                    }
                }
            });
        }
    }

    function tiene_numeros(texto){
        var numeros="0123456789";
        for(i=0; i<texto.length; i++){
           if (numeros.indexOf(texto.charAt(i),0)!=-1){
              return 1;
           }
        }
        return 0;
     }

     function rfcValido(rfc, aceptarGenerico = true) {
        rfc.toString();
        const re       = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
        var   validado = rfc.match(re);
    
        if (!validado)  //Coincide con el formato general del regex?
            return 0;
    
        //Separar el dígito verificador del resto del RFC
        const digitoVerificador = validado.pop(),
              rfcSinDigito      = validado.slice(1).join(''),
              len               = rfcSinDigito.length,
    
        //Obtener el digito esperado
              diccionario       = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
              indice            = len + 1;
        var   suma,
              digitoEsperado;
    
        if (len == 12) suma = 0
        else suma = 481; //Ajuste para persona moral
    
        for(var i=0; i<len; i++)
            suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
        digitoEsperado = 11 - suma % 11;
        if (digitoEsperado == 11) digitoEsperado = 0;
        else if (digitoEsperado == 10) digitoEsperado = "A";
    
        //El dígito verificador coincide con el esperado?
        // o es un RFC Genérico (ventas a público general)?
        if ((digitoVerificador != digitoEsperado)
         && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
            return 0;
        else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
            return 0;
        return 1;
    }

    $scope.TipoViaje = function(){

        var selConcepto ='';
        //console.log($scope.idtipoViaje)
        $scope.disabledMonto = false;
       // console.log('importe concepto: ', $scope.concepto)
        $scope.concepto.importeSolicitado = 0;

        if($scope.idtipoViaje === '0'){
            $scope.selConceptoGasolina = false;
        }
        else{
            $scope.conceptoGastoList.forEach(el => {

                if($scope.idConceptoSeleccion === el.id){
                    if(el.concepto === 'GTOS DE VIAJE GASOLINA'){
                        $scope.selConceptoGasolina = true;
                    }else{
                        $scope.selConceptoGasolina = false;
                    }

                    anticipoGastoRepository.validaLeyDeducibilidad(el.id, $scope.distancia).then(res => {
                        if(res.data[0].estatus !== 1){
                            swal('Concepto no viable',res.data[0].mensaje, 'warning')
                            $scope.idConceptoSeleccion = 0;
                            $scope.disabledTipoViaje = true
                            $scope.disabledMonto = true
                            $scope.concepto.importeSolicitado = 0
                            $scope.idtipoViaje = "-1"
            
                            if( $scope.mostrarDistancia === true){
                                $scope.mostrarDistancia = false;
                            }
                        }
                    })
                }

            });
        }
        $scope.ObtineMaximoTabulador()
    }

    $scope.ObtineMaximoTabulador = function(){

        var usuario = $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona
        $scope.selUsuario = usuario
        console.log('empleados', $scope.empleados)
        if( $scope.selConceptoGasolina === true){
            $scope.obtieneMaximoGasolina(); 
        }
        else{
            anticipoGastoRepository.parametrosGvByUsuario(usuario, $scope.idtipoViaje, $scope.idConceptoSeleccion).then(res => {
            
                console.log('empledo 1', $scope.tramite.idPersona1)
                /**
                 * OBTENEMOS LOS DIAS DE VIAJE
                 */
                var DateDiff = {
         
                    inDays: function(d1, d2) {
                        var t2 = d2.getTime();
                        var t1 = d1.getTime();
                 
                        return parseInt((t2-t1)/(24*3600*1000));
                    },
                 
                    inWeeks: function(d1, d2) {
                        var t2 = d2.getTime();
                        var t1 = d1.getTime();
                 
                        return parseInt((t2-t1)/(24*3600*1000*7));
                    },
                 
                    inMonths: function(d1, d2) {
                        var d1Y = d1.getFullYear();
                        var d2Y = d2.getFullYear();
                        var d1M = d1.getMonth();
                        var d2M = d2.getMonth();
                 
                        return (d2M+12*d2Y)-(d1M+12*d1Y);
                    },
                 
                    inYears: function(d1, d2) {
                        return d2.getFullYear()-d1.getFullYear();
                    }
                }
        
                $scope.diasViaje = DateDiff.inDays($scope.tramite.fechaInicio, $scope.tramite.fechaFin)
        
                $scope.diasViaje =   $scope.diasViaje === 0 ? 1 : $scope.diasViaje
                    
                console.log('parametro tope: ', res.data)
                    if(res.data[0].estatus === 0){
                        swal({
                            title: 'Aviso',
                            type: 'warning',
                            text: res.data[0].mensaje,
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Aceptar',
                            cancelButtonText: 'Cancelar',
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                 
                                /**
                                 * multiplicamos el monto maximo por el numero de dias de viaje
                                 * 
                                 */
                                $scope.montoMaximoGV = res.data[0].montoTope * $scope.diasViaje;
        
                                if(($scope.disabledTipoViaje === false && $scope.idtipoViaje > -1) || ($scope.conceptoEdit.importeSolicitado > 0)){
                                    $scope.validaMontoMaximo();
                                }
                               
                            } 
                        });
                    }else{
                        $scope.montoMaximoGV = res.data[0].montoTope * $scope.diasViaje;
        
                    }
                    
                })
        }

        

    }

    $scope.obtieneMaximoGasolina = function(){
        var autorizado = 0;
        
        anticipoGastoRepository.PrecioGasolina().then(resp =>{
            autorizado = resp.data[0].autorizadoPorKilometro
            $scope.montoMaximoGV = Number($scope.distancia * autorizado).toFixed(2);
        })
    }


    $scope.validaMontoMaximo = function(){
        let valor = 0
        
        if($scope.conceptoEdit.importeSolicitado > 0){
            
            valor = $scope.conceptoEdit.importeSolicitado.toFixed(2)
            $scope.conceptoEdit.importeSolicitado = Number(valor)

            if($scope.conceptoEdit.importeSolicitado > $scope.montoMaximoGV  ){
                $scope.conceptoEdit.importeSolicitado = Number($scope.montoMaximoGV).toFixed(2);
                $("#montoEdit").val(`${$scope.conceptoEdit.importeSolicitado}`);
                swal({
                    title: 'Aviso',
                    type: 'warning',
                    text: 'El monto supera el valor permitido, se ajustara al monto máximo permitido',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    closeOnConfirm: true,
                    closeOnCancel: true
                })
            }
        }

        if($scope.concepto.importeSolicitado > 0){
            
            valor = $scope.concepto.importeSolicitado.toFixed(2)
            $scope.concepto.importeSolicitado = Number(valor)

            if($scope.concepto.importeSolicitado >  $scope.montoMaximoGV  ){
                $scope.concepto.importeSolicitado =   Number($scope.montoMaximoGV).toFixed(2);
                $("#montos").val(`${$scope.concepto.importeSolicitado}`);
                swal({
                    title: 'Aviso',
                    type: 'warning',
                    text: 'El monto supera el valor permitido, se ajustara al monto máximo permitido',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    closeOnConfirm: true,
                    closeOnCancel: true
                })
            }
        }
    }


    $scope.saveDocumentosTramite = function (idPertra,  contDocs, documento) {
        var sendData = {};
        //var saveUrl = 'C:\\app\\public\\Imagenes\\Comprobaciones\\';
        // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\';
        var saveUrl = $scope.rutaDocumentosGV; //'E:\\app\\public\\Imagenes\\DocumentosGV\\'
        var posicion = documento.archivo === ''? 0 : documento.archivo.nombreArchivo.indexOf('.');
        var nombre = documento.archivo === ''? '' : documento.archivo.nombreArchivo.substring(0,posicion);
        var usuario = $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona;

            if (documento.hasOwnProperty('archivo') && nombre !== '') {
                sendData = {
                    idDocumento: documento.idDocumento === undefined ? documento.id_documento:documento.idDocumento ,
                    idTramite: 9,
                    idPerTra: idPertra,
                    //saveUrl: saveUrl + 'Comprobacion\\' + 'Comprobacion_' + idPertra,
                    saveUrl: saveUrl+'Persona_'+ usuario,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: 'pdf',
                    archivo: documento.archivo.archivo,
                    nombreArchivo:'comprobacion',
                    idArchivo: documento.idDocumento,
                    idProceso: 1,
                    consecutivo:1
                }

                anticipoGastoRepository.saveEdoCuentas(sendData.idDocumento, sendData.idTramite, sendData.idPerTra).then(resp => {
                    console.log(resp)
                    anticipoGastoRepository.saveDocumentos(sendData).then((res) => {
                                        if (res.data.ok) {
                                            console.log(res.data);
                                            anticipoGastoRepository.loadDocument($scope.idSolicitud,$scope.idTramite ).then(res => {
                                                
                                                for(let i= 0; i<res.data.length ;i++){
                                                    if(res.data[i].id_perTra !== null && res.data[i].id_perTra !== undefined ){
                                                        if(res.data[i].id_documento === 13){
                                                            $scope.documento = res.data[i];
                                                        }
                                                        else{
                                                            $scope.documentoINE = res.data[i];
                                                        }
                                                    }
                                                }                              
                                                console.log($scope.documento)
                                            })  
                                        }
                                    });
                });
 
            } 
            // else { 
             //   $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos); 
            //}

    };

    $scope.saveDocumentosTramiteBanco = function (idPertra,  contDocs, documento) {
        var sendData = {};
        //var saveUrl = 'C:\\app\\public\\Imagenes\\Comprobaciones\\';
        // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\';
        var saveUrl = $scope.rutaDocumentosGV; //'E:\\app\\public\\Imagenes\\DocumentosGV\\'
        var posicion = documento.archivo === ''? 0 : documento.archivo.nombreArchivo.indexOf('.');
        var nombre = documento.archivo === ''? '' : documento.archivo.nombreArchivo.substring(0,posicion);
        var usuario = $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona;

            if (documento.hasOwnProperty('archivo') && nombre !== '') {
                sendData = {
                    idDocumento: documento.idDocumento === undefined ? documento.id_documento:documento.idDocumento ,
                    idTramite: 9,
                    idPerTra: idPertra,
                    //saveUrl: saveUrl + 'Comprobacion\\' + 'Comprobacion_' + idPertra,
                    saveUrl: saveUrl+'Persona_'+ usuario,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: 'pdf',
                    archivo: documento.archivo.archivo,
                    nombreArchivo:'comprobacion',
                    idArchivo: documento.idDocumento === undefined ? documento.id_documento:documento.idDocumento,
                    idProceso: 1,
                    consecutivo:1
                }

                anticipoGastoRepository.saveEdoCuentas(sendData.idDocumento, sendData.idTramite, sendData.idPerTra).then(resp => {
                    console.log(resp)
                    anticipoGastoRepository.saveDocumentos(sendData).then((res) => {
                                        if (res.data.ok) {
                                            console.log(res.data);
                                            anticipoGastoRepository.loadDocumentBanco($scope.idSolicitud,sendData.idTramite ).then(res => {
                                                
                                                for(let i= 0; i<res.data.length ;i++){
                                                    if(res.data[i].id_perTra !== null && res.data[i].id_perTra !== undefined ){
                                                        if(res.data[i].id_documento === 13){
                                                            $scope.documento = res.data[i];
                                                        }
                                                        else{
                                                            $scope.documentoINE = res.data[i];
                                                        }
                                                    }
                                                }                              
                                                console.log($scope.documento)
                                            })  
                                        }
                                    });
                });
 
            } 
            // else { 
             //   $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos); 
            //}

    };

    $scope.verPdf = function (doc) {

        if (validURL(doc.url) === false) {
            doc.url = null
        }
        
        if(doc.url === null && doc.archivo !== null && doc.archivo !== undefined && doc.archivo !== ''){
            doc.url = doc.archivo.archivo
        }
        
        if(doc.url === null && doc.archivo === undefined ){
            swal('Aviso', 'El documento no ha sido cargado', 'warning')
            return
        }
        
        if (doc.estatusDocumento == 3) {
            $scope.verComentarios = true;
            $scope.obervacionesDoc = doc.Observaciones;
        } else {
            $scope.verComentarios = false;
        }
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = doc.doc_nomDocumento;
        $("#mostrarPdf").modal("show");
        var pdf = doc.url;
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='650px' >").appendTo('#pdfReferenceContent');
        $('#mostrarPdf').insertAfter($('body'));
   
    }


    function validURL(myURL) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(myURL);
     }

    $scope.verVale = function () {
        console.log('gastos de viaje', $scope.conceptosSolicitud)
        let gastosAprobados = 0;
        let fechaInicio = new Date($scope.tramite.fechaInicio)
        fechaInicio = fechaInicio.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })

        let fechaFinal = new Date($scope.tramite.fechaFin)
        fechaFinal = fechaFinal.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })

        let idUsuario = $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona1;
        let usuario = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.nombrePersona;

        $scope.general.template = $scope.template;

        $scope.datos = {
            'data': {
                "empresa": $scope.tramite.empresa,
                "sucursal": $scope.tramite.sucursal,
                "departamento": $scope.tramite.departamento,
                "solicitante": `IDBPRO: ${idUsuario} ${usuario}`,
                "viajaA": $scope.tramite.concepto,
                "motivo": $scope.tramite.motivo,
                "cliente": $scope.tramite.nombreCliente,
                "fechaInicial": fechaInicio,
                "fechaFinal": fechaFinal,
                "autorizador": ` `,
                "fechaRegistroDevolucion": '',
                "idDevolucion": 0
            },
            "comprobaciones": []
            , "solicitudes": []
        }


        swal({
            title: 'Aviso',
            text: "El documento debe firmarse y entregarse en copia al cajero, recuerda que, durante tu viaje puedes agregar comprobantes de tus gastos asi como hacer la solicitud de más recursos",
            type: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    $("#loading").modal("show");
                    anticipoGastoRepository.getDataReporte($scope.tramite.idCompania, $scope.tramite.idSucursal, $scope.tramite.idDepartamento, $scope.idSolicitud).then(resp => {
                        console.log('resp: ', resp.data[0])
                        // var idAutorizador = 

                        if (resp.data[0].length < 1) {
                            swal('Aviso', 'Aun no es posible generar el vale, la solicitud necesita ser primero aprobada', 'info')
                            $("#loading").modal("hide");
                            return
                        }
                        $scope.datos.comprobaciones = resp.data[0];

                        $scope.general.data = $scope.datos;
                        anticipoGastoRepository.valeParaCaja($scope.general).then((resp) => {

                            var file = new Blob([resp.data], { type: 'application/pdf' });
                            var fileURL = URL.createObjectURL(file);
                            $scope.content = $sce.trustAsResourceUrl(fileURL);

                            $("#loading").modal("hide");
                            $scope.reporteHtml = '';
                            $('#pdfReferenceContent object').remove();
                            $('#pdfReferenceContent').find('iframe').remove();
                            $scope.modalTitle = 'Documento';
                            $("#mostrarPdf").modal("show");
                            //$scope.reporteHtml = resp.data;
                            var pdf = $scope.content;
                            $("").appendTo('#pdfReferenceContent');
                            $(`<object data="${$scope.content}" type="application/pdf" style="width:100%;height:90%"></object>`).appendTo('#pdfReferenceContent');
                            // $("" + pdf + "").appendTo('#pdfReferenceContent');


                        });


                    }).catch(() =>{
                        $("#loading").modal("hide");
                    })
                } 
            });


        // for(var i = 0; i < $scope.conceptosSolicitud.length ; i++){
        //     if ($scope.conceptosSolicitud[i].estatus === 'Aprobado'){
        //         gastosAprobados += $scope.conceptosSolicitud[i].importeAprobado;
        //     }
        // }
        // $scope.data.importes.monto = gastosAprobados
        // $scope.data.usuario.nombre = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.nombrePersona;

        // for(var i = 0; i < $scope.empresas.length ; i++){
        //     if($scope.empresas[i].emp_idempresa === $scope.selEmpresa){
        //         $scope.data.empresa.nombre = $scope.empresas[i].emp_nombre;
        //     }
        // }

        // $scope.general.data = $scope.data;

    }


    $scope.comentariosrechazos = '';
    $scope.getBancoByCLABE = function(){
        console.log( "$scope.tramite.cuenta.clabe",$scope.tramite.cuenta.clabe );
        if( $scope.tramite.cuenta.clabe === undefined || $scope.tramite.cuenta.clabe == '' ){}
        else{
            if( $scope.tramite.cuenta.clabe.length == 18){
                anticipoGastoRepository.BancoByCLABE( $scope.tramite.cuenta.clabe ).then((response) => {
                    //console.log( "datos de la cuenta", response.data.length );
                    if( response.data.length == 0 ){
                        $scope.tramite.cuenta.cveBanxico = '';
                        $scope.tramite.cuenta.cuenta = '';
                        $scope.tramite.cuenta.idBanco = '';
                        $scope.tramite.cuenta.banco = '';
                        $scope.tramite.cuenta.plaza = '';
                        $scope.tramite.cuenta.sucursal = '';
                        $scope.tramite.cuenta.estatus = 0;
                        $scope.comentariosrechazos = '';

                        swal({
                            title: 'Aviso',
                            type: 'warning',
                            text: 'Favor de validar su cuenta CLABE.'
                        })
                    }
                    else{
                        /*$scope.tramite.cuenta.cveBanxico = response.data[0].cveBanxico;
                        $scope.tramite.cuenta.idBanco = response.data[0].IdBanco;
                        $scope.tramite.cuenta.banco = response.data[0].NombreBanco;*/

                        $scope.tramite.cuenta.cveBanxico = response.data[0].cveBanxico;
                        $scope.tramite.cuenta.cuenta = response.data[0].ca_cuenta;
                        $scope.tramite.cuenta.idBanco = response.data[0].IdBanco;
                        $scope.tramite.cuenta.banco = response.data[0].NombreBanco;
                        $scope.tramite.cuenta.plaza = response.data[0].ca_plaza;
                        $scope.tramite.cuenta.sucursal = response.data[0].ca_sucursal;
                        $scope.tramite.cuenta.estatus = (response.data[0].ca_estatus === undefined) ? 0 : response.data[0].ca_estatus;

                        $scope.comentariosrechazos = response.data[0].observaciones;
                    }
                });
            }
            else{
                swal({
                    title: 'Aviso',
                    type: 'warning',
                    text: 'La cuenta CLABE debe ser de 18 dígitos.'
                })
            }
        }
    }

    $scope.guardarCuenta = false;
    $scope.tempCLABE = '';
    $scope.GetDataBancoByIdPersona = function(){
        //var IdPersona = 89663;
        var IdPersona = $scope.IDEmpleadoBPRO;
        anticipoGastoRepository.GetDataBancoByIdPersona(IdPersona, $scope.selEmpresa).then((res) => {
            var dataCuenta = res.data[0];

            console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<", dataCuenta);

            if( res.data.length == 0 ){
                $scope.guardarCuenta = true;

                $scope.tramite.cuenta.clabe = '';
                $scope.tramite.cuenta.cuenta = '';
                $scope.tramite.cuenta.plaza = '';
                $scope.tramite.cuenta.sucursal = '';
                $scope.tramite.cuenta.idBanco = '';
                $scope.tramite.cuenta.banco = '';
                $scope.tramite.cuenta.cveBanxico = '';

                $scope.tempCLABE = '';
            }
            else{
                $scope.guardarCuenta = false;
                $scope.tramite.cuenta.clabe = dataCuenta.BCO_CLABE;
                $scope.tramite.cuenta.cuenta = dataCuenta.BCO_NUMCUENTA;
                $scope.tramite.cuenta.plaza = dataCuenta.BCO_PLAZA;
                $scope.tramite.cuenta.sucursal = dataCuenta.BCO_SUCURSAL;
                $scope.tramite.cuenta.banco = dataCuenta.BCO_NOMBREBANCO;

                $scope.tempCLABE = dataCuenta.BCO_CLABE;
                $scope.getBancoByCLABE();
            }
        });
    }

    $scope.GetDataByCuenta = function( cuenta, empresa ){
        anticipoGastoRepository.GetDataByCuenta(cuenta, empresa).then((res) => {
            var dataCuenta = res.data[0];

            if( res.data.length == 0 ){
                
            }
            else{
                $scope.tramite.cuenta.plaza = dataCuenta.BCO_PLAZA;
                $scope.tramite.cuenta.sucursal = dataCuenta.BCO_SUCURSAL;
            }
        });
    }

    /**Se comenta este metodo y se crea uno que no guarde la informacion de la cuenta bancaria por el momento no se usara */
    // $scope.validaCuenta = function(){
    //     $scope.aplicaUpdate = false;
    //     var error = $scope.validarTramite($scope.tramite);
    //     if (error == '') {
    //         var parapetros = {
    //             IdUsuario: $rootScope.usuario.usu_idusuario,
    //             IdPersona: $scope.tramite.idPersona,
    //             IdBanco: $scope.tramite.cuenta.idBanco,
    //             Plaza: $scope.tramite.cuenta.plaza,
    //             Sucursal: $scope.tramite.cuenta.sucursal,
    //             Cuenta: $scope.tramite.cuenta.cuenta,
    //             CLABE: $scope.tramite.cuenta.clabe,
    //             IdEmpresa: $scope.selEmpresa,
    //             bancoNombre: $scope.tramite.cuenta.banco,
    //             cvebanxico: $scope.tramite.cuenta.cveBanxico,
    //             solicitante: $rootScope.usuario.usu_idusuario
    //         }
            
    //         anticipoGastoRepository.GuardaBanco(parapetros).then((res) => {
    //             console.log( "Guardado de Banco", res.data[0].perTra );

    //             if( res.data[0].success == 1){
    //                 html = $scope.bodyTramitesCuenta( res.data[0].perTra, $scope.tramite.cuenta, $scope.nombrePersona );
    //                 //$scope.sendMail("alex9abril@gmail.com", "PRUEBAS - Solicitud de validación de cuenta para Gastos de Viaje", html);
    //                 $scope.sendMail($scope.dataCorreosTesoreria, "Solicitud de validación de cuenta para Gastos de Viaje", html);
    //             }

    //             if(Number.isInteger(res.data[0].perTra) && (res.data[0].success == 1 || res.data[0].success == 0)){
    //                 $scope.guardarTramite( res.data[0].perTra );
    //             }
    //             else if(res.data[0].success == 1 || res.data[0].success == 0){
    //                 $scope.guardarTramite(0);
    //             }
    //             else{
    //                 swal('Alerta','Se presento un error al guardar la información bancaria, los datos capturados no serán almacenados', 'warning');
    //             }
                
    //         });
    //         //$scope.guardarTramite();
    //     }
    //     else{
    //         swal('Anticipo de Gasto', error, 'warning');
    //     }
    // }

    $scope.validaCuenta = function(){
        $scope.aplicaUpdate = false;

        var error = $scope.validarTramite($scope.tramite);
        if (error == '') {
            $scope.guardarTramite(0);
            ObtieneAutorizador()
        }else{
            swal('Anticipo de Gasto', error, 'warning');
        }
    }

    $scope.validaCuentaUpdate = function(){
       
        var error = $scope.validarTramite($scope.tramite);
        if (error == '') {
            console.log("$scope.empleados", $scope.empleados);
            if( $scope.empleados.length == 0 ){
                $scope.UpdateCuenta( $rootScope.usuario.usu_idusuario, $scope.tramite.idPersona );
                $scope.aplicaUpdate = false;
            }
            else{
                anticipoGastoRepository.IdBproByUser($scope.empleados[0].IdPersona).then((res) => { // $scope.empleados
                    $scope.UpdateCuenta( res.data[0].usu_idusuario, $scope.empleados[0].IdPersona );

                    // if( opcion == 1 ){
                    //     // Se envia la solicitud despues de actualizar desde boton enviar
                    //     $scope.accionEnviar = true;
                    //     $scope.buscarAutorizador($scope.selEmpresa);
                    // }
                });
            }
       
        }
        else{
            swal('Anticipo de Gasto', error, 'warning');
        }
    }

    $scope.UpdateCuenta = function( IdUsuario, IdPersona  ){
        var parapetros = {
            IdUsuario: IdUsuario, //$rootScope.usuario.usu_idusuario
            IdPersona: IdPersona, //$scope.tramite.idPersona,
            IdBanco: $scope.tramite.cuenta.idBanco,
            Plaza: $scope.tramite.cuenta.plaza,
            Sucursal: $scope.tramite.cuenta.sucursal,
            Cuenta: $scope.tramite.cuenta.cuenta,
            CLABE: $scope.tramite.cuenta.clabe,
            IdEmpresa: $scope.selEmpresa,
            bancoNombre: $scope.tramite.cuenta.banco,
            cvebanxico: $scope.tramite.cuenta.cveBanxico,
            solicitante: $rootScope.usuario.usu_idusuario
        }
        
        anticipoGastoRepository.GuardaBanco(parapetros).then((res) => {
            console.log( "Guardado de Banco", res );
            if( res.data[0].success == 1 ){
                html = $scope.bodyTramitesCuenta( res.data[0].perTra, $scope.tramite.cuenta, $scope.nombrePersona );
                $scope.sendMail($scope.dataCorreosTesoreria, "Solicitud de validación de cuenta para Gastos de Viaje", html)
            }


            $scope.actualizarTramite( $scope.idSolicitud );
        });
    }

    $scope.guardarTramite = function ( perTraEstadoCuenta ) {
        var error = $scope.validarTramite($scope.tramite);
        if (error == '') {
            var fechaInicio = $scope.tramite.fechaInicio.toISOString().substring(0, 10);
            var fechaFin = $scope.tramite.fechaFin.toISOString().substring(0, 10);
            var tramiteItem = {
                idSolicitud: $scope.tramite.idSolicitud,
                idUsuario: $rootScope.usuario.usu_idusuario,
                idTramite: 9,
                idEmpresa: $scope.selEmpresa,
                idSucursal: $scope.selSucursal,
                idFormaPago: 0,
                idDepartamento: $scope.selDepartamento,
                observaciones: '',
                idEstatus: 0,
                importe: parseFloat($scope.tramite.importe),
                idCliente: $scope.tramite.idPersona,
                concepto: $scope.tramite.concepto,
                fechaInicio: fechaInicio.substring(8, 10) + '/' + fechaInicio.substring(5, 7) + '/' + fechaInicio.substring(0, 4),
                fechaFin: fechaFin.substring(8, 10) + '/' + fechaFin.substring(5, 7) + '/' + fechaFin.substring(0, 4),
                motivo: $scope.tramite.motivo,
                nombreCliente: $scope.tramite.nombreCliente,

                cuentaBancaria: $scope.tramite.cuenta.cuenta,
                numeroCLABE: $scope.tramite.cuenta.clabe,
                cveBanxico: $scope.tramite.cuenta.cveBanxico,
                kilometro: $scope.tramite.kilometro
            };

            // console.log("============= TRAMITE",$scope.tramite);
            // console.log("============= KILOMETRO",tramiteItem);
            

            $('#spinner-loading').modal('show');
            anticipoGastoRepository.guardarTramite(tramiteItem).then((res) => {
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    swal('Anticipo de Gasto', 'Se ha guardado la solicitud correctamente, favor de indicar los conceptos.', 'success');
                    $('#spinner-loading').modal('hide');
                    $scope.tramite.idSolicitud = res.data.idRegistro;
                    $scope.idSolicitud = res.data.idRegistro;
                    $scope.accionTramite = 1;

                    if($scope.documento.archivo !== ''){
                        $scope.documentosCuentaUsuario.push($scope.documento);
                    }
            
                    if($scope.documentoINE.archivo !== ''){
                        $scope.documentosCuentaUsuario.push($scope.documentoINE);
                    }
            
                    if($scope.documentosCuentaUsuario.length > 0){

                        for(let i= 0;i<$scope.documentosCuentaUsuario.length;i++){
                            $scope.saveDocumentosTramiteBanco($scope.idSolicitud, 0, $scope.documentosCuentaUsuario[i]);
                        }

                        // $scope.documentosCuentaUsuario.forEach(documento =>{
                        //     $scope.saveDocumentosTramiteBanco(perTraEstadoCuenta, 0, documento);
                        // })
                    }
                        //$scope.saveDocumentosTramite($scope.tramite.idSolicitud, 0, $scope.documento);
                        //$scope.saveDocumentosTramite(perTraEstadoCuenta, 0, $scope.documento);
                    
                } else {
                    $('#spinner-loading').modal('hide');
                    html = $scope.bodyTramitesCuenta( res.data[0].perTra, $scope.tramite.cuenta, $scope.nombrePersona );
                    $scope.sendMail($scope.dataCorreosTesoreria, "PRUEBAS - Solicitud de validación de cuenta", html)
                }
            });
        } else {
            swal('Anticipo de Gasto', error, 'warning');
        }
    };

    $scope.actualizarTramite = function ( perTraEstadoCuenta ) {
        var error = $scope.validarTramite($scope.tramite);
        if (error == '') {
            var fechaInicio = $scope.tramite.fechaInicio.toISOString().substring(0, 10);
            var fechaFin = $scope.tramite.fechaFin.toISOString().substring(0, 10);
            var tramiteItem = {
                idSolicitud: $scope.idSolicitud,
                idEmpresa: $scope.selEmpresa,
                idSucursal: $scope.selSucursal,
                idDepartamento: $scope.selDepartamento,
                concepto: $scope.tramite.concepto,
                fechaInicio: fechaInicio.substring(8, 10) + '/' + fechaInicio.substring(5, 7) + '/' + fechaInicio.substring(0, 4),
                fechaFin: fechaFin.substring(8, 10) + '/' + fechaFin.substring(5, 7) + '/' + fechaFin.substring(0, 4),
                motivo: $scope.tramite.motivo,
                nombreCliente: $scope.tramite.nombreCliente,
                cuentaBancaria: $scope.tramite.cuenta.cuenta,
                numeroCLABE: $scope.tramite.cuenta.clabe,
                cveBanxico: $scope.tramite.cuenta.cveBanxico,
                kilometro: $scope.tramite.kilometro
            };

            

            $('#spinner-loading').modal('show');
            anticipoGastoRepository.actualizaTramite(tramiteItem).then((res) => {
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    swal('Anticipo de Gasto', 'Se actualizó la solicitud correctamente', 'success');
                    $('#spinner-loading').modal('hide');
                    $scope.tramite.idSolicitud = res.data.idRegistro;
                    $scope.idSolicitud = res.data.idRegistro;
                    $scope.accionTramite = 1;
                    if($scope.documento.archivo !== ''){
                        $scope.documentosCuentaUsuario.push($scope.documento);
                    }
            
                    if($scope.documentoINE.archivo !== ''){
                        $scope.documentosCuentaUsuario.push($scope.documentoINE);
                    }
            
                    if($scope.documentosCuentaUsuario.length > 0){
                        $scope.documentosCuentaUsuario.forEach(documento =>{
                            $scope.saveDocumentosTramite(perTraEstadoCuenta, 0, documento);
                        })
                    }
                    //$scope.saveDocumentosTramite( tramiteItem.idSolicitud, 0, $scope.documento)
                    //$scope.saveDocumentosTramite( perTraEstadoCuenta, 0, $scope.documento)
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Anticipo de Gasto', 'Ocurrió un error al generar la actualización', 'warning');
                }
            });
        } else {
            swal('Anticipo de Gasto', error, 'warning');
        }
    };

    $scope.validaEstatusEnviar = function(){
        if($scope.tramite.cuenta.estatus == 3){
            return false;
        }
        else if($scope.tramite.cuenta.estatus == 0){
            return false;
        }
        else{
            return false;
        }

    }

    $scope.soloNumeros = function( e ){
        var key = window.event ? e.which : e.keyCode;
            if (key < 48 || key > 57) {
            e.preventDefault();
        }
    }

    $scope.validaKilometros = function(  ){
        if( $scope.tramite.kilometro === undefined ){
            swal('Validación de Kilometraje', "Debe manejarse un mínimo de 50 kilómetros", 'warning');
            $scope.tramite.kilometro = 50
        }
    }

    $scope.bodyTramitesCuenta = function( tramite, cuenta, solicitante ){
        let usuarioSolicitante = $scope.empleados.length > 0 &&  $scope.empleados !== undefined && $scope.empleados !== null ? $scope.empleados[0].nombreEmpleado : $scope.nombrePersona ;

        var html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                    <div>
                        <p>Solicitud validación de cuenta bancaria</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="text-align: center;" colspan="2"><strong>Detalle de la solicitud</strong></td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Tramite:</span></td>
                                    <td>` + tramite + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                    <td>` + usuarioSolicitante + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">CLABE:</span></td>
                                    <td>` + cuenta.clabe + `</td>
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


    $scope.guardarArchivoVale = function () {
      anticipoGastoRepository
        .saveDocReportePresupuestoGV(
          $scope.idSolicitud,
          $scope.documento.archivo.archivo
        )
        .then((resp) => {
          console.log(resp);
          swal(
            "Información",
            "El presupuesto autorizado se ha guardado correctamente y se encuentra en revisión por Finanzas 1",
            "success"
          );

          setTimeout(() => {
            $scope.documento = { url: "", archivo: "", ext_nombre: "pdf" };
            document.getElementById("picturePresupuesto").value = null;
            $location.path("/misTramites");
            //$("#viewCargaReporte").modal("hide");
            var numTramite = $scope.tramite.idSolicitud;
            var html =
              `
            <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
            <div>Favor de generar la salida de efectivo para el tramite de gasto de viaje </div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td style="text-align: right;"><span style="color: #ff0000;">Tramite:</span></td>
                            <td>` +
              numTramite +
              `</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;

            //$scope.sendMail( 'adriana.olivares@grupoandrade.com,roberto.almanza@coalmx.com', `Solicitud Salida de efectivo gastos de viaje ${$scope.tramite.idSolicitud}`, html )
            $scope.sendMail(
              resp.data[0].correoSalidaEfectivo,
              `Solicitud Salida de efectivo gastos de viaje ${$scope.tramite.idSolicitud}`,
              html
            );
          }, 3000);
        });
    };

    $scope.cancelarArchivoVale = function(){
        $scope.documento = {url:'',archivo:'', ext_nombre:'pdf'};
        document.getElementById("picturePresupuesto").value = null;
    }

    $scope.GetCorreosTesoreria = function(){
        anticipoGastoRepository.GetCorreosTesoreria().then( (res) =>{
            $scope.dataCorreosTesoreria = res.data[0].correoTesoreria;
            $scope.rutaDocumentosGV = res.data[0].rutaDocumentosGV
        });
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
    }


    $scope.GeneraCambio = function(){
        $scope.aplicaUpdate = true;
        console.log( "$scope.aplicaUpdate", $scope.aplicaUpdate )
    }

    // For todays date; 
    Date.prototype.today = function() { 
        return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear(); 
    } 

    // For the time now 
    Date.prototype.timeNow = function() { 
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds(); 
    } 

    $scope.verOPs = function(){
        //modalordenesCompra
        console.log('modal op')
       // $('#tableOP').DataTable().clear();
       // $('#tableOP').DataTable().destroy();
        setTimeout(() => {
            $('#tableOP').DataTable({
                destroy: true,
                "responsive": true,
                searching: true,
                paging: true,
                autoFill: false,
                fixedColumns: true,
                pageLength: 5,
                "order": [[1, "asc"]],
                "language": {
                    search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    searchPlaceholder: 'Buscar',
                    oPaginate: {
                        sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                    }
                }
            });
            $('#tableOP_length').hide();
            $('#modalordenesCompra').find('object').remove();
            $("#modalordenesCompra").modal({backdrop: 'static', keyboard: false})
            $("#modalordenesCompra").modal("show");
        })

       
    }

    $scope.solicitarToken = () =>{
        swal('Solicitud','Se ha enviado a su correo el token solicitado', 'success')

        var usuarioSolicitante= $rootScope.usuario.usu_idusuario;// $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona
        console.log('solicitante', usuarioSolicitante)
        anticipoGastoRepository.getToken(usuarioSolicitante).then(res => {

          let  html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
          <div>
            <p>
                ${res.data[0].mensaje} <br>
                TOKEN: <strong> ${res.data[0].token} </strong> <br>
                Vencimiento: ${res.data[0].vence}
            </p>
          </div>
          `;
            $scope.sendMail( res.data[0].correo, res.data[0].asunto, html )
        })
    }

    $scope.abrirFirma = async() => {

        consulta = await consultaPresupuestoFirmado()
        console.log(consulta)
       
        if(consulta.estatus === 1){
            $scope.token = consulta.token;
            $scope.verValeToken(consulta, 1)
        }else{

            $scope.token = '';
            $("#CapturaFirma").modal({backdrop: 'static', keyboard: false})
            $('#CapturaFirma').modal('show');
        }

    }

    $scope.validaToken = () =>{

        var usuarioSolicitante= $rootScope.usuario.usu_idusuario; //$scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona
        anticipoGastoRepository.validaToken($scope.token, Number(usuarioSolicitante)).then(res => {
            if(res.data[0].estatus !== 1){
                swal('Token Invalido', res.data[0].mensaje, 'warning');
            }
            else{
                $scope.verValeToken(res.data[0],0)
            }
        })
    }

    $scope.verValeToken = function (dataToken, esconsulta) {
        $('#CapturaFirma').modal('hide');
        $("#loading").modal("show");
        console.log('gastos de viaje', $scope.conceptosSolicitud)
        let gastosAprobados = 0;
        let fechaInicio = new Date($scope.tramite.fechaInicio)
        fechaInicio = fechaInicio.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })

        let fechaFinal = new Date($scope.tramite.fechaFin)
        fechaFinal = fechaFinal.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })

        let idUsuario = $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona1;
        let usuario = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.nombrePersona;
        let fechaFirma = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })


        let fileBase64

        $scope.general.template = $scope.template;

        $scope.datos = {
            'data': {
                "empresa": $scope.tramite.empresa,
                "sucursal": $scope.tramite.sucursal,
                "departamento": $scope.tramite.departamento,
                "solicitante": `IDBPRO: ${idUsuario} ${usuario}`,
                "viajaA": $scope.tramite.concepto,
                "motivo": $scope.tramite.motivo,
                "cliente": $scope.tramite.nombreCliente,
                "fechaInicial": fechaInicio,
                "fechaFinal": fechaFinal,
                "autorizador": ` `,
                "fechaRegistroDevolucion": '',
                "idDevolucion": 0,
                "token":$scope.token
            },
            "comprobaciones": []
            , "solicitudes": []
        }

        anticipoGastoRepository.getDataReporteToken($scope.tramite.idCompania, $scope.tramite.idSucursal, $scope.tramite.idDepartamento, $scope.idSolicitud, dataToken.idToken, fechaFirma, dataToken.idUsuario ).then(resp => {
            console.log('resp: ', resp.data[0])
            

            if (resp.data[0].length < 1) {
                swal('Aviso', 'Aun no es posible generar el vale, la solicitud necesita ser primero aprobada', 'info')
                return
            }
            $scope.datos.comprobaciones = resp.data[0];

            $scope.general.data = $scope.datos;
            anticipoGastoRepository.valeParaCaja($scope.general).then((resp) => {

                fileBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(resp.data)))

                if(esconsulta === 0){
                    anticipoGastoRepository.saveDocReportePresupuestoGV($scope.idSolicitud, fileBase64).then(resp => {
                        console.log(resp)
                    })
                }

                var file = new Blob([resp.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $scope.content = $sce.trustAsResourceUrl(fileURL);

                $("#loading").modal("hide");
                $scope.reporteHtml = '';
                $('#pdfReferenceContent object').remove();
                $('#pdfReferenceContent').find('iframe').remove();
                $scope.modalTitle = 'Documento';
                $("#mostrarPdf").modal("show");
                //$scope.reporteHtml = resp.data;
                var pdf = $scope.content;
                $("").appendTo('#pdfReferenceContent');
                $(`<object data="${$scope.content}" type="application/pdf" style="width:100%;height:90%"></object>`).appendTo('#pdfReferenceContent');
                // $("" + pdf + "").appendTo('#pdfReferenceContent');


            });


        })

    }

   async function consultaPresupuestoFirmado() {

    return new Promise((resolve, reject)  =>{
        anticipoGastoRepository.consultaPresupuestoFirmado($scope.idSolicitud,$scope.tramite.idCompania, $scope.tramite.idSucursal, $scope.tramite.idDepartamento).then((res) => {
            resolve(res.data[0])
        }).catch(err => {
            reject({
                'estatus':-1,
                'mensaje':'No fue posible verificar si existen presupuestos firmados'
            })
        })
    })

   }

   $scope.validaDistancia = function(cb){

    if(cb !== undefined){
        if(cb.checkAll ){
            $scope.tramite.kilometro = 1;
        }
        else{
            $scope.tramite.kilometro = 0
        }  
    }
   
   }

   $scope.SustituirDoctuentos = function(){
     
    $scope.documentosCuentaUsuario = [];
        if($scope.documento.archivo !== '' && $scope.documento !== undefined){
            $scope.documentosCuentaUsuario.push($scope.documento);
        }

        if($scope.documentoINE.archivo !== '' && $scope.documentoINE !== undefined){
            $scope.documentosCuentaUsuario.push($scope.documentoINE);
        }

        if($scope.documentosCuentaUsuario.length > 0){
            for(let i= 0; i<$scope.documentosCuentaUsuario.length;i++){
                if($scope.documentosCuentaUsuario[i].id_perTra === null){
                    $scope.saveDocumentosTramiteBanco($scope.idSolicitud, 0, $scope.documentosCuentaUsuario[i]);
                }
  
            }
            // $scope.documentosCuentaUsuario.forEach(documento =>{
            //     $scope.saveDocumentosTramite($scope.idSolicitud, 0, documento);
            // })
        }

    }

    $scope.DominiosGA = function(){

        anticipoGastoRepository.DominiosGA().then(res => {
            $scope.dominiosValidos = res.data;
        });

    }

    function ObtieneAutorizador(){
        $scope.muestraAutorizador = true;
        anticipoGastoRepository.getBuscarAutorizador($scope.selEmpresa, $scope.selSucursal, $scope.selDepartamento, $scope.selUsuario, 1).then(res =>{
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].usu_correo;
            $scope.nombreAutorizador = res.data[0].nombreUsuario;
        })
    }
    
});                                                                                                                    