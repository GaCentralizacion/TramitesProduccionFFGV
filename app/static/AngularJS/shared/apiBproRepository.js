var BPROenpoint = global_settings.urlEndPointBPRO + 'api/login/'
var apiSQL = global_settings.urlCORS + 'api/apiBpro/';

registrationModule.factory('apiBproRepository', function ($http) {
    return {
        GetTokenBPRO:()=>{

            return $http.post(BPROenpoint + "auth/", {
                "dealerId": "100000",
                "apiKey":"24779r0j-1802-2010-06ag-201f768348tg",
                "apiSecret":"xVgUwolpX8qQ75TF5Ionny6iz5vu+LbO9gm9qxTsR9nvYfJ0N8y5Bfi7L2EI2AxS6PTbNnCaGfLs+7u69UdJtODCeBO+ZJpc"
            }
            , {headers:{
                '24779r0j-1802-2010-06ag-201f768348tg':'',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }});
        },
        GeneraPolizaBPRO:(token, data) => {
            return $http.post(BPROenpoint + "FondosFijos", JSON.parse(data),{
                headers: {'Authorization': `Bearer ${token}`}
            })
        },
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
                    resuelto:data.resuelto
                },
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        }
    };
});                                                                                                                    