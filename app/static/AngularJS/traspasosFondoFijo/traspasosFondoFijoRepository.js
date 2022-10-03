
var ObtieneDatosTransferencia = `${global_settings.urlCORS}api/transferencia` 

registrationModule.factory('traspasosFondoFijoRepository', function($http){

    return{
        obtieneDatosTransferencia:(idPerTra) => {
            return $http({
                url: `${ObtieneDatosTransferencia}/datosTramitesFondoFijo`,
                method: 'GET',
                params:{idPerTra: idPerTra},
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        },
        obtieneEstatusTramites:() => {
            return $http({
                url:`${ObtieneDatosTransferencia}/obtieneEstatusTramites`,
                method: 'GET',
                params: {},
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        },
        aprobarRechazarTramite:(idPerTra,estatus,observaciones) => {
            return $http({
                url:`${ObtieneDatosTransferencia}/aprobarRechazarTramiteFF`,
                method: 'GET',
                params: {
                    id_perTra: idPerTra,
                    estatus: estatus,
                    observaciones: observaciones
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        },
        saveDocumentos: (data) => {
            return $http({
                url: `${ObtieneDatosTransferencia}/saveDocumentos`,
                method: "POST",
                data: {
                    idDocumento: data.idDocumento,
                    idTramite: data.idTramite,
                    idPerTra: data.idPerTra,
                    saveUrl: data.saveUrl,
                    idUsuario: data.idUsuario,
                    extensionArchivo: data.extensionArchivo,
                    archivo: data.archivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        loadDocument:(idPerTra, idTramite) => {
            return $http({
                url: `${ObtieneDatosTransferencia}/loadDocument`,
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
        updateTramite:(idPerTra, idEstatus, esDeEstatus) => {
            return $http({
                url: `${ObtieneDatosTransferencia}/updateTramite`,
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    idEstatus: idEstatus,
                    EsDeEstatus: esDeEstatus
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        infoPolizaCajaGV: (id_perTra) => {
            return $http({
                url:  `${ObtieneDatosTransferencia}/infoPolizaCajaGV`,
                method: "GET",
                params: {
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaPoliza: (idSucursal, id_perTra, tipoPol) => {
            return $http({
                url:  `${ObtieneDatosTransferencia}/validaPoliza`,
                method: "GET",
                params: {
                    idSucursal: idSucursal,
                    id_perTra : id_perTra, 
                    tipoPol: tipoPol
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    }
});