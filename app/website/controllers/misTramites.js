var misTramitesView = require('../views/reference'),
    misTramitesModel = require('../models/dataAccess')

var misTramites = function(conf) {
    this.conf = conf || {};

    this.view = new misTramitesView();
    this.model = new misTramitesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

misTramites.prototype.get_misTramites = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEV_MISTRAMITES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

misTramites.prototype.get_misTramitesFinalizados = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEV_MISTRAMITES_SP_FINALIZADOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
misTramites.prototype.get_misTramitesAtendidos = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEV_MISTRAMITES_SP_ATENDIDOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = misTramites;
