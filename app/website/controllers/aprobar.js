var aprobarView = require('../views/reference'),
    aprobarModel = require('../models/dataAccess')
const nodemailer = require('nodemailer');
var aprobar = function(conf) {
    this.conf = conf || {};

    this.view = new aprobarView();
    this.model = new aprobarModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

aprobar.prototype.get_getUserAprobar = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }
    ];
    this.model.query('SEL_USUARIO_APROBAR_SEL', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.get_getEstatusTramite = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }
    ];
    this.model.query('SEL_ESTATUS_TRAMITE_APP_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.get_getDocsAprobar = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var urlParam = req.query.urlParam;
    
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    
    this.model.query('SEL_DOCUMENTOS_APROBAR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_activarAprobarTramite = function(req, res, next) {
    var self = this;
    var id_perTra = req.body.id_perTra;
    var noCuentas = req.body.cuentas;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'noCuentas', value: noCuentas, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_PODER_APROBAR_DOCUMENTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_rechazarDocumento = function(req, res, next) {
    var self = this;
    var det_idPerTra = req.body.det_idPerTra;
    var razonesRechazo = req.body.razonesRechazo;
    var id_perTra = req.body.id_perTra;
    var id_documento = req.body.id_documento;
    var id_usuario = req.body.id_usuario;

    var params = [
        { name: 'det_idPerTra', value: det_idPerTra, type: self.model.types.INT },
        { name: 'razonesRechazo', value: razonesRechazo, type: self.model.types.STRING },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'id_documento', value: id_documento, type: self.model.types.INT },
        { name: 'id_usuario', value: id_usuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_RECHAZO_ESTATUS_DOCUMENTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_aprobarDocumento = function(req, res, next) {
    var self = this;
    var det_idPerTra = req.body.det_idPerTra;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'det_idPerTra', value: det_idPerTra, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_APROBAR_ESTATUS_DOCUMENTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_aprobarTramite = function(req, res, next) {
    var self = this;
    var id_perTra = req.body.id_perTra;
    var cambioMF = req.body.cambioMF;
    var moralFisica = req.body.moralFisica;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'cambioMF', value: cambioMF, type: self.model.types.INT },
        { name: 'moralFisica', value: moralFisica, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_APROBAR_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_rechazarTramite = function(req, res, next) {
    var self = this;
    var id_perTra = req.body.id_perTra;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_RECHAZAR_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.get_estatusList = function(req, res, next) {
    var self = this;
    var IdTipoTramite = req.query.IdTipoTramite;
    var monto = req.query.monto;
     var idPerTra = req.query.idPerTra;
    
    var params = [
        { name: 'IdTipoTramite', value: IdTipoTramite, type: self.model.types.INT },
        { name: 'monto', value: monto, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_PROCESO_ESTATUS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.get_docsCuentasAprobar = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var urlParam = req.query.urlParam;
    
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    
    this.model.query('SEL_DOCUMENTOS_APROBAR_BANCARIOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_rechazarDocumentoBancario = function(req, res, next) {
    var self = this;
    var det_idPerTra = req.body.det_idPerTra;
    var razonesRechazo = req.body.razonesRechazo;

    var params = [
        { name: 'det_idPerTra', value: det_idPerTra, type: self.model.types.INT },
        { name: 'razonesRechazo', value: razonesRechazo, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_RECHAZAR_ESTATUS_DOCUMENTO_BANCARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_aprobarDocumentoBancario = function(req, res, next) {
    var self = this;
    var det_idPerTra = req.body.det_idPerTra;

    var params = [
        { name: 'det_idPerTra', value: det_idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_APROBAR_ESTATUS_DOCUMENTO_BANCARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_aprobarTramiteFinanzas = function(req, res, next) {
    var self = this;
    var id_perTra = req.body.id_perTra;
    var cambioMF = req.body.cambioMF;
    var moralFisica = req.body.moralFisica;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'cambioMF', value: cambioMF, type: self.model.types.INT },
        { name: 'moralFisica', value: moralFisica, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_APROBAR_TRAMITE_FINANZAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_rechazarDocumentoBancarioTesoreria = function(req, res, next) {
    var self = this;
    var det_idPerTra = req.body.det_idPerTra;
    var razonesRechazo = req.body.razonesRechazo;
    var idUsuario = req.body.idUsuario;

    var params = [
        { name: 'det_idPerTra', value: det_idPerTra, type: self.model.types.INT },
        { name: 'razonesRechazo', value: razonesRechazo, type: self.model.types.STRING },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_RECHAZAR_ESTATUS_DOCUMENTO_BANCARIO_TESORERIA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
aprobar.prototype.post_aprobarTramiteSemi = function(req, res, next) {
    var self = this;
  

    var params = [
        { name: 'idCliente', value: req.body.idCliente, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idPerTra', value: req.body.idPerTra, type: self.model.types.INT }
        
        
    ];
    
    this.model.query('INS_APROBAR_CUENTA_SEMINUEVOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.get_obtenerCuentaSemi = function(req, res, next) {
    var self = this;
   
  
    
    var params = [
        { name: 'idPerTra', value:  req.query.idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_CUENTA_PAGO_SEMINUEVOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

aprobar.prototype.post_enviarCorreoTesoreria = function (req, res, next) {

    console.log("Entre enviar notificacion");

    var self = this;
   
    var params = [
       
        { name: 'idPerTra', value: req.body.idPerTra, type: self.model.types.INT }
    ];

    var err =
        this.model.query('SEL_CUENTA_PAGO_SEMINUEVOS_SP', params, function (error, result) {
            if (error) {
                console.log('Tengo un error al llamar el SP ', error)
                object = {
                    estatus: -1,
                    mensaje: "Ocurrio un error en api"
                }
                res.json(object);
            } else {
                // console.log(result, 'SOY LA RESPUESTA ')
                // if (result[0].result == -1) {
                //     object = {
                //         estatus: -1,
                //         mensaje: "Ocurrio un error en SP"
                //     }
                //     res.json(object);
                // } else if (result[0].result == -2) {
                //     object = {
                //         estatus: -2,
                //         mensaje: "Correo del autorizador no válido, favor de comunicarse con sistemas..."
                //     }
                //     res.json(object);
                // } else {
                    console.log('ENTRE A ENVIAR EL cORREO')
//console.log('result',result[0]);
                    var datosProveedor = result[0];
                    //console.log('SOY LOS DATOS DEL PROVEEDOR ', datosProveedor)
                    // Se envia el correo al Proveedor para activar su cuenta                   

                    return new Promise(function (resolve, reject) {
                     
                        var rfc = datosProveedor.rfc;
                     
                        var correoAutoriza = datosProveedor.correoAutorizaCuentas;
                        var cuentasProveedor = datosProveedor.banco;
                     

                        // var transporter = nodemailer.createTransport({
                        //     host: '192.168.20.17',
                        //     port: 25,
                        //     secure: false,
                        //     ignoreTLS: true,
                        //     auth: {
                        //         user: 'noreply',
                        //         pass: 'P4n4m4!'
                        //     }
                        // });
                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            host: 'smtp.gmail.com',            
                            secure: false,           
                            auth: {
                                user: 'reportesauxiliar@grupoandrade.com',
                                pass: 'SuuDU3%56pl#'
                            },
                            // auth: {
                            //     user: 'grupoandrade.reportes@grupoandrade.com',
                            //     pass: 'R390rt3$#'
                            // },
                            tls: { rejectUnauthorized: false }
                       });

                        //Datos para enviar el Email
                        var messageAutorizador = {
                            from: '"Grupo Andrade"<grupoandrade.reportes@grupoandrade.com>', //De
                            to: correoAutoriza, //Para
                            subject: '"Activacion de Cuenta Bancaria Pago Seminuevos"', //Asunto
                            html: `<table style="height: 401px; width: 100%;" border="0" width="826" cellspacing="0">
                                <tbody>
                                    <tr style="height: 15px;" bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td style="width:600px">
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td bgcolor="#FCFAFB" style="width:600px"> &nbsp; </td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td bgcolor="#FCFAFB" style="width:600px">
                                            <center><img id="headerImage" src="http://189.204.141.196/GA_Centralizacion/Images/GA.png" alt="Grupo Andrade" /></center>
                                        </td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td style="padding: 15px; width:600px; text-align: center;" bgcolor="#FCFAFB">
                                            <h3 style="font-size: 20px; font-family: 'Raleway', sans-serif; font-style: normal;"><span style="color: #333;">Portal Procesos Administrativos</span></h3>
                                        </td>
                                        <td bgcolor="#f5f5f5">&nbsp;</td>
                                    </tr>
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td style="padding: 15px; width:600px" bgcolor="#FCFAFB">
                                            <p style="font-size: 16px; line-height: 24px; font-family: 'Raleway', sans-serif; font-style: normal;">
                                                <span style="color: #333;">Se solicita la activación de la cuenta Bancaria para el Proveedor:</span>
                                            </p>
                                            <br />
                                        </td>
                                        <td bgcolor="#f5f5f5">&nbsp;</td>
                                    </tr>
                                   
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td style="padding: 15px; width:600px; font-size: 16px; font-family: 'Raleway', sans-serif; font-style: normal;" bgcolor="#FCFAFB">RFC :  `+ rfc + `
                                        </td>
                                        <td bgcolor="#f5f5f5">&nbsp;</td>
                                    </tr>
                                   
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td style="padding: 15px; width:600px; font-size: 16px; font-family: 'Raleway', sans-serif; font-style: normal;" bgcolor="#FCFAFB">Cuenta Bancaria : `+ cuentasProveedor + ` 
                                        </td>
                                        <td bgcolor="#f5f5f5">&nbsp;</td>
                                    </tr>
                                    <tr bgcolor="#f5f5f5">
                                    <td>&nbsp;</td>
                                    <td style="padding: 15px; width:600px; font-size: 16px; font-family: 'Raleway', sans-serif; font-style: normal;" bgcolor="#FCFAFB">Para revisar el trámite, por favor ingrese desde el panel de notificaciones. 
                                    </td>
                                    <td bgcolor="#f5f5f5">&nbsp;</td>
                                </tr>
                                   
                                   
                                    <tr bgcolor="#f5f5f5">
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr bgcolor="#fff">
                                        <td>&nbsp;</td>
                                        <td>
                                            <p style="font-size: 10px; font-family: tahoma; color: #999; padding: 15px;">&copy;2018 Todos los derechos reservados.
                                                <br /> Este e-mail fue enviado autom&aacute;ticamente, favor de no responderlo.</p>
                                        </td>
                                        <td>&nbsp;</td>
                                    </tr>
                                </tbody>
                            </table>` //HTML  
                        };


                        //Enviamos el Email
                        transporter.sendMail(messageAutorizador, function (err) {
                            if (!err) {

                                object = {
                                    estatus: 1,
                                    mensaje: "¡Email enviado!"
                                }


                            } else {
                                console.log(err, "Error correo");
                                object = {
                                    estatus: -1,
                                    mensaje: "¡Error en el Envio!!!!!"
                                }
                            }
                            res.json(object);
                        });

                        transporter.close;
                        req.body = [];

                    });
              //  }
            }
        });
}

module.exports = aprobar;
