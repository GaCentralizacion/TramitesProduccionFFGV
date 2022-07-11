var devolucionesView = require('../views/reference'),
    devolucionesModel = require('../models/dataAccess'),
    fs = require("fs");
    sendMail = require('./sendMail')

var devoluciones = function(conf) {
    this.conf = conf || {};

    this.view = new devolucionesView();
    this.model = new devolucionesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

devoluciones.prototype.get_allEmpresas = function(req, res, next) {
    var self = this;
    var usu_idusuario = req.query.usu_idusuario
    
    var params = [
        { name: 'usu_idusuario', value: usu_idusuario, type: self.model.types.INT }
    ]

    this.model.query('SEL_EMPRESAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_sucByidEmpresa = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var usu_idusuario = req.query.usu_idusuario;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'usu_idusuario', value: usu_idusuario, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_SUCURSALES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_allFormaPago = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_FORMAPAGO_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_departamentos = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DEPARTAMENTOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_documentosByTramite = function(req, res, next) {
    var self = this;
    var idTramite = req.query.idTramite;

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DOCUMENTOS_BY_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.post_saveTramite = function(req, res, next) {
    var self = this;
    var idUsuario = req.body.idUsuario;
	var idTramite = req.body.idTramite;
	var idFormaPago = req.body.idFormaPago;
	var idDepartamento = req.body.idDepartamento;
	var observaciones = req.body.observaciones;
	var idEmpresa = req.body.idEmpresa;
    var idSucursal = req.body.idSucursal;
    var estatus = req.body.estatus;
    var devTotal = req.body.devTotal;
    var idCliente = req.body.idCliente;
    var cuentaBancaria = req.body.cuentaBancaria;
    var numeroCLABE = req.body.numeroCLABE;
    var cveBanxico = req.body.cveBanxico;
    var bancoTipoCuenta = req.body.bancoTipoCuenta;
    var esDeIdEstatus = req.body.esDeIdEstatus;
    var idMotivo = req.body.idMotivo;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idFormaPago', value: idFormaPago, type: self.model.types.INT },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'estatus', value: estatus, type: self.model.types.INT },
        { name: 'devTotal', value: devTotal, type: self.model.types.DECIMAL },
        { name: 'idPersona', value: idCliente, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: cuentaBancaria, type: self.model.types.STRING },
        { name: 'numeroCLABE', value: numeroCLABE, type: self.model.types.STRING },
        { name: 'cveBanxico', value: cveBanxico, type: self.model.types.STRING },
        { name: 'bancoTipoCuenta', value: bancoTipoCuenta, type: self.model.types.STRING },
        { name: 'esDeIdEstatus', value: esDeIdEstatus, type:self.model.types.INT},
        { name: 'idMotivo', value: idMotivo, type:self.model.types.INT}
    ];
    
    this.model.query('INS_DEV_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.post_saveDocumentos = function(req, res, next) {
    var self = this;
    var idDocumento = req.body.idDocumento;
	var idTramite = req.body.idTramite;
	var idPerTra = req.body.idPerTra;
	var saveUrl = req.body.saveUrl;
	var idUsuario = req.body.idUsuario;
	var extensionArchivo = req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    
    var params = [
        { name: 'idDocumento', value: idDocumento, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
    ];
    
    this.model.query('INS_DEV_DETALLE_SP', params, function(error, result) {
        if( result[0].success == 1 ){
            var nombre = "Documento_" + idDocumento + '.' + extensionArchivo;
            if (!fs.existsSync(saveUrl)) {
                fs.mkdirSync(saveUrl);
                setTimeout(() => {
                    fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                    if (err) {
                        console.log('Ha ocurrido un error: ' + err);
                    }
                });
            }
        }
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_dataBorrador = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DEV_BORRADOR_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_imageBorrador = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DEV_DOCUMENTOS_BORRADOR_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_updateBorrador = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra
    var idEmpresa = req.query.idEmpresa
    var idFormaPago = req.query.idFormaPago
    var observaciones = req.query.observaciones
    var idSucursal = req.query.idSucursal
    var idDepartamento = req.query.idDepartamento
    var devTotal = req.query.devTotal;
    var idCliente = req.query.idCliente;
    var cuentaBancaria = req.query.cuentaBancaria;
    var numeroCLABE = req.query.numeroCLABE;
    var cveBanxico = req.query.cveBanxico;
    var bancoTipoCuenta = req.query.bancoTipoCuenta;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idFormaPago', value: idFormaPago, type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
        { name: 'devTotal', value: devTotal, type: self.model.types.DECIMAL },
        { name: 'idCliente', value: idCliente, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: cuentaBancaria, type: self.model.types.STRING },
        { name: 'numeroCLABE', value: numeroCLABE, type: self.model.types.STRING },
        { name: 'cveBanxico', value: cveBanxico, type: self.model.types.STRING },
        { name: 'bancoTipoCuenta', value: bancoTipoCuenta, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_DEV_BORRADOR_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.post_updateDocumentos = function(req, res, next) {
    var self = this;
    var idDocumento = req.body.idDocumento;
	var idTramite = req.body.idTramite;
	var idPerTra = req.body.idPerTra;
	var saveUrl = req.body.saveUrl;
	var idUsuario = req.body.idUsuario;
	var extensionArchivo = req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var det_idPerTra = req.body.det_idPerTra;
    
    var params = [
        { name: 'det_idPerTra', value: det_idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_DEV_BORRADOR_DETALLE_SP', params, function(error, result) {
        if( result[0].success == 1 ){
            var nombre = "Documento_" + idDocumento + '.' + extensionArchivo;
            if (!fs.existsSync(saveUrl)) {
                fs.mkdirSync(saveUrl);
                setTimeout(() => {
                    fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                    if (err) {
                        console.log('Ha ocurrido un error: ' + err);
                    }
                });
            }
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }else{
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }
    });
};

devoluciones.prototype.get_updateBorradorSolicitado = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_DEV_BORRADOR_SOLICITADO_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_clientePerPersona = function(req, res, next) {
    var self = this;
    var idCliente = req.query.idCliente;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idCliente', value: idCliente, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_CLIENTE_BY_ID_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_clienteDocumentos = function(req, res, next) {
    var self = this;
    var idCliente = req.query.idCliente;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var tipo = req.query.tipo;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idCliente', value: idCliente, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DOCUMENTOS_CLIENTE_ORIGEN_PAGO_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_saveClienteDocumentos = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var string = req.query.string;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'input', value: string, type: self.model.types.STRING }
    ];
    
    this.model.query('INS_DOCUMENTOS_DEVOLVER_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_estatusDevoluciones = function(req, res, next) {
    var self = this;

    var idPerTra = req.query.idPerTra;
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DEV_ESTATUS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_updFinalizado = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_DEV_ESTATUS_GENERAL', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_bancoCVEBanxico = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_BANCOS_CVEBANXICO_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
devoluciones.prototype.get_bancoConcentra = function(req, res, next) {
    var self = this;

      
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];
    
    
    this.model.query('SEL_BANCO_POR_EMPRESA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_sendMailCliente = function(req, res, next) {
    var self = this;
    var to = req.query.to;
    var subject = req.query.subject;
    var html = req.query.html;

    sendMail.envia(to, subject, html).then((resPromise)=>{
        self.view.expositor(res, {
            result: resPromise
        });
    });
};

devoluciones.prototype.get_getBancoTipoCuenta = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_CAT_TIPO_CUENTA_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


devoluciones.prototype.get_getObtieneCorreoRol = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idTramite', value:  req.query.idTramite, type: self.model.types.INT },
        { name: 'idRol', value:  req.query.idRol, type: self.model.types.INT },
        { name: 'idEmpresa', value:  req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value:  req.query.idSucursal, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_OBTIENE_CORREO_ROL', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_cancelarTramite = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idPertra', value:  req.query.idPerTra, type: self.model.types.INT },
        { name: 'comentarios', value:  req.query.comentarios, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_CANCELAR_DEVOLUCION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_motivoDevolucion = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_MOTIVO_DEVOLUCION_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

devoluciones.prototype.get_validaCuentaBancaria = function (req, res, next) {

    var self = this;

    var conv = !req.query.convenio ? '' : req.query.convenio;
    var params = [
        { name: 'ctaBancaria', value: req.query.ctaBancaria, type: self.model.types.STRING },
        { name: 'convenio', value: conv, type: self.model.types.STRING }, 
        { name: 'idCliente', value: req.query.idCliente, type: self.model.types.STRING },

    ];


    this.model.query('Centralizacionv2.dbo.PROV_SEL_VALIDA_CUENTA_BANCARIA_DEV_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

devoluciones.prototype.get_tramitependiente = function (req, res, next) {

    var self = this;

    var conv = !req.query.convenio ? '' : req.query.convenio;
    var params = [
        { name: 'idCliente', value: req.query.idCliente, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }

    ];


    this.model.query('SEL_TRAMITESDEVOLUCION_ACTIVOS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = devoluciones;
