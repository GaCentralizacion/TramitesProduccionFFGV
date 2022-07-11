var clientesURL = global_settings.urlCORS + 'api/apiTramites/'
var clientesApiURL = global_settings.urlClientes + 'api/user/'
var urlApiNoty = global_settings.urlApiNoty + 'api/notification/'
var urlBci = global_settings.urlBci + 'api/contratoDetalle/'
var urlJsReport = global_settings.urlJsReport + 'api/'
registrationModule.factory('clientesRepository', function($http) {
    return {
        getdetCre: function(idCliente, idPerTra) {
            return $http({
                url: clientesApiURL + 'tramiteCliente/',
                method: "GET",
                params: {
                    idCliente: idCliente,
                    idTramite: idPerTra,
                    idEmpresa: 0,
                    idSucursal: 0

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getMontoSucursal: function(idPerTra) {
            return $http({
                url: clientesApiURL + 'montoSucursal/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        docCyc: function(idPerTra) {
            return $http({
                url: clientesApiURL + 'docCyc/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updTramite: function(idCliente, observacion, estatus, tramites_Id, idEmpresa, idSucursal, idDepartamento, monto) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(clientesApiURL + 'insTramite/', {
                "idCliente": idCliente,
                "observacion": observacion,
                "estatus": estatus,
                "tramites_Id": tramites_Id,
                "idEmpresa": idEmpresa,
                "idSucursal": idSucursal,
                "idDepartamento": idDepartamento,
                "monto": monto
            }, headers);
        },
        subirDocumento: function(documentos) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(clientesURL + 'saveDocsTramite/', documentos, headers);
        },
        notGerente: function(not) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(urlApiNoty + "CreateNotification/", {
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
        guardaDocumentaCyc: function(observaciones) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(clientesApiURL + 'guardaDocumentaCyc/', observaciones, headers);
        },
        guardaCartera: function(id_perTra, cartera, descripcion) {
            return $http({
                url: clientesApiURL + 'guardaCartera/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    cartera: cartera,
                    descripcion: descripcion

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getReporteBuro: function(idCliente) {
            return $http({
                url: urlBci + 'rptdataC/',
                method: "GET",
                params: {
                    idCliente: idCliente
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getReporteBuroDetalle: function(idCliente) {
            return $http({
                url: urlBci + 'rptdatadetC/',
                method: "GET",
                params: {
                    idCliente: idCliente
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getReportePdf: function(jsondata) {
            return $http({
                url: urlJsReport + 'report',
                method: "POST",
                data: {
                    template: { name: jsondata.template.name },
                    data: jsondata.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },
        getReporteContado: function(idCliente) {
            return $http({
                url: urlBci + 'rptdataContado/',
                method: "GET",
                params: {
                    idCliente: idCliente
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getReportePdfContado: function(jsondata) {
            return $http({
                url: urlJsReport + 'report',
                method: "POST",
                data: {
                    template: { name: jsondata.template.name },
                    data: jsondata.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },
        insTraspaso: function(id_perTra) {
            var headers = {
                'Content-Type': 'application/json'
            };
            return $http.post(clientesApiURL + 'insTraspaso/', {
                "id_perTra": id_perTra
            }, headers);
        },
        getCarteras: (idPersona,idEmpresa, tipoAgrupacion) => {

            return $http({
                url: clientesApiURL + 'recuperaCarteras/',
                method: "POST",
                data: {
                    idEmpresa: idEmpresa,
                    tipoAgrupacion: tipoAgrupacion,
                    idPersona: idPersona
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getSucurAgrupacion: function(idEmpresa,tipoAgrupacion) {
            return $http.get(clientesApiURL + 'sucurAgrupacion/', {
                params: {
                    idEmpresa: idEmpresa,
                    tipoAgrupacion: tipoAgrupacion
                }
            });
        },
        updTramiteCyc: (idPertra,montoSolicitado, montoAutorizado,idUsuario) => {
            return $http({
                url: clientesApiURL + 'updTramiteCyc/',
                method: "POST",
                data: {
                    idPertra: idPertra,
                    montoSolicitado: montoSolicitado,
                    montoAutorizado: montoAutorizado,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updMontosCyc: (idPertra,idSucursal, monto) => {
            return $http({
                url: clientesApiURL + 'updMontosCyc/',
                method: "POST",
                data: {
                    idPertra: idPertra,
                    idSucursal: idSucursal,
                    monto: monto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});