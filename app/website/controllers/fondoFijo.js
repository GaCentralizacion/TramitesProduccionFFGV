var fondoFijoView = require('../views/reference'),
    fondoFijoModel = require('../models/dataAccess'),
    fs = require("fs"),
    path = require('path');

var fondoFijo = function(conf) {
    this.conf = conf || {};

    this.view = new fondoFijoView();
    this.model = new fondoFijoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


fondoFijo.prototype.get_empresas = function(req, res, next) {
    var self = this;
    var userId =  req.query.userId;

    var params = [
        { name: 'userId', value: userId, type: self.model.types.INT }
    ];

    this.model.query('Tramite.Sel_EmpresaByUserID', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_sucursales = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT }
    ];

    this.model.query('SEL_SUCURSALES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_departamentos = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
         {name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_DEPARTAMENTOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_DepartamentoAreasFF = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
         {name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_DEPARTAMENTOS_AREA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
fondoFijo.prototype.get_TiposolicitudFondo = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
         {name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_TIPOSOLICITUDFONDOFIJO_AREA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_TiposolicitudXFondo = function(req, res, next) {
    var self = this;
    var idFondo = req.query.idFondo;

    var params = [
        { name: 'idFondo', value: idFondo, type: self.model.types.INT}
    ];

    this.model.query('SEL_TIPOSOLICITUDXFONDOFIJO_AREA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_departamentosXFondoAreaFF = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idFondo', value: req.query.idFondo, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEPARTAMENTOSXFONDOSFIJOSAREA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


fondoFijo.prototype.get_cuentasContables = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
         {name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];
    this.model.query('SEL_CUENTASCONTABLESFF_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_fondoFijoId = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        {name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT }
    ];

    this.model.query('Tramite.Sel_FondoFijoId', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_usuariosAutorizadoresFondoFijo = function(req, res, next){
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        {name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT }
    ];

    this.model.query('Tramite.Sel_autorizadoresFondoFijo', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_saveTramite = function(req, res, next) {
    var self = this;
    var idFF = req.body.idFF;
    var idTramite = req.body.idTramite;
    var idEmpresa = req.body.idEmpresa;
    var idSucursal = req.body.idSucursal;
    var idDepartamento = req.body.idDepartamento;
    var idUsuario = req.body.idUsuario;
    var idAutorizador = req.body.idAutorizador;
    var descripcion = req.body.descripcion;
    var estatus = req.body.estatus;
    var monto = req.body.monto;
    var nombreFondoFijo = req.body.nombreFondoFijo;
    var idPersona = req.body.idPersona;
    var cuentaContable = req.body.cuentaContable;
    var departamentoArea = req.body.departamentoArea;
    
    var params = [
        { name: 'idFF', value: idFF, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idAutorizador', value: idAutorizador, type: self.model.types.INT },
        { name: 'descripcion', value: descripcion, type: self.model.types.STRING },
        { name: 'nombreFondoFijo', value: nombreFondoFijo, type: self.model.types.STRING },
        { name: 'estatus', value: estatus, type: self.model.types.INT },
        { name: 'monto', value: monto, type: self.model.types.DECIMAL },
        { name: 'idPersona', value: idPersona, type: self.model.types.INT },
        { name: 'cuentaContable', value: cuentaContable, type: self.model.types.STRING },
        { name: 'departamentoArea', value: departamentoArea, type: self.model.types.INT },
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_TRAMITE_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_saveBitProceso = function(req, res, next) {
    var self = this;
    var idUsuario = req.body.idUsuario;
    var id_perTra = req.body.id_perTra;
    var idEstatus = req.body.idEstatus;
    var accion = req.body.accion;
    var bitacora = req.body.bitacora;
    var proceso = req.body.proceso; 
    
    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'idEstatus', value: idEstatus, type: self.model.types.INT },
        { name: 'accion', value: accion, type: self.model.types.STRING },
        { name: 'bitacora', value: bitacora, type: self.model.types.INT },
        { name: 'proceso', value: proceso, type: self.model.types.INT },
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_BIT_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_saveBitCorreo = function(req, res, next) {
    var self = this;
  
    var id_perTra = req.body.id_perTra;
    var proceso = req.body.proceso;
    var destinatarios = req.body.destinatarios;
    var encabezado = req.body.encabezado;
    var cuerpo = req.body.cuerpo;
    var enviado = req.body.enviado;
    var comentario = req.body.comentario;
  
    
    var params = [
      
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'proceso', value: proceso, type: self.model.types.STRING },
        { name: 'destinatarios', value: destinatarios, type: self.model.types.STRING },
        { name: 'encabezado', value: encabezado, type: self.model.types.STRING },
        { name: 'cuerpo', value: cuerpo, type: self.model.types.STRING },
        { name: 'enviado', value: enviado, type: self.model.types.INT },
        { name: 'comentario', value: comentario, type: self.model.types.STRING },       
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_BITCORREO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_dataBorrador = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_FONDOFIJO_BORRADOR_SP]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_dataBorradorReembolso = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;

    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_FONDOFIJO_BORRADOR_REEMBOLSO_SP]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


fondoFijo.prototype.get_imageBorrador = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    //var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        //{ name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_FONDOFIJO_DOCUMENTOS_SP]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


fondoFijo.prototype.get_FondoFijoxUsuario = function(req, res, next) {
    var self = this;
    var idtramite =  req.query.idtramite;

    var params = [
        { name: 'idtramite', value: idtramite, type: self.model.types.INT }
    ];

    this.model.query('SEL_FONDOFIJOXUSUARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_FondoFijoAumentoDecremento = function(req, res, next) {
    var self = this;
    var idtramite =  req.query.idtramite;

    var params = [
        { name: 'idtramite', value: idtramite, type: self.model.types.INT }
    ];

    this.model.query('SEL_FONDOFIJOAUMENTODECREMENTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_FondoFijoReembolso = function(req, res, next) {
    var self = this;
    var id_traDe =  req.query.id_traDe;

    var params = [
        { name: 'id_traDe', value: id_traDe, type: self.model.types.INT }
    ];

    this.model.query('SEL_FONDOFIJOREEMBOLSO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_FondoFijoReembolsoTramite = function(req, res, next) {
    var self = this;
    var id_traDe =  req.query.id_traDe;
    var idUsuario =  req.query.idUsuario;
    var monto = req.query.monto;

    var params = [
        { name: 'id_traDe', value: id_traDe, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'monto', value: monto, type: self.model.types.DECIMAL }
    ];

    this.model.query('SEL_FONDOFIJOREEMBOLSO_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_TipoUsuario = function(req, res, next) {
    var self = this;
    var userId =  req.query.userId;
    var tipo = req.query.tipo;

    var params = [
        { name: 'idUsuario', value: userId, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_TIPOUSUARIOFONDOFIJO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_TipoUsuarioFondoFijo = function(req, res, next) {
    var self = this;
    var userId =  req.query.userId;
    var params = [
        { name: 'idUsuario', value: userId, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_TIPOUSUARIOFONDOFIJOREEMBOLSO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_TipoUsuarioFondoFijoXSucursal = function(req, res, next) {
    var self = this;
    var userId =  req.query.userId;
    var idperta =  req.query.id_perta;
    var params = [
        { name: 'idUsuario', value: userId, type: self.model.types.INT },
        { name: 'idperta', value: idperta, type: self.model.types.INT },
    ];

    this.model.query('[dbo].[SEL_TIPOUSUARIOFONDOFIJOXSUCURSAL_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_TipoUsuarioFondoFijoXSucursalTipo = function(req, res, next) {
    var self = this;
    var tipo =  req.query.tipo;
    var idperta =  req.query.id_perta;
    var params = [
        { name: 'tipo', value: tipo, type: self.model.types.INT },
        { name: 'idperta', value: idperta, type: self.model.types.INT },
    ];

    this.model.query('[dbo].[SEL_TIPOUSUARIOFONDOFIJOXSUCURSALTIPO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_tipoGastoFondoFijo = function(req, res, next){
    var self = this;

    this.model.query('[dbo].[SEL_TIPOGASTOFONDOFIJO_SP]', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_FondoFijoxSucursal = function(req, res, next) {
    var self = this;
    var idSucursal =  req.query.idSucursal;

    var params = [
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_FONDOFIJOXSUCURSAL_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_saveTramiteVale = function(req, res, next) {
    var self = this;
    
    var idUsuario=  req.body.idUsuario;
    var descripcion=  req.body.descripcion;
    var estatus=  req.body.estatus;
    var importe=  req.body.importe;
    var idFondoFijo= req.body.idFondoFijo;
    //var idtipoGasto= req.body.idtipoGasto;
    //var idAutorizador= req.body.idAutorizador;
    var valeCompuesto= req.body.valeCompuesto;
    var idFondoFijo2= req.body.idFondoFijo2;
    var importeFF1= req.body.importeFF1;
    var importeFF2= req.body.importeFF2;
    var idVale= req.body.idVale;
    var idPersona = req.body.idPersona;
    var idDepartamento = req.body.idDepartamento;

    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idFondoFijo', value: idFondoFijo, type: self.model.types.INT },
        //{ name: 'idtipoGasto', value: idtipoGasto, type: self.model.types.INT },
        //{ name: 'idAutorizador', value: idAutorizador, type: self.model.types.INT },
        { name: 'descripcion', value: descripcion, type: self.model.types.STRING },
        { name: 'estatus', value: estatus, type: self.model.types.INT },
        { name: 'importe', value: importe, type: self.model.types.DECIMAL },
        { name: 'valeCompuesto', value: valeCompuesto, type: self.model.types.INT },
        { name: 'idFondoFijo2', value: idFondoFijo2, type: self.model.types.INT },
        { name: 'importeFF1', value: importeFF1, type: self.model.types.DECIMAL },
        { name: 'importeFF2', value: importeFF2, type: self.model.types.DECIMAL },
        { name: 'idPersona', value: idPersona, type: self.model.types.INT },
        { name: 'idDep', value: idDepartamento, type: self.model.types.INT },
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_VALE_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


// fondoFijo.prototype.get_FondoFijoxUsuario = function(req, res, next) {
//     var self = this;
//     var userId =  req.query.userId;

//     var params = [
//         { name: 'idResponsable', value: userId, type: self.model.types.INT }
//     ];

//     this.model.query('SEL_FONDOFIJOXUSUARIO_SP', params, function(error, result) {
//         self.view.expositor(res, {
//             error: error,
//             result: result
//         });
//     });
// };

fondoFijo.prototype.get_ValesFondoFijo = function(req, res, next) {
    var self = this;
    var idUsuario =  req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_VALEXFONDOFIJOID_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


fondoFijo.prototype.get_ValesFF = function(req, res, next) {
    var self = this;
    var id_perTra =  req.query.id_perTra;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_VALEXFONDOFIJOPERTRA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
fondoFijo.prototype.post_updateTramiteVale = function(req, res, next) {
    var self = this;
    var idVale = req.body.idVale;
    var accion = req.body.accion;
    var comentario = req.body.comentario;
    var idUsuario = req.body.idUsuario;

    
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'accion', value: accion, type: self.model.types.INT },
        { name: 'comentario', value: comentario, type: self.model.types.STRING },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
    ]; 
    this.model.query('[dbo].[rechazarEvidencia]', params, function(error, result) {
        if( result[0].success == 1 && accion == 3){
            var nombreArchivo = req.body.nombreArchivo;
            var extensionArchivo = req.body.extensionArchivo;
	        var saveUrl = req.body.saveUrl;
	        var base64Data = req.body.archivo.split(';base64,').pop();
            var nombre = 'AutorizacionVale_' + idVale + '.' + extensionArchivo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
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

fondoFijo.prototype.post_AumentoDisminucionFF = function(req, res, next) {
    var self = this;
    var id_perTra = req.body.id_perTra;
    var ADmonto = req.body.ADmonto;
    var tipo = req.body.tipo;
    var tomarVales = req.body.tomarVales;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'ADmonto', value: ADmonto, type: self.model.types.DECIMAL },
        { name: 'tipo', value: tipo, type: self.model.types.INT },
        { name: 'tomarVales', value: tomarVales, type: self.model.types.INT },
    ]; 
    this.model.query('[dbo].[UPD_AUMENTODISMINUCIONFONDO_SP]', params, function(error, result) {
        if( result[0].success == 1){
            var saveUrl = req.body.saveUrl;
            //Evidencia Aumento/Decremento
            var extensionArchivo = req.body.extensionArchivo;       
	        var base64Data = req.body.archivo.split(';base64,').pop();
            var nombre = 'DocumentoAD_' + result[0].idCambio +  '.' + extensionArchivo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
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
            //Carta Responsiva
            var extensionArchivoCarta = req.body.extensionArchivoCarta;
	        var base64DataCarta = req.body.archivoCarta.split(';base64,').pop();
            var nombreCarta = 'CartaResponsiva_' + result[0].idCambio +  '.' + extensionArchivoCarta;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
                setTimeout(() => {
                    fs.writeFile(saveUrl + "\\" + nombreCarta, base64DataCarta, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(saveUrl + "\\" + nombreCarta, base64DataCarta, 'base64', function (err) {
                    if (err) {
                        console.log('Ha ocurrido un error: ' + err);
                    }
                });
            }
            //Pagare 
            var extensionArchivoPagare = req.body.extensionArchivoPagare;
	        var base64DataPagare = req.body.archivoPagare.split(';base64,').pop();
            var nombrePagare = 'Pagare_' + result[0].idCambio +  '.' + extensionArchivoPagare;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
                setTimeout(() => {
                    fs.writeFile(saveUrl + "\\" + nombrePagare, base64DataPagare, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(saveUrl + "\\" + nombrePagare, base64DataPagare, 'base64', function (err) {
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

fondoFijo.prototype.post_cierreFF = function(req, res, next) {
    var self = this;
    var id_perTra = req.body.id_perTra;
    var tipo = req.body.tipo;
    var comprobante = 'DocumentoCierre.' + req.body.extensionArchivoComp;
    var arqueo = 'ArqueoCierre.' + req.body.extensionArchivoArqueo;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.INT },
        { name: 'comprobante', value: comprobante, type: self.model.types.STRING },
        { name: 'arqueo', value: arqueo, type: self.model.types.STRING },
    ]; 
    this.model.query('[dbo].[SEL_ENVIOCIERREFONDOFIJO_SP]', params, function(error, result) {
        if( result[0].success == 1){
            var saveUrl = req.body.saveUrl;
            //ComprobantePago
            var extensionArchivoCopm = req.body.extensionArchivoComp;
	        var base64DataCopm = req.body.archivoComp.split(';base64,').pop();
            var nombreComp = 'DocumentoCierre' + '.' + extensionArchivoCopm;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
                setTimeout(() => {
                    fs.writeFile(saveUrl + "\\" + nombreComp, base64DataCopm, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(saveUrl + "\\" + nombreComp, base64DataCopm, 'base64', function (err) {
                    if (err) {
                        console.log('Ha ocurrido un error: ' + err);
                    }
                });
            }
            //ComprobantePago
            var extensionArchivoArqueo = req.body.extensionArchivoArqueo;
            var base64DataArqueo = req.body.archivoArqueo.split(';base64,').pop();
            var nombreArqueo = 'ArqueoCierre' + '.' + extensionArchivoArqueo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
                setTimeout(() => {
                    fs.writeFile(saveUrl + "\\" + nombreArqueo, base64DataArqueo, 'base64', function (err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(saveUrl + "\\" + nombreArqueo, base64DataArqueo, 'base64', function (err) {
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

fondoFijo.prototype.get_misVales = function(req, res, next) {
    var self = this;
    var idusuario =  req.query.idusuario;

    var params = [
        { name: 'idusuario', value: idusuario, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_VALESXUSUARIO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_Bancos = function(req, res, next) {
    var self = this;
    var idEmpresa =  req.query.idEmpresa;
    var idSucursal =  req.query.idSucursal === undefined ? 0 : req.query.idSucursal;

    var params = [
        { name: 'id', value: idEmpresa, type: self.model.types.INT},
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT}
    ];

    this.model.query('[dbo].[SEL_BANCOS_FF_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_saveEvidencias = function(req, res, next) {
    var self = this;
    var idVale = req.body.idVale;
    var idEstatus = req.body.idEstatus;
    var nombreArchivo = req.body.nombreArchivo;
    var extensionArchivo = req.body.extensionArchivo;
	var saveUrl = req.body.saveUrl;
	var monto = req.body.monto;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var tipoGasto = req.body.tipoGasto;
    var areaAfectacion = req.body.areaAfectacion;
    var conceptoAfectacion = req.body.conceptoAfectacion;
    var numeroCuenta = req.body.numeroCuenta;
    var tipoComprobante = req.body.tipoComprobante;
    var tipoIVA = req.body.tipoIVA;
    var IVA = req.body.IVA;
    var IVAretencion = req.body.IVAretencion;
    var ISRretencion = req.body.ISRretencion;
    var subTotal = req.body.subTotal;
    var idValeEvidencia = req.body.idValeEvidencia;
    var motivoEvidencia = req.body.motivoEvidencia;


    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'idEstatus', value: idEstatus, type: self.model.types.INT },
        { name: 'tipoGasto', value: tipoGasto, type: self.model.types.INT },
        { name: 'archivo', value: nombreArchivo, type: self.model.types.STRING },
        { name: 'extension', value: extensionArchivo, type: self.model.types.STRING },
        { name: 'saveUrl', value: saveUrl, type: self.model.types.STRING },
        { name: 'areaAfectacion', value: areaAfectacion, type: self.model.types.STRING },
        { name: 'conceptoAfectacion', value: conceptoAfectacion, type: self.model.types.STRING },
        { name: 'numeroCuenta', value: numeroCuenta, type: self.model.types.STRING },
        { name: 'tipoComprobante', value: tipoComprobante, type: self.model.types.STRING },
        { name: 'monto', value: monto, type: self.model.types.DECIMAL },
        { name: 'tipoIVA', value: tipoIVA, type: self.model.types.STRING },
        { name: 'IVA', value: IVA, type: self.model.types.DECIMAL },
        { name: 'IVAretencion', value: IVAretencion, type: self.model.types.DECIMAL },
        { name: 'ISRretencion', value: ISRretencion, type: self.model.types.DECIMAL },
        { name: 'subTotal', value: subTotal, type: self.model.types.DECIMAL },
        { name: 'idComprobacion', value: idValeEvidencia, type: self.model.types.INT },
        { name: 'motivoEvidencia', value: motivoEvidencia, type: self.model.types.STRING },
    ];
    this.model.query('[dbo].[INS_VALE_EVIDENCIA_SP]', params, function(error, result) {
        if( result[0].success == 1 ){
            var nombre = nombreArchivo + '.' + extensionArchivo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
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

fondoFijo.prototype.post_saveFacturas = function(req, res, next) {
    var self = this;
    var idVale = req.body.data.idVale;
    var idEstatus = req.body.data.idEstatus;
    var nombreArchivo = req.body.data.nombreArchivo;
    var extensionArchivo = req.body.data.extensionArchivo;
	var saveUrl = req.body.data.saveUrl;
	var monto = req.body.data.monto;
    var base64Data = req.body.data.archivo.split(';base64,').pop();
    var tipoGasto = req.body.data.tipoGasto;
    var areaAfectacion = req.body.data.areaAfectacion;
    var conceptoAfectacion = req.body.data.conceptoAfectacion;
    var numeroCuenta = req.body.data.numeroCuenta;
    var tipoComprobante = req.body.data.tipoComprobante;
    var tipoIVA = req.body.data.tipoIVA;
    var IVA = req.body.data.IVA;
    var IVAretencion = req.body.data.IVAretencion;
    var ISRretencion = req.body.data.ISRretencion;
    var subTotal = req.body.data.subTotal;
    var idValeEvidencia = req.body.data.idValeEvidencia;
    var motivoEvidencia = req.body.data.motivoEvidencia;
    
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'idEstatus', value: idEstatus, type: self.model.types.INT },
        { name: 'tipoGasto', value: tipoGasto, type: self.model.types.INT },
        { name: 'archivo', value: nombreArchivo, type: self.model.types.STRING },
        { name: 'extension', value: extensionArchivo, type: self.model.types.STRING },
        { name: 'saveUrl', value: saveUrl, type: self.model.types.STRING },
        { name: 'monto', value: monto, type: self.model.types.DECIMAL },
        { name: 'areaAfectacion', value: areaAfectacion, type: self.model.types.STRING },
        { name: 'conceptoAfectacion', value: conceptoAfectacion, type: self.model.types.STRING },
        { name: 'numeroCuenta', value: numeroCuenta, type: self.model.types.STRING },
        { name: 'tipoComprobante', value: tipoComprobante, type: self.model.types.STRING },
        { name: 'tipoIVA', value: tipoIVA, type: self.model.types.STRING },
        { name: 'IVA', value: IVA, type: self.model.types.DECIMAL },
        { name: 'IVAretencion', value: IVAretencion, type: self.model.types.DECIMAL },
        { name: 'ISRretencion', value: ISRretencion, type: self.model.types.DECIMAL },
        { name: 'subTotal', value: subTotal, type: self.model.types.DECIMAL },
        { name: 'idComprobacion', value: idValeEvidencia, type: self.model.types.INT },
        { name: 'motivoEvidencia', value: motivoEvidencia, type: self.model.types.STRING },
    ];

    var nombre = nombreArchivo + '.' + extensionArchivo;
    mkdirpath(saveUrl);
    if (!fs.existsSync(saveUrl)) {
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
    if(extensionArchivo == 'pdf')
    {
    this.model.query('[dbo].[INS_VALE_EVIDENCIA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
    }
    else
    {
        self.view.expositor(res, {
            error: null,
            result: [{ success: 1, msg: 'Se inserto correctamente', idValeEvidencia: 0, saveURL : saveUrl + '/' + nombre }]
        });

    }
};


fondoFijo.prototype.post_EliminarEvidenciaFactura = function(req, res, next) {
    var self = this;
    var idValeEvidencia = req.body.idValeEvidencia;
    var params = [{ name: 'idValeEvidencia', value: idValeEvidencia, type: self.model.types.INT }];
    this.model.query('DEL_EVIDENCIAVALE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_updateEvidencias = function(req, res, next) {
    var self = this;
    var idVale = req.body.idVale;
    var idEstatus = req.body.idEstatus;
    var nombreArchivo = req.body.nombreArchivo;
    var extensionArchivo = req.body.extensionArchivo;
	var saveUrl = req.body.saveUrl;
    var monto = req.body.monto;
    var ruta = req.body.ruta;
	var base64Data = req.body.archivo.split(';base64,').pop();
    
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'idEstatus', value: idEstatus, type: self.model.types.INT },
        { name: 'archivo', value: nombreArchivo, type: self.model.types.STRING },
        { name: 'extension', value: extensionArchivo, type: self.model.types.STRING },
        { name: 'saveUrl', value: saveUrl, type: self.model.types.STRING },
        { name: 'monto', value: monto, type: self.model.types.DECIMAL }
    ];
    this.model.query('[dbo].[UPD_VALE_EVIDENCIA_SP]', params, function(error, result) {
        if( result[0].success == 1 ){
            eliminarEvidencia(ruta);
            var nombre = nombreArchivo + '.' + extensionArchivo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
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

fondoFijo.prototype.post_guardarEvidenciaComprobacion = function(req, res, next) {
    var self = this;
    var idValeEvidencia = req.body.idValeEvidencia;
    var extensionArchivo = req.body.extensionArchivo;
    var saveUrl = req.body.saveUrl;
    var base64Data = req.body.archivo.split(';base64,').pop();
    
    var params = [
        { name: 'idValeEvidencia', value: idValeEvidencia, type: self.model.types.INT },
        { name: 'extension', value: extensionArchivo, type: self.model.types.STRING },
        ];
    this.model.query('[dbo].[UPD_EVIDENCIA_COMPROBACION_SP]', params, function(error, result) {
        if( result[0].success == 1 ){
            var nombre = 'comprobacionMas_' + idValeEvidencia  + '.' + extensionArchivo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
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

fondoFijo.prototype.get_ListaVales = function(req, res, next) {
    var self = this;
    var id_perTra =  req.query.id_perTra;
    var idVale =  req.query.idVale;


    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'idVale', value: idVale, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_EVIDENCIASVALES_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ListaValesFF = function(req, res, next) {
    var self = this;
    var id_perTra =  req.query.id_perTra;


    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }];

    this.model.query('[dbo].[SEL_EVIDENCIASVALES_PERTRA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_validaFactura = function (req, res, next) {
    console.log("entando a validar rfc");
    var self = this;
    var soap = require('soap');

    var fs = require('fs');
    var pathname = req.query.path;
    fs.readFile(pathname, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error: ReadFile');
            console.log(err);
            self.view.expositor(res, {
                error: true,
                result: err
            });
        } else {
            var parseString = require('xml2js').parseString;
            var xml = data;
            parseString(xml, function (err, result) {
                if (err) {
                    console.log('Error: parseString');
                    console.log(err);
                    self.view.expositor(res, {
                        error: true,
                        result: err
                    });
                } else {
                    var xml_b64 = new Buffer(xml).toString('base64');
                    var url = 'http://cfdiee.com:8080/Validadorfull/Validador?wsdl';
                    var args = { xml: xml_b64 };
                    soap.createClient(url, function (err, client) {
                        if (err) {
                            console.log("soap.createClient");
                            console.log(err);

                            var fs = require("fs");
                            fs.unlink(pathname, function (err) {
                                var uri = pathname.split('.');
                                uri[1] = 'pdf';
                                var suri = uri.join('.');
                                fs.unlink(suri, function (err) { });

                                if (err) {
                                    console.error(err);
                                }
                            });

                            self.view.expositor(res, {
                                error: false,
                                result: { return: { codigo: 2, Incidencia: err.code, Mensaje: "No se ha podido validar la factura, intente más tarde." } }
                            });
                        } else {
                            client.ValidaAll(args, function (err, validacion) {
                                if (err) {
                                    console.log("client.ValidaAll");
                                    console.log(err);
                                    self.view.expositor(res, {
                                        error: false,
                                        result: { return: { codigo: 0, Mensaje: err.code } }
                                    });
                                } else {
                                    var codigo = 1;
                                    if (codigo == 0) {
                                        console.log("entro aqui");
                                        var fs = require("fs");
                                        fs.unlink(pathname, function (err) {
                                            var uri = pathname.split('.');
                                            uri[1] = 'pdf';
                                            var suri = uri.join('.');
                                            fs.unlink(suri, function (err) { });

                                            if (err) {
                                                console.error(err);
                                            }
                                        });
                                    } else {

                                        validacion.xml = data;
                                        validacion.xml_objet = result;
                                    }
                                    self.view.expositor(res, {
                                        error: false,
                                        result: validacion
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

fondoFijo.prototype.get_insertarFactura = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idVale', value: req.query.idVale, type: self.model.types.INT },
        { name: 'numFactura', value: req.query.numFactura, type: self.model.types.STRING },
        { name: 'uuid', value: req.query.uuid, type: self.model.types.STRING },
        { name: 'fechaFactura', value: req.query.fechaFactura, type: self.model.types.STRING },
        { name: 'subTotal', value: req.query.subTotal, type: self.model.types.DECIMAL },
        { name: 'iva', value: req.query.iva, type: self.model.types.DECIMAL },
        { name: 'total', value: req.query.total, type: self.model.types.DECIMAL },
        //{ name: 'xml', value: req.query.xml, type: self.model.types.STRING },
        { name: 'rfcEmisorRazon', value: req.query.rfcEmisorRazon, type: self.model.types.STRING },
        { name: 'rfcEmisor', value: req.query.rfcEmisor, type: self.model.types.STRING },
        { name: 'rfcReceptor', value: req.query.rfcReceptor, type: self.model.types.STRING },
        { name: 'mesCorriente', value: req.query.mesCorriente, type: self.model.types.INT },
        { name: 'tipoNotificacion', value: req.query.tipoNotificacion, type: self.model.types.INT },
        { name: 'estatusNotificacion', value: req.query.estatusNotificacion, type: self.model.types.INT }
    ];
    this.model.query('INS_FACTURA_VALE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_insertarFacturaOrden = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idVale', value: req.query.idVale, type: self.model.types.INT },
        { name: 'idEstatus', value: req.query.idEstatus, type: self.model.types.INT },
        { name: 'tipoGasto', value: req.query.tipoGasto, type: self.model.types.INT },
        { name: 'iva', value: req.query.iva, type: self.model.types.DECIMAL },
        { name: 'monto', value: req.query.monto, type: self.model.types.DECIMAL },
        { name: 'uuid', value: req.query.uuid, type: self.model.types.STRING },
        { name: 'rfcEmisor', value: req.query.rfcEmisor, type: self.model.types.STRING },
        { name: 'rfcReceptor', value: req.query.rfcReceptor, type: self.model.types.STRING },
        { name: 'fechaFactura', value: req.query.fechaFactura, type: self.model.types.STRING },
        { name: 'PER_IDPERSONA', value: req.query.PER_IDPERSONA, type: self.model.types.INT },
        { name: 'ordenCompra', value: req.query.ordenCompra, type: self.model.types.STRING },
        { name: 'motivoEvidencia', value:  req.query.motivoEvidencia, type: self.model.types.STRING },
    ];
    this.model.query('INS_FACTURA_VALE__ORDEN_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_guardaPolizaCVFR = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'id_perTra', value: req.query.id_perTra, type: self.model.types.INT },
        { name: 'idVale', value: req.query.idVale, type: self.model.types.INT },
        { name: 'idComprobacionVale', value: req.query.idComprobacionVale, type: self.model.types.INT },
        { name: 'idTramiteConcepto', value: req.query.idTramiteConcepto, type: self.model.types.INT },
        { name: 'idComprobacionConcepto', value: req.query.idComprobacionConcepto, type: self.model.types.INT },
        { name: 'monto', value: req.query.monto, type: self.model.types.DECIMAL },
        { name: 'idTramite', value: req.query.idTramite, type: self.model.types.INT }
    ];
    this.model.query('INS_POLIZASCOMPROBACIONFFGV', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_obtieneCorreoFFAG = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idRol', value: req.query.idRol, type: self.model.types.INT }
    ];
    this.model.query('SEL_OBTIENECORREOFINANZASFFAG', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_obtieneCorreoReembolso = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
    ];
    this.model.query('SEL_OBTIENECORREOXSUCURSAL', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_polizasCompFFGV = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_PolizasCompFFGV_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_estatusReembolso = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_ESTATUSREEMBOLSO_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_updateTramiteValeEvidencia = function(req, res, next) {
    var self = this;
    var idValeEvidencia = req.body.idValeEvidencia;
    var accion = req.body.accion;
    var comentario =  req.body.comentario;
    var compNoAutorizado = req.body.compNoAutorizado;
    var idUsuario = req.body.idUsuario;
    
    var params = [
        { name: 'idValeEvidencia', value: idValeEvidencia, type: self.model.types.INT },
        { name: 'accion', value: accion, type: self.model.types.INT },
        { name: 'comentario', value: comentario, type: self.model.types.STRING },
        { name: 'compNoAutorizado', value: compNoAutorizado, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
    ];
    
    this.model.query('[dbo].[UPD_SEGUIMIENTOVALEEVIDENCIA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_FondoFijoxSucursalUsuario = function(req, res, next) {
    var self = this;
    var idUsuario =  req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_FONDOFIJOXSUCURSALUSUARIO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_parametroFondoFijo = function(req, res, next) {
    var self = this;
    var idUsuario =  req.query.userId;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_PARAMETROFONDOFIJO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_updParametroFondoFijo = function(req, res, next) {
    var self = this;
    var idUsuario =  req.query.userId;
    var porcentaje =  req.query.porcentaje;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'porcentaje', value: porcentaje, type: self.model.types.DECIMAL} 
    ];

    this.model.query('[dbo].[UPD_PARAMETROFONDOFIJO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_estatusFondoFijoVale = function(req, res, next) {
    var self = this;
    var tipo =  req.query.tipo;
    var params = [
        { name: 'tipo', value: tipo, type: self.model.types.INT }];
    this.model.query('SEL_FONDOFIJOVALE_ESTATUS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_aprobarRechazarTramite = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var estatus = req.query.estatus;
    var observaciones = req.query.observaciones;

    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT },
        { name: 'estatus', value: estatus, type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_FONDO_APROBAR_RECHAZAR_TRAMITE_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_aprobarRechazarTramiteAD = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var estatus = req.query.estatus;
    var observaciones = req.query.observaciones;

    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT },
        { name: 'estatus', value: estatus, type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_FONDO_APROBAR_RECHAZAR_TRAMITEAD_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_paramFondoFijo = function(req, res, next) {
    var self = this;
    var parametro = req.query.parametro;
    var params = [{ name: 'parametro', value: parametro, type: self.model.types.STRING }];
    this.model.query('SEL_PARAM_FONDOFIJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_guardarSalidaFF = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var estatus = req.query.estatus;
    var tipo = req.query.tipo;
    var bancoSalida = req.query.bancoSalida;
    var bancoEntrada = req.query.bancoEntrada;
    var numCuentaSalida = req.query.numCuentaSalida;
    var cuentaContableSalida = req.query.cuentaContableSalida;
    var numCuentaEntrada = req.query.numCuentaEntrada;
    var cuentaContableEntrada = req.query.cuentaContableEntrada;
    var idTramiteTesoreria = req.query.idTramiteTesoreria;
    var monto = req.query.monto;
 
    var params = [{ name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
                    { name: 'estatus', value: estatus, type: self.model.types.INT},
                    { name: 'tipo', value: tipo, type: self.model.types.INT},
                    { name: 'bancoSalida', value: bancoSalida, type: self.model.types.INT},
                    { name: 'bancoEntrada', value: bancoEntrada, type: self.model.types.INT},
                    { name: 'numCuentaSalida', value: numCuentaSalida, type: self.model.types.STRING},
                    { name: 'cuentaContableSalida', value: cuentaContableSalida, type: self.model.types.STRING},
                    { name: 'numCuentaEntrada', value: numCuentaEntrada, type: self.model.types.STRING},
                    { name: 'cuentaContableEntrada', value: cuentaContableEntrada, type: self.model.types.STRING},
                    { name: 'idTramiteTesoreria', value: idTramiteTesoreria, type: self.model.types.INT},
                    { name: 'monto', value: monto, type: self.model.types.DECIMAL},
        ];
    this.model.query('UPD_FONDO_SALIDAEFECTIVO_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_BancosFondo = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var tipo = req.query.tipo;


    var params = [{ name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
                    { name: 'tipo', value: tipo, type: self.model.types.INT}
        ];
    this.model.query('SEL_FONDOBANCOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_guardarReembolso = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var tipo = req.query.tipo;
    var bancoSalida = req.query.bancoSalida;
    var bancoEntrada = req.query.bancoEntrada;
    var estatus = req.query.estatus;
    var numCuentaSalida = req.query.numCuentaSalida;
    var cuentaContableSalida = req.query.cuentaContableSalida;
    var numCuentaEntrada = req.query.numCuentaEntrada;
    var cuentaContableEntrada = req.query.cuentaContableEntrada;
    var idTramiteTesoreria = req.query.idTramiteTesoreria;

    var params = [{ name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
                    { name: 'bancoSalida', value: bancoSalida, type: self.model.types.INT},
                    { name: 'bancoEntrada', value: bancoEntrada, type: self.model.types.INT},
                    { name: 'tipo', value: tipo, type: self.model.types.INT},
                    { name: 'estatus', value: estatus, type: self.model.types.INT},
                    { name: 'numCuentaSalida', value: numCuentaSalida, type: self.model.types.STRING},
                    { name: 'cuentaContableSalida', value: cuentaContableSalida, type: self.model.types.STRING},
                    { name: 'numCuentaEntrada', value: numCuentaEntrada, type: self.model.types.STRING},
                    { name: 'cuentaContableEntrada', value: cuentaContableEntrada, type: self.model.types.STRING},
                    { name: 'idTramiteTesoreria', value: idTramiteTesoreria, type: self.model.types.INT},
        ];
    this.model.query('UPD_FONDO_REEMBOLSO_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_guardarReembolsoTramite = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var tipo = req.query.tipo;
    var bancoSalida = req.query.bancoSalida;
    var bancoEntrada = req.query.bancoEntrada;
    var estatus = req.query.estatus;
    var numCuentaSalida = req.query.numCuentaSalida;
    var cuentaContableSalida = req.query.cuentaContableSalida;
    var numCuentaEntrada = req.query.numCuentaEntrada;
    var cuentaContableEntrada = req.query.cuentaContableEntrada;
    var idTramiteTesoreria = req.query.idTramiteTesoreria;

    var params = [{ name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
                    { name: 'bancoSalida', value: bancoSalida, type: self.model.types.INT},
                    { name: 'bancoEntrada', value: bancoEntrada, type: self.model.types.INT},
                    { name: 'tipo', value: tipo, type: self.model.types.INT},
                    { name: 'estatus', value: estatus, type: self.model.types.INT},
                    { name: 'numCuentaSalida', value: numCuentaSalida, type: self.model.types.STRING},
                    { name: 'cuentaContableSalida', value: cuentaContableSalida, type: self.model.types.STRING},
                    { name: 'numCuentaEntrada', value: numCuentaEntrada, type: self.model.types.STRING},
                    { name: 'cuentaContableEntrada', value: cuentaContableEntrada, type: self.model.types.STRING},
                    { name: 'idTramiteTesoreria', value: idTramiteTesoreria, type: self.model.types.INT},
        ];
    this.model.query('UPD_FONDO_REEMBOLSO_TRAMITE_V1_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



fondoFijo.prototype.get_eliminaEvidencia = function (req, res, next) {
    var self = this;
    var idValeEvidencia = req.query.idValeEvidencia;
    var pathname =  req.query.url;
    var params = [{ name: 'idValeEvidencia', value: idValeEvidencia, type: self.model.types.STRING }];
  
    this.model.query('DEL_EVIDENCIAVALE_SP', params, function (error, result) {
        if( result[0].success == 1){
            var fs = require("fs");
            fs.unlink(pathname,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
            });
        }
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_idPersonabyUsuario = function (req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var params = [{ name: 'idUsuario', value: idUsuario, type: self.model.types.INT }];
  
    this.model.query('SEL_IDPERSONABYUSUARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.post_insertPoliza= function(req, res, next) {
    var self = this;
    var idusuario = req.body.idusuario;
    var idsucursal = req.body.idsucursal;
    var tipoProceso =  req.body.tipoProceso;
    var documentoOrigen = req.body.documentoOrigen;
    var ventaUnitario =  req.body.ventaUnitario;
    var tipoProducto =  req.body.tipoProducto;
    var canal =  req.body.canal;
    var id_perTra =  req.body.id_perTra;
    var banco =  req.body.banco;
    var departamento =  req.body.departamento;
    var ordenCompra = req.body.ordenCompra;
    var ordenesMasivas = req.body.ordenesMasivas;
    
    var params = [
        { name: 'idusuario', value: idusuario, type: self.model.types.INT },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
        { name: 'tipoProceso', value: tipoProceso, type: self.model.types.INT },
        { name: 'documentoOrigen', value: documentoOrigen, type: self.model.types.STRING },
        { name: 'ventaUnitario', value: ventaUnitario, type: self.model.types.DECIMAL },
        { name: 'tipoProducto', value: tipoProducto, type: self.model.types.STRING },
        { name: 'canal', value: canal, type: self.model.types.STRING },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'banco', value: banco, type: self.model.types.STRING },
        { name: 'departamento', value: departamento, type: self.model.types.STRING },
        { name: 'ordenCompra', value: ordenCompra, type: self.model.types.STRING },
        { name: 'ordenMasiva', value: ordenesMasivas, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_POLIZA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_insertPolizaFront= function(req, res, next) {
    var self = this;
    var idusuario = req.body.idusuario;
    var idsucursal = req.body.idsucursal;
    var tipoProceso =  req.body.tipoProceso;
    var documentoOrigen = req.body.documentoOrigen;
    var ventaUnitario =  req.body.ventaUnitario;
    var tipoProducto =  req.body.tipoProducto;
    var canal =  req.body.canal;
    var id_perTra =  req.body.id_perTra;
    var banco =  req.body.banco;
    var departamento =  req.body.departamento;
    
    var params = [
        { name: 'idusuario', value: idusuario, type: self.model.types.INT },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
        { name: 'tipoProceso', value: tipoProceso, type: self.model.types.INT },
        { name: 'documentoOrigen', value: documentoOrigen, type: self.model.types.STRING },
        { name: 'ventaUnitario', value: ventaUnitario, type: self.model.types.DECIMAL },
        { name: 'tipoProducto', value: tipoProducto, type: self.model.types.STRING },
        { name: 'canal', value: canal, type: self.model.types.STRING },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'banco', value: banco, type: self.model.types.STRING },
        { name: 'departamento', value: departamento, type: self.model.types.STRING }
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_POLIZA_FRONT_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_insertPolizaOrden= function(req, res, next) {
    var self = this;
    var idempresa = req.body.idempresa;
    var idsucursal = req.body.idsucursal;
    var proceso =  req.body.proceso;
    var foliofondo = req.body.foliofondo;
    var venta =  req.body.venta;
    var id_perTra =  req.body.id_perTra;
    
    var params = [
        { name: 'idempresa', value: idempresa, type: self.model.types.INT },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
        { name: 'proceso', value: proceso, type: self.model.types.STRING },
        { name: 'foliofondo', value: foliofondo, type: self.model.types.STRING },
        { name: 'venta', value: venta, type: self.model.types.DECIMAL },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_POLIZA_ORDEN_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_insertOrdenMasiva= function(req, res, next) {
    var self = this;
    var idusuario = req.body.idusuario;
    var idempresa = req.body.idempresa;
    var idsucursal = req.body.idsucursal;
    var id_perTra = req.body.id_perTra;
    var proceso =  req.body.proceso;
    var producto =  req.body.producto;
    // var observaciones =  req.body.observaciones;
    // var precioUnitario =  req.body.precioUnitario;
    // var areaAfectacion =  req.body.areaAfectacion;
    // var conceptoContable =  req.body.conceptoContable;
    // var tipoComprobante  =  req.body.tipoComprobante ;
    // var producto =  req.body.producto;
    // var observaciones =  req.body.observaciones;
    // var descuento =  req.body.descuento;
    
    var params = [
        { name: 'idusuario', value: idusuario, type: self.model.types.INT },
        { name: 'idempresa', value: idempresa, type: self.model.types.INT },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.STRING },
        { name: 'proceso', value: proceso, type: self.model.types.STRING },
        { name: 'producto', value: producto, type: self.model.types.STRING }
        // { name: 'precioUnitario', value: precioUnitario, type: self.model.types.DECIMAL },
        // { name: 'areaAfectacion', value: areaAfectacion, type: self.model.types.STRING },
        // { name: 'conceptoContable', value: conceptoContable, type: self.model.types.STRING },
        // { name: 'tipoComprobante', value: tipoComprobante, type: self.model.types.STRING },
        // { name: 'observaciones', value: observaciones, type: self.model.types.STRING },
        // { name: 'descuento', value: descuento, type: self.model.types.DECIMAL }
    ];
    
    this.model.query('[dbo].[INS_FONDOFIJO_ORDENMASIVA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_verificaValesEvidencia = function(req, res, next) {
    var self = this;
    var idVale =  req.query.idVale;
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT }];
    this.model.query('SEL_VERIFICARVALES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_valeSinComprobar = function(req, res, next) {
    var self = this;
    var idVale =  req.query.idVale;
    var monto =  req.query.monto;
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'monto', value: monto, type: self.model.types.DECIMAL }
    ];
    this.model.query('UPD_SEGUIMIENTOVALEEVIDENCIA_EFECTIVO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

// fondoFijo.prototype.get_ConceptoAfectacion = function (req, res, next) {
//     var self = this;
//     var params = [
//         { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
//         { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
//         { name: 'areaAfec', value: req.query.areaAfec, type: self.model.types.STRING },
//         { name: 'retencion', value: req.query.retencion, type: self.model.types.STRING },
//     ];

//     this.model.query('[Tramite].[Sp_Tramite_ConceptoAfectacion_GETLBySucursal]', params, function (error, result) {
//         self.view.expositor(res, {
//             error: error,
//             result: result
//         });
//     });
// };

fondoFijo.prototype.get_ConceptoAfectacion = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_ConceptoAfectacion_GETLBySucursal]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_departamentosPorEvidencia = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idValeEvidencia', value: req.query.idValeEvidencia, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ValeEvidenciaDepartamento_GETLByIdEvidencia]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_valesTipoComprobante = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idsucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_TipoConceptoAfectacion_GETLBySucursal]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



fondoFijo.prototype.post_guardarEvidenciaDepartamento = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idDepartamento', value: req.body.idDepartamento, type: self.model.types.INT },
        { name: 'porcentaje', value: req.body.porcentaje, type: self.model.types.STRING },
        { name: 'idValeEvidencia', value: req.body.idValeEvidencia, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_ValeEvidenciaDepartamento_INS]', params, function (error, result) {
        var resultado = {
            respuesta: 0,
            mensaje: 'Se genero un error al procesar la solicitud',
            idRegistro: 0
        }
        if (result != null && result != 'undefined') {
            resultado.respuesta = 1;
            resultado.mensaje = 'Solicitud procesada correctamente';
            resultado.idRegistro = result[0].resultado;
        }
        self.view.expositor(res, {
            error: error,
            result: resultado
        });
    });
};


fondoFijo.prototype.post_eliminaDepartamentoEvidencia = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idValeEvidenciaDepartamento', value: req.body.idValeEvidenciaDepartamento, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_EvidenciaDepartamento_DEL]', params, function (error, result) {
        var resultado = {
            respuesta: 0,
            mensaje: 'Se genero un error al procesar la solicitud',
            idRegistro: 0
        }
        if (result != null && result != 'undefined') {
            resultado.respuesta = 1;
            resultado.mensaje = 'Solicitud procesada correctamente';
            resultado.idRegistro = result[0].resultado;
        }
        self.view.expositor(res, {
            error: error,
            result: resultado
        });
    });
};


fondoFijo.prototype.get_dataValeXIdVale = function(req, res, next) {
    var self = this;
				  
    var idVale = req.query.idVale;			
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.STRING }
    ];
    this.model.query('SEL_VALEXIDVALE_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_dataValeXIdComprobacion = function(req, res, next) {
    var self = this;
				  
    var idComprobacion = req.query.idComprobacion;			
    var params = [
        { name: 'idComprobacion', value: idComprobacion, type: self.model.types.STRING }
    ];
    this.model.query('SEL_VALEXIDCOMPROBACION_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


fondoFijo.prototype.get_buscarAutorizador = function(req, res, next) {
    var self = this;
    var idFondoFijo = req.query.idFondoFijo;		  
    var params = [{ name: 'idFondoFijo', value: idFondoFijo, type: self.model.types.INT }];
    this.model.query('SEL_AUTORIZADOR_VALES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_eliminarSolicitudVale = function(req, res, next) {
    var self = this;
    var id = req.query.id;
    var idVale = req.query.idVale;
    var params = [
        { name: 'id', value: id, type: self.model.types.INT},
         {name: 'idVale', value: idVale, type: self.model.types.STRING }
    ];
    this.model.query('DEL_VALE_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_obtieneCC = function(req, res, next) {
    var self = this;
    var idsucursal = req.query.idsucursal;
    var poliza = req.query.poliza;
    var idDepartamento = req.query.idDepartamento;
    var params = [
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT},
        {name: 'poliza', value: poliza, type: self.model.types.STRING },
        {name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT }
    ];
    this.model.query('SEL_CUENTACONTABLEFONDO_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_obtieneCCbySucursal = function(req, res, next) {
    var self = this;
    var idsucursal = req.query.idsucursal;
    var params = [
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT}
    ];
    this.model.query('SEL_CUENTASCONTABLESFONDO_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};


fondoFijo.prototype.get_obtieneIVAbySucursal = function(req, res, next) {
    var self = this;
    var idsucursal = req.query.idsucursal;
    var params = [
        { name: 'idSucursal', value: idsucursal, type: self.model.types.INT}
    ];
    this.model.query('Tramite.Sp_Tramite_IVA_GETLBySucursal', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_actualizarComprobacionVale = function(req, res, next) {
    var self = this;
    var areaAfectacion = req.query.areaAfectacion;
    var tipoConcepto = req.query.tipoConcepto;
    var tipoComprobante = req.query.tipoComprobante;
    var tipoIva = req.query.tipoIva;
    var idComprobacionVale = req.query.idComprobacionVale;
    var idProveedor = req.query.idProveedor;

    var params = [
        { name: 'areaAfectacion', value: areaAfectacion, type: self.model.types.STRING},
        { name: 'tipoConcepto', value: tipoConcepto, type: self.model.types.STRING},
        { name: 'tipoComprobante', value: tipoComprobante, type: self.model.types.STRING},
        { name: 'tipoIva', value: tipoIva, type: self.model.types.STRING},
        { name: 'idComprobacionVale', value: idComprobacionVale, type: self.model.types.STRING},
        { name: 'idProveedor', value: idProveedor, type: self.model.types.INT},
    ];
    this.model.query('UPD_COMPROBACIONVALE_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_obtenerOrdenesCompra = function(req, res, next) {
    var self = this;
    var idProveedor = req.query.idProveedor;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;

    var params = [
        { name: 'idProveedor', value: idProveedor, type: self.model.types.INT},
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT},
    ];
    this.model.query('SEL_ORDENESCOMPRACOMPROBACION_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_transferenciaCaja = function(req, res, next) {
    var self = this;
    var idempresa = req.query.idempresa;
    var idSucursal = req.query.idSucursal;
    var cuentaOrigen = req.query.cuentaOrigen;
    var cuentaDestino = req.query.cuentaDestino;
    var monto = req.query.monto;
    var idUsuario = req.query.idUsuario;
    var referencia = req.query.referencia
    var idOrigenReferencia = req.query.idOrigenReferencia 

    var params = [
        { name: 'idempresa', value: idempresa, type: self.model.types.INT},
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        { name: 'cuentaOrigen', value: cuentaOrigen, type: self.model.types.STRING},
        { name: 'cuentaDestino', value: cuentaDestino, type: self.model.types.STRING},
        { name: 'monto', value: monto, type: self.model.types.DECIMAL},
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT},
        { name: 'referencia', value: referencia, type: self.model.types.STRING.type},
        { name: 'idOrigenReferencia', value: idOrigenReferencia, type: self.model.types.INT}
    ];
    this.model.query('TransferenciasBancariasFFGV_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_transferenciaBancos = function(req, res, next) {
    var self = this;
    var idempresa = req.query.idempresa;
    var idSucursal = req.query.idSucursal;
    var cuentaOrigen = req.query.cuentaOrigen;
    var cuentaDestino = req.query.cuentaDestino;
    var monto = req.query.monto;
    var idUsuario = req.query.idUsuario;
  

    var params = [
        { name: 'idempresa', value: idempresa, type: self.model.types.INT},
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        { name: 'cuentaOrigen', value: cuentaOrigen, type: self.model.types.STRING},
        { name: 'cuentaDestino', value: cuentaDestino, type: self.model.types.STRING},
        { name: 'monto', value: monto, type: self.model.types.DECIMAL},
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT}
    ];
    this.model.query('TraspasoBancosFFGV_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_saveTransferencia = function(req, res, next) {
    var self = this;
    var idPersona = req.query.idPersona;
    var idTramite = req.query.idTramite;
    var idTransferencia = req.query.idTransferencia;
    var solicitud  = req.query.solicitud;

    var params = [
        { name: 'idPersona', value: idPersona, type: self.model.types.INT},
        { name: 'idTramite', value: idTramite, type: self.model.types.INT},
        { name: 'idTransferencia', value: idTransferencia, type: self.model.types.INT},
        { name: 'idPertraFFyGV', value: solicitud, type: self.model.types.INT}
    ];
    this.model.query('INS_PERSONATRAMITE_TRANFERENCIAS_FFGV_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};


fondoFijo.prototype.get_ValidaOrdenCompra = function(req, res, next) {
    var self = this;
    var idOrden = req.query.idOrden;
    var idSucursal = req.query.idSucursal;

    var params = [
        { name: 'orden', value: idOrden, type: self.model.types.STRING},
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT}
    ];
    this.model.queryAllRecordSet('SEL_VALIDAESTATUSORDENCOMPRA_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_aprobarFF = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT}
    ];
    this.model.query('UPD_AUTORIZAFONDOFIJO_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.post_verificaVale = function(req, res, next) {
    var self = this;
    var idempresa = req.body.idempresa;
    var idsucursal = req.body.idsucursal;
    var idVale = req.body.idVale;
    var montoComprobacion = req.body.montoComprobacion;
    
    var params = [
        { name: 'idempresa', value: idempresa, type: self.model.types.INT },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
        { name: 'idVale', value: idVale, type: self.model.types.STRING },
        { name: 'montoComprobacion', value: montoComprobacion, type: self.model.types.DECIMAL }
    ];
    
    this.model.query('[dbo].[SEL_ESTATUSVALEORDEN_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_validaRetencionesOC = function(req, res, next) {
    var self = this;
    var idsucursal = req.query.idsucursal;
    var tipoComprobante = req.query.tipoComprobante;
    var areaAfectacion = req.query.areaAfectacion;
    var conceptoContable = req.query.conceptoContable;

    var params = [
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT},
        { name: 'tipoComprobante', value: tipoComprobante, type: self.model.types.STRING},
        { name: 'areaAfectacion', value: areaAfectacion, type: self.model.types.STRING},
        { name: 'conceptoContable', value: conceptoContable, type: self.model.types.STRING}
        
    ];
    this.model.query('SEL_VALIDARETENCIONESORDENCOMPRA_SP', params, function(error, result) {
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_buscarPersona = function(req, res, next) {
    var self = this;
    var idPersona = req.query.idPersona;	
    var esid = req.query.esid;
    var esRFC = req.query.esRFC;
    var esnombre = req.query.esnombre;
    var nombre = req.query.nombre;
    var idsucursal = req.query.idsucursal;
  
    var params = [
        { name: 'idPersona', value: idPersona, type: self.model.types.STRING },
        { name: 'esid', value: esid, type: self.model.types.INT },
        { name: 'esRFC', value: esRFC, type: self.model.types.INT },
        { name: 'esnombre', value: esnombre, type: self.model.types.INT },
        { name: 'nombre', value: nombre, type: self.model.types.STRING },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
    ];
    this.model.query('SEL_BUSCARPERSONA_V1_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_obtieneEvidenciasReembolso = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;	  
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    this.model.queryAllRecordSet('SEL_EVIDENCIASREEMBOLSOFONDOFIJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_obtieneEvidenciasReembolsoTramite = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;	  
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT }
    ];
    this.model.query('SEL_EVIDENCIASREEMBOLSOFONDOFIJO_TRAMITE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_obtieneReembolso = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;	  
    var params = [
        { name: 'id_perTra', value: idPerTra, type: self.model.types.INT }
    ];
    this.model.query('SEL_REEMBOLSOSFONDOFIJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_rechazarEvidencia = function(req, res, next) {
    var self = this;
    var razon = req.query.razon;	
    var idComprobacion = req.query.idComprobacion;  
    var params = [
        { name: 'idComprobacion', value: idComprobacion, type: self.model.types.INT },
        { name: 'razon', value: razon, type: self.model.types.STRING }
    ];
    this.model.query('UPD_EVIDENCIASRECHAZOFONDO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_infoPolizaCaja = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;	  
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }
    ];
    this.model.query('SEL_INFOPOLIZASCAJA_FFGV_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_buscarProveedor = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idProveedor', value: req.query.idProveedor, type: self.model.types.INT }
    ];
    this.model.query('SEL_OBTIENEPROVEEDOR_FFGV_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_validaValesUsuario = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];
    this.model.query('SEL_VALIDAVALESUSUARIO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_cerrarFondoFijo = function(req, res, next) {
    var self = this;
    var idFondoFijo =  req.query.idFondoFijo;

    var params = [
        { name: 'idfondo', value: idFondoFijo, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_CERRARFONDOFIJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_envioCierreFondoFijo = function(req, res, next) {
    var self = this;
    var idFondoFijo =  req.query.idFondoFijo;

    var params = [
        { name: 'idfondo', value: idFondoFijo, type: self.model.types.INT }
    ];

    this.model.query('SEL_ENVIOCIERREFONDOFIJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_cierreContraloriaFF = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT}
    ];
    this.model.query('UPD_ACTUALIZACIERREFONDOFIJO_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_cierreFF = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT}
    ];
    this.model.query('UPD_CIERREAFONDOFIJO_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_validaPeriodoContable = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'periodo', value: req.query.periodo, type: self.model.types.STRING }
    ];

    this.model.query('SEL_VALIDAPERIODOCONTABLE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_renunciaEvidencia = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idComprobacion', value: req.query.idComprobacion, type: self.model.types.INT }
    ];

    this.model.query('INS_FONDOFIJO_CANCELAORDENMASIVA_NOTI_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_actualizaEstatusNotificacion= function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idValeEvidencia', value: req.query.idValeEvidencia, type: self.model.types.INT },
        { name: 'tipo', value: req.query.tipo, type: self.model.types.INT }
    ];
    this.model.query('UPD_ESTATUSNOTIFACTURA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


fondoFijo.prototype.get_actualizaEstatusNotificacionEvidencia= function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idValeEvidencia', value: req.query.idValeEvidencia, type: self.model.types.INT },
        { name: 'estatus', value: req.query.estatus, type: self.model.types.INT }
    ];
    this.model.query('UPD_ESTATUSNOTIEVIDENCIA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_avanzarReembolso = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var idReembolso = req.query.idReembolso;
    var tipoUsuario = req.query.tipoUsuario;
    var monto = req.query.monto;
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT},
        { name: 'idReembolso', value: idReembolso, type: self.model.types.INT},
        { name: 'tipoUsuario', value: tipoUsuario, type: self.model.types.INT},
        { name: 'monto', value: monto, type: self.model.types.DECIMAL},
    ];
    this.model.query('UPD_ACTUALIZAREEMBOLSOFF_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_avanzarReembolsoTramite = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var idReembolso = req.query.idReembolso;
    var tipoUsuario = req.query.tipoUsuario;
    var monto = req.query.monto;
    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT},
        { name: 'idReembolso', value: idReembolso, type: self.model.types.INT},
        { name: 'tipoUsuario', value: tipoUsuario, type: self.model.types.INT},
        { name: 'monto', value: monto, type: self.model.types.DECIMAL},
    ];
    this.model.query('UPD_ACTUALIZAREEMBOLSOFF_V1_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_actualizaTramiteReembolso = function(req, res, next) {
    var self = this;
    var idReembolso = req.query.idReembolso;
    var idTramite = req.query.idTramite;
    var params = [
        { name: 'idReembolso', value: idReembolso, type: self.model.types.INT},
        { name: 'idTramite', value: idTramite, type: self.model.types.INT}
    ];
    this.model.query('UPD_ACTUALIZAREEMBOLSOTRAMITEFF_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_cambiaEstatusReembolso = function(req, res, next) {
    var self = this;
    var idPerTra = req.query.idPerTra;
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT}
    ];
    this.model.query('UPD_ACTUALIZAESTATUSREEMBOLSOFF_SP', params, function(error, result) {
        //console.log('resultado: ' + success)
            self.view.expositor(res, {
            error: error,		 
            result: result
        });
    });
};

fondoFijo.prototype.get_getDataOrdenPagoFF = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    var tipoProceso = req.query.tipoProceso;
    var consecutivoTramite = req.query.consecutivoTramite;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'tipoProceso', value: tipoProceso, type: self.model.types.INT },
        { name: 'consecutivoTramite', value: consecutivoTramite, type: self.model.types.INT },

    ];

    this.model.query('SEL_DATA_ORDEN_PAGO_FF_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_getDataOrdenPagoFFTramite = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    var tipoProceso = req.query.tipoProceso;
    var consecutivoTramite = req.query.consecutivoTramite;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'tipoProceso', value: tipoProceso, type: self.model.types.INT },
        { name: 'consecutivoTramite', value: consecutivoTramite, type: self.model.types.INT },

    ];

    this.model.query('SEL_DATA_ORDEN_PAGO_FF_V1_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_getDataOrdenPagoGV = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    var tipoProceso = req.query.tipoProceso;
    var consecutivoTramite = req.query.consecutivoTramite;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'tipoProceso', value: tipoProceso, type: self.model.types.INT },
        { name: 'consecutivoTramite', value: consecutivoTramite, type: self.model.types.INT },
    ];

    this.model.query('SEL_DATA_ORDEN_PAGO_GV_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_nombreClienteFA = function(req, res, next) {
    var self = this; 
    var idCliente = req.query.idCliente;

    var params = [
        { name: 'idCliente', value: idCliente, type: self.model.types.INT }
    ];

    this.model.query('SEL_CLIENTE_FA_BY_ID_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.post_saveDocumentosFA = function(req, res, next) {
    var self = this;
    var idDocumento = req.body.idDocumento;
	var idTramite = req.body.idTramite;
	var idPerTra = req.body.idPerTra;
	var saveUrl = req.body.saveUrl;
	var extensionArchivo = req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var observaciones = req.body.observaciones + '-' + req.body.consecutivoTramite;
    var params = [
        { name: 'idDocumento', value: idDocumento, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'observaciones', value: observaciones, type: self.model.types.STRING },
    ];
    
    this.model.query('INS_DPT_DETALLE_SP', params, function(error, result) {
        if( result[0].success == 1 ){
            var nombre = "Documento_" + idDocumento + '_' + observaciones + '.' + extensionArchivo;
            mkdirpath(saveUrl);
            if (!fs.existsSync(saveUrl)) {
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


fondoFijo.prototype.get_changeEstatusFA = function(req, res, next) {
    var self = this; 
    var idPerTra = req.query.idPerTra;
    var tipoTramite = req.query.tipoTramite;
    var consecutivoTramite = req.query.consecutivoTramite;
    
    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'tipoProceso', value: tipoTramite, type: self.model.types.INT },
        { name: 'consecutivoTramite', value: consecutivoTramite, type: self.model.types.INT },
    ];

    this.model.query('UPD_ESTATUS_ORDEN_PAGO_VALIDA_CUENTA_FA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_imageComprobante = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var idTramite = req.query.idTramite;
    var tipo = req.query.tipo;
    var consecutivoTramite = req.query.consecutivoTramite;
    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'tipo', value: tipo, type: self.model.types.STRING },
        { name: 'consecutivoTramite', value: consecutivoTramite, type: self.model.types.STRING },
    ];
    
    this.model.query('SEL_FA_DOCUMENTO_COMPROBANTE_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_departamentosXFondo = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idFondo', value: req.query.idFondo, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEPARTAMENTOSXFONDO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_departamentosXFondosFijos = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idFondo', value: req.query.idFondo, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEPARTAMENTOSXFONDOSFIJOS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_buscarAutorizadorXDepartamento = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT }
    ];
    this.model.query('SEL_AUTORIZADORESVALESXDEPARTAMENTO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_buscarAutorizadorXDepartamentoArea = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT }
    ];
    this.model.query('SEL_AUTORIZADORESVALESXDEPARTAMENTOAREA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_buscarAutorizadorXDepartamentoFF = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];
    this.model.query('SEL_AUTORIZADORESFONFOXDEPARTAMENTO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

function eliminarEvidencia (pathname)
{
    var fs = require("fs");
    fs.unlink(pathname,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
    });
}
function mkdirpath(dirPath)
{
    if(!fs.existsSync(dirPath))
    {
        try
        {
            fs.mkdirSync(dirPath);
        }
        catch(e)
        {
            mkdirpath(path.dirname(dirPath));
            mkdirpath(dirPath);
        }
    }
}

fondoFijo.prototype.get_ObtieneReferencia = function (req, res, next) {
    var self = this;
    
    var params = [
        
        { name:'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT},
        { name:'idSucursal', value: req.query.idSucursal, type: self.model.types.INT},
        { name:'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT},
        { name:'idOrigenReferencia', value: req.query.idOrigenReferencia, type: self.model.types.INT},
        { name:'idBancoOrigen', value: req.query.idBancoOrigen, type: self.model.types.INT},
        { name:'idBancoDestino', value: req.query.idBancoDestino, type: self.model.types.INT},
        { name:'documento', value: req.query.documento, type: self.model.types.STRING.type},
        { name:'importe', value: req.query.importe, type: self.model.types.DECIMAL},
        { name:'idPersona', value: req.query.idPersona, type: self.model.types.INT}
    ];

    this.model.query('referencias.dbo.INS_REFERENCIAS_TRAMITES_SP ', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ObtieneValesVencidos = function (req, res, next) {
    var self = this;
    
    var params = [
    ];

    this.model.query('OBTIENE_INFORMACION_VALES_VENCIDOS ', [], function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ObtieneValesVencidosV2 = function (req, res, next) {
    var self = this;
    
    var params = [
    ];

    this.model.query('OBTIENE_INFORMACION_VALES_VENCIDOS_V2 ', [], function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ActualizaEstatusNotificacionesVales = function (req, res, next) {
    var self = this;
    
    var params = [
        { name:'id', value: req.query.id, type: self.model.types.INT},
        { name:'notificaUsuario', value: req.query.notificaUsuario, type: self.model.types.INT},
        { name:'notificaNomina', value: req.query.notificaNomina, type: self.model.types.INT},
        { name:'notificaContraloria', value: req.query.notificaContraloria, type: self.model.types.INT},
        { name:'notificaFinanzas', value: req.query.notificaFinanzas, type: self.model.types.INT}
    ];

    this.model.query('ACTUALIZA_VALE_NOTIFICACION ', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


fondoFijo.prototype.get_ObtieneTablaParametrosValesVencidos = function (req, res, next) {
    var self = this;
    
    var params = [
        { name:'tabla', value: req.query.tabla, type: self.model.types.STRING.type}
    ];

    this.model.query('OBTIENE_PARAMETROS', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_DatosPolizaOP = function (req, res, next) {
    var self = this;
    
    var params = [
        { name:'id_cuenta', value: req.query.id_cuenta, type: self.model.types.INT}
    ];

    this.model.query('[Tramite].[Sp_Tramite_GDM_DatosPolizaOP_GET]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_getAutorizadorVale = function (req, res, next) {
    var self = this;
    
    var params = [
        { name:'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT},
        { name:'idSucursal', value: req.query.idSucursal, type: self.model.types.INT},
        { name:'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT}
    ];

    this.model.query('[DBO].[SEL_AUTORIZADOR_VALE_FF]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_toleranciaVale = function (req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('[dbo].[SEL_PARAMETRO_TOLERANCIAVALES_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_allEmpresas = function(req, res, next){
    var self = this;
    
    var params = [
        { name:'usu_idusuario', value: req.query.usu_idusuario, type: self.model.types.INT}
    ];

    this.model.query('[SEL_EMPRESAS_RAZON_SOCIAL]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_reembolsosxFondo = function(req, res, next){
    var self = this;
    
    var params = [
        { name:'idfondoFijo', value: req.query.idfondoFijo, type: self.model.types.INT}
    ];

    this.model.query('[SEL_REEMBOLSOSXFONDOFIJO_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_verificaReembolsos = function(req, res, next){
    var self = this;
    
    var params = [];

    this.model.queryAllRecordSet('[SEL_VERIFICAREEMBOLSOS_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_verificaRechazoFinanzas = function(req, res, next){
    var self = this;
    
    var params = [];

    this.model.query('[SEL_VERIFICARECHAZOSFINANZAS_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_verificaValesDescuento = function(req, res, next){
    var self = this;
    
    //var params = [{ name: 'fechaInicio', value: req.query.finicio, type: self.model.types.STRING  },
      //            { name: 'fechaFin', value: req.query.fFin, type: self.model.types.STRING }];
    var params = []; 
    this.model.query('[SEL_VERIFICAVALESDESCUENTO_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_direccionLugarTrabajo = function (req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        ];
  
    this.model.query('SEL_USUARIOVSLUGARTRABAJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_verificaEstatusVales = function(req, res, next){
    var self = this;
    
    var params = []; 
    this.model.query('[SEL_VERIFICARESTATUSVALES_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_verificaCajeroEspejo = function(req, res, next){
    var self = this;
    
    var params = []; 
    this.model.query('[SEL_VERIFICACONFCAJEROESPEJO]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_actualizaUsuarioEspejo = function (req, res, next) {
    var self = this;
    var id = req.query.id;
    var idEstatus = req.query.idEstatus;
    var idUsuario = req.query.idUsuario;
  
    var params = [
        { name: 'id', value: id, type: self.model.types.INT },
        { name: 'idEstatus', value: idEstatus, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        ];
  
    this.model.query('UPD_USUARIOCAJA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_autorizadoresCajeroEspejo = function (req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
  
    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        ];
  
    this.model.query('SEL_VERIFICARAUTORIZADORESCAJEROESPEJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

fondoFijo.prototype.get_reembolsoBancos = function(req, res, next) {
    var self = this;
    var id_perTra =  req.query.id_perTra;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_REEMBOLSO_BANCOSFF_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


fondoFijo.prototype.get_validaValeApertura = function (req, res, next) {
    var self = this;
    var idVale = req.query.idVale;
  
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        ];
  
    this.model.query('SEL_VALIDAVALEAPERTURA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_actualizaAperturaVale = function (req, res, next) {
    var self = this;
    var idVale = req.query.idVale;
    var razonApertura = req.query.razonApertura;
  
    var params = [
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'razonApertura', value: razonApertura, type: self.model.types.STRING },

        ];
  
    this.model.query('UPD_MOTIVOAPERTURAVALE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ValidaNotificacion = function(req, res, next) {
    var self = this;
    var id_perTra =  req.query.id_perTra;
    var idVale =  req.query.idVale;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'idVale', value: idVale, type: self.model.types.INT }
    ];
    this.model.query('[dbo].[SEL_VALIDANOTIFICACION_FF_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_dataComplementoFF = function(req, res, next) {
    var self = this;
    var id_perTra           =  req.query.id_perTra;
    var idVale              =  req.query.idVale;
    var idUsuario           =  req.query.idUsuario;
    var idEmpresa           =  req.query.idEmpresa;
    var IdSucursal          =  req.query.IdSucursal;
    var ProcesoPol          =  req.query.ProcesoPol;
    var idValeEvidenciaAPI  =  req.query.idValeEvidenciaAPI;
    var opcionFF            =  req.query.opcionFF;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'idVale', value: idVale, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'IdSucursal', value: IdSucursal, type: self.model.types.INT },
        { name: 'ProcesoPol', value: ProcesoPol, type: self.model.types.STRING.type },
        { name: 'idValeEvidenciaAPI', value: idValeEvidenciaAPI, type: self.model.types.STRING.type },
        { name: 'opcionFF', value: opcionFF, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_DATACOMPLEMENTOFF_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ActualizaTramitePolizaFF = function(req, res, next) {
    var self = this;
    var idValeFF = req.query.idValeFF;
    var idUsuario = req.query.idUsuario;
    var poliza = req.query.poliza;
    var documentoConcepto = req.query.documentoConcepto;
    var incremental = req.query.incremental;
    var ordenCompra = req.query.ordenCompra;
    var consPol = req.query.consPol;
    var mesPol = req.query.mesPol;
    var anioPol = req.query.anioPol;

    var params = [
         { name: 'idValeFF', value: idValeFF, type: self.model.types.INT }
        ,{ name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
        ,{ name: 'poliza', value: poliza, type: self.model.types.STRING }
        ,{ name: 'documentoConcepto', value: documentoConcepto, type: self.model.types.STRING }
        ,{ name: 'incremental', value: incremental, type: self.model.types.INT }
        ,{ name: 'ordenCompra', value: ordenCompra, type: self.model.types.STRING }
        ,{ name: 'consPol', value: consPol, type: self.model.types.INT }
        ,{ name: 'mesPol', value: mesPol, type: self.model.types.INT }
        ,{ name: 'anioPol', value: anioPol, type: self.model.types.INT }
    ];    
    this.model.query('UPD_TRAMITE_FONDO_FIJO', params, function(error, result) {        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_ActualizaTramitePolizaFFOrdenCompra = function(req, res, next) {
    var self = this;
    var idValeFF = req.query.idValeFF;
    var idUsuario = req.query.idUsuario;
    var poliza = req.query.poliza;
    var documentoConcepto = req.query.documentoConcepto;
    var incremental = req.query.incremental;
    var ordenCompra = req.query.ordenCompra;
    var consPol = req.query.consPol;
    var mesPol = req.query.mesPol;
    var anioPol = req.query.anioPol;

    var params = [
         { name: 'idValeFF', value: idValeFF, type: self.model.types.INT }
        ,{ name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
        ,{ name: 'poliza', value: poliza, type: self.model.types.STRING }
        ,{ name: 'documentoConcepto', value: documentoConcepto, type: self.model.types.STRING }
        ,{ name: 'incremental', value: incremental, type: self.model.types.INT }
        ,{ name: 'ordenCompra', value: ordenCompra, type: self.model.types.STRING }
        ,{ name: 'consPol', value: consPol, type: self.model.types.INT }
        ,{ name: 'mesPol', value: mesPol, type: self.model.types.INT }
        ,{ name: 'anioPol', value: anioPol, type: self.model.types.INT }
    ];    
    this.model.query('UPD_TRAMITE_FONDO_FIJO', params, function(error, result) {        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

fondoFijo.prototype.get_verificaDatosPolizaApi = function(req, res, next) {
    var self = this; 
    var idVale =  req.query.idVale;
    var idValeEvidencia =  req.query.idValeEvidencia;
    var params = [
         { name: 'idVale', value: idVale, type: self.model.types.INT }
        ,{ name: 'idValeEvidencia', value: idValeEvidencia, type: self.model.types.INT }
    ];
    this.model.query('SEL_VERIFICARVALES_SP_V2', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = fondoFijo;