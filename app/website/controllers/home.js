var homeView = require('../views/reference'),
    homeModel = require('../models/dataAccess')

var home = function(conf) {
    this.conf = conf || {};

    this.view = new homeView();
    this.model = new homeModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

home.prototype.get_getTramitesByArea = function(req, res, next) {
    var self = this;
    var idArea = req.query.idArea;
    var usuario = req.query.usuario;

    var params = [
        { name: 'idArea', value: idArea, type: self.model.types.INT },
        { name: 'usuario', value: usuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'fechaIni', value: req.query.fIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }
    ];
    
    // this.model.query('SEL_TRAMITE_BY_AREA_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
    this.model.query('SEL_TRAMITE_BY_AREA_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

home.prototype.get_getTramitesByAreaFinalizados = function(req, res, next) {
    var self = this;
    var idArea = req.query.idArea;
    var usuario = req.query.usuario;

    var params = [
        { name: 'idArea', value: idArea, type: self.model.types.INT },
        { name: 'usuario', value: usuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'fechaIni', value: req.query.fIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }
    ];
    this.model.query('SEL_TRAMITE_BY_AREA_FINALIZADOS_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
    // this.model.query('SEL_TRAMITE_BY_AREA_FINALIZADOS_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
};

home.prototype.get_getDiasDiferencias = function(req, res, next) {
    var self = this;
    var idArea = req.query.idArea;
    var usuario = req.query.usuario;

    var params = [
        { name: 'idArea', value: idArea, type: self.model.types.INT },
        { name: 'usuario', value: usuario, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('SEL_DIFDAY_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

home.prototype.get_updateEnRevision = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_ESTATUS_TRAMITE_ENREVISION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

home.prototype.get_ordenescompraanticipo = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;

    var params = [];
    
    this.model.query('[Tramite].[Sp_Tramite_OC_Procesadas_GETL]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

home.prototype.get_tipoTramite = function(req, res, next) {
    var self = this;
     

    var params = [
        
        { name: 'idUsuario', value: req.query.usuario, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_TIPO_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
home.prototype.get_empresaResumen = function(req, res, next) {
    var self = this;
     

    var params = [
        
        { name: 'idUsuario', value: req.query.usuario, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_EMPRESA_RESUMEN_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
home.prototype.get_sucursalResumen = function(req, res, next) {
    var self = this;
     

    var params = [
        
        { name: 'idUsuario', value: req.query.usuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_SUCURSAL_RESUMEN_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

home.prototype.get_getTramitesByAreaAtendidos = function(req, res, next) {
    var self = this;
    var idArea = req.query.idArea;
    var usuario = req.query.usuario;

    var params = [
        { name: 'idArea', value: idArea, type: self.model.types.INT },
        { name: 'usuario', value: usuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'fechaIni', value: req.query.fIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }
    ];

    this.model.query('SEL_TRAMITE_BY_AREA_ATENDIDOS_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
    // this.model.query('SEL_TRAMITE_BY_AREA_ATENDIDOS_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
};

home.prototype.get_buscaResumen = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa', value:  req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value:  req.query.idSucursal, type: self.model.types.INT },
        { name: 'idTramite', value:  req.query.idTramite, type: self.model.types.INT },
        { name: 'fechaIni', value: req.query.fIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }
    ];
    this.model.query('SEL_TRAMITES_PROCESADOS_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
    // this.model.query('SEL_TRAMITES_PROCESADOS_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
};

module.exports = home;
