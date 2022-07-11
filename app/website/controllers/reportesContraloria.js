var reportesContraloriaView = require('../views/reference'),
    reportesContraloriaModel = require('../models/dataAccess'),
    fs = require("fs");

var reportesContraloria = function(conf){
    this.conf = conf || {};

    this.view = new reportesContraloriaView();
    this.model = new reportesContraloriaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
}

reportesContraloria.prototype.get_listaReportesContraloria = function(req, res, next){
    var self = this;

    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('SEL_LISTATRAMITESCONTRALORIA', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesContraloria.prototype.get_getDataReporte = function(req, res, next){
    var self = this;

    var id = req.query.id;

    var params = [
        { name: 'id', value: id, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_DATA_REPORTE_CONTRALORIA', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesContraloria.prototype.get_catalogoMonedas = function(req, res, next){
    var self = this;

    this.model.query('SEL_OBTIENE_CAT_MONEDAS', [], function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}


reportesContraloria.prototype.get_guardaArqueo = function(req, res, next){
    var self = this;

    var cabecero  = req.query.cabecero ;
    var detalle = req.query.detalle;

    console.log('cabecero ', cabecero)
    console.log('detalle ', detalle)

    var params = [
        { name: 'cabecero',     value: cabecero,      type: self.model.types.STRING.type },
        { name: 'detalle',       value: detalle,       type: self.model.types.STRING.type },
        { name: 'keyId',       value: req.query.keyId,       type: self.model.types.STRING.type },
        { name: 'idUsu',       value: req.query.idUsu,       type: self.model.types.INT },
        { name: 'idFondoFijo',       value: req.query.idFondoFijo,       type: self.model.types.STRING.type },
        { name: 'comentarios',       value: req.query.comentarios,       type: self.model.types.STRING.type }
    ];


    this.model.query('INS_GUARDA_ARQUEO', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
    
}

reportesContraloria.prototype.get_ObtieneDatosVales = function(req, res, next){
    var self = this;

    var id  = req.query.id;
    var estatus  = req.query.estatus;

    var params = [
        { name: 'id',     value: id,      type: self.model.types.STRING.type },
        { name: 'estatus', value: estatus,      type: self.model.types.INT }

    ];


    this.model.query('SEL_REPORT_EVIDENCIAS_BY_IDPERTRA', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
    
}

reportesContraloria.prototype.get_ObtieneDatosComprobaciones = function(req, res, next){
    var self = this;

    var id  = req.query.id;
    var tipo  = req.query.tipo;

    var params = [
        { name: 'id',     value: id,      type: self.model.types.STRING.type },
        { name: 'tipo',   value: tipo,      type: self.model.types.INT }
    ];


    this.model.query('SEL_REPORT_COMPROBANTES_BY_IDPERTRA', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
    
}


reportesContraloria.prototype.post_saveDocReporteContraloria = function(req, res, next) {
    var self = this;
    
	
	var idPerTra = req.body.idPerTra;
	var saveUrl = ''
	var extensionArchivo = 'pdf'//req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var idFondoFijo = req.body.idFondoFijo
    var urlParam = req.body.urlParam
    var opcion = req.body.opcion
    var idUsuario = req.body.idUsuario
    var idEmpresa   = req.body.idEmpresa
    var idSucursal  = req.body.idSucursal
    var idDepartamento = req.body.idDepartamento
    var idUsuarioResponsable = req.body.idUsuarioResponsable
    var fechaFormatoMilitar = ''
    
    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING.type },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idFondoFijo', value: idFondoFijo, type: self.model.types.STRING.type },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.STRING.type },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idEmpresa, type: self.model.types.INT },
        { name: 'idDepartamento', value: idSucursal, type: self.model.types.INT },
        { name: 'idEmpresa', value: idDepartamento, type: self.model.types.INT },
        { name: 'idUsuarioResponsable', value: idUsuarioResponsable, type: self.model.types.INT },
        { name: 'opcion', value: opcion, type: self.model.types.INT }
    ];
    
    this.model.query('tramites.dbo.SEL_DOCUMENTOS_REPORTE_CONTRALORIA', params, function(error, result) {
        if(opcion === 0)
        {
            if( result[0].success == 1  ){
          
                var nombre = result[0].nombreArchivo //"Reporte_" + idFondoFijo + '.' + extensionArchivo;
                saveUrl = result[0].saveUrl +'_'+ idPerTra + "\\"
                saveUrl = 'C:\\app\\public\\Imagenes\\ReporteContraloria\\';
    
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
        }
        else{
            self.view.expositor(res, {
                error: error,
                result: result
            });
        }
    
    });
};


reportesContraloria.prototype.get_catalogoEstatusValesFF = function(req, res, next){
    var self = this;

    var params = [];


    this.model.query('SEL_CAT_ESTATUS_VALE_FONDO_FIJO', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesContraloria.prototype.get_catalogoComprbanteVale = function(req, res, next){
    var self = this;

    var params = [];


    this.model.query('SEL_CAT_ESTATUS_COMPROBANTES_FONDO_FIJO', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

/**
 * Region Administrador de Cumplimiento
 */

reportesContraloria.prototype.get_solicitaToken = function(req, res, next){
    var self = this;

    var params = [
        { name: 'idUsuario',     value: req.query.idUsuario,     type: self.model.types.INT },
        { name: 'idFondoFijo',   value: req.query.idFondoFijo,   type: self.model.types.INT },
        { name: 'idTipoPersona', value: req.query.idTipoPersona, type: self.model.types.INT },
        { name: 'idArqueo',      value: req.query.idArqueo,      type: self.model.types.INT }
    ];


    this.model.query('[Cumplimiento].[SEL_TOKEN_SP]', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
        
}

reportesContraloria.prototype.get_validaToken = function(req, res, next){
    var self = this;

    var params = [
        { name: 'keyId',         value: req.query.keyId,          type: self.model.types.STRING },
        { name: 'tokenUsuario',  value: req.query.tokenUsuario,   type: self.model.types.STRING }
    ];


    this.model.query('[Cumplimiento].[INS_VALIDATOKEN_SP]', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
        
}

reportesContraloria.prototype.get_arqueosParaFirma = function(req, res, next){
    var self = this;

    var params = [
        { name: 'idUsuario',  value: req.query.idUsuario,   type: self.model.types.INT }
    ];

    this.model.query('[Cumplimiento].[SEL_ARQUEO_SP]', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });       
}

reportesContraloria.prototype.get_getDataReporteArqueo = function(req, res, next){
    var self = this;

    var id = req.query.id;

    var params = [
        { name: 'idArqueo', value: id, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[Cumplimiento].[SEL_DATA_REPORTE_CONTRALORIA]', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

reportesContraloria.prototype.get_responsableArqueo = function(req, res, next){
    var self = this;

    var params = [
        { name: 'keyId',    value: req.query.keyId,     type: self.model.types.STRING },
        { name: 'idArqueo', value: req.query.idArqueo,  type: self.model.types.INT },
        { name: 'comentarios',    value: req.query.comentarios,     type: self.model.types.STRING }
    ];

    this.model.queryAllRecordSet('[Cumplimiento].[UPD_TOKENRESPONSABLE_SP]', params, function(error, result){
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

/**
 * End / Region Administrador de Cumplimiento
 */
    
// reportesContraloria.prototype.get_aprobarRechazarTramiteFF = function(req, res, next){
//     var self = this;

//     var idPerTra      = req.query.id_perTra;
//     var estatus       = req.query.estatus;
//     var observaciones = req.query.observaciones;

//     var params = [
//         { name: 'id_perTra',     value: idPerTra,      type: self.model.types.INT },
//         { name: 'estatus',       value: estatus,       type: self.model.types.INT },
//         { name: 'observaciones', value: observaciones, type: self.model.types.STRING }
//     ];

//     this.model.query('UPD_APROBAR_RECHAZAR_TRAMITE_FF_SP', params, function(error, result){
//         self.view.expositor(res,{
//             error:error,
//             result: result
//         });
//     });
// }


module.exports = reportesContraloria;