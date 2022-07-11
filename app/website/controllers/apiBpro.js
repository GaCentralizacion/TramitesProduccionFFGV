var apiBproView = require('../views/reference'),
    apiBproModel = require('../models/dataAccess')

var apiBpro = function(conf) {
    this.conf = conf || {};

    this.view = new apiBproView();
    this.model = new apiBproModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

apiBpro.prototype.get_insertaLog = function(req, res, next) {
    
    var self = this;
    var idSucursal		=  req.query.idSucursal;
    var unniqIdGenerado	=  req.query.unniqIdGenerado;
    var tokenGenerado	=  req.query.tokenGenerado;
    var id_perTra		=  req.query.id_perTra;
    var idVale			=  req.query.idVale;
    var jsonEnvio		=  req.query.jsonEnvio;
    var jsonRespuesta	=  req.query.jsonRespuesta;
    var tipoPol			=  req.query.tipoPol;
    var consPol			=  req.query.consPol;
    var anioPol			=  req.query.anioPol;
    var empresaPol		=  req.query.empresaPol;
    var opcion			=  req.query.opcion;
    var consecutivo     =  req.query.consecutivo;
    var mesPol          =  req.query.mesPol
    var codigo          =  req.query.codigo
    var mensajeError    =  req.query.mensajeError
    var resuelto        =  req.query.resuelto

    var params = [
        { name: 'idSucursal',       value: idSucursal,      type: self.model.types.INT },
        { name: 'unniqIdGenerado',  value: unniqIdGenerado, type: self.model.types.STRING },
        { name: 'tokenGenerado',    value: tokenGenerado,   type: self.model.types.STRING },
        { name: 'id_perTra',        value: id_perTra,       type: self.model.types.INT },
        { name: 'idVale',           value: idVale,          type: self.model.types.STRING },
        { name: 'jsonEnvio',        value: jsonEnvio,       type: self.model.types.STRING },
        { name: 'jsonRespuesta',    value: jsonRespuesta,   type: self.model.types.STRING },
        { name: 'tipoPol',          value: tipoPol,         type: self.model.types.STRING },
        { name: 'consPol',          value: consPol,         type: self.model.types.STRING },
        { name: 'anioPol',          value: anioPol,         type: self.model.types.STRING },
        { name: 'empresaPol',       value: empresaPol,      type: self.model.types.STRING },
        { name: 'opcion',           value: opcion,          type: self.model.types.INT },
        { name: 'consecutivo',      value: consecutivo,     type: self.model.types.INT },
        { name: 'mesPol',           value: mesPol,          type: self.model.types.STRING },
        { name: 'codigo',           value: codigo,          type: self.model.types.STRING },
        { name: 'mensajeError',     value: mensajeError,    type: self.model.types.STRING },
        { name: 'resuelto',         value: resuelto,        type: self.model.types.INT }
    ];
    this.model.query('SP_LOG_APIBRPO_FFGV', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = apiBpro;