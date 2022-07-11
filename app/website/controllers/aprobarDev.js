var aprobarDevView = require('../views/reference'),
    aprobarDevModel = require('../models/dataAccess'),
    soap = require('soap')

    const correo = require('./sendMail')
var parseString = require('xml2js').parseString;
var fs = require('fs');

var aprobarDev = function(conf) {
    this.conf = conf || {};

    this.view = new aprobarDevView();
    this.model = new aprobarDevModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

aprobarDev.prototype.get_aprobarData = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DEV_APROBAR_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_paramNotificacion = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_PARAM_AMOUNT_NOTIFICACION_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_documentosAprobar = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var urlParam = req.query.urlParam;

    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    
    this.model.query('SEL_DEV_DOCUMENTOS_APROBAR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_aprobarRechazarTramite = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var estatus = req.query.estatus;
    var observaciones = req.query.observaciones;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT },
        { name: 'estatus', value: estatus, type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
    ];
    
    this.model.query('UPD_DEV_APROBAR_RECHAZAR_TRAMITE_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_documentosUsados = function(req, res, next) {
    var self = this;
    var idCliente = req.query.idCliente;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idCliente', value: idCliente, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DOCUMENTOS_USADOS_BY_TRAMITE_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_dataCliente = function(req, res, next) {
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

aprobarDev.prototype.get_updateEstatusAutorizar = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var bancoActual = req.query.bancoActual;
    var cuentaActual = req.query.cuentaActual;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'bancoActual', value: bancoActual, type: self.model.types.INT },
        { name: 'cuentaActual', value: cuentaActual, type: self.model.types.STRING },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_DEV_ESTATUS_AUTORIZAR_TRAMITE_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_insertTesoreria = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('INS_TESORERIA_CUENTAS_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_updateEstatusSendAutorizar = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var petr_estatus = req.query.petr_estatus;
    var esDe_Idestatus = req.query.esDe_Idestatus;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'petr_estatus', value: petr_estatus, type: self.model.types.INT },
        { name: 'esDe_Idestatus', value: esDe_Idestatus, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_ESTATUS_TRAMITES_GERENTE', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


aprobarDev.prototype.get_saveDocsTramiteEnProceso = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var nombreDocumento = req.query.nombreDocumento;
    var extension = req.query.extension;
    var idUsuario = req.query.idUsuario;
    var idTramite = req.query.idTramite;
    var porSolicita = req.query.porSolicita;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'nombreDocumento', value: nombreDocumento, type: self.model.types.STRING },
        { name: 'extension', value: extension, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'porSolicita', value: porSolicita, type: self.model.types.STRING }
    ];
    
    console.log( 'params', params );

    this.model.query('INS_DOCUMENTOS_EN_PROCESO_DE_TRAMITE', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_getBancos = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    
    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_BANCOS_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_getCuentas = function(req, res, next) {
    var self = this;

    var idEmpresa = req.query.idEmpresa;
    var idBanco = req.query.idBanco;
    
    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_CUENTA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_validaCuentaBancaria = function(req, res, next) {
    var self = this;

    var ctaBancaria = req.query.ctaBancaria;
    var convenio = req.query.convenio;

    var params = [
        { name: 'ctaBancaria', value: ctaBancaria, type: self.model.types.STRING},
        { name: 'convenio', value: convenio, type: self.model.types.STRING}
    ];
    
    this.model.query('SEL_VALIDA_CUENTA_BANCARIA_SP', params, function(error,result) {
        self.view.expositor(res,{
            error: error,
            result: result
        });
    });
}

aprobarDev.prototype.get_insCuentaBancaria = function(req, res, next) {
    var self = this;

    var idUsuario = req.query.idUsuario;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.STRING},
        { name: 'idPerTra', value: idPerTra, type: self.model.types.STRING}
    ];
    
    this.model.query('INS_CUENTAS_BANCARIAS_BPRO_SP', params, function(error,result) {
        self.view.expositor(res,{
            error: error,
            result: result
        });
    });
}

aprobarDev.prototype.get_getActualizaEstatusMixto = function(req, res, next) {
    var self = this;

    var opcion = req.query.opcion;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'opcion', value: opcion, type: self.model.types.INT},
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT}
    ];

    this.model.query('SEL_UPDATE_STATUS_DEV_MIXTO_SP', params, function(error,result) {
        self.view.expositor(res,{
            error: error,
            result: result
        });
    });
}

aprobarDev.prototype.get_updEstatusCC = function(req, res, next) {
    var self = this;
    
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT}
    ];

    this.model.query('UPD_ESTATUS_DEV_APROBACION_CC_SP', params, function(error,result) {
        self.view.expositor(res,{
            error: error,
            result: result
        });
    });
}

aprobarDev.prototype.get_CorreoNotificacion = function(req, res, next) {
    var self = this;

    var idTipoNotificacion = req.query.idTipoNotificacion;

    var params = [
        { name: 'idTipoNotificacion', value: idTipoNotificacion, type: self.model.types.INT }
    ];

    this.model.query('SEL_OBTIENE_CORREO_NOTIFICACIONES_SP', params, function(error,result){
        self.view.expositor(res,{
            error: error,
            result: result
        });
    });
}

aprobarDev.prototype.get_correosPagos = function(req, res, next) {
    var self = this;

    this.model.query('SEL_CORREOS_USUARIOS_PAGOS', [], function(error,result){
        self.view.expositor(res,{
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_allEmpresas = function(req, res, next) {
    var self = this;

    this.model.query('SEL_ALL_EMPRESAS_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_sucByidEmpresa = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_ALL_SUCURSALES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_imageComprobante = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DEV_DOCUMENTO_COMPROBANTE_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobarDev.prototype.get_autorizador = function(req, res, next) {
    var self = this;
    

    var params = [
        { name: 'idTipoNotificacion', value: req.query.idTipoNotificacion, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_AUTORIZADOR_TIPO_NOTIFICACION', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
aprobarDev.prototype.get_documentoTransferencia = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_DOCUMENTO_TRANSFERENCIA_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
aprobarDev.prototype.get_pdfArray = function(req, res, next) {
    var self = this;
     console.log('hi');
 
     var url = this.conf.parameters.WSGeneraPdf;
     if (req.query.documento) {
         var args = {
             Tipo: 'PAC',
             Documento: req.query.documento,
             Nodo: 0
         };
         soap.createClient(url, function(err, client) {
             console.log(url)
             if (err) {
                 console.log('Error 4', err)
 
                 self.view.expositor(res, {
                     mensaje: "Hubo un problema intente de nuevo",
                 });
             } else {
                 console.log(args)
                 client.GenerarPdfArray(args, function(err, result, raw) {
                     if (err) {
                         console.log('Error 3', err)
 
                         self.view.expositor(res, {
                             mensaje: "Hubo un problema intente de nuevo",
                         });
                     } else {
                         parseString(raw, function(err, result) {
                             if (err) {
                                 console.log('Error 2', err)
 
                                 self.view.expositor(res, {
                                     mensaje: "Hubo un problema intente de nuevo",
                                 });
                             } else {
                                 // console.log('Llegue hasta el final');
                                 // console.log(result["soap:Envelope"]["soap:Body"][0]["GenerarPdfArrayResponse"][0]["GenerarPdfArrayResult"][0], 'Lo logre?')
                                 var arrayBits = result["soap:Envelope"]["soap:Body"][0]["GenerarPdfArrayResponse"][0]["GenerarPdfArrayResult"][0];
                                 self.view.expositor(res, {
                                     result: {
                                         arrayBits: arrayBits
                                     }
                                 });
                             }
                         });
                     }
 
                 });
             }
         });
     } else {
         console.log('Error 1')
         self.view.expositor(res, {
             mensaje: "Hubo un problema intente de nuevo",
         });
     }
 };

 aprobarDev.prototype.get_obtieneCorreosComite = function(req, res, next) {

    var self = this;
    var urlNotify = req.query.url

    var params = [{ name: 'not_id', value: req.query.idNot, type: self.model.types.INT }];

    this.model.query('Notificacion.dbo.SEL_NOTID_MANCUMUNADO_SP', params, function(error, result) {

        if (result) {
            result.forEach(function(persona) {
                correo.enviaComite(urlNotify,persona.apr_id, persona.not_id, persona.usu_correo, persona.emp_id, persona.not_descripcion, persona.token, req.query.subject,persona.link, req.query.not_identificador);
            });
        }

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = aprobarDev;
