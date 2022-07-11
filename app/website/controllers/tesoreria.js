var tesoreriaView = require('../views/reference'),
tesoreriaModel = require('../models/dataAccess'),
request = require('request');

var tesoreria = function(conf) {
    this.conf = conf || {};

    this.view = new tesoreriaView();
    this.model = new tesoreriaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

tesoreria.prototype.get_allTramites = function(req, res, next) {
    var self = this;
    var idEstatus = req.query.idEstatus;
    params = [
        {name: 'idEstatus', value: idEstatus, type: self.model.types.INT},
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'fechaIni', value: req.query.fIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }
    ]
    this.model.query('SEL_ALL_TRAMITES_CUENTASBANCARIAS_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

    // this.model.query('SEL_ALL_TRAMITES_CUENTASBANCARIAS_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
};

tesoreria.prototype.get_difDay = function(req, res, next) {
    var self = this;
    
    this.model.queryAllRecordSet('SEL_DIFDAY_CUENTASBANCARIAS_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tesoreria.prototype.get_updateEnRevision = function(req, res, next) {
    var self = this;
    
    var id_perTra = req.query.id_perTra;

    var params = [
        { name: 'idPerTra', value: id_perTra, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('UPD_ESTATUS_TRAMITE_ENREVISION_CUENTASBANCARIAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tesoreria.prototype.get_updateEnRevisionFA = function(req, res, next) {
    var self = this;
    
    var id_perTra = req.query.id_perTra;
    var tipo = req.query.tipo;
    var consecutivo = req.query.consecutivo;

    var params = [
        { name: 'idPerTra', value: id_perTra, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.INT },
        { name: 'consecutivo', value: consecutivo, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('UPD_ESTATUS_TRAMITE_ENREVISION_CUENTASBANCARIASFA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tesoreria.prototype.get_CuentaSearch = function(req, res, next) {
    var self = this;

    var params = [{ name: 'busqueda', value: req.query.busqueda, type: self.model.types.STRING } ];

    this.model.query('[Tramite].[Sp_Tramite_Cuenta_Search_GETL]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tesoreria.prototype.get_buscaResumen = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa', value:  req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value:  req.query.idSucursal, type: self.model.types.INT },
        { name: 'idTramite', value:  req.query.idTramite, type: self.model.types.INT },
        { name: 'fechaIni', value: req.query.fIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }
    ];
    this.model.query('SEL_TESORERIA_PROCESADOS_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
    // this.model.query('SEL_TESORERIA_PROCESADOS_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
};

module.exports = tesoreria;
