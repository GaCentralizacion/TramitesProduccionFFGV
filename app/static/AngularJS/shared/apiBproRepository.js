var BPROenpoint = global_settings.urlEndPointBPRO + 'api/login/'
var apiSQL = global_settings.urlCORS + 'api/apiBpro/';
var apiGurdaDocumento = global_settings.urlCORS + 'api/apiGuardaDocumento/'

registrationModule.factory('apiBproRepository', function ($http) {
    return {

        // GeneraPolizaBPRO:(token, data) => {
        //     return $http.post(BPROenpoint + "FondosFijos", JSON.parse(data),{
        //         headers: {'Authorization': `Bearer ${token}`}
        //     })
        // },
        LogApiBpro:(data)=>{
            return $http({
                url: apiSQL+'insertaLog/',
                method: 'GET',
                params:{
                    idSucursal: data.idSucursal,
                    unniqIdGenerado: data.unniqIdGenerado,
                    tokenGenerado: data.tokenGenerado,
                    id_perTra: data.id_perTra,
                    idVale: data.idVale,
                    jsonEnvio: data.jsonEnvio,
                    jsonRespuesta: data.jsonRespuesta,
                    tipoPol: data.tipoPol,
                    consPol: data.consPol,
                    anioPol: data.anioPol,
                    empresaPol: data.empresaPol,
                    opcion: data.opcion,
                    consecutivo: data.consecutivo,
                    mesPol: data.mesPol,
                    codigo: data.codigo,
                    mensajeError: data.mensajeError,
                    resuelto:data.resuelto,
                    ordenCompra: data.ordenCompra,
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        }
        ,
        GetTokenBPRO:()=>{
            return $http({
                url: apiSQL+'GetTokenBPRO/',
                method: 'GET',
                params:{},
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        },
        GeneraPolizaBPRO:(token, data) =>{
            return $http({
                url: apiSQL+'GeneraPolizaBPRO/',
                method: 'GET',
                params:{token, 
                    data},
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        },
        GuardaDocumentoFactura:(data) =>{
            return $http({
                url: apiGurdaDocumento+'GuardaFactura/',
                method: 'POST',
                params:{data},
                headers:{'content-type': 'multipart/form-data'}
            })
        },
        InsertaLogDocumento:(idPertra,idVale,jsonDatos,respuesta,oc) =>{
            return $http({
                url: apiGurdaDocumento+'InsertaLogDocumento/',
                method: 'GET',
                params:{idPertra,idVale,jsonDatos,respuesta,oc},
                headers:{'Content-Type': 'application/json'}
            })
        },
        RecuperaDocumento:(url) =>{
            return $http({
                url: apiGurdaDocumento+'RecuperaDocumento/',
                method: 'GET',
                params:{url},
                headers:{'Content-Type': 'application/json'}
            })
        },
        UrlRecuperaDocumento:(oc) =>{
            return $http({
                url: apiGurdaDocumento+'UrlRecuperaDocumento/',
                method: 'GET',
                params:{oc},
                headers:{'Content-Type': 'application/json'}
            })
        }
    };
});                                                                                                                    