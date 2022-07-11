var tranferenciaTramiteView = require('../views/reference'),
    transferenciaTramiteModel = require('../models/dataAccess'),
    fs = require("fs");

var transferencia = function(conf){
    this.conf = conf || {};

    this.view = new tranferenciaTramiteView();
    this.model = new transferenciaTramiteModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
}

transferencia.prototype.get_datosTramites = function(req, res, next){
    var self = this;

    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.STRING }
    ];

    this.model.query('SEL_OBTIENE_DATOS_TRANSFERENCIA_SP', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

transferencia.prototype.get_obtieneEstatusTramites = function(req, res, next){
    var self = this;

    //var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idTramite', value: 11, type: self.model.types.INT }
    ];

    this.model.query('SEL_DEV_ESTATUS_BY_TRAMITE_SP', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

transferencia.prototype.get_aprobarRechazarTramite = function(req, res, next){
    var self = this;

    var idPerTra      = req.query.id_perTra;
    var estatus       = req.query.estatus;
    var observaciones = req.query.observaciones;

    var params = [
        { name: 'id_perTra',     value: idPerTra,      type: self.model.types.INT },
        { name: 'estatus',       value: estatus,       type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING }
    ];

    this.model.query('UPD_APROBAR_RECHAZAR_TRAMITE_SP', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

transferencia.prototype.post_saveDocumentos = function(req, res, next) {
    var self = this;
    var idDocumento = req.body.idDocumento;
	var idTramite = req.body.idTramite;
	var idPerTra = req.body.idPerTra;
	var saveUrl = req.body.saveUrl;
	var idUsuario = req.body.idUsuario;
	var extensionArchivo = req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    
    var params = [
        { name: 'idDocumento', value: idDocumento, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
    ];
    
    this.model.query('INS_TRANS_DETALLE_SP', params, function(error, result) {
        if( result[0].success == 1  ){
            var nombre = "Documento_" + idDocumento + '.' + extensionArchivo;
            console.log(saveUrl);
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
    });
};

transferencia.prototype.get_loadDocument = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_TRANS_DOCUMENTOS_BORRADOR_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

transferencia.prototype.get_datosTramitesFondoFijo = function(req, res, next){
    var self = this;

    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.STRING }
    ];

    this.model.query('OBTIENE_DATOS_TRASPASO_FF', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

transferencia.prototype.get_updateTramite = function(req, res, next) {
    var self = this;
    
    var idPerTra = req.query.idPerTra;
    var idEstatus = req.query.idEstatus;
    var EsDeEstatus = req.query.EsDeEstatus;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idEstatus', value: idEstatus, type: self.model.types.STRING },
        { name: 'EsDeEstatus', value: EsDeEstatus, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_ESTATUS_TRAMITES', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

transferencia.prototype.get_aprobarRechazarTramiteFF = function(req, res, next){
    var self = this;

    var idPerTra      = req.query.id_perTra;
    var estatus       = req.query.estatus;
    var observaciones = req.query.observaciones;

    var params = [
        { name: 'id_perTra',     value: idPerTra,      type: self.model.types.INT },
        { name: 'estatus',       value: estatus,       type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING }
    ];

    this.model.query('UPD_APROBAR_RECHAZAR_TRAMITE_FF_SP', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

transferencia.prototype.get_infoPolizaCajaGV = function(req, res, next){
    var self = this;

    var id_perTra = req.query.id_perTra;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.STRING }
    ];

    this.model.query('SEL_INFOPOLIZASCAJA_GV_SP', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

module.exports = transferencia;