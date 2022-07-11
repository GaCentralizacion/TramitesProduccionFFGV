
var ObtieneDatosTransferencia = `${global_settings.urlCORS}api/transferencia` 

registrationModule.factory('transferenciaRepository', function($http){

    return{
        obtieneDatosTransferencia:(idPerTra) => {
            return $http({
                url: `${ObtieneDatosTransferencia}/datosTramites`,
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
                url:`${ObtieneDatosTransferencia}/aprobarRechazarTramite`,
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
        }
    }
});