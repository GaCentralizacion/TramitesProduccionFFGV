var anticipoGasto = global_settings.urlCORS + 'api/anticipoGasto/';
var newTramite = global_settings.urlCORS + 'api/nuevoTramite/';

registrationModule.factory('anticipoGastoRepository', function ($http) {
    return {
        getAnticipoGastoById: (idAnticipoGasto, idTipoProceso) => {
            return $http({
                url: anticipoGasto + 'anticipoGastoById/',
                method: "GET",
                params: {
                    idAnticipoGasto: idAnticipoGasto,
                    idTipoProceso: idTipoProceso,
                    urlParametro: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardarTramite: (data) => {
            return $http({
                url: anticipoGasto + 'guardarTramite/',
                method: "POST",
                data: {
                    idUsuario: data.idUsuario,
                    idTramite: data.idTramite,
                    idFormaPago: data.idFormaPago,
                    idDepartamento: data.idDepartamento,
                    observaciones: data.observaciones,
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal,
                    idEstatus: data.idEstatus,
                    devTotal: data.importe,
                    idCliente: data.idCliente,
                    fechaInicio: data.fechaInicio,
                    fechaFin: data.fechaFin,
                    concepto: data.concepto,
                    motivo: data.motivo,
                    nombreCliente: data.nombreCliente,

                    cuentaBancaria: data.cuentaBancaria,
                    numeroCLABE: data.numeroCLABE,
                    cveBanxico: data.cveBanxico,
                    kilometro: data.kilometro
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        actualizaTramite: (data) => {
            return $http({
                url: anticipoGasto + 'actualizarTramite/',
                method: "POST",
                data: {
                    idSolicitud: data.idSolicitud,
                    idDepartamento: data.idDepartamento,
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal,
                    fechaInicio: data.fechaInicio,
                    fechaFin: data.fechaFin,
                    concepto: data.concepto,
                    motivo: data.motivo,
                    nombreCliente: data.nombreCliente,
                    cuentaBancaria: data.cuentaBancaria,
                    numeroCLABE: data.numeroCLABE,
                    cveBanxico: data.cveBanxico,
                    kilometro: data.kilometro
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarEmpleado: (data) => {
            return $http({
                url: anticipoGasto + 'guardarEmpleado/',
                method: "POST",
                data: {
                    idEstatus: data.idEstatus,
                    idEmpleado: data.idEmpleado,
                    nombreEmpleado: data.nombreEmpleado,
                    idEstatus: data.idEstatus,
                    idTramiteDevolucion: data.idTramiteDevolucion,
                    idPersona: data.idPersona
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminarEmpleado: (idTramiteEmpleado) => {
            return $http({
                url: anticipoGasto + 'eliminaEmpleado/',
                method: "POST",
                data: {
                    idTramiteEmpleado: idTramiteEmpleado
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getEmpleadosPorIdSolicitud: (idTramiteDevolucion) => {
            return $http({
                url: anticipoGasto + 'empleadosPorIdSolicitud/',
                method: "GET",
                params: {
                    idTramiteDevolucion: idTramiteDevolucion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        conceptosGastoPorSolicitud: (idSolicitud, idTipoProceso) => {
            return $http({
                url: anticipoGasto + 'conceptosGastoPorSolicitud/',
                method: "GET",
                params: {
                    idSolicitud: idSolicitud,
                    idTipoProceso: idTipoProceso
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getconceptosGastoList: (idSolicitud, idEmpresa, idSucursal) => {
            return $http({
                url: anticipoGasto + 'conceptosGastoList/',
                method: "GET",
                params: {
                    idSolicitud: idSolicitud,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardarConceptoPorSolicitud: (data, idSolicitud, tipoViaje) => {
            return $http({
                url: anticipoGasto + 'guardarConceptoPorSolicitud/',
                method: "POST",
                data: {
                    idEstatus: data.idEstatus,
                    idConceptoContable: data.conceptoContable,
                    importe: data.importeSolicitado,
                    comentario: data.comentario,
                    idUsuario: data.idUsuario,
                    idTipoProceso: data.idTipoProceso,
                    idSolicitud: idSolicitud,
                    areaAfectacion: data.selCNC_CONCEPTO1,
                    numeroCuenta: data.numeroCuenta,
                    idTipoViaje: tipoViaje,
                    distancia: data.distanciaKm
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        actualizaEstatusTramite: (idSolicitud, idTipoProceso) => {
            return $http({
                url: anticipoGasto + 'actualizaEstatusTramite/',
                method: "POST",
                data: {
                    idSolicitud: idSolicitud,
                    idTipoProceso: idTipoProceso
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        actualizaImporteConcepto: (data, idUsuario, tipoViaje) => {
            return $http({
                url: anticipoGasto + 'actualizaImporteConcepto/',
                method: "POST",
                data: {
                    idTramiteConcepto: data.id,
                    importe: data.importeSolicitado,
                    idEstatus: data.idEstatus,
                    comentario: data.comentario,
                    idUsuario: idUsuario,
                    idTipoProceso: data.idTipoProceso,
                    idTipoViaje: tipoViaje,
                    distanciaKm: data.distancia
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminarConcepto: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'eliminarConcepto/',
                method: "POST",
                data: {
                    idTramiteConcepto: idTramiteConcepto
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarRechazarEmpleado: (idTramiteEmpleado, idEstatus, idSolicitud) => {
            return $http({
                url: anticipoGasto + 'aprobarRechazarEmpleado/',
                method: "POST",
                data: {
                    idTramiteEmpleado: idTramiteEmpleado,
                    idEstatus: idEstatus,
                    idSolicitud: idSolicitud
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarRechazarConcepto: (data, idUsuario, idTipoProceso, idSolicitud) => {
            if (idTipoProceso == 1) {
                data.importeAprobado = data.importeSolicitado;
            };
            return $http({
                url: anticipoGasto + 'aprobarRechazarConcepto/',
                method: "POST",
                data: {
                    idTramiteConcepto: data.id,
                    idEstatus: data.idEstatus,
                    importe: data.importeAprobado,
                    comentario: data.comentarioComprobacion,
                    idUsuario: idUsuario,
                    idTipoProceso: idTipoProceso,
                    idSolicitud: idSolicitud
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarRechazarArchivo: (data) => {
            return $http({
                url: anticipoGasto + 'aprobarRechazarArchivo/',
                method: "POST",
                data: {
                    idConceptoArchivo: data.idConceptoArchivo,
                    importe: data.importe,
                    idEstatus: data.idEstatus,
                    idUsuario: data.idUsuario,
                    idTramiteConcepto: data.idTramiteConcepto,
                    idTipoProceso: data.idTipoProceso,
                    comentario: data.comentario,
                    idSolicitud: data.idSolicitud,
                    compNoAutorizado: data.compNoAutorizado
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobacionSolicitud: (idSolicitud, idEstatus) => {
            return $http({
                url: anticipoGasto + 'aprobacionSolicitud/',
                method: "POST",
                data: {
                    idSolicitud: idSolicitud,
                    idEstatus: idEstatus
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        actualizaDatosArchivo: (idConceptoArchivo, folioDocumento, iva, total) => {
            return $http({
                url: anticipoGasto + 'actualizaDatosArchivo/',
                method: "POST",
                data: {
                    idConceptoArchivo: idConceptoArchivo,
                    folioDocumento: folioDocumento,
                    iva: iva,
                    total: total
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getConceptosPorXml: (idConceptoArchivo) => {
            return $http({
                url: anticipoGasto + 'conceptosPorXml/',
                method: "GET",
                params: {
                    idConceptoArchivo: idConceptoArchivo,
                    urlParametro: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getArchivosPorConcepto: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'archivosPorConcepto/',
                method: "GET",
                params: {
                    idTramiteConcepto: idTramiteConcepto,
                    urlParametro: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getArchivosPorConceptoGV: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'archivosPorConceptoGV/',
                method: "GET",
                params: {
                    idTramiteConcepto: idTramiteConcepto,
                    urlParametro: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getArchivosPorConceptoComp: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'archivosPorConceptoComp/',
                method: "GET",
                params: {
                    idTramiteConcepto: idTramiteConcepto,
                    urlParametro: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        saveInfoDocumentos: (data) => {
            return $http({
                url: anticipoGasto + 'saveInfoDocumentos/',
                method: "POST",
                data: {
                    idTramiteConcepto: data.idDocumento,
                    idTramite: data.idTramite,
                    idPerTra: data.idPerTra,
                    saveUrl: data.saveUrl,
                    idUsuario: data.idUsuario,
                    extensionArchivo: data.extensionArchivo,
                    nombreArchivo: data.nombreArchivo,
                    archivo: data.archivo,
                    idProceso: data.idProceso,
                    tipoDevolucion: data.tipoDevolucion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminarInfoDocumentos: (idConceptoArchivo, nombre, idTramiteConcepto, urlServerDoctos) => {
            return $http({
                url: anticipoGasto + 'eliminarInfoDocumentos/',
                method: "POST",
                data: {
                    idConceptoArchivo: idConceptoArchivo,
                    nombre: nombre,
                    idTramiteConcepto: idTramiteConcepto,
                    urlServerDoctos: urlServerDoctos
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveDocumentos: (data) => {
            return $http({
                url: anticipoGasto + 'saveDocumentos/',
                method: "POST",
                data: {
                    idTramiteConcepto: data.idDocumento,
                    idTramite: data.idTramite,
                    idPerTra: data.idPerTra,
                    saveUrl: data.saveUrl,
                    idUsuario: data.idUsuario,
                    extensionArchivo: data.extensionArchivo,
                    nombreArchivo: data.nombreArchivo,
                    archivo: data.archivo,
                    idArchivo: data.idArchivo,
                    consecutivo: data.consecutivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarComentarioArchivo: (data) => {
            return $http({
                url: anticipoGasto + 'guardarComentarioArchivo/',
                method: "POST",
                data: {
                    idConceptoArchivo: data.idConceptoArchivo,
                    idTramiteConcepto: data.idTramiteConcepto,
                    comentario: data.comentario,
                    importe: data.importe,
                    idUsuario: data.idUsuario,
                    idTipoProceso: data.idTipoProceso,
                    fecha: data.fecha
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarImporteConcepto: (data) => {
            return $http({
                url: anticipoGasto + 'guardarImporteConcepto/',
                method: "POST",
                data: {
                    importe: data.importe,
                    idUsuario: data.idUsuario,
                    idTipoProceso: data.idTipoProceso,
                    idTramiteConcepto: data.idTramiteConcepto,
                    importeIva: data.importeIva,
                    folio: data.folio,
                    fecha: data.fecha,
                    idConceptoArchivo: data.idConceptoArchivo,
                    xmlConceptos: data.xmlConceptos,
                    UUID: data.UUID,
                    rfc: data.rfc,
                    mesCorriente: data.mesCorriente,
                    tipoNotificacion: data.tipoNotificacion,
                    estatusNotificacion: data.estatusNotificacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDepartamentosPorArchivo: (idConceptoArchivo) => {
            return $http({
                url: anticipoGasto + 'departamentosPorArchivo/',
                method: "GET",
                params: {
                    idConceptoArchivo: idConceptoArchivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },        
        getAreaAfectacion: (idEmpresa, idSucursal) => {
            return $http({
                url: anticipoGasto + 'areaAfectacion/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCuentaContable: (data) => {
            return $http({
                url: anticipoGasto + 'cuentaContable/',
                method: "GET",
                params: {
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal,
                    CNC_CONCEPTO1: data.CNC_CONCEPTO1,
                    CNC_CONCEPTO2: data.CNC_CONCEPTO2
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardarArchivoDepartamento: (idDepartamento, porcentaje, idConceptoArchivo) => {
            return $http({
                url: anticipoGasto + 'guardarArchivoDepartamento/',
                method: "POST",
                data: {
                    idDepartamento: idDepartamento,
                    porcentaje: porcentaje,
                    idConceptoArchivo: idConceptoArchivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminaDepartamentoArchivo: (idArchivoDepartamento) => {
            return $http({
                url: anticipoGasto + 'eliminaDepartamentoArchivo/',
                method: "POST",
                data: {
                    idArchivoDepartamento: idArchivoDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        estatusAnticipoGasto: () => {
            return $http({
                url: anticipoGasto + 'estatusAnticipoGasto/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminaConcepto: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'eliminaConcepto/',
                method: "GET",
                params: {
                    idTramiteConcepto: idTramiteConcepto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaDepartamento: (idArchivoDepartamento, porcentaje) => {
            return $http({
                url: anticipoGasto + 'actualizaDepartamento/',
                method: "GET",
                params: {
                    idArchivoDepartamento: idArchivoDepartamento, porcentaje: porcentaje
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        salidaEfectivoConcepto: (idTramitePersona, idSalida, bancoSalida,bancoEntrada, numCuentaSalida, cuentaContableSalida, numCuentaEntrada, cuentaContableEntrada, ventaUnitario) => {
            return $http({
                url: anticipoGasto + 'SalidaEfectivoConcepto/',
                method: "GET",
                params: {
                    idTramitePersona: idTramitePersona, 
                    idSalida: idSalida,
                    bancoSalida:bancoSalida, 
                    bancoEntrada:bancoEntrada,
                    numCuentaSalida: numCuentaSalida,
                    cuentaContableSalida: cuentaContableSalida,
                    numCuentaEntrada: numCuentaEntrada,
                    cuentaContableEntrada: cuentaContableEntrada,
                    ventaUnitario: ventaUnitario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        verificaArchivosEvidencia: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'verificaArchivosEvidencia/',
                method: "GET",
                params: {idTramiteConcepto:idTramiteConcepto},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        verificaArchivosEvidenciaGral: (idTramiteConcepto) => {
            return $http({
                url: anticipoGasto + 'verificaArchivosEvidenciaGral/',
                method: "GET",
                params: {idTramiteConcepto:idTramiteConcepto},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getRfcPorNombreRazon: (nombreRazon) => {
            return $http({
                url: anticipoGasto + 'getRfcPorNombreRazon/',
                method: "GET",
                params: {
                    nombreRazon: nombreRazon
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        
        getBuscarAutorizador: (idEmpresa, idSucursal, idDepartamento, idUsuario, tipoNotificacion) => {
            return $http({
                url: anticipoGasto + 'buscarAutorizador/',
                method: "GET",
                params: {
                    idEmpresa:idEmpresa,
                    idSucursal:idSucursal,
                    idDepartamento:idDepartamento,
                    idUsuario:idUsuario,
                    tipoNotificacion: tipoNotificacion
                },
											
				  
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getArchivosPorReferencia: (idReferencia) => {
            return $http({
                url: anticipoGasto + 'archivosPorReferencia/',
                method: "GET",
                params: {
                    idReferencia: idReferencia,
                    urlParametro: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        datosEmpresa: (idEmpresa) => {
            return $http({
                url: anticipoGasto + 'datosEmpresa/',
                method: "GET",
                params: {idEmpresa: idEmpresa},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaConceptos: (idsolicitud) => {
            return $http({
                url: anticipoGasto + 'ActualizaConceptos/',
                method: "POST",
                data: {
                    idsolicitud: idsolicitud
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBuscarPersona: (idPersona, esid, esRFC, esnombre, nombre) => {
            return $http({
                url: anticipoGasto + 'buscarPersona/',
                method: "GET",
                params: {
                    idPersona:idPersona,
                    esid: esid,
                    esRFC: esRFC,
                    esnombre,
                    nombre: nombre
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getRevisorComp: (idPertra) => {
            return $http({
                url: anticipoGasto + 'revisorComp/',
                method: "GET",
                params: { 
                    idPertra:idPertra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        parametrosGvByUsuario: (idUsuario,
            nacional,
            concepto) => {
            return $http({
                url: anticipoGasto + 'parametrosGvByUsuario/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    nacional: nacional,
                    concepto: concepto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updNotificacionParametros: (idTramite) => {
            return $http({
                url: anticipoGasto + 'updNotificacionParametros/',
                method: "GET",
                params: {
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        loadDocument:(idPerTra, idTramite) => {
            return $http({
                url: `${anticipoGasto}loadDocument`,
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra,
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveEdoCuentas:(idDocumento,idTramite,idPerTra ) => {
            return $http({
                url: `${anticipoGasto}saveEdoCuentas`,
                method: "GET",
                params: {
                    idDocumento: idDocumento,
                    idTramite: idTramite,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        valeParaCaja: function(data){
            return $http({
                url: `${jsReport}api/report`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' ,
                data:data
            });

        },
        datosTramitesGastosViaje:function(idPertra){
            return $http({
                url: `${anticipoGasto}datosTramitesGastosViaje`,
                method: "GET",
                params: {
                    'idPerTra': idPertra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        ObtieneCuentaEmpleado:function(rfc){
            return $http({
                url: `${anticipoGasto}ObtieneCuentaEmpleado`,
                method: "GET",
                params: {
                    'rfc': rfc
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        actualizaEstatusNotificacion:function(idconceptoArchivo, tipo){
            return $http({
                url: `${anticipoGasto}actualizaEstatusNotificacion`,
                method: "GET",
                params: {
                    idconceptoArchivo: idconceptoArchivo,
                    tipo: tipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        actualizaEstatusNotificacionDeMas:function(idconceptoArchivo, tipo, monto ){
            return $http({
                url: `${anticipoGasto}actualizaEstatusNotificacionDeMas`,
                method: "GET",
                params: {
                    idconceptoArchivo: idconceptoArchivo,
                    tipo: tipo,
                    monto: monto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        BancoByCLABE: (clabe) => {
            return $http({
                url: newTramite + 'BancoByCLABE/',
                method: "GET",
                params: {
                    clabe: clabe
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        GetDataBancoByIdPersona: (IdPersona, IdEmpresa) => {
            return $http({
                url: newTramite + 'GetDataBancoByIdPersona/',
                method: "GET",
                params: {
                    IdPersona: IdPersona,
                    IdEmpresa: IdEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        GetDataByCuenta: (Cuenta, IdEmpresa) => {//GetDataByCuenta
            return $http({
                url: newTramite + 'GetDataByCuenta/',
                method: "GET",
                params: {
                    Cuenta: Cuenta,
                    IdEmpresa: IdEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        GuardaBanco: (parametros) => {
            return $http({
                url: newTramite + 'GuardaBanco/',
                method: "GET",
                params: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        CuentaByPersona: (IdPersona) => {
            return $http({
                url: newTramite + 'CuentaByPersona/',
                method: "GET",
                params: {
                    IdPersona:IdPersona
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        EstatusCuenta: (cuentaBancaria) => {
            return $http({
                url: newTramite + 'EstatusCuenta/',
                method: "GET",
                params: {
                    cuentaBancaria: cuentaBancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        CuentaByPersona: (idPersona) => {
            return $http({
                url: newTramite + 'CuentaByPersona/',
                method: "GET",
                params: {
                    idPersona: idPersona
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        IdBproByUser: (idPersona) => {
            return $http({
                url: newTramite + 'IdBproByUser/',
                method: "GET",
                params: {
                    IdPersona: idPersona
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        creacionTramiteEntregaEfectivo: (parametro) => {
            return $http({
                url: newTramite + 'creacionTramiteEntregaEfectivo/',
                method: "GET",
                params: parametro,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        perTraPadre: (perTra) => {
            return $http({
                url: newTramite + 'perTraPadre/',
                method: "GET",
                params: {
                    perTra: perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        GetCorreosTesoreria: () => {
            return $http({
                url: anticipoGasto + 'GetCorreosTesoreria/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        SalidaEfectivoEstatus: ( perTra, idTramiteTransferencia, idCuenta ) => {
            return $http({
                url: anticipoGasto + 'SalidaEfectivoEstatus/',
                method: "GET",
                params: {
                    perTra: perTra,
                    idTramiteTransferencia: idTramiteTransferencia,
                    idCuenta: idCuenta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDataReporte:function(idEmpresa, idSucursal, idDepartamento, idPerTra, idToken, fecha, idUsuario){
            return $http({
                url: `${anticipoGasto}getDataReporte`,//newTramite + 'getDataReporte/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'idEmpresa':idEmpresa,
                    'idSucursal':idSucursal,
                    'idDepartamento':idDepartamento,
                    'idPerTra':idPerTra
                  
                }

            });
        },
        getDataReporteToken:function(idEmpresa, idSucursal, idDepartamento, idPerTra, idToken, fecha, idUsuario){
            return $http({
                url: `${anticipoGasto}getDataReporteToken`,//newTramite + 'getDataReporte/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'idEmpresa':idEmpresa,
                    'idSucursal':idSucursal,
                    'idDepartamento':idDepartamento,
                    'idPerTra':idPerTra,
                    'idToken':idToken,
                    'fecha':fecha,
                    'idUsuario':idUsuario
                }

            });
        },
        saveDocReportePresupuestoGV:(id,  archivo) => {
            return $http({
                url:`${anticipoGasto}saveDocReportePresupuestoGV`, //contraloria + 'saveDocReportePresupuestoGV',
                method: "POST",
                data: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: id,
                    archivo: archivo,
                    opcion: 0
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        notGerente: function(not) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(anticipoGasto + "CreateNotification/", {
                    "identificador": not.identificador,
                    "descripcion": not.descripcion,
                    "idSolicitante": not.idSolicitante,
                    "idTipoNotificacion": not.idTipoNotificacion,
                    "linkBPRO": not.linkBPRO,
                    "notAdjunto": not.notAdjunto,
                    "notAdjuntoTipo": not.notAdjuntoTipo,
                    "idEmpresa": not.idEmpresa,
                    "idSucursal": not.idSucursal,
                    "departamentoId": not.departamentoId
                }
                , headers);
        },
        PrecioGasolina: function(){
            return $http({
                url: anticipoGasto + 'PrecioGasolina/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        imageComprobante: (idPerTra, idTramite, tipo, consecutivoTramite) => {
            return $http({
                url: anticipoGasto + 'imageComprobante/',
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra,
                    idTramite: idTramite,
                    tipo: tipo,
                    consecutivoTramite:consecutivoTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        OrdenMasivaCabecero: (parametros) => {
            return $http({
                url: newTramite + 'OCAntGastoCabecero/',
                method: "GET",
                params: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        OrdenMasivaDetalle: (parametros) => {
            return $http({
                url: newTramite + 'OCAntGastoDetalle/',
                method: "GET",
                params: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updRechazoConceptoArchivo:(idConceptoArchivo, motivo) => {
            return $http({
                url: anticipoGasto + 'updRechazoConceptoArchivo/',
                method: "GET",
                params: {
                    idConceptoArchivo:idConceptoArchivo,
                    motivo: motivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updNotificacionParametrosFacturas: (idTramite) => {
            return $http({
                url: anticipoGasto + 'updNotificacionParametrosFacturas/',
                method: "GET",
                params: {
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updSolicitudFacturaAprobacion:(idConceptoArchivo, motivo) => {
            return $http({
                url: anticipoGasto + 'updSolicitudFacturaAprobacion/',
                method: "GET",
                params: {
                    idConceptoArchivo:idConceptoArchivo,
                    motivo: motivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        datosSolicitanteByConceptoArchivo:(idConceptoArchivo) => {
            return $http({
                url: anticipoGasto + 'datosSolicitanteByConceptoArchivo/',
                method: "GET",
                params: {
                    idConceptoArchivo:idConceptoArchivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        toleranciaComprobacion:() => {
            return $http({
                url: anticipoGasto + 'toleranciaComprobacion/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaLeyDeducibilidad:(idConcepto, kilometros) => {
            return $http({
                url: anticipoGasto + 'validaLeyDeducibilidad/',
                method: "GET",
                params: {
                    idConcepto:idConcepto,
                    kilometros:kilometros
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ocportramite:(tramite) => {
            return $http({
                url: anticipoGasto + 'ocportramite/',
                method: "GET",
                params: {
                    tramite: tramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDepartametoAreaAfectacion: (idEmpresa, idSucursal) => {
            return $http({
                url: anticipoGasto + 'departamentosAreaAfectacion/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        imageComprobanteOrdenPagoGV: (idPerTra, idTramite, tipo) => {
            return $http({
                url: anticipoGasto + 'imageComprobanteOrdenPagoGV/',
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra,
                    idTramite: idTramite,
                    tipo: tipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getToken:(idUsuario)=>{
            return $http({
                url: anticipoGasto + 'getToken/',
                method: "GET",
                params: {
                    idUsuarioSolicitante: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        validaToken:(token,idUsuario)=>{
            return $http({
                url: anticipoGasto + 'validaToken/',
                method: "GET",
                params: {
                    token: token,
                    idUsuarioSolicitante: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        consultaPresupuestoFirmado:(idPerTra,idEmpresa,idSucursal,idDepartamento)=>{
            return $http({
                url: anticipoGasto + 'consultaPresupuestoFirmado/',
                method: "GET",
                params: {
                    idPerTra,
                    idEmpresa,
                    idSucursal,
                    idDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        DocumentosGVOP: (idPerTra) => {
            return $http({
                url: anticipoGasto + 'DocumentosGVOP/',
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra
                    //idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        DominiosGA: () => {
            return $http({
                url: anticipoGasto + 'DominiosGA/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getidPersonabyUsuario: (idUsuario) => {
            return $http({
                url: anticipoGasto + 'idPersonabyUsuario/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        loadDocumentBanco:(idPerTra, idTramite) => {
            return $http({
                url: `${anticipoGasto}loadDocumentBanco`,
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra,
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        BuscaIne:(idpersona) => {
            return $http({
                url: `${anticipoGasto}BuscaIne`,
                method: "GET",
                params: {
                    idpersona:idpersona,
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        ValidaEstatusActivo:(idUsuario) => {
            return $http({
                url: `${anticipoGasto}ValidaEstatusActivo`,
                method: "GET",
                params: {
                    idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        ActualizaTramitePoliza:(id_perTra
            ,poliza,documentoConcepto = ''
            ,incremental = 0
            ,ordenCompra = ''
            ,consPol = 0
            ,mesPol = 0
            ,anioPol= 0
            )=>{
            return $http({
                url: `${anticipoGasto}ActualizaTramitePoliza`,
                method: "GET",
                params: {
                    id_perTra,
                    poliza,
                    documentoConcepto,
                    incremental
                    ,ordenCompra
                    ,consPol 
                    ,mesPol 
                    ,anioPol
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        OrdenesNoCobradas:(idPertra)=>{
            return $http({
                url: `${anticipoGasto}OrdenesNoCobradas`,
                method: "GET",
                params: {
                    idPertra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        BuscaPolizaGV:(idSucursal,idPertra,tipoPol,documento,importe)=>{
            return $http({
                url: `${anticipoGasto}BuscaPolizaGV`,
                method: "GET",
                params: {
                     idSucursal
                    ,idPertra
                    ,tipoPol
                    ,documento
                    ,importe
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        notificaInformaGV: function(not) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(anticipoGasto + "CreateNotificationInformaGV/", {
                    "identificador": not.identificador,
                    "descripcion": not.descripcion,
                    "idSolicitante": not.idSolicitante,
                    "idTipoNotificacion": not.idTipoNotificacion,
                    "linkBPRO": not.linkBPRO,
                    "notAdjunto": not.notAdjunto,
                    "notAdjuntoTipo": "",
                    "idEmpresa": not.idEmpresa,
                    "idSucursal": not.idSucursal,
                    "departamentoId": not.departamentoId
                }
                , headers);
        },
        usuariosTesoreria: () => {
            return $http({
                url: anticipoGasto + 'UsuariosTesoreria/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };
});
