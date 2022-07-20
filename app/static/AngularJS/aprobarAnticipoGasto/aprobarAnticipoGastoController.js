registrationModule.controller('aprobarAnticipoGastoController', function ($scope, $rootScope, $location, anticipoGastoRepository, $window, devolucionesRepository,fondoFijoRepository,aprobarDevRepository, aprobarFondoRepository, apiBproRepository) {
    $scope.usuario = {};
    $scope.accionForm = 'solicitud';
    $scope.titulo = 'Aprobar Solicitud de Gasto';
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
    $scope.archivoDevolucion = { nombre: '', urlArchivo: '', extension: '' };
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
    $scope.selUsuario = 0
    $scope.empleadoSolicitante = ''
    $scope.disabledTipoViaje = true;
    $scope.disabledConcepto = true;
    $scope.disabledMonto = true;

    $scope.distancia = 50;

    $scope.apiJson = structuredClone(apiJsonBPRO2detalles)

    $scope.init = () => {
        if (getParameterByName('idSolicitud') != '') {    
            $scope.idSolicitud = getParameterByName('idSolicitud');
            $scope.numeroSolicitud = 'Solicitud número: ' + $scope.idSolicitud;
            $scope.getAnticipoGastoItem();
            //Se pone otro estatus para que no aparezcan los botones de rechazar y autorizar
            $scope.idestatus = -1;
        }else{
            $rootScope.usuario = JSON.parse(localStorage.getItem('usuario'));
            console.log('usuario: ', $rootScope.usuario)
            $scope.rol =  $rootScope.usuario.idRol;
            $scope.idSolicitud = localStorage.getItem('id_perTra');
            $scope.numeroSolicitud = 'Solicitud número: ' + $scope.idSolicitud;
            $scope.getAnticipoGastoItem();
           // $scope.tipoDescuento = [{ id:2, text:'Deposito'},{ id:1, text:'Caja'},{ id:3, text:'Nomina'}]
           //$scope.tipoDescuento = [{ id:2, text:'Deposito'},{ id:1, text:'Caja'}]
           $scope.tipoDescuento = [{ id:2, text:'Deposito'}]
        }
    };

    $scope.getAnticipoGastoItem = function () {
        $('#spinner-loading').modal('show');
        anticipoGastoRepository.getAnticipoGastoById($scope.idSolicitud, 1).then((res) => {
            console.log("res.data", res.data)
            if (res.data != null && res.data.length > 0) {
                $scope.tramite = {
                    kilometro: res.data[0].kilometro,
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
                    usuario: res.data[0].usuario,
                    valePresupuesto: res.data[0].valePresupuesto,
                    idUsuarioSolicitante: res.data[0].idUsuarioSolicitante,
                    correoSolicitante: res.data[0].correoSolicitante,
                    correosFinanzas: res.data[0].correosFinanzas,
                    idPersona:  res.data[0].PER_IDPERSONA,
                    departamentoArea:res.data[0].departamentoArea,
                    complementoPoliza: res.data[0].complementoPoliza,
                    documentoConcepto: res.data[0].documentoConcepto,
                    cuentaEnvio : res.data[0].cuentaEnvio
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
                if (idEstatus == 0 || idEstatus == 1 || idEstatus == 3) {
                    $scope.accionForm = 'solicitud';
                    $scope.titulo = 'Aprobar Solicitud de Gasto';
                    $scope.idTipoProceso = 2;
                } else if (idEstatus == 8|| idEstatus == 9|| idEstatus == 10) {
                    $scope.accionForm = 'comprobacion';
                    $scope.titulo = 'Aprobar Comprobación de Gasto';
                    $scope.idTipoProceso = 4;
                } else if (idEstatus == 2) {
                    $scope.accionForm = 'solicitud';
                    $scope.titulo = 'Resumen de solicitud de gasto';
                    $scope.idTipoProceso = 2;
                }
                $scope.bancoEmpleado = $scope.tramite.bancoSolicitante;
                $scope.cuentaClabe = $scope.tramite.cuentaClabeSolicitante;
                $scope.getConceptosPorSolicitud();
                $scope.getEmpleadosPorIdSolicitud();
                  //$scope.getArchivosPorConcepto($scope.idSolicitud, 1);
                  console.log('informacion tramite', $scope.tramite);
                  $scope.getArchivosPorReferencia($scope.idSolicitud, 1)
                $scope.openWizard();
                $scope.archivos = [];

                if($scope.tramite.valePresupuesto === 0 && $scope.tramite.idEstatus === 2){
                    swal('Aviso','El solicitante aun no ha subido el vale de presupuesto firmado, no es posible hacer aun la salida de efectivo','info')
                    EnviaCorreoSolicitante()
                }

            } else {
                swal('Anticipo de Saldo', 'No se encontró el registro', 'success');
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
        anticipoGastoRepository.conceptosGastoPorSolicitud($scope.idSolicitud, $scope.idTipoProceso).then((response) => {
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
                        $scope.montoAprobado = $scope.montoAprobado + $scope.conceptosSolicitud[i].importeSolicitado;
                    }
                    $scope.montoDiferencia = $scope.montoAprobado - $scope.montoGastado;
                }
            }
            $('#spinner-loading').modal('hide');

            if(opcion === 1){
                $scope.cierraNotificacion()
            }
        });
    };

    $scope.getArchivosPorConcepto = function (idReferencia, tipoProceso, descripcion, numeroCuenta) {
        $scope.archivos = [];
        $scope.conceptoSeleccionado = descripcion + ' - '+ numeroCuenta;
   
        anticipoGastoRepository.getArchivosPorConceptoGV(idReferencia).then((response) => {
            if (response.data != null && response.data.length > 0) {
                if (tipoProceso == 1) {
                    $scope.archivoRecibo.nombre = response.data[0].nombre;
                    $scope.archivoRecibo.urlArchivo = response.data[0].urlArchivo;
                    $scope.archivoRecibo.extension = response.data[0].extension;
                } else {
                    $scope.archivos = response.data;
                    console.log( $scope.archivos );
                    $scope.importeAG = $scope.archivos[0].importe;
                    var sumtotalPed = 0;
                    $scope.sumatoriaFinal = 0;
                    angular.forEach($scope.archivos, function (list, key) {
                        list.activaApro = false;
                        sumtotalPed += list.aprobado;
                        if (sumtotalPed <= $scope.importeAG) {
                         list.NoAutorizada = false;
                        }
                        else
                        {
                            list.NoAutorizada = true;
                        }

                        //////////////////////////////////////////////////////////

                        $scope.sumatoriaFinal = $scope.sumatoriaFinal + list.total;

                        var diferencia = list.importe - $scope.sumatoriaFinal;

                        if( diferencia >= 0 ){
                            list["Excede"] = 0;
                            list["ExcedeMonto"] = 0;
                        }
                        else{
                            list["Excede"] = 1;
                            var excedente = $scope.sumatoriaFinal - list.importe;
                            if( excedente >= list.total ){
                                
                                list["ExcedeMonto"] = list.total;
                            }
                            else{
                                list["ExcedeMonto"] = excedente;
                            }
                        }
                    });
                }
            }
        });

    };

    $scope.getArchivosPorReferencia = function (idReferencia, tipoProceso, descripcion) {

        anticipoGastoRepository.getArchivosPorReferencia(idReferencia).then((response) => {
            if (response.data != null && response.data.length > 0) {

                if( tipoProceso === 1){
                    response.data.forEach(ele => {
                        if(ele.tipoDevolucion === 0){
                            $scope.tipoVale = 'Vale'
                            $scope.archivoRecibo.nombre = ele.nombre;
                            $scope.archivoRecibo.urlArchivo = ele.urlArchivo;
                            $scope.archivoRecibo.extension = ele.extension;
                        }
                        else{
                            $scope.tipoDev = 'Devolución';
                            $scope.archivoDevolucion.nombre = ele.nombre;
                            $scope.archivoDevolucion.urlArchivo = ele.urlArchivo;
                            $scope.archivoDevolucion.extension = ele.extension;
                        }
                    })
                }
                // if (tipoProceso == 1) {
                //     if(response.data[0].tipoDevolucion == 0)
                //     {
                //         $scope.tipoDevolucion = 0;
                //        // $scope.tipoDev = 'Recibo de caja';
                //        $scope.tipoDev = 'Recibo de caja';
                //     }
                //     else if (response.data[0].tipoDevolucion == 2)
                //     {
                //         $scope.tipoDevolucion = 2;
                //         //$scope.tipoDev = 'Deposito';
                //         $scope.tipoDev = 'Devolución';
                //     }
                //     else
                //     {
                //         $scope.tipoDev =  'Tipo Devolución';
                //     }

                //     $scope.archivoRecibo.nombre = response.data[0].nombre;
                //     $scope.archivoRecibo.urlArchivo = response.data[0].urlArchivo;
                //     $scope.archivoRecibo.extension = response.data[0].extension;
                // } else {
                //     //$scope.archivos = response.data;
                // }
            }
        });
    };

    $scope.editarConcepto = function (concepto) {
        $scope.concepto = concepto;
        $scope.concepto.comentario = '';
        $scope.idtipoViaje = String(concepto.idTipoViaje);
        $scope.idConceptoSeleccion = concepto.idConceptoContable;
        $scope.distancia = concepto.distanciaKilometros
        if(concepto.concepto === 'GTOS DE VIAJE GASOLINA'){
            $scope.selConceptoGasolina = true
        }
        else{
            $scope.selConceptoGasolina = false
        }
        if(concepto.concepto === 'GTOS DE VIAJE GASOLINA' || concepto.concepto === 'GTOS DE VIAJE CASETAS' || concepto.concepto === 'GTOS DE VIAJE RENTA AUTOMOVIL' || concepto.concepto.indexOf('TRANSPORTACIÓN')>0){
            $scope.mostrarDistancia = true;
        }else{
            $scope.mostrarDistancia = false;
        }


        $scope.ObtineMaximoTabulador()
        $scope.getAreaAfectacion(1);
        $("#modalConceptoGastoEdicion").modal({backdrop: 'static', keyboard: false})
        $("#modalConceptoGastoEdicion").modal("show");
    };

    $scope.aprobacionSalidaEfectivo = function () {
        $scope.traeBancos();
        if($scope.tramite.cuentaClabeSolicitante === ''){
           // $scope.tipoSalida = [{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]
            $scope.tipoSalida = [{ id:1, text:'Orden de Pago'}] // se elimina la opcion de caja por lo tratado en la junta del dia 17/11/2021 revisar video
        }else{
           // $scope.tipoSalida = [{ id:3, text:'Transferencia'},{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]    
            $scope.tipoSalida = [{ id:3, text:'Transferencia'},{ id:1, text:'Orden de Pago'}] // se elimina la opcion de caja por lo tratado en la junta del dia 17/11/2021 revisar video
        }
        $scope.salidaSelected = '';
        $scope.BancoSalidaFFS = '';
        $scope.BancoEntradaFFS = '';
        $scope.verTransferencia = false;
        $scope.verOrdenPago = false;
        $scope.verCaja = false;
        $("#modalSalidaEfectivo").modal({backdrop: 'static', keyboard: false})
        $("#modalSalidaEfectivo").modal("show");
    };

    $scope.SeleccionaTipo = function (tipo) {
        $scope.verBotonSalida = true;
        $scope.bancosObtenidos =  $scope.bancosObtenidos === undefined ?  [...$scope.bancos] : $scope.bancosObtenidos

        if(tipo == 1)
        {
            $scope.bancos = $scope.bancos.filter(x => x.Nombre.indexOf('BANCOMER')>-1);
            $scope.verOrdenPago = true;
            $scope.verCaja = false;
            $scope.verTransferencia = false;
        }
        else if(tipo == 2)
        {
            $scope.bancos = $scope.bancosObtenidos
            $scope.verOrdenPago = false;
            $scope.verCaja = true;
            $scope.verTransferencia = false;
        }
        else if(tipo == 3)
        {
            $scope.bancos = $scope.bancosObtenidos
            $scope.verOrdenPago = false;
            $scope.verCaja = false ;
            $scope.verTransferencia = true;
            ObtieneCuentaPersonal();
        }
        else if(tipo == null ||tipo == 0)
        {
            $scope.bancos = $scope.bancosObtenidos
            $scope.verOrdenPago = false;
            $scope.verCaja = false;
            $scope.verTransferencia = false;
            $scope.verBotonSalida = false;
        }
       
    }

    $scope.confirmarSalida  = async function () {
        document.getElementById("confirmaSalida").disabled = true;

        var idUsuario = $scope.tramite.idUsuarioSolicitante //$rootScope.usuario.usu_idusuario;
        var idSucursal = $scope.tramite.idSucursal;
        var idEmpresa = $scope.tramite.idCompania;
        var nombrecto = $scope.tramite.dep_nombrecto;
        var idSolicitud = $scope.idSolicitud;

        var bancoEmpleado = $scope.bancoEmpleado; // No se guarda el banco del empleado
        var cuentaClabe = $scope.cuentaClabe;

        var be = $scope.BancoEntradaFFS;
        var bs = $scope.BancoSalidaFFS;

        var numeroCuentaEntrada = be != null ? be.numeroCuenta || '' : '';
        var numeroCuentaSalida = bs != null ? bs.numeroCuenta || '' : '';
        var cuentaContableEntrada = be != null ? be.cuentaContable || '' : '';
        var cuentaContableSalida = bs != null ? bs.cuentaContable || '' : '';
        var idBancoEntrada = be != null ? be.IdBanco || 0 : 0;
        var idBancoSalida = bs != null ? bs.IdBanco || 0 : 0;

        var idTramitePersona = $scope.tramite.idSolicitud;
        var idSalida = $scope.salidaSelected;

        var concepto = '';
        var ventaUnitario = 0;

        //var nombreBancoSalida =  $scope.BancoSalidaFFS.nombreBanco;
        //var nombreBancoEntrada = $scope.BancoEntradaFFS === undefined ? '': $scope.BancoEntradaFFS.nombreBanco;

        /* Cambiar a total de los conceptos */
        /* solo sumar las no procesadas */
        /* CONCEPTO DE 20 CARACTERES */
        var agregarPoliza = false;
        concepto = '' + decimalToHexString(parseInt($scope.idSolicitud));
        var conceptos = 0;
        var conceptosContables = 0;
        for (var i = 0; i <  $scope.conceptosSolicitud.length; i++) {
            if($scope.conceptosSolicitud[i].salidaEfectivo == 0)
            {
                //concepto += 'AG-' + $scope.idSolicitud + '-' + $scope.conceptosSolicitud[i].id + '-' + $scope.conceptosSolicitud[i].idConceptoContable + '';
                //concepto += '-' + decimalToHexString($scope.conceptosSolicitud[i].id);
                conceptos += $scope.conceptosSolicitud[i].id;
                conceptosContables += $scope.conceptosSolicitud[i].idConceptoContable;
                ventaUnitario += $scope.conceptosSolicitud[i].importeAprobado;
                agregarPoliza = true;
            }
        }
        concepto += '-' + decimalToHexString(conceptos);
        concepto += '-' + decimalToHexString(conceptosContables);
        var idTramiteTesoreria = 0;
        var  tipoProceso = true;
        var montoCorreo;
        if(agregarPoliza)
        {
            if(idSalida == 1)
            {
                let beneficiario = $scope.empleados === undefined || $scope.empleados.length < 1 ? $scope.tramite.usuario: $scope.empleados[0].nombreEmpleado;
                let monto = formatMoney(ventaUnitario);

                if(bs != null || bs != undefined)
                {
                $("#modalSalidaEfectivo").modal("hide");
                let body = `
                <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                <div>
                    <h3>Se solicito el siguiente Anticipo de Gasto por Orden de Pago</h3>
                    <table>
                         <tbody>
                             <tr>
                                 <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Anticipo de Gastos N°:</span></td>
                                 <td>${idSolicitud}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                 <td>${$scope.tramite.empresa}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                                 <td>${$scope.tramite.sucursal}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Beneficiario:</span></td>
                                 <td> ${beneficiario}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                                 <td>${bs.Nombre} - ${bs.numeroCuenta}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">CLABE Destino:</span></td>
                                 <td> ${bs.cuentaClabe}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                                 <td>$${monto}</td>
                             </tr>
                         </tbody>
                     </table>
                </div>
                `


                // '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                //  '<p>Se solicito el siguiente Anticipo de Gasto por Orden de Pago</p>' +
                //  '<p>Anticipo de Gastos N°: '+ idSolicitud+ '</p>' +
                //  '<p>Banco Salida</p>' +
                //  '<p>Banco: '+ bs.Nombre+ '</p>' +
                //  '<p>Número Cuenta: '+ bs.cuentaContable+ '</p>' +
                //  '<p>Cantidad: $'+  formatMoney(ventaUnitario) + '</p>';  

                 $scope.sendMail($scope.correoTesoreria, 'Salida de Efectivo por Orden de Pago, Anticipo de Gasto N°' + idSolicitud, body);
                // //tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, idSucursal, 'GVOP', concepto, ventaUnitario,idSolicitud)
                let banco = zeroDelete(cuentaContableSalida);
                //tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,15,'AG-' +concepto,ventaUnitario,'AC',nombrecto,idSolicitud,banco,'');
                // tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,16,'AG-' +concepto,ventaUnitario,'AC',nombrecto,idSolicitud,banco,'');
                }
                else{
                    swal('Atencion', 'No se selecciono el Banco Salida', 'warning');
                    tipoProceso = false;
                    }
            }
            else if (idSalida == 3)
            {
                
                var fecha = new Date().toLocaleDateString("es-MX");

                // switch($scope.infoWeb.M4_IDBANCO){
                //     case 'BANCT':
                //     case 'BNCMR':
                //     case 'BNCMR_SCA':
                //     case 'BNMR':
                //     case 'BNMX':
                //         idBancoEntrada = 1;
                //         break;
                //     case 'SANTA':
                //     case 'SANTD':
                //     case 'SANTM':
                //     case 'SANTR':
                //     case 'SNTDR':
                //     case 'SNTR':
                //         idBancoEntrada = 3;
                //         break;
                //     default:
                //         idBancoEntrada = 0;
                // }

                idBancoEntrada = 0;

                var OrdenMasivaParametros = {
                    idusuario: idUsuario,
                    id_perTra: $scope.idSolicitud,
                    proceso: 1
                }

                let data = {
                    'idEmpresa':$scope.selEmpresa,
                    'idSucursal': $scope.selSucursal,
                    'idDepartamento':$scope.selDepartamento,
                    'idOrigenReferencia': 7,
                    'idBancoOrigen':idBancoSalida,
                    'idBancoDestino':idBancoEntrada,
                    'documento':`${$scope.tramite.idSolicitud}-${$scope.tramite.motivo}`,
                    'importe':$scope.tramite.importe,
                    'idPersona': idUsuario//$rootScope.usuario.usu_idusuario
                }
// $scope.infoWeb
                cuentaContableEntrada = `${$scope.bancoEmpleado} - CLABE: ${$scope.cuentaClabe}`
                let referencia = await promiseGetReferencia(data)
                let transferencia = await promiseTransferencia(idEmpresa, idSucursal, cuentaContableSalida, cuentaContableEntrada, ventaUnitario, idUsuario, referencia, 2);
                // let saveTransferencia = await promisesaveTransferencia(idUsuario, 13, transferencia[0].folio, $scope.idSolicitud);
                // idTramiteTesoreria = saveTransferencia[0].idTramite;

                $scope.OrdenMasivaSalidaAnticipo( OrdenMasivaParametros );

                if(bs != null || bs != undefined || bancoEmpleado != null || bancoEmpleado != undefined || cuentaClabe != null || cuentaClabe != undefined  )
                {
                $("#modalSalidaEfectivo").modal("hide");

                montoCorreo = formatMoney(ventaUnitario); //Number(ventaUnitario).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
                let body = ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                <div>
                    <h3>Solicitud de transferencia bancaria</h3>
                    <p>Se ha solicitado de manera satisfactoria el efectivo por transferencia mediante la creación de una Orden de Compra con Anticipo por la cantidad de $`+ montoCorreo +`.</p>
                </div>`


                // let body = ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                // <div>
                //     <p>Solicitud de transferencia bancaria</p>
                //     <table>
                //         <tbody>
                //             <tr>
                //                 <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de tramite:</span></td>
                //                 <td>${saveTransferencia[0].idTramite}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                //                 <td>${$scope.tramite.empresa}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Origen:</span></td>
                //                 <td>${bs.nombreBanco} - ${bs.numeroCuenta}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">CLABE Origen:</span></td>
                //                 <td> ${bs.cuentaClabe}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                //                 <td>${$scope.bancoEmpleado}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">CLABE Destino:</span></td>
                //                 <td> ${$scope.cuentaClabe}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Banco M4</span></td>
                //                 <td> ${$scope.infoWeb.M4_BANCO}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Nomina M4</span></td>
                //                 <td> ${$scope.infoWeb.M4_NUMEROCTA}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Referencia:</span></td>
                //                 <td> ${referencia}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                //                 <td>${$scope.infoWeb.M4_TITULARCTABCO}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                //                 <td>$${montoCorreo}</td>
                //             </tr>
                //             <tr>
                //                 <td style="text-align: right;"><span style="color: #ff0000;">Fecha y Hora Autorizada:</span></td>
                //                 <td>${fecha}</td>
                //             </tr>
                //         </tbody>
                //     </table>
                // </div>`

                 //$scope.sendMail($scope.correoTesoreria, 'Salida de Efectivo por Transferencia, Anticipo de Gasto N°' + idSolicitud, body);
                 // console.log( "$scope.tramite.correoSolicitante",  );
                 $scope.sendMail($scope.tramite.correoSolicitante, 'Salida de Efectivo por Transferencia, Anticipo de Gasto N°' + idSolicitud, body);
                ////tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, idSucursal, 'GVTE', concepto, ventaUnitario,idSolicitud)
                ////let banco = zeroDelete(cuentaClabe);
                // let banco = zeroDelete(cuentaContableSalida);
                // tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,15,'AG-' +concepto,ventaUnitario,'AC',nombrecto,idSolicitud,banco,'');
                // tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,16,'AG-' +concepto,ventaUnitario,'AC',nombrecto,idSolicitud,banco,'');
                }
                else{
                    if(bs == null || bs == undefined)
                    {
                    swal('Atencion', 'No se selecciono el Banco Salida', 'warning');
                    tipoProceso = false;
                    }
                    else if(bancoEmpleado == null || bancoEmpleado == undefined)
                    {
                    swal('Atencion', 'No se ingreso el Banco Entrada', 'warning');
                    tipoProceso = false;
                    }
                    else if(cuentaClabe == null || cuentaClabe == undefined)
                    {
                    swal('Atencion', 'No se ingreso la CLABE', 'warning');
                    tipoProceso = false;
                    }
                    
                    
                    }
            }
            else {
                //tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, idSucursal, 'GVCE', concepto, ventaUnitario,idSolicitud)
                //tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, idSucursal, 'GVCS', concepto, ventaUnitario,idSolicitud)
                if((bs != null || bs != undefined) && (be != null || be != undefined))
                {
                 $("#modalSalidaEfectivo").modal("hide");
                 let data = {
                    'idEmpresa':$scope.selEmpresa,
                    'idSucursal': $scope.selSucursal,
                    'idDepartamento':$scope.selDepartamento,
                    'idOrigenReferencia': 9,
                    'idBancoOrigen':idBancoSalida,
                    'idBancoDestino':idBancoEntrada,
                    'documento':`${$scope.tramite.idSolicitud}-${$scope.tramite.motivo}`,
                    'importe':$scope.tramite.importe,
                    'idPersona':$rootScope.usuario.usu_idusuario
                }
                 let referencia = await promiseGetReferencia(data)
                 //tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,17,'AG-' +concepto,ventaUnitario,nombrecto,nombrecto,idSolicitud,bancoE,'');
                 let transferencia = await promiseTransferencia(idEmpresa, idSucursal, cuentaContableSalida, cuentaContableEntrada, ventaUnitario, idUsuario);
                let saveTransferencia = await promisesaveTransferencia(idUsuario, 13, transferencia[0].folio, $scope.idSolicitud);
                 idTramiteTesoreria = saveTransferencia[0].idTramite;
                 montoCorreo = formatMoney(ventaUnitario); //Number(ventaUnitario).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
                 

                 let html1= ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                 <div>
                     <p>Solicitud de transferencia bancaria</p>
                     <table>
                         <tbody>
                             <tr>
                                 <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de tramite:</span></td>
                                 <td>${saveTransferencia[0].idTramite}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                 <td>${transferencia[0].Empresa}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Origen:</span></td>
                                 <td>${be.Nombre} - ${be.numeroCuenta}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">CLABE Origen:</span></td>
                                 <td> ${be.cuentaClabe}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                                 <td>${bs.Nombre} - ${bs.numeroCuenta}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">CLABE Destino:</span></td>
                                 <td> ${bs.cuentaClabe}</td>
                             </tr>
                             <tr>
                                <td style="text-align: right;"><span style="color: #ff0000;">Referencia:</span></td>
                                <td> ${referencia}</td>
                            </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                 <td>${transferencia[0].Usuario}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                                 <td>$${montoCorreo}</td>
                             </tr>
                             <tr>
                                 <td style="text-align: right;"><span style="color: #ff0000;">Fecha y Hora Autorizada:</span></td>
                                 <td>${transferencia[0].Fecha}</td>
                             </tr>
                         </tbody>
                     </table>
                 </div>`;
         
                //  let html2= ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                //  <div>
                //      <p>Estimado usuario, le informamos que <strong>el sistema de fondo fijos</strong> a generado una transferencia interbancaria:</p>
                //      <table>
                //          <tbody>
                //              <tr>
                //                  <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de tramite:</span></td>
                //                  <td>${saveTransferencia[0].idTramite}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                //                  <td>${transferencia[0].Empresa}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Origen:</span></td>
                //                  <td>${be.Nombre} - ${be.numeroCuenta}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">CLABE Origen:</span></td>
                //                  <td> ${be.cuentaClabe}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                //                  <td>${bs.Nombre} - ${bs.numeroCuenta}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">CLABE Destino:</span></td>
                //                  <td> ${bs.cuentaClabe}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                //                  <td>${transferencia[0].Usuario}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                //                  <td>${montoCorreo}</td>
                //              </tr>
                //              <tr>
                //                  <td style="text-align: right;"><span style="color: #ff0000;">Fecha y Hora Autorizada:</span></td>
                //                  <td>${transferencia[0].Fecha}</td>
                //              </tr>
                //          </tbody>
                //      </table>
                //  </div>`;
                 $scope.sendMail($scope.correoTesoreria, 'Salida de Efectivo por Caja, Anticipo de Gasto', html1);
                //  $scope.sendMail($scope.correoTesoreria, 'Salida de Efectivo por Caja, Anticipo de Gasto', html2);


                // let body = 
                // '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                //  '<p>Se solicito el siguiente Anticipo de Gasto por Caja</p>' +
                //  '<p>Anticipo de Gastos N°: '+ idSolicitud+ '</p>' +
                //  '<p>Banco Salida</p>' +
                //  '<p>Banco: '+ bs.Nombre+ '</p>' +
                //  '<p>Número Cuenta: '+ bs.cuentaContable+ '</p>' +
                //  '<p>Banco Entrada</p>' +
                //  '<p>Banco: '+ be.Nombre + '</p>' +
                //  '<p>Número Cuenta: '+ be.cuentaContable + '</p>' +
                //  '<p>Cantidad: $'+  ventaUnitario + '</p>';   
                //  $scope.sendMail($scope.correoTesoreria, 'Salida de Efectivo por Caja, Anticipo de Gasto N°' + idSolicitud, body);
                
                // let bancoE = zeroDelete(cuentaContableEntrada);
                // let bancoS = zeroDelete(cuentaContableSalida);
                // tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,17,'AG-' +concepto,ventaUnitario,nombrecto,nombrecto,idSolicitud,bancoE,'');
                // tipoProceso = await promiseInsertaDatos(idUsuario,idSucursal,18,'AG-' +concepto,ventaUnitario,nombrecto,nombrecto,idSolicitud,bancoS,'');
                }
                else
                {
                    if(bs == null || bs == undefined)
                    { swal('Atención', 'No se selecciono el Banco Salida', 'warning');}
                    else if (be == null || be == undefined)
                    {swal('Atención', 'No se selecciono el Banco Entrada', 'warning');}
                    else {swal('Atención', 'No se seleccionaron los Bancos', 'warning');}
                    tipoProceso = false;
                }
            }
            if(tipoProceso) {
                anticipoGastoRepository.salidaEfectivoConcepto(
                    idTramitePersona,
                    idSalida,
                    idBancoSalida,
                    idBancoEntrada,
                    numeroCuentaSalida,
                    cuentaContableSalida,
                    numeroCuentaEntrada,
                    cuentaContableEntrada,
                    ventaUnitario
                ).then((res) => {
                    if (res.data[0].success == 1) {           
                        swal('Anticipo de Gasto', 'Se ha realizado la salida de efectivo', 'success');
                     
                        $location.path('/home');
                    } else {
                    
                        swal('Error','Ocurrió un error al generar la salida de efectivo', 'error');
                    }
                });
            }
        }																		
    };

    // $scope.OrdenMasivaSalidaAnticipo = function( parametros ){
    //     anticipoGastoRepository.OrdenMasivaCabecero(parametros).then( (result) =>{
    //         if( result.data[0].resultado == 0 ){
    //             swal("Orden de Anticipo de Gasto","Ocurrio un problema al intentar guardar la order de anticipo, intenta de nuevo mas tarde.","warning");
    //         }
    //         else if( result.data[0].resultado == -1 ){
    //             swal("Orden de Anticipo de Gasto","Ya existe una orden de compra para este trámite, favor de validar.","warning");
    //         }
    //         else{
    //             swal("Orden de Anticipo de Gasto","Se ha creado la Orden de compra con Anticipo para Gasto de Viaje de forma satisfactoria.","success");
    //         }
    //     });
    // }


    $scope.actualizaImporteConcepto = function () {
        $('#spinner-loading').modal('show');
        $scope.concepto.idEstatus = $scope.tramite.idEstatus;
        $scope.concepto.distancia = $scope.distancia;
        anticipoGastoRepository.actualizaImporteConcepto($scope.concepto, $rootScope.user.usu_idusuario, $scope.idtipoViaje).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                swal('Concepto de viaje', 'Se actualizó la información correctamente', 'success');
                $("#modalConceptoGastoEdicion").modal("hide");
                $('#spinner-loading').modal('hide');
                $scope.getConceptosPorSolicitud();
            } else {
                $('#spinner-loading').modal('hide');
                swal('Concepto de viaje', 'Ocurrió un error al actualizar la información', 'warning');
            }
        });
    };

    $scope.aprobarRechazarConcepto = function (concepto, idEstatus) {
        concepto.comentarioComprobacion = '';
        $scope.activarImporte = 0;
        $scope.concepto = angular.copy(concepto);
        //$scope.concepto = concepto;
        $scope.idEstatusConcepto = idEstatus;
        if ($scope.idTipoProceso == 4) {
            concepto.importeSolicitado = concepto.importeComprobado;
        }
        if (idEstatus == 3 || idEstatus == 9 || idEstatus == 10) {
            $scope.activarImporte = 1;
        }
        $('#modalConceptoGastoEdicionAp').modal('show');

    };

    $scope.aprobarRechazarArchivo = function (archivo, idEstatus, compNoAutorizada) {
        archivo.comentarioComprobacion = '';
        $scope.activarImporte = 0;
        $scope.archivo = archivo;
        $scope.idEstatusConcepto = idEstatus;
        $scope.compNoAutorizada = compNoAutorizada;
        if (idEstatus == 3 || idEstatus == 10 || idEstatus == 10) {
            $scope.activarImporte = 1;
        }
        $scope.activarImporte = 1;
        $('#modalArchivoEdicion').modal('show');
    };

    $scope.confirmarConcepto = function () {
        if ($scope.concepto.importeSolicitado <= 0) {
            swal('Concepto de viaje', 'Debe ingresar un importe', 'warning');
        } else {
            $scope.concepto.idEstatus = $scope.idEstatusConcepto;
            $scope.concepto.importeAprobado = $scope.concepto.importeSolicitado;
            // var tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 19,'AG-' + $scope.idSolicitud + '-' + $scope.concepto.id + '-' + $scope.concepto.idConceptoContable,   $scope.concepto.importeAprobado, 'AC',$scope.tramite.dep_nombrecto );
            // if(tipoProceso)
            // {
            anticipoGastoRepository.aprobarRechazarConcepto($scope.concepto, $rootScope.user.usu_idusuario, $scope.idTipoProceso, $scope.idSolicitud).then((res) => {
                if (res != null && res.data != null && res.data.respuesta != 0) {
                    $('#modalConceptoGastoEdicion').modal('hide');
                    swal('Concepto de viaje', 'Se proceso correctamnete', 'success');
                    $scope.getConceptosPorSolicitud(1);
                    if (res.data.idRegistro == 2 || res.data.idRegistro == 3 || res.data.idRegistro == 9 || res.data.idRegistro == 10) {
                        $scope.tramite.idEstatus = res.data.idRegistro;
                    }
                } else {
                    $('#modalConceptoGastoEdicion').modal('hide');
                    swal('Concepto de viaje', 'Ocurrió un error al procesar', 'warning');
                }

                $('#spinner-loading').modal('hide');
                
            });

            $('#modalConceptoGastoEdicionAp').modal('hide');

            
        //}
        }
    };

    $scope.confirmarArchivo = async function () {

        $('#modalArchivoEdicion').modal('hide');
        $('#spinner-loading').modal('show');
        let respAprobarRechazar

        try{
            if( $scope.archivo.estatusNotificacionDeMas === undefined  || 
                $scope.archivo.estatusNotificacionDeMas === null || 
                $scope.archivo.estatusNotificacionDeMas == 0 ||
                $scope.archivo.estatusNotificacionDeMas == '' ){
                $scope.compNoAutorizada = 0;
            }
            else if( $scope.archivo.estatusNotificacionDeMas == 4 ){
                $scope.compNoAutorizada = 1;
            }
            else if( $scope.archivo.estatusNotificacionDeMas == 3 ){
                $scope.compNoAutorizada = 0;
                // Aqui se crea el tramite para salida de efectivo para comprobación de más

                var parametros = {
                    perTraPadre: $scope.idSolicitud,
                    idConceptoArhivo: $scope.archivo.idConceptoArchivo,
                    importe: $scope.archivo.ExcedeMonto,
                    idTramiteConcepto: $scope.archivo.idReferencia
                }

                console.log( $scope.archivo );

                //return true;

                console.log( "creacionTramiteEntregaEfectivo", parametros );

                $scope.creacionTramiteEntregaEfectivo( parametros );
            }
        }
        catch( e ){
            $scope.compNoAutorizada = 0;
        }

        //return true;
        var data = {
            idConceptoArchivo: $scope.archivo.idConceptoArchivo,
            importe: $scope.archivo.total,
            idEstatus: $scope.idEstatusConcepto,
            idUsuario: $rootScope.usuario.usu_idusuario,
            idTramiteConcepto: $scope.archivo.idReferencia,
            idTipoProceso: $scope.idTipoProceso,
            comentario: $scope.archivo.comentario,
            idSolicitud: $scope.idSolicitud,
            compNoAutorizado: $scope.compNoAutorizada
        };
    
        let fecha = new Date()
        let anio = fecha.getFullYear().toString()
        let mes = fecha.getMonth().toString().length < 2 ? `0${fecha.getMonth()+1}`: (fecha.getMonth()+1).toString()
        let dia = fecha.getDate().toString().length < 2 ? `0${fecha.getDate()}`: fecha.getDate().toString()

                if($scope.idEstatusConcepto == 9)
                {
                    dataOrden = 
                    {
                    idusuario: $rootScope.usuario.usu_idusuario,
                    idempresa: $scope.tramite.idCompania,
                    idsucursal: $scope.tramite.idSucursal,
                    id_perTra: $scope.tramite.idSolicitud,
                    proceso: 2,
                    producto: $scope.archivo.idComprobacionConcepto
                    }
                    
                    
                    /** Si el monto total de la poliza es cero solo debe de generar la OC */
                    if($scope.archivo.totalPoliza == 0){

                        $scope.apiJson = structuredClone(apiOC)

                        $scope.apiJson.IdEmpresa = $scope.tramite.idCompania
                        $scope.apiJson.IdSucursal = $scope.tramite.idSucursal
                        $scope.apiJson.Tipo = 3
    
                        $scope.apiJson.OrdenCompra.IdProveedor = $scope.tramite.idPersona
                        $scope.apiJson.OrdenCompra.ArePed = $scope.tramite.dep_nombrecto
                        $scope.apiJson.OrdenCompra.TipoComprobante = '1'
                        $scope.apiJson.OrdenCompra.FechaOrden = `${anio}-${mes}-${dia}`
                        $scope.apiJson.OrdenCompra.FechaAplicacion = `${anio}-${mes}-${dia}`
    
                        $scope.apiJson.OrdenCompra.Detalle[0].ConceptoContable = $scope.archivo.idConceptoContable
                        $scope.apiJson.OrdenCompra.Detalle[0].Cantidad = 1
                        $scope.apiJson.OrdenCompra.Detalle[0].Producto = $scope.archivo.idComprobacionConcepto
                        $scope.apiJson.OrdenCompra.Detalle[0].PrecioUnitario =( $scope.archivo.totalOC).toFixed(2)
                        $scope.apiJson.OrdenCompra.Detalle[0].TasaIva = $scope.archivo.ivaOC

                    }else{
                        $scope.apiJson.IdEmpresa = $scope.tramite.idCompania
                        $scope.apiJson.IdSucursal = $scope.tramite.idSucursal
                        $scope.apiJson.Tipo = 1
    
                        $scope.apiJson.OrdenCompra.IdProveedor = $scope.tramite.idPersona
                        $scope.apiJson.OrdenCompra.ArePed = $scope.tramite.dep_nombrecto
                        $scope.apiJson.OrdenCompra.TipoComprobante = '1'
                        $scope.apiJson.OrdenCompra.FechaOrden = `${anio}-${mes}-${dia}`
                        $scope.apiJson.OrdenCompra.FechaAplicacion = `${anio}-${mes}-${dia}`
    
                        $scope.apiJson.OrdenCompra.Detalle[0].ConceptoContable = $scope.archivo.idConceptoContable
                        $scope.apiJson.OrdenCompra.Detalle[0].Cantidad = 1
                        $scope.apiJson.OrdenCompra.Detalle[0].Producto = $scope.archivo.idComprobacionConcepto
                        $scope.apiJson.OrdenCompra.Detalle[0].PrecioUnitario =( $scope.archivo.totalOC).toFixed(2)
                        $scope.apiJson.OrdenCompra.Detalle[0].TasaIva = $scope.archivo.ivaOC
    
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Proceso = `AGVV${$scope.tramite.complementoPoliza}`
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].DocumentoOrigen = $scope.archivo.documentoOrigen
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Canal = `AGVV${$scope.tramite.complementoPoliza}`
       
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= $scope.archivo.idComprobacionConcepto
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '1'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto='OT'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto='DD'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Origen = 'FAC'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.tramite.idPersona
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = $scope.archivo.documentoOrigen 
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].IVA = ($scope.archivo.ivaPoliza).toFixed(2)
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario =  $scope.archivo.totalPoliza
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = $scope.archivo.idComprobacionConcepto
                
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoOrigen= $scope.archivo.idComprobacionConcepto
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Partida = '2'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].TipoProducto='OT'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].SubProducto='PA'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Origen = 'FAC'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Persona1 = $scope.archivo.idRfcFactura
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoAfectado = '' 
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Moneda = 'PE'
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].IVA = ($scope.archivo.ivaPoliza).toFixed(2)
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].VentaUnitario = $scope.archivo.totalPoliza
                        $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Referencia2 = $scope.archivo.idComprobacionConcepto 
                    }

                    let datalog = structuredClone(datalogAPI)
                    datalog.idSucursal = $scope.tramite.idSucursal
                    datalog.id_perTra = $scope.tramite.idSolicitud
                    datalog.opcion = 1
                    
                    let AuthToken;
                    AuthToken = await promiseAutBPRO();

                    datalog.tokenGenerado = AuthToken.Token
                    datalog.unniqIdGenerado = AuthToken.UnniqId
                    datalog.jsonEnvio = JSON.stringify($scope.apiJson)

                    let respLog = await LogApiBpro(datalog)

                    datalog.consecutivo = respLog.folio
                    datalog.opcion = 2

                    resPoliza = await GeneraPolizaBPRO(AuthToken.Token,JSON.stringify($scope.apiJson))

                    if(resPoliza.Codigo === '200 OK'){

                        if($scope.archivo.totalPoliza == 0){
                            datalog.jsonRespuesta = JSON.stringify(resPoliza)
                            datalog.codigo = resPoliza.Codigo
                            datalog.resuelto = 1
                            datalog.ordenCompra = resPoliza.Folio  
                        }else{
                            datalog.anioPol = resPoliza.Poliza[0].añoPoliza
                            datalog.consPol = resPoliza.Poliza[0].ConsecutivoPoliza
                            datalog.empresaPol = resPoliza.Poliza[0].EmpresaPoliza
                            datalog.mesPol =  resPoliza.Poliza[0].MesPoliza
                            datalog.tipoPol = resPoliza.Poliza[0].TipoPoliza
                            datalog.jsonRespuesta = JSON.stringify(resPoliza)
                            datalog.codigo = resPoliza.Codigo
                            datalog.resuelto = 1
                            datalog.ordenCompra = resPoliza.Folio  
                        }

                        respAprobarRechazar = await aprobarRechazarArchivo(data)
            
                        respUpdate = await promiseActualizaTramite($scope.tramite.idSolicitud,'AGVV', $scope.archivo.idComprobacionConcepto , 0,datalog.ordenCompra,datalog.consPol,datalog.mesPol,datalog.anioPol)

                        $scope.archivo.idEstatus = $scope.idEstatusConcepto;
                        $scope.getConceptosPorSolicitud();
            
                        $('#spinner-loading').modal('hide');
            
                        if($scope.archivo.totalPoliza == 0){
                            swal({
                                title:"Aviso",
                                type:"info",
                                width: 1000,
                                text:`La aprobación unicamente generó orden de compra, la cual se saldará cuando se haga el proceso de comprobación de más
    
                                Orden Compra: ${datalog.ordenCompra}

                                `,
                                showConfirmButton: true,
                                showCloseButton:  false,
                                timer:10000,
                                timerProgressBar: true
                            })
                        }else{
                            swal({
                                title:"Aviso",
                                type:"info",
                                width: 1000,
                                text:`La aprobación generó la siguiente póliza
    
                                Orden Compra: ${datalog.ordenCompra}
                                Año póliza: ${datalog.anioPol}
                                Mes póliza: ${datalog.mesPol}
                                Cons póliza: ${datalog.consPol}
                                Tipo póliza: ${datalog.tipoPol}
                                `,
                                showConfirmButton: true,
                                showCloseButton:  false,
                                timer:10000,
                                timerProgressBar: true
                            })
                        }

                        
                    }else{

                        $('#spinner-loading').modal('hide');

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

                }

                if($scope.idEstatusConcepto === 10){
                    EnviaCorreoRechazoComprobacion();
                }

    };

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

    async function aprobarRechazarArchivo(data){
        return new Promise((resolve, reject) => {
            anticipoGastoRepository.aprobarRechazarArchivo(data).then(resp =>{
                console.log('respuesta: ',resp.data)
                resolve(resp.data)
            }).catch(error => {
                resolve(error)
            })
        })
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
         async function promiseActualizaTramite(id_perTra,poliza,documentoConcepto= '',incremental = 0,ordenCompra = '', consPol = 0, mesPol= 0, anioPol = 0 ) {
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

    $scope.creacionTramiteEntregaEfectivo = function( parameros ){
        anticipoGastoRepository.creacionTramiteEntregaEfectivo( parameros ).then( response =>{
            console.log( "Respuesta de la creacion del tramite", response.data[0].id_perTra );

            var parametrosEmail = {
                empresa: $scope.tramite.empresa,
                sucursal: $scope.tramite.sucursal,
                departamento: $scope.tramite.departamento,
                viaje: $scope.tramite.concepto,
                motivo: $scope.tramite.motivo,
                fecha: $scope.tramite.fechaInicio + ' al ' + $scope.tramite.fechaFin,
                concepto: $scope.conceptosSolicitud[0].concepto,
                aprobacion: $scope.tramite.importe,
                comp_aprobado: $scope.archivos[0].total,
                importe: $scope.archivo.ExcedeMonto,
                solicitante: $scope.empleados !== undefined && $scope.empleados.length > 0 ? $scope.empleados[0].nombreEmpleado : $scope.tramite.usuario
            }
            
            html = $scope.bodyTramitesCuenta( response.data[0].id_perTra, parametrosEmail );
            $scope.sendMail($scope.tramite.correosFinanzas, "Gastos de Viaje - Entrega de efectivo de gastos de más aprobados", html);
        });
    }

    $scope.cuentasContablesFF = function () {
        $('#modalArchivoEdicion').modal('hide');
        fondoFijoRepository.obtieneCCbySucursal($scope.tramite.idSucursal).then(function (res) {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.cuentasContablesSuc = res.data;
                $('#modalCC').modal('show');
            } 
        });
    };

    $scope.enviarcuentaContable = async function () {

        tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 19,'AG-' + $scope.idSolicitud + '-' + $scope.archivo.idReferencia + '-' + $scope.archivo.idConceptoContable, estatusVales.montoSolicitado, 'AC',$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );
        tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 20,'AG-' + $scope.idSolicitud + '-' + $scope.archivo.idReferencia + '-' + $scope.archivo.idConceptoContable, estatusVales.justificoMas, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );
    };

    $scope.aprobacionSolicitud = async function (idEstatus) {
        //$('#spinner-loading').modal('show');
        anticipoGastoRepository.aprobacionSolicitud($scope.idSolicitud, idEstatus).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Se actualizó la solicitud correctamente', 'success');
                $scope.tramite.idEstatus = idEstatus;
                $scope.getConceptosPorSolicitud();
                $location.path('/home');
            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Ocurrió un error al generar la actualización', 'success');
            }

            $('#spinner-loading').modal('hide');
        });
    };

    $scope.aprobarRechazarEmpleado = function (idTramiteEmpleado, idEstatus) {
        $('#spinner-loading').modal('show');
        anticipoGastoRepository.aprobarRechazarEmpleado(idTramiteEmpleado, idEstatus, $scope.idSolicitud).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                swal('Anticipo de Saldo', 'Se procesado la solicitud correctamente', 'success');
                $scope.getEmpleadosPorIdSolicitud();
                $('#spinner-loading').modal('hide');
                if (res.data.idRegistro == 2 || res.data.idRegistro == 3) {
                    $scope.tramite.idEstatus = res.data.idRegistro;
                }
            } else {
                $('#spinner-loading').modal('hide');
                swal('Anticipo de Saldo', 'Ocurrió un error al generar la solicitud', 'success');
            }
        });
    };

    $scope.modalDepartamentos = function (conceptoArchivo) {
        $scope.selDepartamento = 0;
        $scope.porcentaje = 0;
        $scope.conceptoArchivo = conceptoArchivo;
        $scope.departamentosArchivo = [];
        anticipoGastoRepository.getDepartamentosPorArchivo($scope.conceptoArchivo.idConceptoArchivo).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.departamentosArchivo = response.data;
            }
        });

        $("#modalDepartamento").modal("show");
        $scope.errorMensaje = '';
    };

    $scope.verArchivo = function (archivo) {
        if(archivo.tipoNotificacion == 1)
        {
            if(archivo.estatusNotificacion == 1 || archivo.estatusNotificacion == 2  || archivo.estatusNotificacion == 5)
            {archivo.activaApro = false;}
            else
            {archivo.activaApro = true;}
        }
        else if(archivo.tipoNotificacion == 2)
        {
            if(archivo.estatusNotificacion == 1 || archivo.estatusNotificacion == 2  || archivo.estatusNotificacion == 3 || archivo.estatusNotificacion == 5)
            {archivo.activaApro = false;}
            else
            {archivo.activaApro = true;}
        }
        else
        {archivo.activaApro = true;}
        
        $scope.modalTitle = archivo.nombre;
        if (archivo.extension == 'pdf') {
            $('#pdfReferenceContent object').remove();
            $("#mostrarPdf").modal("show");
            $("<object class='lineaCaptura' data='" + archivo.urlArchivo + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
            $('#mostrarPdf').insertAfter($('body'));
           
        } else if (archivo.extension == 'jpg' || archivo.extension == 'png') {
            $scope.verImagen = archivo.urlArchivo;
            $("#mostrarImagen").modal("show");
        } else if (archivo.extension == 'xml') {
            window.open(archivo.urlArchivo, archivo.nombre);

        }
    };

    $scope.frmModalEmpleado = function () {
        $scope.getEmpleadosPorIdSolicitud();
        $("#modalEmpleado").modal("show");
    };

    $scope.modalConceptosXml = function (archivo) {
        anticipoGastoRepository.getConceptosPorXml(archivo.idConceptoArchivo).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptoXmlList = response.data;

            }
        });
        $("#modalConceptosXml").modal("show");
    };

    $scope.salirSolicitud = function () {
        $location.path('/home');
    };

    $scope.openWizard = function () {
        anticipoGastoRepository.estatusAnticipoGasto().then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusAnticipo = res.data;
            } else {
                swal('Alto', 'Ocurrió un error al mostrar el proceso, inténtelo mas tarde', 'warning');
            }
        });
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

    $scope.EliminaConcepto = function (concepto) {
        swal({
            title: '¿Deseas elimiar el concepto?',
            text: 'Borrar concepto',
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
                $('#spinner-loading').modal('show');       
                anticipoGastoRepository.eliminaConcepto(concepto.id).then((res) => {
                    if (res.data[0].success == 1) {
                        swal('Anticipo de Saldo', 'Se actualizó la solicitud correctamente', 'success');
                        $('#spinner-loading').modal('hide');
                        $scope.getConceptosPorSolicitud();
                    } else {
                        $('#spinner-loading').modal('hide');
                        swal('Error','Ocurrió un error al eliminar el registro', 'error');
                    }
                });
            } else {
                swal('Cancelado', 'No se aplicaron los cambios', 'error');
                $('#spinner-loading').modal('hide');
            }
        });
    }
    $scope.actualizaPorcentaje = function (data) {
        $('#spinner-loading').modal('show');
       var conceptos = $scope.archivos;
       if(data.porcentaje != undefined)
       {
       var porc = 0;
        angular.forEach( conceptos, function (item, key) {
            if (item.idConceptoArchivo == data.idConceptoArchivo) {
                item.porcentaje = data.porcentaje;
                }
                porc += item.porcentaje;
        });
        if(porc > 100)
        { 
            swal('Cancelado', 'El porcentaje excede el 100% de el Concepto', 'error');
            $('#spinner-loading').modal('hide');
        }
        else
        {
            anticipoGastoRepository.actualizaDepartamento(data.idArchivoDepartamento, data.porcentaje).then((res) => {
                if (res.data[0].success == 1) {
                    $("#modalDepartamento").modal("hide");
                    swal('Anticipo de Saldo', 'Se actualizó la solicitud correctamente', 'success');
                    $('#spinner-loading').modal('hide');
                    //$scope.getArchivosPorConcepto($scope.idSolicitud, 1);
                    $scope.getArchivosPorReferencia($scope.idSolicitud, 1);
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Error','Ocurrió un error al actualizar el registro', 'error');
                }
            });
        }
        }
        else
        {   
            swal('Atención', 'El porcentaje debe ser mayor a 0', 'warning');
            $('#spinner-loading').modal('hide');
        }
    }

    $scope.traeBancos = function(){
        fondoFijoRepository.getBancos($scope.tramite.idCompania).then(function successCallback(response) {
          $scope.bancos = response.data;
      }, function errorCallback(response) {
      });
      }

      $scope.modalDescuento = function (data) {
        swal({
            title: 'Primero tiene que aprobar/rechazar todas las comprobaciones, sino se hará el descuento por todo lo que no este comprobado',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText:'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.dataDecuento = data;
                    $("#modalDescuento").modal("show");
                    document.getElementById('regresaEfec').enabled = false;
                    //$scope.tipoDescuento = $scope.tipoDescuento.filter(s => s.id != $scope.tipoDevolucion);
                }
            });
      
    };

    $scope.enviarDescuentoGral = async function () {
        if ($scope.descuentoSelected == undefined) {
            swal('Alto', 'Debes seleccionar el tipo de descuento', 'warning');
        } else {
            $("#modalDescuento").modal("hide");
            $("#loading").modal("show");
            var concepto = '';
            var ventaUnitario = 0;
            var agregarPoliza = false;
            concepto = '' + decimalToHexString(parseInt($scope.idSolicitud));
            var conceptos = 0;
            var conceptosContables = 0;
            for (var i = 0; i <  $scope.conceptosSolicitud.length; i++) {
                if($scope.conceptosSolicitud[i].salidaEfectivo != 0)
                {
                    conceptos += $scope.conceptosSolicitud[i].id;
                    conceptosContables += $scope.conceptosSolicitud[i].idConceptoContable;
                    ventaUnitario += $scope.conceptosSolicitud[i].importeAprobado;
                    agregarPoliza = true;
                }
            }
            concepto += '-' + decimalToHexString(conceptos);
            concepto += '-' + decimalToHexString(conceptosContables);
          
                    var estatusVales = await verificaArchivosEvidenciaGral($scope.idSolicitud);

                  for (var i = 0; i < estatusVales.length; i++) {
                    if( estatusVales[i].justifico == 0)
                    {
                    let monto = estatusVales[i].montoSolicitado - estatusVales[i].montoJustificado

                    $scope.AplicaPolizaCGFM(monto)

                    //TODO SE COMENTO ESTA SECCION EN LA IMPLEMENTACION DEL API
                    // if($scope.descuentoSelected == 1)
                    // {
                    //     tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 23, estatusVales[i].documentoConcepto, monto, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );                    
                    // }
                    // else if($scope.descuentoSelected == 2)
                    // {
                    //     tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 22, estatusVales[i].documentoConcepto, monto, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );
                    // }
                    // else
                    // {
                    //     tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 24, estatusVales[i].documentoConcepto, monto, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );                   
                    // }
                    
                    anticipoGastoRepository.actualizaConceptos($scope.idSolicitud).then(function (result) {
                        if (result.data.length > 0) {
                            $('#loading').modal('hide');
                        }
                    }); 

                    $scope.getAnticipoGastoItem()
                    $('#loading').modal('hide');
                    }
                  }
                    
                //}
      
        }  
    };

    $scope.enviarDescuento = async function () {
        if ($scope.descuentoSelected == undefined) {
            swal('Alto', 'Debes seleccionar el tipo de descuento', 'warning');
        } else {
            $("#modalDescuento").modal("hide");
            $("#loading").modal("show");
            var concepto = '';
            var ventaUnitario = 0;
            var agregarPoliza = false;
            concepto = '' + decimalToHexString(parseInt($scope.idSolicitud));
            var conceptos = 0;
            var conceptosContables = 0;
            for (var i = 0; i <  $scope.conceptosSolicitud.length; i++) {
                if($scope.conceptosSolicitud[i].salidaEfectivo == 0)
                {
                    conceptos += $scope.conceptosSolicitud[i].id;
                    conceptosContables += $scope.conceptosSolicitud[i].idConceptoContable;
                    ventaUnitario += $scope.conceptosSolicitud[i].importeAprobado;
                    agregarPoliza = true;
                }
            }
            concepto += '-' + decimalToHexString(conceptos);
            concepto += '-' + decimalToHexString(conceptosContables);
          
                    var estatusVales = await verificaArchivosEvidencia($scope.dataDecuento.id);
                    let monto = estatusVales == undefined ? 0 :  estatusVales.montoSolicitado - estatusVales.montoJustificado
                    var tipoProceso = false;
                    if($scope.descuentoSelected == 1)
                    {
                        //tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, $scope.tramite.idSucursal, 'CGFM', concepto, monto, $scope.idSolicitud)
                        tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 22,'AG-' + $scope.idSolicitud + '-' + $scope.dataDecuento.id + '-' + $scope.dataDecuento.idConceptoContable, monto, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );                    
                    }
                    else if($scope.descuentoSelected == 2)
                    {
                        //tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, $scope.tramite.idSucursal, 'CGFC', concepto, monto, $scope.idSolicitud)
                        tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 23,'AG-' + $scope.idSolicitud + '-' + $scope.dataDecuento.id + '-' + $scope.dataDecuento.idConceptoContable, monto, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );
                    }
                    else
                    {
                        //tipoProceso = await promiseInsertaDatosOrden($scope.tramite.idCompania, $scope.tramite.idSucursal, 'CGFD', concepto, monto, $scope.idSolicitud)
                        tipoProceso = await promiseInsertaDatos($rootScope.usuario.usu_idusuario, $scope.tramite.idSucursal, 24,'AG-' + $scope.idSolicitud + '-' + $scope.dataDecuento.id + '-' + $scope.dataDecuento.idConceptoContable, monto, $scope.tramite.dep_nombrecto,$scope.tramite.dep_nombrecto,$scope.idSolicitud,'' );                   
                    }
                    //     anticipoGastoRepository.conceptpSinComprobar($scope.dataDecuento.id,monto).then(function (result) {
                    //     if (result.data.length > 0) {
                    //         $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.idVale);
                    //         $('#loading').modal('hide');
                    //     }
                    // }); 
                    $scope.getAnticipoGastoItem()
                    $('#loading').modal('hide');
      
        }  
    };

      async function promiseInsertaDatos(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto,canal, id_perTra, banco, departamento) {
        return new Promise((resolve, reject) => {
            fondoFijoRepository.insertaPoliza(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto,canal, id_perTra, banco, departamento).then(function (result) {
                if (result.data.length > 0) {
                    resolve(true);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    async function promiseInsertaDatosOrden(idempresa,idsucursal,proceso,foliofondo,venta,id_perTra) {
        return new Promise((resolve, reject) => {
            fondoFijoRepository.insertPolizaOrden(idempresa,idsucursal,proceso,foliofondo,venta,id_perTra).then(function (result) {
                if (result.data.length > 0) {
                    if(result.data[0].Repuesta == 0)
                    {  resolve(true);}
                    else{resolve(false);}
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    async function guardaOrdenMasiva(sendData) {
        return new Promise((resolve, reject) => {
        fondoFijoRepository.insertOrdenMasiva(sendData).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
            else
            {reject('Error')}
        });
    });
    }

    async function verificaArchivosEvidencia(idTramiteConcepto) {
        return new Promise((resolve, reject) => {
            anticipoGastoRepository.verificaArchivosEvidencia(idTramiteConcepto).then(function (result) {
                if (result.data != undefined) {
                    resolve(result.data[0]);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }
    async function verificaArchivosEvidenciaGral(idTramiteConcepto) {
        return new Promise((resolve, reject) => {
            anticipoGastoRepository.verificaArchivosEvidenciaGral(idTramiteConcepto).then(function (result) {
                if (result.data != undefined) {
                    resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    function decimalToHexString(number)
    {
        if (number < 0)
        {
            number = 0xFFFFFFFF + number + 1;
        }

        return number.toString(16).toUpperCase();
    }

    function decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    
        while (hex.length < padding) {
            hex = "0" + hex;
        }
    
        return hex;
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


    $scope.frmModalConceptoGastos = function (idEstatus) {
        $scope.concepto.importeSolicitado = 0;
        $scope.getConceptosGasto();
        $scope.getAreaAfectacion();
        $scope.idtipoViaje = String(-1);
        $scope.disabledTipoViaje = true;
        $scope.disabledMonto = true;
        $scope.disabledConcepto = false;
        $scope.distancia = 50;
        $("#modalConceptoGastos").modal({backdrop: 'static', keyboard: false})
        $("#modalConceptoGastos").modal("show");
    };

    $scope.guardarConceptoPorSolicitud =async function () {
        if ($scope.idConceptoSeleccion <= 0) {
            swal('Anticipo de gasto', 'Debe seleccionar un concepto', 'warning');
        } else if ($scope.concepto.importeSolicitado <= 0) {
            swal('Concepto de viaje', 'Debe ingresar un importe', 'warning');
        } else {
            //var validaRet = await ValidaRetenciones($scope.selSucursal, $scope.idtipoComprobante.PAR_IDENPARA, $scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion);
            // if(validaRet[0].estatus == 1)
            // {
            $('#spinner-loading').modal('show');
            $scope.concepto.idEstatus = 1//$scope.tramite.idEstatus;
            $scope.concepto.idUsuario = $rootScope.user.usu_idusuario;
            $scope.concepto.idTipoProceso = 1
            $scope.concepto.distanciaKm = $scope.distancia//$scope.idTipoProceso;
            //$scope.concepto.idtipoComprobante =  $scope.idtipoComprobante.PAR_IDENPARA;
            //$scope.concepto.tipoIVA =  $scope.idtipoIVA.PAR_IDENPARA;
            //$scope.concepto.IVA =  $scope.ivaVale;
            //$scope.concepto.IVAretencion =  $scope.retencion;
            //$scope.concepto.ISRretencion =  $scope.ISRretencion;
            //$scope.concepto.subTotal =  $scope.subtotalVale;
            anticipoGastoRepository.guardarConceptoPorSolicitud($scope.concepto, $scope.idSolicitud, $scope.idtipoViaje).then((res) => {
                if (res != null && res.data != null && res.data.resppuesta != 0) {
                    swal('Concepto de viaje', 'Se agregó el concepto seleccionado correctamente', 'success');
                    $("#modalConceptoGastos").modal("hide");
                    $('#spinner-loading').modal('hide');
                    $scope.conceptosGastoPorSolicitud();
                    $scope.idConceptoSeleccion = 0;
                } else {
                    $('#spinner-loading').modal('hide');
                    swal('Concepto de viaje', 'Ocurrió un error al agregar el concepto', 'warning');
                }
            });
        // }
        // else
        // { swal("Atención",validaRet[0].mensaje , "warning"); }
        }
    };

    $scope.getConceptosGasto = function () {
        $scope.conceptoGastoList = [];
        anticipoGastoRepository.getconceptosGastoList($scope.tramite.idSolicitud,$scope.selEmpresa, $scope.selSucursal).then((response) => {
            if (response.data != null && response.data.length > 0) {
                $scope.conceptoGastoList = response.data;
            }
        });
    };

    $scope.getAreaAfectacion = function (accion) {
        $scope.areaAfectacionList = [];
        anticipoGastoRepository.getDepartametoAreaAfectacion($scope.selEmpresa, $scope.selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.areaAfectacionList = res.data;

                if(accion == 0 || accion === undefined){
                    $scope.areaAfectacionList.forEach(el => {
                        if(el.idDepartamento === $scope.tramite.idDepartamento){
                            $scope.selCNC_CONCEPTO1 = el.PAR_IDENPARA
                            $scope.asignarAreaAfectacion($scope.selCNC_CONCEPTO1)
                        }
                    })
                }
                if(accion == 1) {
                    var areaAfectacion = $scope.areaAfectacionList.filter(areaAfectacion => areaAfectacion.PAR_IDENPARA == $scope.concepto.areaAfectacion);
                    if (areaAfectacion.length > 0) {
                        $scope.concepto.areaDescripcion = areaAfectacion[0].descripcion;
                    }
                }
            }
        });
    }

    // $scope.getAreaAfectacion = function () {
    //     $scope.areaAfectacionList = [];
    //     anticipoGastoRepository.getAreaAfectacion($scope.selEmpresa, $scope.selSucursal).then((res) => {
    //         if (res != null && res.data != null && res.data.length > 0) {
    //             $scope.areaAfectacionList = res.data;
    //         }
    //     });
    // };

    $scope.asignarConcepto = function (idConcepto) {
        $scope.idConceptoSeleccion = idConcepto;
        $scope.concepto.id = idConcepto;
        $scope.disabledTipoViaje = false;
        $scope.mostrarDistancia = false;

        
        var concepto = $scope.conceptoGastoList.filter(concepto => concepto.id == idConcepto);
        if (concepto.length > 0) {
            $scope.concepto.politicaGasto = concepto[0].politicaGasto;
            $scope.idConceptoSeleccionContable  = concepto[0].idConceptoContable;
            if ($scope.idConceptoSeleccion != null && $scope.idConceptoSeleccion > 0 && $scope.selCNC_CONCEPTO1 != null && $scope.selCNC_CONCEPTO1 != '') {
                $scope.concepto.importeSolicitado = 0;
                $scope.conceptoGastoList.forEach(el => {
                    if(el.concepto === 'GTOS DE VIAJE GASOLINA'){
                        if(el.id === idConcepto){
                            $scope.selConceptoGasolina = true;
                        }else{
                            $scope.selConceptoGasolina = false;
                        }
                    }

                    if(el.id === idConcepto){

                        if(el.concepto === 'GTOS DE VIAJE GASOLINA' || el.concepto === 'GTOS DE VIAJE CASETAS' || el.concepto === 'GTOS DE VIAJE RENTA AUTOMOVIL' || el.concepto.indexOf('TRANSPORTACIÓN')>0 || el.concepto.indexOf('TRANSPORTACIÓN')>0){
                            $scope.mostrarDistancia = true;
                        }else{
                            $scope.mostrarDistancia = false;
                        }             
                    }
                });
                $scope.getCuentaContable();
            }
        }

        if ($scope.disabledTipoViaje === false && $scope.idtipoViaje > -1) {
            $scope.ObtineMaximoTabulador()
        }
    }

    $scope.getCuentaContable = function () {
        var data = {
            idEmpresa: $scope.selEmpresa,
            idSucursal: $scope.selSucursal,
            CNC_CONCEPTO1: $scope.selCNC_CONCEPTO1,
            CNC_CONCEPTO2: $scope.idConceptoSeleccionContable
        };
        anticipoGastoRepository.getCuentaContable(data).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.concepto.CNC_CUENTA = res.data[0].CNC_CUENTA
                $scope.concepto.numeroCuenta = res.data[0].CNC_CUENTA;
            }
        });
    };


    $scope.TipoViaje = function () {
        console.log($scope.idtipoViaje)
        $scope.disabledMonto = false;
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

                    anticipoGastoRepository.validaLeyDeducibilidad(el.id, $scope.tramite.kilometro).then(res => {
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

    $scope.ObtineMaximoTabulador = function () {

        var usuario = $scope.empleados !== undefined && $scope.empleados.length > 0 ? $scope.empleados[0].IdPersona : $scope.tramite.idPersona
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
            var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    
            //$scope.diasViaje = DateDiff.inDays(new Date($scope.tramite.fechaInicio) , new Date($scope.tramite.fechaFin) )
            $scope.diasViaje = DateDiff.inDays(new Date($scope.tramite.fechaInicio.replace(pattern,'$3-$2-$1')) , new Date($scope.tramite.fechaFin.replace(pattern,'$3-$2-$1')) )
    
            $scope.diasViaje =   $scope.diasViaje === 0 ? 1 : $scope.diasViaje
    
                console.log('parametro tope: ', res.data)
                if (res.data[0].estatus === 0) {
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
    
                                $scope.montoMaximoGV = res.data[0].montoTope * $scope.diasViaje;
    
                                if (($scope.disabledTipoViaje === false && $scope.idtipoViaje > -1) || ($scope.concepto.importeSolicitado > 0)) {
                                    $scope.validaMontoMaximo();
                                }
    
                            }
                        });
                } else {
                    $scope.montoMaximoGV = res.data[0].montoTope * $scope.diasViaje;
                }
    
            })
        }

    }

    $scope.obtieneMaximoGasolina = function(){
        var autorizado = 0;
        anticipoGastoRepository.PrecioGasolina().then(resp =>{
            autorizado = resp.data[0].autorizadoPorKilometro
            $scope.montoMaximoGV = Number($scope.distancia  * autorizado).toFixed(2);
        })
    }

    $scope.validaMontoMaximo = function () {

        let valor = 0;

        if ($scope.concepto.importeSolicitado > 0) {

            valor = $scope.concepto.importeSolicitado.toFixed(2)
            $scope.concepto.importeSolicitado = Number(valor)

            if ($scope.concepto.importeSolicitado > $scope.montoMaximoGV) {
                $scope.concepto.importeSolicitado = Number(Number($scope.montoMaximoGV).toFixed(2));
                $("#montoEdit").val(`${$scope.concepto.importeSolicitado}`);
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

    $scope.asignarAreaAfectacion = function (selCNC_CONCEPTO1) {
        if (selCNC_CONCEPTO1 != null && selCNC_CONCEPTO1 != '') {
            $scope.disabledConcepto = false;
            $scope.selCNC_CONCEPTO1 = selCNC_CONCEPTO1;
            $scope.concepto.selCNC_CONCEPTO1 = selCNC_CONCEPTO1;
            if ($scope.idConceptoSeleccion != null && $scope.idConceptoSeleccion > 0 && $scope.selCNC_CONCEPTO1 != null && $scope.selCNC_CONCEPTO1 != '') {

                $scope.concepto.importeSolicitado = 0;
               
                $scope.getCuentaContable();
            }
        } else {
            $scope.selCNC_CONCEPTO1 = '';
        }
    }

    $scope.eliminarConcepto = function (concepto) {
        $('#spinner-loading').modal('show');
        anticipoGastoRepository.eliminarConcepto(concepto.id).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.conceptosGastoPorSolicitud();
                swal('Concepto de gasto', 'Se elimino el concepto correctamente', 'success');
                $('#spinner-loading').modal('hide');
            } else {
                $('#spinner-loading').modal('hide');
                swal('eliminarConcepto', 'Ocurrió un error al eliminar le concepto', 'warning');
            }
        });
    };

    $scope.cierraNotificacion = function(){

        var tramitesEnRevision = 0
        var link;

        // $scope.conceptosSolicitud.forEach(element => {
        //     if(element.idEstatus === 1){
        //         tramitesEnRevision += 1
        //     }
        // })

        for( var i = 0; i < $scope.conceptosSolicitud.length; i++){
            if($scope.conceptosSolicitud[i].idEstatus !== 1){
                tramitesEnRevision += 1
            }
        }

        if(tramitesEnRevision === $scope.conceptosSolicitud.length){
            //TODO: CERRAR NOTIFICACION
            
            anticipoGastoRepository.updNotificacionParametros($scope.idSolicitud).then(resp => {
                console.log(resp)
                if(resp.data[0].idAprobacion > 0){
                //  link =   global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + resp.data[0].idAprobacion + '&identificador=' + resp.data[0].identificador + '&respuesta=1'
                  link = `${global_settings.urlApiNoty}api/notification/approveNotificationMailJerarquizado/?idAprobacion=${resp.data[0].idAprobacion}&identificador=${resp.data[0].identificador }&idUsuario=${resp.data[0].idUsuarioAuto}&respuesta=1`
                  console.log('link ', link)
                  window.open(link,'_self');
                }
            })
        }

    }

    $scope.clickLink = function(link) {
        var cancelled = false;
    
        if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0,
                false, false, false, false,
                0, null);
            cancelled = !link.dispatchEvent(event);
        }
        else if (link.fireEvent) {
            cancelled = !link.fireEvent("onclick");
        }
    
        if (!cancelled) {
            window.location = link.href;
        }
    }

    async function promiseTransferencia(idempresa,idSucursal, cuentaOrigen, cuentaDestino, monto, idUsuario, referencia, idOrigenReferencia) {
        return new Promise((resolve, reject) => {
            aprobarFondoRepository.transferenciaCaja(idempresa,idSucursal, cuentaOrigen, cuentaDestino, monto, idUsuario, referencia, idOrigenReferencia).then(function (result) {
                if (result.data.length > 0) {
                resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }
    
    async function promisesaveTransferencia(idPersona, idTramite, idTransferencia, solicitud) {
        return new Promise((resolve, reject) => {
            aprobarFondoRepository.saveTransferencia(idPersona, idTramite, idTransferencia, solicitud).then(function (result) {
                if (result.data.length > 0) {
                resolve(result.data);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    function ObtieneCuentaPersonal() {
        anticipoGastoRepository.datosTramitesGastosViaje($scope.tramite.idSolicitud).then( resp => {
            console.log(resp.data)
            anticipoGastoRepository.ObtieneCuentaEmpleado(resp.data[0].rfc).then(resp => {
                console.log('empleado: ', resp.data)
                console.log('idempresa: ',$scope.tramite.idCompania)
                $scope.infoWeb = resp.data.data;
            })
        })
    }

    async function promiseGetReferencia(data) {
        return new Promise((resolve, reject) => {
            aprobarFondoRepository.ObtieneReferencia(data).then(function (result) {
                if (result.data.length > 0) {
                resolve(result.data[0].referencia);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    $scope.archivoTemporal = [];
    $scope.modalDeMas = function( archivo ){
        $scope.archivoTemporal = archivo;
        $("#modalDeMas").modal('show');
    }

    $scope.modalDeMasHide = function(){
        $("#modalDeMas").modal('hide');
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

    function EnviaCorreoSolicitante(){

        let usuarioSolicitante = $scope.empleadoSolicitante;

        let html1= ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
        <div>
            Estimado usuario(a)  ${$scope.empleadoSolicitante}:  
            <p>Es necesario que entres al tramite número ${$scope.tramite.idSolicitud} en la opción <strong>modificar Solicitud</strong>, una vez dentro, favor de descargar el vale para caja, firmarlo, escanearlo y registrarlo en el sistema,  para poder continuar con tu solicitud.</p>
        </div>`;
        $scope.sendMail($scope.tramite.correoSolicitante, 'Presupuesto autorizado pendiente de subir, Anticipo de Gasto', html1);
    }

    function EnviaCorreoRechazoComprobacion(){

        let usuarioSolicitante = $scope.empleadoSolicitante;
        let concepto = $scope.conceptosSolicitud.filter(x=>x.idConceptoContable === $scope.archivos[0].idConceptoContable)[0]

        let html1= ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
        <div>
            Estimado usuario(a)  ${$scope.empleadoSolicitante}:  
            <p>La comprobación para el concepto ${concepto.concepto} con un importe comprobado por $${formatMoney($scope.archivos[0].total)} ha sido rechazada, es necesario que vuelva a hacer la comprobación.</p>
        </div>`;
        $scope.sendMail($scope.tramite.correoSolicitante, 'Comprobación gastos de viaje rechazada', html1);
    }

    $scope.OrdenMasivaSalidaAnticipo = function( parametros ){
        anticipoGastoRepository.OrdenMasivaCabecero(parametros).then( (result) =>{
            if( result.data[0].resultado == 0 ){
                // swal("Orden de Anticipo de Gasto","Ocurrio un problema al intentar guardar la order de anticipo, intenta de nuevo mas tarde.","warning");
                console.log("Ocurrio un problema al intentar guardar la order de anticipo, intenta de nuevo mas tarde.");
            }
            else if( result.data[0].resultado == -1 ){
                // swal("Orden de Anticipo de Gasto","Ya existe una orden de compra para este trámite, favor de validar.","warning");
                console.log("Ya existe una orden de compra para este trámite, favor de validar.");
            }
            else{
                // swal({
                //     title: "Orden de Anticipo de Gasto",
                //     text: "Se ha creado la Orden de compra con Anticipo para Gasto de Viaje de forma satisfactoria.",
                //     type: "success"
                //     }, function() {
                //         console.log('Ok');
                //     });
                console.log("Se ha creado la Orden de compra con Anticipo para Gasto de Viaje de forma satisfactoria.");
                // swal("Orden de Anticipo de Gasto","Se ha creado la Orden de compra con Anticipo para Gasto de Viaje de forma satisfactoria.","success");
            }
        });
    }

    $scope.bodyTramitesCuenta = function( tramite, data ){
        var html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                    <div>
                        <h3>Salida de efectivo de gastos de más</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="text-align: center;" colspan="2"><strong>Detalle de la solicitud</strong></td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Tr&aacute;mite:</span></td>
                                    <td>` + tramite + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                    <td>` + data.solicitante + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                    <td>` + data.empresa + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                                    <td>` + data.sucursal + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Departamento:</span></td>
                                    <td>` + data.departamento + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Viaje:</span></td>
                                    <td>` + data.viaje + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Motivo:</span></td>
                                    <td>` + data.motivo + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Fecha:</span></td>
                                    <td>` + data.fecha + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Concepto:</span></td>
                                    <td>` + data.concepto + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Monto aprobado:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.aprobacion ) + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Monto de Comprobación:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.comp_aprobado ) + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Gasto de más aprobado:</span></td>
                                    <td>$ ` + $scope.formatNumber( data.importe ) + `</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;

        return html;
    } 

    $scope.formatNumber = function(n) {
        n = n.toFixed(2)
        n = n.toString()
         while (true) {
           var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
           if (n == n2) break
           n = n2
         }
         return n
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

        return total
     }

     $scope.AplicaPolizaCGFM = async function(monto){

        let apiJson1Detalle = structuredClone(apiJsonBPRO1detalle)
        apiJson1Detalle.IdEmpresa = $scope.tramite.idCompania
        apiJson1Detalle.IdSucursal = $scope.tramite.idSucursal
        apiJson1Detalle.Tipo = 2

        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Proceso = `CGFM${$scope.tramite.complementoPoliza}`
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].DocumentoOrigen = $scope.tramite.documentoConcepto
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Canal = `CGFM${$scope.tramite.complementoPoliza}`
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Documento = $scope.tramite.documentoConcepto
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Referencia2 = $scope.tramite.documentoConcepto

        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= $scope.tramite.documentoConcepto
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '0'
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto= $scope.tramite.dep_nombrecto
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Origen = $scope.tramite.cuentaEnvio
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.tramite.idPersona
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado =  $scope.tramite.documentoConcepto
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario =  monto
        apiJson1Detalle.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = $scope.tramite.documentoConcepto


        let datalog = structuredClone(datalogAPI)
        datalog.idSucursal = $scope.tramite.idSucursal
        datalog.id_perTra = $scope.tramite.idSolicitud
        datalog.opcion = 1
        
        let AuthToken;
        AuthToken = await promiseAutBPRO();

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
            datalog.ordenCompra = resPoliza.Folio

            respUpdate = await promiseActualizaTramite($scope.tramite.idSolicitud,'CGFM', $scope.tramite.documentoConcepto , 0,'',datalog.consPol,datalog.mesPol,datalog.anioPol)

            $scope.archivo.idEstatus = $scope.idEstatusConcepto;
            

            $('#spinner-loading').modal('hide');

            swal({
                title:"Aviso",
                type:"info",
                width: 1000,
                text:`La aprobación generó la siguiente póliza

                Año póliza: ${datalog.anioPol}
                Mes póliza: ${datalog.mesPol}
                Cons póliza: ${datalog.consPol}
                Tipo póliza: ${datalog.tipoPol}
                `,
                showConfirmButton: true,
                showCloseButton:  false,
                timer:10000,
                timerProgressBar: true
            })

            $scope.getConceptosPorSolicitud();
            
        }else{

            $('#spinner-loading').modal('hide');

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
     }

});