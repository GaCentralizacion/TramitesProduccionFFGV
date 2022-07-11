var reportesGVView = require('../views/reference'),
    reportesCVModel = require('../models/dataAccess'),
    fs = require("fs");

var reportesGV = function(conf){
    this.conf = conf || {};

    this.view = new reportesGVView();
    this.model = new reportesCVModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
}

reportesGV.prototype.post_listaReportesGV = function(req, res, next){
    var self = this;

    var idTipoProceso= req.body.idTipoProceso;
    var urlParam = req.body.urlParam

    var params = [
        { name: 'idTipoProceso', value: idTipoProceso, type: self.model.types.INT },
        { name: 'urlParametro', value: urlParam, type: self.model.types.STRING }
    ];

    this.model.query('SEL_OBTIENE_COMPROBANTES_GV_APROBADOS', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesGV.prototype.get_getDataReporte = function(req, res, next){
    var self = this;

    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_DATA_REPORTE_GASTOS_VIAJE', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesGV.prototype.post_saveDocReporteContraloria = function(req, res, next) {
    var self = this;
    
	
    var idPerTra = req.body.idPerTra;
    var idEmpresa = req.body.idEmpresa;
    var idSucursal = req.body.idSucursal;
    var idDepartamento = req.body.idDepartamento
	var saveUrl = ''
	var extensionArchivo = 'pdf'//req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var urlParam = req.body.urlParam
    var opcion = req.body.opcion
    
    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING.type },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.STRING.type },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.STRING.type },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.STRING.type }
    ];
    
    this.model.query('tramites.dbo.SEL_DOCUMENTOS_REPORTE_CONTRALORIA_GV', params, function(error, result) {
        if(opcion === 0)
        {
            if( result[0].success == 1  ){
          
                var nombre = `Reporte_${idEmpresa}_${idSucursal}_${idDepartamento}.${extensionArchivo}`// "Reporte_" + idFondoFijo + '.' + extensionArchivo;
                console.log(saveUrl);
                saveUrl = result[0].saveUrl +'GV_'+ idPerTra + "\\"
    
                if (!fs.existsSync(saveUrl)) {
                    fs.mkdirSync(saveUrl);
                    setTimeout(() => {
                        fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                            if (err) {
                                console.log('Ha ocurrido un error: ' + err);
                            }
                        });
                    }, 2000)
                } else {
                    fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }
            }
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }
        else{
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }
    
    });
};

reportesGV.prototype.get_getDataImporteSolicitudesGV = function(req, res, next){
    var self = this;

    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_OBTIENE_IMPORTE_SOLICITUD_GV', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesGV.prototype.get_loadEvidenciaPresupuestos = function(req, res, next){
    var self = this;

    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var opcion = req.query.opcion;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'opcion', value: opcion, type: self.model.types.INT }
       
    ];

    this.model.query('tramites.dbo.SEL_DOCUMENTOS_REPORTE_CONTRALORIA_GV', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}


module.exports = reportesGV;