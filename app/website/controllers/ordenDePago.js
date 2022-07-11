var ordenDePagoView = require('../views/reference'),
ordenDePagoModel = require('../models/dataAccess'),
request = require('request');

var ordenDePago = function(conf) {
    this.conf = conf || {};

    this.view = new ordenDePagoView();
    this.model = new ordenDePagoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ordenDePago.prototype.get_apiReferencias = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query. idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var idTipoDocumento = req.query.idTipoDocumento;
    var serie = req.query.serie;
    var folio = req.query.folio;
    var idCliente = req.query.idCliente;
    var idAlma = req.query.idAlma;
    var importeDocumento = req.query.importeDocumento;
    var idTipoReferencia = req.query.idTipoReferencia;
    var url = req.query.url;
    // console.log( 'URL', url + "?idEmpresa=" + idEmpresa + "&idSucursal=" + idSucursal + "&idDepartamento=" + idDepartamento + "&idTipoDocumento=" + idTipoDocumento + "&serie=" + serie + "&folio=" + folio + "&idCliente=" + idCliente + "&idAlma=" + idAlma + "&importeDocumento=" + importeDocumento + "&idTipoReferencia=" + idTipoReferencia );
    request.get(url + "?idEmpresa=" + idEmpresa + "&idSucursal=" + idSucursal + "&idDepartamento=" + idDepartamento + "&idTipoDocumento=" + idTipoDocumento + "&serie=" + serie + "&folio=" + folio + "&idCliente=" + idCliente + "&idAlma=" + idAlma + "&importeDocumento=" + importeDocumento + "&idTipoReferencia=" + idTipoReferencia,
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                self.view.expositor(res, {
                    result: body
                });
            } else {
                console.log( 'error', error );
            }
        })
};

ordenDePago.prototype.get_getDataOrdenPago = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];

    this.model.query('SEL_DATA_ORDEN_PAGO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_nombreBanco = function(req, res, next) {
    var self = this; 
    var idEmpresa = req.query.idEmpresa;
    var idBanco = req.query.idBanco;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_NOMBRE_BANCO_ORDEN_PAGO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_nombreCliente = function(req, res, next) {
    var self = this; 
    var idEmpresa = req.query.idEmpresa;
    var idCliente = req.query.idCliente;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idCliente', value: idCliente, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_CLIENTE_BY_ID_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_countDocs = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('SEL_COUNT_DOCS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_idDepartamento = function(req, res, next) {
    var self = this; 
    var cartera = req.query.cartera;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'cartera', value: cartera, type: self.model.types.STRING },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('SEL_ID_DEPARTAMENTO_BY_CARTERA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_allDocsByIdPerTra = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.STRING },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_ALL_DOCS_BY_IDPERTRA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_changeEstatus = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];

    this.model.query('UPD_ESTATUS_ORDEN_PAGO_VALIDA_CUENTA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_getDataOrdenPagoMixto = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];

    this.model.query('SEL_OBTIENE_DOCTO_PO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ordenDePago.prototype.get_obtenerReferencia = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
   

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
      
    ];
    
    this.model.query('INS_REFERENCIAS_TRAMITES_DEVOLUCIONES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ordenDePago;