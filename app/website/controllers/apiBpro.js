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
    var ordenCompra     =  req.query.ordenCompra

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
        { name: 'resuelto',         value: resuelto,        type: self.model.types.INT },
        { name: 'ordenCompra',      value: ordenCompra,     type: self.model.types.STRING }

    ];
    this.model.query('SP_LOG_APIBRPO_FFGV', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

apiBpro.prototype.get_GetTokenBPRO = function(req, res, next) {
    var self = this;
    var ajax = require('rxjs/ajax');
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var rx = require('rxjs');
    
    ajax.ajax({  
        createXHR,
        url: 'http://192.168.20.123:7845/api/login/auth',
        crossDomain: true,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers':'*'
          },
        body: {
            "dealerId": "100000",
            "apiKey": "24779r0j-1802-2010-06ag-201f768348tg",
            "apiSecret": "xVgUwolpX8qQ75TF5Ionny6iz5vu+LbO9gm9qxTsR9nvYfJ0N8y5Bfi7L2EI2AxS6PTbNnCaGfLs+7u69UdJtODCeBO+ZJpc"
          }
    }).subscribe( async (resp) =>  {
        console.log(resp)
        self.view.expositor(res, {
            result: resp.response
        });
    })

    function createXHR() {
        return new XMLHttpRequest();
       }

}


apiBpro.prototype.get_GeneraPolizaBPRO = function(req, res, next) {
    var self = this;
    var ajax = require('rxjs/ajax');
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var rx = require('rxjs');

    var token		=  req.query.token;
    var data	=  req.query.data;
    
    ajax.ajax({  
        createXHR,
        url: 'http://192.168.20.123:7845/api/login/FondosFijos',
        crossDomain: true,
        method: 'POST',
        headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Headers':'*'
          },
        body: data
    }).subscribe( async (resp) =>  {
        console.log(resp)
        self.view.expositor(res, {
            result: resp.response
        });
    })

    function createXHR() {
        return new XMLHttpRequest();
       }

}




module.exports = apiBpro;