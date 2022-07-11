var tramitesView = require('../views/reference'),
    tramitesModel = require('../models/dataAccess')

var tramites = function(conf) {
    this.conf = conf || {};

    this.view = new tramitesView();
    this.model = new tramitesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

tramites.prototype.get_allAreas = function(req, res, next) {
    var self = this;

    this.model.query('SEL_AllAREAS_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tramites.prototype.get_allDocumentos = function(req, res, next) {
    var self = this;

    this.model.query('SEL_ALLDOCUMENTOS_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tramites.prototype.post_saveTramite = function(req, res, next) {
    var self = this;
    var tramNombre = req.body.tramNombre;
    var idArea = req.body.idArea;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'tramNombre', value: tramNombre, type: self.model.types.STRING },
        { name: 'idArea', value: idArea, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('INS_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tramites.prototype.post_saveDocsTramite = function(req, res, next) {
    var self = this;
    var input = req.body.input;

    var params = [
        { name: 'input', value: input, type: self.model.types.STRING }
    ];

    this.model.query('INS_TRAMITEDOCUMENTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tramites.prototype.get_allTramites = function(req, res, next) {
    var self = this;

    this.model.query('SEL_OBTIENE_TRAMITES_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tramites.prototype.get_obtieneDocumentos = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramite', value: req.query.idTramite, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];
    // console.log(params)
    this.model.query('SEL_DOCUMENTOS_TRAMITES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
tramites.prototype.post_modificaDocumento = function(req, res, next) {
    var self = this;
    // console.log(req.body.id_traDo)
    // var input = req.body.input;

    var params = [
        { name: 'id_traDo', value: req.body.id_traDo, type: self.model.types.INT },
        { name: 'mandatorioBancario', value: req.body.mandatorioBancario == true ? 1 : 0, type: self.model.types.INT },
        { name: 'bancario', value: req.body.bancario == true ? 1 : 0, type: self.model.types.INT },
        { name: 'mandatorioEfectivo', value: req.body.mandatorioEfectivo == true ? 1 : 0, type: self.model.types.INT },
        { name: 'efectivo', value: req.body.efectivo == true ? 1 : 0, type: self.model.types.INT },
        { name: 'activo', value: req.body.activo == true ? 1 : 0, type: self.model.types.INT },
        { name: 'doc_nomDocumento', value: req.body.doc_nomDocumento, type: self.model.types.STRING },
        { name: 'id_documento', value: req.body.id_documento, type: self.model.types.INT }
    ];
    console.log(params)
    this.model.query('INS_PROPIEDADES_DOCUMENTOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = tramites;