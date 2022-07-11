var aprobarURL = global_settings.urlCORS + 'api/aprobar/';
var proveedoresURL = global_settings.urlProveedores + 'api/usuario/';
var docClienteApiUrl = global_settings.urlApiDocCliente;
registrationModule.factory('aprobarRepository', function($http) {
    return {
        getUserAprobar: (id_perTra) => {
            return $http({
                url: aprobarURL + 'getUserAprobar/',
                method: "GET",
                params: {
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getEstatusTramite: (id_perTra) => {
            return $http({
                url: aprobarURL + 'getEstatusTramite/',
                method: "GET",
                params: {
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDocsAprobar: (id_perTra) => {
            return $http({
                url: aprobarURL + 'getDocsAprobar/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        rechazarDocumento: (det_idPerTra, razonesRechazo, id_perTra, id_documento, id_usuario) => {
            return $http({
                url: aprobarURL + 'rechazarDocumento/',
                method: "POST",
                data: {
                    det_idPerTra: det_idPerTra,
                    razonesRechazo: razonesRechazo,
                    id_perTra: id_perTra,
                    id_documento: id_documento,
                    id_usuario: id_usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarDocumento: (det_idPerTra, idUsuario) => {
            return $http({
                url: aprobarURL + 'aprobarDocumento/',
                method: "POST",
                data: {
                    det_idPerTra: det_idPerTra,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        activarAprobarTramite: (id_perTra, cuentas) => {
            return $http({
                url: aprobarURL + 'activarAprobarTramite/',
                method: "POST",
                data: {
                    id_perTra: id_perTra,
                    cuentas: cuentas
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarTramite: (id_perTra, cambioMF, moralFisica, idUsuario) => {
            return $http({
                url: aprobarURL + 'aprobarTramite/',
                method: "POST",
                data: {
                    id_perTra: id_perTra,
                    cambioMF: cambioMF,
                    moralFisica: moralFisica,
                    idUsuario : idUsuario

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        rechazarTramite: (id_perTra, idUsuario) => {
            return $http({
                url: aprobarURL + 'rechazarTramite/',
                method: "POST",
                data: {
                    id_perTra: id_perTra,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getEstatus: (IdTipoTramite , monto, idPerTra) => {
            return $http({
                url: aprobarURL + 'estatusList/',
                method: "GET",
                params: {
                    IdTipoTramite: IdTipoTramite,
                    monto: monto,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDocsCuentasAprobar: (id_perTra) => {
            return $http({
                url: aprobarURL + 'docsCuentasAprobar/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0]
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        rechazarDocumentoBancario: (det_idPerTra, razonesRechazo) => {
            return $http({
                url: aprobarURL + 'rechazarDocumentoBancario/',
                method: "POST",
                data: {
                    det_idPerTra: det_idPerTra,
                    razonesRechazo: razonesRechazo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarDocumentoBancario: (det_idPerTra) => {
            return $http({
                url: aprobarURL + 'aprobarDocumentoBancario/',
                method: "POST",
                data: {
                    det_idPerTra: det_idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarTramiteFinanzas: (id_perTra, cambioMF, moralFisica, idUsuario) => {
            return $http({
                url: aprobarURL + 'aprobarTramiteFinanzas/',
                method: "POST",
                data: {
                    id_perTra: id_perTra,
                    cambioMF: cambioMF,
                    moralFisica: moralFisica,
                    idUsuario : idUsuario

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        rechazarDocumentoBancarioTesoreria: (det_idPerTra, razonesRechazo, idUsuario) => {
            return $http({
                url: aprobarURL + 'rechazarDocumentoBancarioTesoreria/',
                method: "POST",
                data: {
                    det_idPerTra: det_idPerTra,
                    razonesRechazo: razonesRechazo,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        } ,
        apiDocCliente: function(data) {
            return $http({
                url: docClienteApiUrl + '/acceso/PostAccesoExpedienteClienteUnico',
                method: "POST",
                data:   data
                    
                   
                ,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarTramiteSemi: (idPerTra, idCliente,  idUsuario) => {
            return $http({
                url: aprobarURL + 'aprobarTramiteSemi/',
                method: "POST",
                data: {
                    idPerTra: idPerTra,
                    idCliente: idCliente,
                    idUsuario : idUsuario

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        obtenerCuentaSemi: (idPerTra) => {
            return $http({
                url: aprobarURL + 'obtenerCuentaSemi/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                    
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        apiDocClienteToken: function(token) {
            return $http({
                url: docClienteApiUrl + '/acceso/GetImportarDocumentosExpedienteCompra',
                method: "GET",
                params: {
                    token: token
                   
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
        
    };

});
