var nuevoTramiteView = require('../views/reference'),
    nuevoTramiteModel = require('../models/dataAccess')

var nuevoTramite = function(conf) {
    this.conf = conf || {};

    this.view = new nuevoTramiteView();
    this.model = new nuevoTramiteModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

nuevoTramite.prototype.get_allTramites = function(req, res, next) {
    var self = this; 
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('SEL_DEV_TRAMITES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_BancoByCLABE = function(req, res, next) {
    var self = this; 
    var clabe = req.query.clabe;

    var params = [
        { name: 'clabe', value: clabe, type: self.model.types.STRING }
    ];

    this.model.query('[dbo].[SEL_BANCO_ByCLABE_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_GetDataBancoByIdPersona = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'IdPersona', value: req.query.IdPersona, type: self.model.types.INT },
        { name: 'IdEmpresa', value: req.query.IdEmpresa, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[Sel_Gastos_GetBancoData_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_GetDataByCuenta = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'Cuenta', value: req.query.Cuenta, type: self.model.types.STRING },
        { name: 'IdEmpresa', value: req.query.IdEmpresa, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[Sel_Gastos_GetData_ByCuenta]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_GuardaBanco = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'IdUsuario', value: req.query.IdUsuario, type: self.model.types.INT },
        { name: 'IdPersona', value: req.query.IdPersona, type: self.model.types.INT },
        { name: 'IdBanco', value: req.query.IdBanco, type: self.model.types.STRING },
        { name: 'Plaza', value: req.query.Plaza, type: self.model.types.STRING },
        { name: 'Sucursal', value: req.query.Sucursal, type: self.model.types.STRING },
        { name: 'Cuenta', value: req.query.Cuenta, type: self.model.types.STRING },
        { name: 'CLABE', value: req.query.CLABE, type: self.model.types.STRING },
        { name: 'IdEmpresa', value: req.query.IdEmpresa, type: self.model.types.INT },
        { name: 'bancoNombre', value: req.query.bancoNombre, type: self.model.types.STRING },
        { name: 'cvebanxico', value: req.query.cvebanxico, type: self.model.types.STRING },
        { name: 'idSolicitante', value: req.query.solicitante, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[Ins_Gastos_GuardaBanco_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_CuentaByPersona = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'IdPersona', value: req.query.IdPersona, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_ObtieneCuenta_GET]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_EstatusCuenta = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'cuentaBancaria', value: req.query.cuentaBancaria, type: self.model.types.DECIMAL }
    ];

    this.model.query('[Tramite].[Sp_Tramite_EstatusCuenta_GET]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_CuentaByPersona = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'idPersona', value: req.query.idPersona, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_Cuenta_ByPersona]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_IdBproByUser = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'IdPersona', value: req.query.IdPersona, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_Usuario_ByBpro]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_creacionTramiteEntregaEfectivo = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'perTraPadre', value: req.query.perTraPadre, type: self.model.types.INT },
        { name: 'idConceptoArhivo', value: req.query.idConceptoArhivo, type: self.model.types.INT },
        { name: 'importe', value: req.query.importe, type: self.model.types.DECIMAL },
        { name: 'idTramiteConcepto', value: req.query.idTramiteConcepto, type: self.model.types.DECIMAL }
    ];

    this.model.query('[Tramite].[Sp_Tramite_GDM_NuevoTramite_INS]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_perTraPadre = function(req, res, next) {
    var self = this; 

    var params = [{ name: 'perTra', value: req.query.perTra, type: self.model.types.INT } ];

    this.model.query('[Tramite].[Sp_Tramite_GDM_perTraPadre_GET]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

nuevoTramite.prototype.get_OCAntGastoCabecero = function(req, res, next) {
    var self = this; 

    var params = [
        { name: 'idusuario', value: req.query.idusuario, type: self.model.types.INT },
        { name: 'id_perTra', value: req.query.id_perTra, type: self.model.types.STRING },
        { name: 'proceso', value: req.query.proceso, type: self.model.types.STRING }
    ];

    this.model.query('[Tramite].[Sp_Tramite_OC_AntGastoCabecero_INS]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = nuevoTramite;
