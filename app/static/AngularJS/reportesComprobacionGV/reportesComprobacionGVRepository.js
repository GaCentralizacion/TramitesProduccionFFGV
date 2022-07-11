var contraloriaGV = global_settings.urlCORS + 'api/reportesGV/';
var jsReport = global_settings.urlJsReport;

registrationModule.factory('reportesComprobacionGVRepository', function($http) {
    return {
        listaTablero: function() {
            return $http({
                url: contraloriaGV + 'listaReportesGV/',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data:{
                    idTipoProceso:4,
                    urlParam:global_settings.urlCORS.split('//').pop().split(':')[0]
                }

            });
        },
        getDataReporte:function(idEmpresa, idSucursal, idDepartamento, idPerTra){
            return $http({
                url: contraloriaGV + 'getDataReporte/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'idEmpresa':idEmpresa,
                    'idSucursal':idSucursal,
                    'idDepartamento':idDepartamento,
                    'idPerTra':idPerTra
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
        saveDocReporteComprobacionGV:(id, idEmpresa, idSucursal, idDepartamento, archivo) => {
            return $http({
                url: contraloriaGV + 'saveDocReporteContraloria',
                method: "POST",
                data: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: id,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento,
                    archivo: archivo,
                    opcion: 0
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        loadEvidencia:(id, idEmpresa, idSucursal, idDepartamento, archivo) => {
            return $http({
                url: contraloriaGV + 'saveDocReporteContraloria',
                method: "POST",
                data: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: id,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento,
                    archivo: archivo,
                    opcion: 1
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        importeSolicitud:(idPerTra) => {
            return $http({
                url: contraloriaGV + 'getDataImporteSolicitudesGV/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'idPerTra':idPerTra
                }

            });
        },
        loadEvidenciaPresupuestos:(idPerTra) => {
            return $http({
                url: contraloriaGV + 'loadEvidenciaPresupuestos/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                params:{
                    'urlParam': global_settings.urlCORS.split('//').pop().split(':')[0],
                    'idPerTra':idPerTra,
                    'opcion':1
                }

            });
        }
    }
})