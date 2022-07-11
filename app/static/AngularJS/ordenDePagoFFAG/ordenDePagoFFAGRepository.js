var ordenDePagoFFAG = global_settings.urlCORS + 'api/fondofijo/';
var apiFondoFijo = `${global_settings.urlCORS}api/fondoFijo` 

registrationModule.factory('ordenDePagoFFAGRepository', function($http) {
    return {
        getDataOrdenPagoFF: (idPerTra, tipoProceso, consecutivoTramite) => {
            return $http({
                url: ordenDePagoFFAG + 'getDataOrdenPagoFF/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    tipoProceso: tipoProceso,
                    consecutivoTramite: consecutivoTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDataOrdenPagoFFTramite: (idPerTra, tipoProceso, consecutivoTramite) => {
            return $http({
                url: ordenDePagoFFAG + 'getDataOrdenPagoFFTramite/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    tipoProceso: tipoProceso,
                    consecutivoTramite: consecutivoTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDataOrdenPagoGV: (idPerTra,tipoProceso, consecutivoTramite) => {
            return $http({
                url: ordenDePagoFFAG + 'getDataOrdenPagoGV/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    tipoProceso: tipoProceso,
                    consecutivoTramite: consecutivoTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getNombreClienteFA: (idCliente) => {
            return $http({
                url: ordenDePagoFFAG + 'nombreClienteFA/',
                method: "GET",
                params: {
                    idCliente: idCliente
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        changeEstatusFA: (idPerTra,tipoTramite,consecutivoTramite) => {
            return $http({
                url: ordenDePagoFFAG + 'changeEstatusFA/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    tipoTramite:tipoTramite,
                    consecutivoTramite:consecutivoTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        saveDocumentosFA: (data) => {
            return $http({
                url: ordenDePagoFFAG + 'saveDocumentosFA/',
                method: "POST",
                data: {
                    idDocumento: data.idDocumento,
                    idTramite: data.idTramite,
                    idPerTra: data.idPerTra,
                    saveUrl: data.saveUrl,
                    idUsuario: data.idUsuario,
                    extensionArchivo: data.extensionArchivo,
                    archivo: data.archivo,
                    observaciones: data.observaciones,
                    consecutivoTramite: data.consecutivoTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        imageComprobante: (idPerTra, idTramite, tipo, consecutivoTramite) => {
            return $http({
                url: ordenDePagoFFAG + 'imageComprobante/',
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
        DatosPolizaOP: (id_cuenta) => {
            return $http({
                url: ordenDePagoFFAG + 'DatosPolizaOP/',
                method: "GET",
                params: {
                    id_cuenta: id_cuenta
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        sendPoliza: (parametros) => {
            return $http({
                url:  `${apiFondoFijo}/insertPoliza`,
                method: "POST",
                data: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        
    };

});