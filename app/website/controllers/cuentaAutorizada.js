var aprobarView = require('../views/reference'),
    aprobarModel = require('../models/dataAccess')

var cuentaAutorizada = function(conf) {
    this.conf = conf || {};

    this.view = new aprobarView();
    this.model = new aprobarModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

cuentaAutorizada.prototype.get_detallecuenta = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.perTra;
    var urlParam = req.query.urlParam;

    var params = [
        { name: 'perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_CuentaAtorizada_GET]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

cuentaAutorizada.prototype.get_estatuscuenta = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.perTra;
    var Estatus = req.query.Estatus;
    var comentariorechazo = req.query.comentariorechazo;

    var params = [
        { name: 'perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'Estatus', value: Estatus, type: self.model.types.INT },
        { name: 'comentariorechazo', value: comentariorechazo, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_EstatusCuenta_UPD]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = cuentaAutorizada;
