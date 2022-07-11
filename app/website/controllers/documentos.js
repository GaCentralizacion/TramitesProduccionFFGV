var documentosView = require('../views/reference'),
    documentosModel = require('../models/dataAccess')

var documentos = function(conf) {
    this.conf = conf || {};

    this.view = new documentosView();
    this.model = new documentosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

documentos.prototype.get_allDocumentos = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_ALLEXTENSIONES_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

documentos.prototype.post_saveDocumento = function(req, res, next) {
    var self = this;
    var nombreDocumento = req.body.nombreDocumento;
    var extension = req.body.extension;
    var expiracion = req.body.expiracion;
    var plusInfo = req.body.plusInfo;
    var infAdicional = req.body.infAdicional;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'nombreDocumento', value: nombreDocumento, type: self.model.types.STRING },
        { name: 'extension', value: extension, type: self.model.types.INT },
        { name: 'expiracion', value: expiracion, type: self.model.types.INT },
        { name: 'plusInfo', value: plusInfo, type: self.model.types.INT },
        { name: 'infAdicional', value: infAdicional, type: self.model.types.STRING },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('INS_DOCUMENTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = documentos;
