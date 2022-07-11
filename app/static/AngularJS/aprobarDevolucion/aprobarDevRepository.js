var aprobarDev = global_settings.urlCORS + 'api/aprobarDev/';
var apiReferencias = global_settings.apiReferencias + 'api/referencia/referencia';
var tesoreria = global_settings.urlCORS + 'api/tesoreria/';
var pdfReferencias = global_settings.pdfReferencias + 'api/reference/generarPdf/'

registrationModule.factory('aprobarDevRepository', function($http) {
    return {
        aprobarData: (idPerTra) => {
            return $http({
                url: aprobarDev + 'aprobarData/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        paramNotificacion: () => {
            return $http({
                url: aprobarDev + 'paramNotificacion/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        documentosAprobar: (idPerTra) => {
            return $http({
                url: aprobarDev + 'documentosAprobar/',
                method: "GET",
                params: {
                    idPerTra:idPerTra,
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0]},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarRechazarTramite: (idPerTra, estatus, observaciones, idUsuario) => {
            return $http({
                url: aprobarDev + 'aprobarRechazarTramite/',
                method: "GET",
                params: {
                    idPerTra:idPerTra,
                    estatus: estatus,
                    observaciones: observaciones,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        documentosUsados: (idCliente, idEmpresa, idSucursal, idPerTra) => {
            return $http({
                url: aprobarDev + 'documentosUsados/',
                method: "GET",
                params: {
                    idCliente: idCliente,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idPerTra:idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        dataCliente: (idCliente, idEmpresa, idSucursal) => {
            return $http({
                url: aprobarDev + 'dataCliente/',
                method: "GET",
                params: {
                    idCliente: idCliente,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateEstatusAutorizar: (idPerTra, bancoActual, cuentaActual, idUsuario) => {
            return $http({
                url: aprobarDev + 'updateEstatusAutorizar/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    bancoActual: bancoActual,
                    cuentaActual: cuentaActual,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertTesoreria: (idPerTra) => {
            return $http({
                url: aprobarDev + 'insertTesoreria/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateEstatusSendAutorizar: (idPerTra, petr_estatus, esDe_Idestatus, idUsuario) => {
            return $http({
                url: aprobarDev + 'updateEstatusSendAutorizar/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    petr_estatus: petr_estatus,
                    esDe_Idestatus: esDe_Idestatus,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        saveDocsTramiteEnProceso: (idPerTra, nombreDocumento, extension, idUsuario, idTramite, porSolicita) => {
            return $http({
                url: aprobarDev + 'saveDocsTramiteEnProceso/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    nombreDocumento: nombreDocumento,
                    extension: extension,
                    idUsuario: idUsuario,
                    idTramite: idTramite,
                    porSolicita: porSolicita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getReference: () => {
            return $http({
                url: tesoreria + 'apiReferencias/',
                method: "GET",
                params: {
                    idEmpresa: 4,
                    idSucursal: 6,
                    idDepartamento: 26,
                    idTipoDocumento: 1,
                    serie: 'AA',
                    folio: '000032944',
                    idCliente: 79672,
                    idAlma: 0,
                    importeDocumento: 149687.56,
                    idTipoReferencia: 1,
                    url: apiReferencias
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getBancos: (idEmpresa) => {
            return $http({
                url: aprobarDev + 'getBancos/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCuentas: (idEmpresa, idBanco) => {
            return $http({
                url: aprobarDev + 'getCuentas/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idBanco: idBanco
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaCuentaBancaria:(ctaBancaria, convenio) => {
            return $http({
                url: aprobarDev + 'validaCuentaBancaria/',
                method: "GET",
                params: {
                    ctaBancaria: ctaBancaria,
                    convenio: convenio
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        insCuentaBancaria:(idUsuario, idPerTra) => {
            return $http({
                url: aprobarDev + 'insCuentaBancaria/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    idPerTra: idPerTra
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        getActualizaEstatusMixto:(opcion,idPerTra) => {
            return $http({
                url: aprobarDev + 'getActualizaEstatusMixto/',
                method: "GET",
                params: {
                    opcion: opcion,
                    idPerTra: idPerTra
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        updEstatusCC:(idPerTra) => {
            return $http({
                url: aprobarDev + 'updEstatusCC/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        getCorreoNotificacion:(idTipoNotificacion) => {
            return $http({
                url:aprobarDev+'CorreoNotificacion/',
                method: 'GET',
                params: {
                    idTipoNotificacion: idTipoNotificacion
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        correosPagos:() => {
            return $http({
                url:aprobarDev + 'correosPagos/',
                method: 'GET',
                params: {},
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        allEmpresas:() => {
            return $http({
                url:aprobarDev + 'allEmpresas/',
                method: 'GET',
                params: {},
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        sucByidEmpresa: (idEmpresa) => {
            return $http({
                url: aprobarDev + 'sucByidEmpresa/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        imageComprobante: (idPerTra, idTramite) => {
            return $http({
                url: aprobarDev + 'imageComprobante/',
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
        documentoTransferencia: (idPerTra) => {
            return $http({
                url: aprobarDev + 'documentoTransferencia/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        pdfArray: (documento) => {
            return $http({
                url: aprobarDev + 'pdfArray/',
                method: "GET",
                params: {
                    documento: documento
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
        ,
        getAutorizador: (idTipoNotificacion) => {
            return $http({
                url: aprobarDev + 'autorizador/',
                method: "GET",
                params: {
                    idTipoNotificacion: idTipoNotificacion
                    
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
        ,
        obtieneCorreosComite: (idNot, url, not_identificador) => {
            return $http({
                url: aprobarDev + 'obtieneCorreosComite/',
                method: "GET",
                params: {
                    idNot: idNot,
                    url: url,
                    not_identificador:not_identificador
                    
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});