var subalternosView = require('../views/reference'),
    subalternosModel = require('../models/dataAccess'),
    fs = require("fs");

var subalternos = function(conf){
    this.conf = conf || {};

    this.view = new subalternosView();
    this.model = new subalternosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
}

subalternos.prototype.get_clasificacion = function(req, res, next){
    var self = this;

    this.model.query('ClasificacionJerarquia', [], function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

subalternos.prototype.get_clasificacionSubalternos = function(req, res, next){
    var self = this;

    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.STRING }
    ];

    this.model.query('OBTIENE_SIGUIENTE_NIVEL', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

subalternos.prototype.get_Departamentos = function(req, res, next){
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        {name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
    ];

    this.model.query('SEL_DEPARTAMENTOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


subalternos.prototype.get_listaUsuarios = function(req, res, next){
    var self = this;
    
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var idUsuario = req.query.idUsuario;

    var params = [
        {name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        {name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT},
        {name: 'idUsuario', value: idUsuario, type: self.model.types.INT}
    ];

    this.model.query('dbo.OBTIENE_LISTA_USUARIOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

subalternos.prototype.get_listadoSubalterno = function(req, res, next){
    var self = this;

    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.STRING }
    ];

    this.model.query('OBTIENE_LISTA_SUBALTERNOS', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

subalternos.prototype.get_insertaBorraSubalternos = function(req, res, next){
    var self = this;
    
    var idPadre = req.query.idPadre;
    var idUsuario = req.query.idUsuario;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var jerarquia = req.query.jerarquia;
    var autoriza = req.query.autoriza;
    var opcion = req.query.opcion;

    var params = [
        {name: 'idPadre', value: idPadre, type: self.model.types.INT},
        {name: 'idUsuario', value: idUsuario, type: self.model.types.INT},
        {name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        {name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT},
        {name: 'jerarquia', value: jerarquia, type: self.model.types.INT},
        {name: 'autoriza', value: autoriza, type: self.model.types.INT},
        {name: 'opcion', value: opcion, type: self.model.types.INT}
    ];

    this.model.query('dbo.INSERTA_BORRA_SUBALTERNOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

subalternos.prototype.get_sublaternosAutorizador = function(req, res, next){
    var self = this;
    
    
    var idUsuario = req.query.idUsuario;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var autoriza = req.query.autoriza === 'true' ? 1 : 0;

    var params = [
        
        {name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        {name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT},
        {name: 'idUsuario', value: idUsuario, type: self.model.types.INT},
        {name: 'autoriza', value: autoriza, type: self.model.types.INT},
    ];

    this.model.query('UPD_SUBALTERNOS_AUTORIZADOR', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = subalternos;