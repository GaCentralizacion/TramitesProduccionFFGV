var contraloria = global_settings.urlCORS + 'api/reportesContraloria/';
var jsReport = global_settings.urlJsReport;

registrationModule.factory('reportesContraloriaRepository', function($http) {
    return {
        listaTablero: function(idUsuario) {
            return $http({
                url: contraloria + 'listaReportesContraloria/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'idUsuario':idUsuario
                }

            });
        },
        reporte: function(data){
            return $http({
                url: `${jsReport}api/report`,
                //url: 'http://localhost:8001/api/report',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' ,
                data:data
            });

        },
        getDataReporte:function(id){
            return $http({
                url: contraloria + 'getDataReporte/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'id':id
                }

            });
        },
        getCatalogoMonedas: function() {
            return $http({
                url: contraloria + 'catalogoMonedas/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardaArqueo: (cabecero, detalle, keyId, idUsu, idFondoFijo, comentarios) => {
            return $http({
                url: contraloria + 'guardaArqueo/',
                method: "GET",
                params:{
                    cabecero:cabecero,
                    detalle: detalle,
                    keyId: keyId,
                    idUsu: idUsu, 
                    idFondoFijo: idFondoFijo,
                    comentarios: comentarios
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ObtieneDatosVales: (id, estatus) => {
            return $http({
                url: contraloria + 'ObtieneDatosVales/',
                method: "GET",
                params:{
                    id:id,
                    estatus:estatus
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ObtieneDatosComprobaciones: (id, tipo) => {
            return $http({
                url: contraloria + 'ObtieneDatosComprobaciones/',
                method: "GET",
                params:{
                    id:id,
                    tipo:tipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        saveDocReporteContraloria:(id, idFondo, archivo, idUsuario ,idEmpresa, idSucursal,idDepartamento,idUsuarioResponsable) => {
            return $http({
                url: contraloria + 'saveDocReporteContraloria',
                method: "POST",
                data: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: id,
                    idFondoFijo:idFondo,
                    archivo: archivo,
                    opcion: 0,
                    idUsuario:idUsuario,
                    idEmpresa:idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento:idDepartamento,
                    idUsuarioResponsable:idUsuarioResponsable
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        loadEvidencia:(id, idFondo, archivo, idUsuario ,idEmpresa, idSucursal,idDepartamento,idUsuarioResponsable) => {
            return $http({
                url: contraloria + 'saveDocReporteContraloria',
                method: "POST",
                data: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: id,
                    idFondoFijo:idFondo,
                    archivo: '',
                    opcion: 1,
                    idUsuario:idUsuario,
                    idEmpresa:idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento:idDepartamento,
                    idUsuarioResponsable:idUsuarioResponsable
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        catalogoEstatusValesFF: () => {
            return $http({
                url: contraloria + 'catalogoEstatusValesFF/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        catalogoComprbanteVale: () => {
            return $http({
                url: contraloria + 'catalogoComprbanteVale/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        solicitaToken: ( datos ) => {
            return $http({
                url: contraloria + 'solicitaToken/',
                method: "GET",
                params: datos,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaToken: ( datos ) => {
            return $http({
                url: contraloria + 'validaToken/',
                method: "GET",
                params: datos,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        arqueosParaFirma: ( datos ) => {
            return $http({
                url: contraloria + 'arqueosParaFirma/',
                method: "GET",
                params: datos,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDataReporteArqueo:function(id){
            return $http({
                url: contraloria + 'getDataReporteArqueo/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'id':id
                }

            });
        },
        responsableArqueo: ( datos ) => {
            return $http({
                url: contraloria + 'responsableArqueo/',
                method: "GET",
                params: datos,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getusuarioDig:function(usuarioDig){
            return $http({
                url: contraloria + 'getusuarioDig/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'usuarioDig':usuarioDig
                }

            });
        },
        guardarUsuarioEspejo:(idUsuarioEspejo, fondofijo, usu_idusuario ) => {
            return $http({
                url: contraloria + 'guardarUsuarioEspejo',
                method: "POST",
                data: {
                    idUsuarioEspejo: idUsuarioEspejo,
                    fondofijo:fondofijo,
                    usu_idusuario:usu_idusuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    }
});
