registrationModule.controller('comprobacionGastoController', function ($scope, $rootScope, $route, $location, anticipoGastoRepository, devolucionesRepository, $http, fondoFijoRepository, misTramitesValesRepository, aprobarDevRepository, clientesRepository) {
    $scope.usuario = {};
    $scope.empresas = [];
    $scope.sucursales = [];
    $scope.departamentos = [];
    $scope.empleados = [];
    $scope.areaAfectacionList = [];
    $scope.selDepartamento = 0;
    $scope.selEmpresa = 0;
    $scope.selSucursal = 0;
    $scope.selEmpleado = 0;
    $scope.idConceptoSeleccion = 0;
    $scope.selCNC_CONCEPTO1 = '';
    $scope.idEmpleado = 0;
    $scope.accionTramite = 0;
    $scope.accionFormulario = 0;
    $scope.accionEnviar = false;
    $scope.idTipoProceso = 1;
    $scope.fileItem = null;
    $scope.file = '';
    $scope.currentDate = '';
    $scope.nombreEmpleado = '';
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
    $scope.tipoDevolucion = false;
    $scope.archivos = [];
    $scope.departamentosArchivo = [];
    $scope.conceptoArchivo = {};
    $scope.porcentaje = 0;
    $scope.porcentajeTotal = 0;
    $scope.errorMensaje = '';
    $scope.idEstatus = 0;
    $scope.montoGastado = 0;
    $scope.montoDiferencia = 0;
    $scope.montoAprobado = 0;
    $scope.toleranciaComprobacion = 0;
    $scope.politicaGasto = '';
    $scope.empleadoList = [];
    $scope.conceptoXmlList = [];
    $scope.archivoEdicion = {};
    $scope.devolucionTotal = false;
    $scope.conceptoSeleccionado = '';
    $scope.amountAG = 2000;
    $scope.montoMaximoGV = 0;
    $scope.idtipoViaje = -1
    $scope.disabledTipoViaje = true;
    $scope.selUsuario = 0
    var html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
    "</center></div><div><p><br>";
    var html2 = "</p></div>";
    $scope.archivoDevolucion = { nombreArchivo: '', archivo: null };
    $scope.archivoRecibo = { nombreArchivo: '', archivo: null };
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

    $scope.valeCargado = true
    $scope.disabledTipoViaje = true;
    $scope.disabledConcepto = true;
    $scope.disabledMonto = true;
    $scope.distancia = 50;
    $scope.hiddenOrdenCompra = true
    $scope.totalGastoMasTramite = 0
    $scope.totalGastoMasSolicitado = 0

    $scope.init = () => {
        //$('#spinner-loading').modal('show');
        $rootScope.usuario = JSON.parse(localStorage.getItem('usuario'));
        $scope.currentDate = new Date().toISOString().substring(0, 10);

        $scope.idTramite = JSON.parse(localStorage.getItem('borrador')).idTramite;
        $scope.idSolicitud = JSON.parse(localStorage.getItem('borrador')).idPerTra;
        //$scope.subTitulo = 'Numero de solicitud: ' + $scope.idSolicitud;
        $scope.getAnticipoGastoItem();
        $scope.accionTramite = 1;
        $scope.restartTableConceptos();
        $scope.buscarRevisorComp();
        $scope.getEmpleadosPorIdSolicitud();
        $scope.getToleranciaComprobacionDeMas();
        anticipoGastoRepository.imageComprobanteOrdenPagoGV($scope.idSolicitud, $scope.idTramite , 'GV' ).then(res => {
            if(res.data[0].url === undefined || res.data[0].url === null){
                $scope.hiddenOrdenCompra = true
            }
            else{
                $scope.hiddenOrdenCompra = false
                $scope.documentoComprobacion = res.data;
            }
        })
    }

    $scope.getToleranciaComprobacionDeMas = function(){
        anticipoGastoRepository.toleranciaComprobacion().then( (res) =>{
            $scope.toleranciaComprobacion = res.data[0].centavos;
        });
    }

    $scope.buscarRevisorComp = function () {
        anticipoGastoRepository.getRevisorComp($scope.idSolicitud).then((res) => {
            if (res.data != null && res.data.length > 0) {
                $scope.asunto = res.data[0].asunto;
                $scope.nombreUsuario = res.data[0].nombreUsuario;
                $scope.correoAutorizador = res.data[0].correoAutorizador;
            } 
        });
    };

    $scope.getAnticipoGastoItem = function () {
        anticipoGastoRepository.getAnticipoGastoById($scope.idSolicitud, 5).then((res) => {
            if (res.data != null && res.data.length > 0) {
                $scope.tramite = {
                    idSolicitud: res.data[0].idSolicitud,
                    concepto: res.data[0].concepto,
                    fechaInicio: new Date(res.data[0].fechaInicio.substring(6, 10), res.data[0].fechaInicio.substring(3, 5) - 1, res.data[0].fechaInicio.substring(0, 2)),//new Date(res.data[0].fechaInicio).toISOString().substring(0, 10),//new Date(res.data[0].fechaInicio.substring(6, 10), (res.data[0].fechaInicio.substring(3, 5) - 1), res.data[0].fechaInicio.substring(0, 2)).toISOString().substring(0, 10),
                    fechaFin: new Date(res.data[0].fechaFin.substring(6, 10), res.data[0].fechaFin.substring(3, 5) - 1, res.data[0].fechaFin.substring(0, 2)),//new Date(res.data[0].fechaFin).toISOString().substring(0, 10),//new Date(res.data[0].fechaFin.substring(6, 10), (res.data[0].fechaFin.substring(3, 5) - 1), res.data[0].fechaFin.substring(0, 2)).toISOString().substring(0, 10),
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
                    salidaEfectivo: (res.data[0].Comprobar == 1),
                    idPersona:  res.data[0].PER_IDPERSONA,
                    idPersonaAdicional: res.data[0].idUsuarioAdicional,
                    montoMaximoFactura: res.data[0].montoMaximoFactura
                };

                $scope.amountAG = $scope.tramite.montoMaximoFactura

                var fmax = res.data[0].fechaInicio.split('/');
                var a = fmax[2] + '-' + fmax[1] + '-' + fmax[0]
                
                $scope.minFechaVale = a;
                $scope.maxFechaVale = new Date().toISOString().substring(0, 10);
                
                console.log( "$scope.minFechaVale", $scope.minFechaVale );
                console.log( "$scope.maxFechaVale",  a);

                anticipoGastoRepository.getRfcPorNombreRazon($scope.tramite.empresa).then((response) => {
                    if (response.data != null) {
                        $scope.empresaRFC = response.data[0].PER_RFC;
                    }
                });

                $scope.selEmpresa = $scope.tramite.idCompania;
                $scope.selSucursal = $scope.tramite.idSucursal;
                $scope.selDepartamento = $scope.tramite.idDepartamento;
                if ($scope.tramite.idEstatus == 2) {
                    $scope.actualizaEstatusTramiteComprobar();
                }
                $scope.estatusAnticipo = res.data[0].estatusAnticipo;
                $scope.openWizard();
                $scope.titulo = 'Comprobación de Gasto N° ' +  res.data[0].idSolicitud;
                $scope.tramite.fechaInicio = $scope.tramite.fechaInicio.toISOString().substring(0, 10);
                $scope.tramite.fechaFin = $scope.tramite.fechaFin.toISOString().substring(0, 10);
                $scope.accionFormulario = 1;
                $scope.idTipoProceso = 3;
                $scope.conceptosGastoPorSolicitud(1);
                $scope.getArchivosPorIdentificador($scope.idSolicitud, 1);
                $scope.archivos = [];

                OrdenesNoCobradas()

                anticipoGastoRepository.getBuscarAutorizador(
                    $scope.selEmpresa, 
                    $scope.selSucursal, 
                    $scope.selDepartamento, 
                    $scope.tramite.idPersonaAdicional === 0 ?  $scope.tramite.idPersona :  $scope.tramite.idPersonaAdicional
                    ).then(resp => {
                    $scope.autorizador = resp.data[0].nombreUsuario;
                })

            } else {
                swal('Anticipo de Saldo', 'No se encontro el registro', 'success');
                $location.path('/misTramites');
            }
        });
    };

    $scope.getDepartamentos = function (idSucursal) {
        $scope.departamentos = [];
        $scope.selSucursal = idSucursal;
        if ($scope.selSucursal == null || $scope.selSucursal == undefined || $scope.selSucursal == 0) {
            $scope.disabledDepto = true;
            $scope.selSucursal = 0;
            $scope.selDepartamento = 0;
        } else {
            devolucionesRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then((res) => {
                $scope.departamentos = res.data;
                $scope.disabledDepto = false;
            });
        }
    }
    $scope.getAreaAfectacion = function (accion) {
        $scope.areaAfectacionList = [];
        anticipoGastoRepository.getDepartametoAreaAfectacion($scope.selEmpresa, $scope.selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.areaAfectacionList = res.data;
                if(accion == 0 || accion === undefined){
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
            CNC_CONCEPTO2: $scope.idConceptoSeleccion
        };
        anticipoGastoRepository.getCuentaContable(data).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.concepto.CNC_CUENTA = res.data[0].CNC_CUENTA
                $scope.concepto.numeroCuenta = res.data[0].CNC_CUENTA;
            }
        });
    };

    $scope.asignarDepartamento = function (idDepartamento) {
        $scope.selDepartamento = idDepartamento;
    }

    $scope.salirTramite = function () {
        $location.path('/misTramites');
    }

    $scope.asignarConcepto = function (idConcepto) {
        $scope.idConceptoSeleccion = idConcepto;
        $scope.concepto.id = idConcepto;
        $scope.disabledTipoViaje = false;
        $scope.mostrarDistancia = false;

        var concepto = $scope.conceptoGastoList.filter(concepto => concepto.id == idConcepto);
        if (concepto.length > 0) {
            $scope.concepto.politicaGasto = concepto[0].politicaGasto;
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

                        if(el.concepto === 'GTOS DE VIAJE GASOLINA' || el.concepto === 'GTOS DE VIAJE CASETAS' || el.concepto === 'GTOS DE VIAJE RENTA AUTOMOVIL' || el.concepto.indexOf('TRANSPORTACIÓN')>0){
                            $scope.mostrarDistancia = true;
                        }else{
                            $scope.mostrarDistancia = false;
                        }

                      
                    }
                });
                $scope.getCuentaContable();
            }
        }
        
        if($scope.disabledTipoViaje === false && $scope.idtipoViaje > -1){
            $scope.ObtineMaximoTabulador()
        }
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

    $scope.mostrarConceptos = function (idTramiteEmpleado) {
        $scope.idEmpleado = idTramiteEmpleado;
        $scope.conceptosGastoPorSolicitud();

    }

    $scope.actualizaImporteConcepto = function () {
        $("#modalConceptoGastoEdicion").modal("hide");
        $('#spinner-loading').modal('show');
        $scope.conceptoEdit.idEstatus = 0;
        $scope.conceptoEdit.idTipoProceso = $scope.idTipoProceso;
        $scope.conceptoEdit.distancia = $scope.distancia;
        anticipoGastoRepository.actualizaImporteConcepto($scope.conceptoEdit, $rootScope.usuario.usu_idusuario).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.conceptosGastoPorSolicitud();
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Se actualizó la solicitud correctamente', 'success');
            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Ocurrio un error al generar la actualización', 'success');
            }
        });
    };

    $scope.actualizaEstatusTramiteComprobar = function () {
        anticipoGastoRepository.actualizaEstatusTramite($scope.tramite.idSolicitud, 2).then((res) => {
            if (res == null || res.data == null || res.data.respuesta == 0) {
                swal('Anticipo de Saldo', 'Ocurrio un error al obtener la información', 'error');
                $location.path('/misTramites');
            } else {
                $scope.tramite.idEstatus = 7;
            }
        });
    };

    $scope.actualizaEstatusTramite = function () {

        if(!$scope.valeCargado){
            swal('Comprobación de gastos', 'Es obligatorio subir el vale firmado', 'warning');
            return;
        }

        if($scope.totalGastoMasSolicitado != $scope.totalGastoMasTramite){
            swal('Aviso', 'El gasto de más del trámite, debe ser igual al gasto de más solicitado', 'warning')
            return
        } 

        //if ($scope.accionEnviar) {
        $('#spinner-loading').modal('show');
        anticipoGastoRepository.actualizaEstatusTramite($scope.tramite.idSolicitud, $scope.idTipoProceso).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                if (res.data.idRegistro == 1) {
                    $('#spinner-loading').modal('hide');
                    swal('Comprobación de gastos', 'Se envió  la comprobacion para su aprobación', 'success');
                    var html = html1 + 
                    '<p>Estimado(a) '+$scope.nombreUsuario+ ' favor de autorizar la comprobación de anticipo de gastos. Solicitud: ' + $scope.tramite.idSolicitud +'</p>' + html2;
                    $scope.sendMail($scope.correoAutorizador, $scope.asunto, html);
                    $location.path('/misTramites');
                } else if (res.data.idRegistro == -4) {
                    $('#spinner-loading').modal('hide');
                    swal('Comprobación', 'Asegurate de enviar a aprobación todos los gasto de más antes de enviar toda la comprobación.', 'info');
                    // Asegurate de enviar a aprobación todos los gasto de más antes de enviar toda la comprobación
                } else if (res.data.idRegistro == -3) {
                    $('#spinner-loading').modal('hide');
                    swal('Comprobación de gastos', 'Todos los conceptos deben tener comprobado mayor a cero', 'info');
                } else if (res.data.idRegistro == -2) {
                    $('#spinner-loading').modal('hide');
                    swal('Comprobación de gastos', 'Todos los conceptos deben tener al menos un archivo adjunto', 'info');
                } else if (res.data.idRegistro == -1) {
                    $('#spinner-loading').modal('hide');
                    swal('Comprobación de gastos', 'Todos los archivos .XML deben tener 100% en departamentos', 'info');
                }
            } else {
                $('#spinner-loading').modal('hide');
                swal('Comprobación de gastos', 'Ocurrio un error al generar la actualización', 'success');
            }
        });
        //} else {
        //  $('#spinner-loading').modal('hide');
        // swal('Anticipo de Saldo', 'Todos los archivos .XML deben tener porcentaje de 100', 'info');
        //}
    };

    $scope.getConceptosGasto = function () {
        $scope.conceptoGastoList = [];
        anticipoGastoRepository.getconceptosGastoList($scope.tramite.idSolicitud, $scope.tramite.idCompania, $scope.tramite.idSucursal).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptoGastoList = response.data;
            }
        });
    };

    $scope.getEmpleadosPorIdSolicitud = function () {
        anticipoGastoRepository.getEmpleadosPorIdSolicitud($scope.idSolicitud).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.empleados = response.data;
            } else {
                $scope.empleados = [];
            }
        });
    };

    $scope.conceptosGastoPorSolicitud = function (tipoProceso = 2) {
        //$('#spinner-loading').modal('show');
        $scope.conceptosSolicitud = [];
        $scope.montoGastado = 0;
        $scope.montoAprobado = 0;
        $scope.montoDiferencia = 0;
        anticipoGastoRepository.conceptosGastoPorSolicitud($scope.idSolicitud, $scope.idTipoProceso).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptosSolicitud = response.data;
                if ($scope.idTipoProceso == 1) {
                    $scope.accionEnviar = true;
                }
                for (var i = 0; i < $scope.conceptosSolicitud.length; i++) {
                    $scope.montoGastado = $scope.montoGastado + $scope.conceptosSolicitud[i].importeComprobado;
                    $scope.montoAprobado = $scope.montoAprobado + $scope.conceptosSolicitud[i].importeSolicitado;
                    $scope.razon = $scope.conceptosSolicitud[i].concepto + '-';
                    $scope.conceptosSolicitud[i].archivo = null;
                    if ($scope.idTipoProceso == 1) {
                        if ($scope.conceptosSolicitud[i].idEstatus == 0) {
                            $scope.accionEnviar = true;
                        }
                    }
                }
                if ($scope.idTipoProceso == 3) {
                    $scope.montoDiferencia = $scope.montoAprobado - $scope.montoGastado;
                    //$scope.getArchivosPorIdentificador($scope.idSolicitud, tipoProceso);
                }
                $scope.restartTableConceptos();
                $scope.razon = $scope.razon.substring(0, $scope.razon.length - 1);
            } else {
                $scope.accionEnviar = false;
            }
            //$('#spinner-loading').modal('hide');
        });
    };

    $scope.restartTableConceptos = function (idEstatus) {
        //$('#tblConceptos').DataTable({
        //  "paging": true // false to disable pagination (or any other option)
        //});
        //$('.dataTables_length').addClass('bs-select');
        //$('#tableConceptos').DataTable().desrtoy();
        //$('#tableConceptos').DataTable().destroy();
        setTimeout(() => {
            $('#tableConceptos').DataTable({
                destroy: true,
                "responsive": true,
                searching: false,
                paging: true,
                autoFill: false,
                fixedColumns: true,
                pageLength: 3,
                "order": [[1, "desc"]],
                "language": {
                    search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    searchPlaceholder: 'Buscar',
                    oPaginate: {
                        sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                    }
                }
            });
            $('#tableConceptos_length').hide();

        }, 500);
    };

    // $scope.guardarConceptoPorSolicitud = function () {
    //     $('#spinner-loading').modal('show');
    //     $scope.concepto.idEstatus = $scope.idEstatus;
    //     $scope.concepto.idUsuario = $rootScope.usuario.usu_idusuario;
    //     $scope.concepto.idTipoProceso = $scope.idTipoProceso;
    //     $scope.concepto.importeSolicitado = 0;
    //     anticipoGastoRepository.guardarConceptoPorSolicitud($scope.concepto, $scope.idSolicitud).then((res) => {
    //         if (res != null && res.data != null && res.data.resppuesta != 0) {
    //             swal('Anticipo de Saldo', 'Se genero la solicitud correctamente', 'success');
    //             $("#modalConceptoGasto").modal("hide");
    //             $('#spinner-loading').modal('hide');
    //             $scope.conceptosGastoPorSolicitud();
    //             $scope.idConceptoSeleccion = 0;
    //         } else {
    //             $('#spinner-loading').modal('hide');
    //             swal('Anticipo de Saldo', 'Ocurrio un error al generar la solicitud', 'success');
    //         }
    //     });
    // };
    $scope.guardarConceptoPorSolicitud = async function () {
        if ($scope.idConceptoSeleccion <= 0) {
            swal('Anticipo de Saldo', 'Debe seleccionar un concepto', 'warning');
        } else if ($scope.concepto.importeSolicitado <= 0) {
            swal('Anticipo de Saldo', 'Debe ingresar un importe', 'warning');
        } else {
            // var validaRet = await ValidaRetenciones($scope.selSucursal, $scope.idtipoComprobante.PAR_IDENPARA, $scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion);
            // if(validaRet[0].estatus == 1)
            // {
            $('#spinner-loading').modal('show');
            $scope.concepto.idEstatus = $scope.idEstatus;
            $scope.concepto.idUsuario = $rootScope.usuario.usu_idusuario;
            $scope.concepto.idTipoProceso = 1;
            $scope.concepto.distanciaKm = $scope.distancia
             //$scope.idTipoProceso;
            // $scope.concepto.idtipoComprobante =  $scope.idtipoComprobante.PAR_IDENPARA;
            // $scope.concepto.tipoIVA =  $scope.idtipoIVA.PAR_IDENPARA;
            // $scope.concepto.IVA =  $scope.ivaVale;
            // $scope.concepto.IVAretencion =  $scope.retencion;
            // $scope.concepto.ISRretencion =  $scope.ISRretencion;
            // $scope.concepto.subTotal =  $scope.subtotalVale;
            anticipoGastoRepository.guardarConceptoPorSolicitud($scope.concepto, $scope.idSolicitud, $scope.idtipoViaje).then((res) => {
                if (res != null && res.data != null && res.data.resppuesta != 0) {
                    $("#modalConceptoGasto").modal("hide");
                    $('#spinner-loading').modal('hide');
                    $scope.conceptosGastoPorSolicitud();
                    $scope.idConceptoSeleccion = 0;

                    // Recargar para volver a registro
                    swal({
                        title:'Anticipo de Saldo',
                        text: 'Se genero la solicitud correctamente',
                        type: 'success'
                    }, function(){ $scope.reloadRoute(); });
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Anticipo de Saldo', 'Ocurrio un error al generar la solicitud', 'success');
                }
            });
        }
        // }
        // else
        // { swal("Atención",validaRet[0].mensaje , "warning"); }
        // }
    };

    $scope.frmModalConceptoGasto = function (idEstatus) {
        $scope.idEstatus = idEstatus;
        $scope.getConceptosGasto();
        $scope.getAreaAfectacion();
        $scope.getTipoComprobante($scope.selSucursal);
        $scope.getIVABySucursal($scope.selSucursal);
        $scope.concepto = {};
        $scope.idConceptoSeleccion = 0;
        $scope.idtipoViaje = String(-1);
        $scope.disabledTipoViaje = true;
        $scope.disabledMonto = true;
        $scope.disabledConcepto = true;
        $scope.mostrarDistancia = false;
        $scope.distancia = 50;
        $("#modalConceptoGasto").modal({backdrop: 'static', keyboard: false})
        $("#modalConceptoGasto").modal("show");
    };

    $scope.getTipoComprobante = function ( selSucursal) {
        $scope.tipoComprobanteList = [];
        misTramitesValesRepository.getTipoComprobante(selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.tipoComprobanteList = res.data;
            }
        });
    };

    $scope.getIVABySucursal = function ( selSucursal) {
        $scope.IVAList = [];
        fondoFijoRepository.obtieneIVAbySucursal(selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.IVAList = res.data;
            }
        });
    };
    $scope.frmModalDevolucionRecibo = function () {
        $("#modalDevolucionRecibo").modal("show");
        //$scope.archivoDevolucion = null;archivoDevolucion
    };

    $scope.frmDescargaVale = function () {
        document.getElementById("wizard-picture").value = null;
        $("#modalVale").modal("show");
    };

    $scope.frmModalEmpleado = function () {
        $scope.getEmpleadosPorIdSolicitud();
        $("#modalEmpleado").modal("show");
    };

    $scope.editarConcepto = function (concepto) {
        $scope.conceptoEdit = concepto;
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

    $scope.modalConceptosXml = function (archivo) {
        anticipoGastoRepository.getConceptosPorXml(archivo.idConceptoArchivo).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptoXmlList = response.data;

            }
        });
        $("#modalConceptosXml").modal("show");
    };

    $scope.cancelarArchivo = function (concepto) {
        concepto.archivoXml = null;
        concepto.archivoPdf = null;
        concepto.archivo = null;
    };
    
    $scope.cancelarArchivoDevolucion = function () {
        //$scope.archivoDevolucion = null;
        $scope.archivoDevolucion = { nombreArchivo: '', archivo: null };
        document.getElementById("wizard-picture").value = null;
    };

    $scope.cancelarArchivoVale = function () {
        document.getElementById("wizard-picture2").value = null;
        $scope.archivoRecibo = { nombreArchivo: '', archivo: null };
        $scope.EvidenciaVale = null;
    };

    $scope.guardaComprobante = function (concepto) {
        if (concepto.idTipoSeleccionado == 1) {
            if (concepto.archivoPdf != null && concepto.archivoPdf['nombreArchivo'] != null && concepto.archivoPdf['nombreArchivo'].split('.').length > 0) {
                var extension = concepto.archivoPdf['nombreArchivo'].split('.')[1];
                if (extension == 'pdf' || extension == 'xml' || extension == 'jpg' || extension == 'png') {
                    $('#spinner-loading').modal('show');
                    var nombreUnico = concepto.archivoXml['nombreArchivo'].split('.')[0];
                    $scope.concepto = concepto;
                    var saveUrl = $scope.tramite.urlServerDoctos;
                    // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\Comprobacion\\';
                    var sendData = {};
                    sendData = {
                        idDocumento: concepto.id,
                        idTramite: 9,
                        idPerTra: $scope.idSolicitud,
                        saveUrl: saveUrl + 'Comprobacion_' + concepto.id,
                        idUsuario: $rootScope.user.usu_idusuario,
                        extensionArchivo: concepto.archivoPdf['nombreArchivo'].split('.')[1],
                        nombreArchivo: nombreUnico,
                        archivo: concepto.archivoPdf['archivo'],
                        idArchivo: 0,
                        idProceso: 2,
                        tipoDevolucion: 0
                    };

                    concepto.archivoPdf = null;
                    //var result = await guardaInfoEvidencia(sendData);
                    anticipoGastoRepository.saveInfoDocumentos(sendData).then((res) => {
                        if (res != null && res.data != null && res.data.idRegistro > 0) {
                            sendData.idArchivo = res.data.idRegistro;
                            sendData.consecutivo = res.data.consecutivo;
                            $scope.guardarArchivo(sendData, concepto.id);
                            var sendDataXML = {};
                            sendDataXML = {
                                idDocumento: concepto.id,
                                idTramite: 9,
                                idPerTra: $scope.idSolicitud,
                                saveUrl: saveUrl + 'Comprobacion_' + concepto.id,
                                idUsuario: $rootScope.user.usu_idusuario,
                                extensionArchivo: concepto.archivoXml['nombreArchivo'].split('.')[1],
                                nombreArchivo: nombreUnico,
                                archivo: concepto.archivoXml['archivo'],
                                idArchivo: 0,
                                idProceso: 2,
                                tipoDevolucion: 0
                            };
                            concepto.archivoXml = null;
                            sendDataXML.idArchivo =  res.data.idRegistro;
                            sendDataXML.consecutivo =  res.data.consecutivo;
                            $scope.guardarArchivo(sendDataXML, concepto.id);
                            $('#spinner-loading').modal('hide');
                        } else if(res.data.idRegistro < 0){
                            $('#spinner-loading').modal('hide');
                            swal('Comprobante', res.data.mensaje, 'error');
                        }
                        else {
                            $('#spinner-loading').modal('hide');
                            swal('Comprobante', 'Ocurrio un error al guardar el archivo.', 'error');
                        }
                    });
                } else {
                    swal('Comprobante', 'El tipo de archivo seleccionado no es permitido.', 'warning');
                }
            } else {
                swal('Comprobante', 'Debe seleccionar un archivo valido.', 'warning');
            }
            // if (concepto.archivoXml != null && concepto.archivoXml['nombreArchivo'] != null && concepto.archivoXml['nombreArchivo'].split('.').length > 0) {
            //     var extension = concepto.archivoXml['nombreArchivo'].split('.')[1];
            //     if (extension == 'pdf' || extension == 'xml' || extension == 'jpg' || extension == 'png') {
            //         $('#spinner-loading').modal('show');
            //         $scope.concepto = concepto;
            //         var saveUrl = $scope.tramite.urlServerDoctos;
                  
               
            //         anticipoGastoRepository.verificaUltimaFac(sendData).then((res) => {
            //             if (res != null && res.data != null && res.data.idRegistro > 0) {
                            
            //                 $('#spinner-loading').modal('hide');
            //             } else {
            //                 $('#spinner-loading').modal('hide');
            //                 //$scope.conceptosGastoPorSolicitud();
            //                 swal('Anticipo de Saldo', 'Ocurrio un error al guardar el archivo.', 'error');
            //                 //$('#spinner-loading').modal('hide');
            //             }
            //         });
            //     } else {
            //         swal('Anticipo de Saldo', 'El tipo de archivo seleccionado no es permitido.', 'warning');
            //     }
            // } else {
            //     swal('Anticipo de Saldo', 'Debe seleccionar un archivo valido.', 'warning');
            // }
        } else if (concepto.idTipoSeleccionado == 2) {
            if (concepto.archivo != null && concepto.archivo['nombreArchivo'] != null && concepto.archivo['nombreArchivo'].split('.').length > 0) {
                var extension = concepto.archivo['nombreArchivo'].split('.')[1];
                if (extension == 'pdf' || extension == 'xml' || extension == 'jpg' || extension == 'png') {
                    $('#spinner-loading').modal('show');
                    $scope.concepto = concepto;
                    var saveUrl = $scope.tramite.urlServerDoctos;
                    // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\Comprobacion\\';
                    var sendData = {};
                    sendData = {
                        idDocumento: concepto.id,
                        idTramite: 9,
                        idPerTra: $scope.idSolicitud,
                        saveUrl: saveUrl + 'Comprobacion_' + concepto.id,
                        idUsuario: $rootScope.user.usu_idusuario,
                        extensionArchivo: concepto.archivo['nombreArchivo'].split('.')[1],
                        nombreArchivo: concepto.archivo['nombreArchivo'].split('.')[0],
                        archivo: concepto.archivo['archivo'],
                        idArchivo: 0,
                        idProceso: 2,
                        tipoDevolucion: 0
                    };

                    concepto.archivo = null;
                    anticipoGastoRepository.saveInfoDocumentos(sendData).then((res) => {
                        if (res != null && res.data != null && res.data.idRegistro > 0) {
                            sendData.idArchivo = res.data.idRegistro;
                            sendData.consecutivo = res.data.consecutivo;
                            $scope.guardarArchivo(sendData, concepto.id);
                            $('#spinner-loading').modal('hide');
                        }else if(res.data.idRegistro < 0){
                            $('#spinner-loading').modal('hide');
                            swal('Comprobante', res.data.mensaje, 'error');
                        } 
                        else {
                            $('#spinner-loading').modal('hide');
                            //$scope.conceptosGastoPorSolicitud();
                            swal('Comprobante', 'Ocurrio un error al guardar el archivo.', 'error');
                            //$('#spinner-loading').modal('hide');
                        }
                    });
                } else {
                    swal('Comprobante', 'El tipo de archivo seleccionado no es permitido.', 'warning');
                }
            } else {
                swal('Comprobante', 'Debe seleccionar un archivo valido.', 'warning');
            }
        }
    }

    $scope.guardarArchivoDevolucion = function (archivoRecibo) {
        $("#modalDevolucionRecibo").modal("hide");
        $('#spinner-loading').modal('show');
        var saveUrl = $scope.tramite.urlServerDoctos;
        // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\Comprobacion\\';
        var sendData = {};
        $scope.archivoRecibo = archivoRecibo;
        sendData = {
            idDocumento: $scope.idSolicitud,
            idTramite: 9,
            saveUrl: saveUrl + 'ComprobacionSolicitud_' + $scope.idSolicitud,
            idUsuario: $rootScope.user.usu_idusuario,
            extensionArchivo: $scope.archivoRecibo.nombreArchivo.split('.')[1],
            nombreArchivo: $scope.archivoRecibo['nombreArchivo'].split('.')[0],
            archivo: $scope.archivoRecibo['archivo'],
            idArchivo: 0,
            idProceso: 1,
            tipoDevolucion: $scope.tipo_devolucion,
            consecutivo:0
        }
        //$scope.archivoRecibo = { nombreArchivo: '', archivo: null };
        archivoRecibo.archivo = null;
        anticipoGastoRepository.saveInfoDocumentos(sendData).then((res) => {
            if (res != null && res.data != null && res.data.idRegistro != 0) {
                sendData.idArchivo = res.data.idRegistro;
                sendData.consecutivo = res.data.consecutivo
                $scope.guardarArchivo(sendData, $scope.idSolicitud);
            } else {
                $scope.conceptosGastoPorSolicitud();
            }
        });
    };

    $scope.guardarArchivoVale = function (archivoRecibo) {
        $("#modalVale").modal("hide");
        $('#spinner-loading').modal('show');
        $scope.valeCargado = true;
        var saveUrl = $scope.tramite.urlServerDoctos;
        // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\Comprobacion\\';
        var sendData = {};
        $scope.archivoRecibo = archivoRecibo;
        sendData = {
            idDocumento: $scope.idSolicitud,
            idTramite: 9,
            saveUrl: saveUrl + 'ComprobacionSolicitud_' + $scope.idSolicitud,
            idUsuario: $rootScope.user.usu_idusuario,
            extensionArchivo: $scope.archivoRecibo.nombreArchivo.split('.')[1],
            nombreArchivo: $scope.archivoRecibo['nombreArchivo'].split('.')[0],
            archivo: $scope.archivoRecibo['archivo'],
            idArchivo: 0,
            idProceso: 1,
            tipoDevolucion: 0,
            consecutivo:0
        }
        archivoRecibo.archivo = null;
        anticipoGastoRepository.saveInfoDocumentos(sendData).then((res) => {
            if (res != null && res.data != null && res.data.idRegistro != 0) {
                sendData.idArchivo = res.data.idRegistro;
                sendData.consecutivo = res.data.consecutivo
                $scope.guardarArchivo(sendData, $scope.idSolicitud);
            } else {
                $scope.conceptosGastoPorSolicitud();
            }
        });
    };

    $scope.guardarArchivoRecibo = function (archivoDevolucion) {
        $("#modalDevolucion").modal("hide");
        $('#spinner-loading').modal('show');
        var saveUrl = 'C:\\app\\public\\Imagenes\\Comprobaciones\\';
        
        // var saveUrl = 'C:\\NodeApps\\Tramites\\app\\static\\documentos\\';
        var sendData = {};
        $scope.archivoDevolucion = archivoDevolucion;
        sendData = {
            idDocumento: $scope.idSolicitud,
            idTramite: 9,
            saveUrl: saveUrl + 'Comprobacion\\' + 'Comprobacion_' + $scope.idSolicitud,
            idUsuario: $rootScope.user.usu_idusuario,
            extensionArchivo: $scope.archivoDevolucion.nombreArchivo.split('.')[1],
            nombreArchivo: $scope.archivoDevolucion['nombreArchivo'].split('.')[0],
            archivo: $scope.archivoDevolucion['archivo'],
            idArchivo: 0,
            idProceso: 1,
            tipoDevolucion: $scope.tipo_devolucion
        }
																	  
        archivoDevolucion.archivo = null;
        anticipoGastoRepository.saveInfoDocumentos(sendData).then((res) => {
            if (res != null && res.data != null && res.data.idRegistro != 0) {
                sendData.idArchivo = res.data.idRegistro;
                $scope.guardarArchivo(sendData, $scope.idSolicitud);
            } else {
                $scope.conceptosGastoPorSolicitud();
            }
        });
    };

    $scope.guardarArchivo = function (sendData, idTramiteConcepto) {
        anticipoGastoRepository.saveDocumentos(sendData,idTramiteConcepto).then((res) => {
            if (res.data.ok) {
                var xmlResult = res.data.xmlResult
                if (sendData.extensionArchivo == 'xml') {
                    if (res.data.xmlResult != null && res.data.xmlResult.conceptos != null && res.data.xmlResult.conceptos.length > 0) {
                        var xmlConceptos = $scope.obtenerXmlConceptos(res.data.xmlResult.conceptos);
                        var data = {
                            importe: xmlResult.importe,
                            idUsuario: $rootScope.usuario.usu_idusuario,
                            idTipoProceso: $scope.idTipoProceso,
                            idTramiteConcepto: idTramiteConcepto,
                            importeIva: xmlResult.importeiVA,
                            folio: xmlResult.folio,
                            fecha: xmlResult.fecha,
                            idConceptoArchivo: sendData.idArchivo,
                            xmlConceptos: xmlConceptos,
                            UUID: res.data.xmlResult.UUID,
                            rfc: res.data.xmlResult.rfc,
                            mesCorriente: $scope.mesCorriente === undefined ? 0 : $scope.mesCorriente,
                            tipoNotificacion: $scope.tipoNotificacion === undefined ? 0 : $scope.tipoNotificacion,
                            estatusNotificacion: $scope.estatusNotificacion === undefined ? 0 : $scope.estatusNotificacion
                        }

                        if (sendData.idProceso == 2) {
                            $scope.guardarImporteConcepto(data);
                        } else {
                            $('#spinner-loading').modal('hide');
                            $scope.getArchivosPorIdentificador($scope.idSolicitud, 1);
                        }
                    } else {
                        //Rollback de registro de archivo
                        var archivo = {
                            idConceptoArchivo: sendData.idArchivo,
                            nombre: sendData.nombreArchivo
                        };

                        var urlDocumento = $scope.tramite.urlServerDoctos + 'Comprobacion_' + archivo.idReferencia;
                        anticipoGastoRepository.eliminarInfoDocumentos(archivo.idConceptoArchivo, archivo.nombre, archivo.idReferencia, urlDocumento).then((res) => {
                        });

                        $('#spinner-loading').modal('hide');
                        swal('Comprobante', 'Ocurrio un error al procesar la solicitud.', 'error');
                    }
                } else {
                    if (sendData.idProceso == 2) {
                        $scope.conceptosGastoPorSolicitud();
                        $scope.archivos = [];
                    } else {
                        $scope.getArchivosPorIdentificador($scope.idSolicitud, 1);
                    }
                    $('#spinner-loading').modal('hide');
                    swal('Comprobante', 'Se proceso correctamente la solicitud.', 'success');
                }
            } else {
                //Debe hacer rollback del registro del archivo                
                var archivo = {
                    idConceptoArchivo: sendData.idArchivo,
                    nombre: sendData.nombreArchivo
                };
                var urlDocumento = $scope.tramite.urlServerDoctos + 'Comprobacion_' + archivo.idReferencia;
                anticipoGastoRepository.eliminarInfoDocumentos(archivo.idConceptoArchivo, archivo.nombre, archivo.idReferencia, urlDocumento).then((res) => {
                });
                $('#spinner-loading').modal('hide');
                swal('Comprobante', 'Ocurrio un error al procesar la solicitud.', 'error');
            }
        });
    };

    // $scope.obtenerXmlConceptos = function (conceptos) {
    //     var xmlConceptos = '<Conceptos>';
    //     for (var i = 0; i < conceptos.length; i++) {
    //         xmlConceptos += '<Concepto>';
    //         xmlConceptos += '<cantidad>' + conceptos[i].cantidad + '</cantidad>';
    //         xmlConceptos += '<descripcion>' + conceptos[i].descripcion + '</descripcion>';
    //         xmlConceptos += '<importe>' + conceptos[i].importe + '</importe>';
    //         xmlConceptos += '<unidad>' + conceptos[i].unidad + '</unidad>';
    //         xmlConceptos += '<valorUnitario>' + conceptos[i].valorUnitario + '</valorUnitario>';
    //         xmlConceptos += '<noIdentificacion>' + conceptos[i].noIdentificacion + '</noIdentificacion>';
    //         xmlConceptos += '</Concepto>';
    //     }
    //     xmlConceptos += '</Conceptos>';
    //     return xmlConceptos;
    // };

    $scope.obtenerXmlConceptos = function (conceptos){
        var xmlConceptos = '{'
                for (var i = 0; i < conceptos.length; i++) {
           
            xmlConceptos += '"cantidad":"' + conceptos[i].cantidad + '",';
            xmlConceptos += '"descripcion":"' + conceptos[i].descripcion + '",';
            xmlConceptos += '"importe":' + conceptos[i].importe + ',';
            xmlConceptos += '"unidad":"' + conceptos[i].unidad + '",';
            xmlConceptos += '"valorUnitario":' + conceptos[i].valorUnitario + ',';
            xmlConceptos += '"noIdentificacion":"' + conceptos[i].noIdentificacion + '"';
         
        }
             xmlConceptos += '}';
           return xmlConceptos;
    }


    $scope.guardarImporteConcepto = function (importe, idUsuario, idTipoProceso, idTramiteConcepto, importeiVA, folio, fecha, idConceptoArchivo, mesCorriente, tipoNotificacion, estatusNotificacion) {
        //$('#spinner-loading').modal('show');
        anticipoGastoRepository.guardarImporteConcepto(importe, idUsuario, idTipoProceso, idTramiteConcepto, importeiVA, folio, fecha, idConceptoArchivo, mesCorriente, tipoNotificacion, estatusNotificacion).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {

                if(res.data.respuesta != -1){
                    $scope.conceptosGastoPorSolicitud();
                    /*anticipoGastoRepository.conceptosGastoPorSolicitud($scope.concepto.idTramiteEmpleado, $scope.idTipoProceso).then((response) => {
                        if (response.data != null && response.data.length > 0) {
                            $scope.conceptosSolicitud = response.data;
                            for (var i = 0; i < $scope.conceptosSolicitud.length; i++) {
                                $scope.conceptosSolicitud[i].expanded = false;
                            }
                        }
                    });*/
                    $('#spinner-loading').modal('hide');
                    swal('Anticipo de Saldo', 'Se proceso correctamente la solicitud.', 'success');
                }
                else{
                    $('#spinner-loading').modal('hide');
                    swal('Anticipo de Saldo', res.data.mensaje, 'success');
                }

            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Ocurrio un error al guardar el comentario', 'success');
            }
        });
    }

    // $scope.getArchivosPorIdentificador = function (idReferencia, tipoProceso) {
    //     $scope.archivos = [];
    //     $scope.nombreArchivo = '';
    //     anticipoGastoRepository.getArchivosPorConcepto(idReferencia).then((response) => {
    //         if (response.data != null && response.data.length > 0) {
    //             if (tipoProceso == 1) {
    //                 $scope.archivoRecibo.nombreArchivo = response.data[0].nombre;
    //                 $scope.archivoRecibo.archivo = null;
    //             } else {
    //                 $scope.archivos = response.data;
    //                 $scope.buscarArchivosPares();
    //             }
    //         }
    //     });
    // }

    $scope.getArchivosPorIdentificador = function (idReferencia, tipoProceso) {
        $scope.archivos = [];
        $scope.nombreArchivo = '';
        $scope.archivoDevolucion = { nombreArchivo: '', archivo: null };
        $scope.archivoRecibo = { nombreArchivo: '', archivo: null };
        anticipoGastoRepository.getArchivosPorReferencia(idReferencia)
        .then((response) => {
            if (response.data != null && response.data.length > 0) {

                response.data.forEach(ele => {
                    if(ele.tipoDevolucion > 0){
                        $scope.archivoDevolucion.nombreArchivo = ele.nombre
                    }
                    else{
       
                        $scope.archivoRecibo.nombreArchivo = ele.nombre;
                        if($scope.archivoRecibo.nombreArchivo !== null && $scope.archivoRecibo.nombreArchivo !== undefined && $scope.archivoRecibo.nombreArchivo !== ''){
                            $scope.valeCargado = true;
                        }
                    }
                })
                        
                    $scope.buscarArchivosPares();
                    $scope.archivosDevolucion = response.data;
            	 
            }
            else
            {
                $scope.tipoDevolucion = false;
            }
        });
    }

    $scope.getArchivosPorConcepto = function (concepto) {
        $scope.conceptoTemporal = concepto;
        $scope.archivos = [];
        $scope.conceptoSeleccionado = concepto.concepto;
        $scope.concepto = concepto;
        $scope.accionEnviar = true;
        anticipoGastoRepository.getArchivosPorConceptoComp(concepto.id).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.archivos = response.data;

                $scope.calculaComprobacionDeMas();
               // $scope.archivos = concepto.salidaEfectivo
                $scope.buscarArchivosPares();
                /*for (var i = 0; i < $scope.archivos.length; i++) {
                    if ($scope.archivos[i].porcentaje != 100) {
                        $scope.accionEnviar = false;
                    }
                }*/
            }
        });

    };

    $scope.modalDepartamentos = function (conceptoArchivo) {
        $scope.selDepartamento = 0;
        $scope.porcentaje = 0;
        $scope.conceptoArchivo = conceptoArchivo;
        $("#modalDepartamento").modal("show");
        $scope.getDepartamentosPorArchivo();
        $scope.errorMensaje = '';
    };
   


    $scope.guardarDepartamento = function () {
        $scope.errorMensaje = '';
        //var deptoDescripcion = $scope.departamentos.filter(depto => depto.idDepartamento == $scope.selDepartamento)[0].nombre;
        if (($scope.porcentajeTotal + $scope.porcentaje) <= 100) {
            anticipoGastoRepository.guardarArchivoDepartamento($scope.selDepartamento, $scope.porcentaje, $scope.conceptoArchivo.idConceptoArchivo).then((res) => {
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    $scope.selDepartamento = 0;
                    $scope.porcentaje = 0;
                    swal('Anticipo de Saldo', 'Se guardo el registro correctamente', 'success');
                    $scope.getArchivosPorConcepto($scope.concepto);
                    $scope.getDepartamentosPorArchivo();
                    //$scope.conceptosGastoPorSolicitud();
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Anticipo de Saldo', 'Ocurrio un error al guardar el registro', 'success');
                }
            });
        } else {
            $scope.errorMensaje = 'El porcentaje total no debe ser mayor a 100.';
        }
    };

    $scope.eliminarDepartamentoArchivo = function (departamento) {
        //var deptoDescripcion = $scope.departamentos.filter(depto => depto.idDepartamento == $scope.selDepartamento)[0].nombre;
        anticipoGastoRepository.eliminaDepartamentoArchivo(departamento.idArchivoDepartamento).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                swal('Anticipo de Saldo', 'Se proceso la solictud correctamente', 'success');
                $scope.getDepartamentosPorArchivo();
                $scope.conceptosGastoPorSolicitud();
            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Ocurrio un error al guardar el comentario', 'success');
            }
        });
    };

    $scope.getDepartamentosPorArchivo = function () {
        $('#spinner-loading').modal('show');
        $scope.porcentajeTotal = 0;
        $scope.departamentosArchivo = [];
        var deptosTemp = [];
        $scope.getDepartamentos($scope.selSucursal);
        anticipoGastoRepository.getDepartamentosPorArchivo($scope.conceptoArchivo.idConceptoArchivo).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.departamentosArchivo = response.data;
                devolucionesRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then((res) => {
                    if (response.data != null && response.data.length > 0) {
                        deptosTemp = res.data;
                        $scope.departamentos = [];
                        //let difference = deptosTemp.filter(x => !$scope.departamentosArchivo.includes(p => p.idDepartamento == x.idDepartamento));
                        for (var i = 0; i < deptosTemp.length; i++) {
                            if ($scope.departamentosArchivo.filter(p => p.idDepartamento == deptosTemp[i].idDepartamento).length == 0) {
                                $scope.departamentos.push(deptosTemp[i]);
                            }
                        }
                    }
                });

                for (var i = 0; i < $scope.departamentosArchivo.length; i++) {
                    $scope.porcentajeTotal = $scope.porcentajeTotal + $scope.departamentosArchivo[i].porcentaje;
                }
                $('#spinner-loading').modal('hide');
            } else {
                devolucionesRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then((res) => {
                    if (response.data != null && response.data.length > 0) {
                        $scope.departamentos = res.data;
                    }
                });
                $('#spinner-loading').modal('hide');
            }
        });
    };

    $scope.eliminarArchivo = function (archivo) {
        var archivoPar = $scope.archivos.find(archivoInterior => archivoInterior.idConceptoArchivoPar == archivo.idConceptoArchivo);
        var urlDocumento = $scope.tramite.urlServerDoctos + 'Comprobacion_' + archivo.idReferencia;
        anticipoGastoRepository.eliminarInfoDocumentos(archivo.idConceptoArchivo, archivo.nombre, archivo.idReferencia, urlDocumento).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                swal('Anticipo de Saldo', 'Se proceso la solictud correctamente', 'success');
                //$scope.getDepartamentosPorArchivo();
                $scope.archivos = [];
                $scope.conceptosGastoPorSolicitud();
                if (archivoPar)
                    $scope.eliminarArchivo(archivoPar);
            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Ocurrio un error al guardar el comentario', 'success');
            }
        });
    };

    $scope.frmModalComentario = function (archivo) {
        $scope.archivoEdicion = archivo;
        $scope.archivoEdicion.comentario = archivo.comentarioComprobacion;

        console.log("Tipo", typeof($scope.archivoEdicion.fecha));
        if( archivo.esFactura == 0 ){
            if( typeof($scope.archivoEdicion.fecha) == 'string' ){
                $scope.archivoEdicion.fecha = new Date(archivo.fecha.substring(6, 10), archivo.fecha.substring(3, 5) - 1, archivo.fecha.substring(0, 2));
            }
            else if( typeof($scope.archivoEdicion.fecha) == 'object' ){
                $scope.archivoEdicion.fecha = archivo.fecha;
            }
        }
        else{
            $scope.archivoEdicion.fecha = null;   
        }
        /*if( archivo.esFactura == 0 && $scope.archivoEdicion.fecha != null ){
            $scope.archivoEdicion.fecha = new Date(archivo.fecha.substring(6, 10), archivo.fecha.substring(3, 5) - 1, archivo.fecha.substring(0, 2));
        }
        else{
            $scope.archivoEdicion.fecha = null;   
        }*/
        
        //$scope.concepto = angular.copy(concepto);
        $scope.EsFacturaModal = archivo.esFactura;
        $("#modalComentario").modal("show");
    };

    $scope.guardarComentario = function (archivoEdicion) {
        console.log($scope.archivoEdicion.total);
        if( $scope.archivoEdicion.total <= 0 ){
            swal('Comprobación', 'Verifica el importe que se esta proporcionando.', 'warning');
            return true;
        }
        else if( $scope.archivoEdicion.total === undefined ){
            swal('Comprobación', 'Verifica el importe que se esta proporcionando.', 'warning');
            return true;
        }


        $("#guardarComprobacion").attr("disabled","disabled");
        $('#spinner-loading').modal('show');
        $scope.archivoEdicion = archivoEdicion;
        var data = {
            idConceptoArchivo: $scope.archivoEdicion.idConceptoArchivo,
            idTramiteConcepto: $scope.archivoEdicion.idReferencia,
            comentario: $scope.archivoEdicion.comentario,
            importe: $scope.archivoEdicion.total,
            idTipoProceso: $scope.idTipoProceso,
            idUsuario: $rootScope.usuario.usu_idusuario,
            fecha: archivoEdicion.fecha
        }
        if($scope.archivoEdicion.total >  parseFloat($scope.amountAG) && $scope.archivoEdicion.salidaEfectivo === 2)
        {swal("Atención", "El monto maximo es de $ " + $scope.amountAG, "warning");
        $('#spinner-loading').modal('hide');}
        else{
        anticipoGastoRepository.guardarComentarioArchivo(data).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                swal('Anticipo de Saldo', 'Se proceso la solictud correctamente', 'success');
                //$scope.getDepartamentosPorArchivo();
                $scope.conceptosGastoPorSolicitud();
                //$scope.getArchivosPorConcepto( $scope.conceptoTemporal );
                $('#spinner-loading').modal('hide');
                $("#modalComentario").modal("hide");
            } else {
                $('#spinner-loading').modal('hide');
                $("#modalComentario").modal("hide");
                swal('Anticipo de Saldo', 'Ocurrio un error al guardar el comentario', 'success');
            }
            $("#guardarComprobacion").removeAttr("disabled");

            $scope.getArchivosPorConcepto( $scope.conceptoTemporal );
        });
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
    $scope.frmModalDevolucion = function() {							 
        $("#modalDevolucion").modal("show");
    }

    $scope.cambioTipo = function() {
        if($scope.tipo_devolucion == 2)
        {
            var idEmpresa = $scope.selEmpresa;
            fondoFijoRepository.getBancos(idEmpresa).then((res) => {
                if(res.data !== 'undefined' && res.data.length > 0 ){
                    $scope.banco = res.data[0];
                    console.log($scope.banco);
                }
            });
        }
    }

    $scope.reloadRoute = function() {
        console.log("Recargar para continuar modificando");
        $route.reload();
    }

    $scope.empresaRFC;
    $scope.conceptoActual;

    $scope.$watch('conceptoActual.archivoXml', function (nv, ov) {
        console.log('$watch conceptoActual.archivoXml')
        if (!$scope.extraerRFC(nv)) {
            $scope.conceptoActual.archivoXml = ov;
        }
    }, false);

    $scope.idTipoSeleccionado;
    $scope.tipoEvidencias = [
        { id: 1, text: 'Factura' },
        { id: 2, text: 'Vale azul(No deducible)' }
    ];

    $scope.subirArchivo = function (concepto) {
        $scope.conceptoActual = undefined;
        $scope.conceptoActual = concepto;

        $("#agregaEvidencia").modal("show");
        document.getElementById("wizard-pictureXML").value = null;
        document.getElementById("wizard-picturePDF").value = null;
        document.getElementById("wizard-pictureVale").value = null;
    }

    $scope.cerrarSubirArchivo = function () {
        $scope.conceptoActual = undefined;
        $("#agregaEvidencia").modal("hide");
    }

    $scope.extraerRFC = async function (nv) {
        if (!nv || nv == null)
            return true;

        var parts = nv.archivo.split(',');
        var xml = atob(parts[1]);

        if (xml.substr(0, 3) === 'ï»¿')
            xml = xml.substr(3);

        parser = new DOMParser();
        xmlDocument = parser.parseFromString(xml, "text/xml");

        $scope.conceptoActual.xmlRFC = xmlDocument.getElementsByTagName("cfdi:Receptor")[0].getAttribute('Rfc');    
        $scope.FormaPago  = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('FormaPago');
        $scope.fechaFacturaEvidenciaVale  = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('Fecha');
        $scope.fechaFacturaEvidenciaVale = $scope.fechaFacturaEvidenciaVale.substring(0, 10);
        $scope.montoEvidencia  = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('Total');
        var yearFac = $scope.fechaFacturaEvidenciaVale.substring(0, 4);
        var monthFac = $scope.fechaFacturaEvidenciaVale.substring(7, 5);

        let dateObj = new Date();
        let month =  String(dateObj.getMonth() +1).padStart(2, '0');
        let day = String(dateObj.getDate()).padStart(2, '0');
        let year = dateObj.getFullYear();
        fecha =  year + "-" + month + "-" + day;

        if ($scope.FormaPago == '01' ||  $scope.FormaPago == '04' ||$scope.FormaPago == '28') {
            if ($scope.montoEvidencia > 2000) {
                swal('Alto', 'El total de la factura es mayor a $2,000.00', 'warning');
                $scope.FormaPago = '';
                $scope.EvidenciaXML = null;
                return false;
            }
        }
       
        if ($scope.conceptoActual.xmlRFC != $scope.empresaRFC) {
            swal('Alto', 'El RFC del documento (' + $scope.conceptoActual.xmlRFC + ') no coincide con el de la empresa (' + $scope.empresaRFC + ').', 'warning');
            return false;
        }
        $scope.pasaFactura = true;
        if(Number(yearFac) < year)
        {
            swal('Alto', 'La factura es de un año pasado, Favor de solicitar al proveedor: La actualización de la factura con fecha del mes corriente.', 'warning');           
            $scope.mesCorriente = 5;
            $scope.tipoNotificacion = 2;
            $scope.estatusNotificacion = 1;
        }
        else
        {
            if(Number(monthFac) < Number(month))
            {
                let mesPasado = Number(month) - Number(monthFac);
                //Mes inmediato Anterior
                if(mesPasado == 1)
                {
                //Validar si el mes anterior esta abierto
                let periodo = yearFac + monthFac;
                var periodoContable = await validaPeriodoContable($scope.valeSucursal,periodo);
                if(periodoContable[0].PAR_DESCRIP2 == 'ABIERTO')
                {
                    $scope.mesCorriente = 2;
                    $scope.tipoNotificacion = 0;
                    $scope.estatusNotificacion = 0; 
                }
                else
                {
                //Enviar notificacion para finanzas
                    $scope.mesCorriente = 3;
                    $scope.tipoNotificacion = 1;
                    $scope.estatusNotificacion = 1;
                }
    
                }
                //Mes pasados
                else
                {
                swal('Alto', 'Favor de solicitar al proveedor: La actualización de la factura con fecha del mes corriente.', 'warning');
                    $scope.mesCorriente = 4;
                    $scope.tipoNotificacion = 1;
                    $scope.estatusNotificacion = 1;
                }
            }
        }

        return true;
    }
    
    $scope.buscarArchivosPares = function () {
        console.log($scope.archivos);
        for (var i = 1; i < $scope.archivos.length; i++) {
            var archivoActual = $scope.archivos[i];
            var archivoAnterior = $scope.archivos[i - 1];
            var nombreArchivoActualSinExtension = archivoActual.nombre.replace('.' + archivoActual.extension, '');
            var nombreArchivoAnteriorSinExtension = archivoAnterior.nombre.replace('.' + archivoAnterior.extension, '');
            if (nombreArchivoActualSinExtension == nombreArchivoAnteriorSinExtension) {
                if (archivoActual.extension.toLowerCase() == 'pdf' && archivoAnterior.extension.toLowerCase() == 'xml')
                    archivoActual.idConceptoArchivoPar = archivoAnterior.idConceptoArchivo;
                else if (archivoAnterior.extension.toLowerCase() == 'pdf' && archivoActual.extension.toLowerCase() == 'xml')
                    archivoAnterior.idConceptoArchivoPar = archivoActual.idConceptoArchivo;
                i++;
            }
        }
    }

    $scope.actualizarMontos = function () {
        $scope.comprobante = $scope.idtipoComprobante;
        $scope.ivaCalc = $scope.idtipoIVA;
        if($scope.concepto.importeSolicitado != undefined && $scope.concepto.importeSolicitado != 0)
        {
            let retIVA = (Number($scope.comprobante.PAR_IMPORTE1 / 100));
            let retISR = (Number($scope.comprobante.PAR_IMPORTE2 / 100));
            $scope.ivaVale = (Number($scope.concepto.importeSolicitado) * (Number($scope.ivaCalc.PAR_IMPORTE1)/100)).toFixed(2);
            $scope.retencion = retIVA == 0 ? 0 :(Number($scope.concepto.importeSolicitado) *  retIVA).toFixed(2);
            $scope.ISRretencion = retISR == 0 ? 0 : (Number($scope.concepto.importeSolicitado) *  retISR).toFixed(2);
            if(retIVA == 0 && retISR == 0)
            {
                $scope.subtotalVale = (Number($scope.concepto.importeSolicitado) - Number($scope.ivaVale));
            }
            else if (retIVA != 0 && retISR == 0)
            {
                let iva =  Number($scope.ivaVale) - Number($scope.retencion);
                $scope.subtotalVale = (Number($scope.concepto.importeSolicitado) - Number(iva));
            }
            else
            {
                $scope.subtotalVale =  (Number($scope.concepto.importeSolicitado) + Number($scope.ivaVale) - Number($scope.retencion) - Number($scope.ISRretencion)).toFixed(2);
            }
            $scope.tipoRetencion = true;
        }
        else
        {
            $scope.tipoRetencion = false;
        }
    
    }; 
    async function ValidaRetenciones (idsucursal, tipoComprobante, areaAfectacion, conceptoContable) {
        return new Promise((resolve, reject) => {
        fondoFijoRepository.validaRetencionesOC(idsucursal, tipoComprobante, areaAfectacion, conceptoContable).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
        });
    });
    }

    $scope.sendMail = function(to, subject, html) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito ")')
                 //insertar en la bitácora para registrar que el correo se envió exitosamente
                 $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Correo enviado con exito a '+to+' Asunto: '+subject, 1, 1);
            } else {
                console.log('Ocuerrio un error al emviar el correo "( ')
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'No se pudo entregar el correo a '+to+' Asunto: '+subject, 1, 1);
            }
        });
    };
    $scope
    .guardarBitacoraProceso = function (idUsuario,id_perTra,idEstatus,accion,bitacora, proceso) {
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
        else {
            anticipoGastoRepository.parametrosGvByUsuario(usuario, $scope.idtipoViaje, $scope.idConceptoSeleccion).then(res => {
            
            console.log('empledo 1', $scope.tramite.idPersona1)
            
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
                         
                        $scope.montoMaximoGV = res.data[0].montoTope;

                        if(($scope.disabledTipoViaje === false && $scope.idtipoViaje > -1) || ($scope.conceptoEdit.importeSolicitado > 0)){
                            $scope.validaMontoMaximo();
                        }
                       
                    } 
                });
            }else{
                $scope.montoMaximoGV = res.data[0].montoTope;
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
                    text: 'El monto supera el valor permitido, se ajustara al monto maximo permitido',
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
                    text: 'El monto supera el valor permitido, se ajustara al monto maximo permitido',
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

    $scope.DescargaVale = function( razon, nombrePersona){
        console.log('EvidenciaVale ', $scope.EvidenciaVale)
        $scope.getEmpleadosPorIdSolicitud();
        var date = new Date();
        var doc = new jsPDF('p','px','letter');
  
        var lMargin=15; //left margin in mm
        var rMargin=15; //right margin in mm
        var pdfInMM=410;  
  
        doc.setFontSize(12);
        doc.text('FOLIO '+ $scope.idSolicitud , 45,80);
        doc.text( ('FECHA ' + '0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear(), 45,90);
        doc.text($scope.tramite.empresa + ' S.A. de C.V. - ' + $scope.tramite.sucursal, 45,100);
        doc.text('VALE PROVISIONAL DE GASTO DE VIAJE', 145,120);
        doc.text('BUENO POR $' + formatMoney($scope.montoDiferencia), 320,140);

        doc.text('Concepto:', 45,160);
        doc.setFontSize(8);
        doc.text($scope.razon, 45,180);
        doc.setFontSize(12);
        var parrafo1='"Yo, en esta fecha manifiesto bajo protesta de decir verdad que he recibido el importe del presente vale  por la cantidad de $'+ formatMoney($scope.montoDiferencia) +', ('+ $scope.numeroALetras($scope.montoDiferencia) + ' ' + $scope.centavos +'/100 Moneda Nacional) a mi entera satisfacción, cantidad que me comprometo y obligo a comprobar dentro de las 48 horas posteriores a mi regreso del viaje y consciente de que puedo ir comprobando conforme vaya erogando y cargando en el sistema la documentación correspondiente en cumplimiento a la política de gastos de viaje de la sociedad al rubro indicado, la cual pertenece al grupo comercial denominado GRUPO ANDRADE. En caso de no comprobar los gastos dentro del plazo establecido, reconozco que debo esta cantidad a la sociedad al rubro citada de manera personal y me obligo incondicionalmente a pagarla en una sola exhibición, autorizando, si así fuese el caso que, dicha cantidad me sea descontada vía nómina, comprometiéndome a firmar la carta instrucción y documentación correspondiente.';

        var lines1=doc.splitTextToSize(parrafo1, (pdfInMM-lMargin-rMargin));
        //var lines2=doc.splitTextToSize(parrafo2, (pdfInMM-lMargin-rMargin));
        var dim = doc.getTextDimensions('Text');
        var lineHeight = dim.h;
        lineTop1 = (lineHeight/2)*lines1.length + 10;
        //lineTop2 = (lineHeight/2)*lines2.length + 10;

        for(var i=0;i<lines1.length;i++){
          lineTop = (lineHeight/2)*i;
          doc.text(lines1[i],45,200+lineTop); 
        }
        doc.text('Este vale fue autorizado  de manera electrónica por: ' + $scope.autorizador ,45,200+lineTop+20);

        doc.rect(45, 200+lineTop + 20 + 20, 180, 80); // empty square
        doc.rect(45, 200+lineTop + 20 + 20 + 10, 180, 70); // empty
        doc.setFontSize(8);
        doc.text('Recibió ',47,200+lineTop + 20 + 20 + 8);
        doc.text(' __________________________',90, 200+lineTop + 20 + 20 + 40);
        doc.text('Firma y huella digital', 110 ,200+lineTop + 20 + 20 + 50);
        doc.rect(45, 200+lineTop + 20 + 20 + 70, 180, 10); // empty
        doc.text('Nombre: ' + $scope.empleados[0].nombreEmpleado,47,200+lineTop + 20 + 20 + 68);
        doc.rect(45, 200+lineTop + 20 + 20 + 60, 180, 20); // empty
        doc.text('Cargo: ',47,200+lineTop + 20 + 20 + 78);
        
        doc.setFontSize(12);

        doc.save('Vale_AnticipoGastos.pdf');
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

    $scope.unidades = function(num){
        switch(num)
      {
          case 1: return "UN";
          case 2: return "DOS";
          case 3: return "TRES";
          case 4: return "CUATRO";
          case 5: return "CINCO";
          case 6: return "SEIS";
          case 7: return "SIETE";
          case 8: return "OCHO";
          case 9: return "NUEVE";
      }
  
      return "";
      }
  
      $scope.decenas = function(num){
      decena = Math.floor(num/10);
      unidad = num - (decena * 10);
  
      switch(decena)
      {
          case 1:
              switch(unidad)
              {
                  case 0: return "DIEZ";
                  case 1: return "ONCE";
                  case 2: return "DOCE";
                  case 3: return "TRECE";
                  case 4: return "CATORCE";
                  case 5: return "QUINCE";
                  default: return "DIECI" + $scope.unidades(unidad);
              }
          case 2:
              switch(unidad)
              {
                  case 0: return "VEINTE";
                  default: return "VEINTI" + $scope.unidades(unidad);
              }
          case 3: return $scope.DecenasY("TREINTA ", unidad);
          case 4: return $scope.DecenasY("CUARENTA ", unidad);
          case 5: return $scope.DecenasY("CINCUENTA ", unidad);
          case 6: return $scope.DecenasY("SESENTA ", unidad);
          case 7: return $scope.DecenasY("SETENTA ", unidad);
          case 8: return $scope.DecenasY("OCHENTA ", unidad);
          case 9: return $scope.DecenasY("NOVENTA ", unidad);
          case 0: return $scope.unidades(unidad);
      }
    }
  
      $scope.DecenasY = function(strSin, numUnidades){
        if (numUnidades > 0)
          return strSin + "Y " + $scope.unidades(numUnidades);
  
        return strSin;
  
      }
  
      $scope.centenas = function(num){
  
      centenas = Math.floor(num / 100);
      decenas = num - (centenas * 100);
  
      switch(centenas)
      {
          case 1:
              if (decenas > 0)
                  return "CIENTO " +  $scope.decenas(decenas);
              return "CIEN";
          case 2: return "DOSCIENTOS " + $scope.decenas(decenas);
          case 3: return "TRESCIENTOS " + $scope.decenas(decenas);
          case 4: return "CUATROCIENTOS " + $scope.decenas(decenas);
          case 5: return "QUINIENTOS " + $scope.decenas(decenas);
          case 6: return "SEISCIENTOS " + $scope.decenas(decenas);
          case 7: return "SETECIENTOS " + $scope.decenas(decenas);
          case 8: return "OCHOCIENTOS " + $scope.decenas(decenas);
          case 9: return "NOVECIENTOS " + $scope.decenas(decenas);
      }
  
      return $scope.decenas(decenas);
  }//Centenas()
  
  $scope.seccion=function(num, divisor, strSingular, strPlural){
      cientos = Math.floor(num / divisor);
      resto = num - (cientos * divisor);
  
      letras = "";
  
      if (cientos > 0)
          if (cientos > 1)
              letras = $scope.centenas(cientos) + " " + strPlural;
          else
              letras = strSingular;
  
      if (resto > 0)
          letras += "";
  
      return letras;
  }
  
  $scope.miles = function(num){
      divisor = 1000;
      cientos = Math.floor(num / divisor);
      resto = num - (cientos * divisor);
  
      strMiles = $scope.seccion(num, divisor, "UN MIL", "MIL");
      strCentenas = $scope.centenas(resto);
  
      if(strMiles == "")
          return strCentenas;
  
      return strMiles + " " + strCentenas;
  }

    $scope.numeroALetras=function(num){
        var data = {
          numero: num,
          enteros: Math.floor(num),
          //centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
          //letrasCentavos: "",
          letrasMonedaPlural: 'PESOS',//“PESOS”, 'Dólares', 'Bolívares', 'etcs'
          letrasMonedaSingular: 'PESO' //“PESO”, 'Dólar', 'Bolivar', 'etc'
      
          //letrasMonedaCentavoPlural: "CENTAVOS",
          //letrasMonedaCentavoSingular: "CENTAVO"
      };
        $scope.centavos = (((Math.round(num * 100)) - (Math.floor(num) * 100)));
        $scope.centavos = $scope.centavos == 0 ? '00' : $scope.centavos;
      if (data.centavos > 0) {
          data.letrasCentavos = "CON " + (function (){
              if (data.centavos == 1)
                  return $scope.millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
              else
                  return $scope.millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
              })();
      };
      
      if(data.enteros == 0)
          return "CERO " + data.letrasMonedaPlural //+ " " + data.letrasCentavos;
      if (data.enteros == 1)
          return $scope.millones(data.enteros) + " " + data.letrasMonedaSingular //+ " " + data.letrasCentavos;
      else
          return $scope.millones(data.enteros) + " " + data.letrasMonedaPlural //+ " " + data.letrasCentavos;
      }
      
      $scope.millones = function(num){
        divisor = 1000000;
        cientos = Math.floor(num / divisor);
        resto = num - (cientos * divisor);
      
        strMillones = $scope.seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
        strMiles = $scope.miles(resto);
      
        if(strMillones == "")
            return strMiles;
      
        return strMillones + " " + strMiles;
      }

      async function validaPeriodoContable(idSucursal, periodo) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.validaPeriodoContable(idSucursal,periodo).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
            else
            {reject('Error')}
        });
    });
    }

    $scope.obtineCorreoNotificacion = function (tipoNot){
        aprobarDevRepository.getCorreoNotificacion(tipoNot).then((resp) => {     
            if(resp.data != undefined){
                if(tipoNot == 29)
                {
                    $scope.CorreoFinanzas = resp.data[0].email;
                }
                else if(tipoNot == 31)
                {
                    $scope.CorreoFinanzas = resp.data[0].email;
                }
            }
        });
    }

    $scope.enviarFinanzas = function (data) {
        $scope.obtineCorreoNotificacion(29);
        swal({
            title: '¿Deseas enviar a Revisión la Factura?',
            text: 'Se enviara la evidencia de Factura a revisión',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) {
              $('#loading').modal('show');           
              $scope.sendNotificacionFactura(data)
          } else {
              swal('Cancelado', 'No se aplicaron los cambios', 'error');
          }
      });
    }
    
    $scope.sendNotificacionFactura = function (resf) {
        var tipoNot = 35;
        var motivo = '';
        switch(resf.mesCorriente) 
        {
            case 1:
                motivo= 'Factura mes actual';
              break;
            case 2:    
                motivo= 'Factura mes pasado abierto';
                break;
            case 3:
                motivo= 'Factura mes pasado cerrado';
                break;
            case 4:
                motivo= 'Factura mes pasado no inmediato';
                break;
            case 5:
                motivo= 'Factura año pasado';
                break;
        }
        var notG = {
            //Obtener el id del vale
            "identificador": parseInt(resf.idConceptoArchivo),
            "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la revisión de la Factura",
            "idSolicitante": $scope.empleados.length > 0 ? $scope.empleados[0].idUsuario : $scope.user.usu_idusuario,
            "idTipoNotificacion": tipoNot,
            "linkBPRO": global_settings.urlCORS + "aprobarFacturaGV?employee=6092&idSolicitud="+ $scope.idSolicitud +"&idConceptoGasto=" + resf.idReferencia+ "&idConceptoArchivo=" + resf.idConceptoArchivo,
            "notAdjunto": "",
            "notAdjuntoTipo": "",
            "idEmpresa": 0,
            "idSucursal": 0,
            "departamentoId": 0
        };
        
        clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
                let usuarioSolicitante = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $rootScope.user.nombre;
                let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                html = ` ${html1} Solicitud de Revisión de Factura<br><br> ${html2}
                <p><strong>Empresa: </strong> ${$scope.tramite.empresa} </p> 
                <p><strong>Sucursal: </strong> ${$scope.tramite.sucursal} </p>
                <p><strong>Motivo: </strong> ${motivo} </p>
                <p><strong>Solicitante: </strong> ${usuarioSolicitante} </p>
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Comprobación</a></p>`;
                // html = ` ${html1} Solicitud de Revisión de Factura<br><br> ${html2}
                // <p><strong>Empresa: </strong> ${$scope.tramite.empresa} </p> 
                // <p><strong>Sucursal: </strong> ${$scope.tramite.sucursal} </p>
                // <p><strong>Motivo: </strong> ${motivo} </p>
                // <p><strong>Solicitante: </strong> ${usuarioSolicitante} </p>
                // <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Comprobación</a></p>
                // <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                // <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                $scope.sendMail($scope.CorreoFinanzas, 'Solicitud de Aprobación de Factura Anticipo de Gastos N° ' + $scope.tramite.idSolicitud, html);
                $scope.actualizaEstatusNotificacion(resf.idConceptoArchivo,2);
                $scope.getArchivosPorConceptoNoti(resf.idReferencia)
                $("#loading").modal("hide");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                $("#loading").modal("hide");
            }
        });
    }

    $scope.enviarConprobacionExcedente = function (data) {
        $scope.obtineCorreoNotificacion(31);
        swal({
            title: '¿Deseas enviar a aprobación?',
            text: 'Se enviara a el monto excedente su aprobación.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
          if (isConfirm) {
              $('#loading').modal('show');           
              $scope.sendNotificacionDeMas(data)
              // $scope.getArchivosPorConcepto( $scope.conceptoTemporal );
          } else {
              swal('Cancelado', 'No se aplicaron los cambios', 'error');
          }
      });
    }

    $scope.validaEnvioNotificacion = true;
    $scope.sendNotificacionDeMas = function (resf) {
        console.log( "sendNotificacionDeMas", resf );
        if( !$scope.validaEnvioNotificacion ){
            return true;
        }

        $scope.validaEnvioNotificacion = false;

        console.log( "$scope.conceptosSolicitud", $scope.conceptosSolicitud )

        var parametrosEmail = {
            empresa: $scope.tramite.empresa,
            sucursal: $scope.tramite.sucursal,
            departamento: $scope.tramite.departamento,
            viaje: $scope.tramite.concepto,
            motivo: $scope.tramite.motivo,
            fecha: $scope.tramite.fechaInicio + ' al ' + $scope.tramite.fechaFin,
            concepto: $scope.conceptosSolicitud[0].concepto,
            idConcepto: $scope.conceptosSolicitud[0].id,
            solicitante: $scope.empleados.length > 0 ? $scope.empleados[0].idUsuario : $scope.user.usu_idusuario //$scope.empleados[0].nombreEmpleado
        }
        console.log( "parametrosEmail", parametrosEmail );
        //return true;

        var datosSolicitud = `
        <table border="0" >
            <tbody>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                    <td>`+ parametrosEmail.solicitante +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                    <td>`+ parametrosEmail.empresa +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                    <td>`+ parametrosEmail.sucursal +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Departamento:</span></td>
                    <td>`+ parametrosEmail.departamento +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Viaje a:</span></td>
                    <td>`+ parametrosEmail.viaje +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Motivo:</span></td>
                    <td>`+ parametrosEmail.motivo +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Fecha:</span></td>
                    <td>`+ parametrosEmail.fecha +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Concepto comprobado:</span></td>
                    <td>`+ parametrosEmail.concepto +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Monto autorizado:</span></td>
                    <td> `+ $scope.formatNumber( resf.importe ) +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Monto justificado:</span></td>
                    <td> `+ $scope.formatNumber( resf.total ) +`</td>
                </tr>
                <tr>
                    <td style="text-align: right;"><span style="color: #ff0000;">Comprobación de más:</span></td>
                    <td> `+ $scope.formatNumber( resf.ExcedeMonto ) +`</td>
                </tr>
            </tbody>
        </table><br><br>
        `;

        var tabla = `
            <br><br>
            <table border="1" cellspacing="0" cellpadding="10">
                <tr>
                    <th>Empresa</th>
                    <th>Sucursal</th>
                    <th>Departamento</th>
                    <th>Motivo</th>
                    <th>Concepto comprobado</th>
                    <th>Monto autorizado</th>
                    <th>Monto justificado</th>
                    <th>Comprobación de más</th>
                </tr>
                <tr>
                    <td>`+ parametrosEmail.empresa +`</td>
                    <td>`+ parametrosEmail.sucursal +`</td>
                    <td>`+ parametrosEmail.departamento +`</td>
                    <td>`+ parametrosEmail.viaje +`, por el motivo: `+ parametrosEmail.motivo +` con fecha `+ parametrosEmail.fecha +`</td>
                    <td>`+ parametrosEmail.concepto +`</td>
                    <td> `+ $scope.formatNumber( resf.importe ) +`</td>
                    <td> `+ $scope.formatNumber( resf.total ) +`</td>
                    <td> `+ $scope.formatNumber( resf.ExcedeMonto ) +`</td>
                </tr>
            </table>
        `;

        var usuarioSelected = $scope.tramite.idPersonaAdicional > 0 ? $scope.tramite.idPersonaAdicional : $scope.tramite.idPersona;

        anticipoGastoRepository.getBuscarAutorizador($scope.selEmpresa, $scope.selSucursal, $scope.selDepartamento, usuarioSelected, 2).then((res) => {   

            $scope.CorreoFinanzas = res.data[0].usu_correo;

            $("#modalDeMas").modal('hide');
            var tipoNot = 2;
    
            var usuario = $scope.empleados.length > 0 ? $scope.empleados[0].idUsuario : $scope.user.usu_idusuario
            var nombreSol = $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado :  $rootScope.user.nombre
    
            var notG = {
                //Obtener el id del vale
                "identificador": parseInt(resf.idConceptoArchivo),
                "descripcion": "El usuario " + nombreSol + " esta solicitando la aprobación de gastos de más" + tabla,
                "idSolicitante": usuario,
                "idTipoNotificacion": tipoNot,
                "linkBPRO": global_settings.urlCORS + "aprobargastosdemas?employee=65&idSolicitud="+ $scope.idSolicitud +"&idConceptoGasto=" + resf.idReferencia+ "&idConceptoArchivo=" + resf.idConceptoArchivo+"&m=" + btoa(resf.ExcedeMonto),
                "notAdjunto": "",
                "notAdjuntoTipo": "",
                "idEmpresa": $scope.selEmpresa,
                "idSucursal": $scope.selSucursal,
                "departamentoId":  $scope.selDepartamento
            };
            
            anticipoGastoRepository.notGerente(notG).then(function (result) {
                console.log("$scope.CorreoFinanzas", $scope.CorreoFinanzas)
                if (result.data[0].success == true) {
                    //let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                    let link = `${global_settings.urlApiNoty}api/notification/approveNotificationMailJerarquizado/?idAprobacion=${ result.data[0].apr_id}&identificador=${result.data[0].not_id}&idUsuario=${result.data[0].idUsuario}&respuesta=`
                    let linkCiereNoti = btoa(link);
                    let RevisarComprobacion = notG.linkBPRO + '&n=' + linkCiereNoti + '&ac=';
                    html = ` ${html1} Solicitud de Aprobación de gastos de más<br><br> ${html2}
                    ${datosSolicitud}
                    <p><a href=' ${RevisarComprobacion}0' target="_blank">Revisar Comprobación</a></p>
                    <p><a href=" ${RevisarComprobacion}1" target="_blank">Aprobar</a></p> 
                    <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                    $scope.sendMail($scope.CorreoFinanzas, 'PRUEBAS - Solicitud de Aprobación de gastos de más', html);
                    $scope.actualizaEstatusNotificacionDeMas(resf.idConceptoArchivo,2, resf.ExcedeMonto);
                    $scope.getArchivosPorConceptoNoti(resf.idReferencia)
                    $("#loading").modal("hide");
                    $scope.conceptosGastoPorSolicitud(3)
                } else {
                    swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                    $("#loading").modal("hide");
                }
    
                $scope.validaEnvioNotificacion = true;
            });
         })

    }

    $scope.actualizaEstatusNotificacion = function (idConceptoArchivo, tipo) {
        anticipoGastoRepository.actualizaEstatusNotificacion(idConceptoArchivo, tipo).then((res) => {
            if (res.data[0].success == 1) {
                console.log('Ok al actualizar la notificación')
                } else {
                console.log('Error al actualizar la notificación')
            }
        });
    }

    $scope.actualizaEstatusNotificacionDeMas = function (idConceptoArchivo, tipo, monto) {
        anticipoGastoRepository.actualizaEstatusNotificacionDeMas(idConceptoArchivo, tipo, monto ).then((res) => {
            if (res.data[0].success == 1) {
                console.log('Ok al actualizar la notificación')
                } else {
                console.log('Error al actualizar la notificación')
            }
        });
    }

    $scope.getArchivosPorConceptoNoti = function (idConceptoGasto) {
        $scope.archivos = [];
        anticipoGastoRepository.getArchivosPorConceptoComp(idConceptoGasto).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.archivos = response.data;

                $scope.calculaComprobacionDeMas();
            }
        });

    };

    $scope.calculaComprobacionDeMas = function(){
        $scope.sumatoriaFinal = 0;
        $scope.archivos.forEach(ele => {
            console.log("Estatus", ele.estatusNotificacionDeMas, ele.idEstatus)
            if( ele.estatusNotificacionDeMas != 4 && ele.idEstatus != 10 ){
                ele.salidaEfectivo = $scope.conceptoTemporal.salidaEfectivo;
                $scope.sumatoriaFinal = $scope.sumatoriaFinal + ele.total;

                var diferencia = ele.importe - $scope.sumatoriaFinal;
                diferencia = diferencia.toFixed(2);
                // console.log("diferencia", diferencia, $scope.toleranciaComprobacion, $scope.sumatoriaFinal);

                if( ele.estatusNotificacionDeMas != 0 ){
                    ele["Excede"] = 1;
                    ele["ExcedeMonto"] = ele.montoDeMas;
                    $scope.sumatoriaFinal = $scope.sumatoriaFinal - ele.montoDeMas;
                }
                else
                {
                    if( diferencia >= ($scope.toleranciaComprobacion * -1) ){// Anteriormente en 0
                        ele["Excede"] = 0;
                        ele["ExcedeMonto"] = 0;
                    }
                    else{
                        ele["Excede"] = 1;
                        var excedente = $scope.sumatoriaFinal - ele.importe;
                        excedente = excedente.toFixed(2);
                        if( excedente >= ele.total ){
                            ele["ExcedeMonto"] = ele.total;
                            console.log( "if")
                        }
                        else{
                            ele["ExcedeMonto"] = excedente;
                            console.log( "else")
                        }
                    }
                }

                console.log("Variables", ele["Excede"], ele["ExcedeMonto"])
            }
        });

        var comprobacion = $scope.archivos.filter(comp => (comp.estatusNotificacionDeMas >= 2  ) ) ;
        if( comprobacion.length != 0 ){
            console.log( "comprobacion.idConceptoArchivo", comprobacion[0].idConceptoArchivo );
            $scope.archivos.forEach(ele => {
                if( ele.idConceptoArchivo <= comprobacion[0].idConceptoArchivo ){
                    ele["disabledOptions"] = true;
                }
                else if( ele.estatusNotificacionDeMas >= 2 ){
                    ele["disabledOptions"] = true;   
                }
                else{
                    ele["disabledOptions"] = false;
                }
            });

            console.log( $scope.archivos );
        }
    }

    $scope.archivoTemporal = [];
    $scope.modalDeMas = function( archivo ){
        $scope.archivoTemporal = archivo;
        $("#modalDeMas").modal('show');
    }

    $scope.modalDeMasHide = function(){
        $("#modalDeMas").modal('hide');
    }

    $scope.formatNumber = function(amount) {
        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);

        console.log(numberFormat2.format(amount));
        return numberFormat2.format(amount)

        // n = n.toString()
        //  while (true) {
        //    var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
        //    if (n == n2) break
        //    n = n2
        //  }
        //  return n
    }

    $scope.redondeaImporte = function(){
        let valor = 0
        valor = Number($scope.archivoEdicion.total).toFixed(2)
        $scope.archivoEdicion.total = Number(valor);
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

     $scope.sumSolicitado = function(){
        let total = 0

        for (let i = 0; i < $scope.conceptosSolicitud.length; i++) {
            const element = $scope.conceptosSolicitud[i].importeSolicitado;
            total = total+element 
            
        }

        return total
     }

     $scope.sumComprobado = function(){
        let total = 0

        for (let i = 0; i < $scope.conceptosSolicitud.length; i++) {
            const element = $scope.conceptosSolicitud[i].importeComprobado;
            total = total+element 
            
        }

        return total
     }

     $scope.sumAprobado = function(){
        let total = 0

        for (let i = 0; i < $scope.conceptosSolicitud.length; i++) {
            const element = $scope.conceptosSolicitud[i].importeAprobado;
            total = total+element 
            
        }

        return total
     }

     $scope.sumPorComprobar = function(){
        let total = 0

        for (let i = 0; i < $scope.conceptosSolicitud.length; i++) {
            const element = ($scope.conceptosSolicitud[i].importeSolicitado - $scope.conceptosSolicitud[i].importeComprobado) > 0 ? $scope.conceptosSolicitud[i].importeSolicitado - $scope.conceptosSolicitud[i].importeComprobado : 0 ;
            total = total+element 
            
        }

        return total
     }

     $scope.sumGastoMas = function(){
        let total = 0

        for (let i = 0; i < $scope.conceptosSolicitud.length; i++) {
            const element = ($scope.conceptosSolicitud[i].importeAprobado - $scope.conceptosSolicitud[i].importeComprobado) > 0 ? $scope.conceptosSolicitud[i].importeAprobado - $scope.conceptosSolicitud[i].importeComprobado : 0 ;
            total = total+element 
            
        }

        $scope.totalGastoMasSolicitado = total.toFixed(2)

        return total
     }

     $scope.sumGastoMasTramite = function(){
        let total = 0

            for (let i = 0; i < $scope.conceptosSolicitud.length; i++) {
                const element = ($scope.conceptosSolicitud[i].importeAprobado - $scope.conceptosSolicitud[i].importeSolicitado) > 0 ? $scope.conceptosSolicitud[i].importeAprobado - $scope.conceptosSolicitud[i].importeSolicitado : 0 ;
                total = total+element 
                
            }


        $scope.totalGastoMasTramite = total.toFixed(2)
        

        return total
     }

     function OrdenesNoCobradas(){
        let OPNoCobradas = []
        anticipoGastoRepository.OrdenesNoCobradas($scope.tramite.idSolicitud).then(resp =>{
            OPNoCobradas =resp.data
            console.log(OPNoCobradas)
            if(OPNoCobradas.length > 0){
                let item = OPNoCobradas.map(item =>{
                    return `
                        <tr>
                            <td>${item.referencia}</td>
                            <td style="text-align: right;">$${ formatMoney( item.monto )}</td>
                        </tr>
                    `
                })
                let html = `<strong>La(s) siguiente(s) orden de pago NO han sido cobradas en el banco. Mientras no sean cobradas en el banco aparecerán en cartera del solicitante de gastos de viaje. </strong> <br>
                <table   id="tablePoliza"   class="table table-bordered"   cellspacing="0"   width="100%">
                    <thead>
                    <tr>
                        <th>Referencia</th>
                        <th>Monto</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${item}
                    </tbody>
                </table>`
              console.log(html)

              Swal.fire({
                title: 'Ordenes de pago NO COBRADAS',
                icon: 'info',
                html:html,
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
                allowOutsideClick: false,
                showCloseButton: true,
                width: 600
              })

              
            }


        })
     }

});                                                                                                                    