var ordenDePago = global_settings.urlCORS + 'api/ordenDePago/';

registrationModule.factory('ordenDePagoRepository', function($http) {
    return {
        getReference: (dataReferencia) => {
            return $http({
                url: ordenDePago + 'apiReferencias/',
                method: "GET",
                params: {
                    idEmpresa: dataReferencia.idEmpresa,
                    idSucursal: dataReferencia.idSucursal,
                    idDepartamento: dataReferencia.idDepartamento,
                    idTipoDocumento: 1,
                    serie: dataReferencia.serie,
                    folio: dataReferencia.folio,
                    idCliente: dataReferencia.idCliente,
                    idAlma: 0,
                    importeDocumento: dataReferencia.importeDocumento,
                    idTipoReferencia: dataReferencia.idTipoReferencia,
                    url: global_settings.apiReferencias + 'api/referencia/referencia/'
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDataOrdenPago: (idPerTra) => {
            return $http({
                url: ordenDePago + 'getDataOrdenPago/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        nombreBanco: (idBanco, idEmpresa, idSucursal) => {
            return $http({
                url: ordenDePago + 'nombreBanco/',
                method: "GET",
                params: {
                    idBanco: idBanco,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getNombreCliente: (idCliente, idEmpresa, idSucursal) => {
            return $http({
                url: ordenDePago + 'nombreCliente/',
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
        getCountDocs: (idPerTra, idEmpresa, idSucursal) => {
            return $http({
                url: ordenDePago + 'countDocs/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getIdDepartamento: (cartera, idEmpresa, idSucursal) => {
            return $http({
                url: ordenDePago + 'idDepartamento/',
                method: "GET",
                params: {
                    cartera: cartera,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        allDocsByIdPerTra: (idPerTra, idEmpresa, idSucursal) => {
            return $http({
                url: ordenDePago + 'allDocsByIdPerTra/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        addDetailsReference: function(dataReferencia) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(global_settings.backReferencias + 'api/reference/addDetailsReference/', {
                idReferencia: dataReferencia.idReferencia,
                idSucursal: dataReferencia.idSucursal,
                idDepartamento: dataReferencia.idDepartamento,
                idTipoDocumento: dataReferencia.idTipoDocumento,
                serie: dataReferencia.serie,
                folio: dataReferencia.folio,
                idCliente: dataReferencia.idCliente,
                idAlma: dataReferencia.idAlma,
                importeDocumento: dataReferencia.importeDocumento
            }, headers);
        },
        changeEstatus: (idPerTra) => {
            return $http({
                url: ordenDePago + 'changeEstatus/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDataOrdenPagoMixto: (idPerTra) => {
            return $http({
                url: ordenDePago + 'getDataOrdenPagoMixto/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getObtenerReferencia: (idPerTra) => {
            return $http({
                url: ordenDePago + 'obtenerReferencia/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };

});