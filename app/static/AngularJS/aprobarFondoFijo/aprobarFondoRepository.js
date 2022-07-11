var aprobarFondo = global_settings.urlCORS + 'api/aprobarFondo/';
var aprobarFondoFijo = global_settings.urlCORS + 'api/fondoFijo/';

registrationModule.factory('aprobarFondoRepository', function($http) {
    return {
        aprobarData: (idPerTra) => {
            return $http({
                url: aprobarFondo + 'aprobarData/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        aprobarRechazarTramite: (idPerTra, estatus, observaciones) => {
            return $http({
                url: aprobarFondoFijo + 'aprobarRechazarTramite/',
                method: "GET",
                params: {
                    idPerTra:idPerTra,
                    estatus: estatus,
                    observaciones: observaciones
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarRechazarTramiteAD: (idPerTra, estatus, observaciones) => {
            return $http({
                url: aprobarFondoFijo + 'aprobarRechazarTramiteAD/',
                method: "GET",
                params: {
                    idPerTra:idPerTra,
                    estatus: estatus,
                    observaciones: observaciones
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        obtieneEvidenciasReembolso: (idPerTra) => {
            return $http({
                url: aprobarFondoFijo + 'obtieneEvidenciasReembolso/',
                method: "GET",
                params: {
                    idPerTra:idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        obtieneReembolso: (idPerTra) => {
            return $http({
                url: aprobarFondoFijo + 'obtieneReembolso/',
                method: "GET",
                params: {
                    idPerTra:idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        rechazarEvidencia: (razon, idComprobacion) => {
            return $http({
                url: aprobarFondoFijo + 'rechazarEvidencia/',
                method: "GET",
                params: {
                    razon:razon,
                    idComprobacion: idComprobacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        polizasCompFFGV: (idPerTra) => {
            return $http({
                url: aprobarFondoFijo + 'polizasCompFFGV/',
                method: "GET",
                params: {
                    idPerTra:idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        estatusReembolso: (idPerTra) => {
            return $http({
                url: aprobarFondoFijo + 'estatusReembolso/',
                method: "GET",
                params: {
                    idPerTra:idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        transferenciaCaja: (idempresa,idSucursal, cuentaOrigen, cuentaDestino, monto, idUsuario, referencia, idOrigenReferencia) => {
            return $http({
                url: aprobarFondoFijo + 'transferenciaCaja/',
                method: "GET",
                params: {
                    idempresa:idempresa,
                    idSucursal: idSucursal,
                    cuentaOrigen: cuentaOrigen,
                    cuentaDestino: cuentaDestino,
                    monto: monto,
                    idUsuario: idUsuario,
                    referencia:referencia, 
                    idOrigenReferencia:idOrigenReferencia
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        transferenciaBancos: (idempresa,idSucursal, cuentaOrigen, cuentaDestino, monto, idUsuario,id_perTra) => {
            return $http({
                url: aprobarFondoFijo + 'transferenciaBancos/',
                method: "GET",
                params: {
                    idempresa:idempresa,
                    idSucursal: idSucursal,
                    cuentaOrigen: cuentaOrigen,
                    cuentaDestino: cuentaDestino,
                    monto: monto,
                    idUsuario: idUsuario,
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveTransferencia: (idPersona, idTramite, idTransferencia, solicitud) => {
            return $http({
                url: aprobarFondoFijo + 'saveTransferencia/',
                method: "GET",
                params: {
                    idPersona:idPersona,
                    idTramite: idTramite,
                    idTransferencia: idTransferencia,
                    solicitud: solicitud
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        infoPolizaCaja: (id_perTra) => {
            return $http({
                url: aprobarFondoFijo + 'infoPolizaCaja/',
                method: "GET",
                params: {
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cierreContraloriaFF: (id_perTra) => {
            return $http({
                url: fondoFijo + 'cierreContraloriaFF/',
                method: "GET",
                params: {id_perTra: id_perTra},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cierreFF: (id_perTra) => {
            return $http({
                url: fondoFijo + 'cierreFF/',
                method: "GET",
                params: {id_perTra: id_perTra},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        avanzarReembolso: (id_perTra, idReembolso, tipoUsuario, monto) => {
            return $http({
                url: fondoFijo + 'avanzarReembolso/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    idReembolso: idReembolso,
                    tipoUsuario: tipoUsuario,
                    monto: monto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaTramiteReembolso: (idReembolso, idTramite) => {
            return $http({
                url: fondoFijo + 'actualizaTramiteReembolso/',
                method: "GET",
                params: {
                    idReembolso: idReembolso,
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ObtieneReferencia: (data) => {
            return $http({
                url: aprobarFondoFijo + 'ObtieneReferencia/',
                method: "GET",
                params: {
                    'idEmpresa':data.idEmpresa,
                    'idSucursal':data.idSucursal,
                    'idDepartamento':data.idDepartamento,
                    'idOrigenReferencia':data.idOrigenReferencia,
                    'idBancoOrigen':data.idBancoOrigen,
                    'idBancoDestino':data.idBancoDestino,
                    'documento':data.documento,
                    'importe':data.importe,
                    'idPersona':data.idPersona
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };
});