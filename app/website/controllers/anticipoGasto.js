var anticipoGastoView = require('../views/reference'),
    anticipoGastoModel = require('../models/dataAccess');

var    soap = require('soap')  
var   path = require('path');
var fs = require("fs");
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var conf = require('../../../conf');
var http = require('http')

var anticipoGasto = function (conf) {
    this.conf = conf || {};

    this.view = new anticipoGastoView();
    this.model = new anticipoGastoModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

anticipoGasto.prototype.get_anticiposGastoPorUsuario = function (req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var params = [{
        name: 'idUsuario',
        value: idUsuario,
        type: self.model.types.INT
    }];
    this.model.query('Tramite.Usp_Tramite_AnticipoSaldo_GetPorUsuario', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_anticipoGastoById = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idAnticipoGasto', value: req.query.idAnticipoGasto, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.query.idTipoProceso, type: self.model.types.INT },
        { name: 'urlParametro', value: req.query.urlParametro, type: self.model.types.STRING }

    ];

    this.model.query('[Tramite].[Sp_Tramite_AnticipoGasto_GetPorId]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_empleadosPorIdSolicitud = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramiteDevolucion', value: req.query.idTramiteDevolucion, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_Empleado_GETBySolicitud]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_conceptosGastoPorSolicitud = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idSolicitud', value: req.query.idSolicitud, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.query.idTipoProceso, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_Concepto_GETLByIdSolictud]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_comprobacionesCanceladas = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idSolicitud', value: req.query.idSolicitud, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_Concepto_GETLByIdSolictud]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.post_guardarTramite = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idTramite', value: req.body.idTramite, type: self.model.types.INT },
        { name: 'idFormaPago', value: req.body.idFormaPago, type: self.model.types.INT },
        { name: 'idDepartamento', value: req.body.idDepartamento, type: self.model.types.INT },
        { name: 'observaciones', value: req.body.observaciones, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.body.idSucursal, type: self.model.types.INT },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'devTotal', value: req.body.devTotal, type: self.model.types.DECIMAL },
        { name: 'idPersona', value: req.body.idCliente, type: self.model.types.INT },
        { name: 'fechaInicio', value: req.body.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.body.fechaFin, type: self.model.types.STRING },
        { name: 'concepto', value: req.body.concepto, type: self.model.types.STRING },
        { name: 'motivo', value: req.body.motivo, type: self.model.types.STRING },
        { name: 'nombreCliente', value: req.body.nombreCliente, type: self.model.types.STRING },

        { name: 'cuentaBancaria', value: req.body.cuentaBancaria, type: self.model.types.STRING },
        { name: 'numeroCLABE', value: req.body.numeroCLABE, type: self.model.types.STRING },
        { name: 'cveBanxico', value: req.body.cveBanxico, type: self.model.types.STRING },
        { name: 'kilometro', value: req.body.kilometro, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_AnticipoGasto_INS]', params, function (error, result) {
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

anticipoGasto.prototype.post_actualizaEstatusTramite = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ADGEstatus_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_actualizarTramite = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT },
        { name: 'idDepartamento', value: req.body.idDepartamento, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.body.idSucursal, type: self.model.types.INT },
        { name: 'fechaInicio', value: req.body.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.body.fechaFin, type: self.model.types.STRING },
        { name: 'concepto', value: req.body.concepto, type: self.model.types.STRING },
        { name: 'motivo', value: req.body.motivo, type: self.model.types.STRING },
        { name: 'nombreCliente', value: req.body.nombreCliente, type: self.model.types.STRING },
        
        { name: 'cuentaBancaria', value: req.body.cuentaBancaria, type: self.model.types.STRING },
        { name: 'numeroCLABE', value: req.body.numeroCLABE, type: self.model.types.STRING },
        { name: 'cveBanxico', value: req.body.cveBanxico, type: self.model.types.STRING },
        { name: 'kilometro', value: req.body.kilometro, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_AnticipoGasto_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_guardarEmpleado = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpleado', value: req.body.idEmpleado, type: self.model.types.INT },
        { name: 'nombreEmpleado', value: req.body.nombreEmpleado, type: self.model.types.STRING },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'idTramiteDevolucion', value: req.body.idTramiteDevolucion, type: self.model.types.INT },
        { name: 'idPersona', value: req.body.idPersona, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_Empleado_INS]', params, function (error, result) {
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

anticipoGasto.prototype.post_eliminaEmpleado = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idTramiteEmpleado', value: req.body.idTramiteEmpleado, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_Empleado_DEL]', params, function (error, result) {
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

anticipoGasto.prototype.post_guardarConceptoPorSolicitud = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'idConceptoContable', value: req.body.idConceptoContable, type: self.model.types.INT },
        { name: 'importe', value: req.body.importe, type: self.model.types.DECIMAL },
        { name: 'comentario', value: req.body.comentario, type: self.model.types.STRING },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT },
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT },
        { name: 'areaAfectacion', value: req.body.areaAfectacion, type: self.model.types.STRING },
        { name: 'numeroCuenta', value: req.body.numeroCuenta, type: self.model.types.STRING },
        { name: 'idTipoViaje', value: req.body.idTipoViaje, type: self.model.types.INT },
        { name: 'distancia', value: req.body.distancia, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_Concepto_INS]', params, function (error, result) {
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

anticipoGasto.prototype.post_actualizaImporteConcepto = function (req, res, next) {
    var self = this;
//idTipoViaje 
    var params = [
        { name: 'idTramiteConcepto', value: req.body.idTramiteConcepto, type: self.model.types.INT },
        { name: 'importe', value: req.body.importe, type: self.model.types.DECIMAL },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'comentario', value: req.body.comentario, type: self.model.types.STRING },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT },
        { name: 'idTipoViaje', value: req.body.idTipoViaje, type: self.model.types.INT },
        { name: 'distanciaKm', value: req.body.distanciaKm, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ConceptoImporte_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_eliminarConcepto = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idTramiteConcepto', value: req.body.idTramiteConcepto, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_Concepto_DEL]', params, function (error, result) {
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

anticipoGasto.prototype.post_aprobarRechazarEmpleado = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idTramiteEmpleado', value: req.body.idTramiteEmpleado, type: self.model.types.INT },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_AprobarRechazarEmpleado_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_aprobarRechazarConcepto = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idTramiteConcepto', value: req.body.idTramiteConcepto, type: self.model.types.INT },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'importe', value: req.body.importe, type: self.model.types.DECIMAL },
        { name: 'comentario', value: req.body.comentario, type: self.model.types.STRING },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT },
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_AprobarRechazarConcepto_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_aprobarRechazarArchivo = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idConceptoArchivo', value: req.body.idConceptoArchivo, type: self.model.types.INT },
        { name: 'importe', value: req.body.importe, type: self.model.types.DECIMAL },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idTramiteConcepto', value: req.body.idTramiteConcepto, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT },
        { name: 'comentario', value: req.body.comentario, type: self.model.types.STRING },
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT },
        { name: 'compNoAutorizado', value: req.body.compNoAutorizado, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_AprobarRechazarArchivo_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_aprobacionSolicitud = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idSolicitud', value: req.body.idSolicitud, type: self.model.types.INT },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_AprobarRechazar_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.get_conceptosGastoList = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idSolicitud', value: req.query.idSolicitud, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_Concepto_GETL]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.post_guardarComentarioArchivo = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idConceptoArchivo', value: req.body.idConceptoArchivo, type: self.model.types.INT },
        { name: 'idTramiteConcepto', value: req.body.idTramiteConcepto, type: self.model.types.INT },
        { name: 'comentario', value: req.body.comentario, type: self.model.types.STRING },
        { name: 'importe', value: req.body.importe, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT },
        { name: 'fecha', value: req.body.fecha, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ComentarioArchivo_INS]', params, function (error, result) {
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

anticipoGasto.prototype.post_guardarImporteConcepto = function (req, res, next) {
    var self = this;

    var mescorriente = req.body.mesCorriente === undefined || req.body.mesCorriente === null ? 0 : req.body.mesCorriente;
    var tipoNotificacion = req.body.tipoNotificacion === undefined || req.body.tipoNotificacion === null ? 0 : req.body.tipoNotificacion;
    var estatusNotificacion = req.body.estatusNotificacion === undefined || req.body.estatusNotificacion === null ? 0 : req.body.estatusNotificacion;

    var params = [
        { name: 'importe', value: req.body.importe, type: self.model.types.DECIMAL },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.STRING },
        { name: 'idTipoProceso', value: req.body.idTipoProceso, type: self.model.types.INT },
        { name: 'idTramiteConcepto', value: req.body.idTramiteConcepto, type: self.model.types.INT },
        { name: 'importeIva', value: req.body.importeIva, type: self.model.types.DECIMAL },
        { name: 'folio', value: req.body.folio, type: self.model.types.STRING },
        { name: 'fecha', value: req.body.fecha, type: self.model.types.STRING },
        { name: 'idConceptoArchivo', value: req.body.idConceptoArchivo, type: self.model.types.INT },
        { name: 'UUID', value: req.body.UUID, type: self.model.types.STRING },
        { name: 'rfc', value: req.body.rfc, type: self.model.types.STRING },
        { name: 'xmlConceptos', value: req.body.xmlConceptos, type: self.model.types.STRING },
        { name: 'mesCorriente', value: req.body.mesCorriente, type: self.model.types.INT },
        { name: 'tipoNotificacion', value: req.body.tipoNotificacion, type: self.model.types.INT },
        { name: 'estatusNotificacion', value: req.body.estatusNotificacion, type: self.model.types.INT },
    ];
    this.model.query('[Tramite].[Sp_Tramite_ImporteConcepto_INS]', params, function (error, result) {
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

anticipoGasto.prototype.post_guardarArchivoDepartamento = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idDepartamento', value: req.body.idDepartamento, type: self.model.types.INT },
        { name: 'porcentaje', value: req.body.porcentaje, type: self.model.types.STRING },
        { name: 'idConceptoArchivo', value: req.body.idConceptoArchivo, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_ArchivoDepartamento_INS]', params, function (error, result) {
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

anticipoGasto.prototype.get_archivosPorConcepto = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramiteConcepto', value: req.query.idTramiteConcepto, type: self.model.types.INT },
        { name: 'urlParametro', value: req.query.urlParametro, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivo_GETLByIdConcepto]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_archivosPorConceptoGV = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramiteConcepto', value: req.query.idTramiteConcepto, type: self.model.types.INT },
        { name: 'urlParametro', value: req.query.urlParametro, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivo_GETLByIdConcepto_GV]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_archivosPorConceptoComp = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramiteConcepto', value: req.query.idTramiteConcepto, type: self.model.types.INT },
        { name: 'urlParametro', value: req.query.urlParametro, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivoCompr_GETLByIdConcepto]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


anticipoGasto.prototype.get_conceptosPorXml = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idConceptoArchivo', value: req.query.idConceptoArchivo, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ArchivoDetalle_GETLByIdConceptoArchivo]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_departamentosPorArchivo = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idConceptoArchivo', value: req.query.idConceptoArchivo, type: self.model.types.INT }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ArchivoDepartamento_GETLByIdArchivo]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_areaAfectacion = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_areaAfectacion_GETLBySucursal]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_cuentaContable = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'CNC_CONCEPTO1', value: req.query.CNC_CONCEPTO1, type: self.model.types.STRING },
        { name: 'CNC_CONCEPTO2', value: req.query.CNC_CONCEPTO2, type: self.model.types.STRING }
    ];

    this.model.query('[Tramite].[Sp_Tramite_CuentaContable_GETLByConcepto]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.post_actualizaDatosArchivo = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idConceptoArchivo', value: req.body.idConceptoArchivo, type: self.model.types.INT },
        { name: 'folioDocumento', value: req.body.folioDocumento, type: self.model.types.STRING },
        { name: 'iva', value: req.body.iva, type: self.model.types.DECIMAL },
        { name: 'total', value: req.body.total, type: self.model.types.DECIMAL }
    ];

    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivo_UPD]', params, function (error, result) {
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

anticipoGasto.prototype.post_eliminaDepartamentoArchivo = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idArchivoDepartamento', value: req.body.idArchivoDepartamento, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_ArchivoDepartamento_DEL]', params, function (error, result) {
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

anticipoGasto.prototype.post_saveInfoDocumentos = function (req, res, next) {
    var self = this;
    var idTramiteConcepto = req.body.idTramiteConcepto;
    var nombreArchivo = req.body.nombreArchivo
    var extensionArchivo = req.body.extensionArchivo;
    var tipoDevolucion = req.body.tipoDevolucion;

    var params = [
        { name: 'nombre', value: nombreArchivo, type: self.model.types.STRING },
        { name: 'extension', value: extensionArchivo, type: self.model.types.STRING },
        { name: 'idTramiteConcepto', value: idTramiteConcepto, type: self.model.types.INT },
        { name: 'idProceso', value: req.body.idProceso, type: self.model.types.INT },
        { name: 'tipoDevolucion', value: req.body.tipoDevolucion, type: self.model.types.INT },
    ];
    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivo_GV_INS]', params, function (error, result) {
        var resultado = {
            respuesta: 0,
            mensaje: 'Se genero un error al procesar la solicitud',
            idRegistro: 0
        }
        if (result != null && result != 'undefined') {
            resultado.idRegistro = result[0].resultado;
            resultado.mensaje = 'La información se guardo de manera correcta';
            resultado.consecutivo = result[0].consecutivo;
        }
        self.view.expositor(res, {
            error: error,
            result: resultado
        });
    });
};

anticipoGasto.prototype.post_eliminarInfoDocumentos = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idConceptoArchivo', value: req.body.idConceptoArchivo, type: self.model.types.INT }
    ];
    var urlLocal = req.body.urlServerDoctos + '/' + req.body.idConceptoArchivo + '_' + req.body.nombre;
    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivo_DEL]', params, function (error, result) {
        var resultado = {
            respuesta: 0,
            mensaje: 'Se genero un error al procesar la solicitud',
            idRegistro: 0
        }

        if (result != null && result != 'undefined') {
            resultado.respuesta = 1;
            resultado.mensaje = 'Solicitud procesada correctamente';
            resultado.idRegistro = result[0].resultado;
            fs.exists(urlLocal, function (exists) {
                if (exists) {
                    fs.unlink(urlLocal, function (error, data) {
                        if (!error) {
                        }
                    });
                } else {
                }
            });
        }
        self.view.expositor(res, {
            error: error,
            result: resultado
        });
    });
};

anticipoGasto.prototype.post_saveDocumentos = function (req, res, next) {
    var self = this;
    var idTramiteConcepto = req.body.idTramiteConcepto;
    var nombreArchivo = req.body.nombreArchivo
    var extensionArchivo = req.body.extensionArchivo;
    var idArchivo = req.body.idArchivo;
    var saveUrl = req.body.saveUrl;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var consecutivo = req.body.consecutivo

    var nombre = idArchivo + "_" + nombreArchivo + '.' + extensionArchivo;
    //var nombre = `${idArchivo}_${nombreArchivo}_${consecutivo}.${extensionArchivo}`
    var urlLocal = saveUrl + '/' + nombre;
    if (!fs.existsSync(saveUrl)) {
        fs.mkdirSync(saveUrl);
        setTimeout(() => {
            fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
                if (err) {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Guardar y Lectura de XML',
                        error: { message: 'Ocurrio un error al guardar el archivo' },
                        xmlResult: xmlResult
                    });
                } else {
                    if (extensionArchivo == 'xml') {
                        fs.readFile(urlLocal, function (err, data) {
                            parser.parseString(data, function (err, result) {
                                if (result != undefined && result != null) {
                                    var mensajeError = '';
                                    var xmlResult = { importe: 0, importeiVA: 0, fecha: '', folio: '', conceptos: [] };
                                    var jsonResult = JSON.parse(JSON.stringify(result));
                                    if (jsonResult['cfdi:Comprobante'] != null && jsonResult['cfdi:Comprobante']['$'] != null) {
                                        if (typeof jsonResult['cfdi:Comprobante']['$'].total == 'undefined') {
                                            xmlResult.importe = jsonResult['cfdi:Comprobante']['$'].Total;
                                        } else {
                                            xmlResult.importe = jsonResult['cfdi:Comprobante']['$'].total;
                                        }
                                        if (typeof jsonResult['cfdi:Comprobante']['$'].fecha == 'undefined') {
                                            xmlResult.fecha = jsonResult['cfdi:Comprobante']['$'].Fecha;
                                        } else {
                                            xmlResult.fecha = jsonResult['cfdi:Comprobante']['$'].fecha;
                                        }
                                        if (typeof jsonResult['cfdi:Comprobante']['$'].folio == 'undefined') {
                                            xmlResult.folio = jsonResult['cfdi:Comprobante']['$'].Folio;
                                        } else {
                                            xmlResult.folio = jsonResult['cfdi:Comprobante']['$'].folio;
                                        }
                                        xmlResult.UUID = jsonResult['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$'].UUID;

                                        var emisor = jsonResult['cfdi:Comprobante']['cfdi:Emisor'];
                                        if (emisor.length > 0) {
                                            if (typeof emisor[0]['$'].rfc == 'undefined') {
                                                xmlResult.rfc = emisor[0]['$'].Rfc;
                                            } else {
                                                xmlResult.rfc = emisor[0]['$'].rfc;
                                            }
                                        } else {
                                            mensajeError += 'No se encontro el rfc del emisor,';
                                        }

                                        var conceptos = jsonResult['cfdi:Comprobante']['cfdi:Conceptos'];
                                        if (jsonResult['cfdi:Comprobante']['cfdi:Conceptos'] != null && jsonResult['cfdi:Comprobante']['cfdi:Conceptos'].length > 0) {
                                            conceptos.forEach(function (concepto) {
                                                concepto['cfdi:Concepto'].forEach(function (item) {
                                                    if (typeof item['$'].cantidad == 'undefined') {
                                                        xmlResult.conceptos.push({
                                                            cantidad: item['$'].Cantidad,
                                                            claveProdServ: item['$'].ClaveProdServ,
                                                            claveUnidad: item['$'].ClaveUnidad,
                                                            descripcion: item['$'].Descripcion,
                                                            descuento: item['$'].Descuento,
                                                            importe: item['$'].Importe,
                                                            valorUnitario: item['$'].ValorUnitario,
                                                        });
                                                    } else {
                                                        xmlResult.conceptos.push({
                                                            cantidad: item['$'].cantidad,
                                                            claveProdServ: item['$'].claveProdServ,
                                                            claveUnidad: item['$'].claveUnidad,
                                                            descripcion: item['$'].descripcion,
                                                            descuento: item['$'].descuento,
                                                            importe: item['$'].importe,
                                                            valorUnitario: item['$'].valorUnitario,
                                                        });
                                                    }
                                                });

                                            });
                                        } else {
                                            mensajeError += 'No se pudieron leer los conceptos del xml,';
                                        }

                                        var impuestosGeneral = jsonResult['cfdi:Comprobante']['cfdi:Impuestos'][0]['cfdi:Traslados'];
                                        if (jsonResult['cfdi:Comprobante']['cfdi:Impuestos'] != null) {
                                            impuestosGeneral.forEach(function (impuestos) {
                                                impuestos['cfdi:Traslado'].forEach(function (impuesto) {
                                                    if (typeof impuesto['$'].impuesto == 'undefined') {
                                                        if (impuesto['$'].Impuesto == 'IVA' && impuesto['$'].Tasa != '0.00' && impuesto['$'].Importe != '0.00') {
                                                            xmlResult.importeiVA = impuesto['$'].importe;
                                                        }
                                                    } else {
                                                        if (impuesto['$'].impuesto == 'IVA' && impuesto['$'].tasa != '0.00' && impuesto['$'].importe != '0.00') {
                                                            xmlResult.importeiVA = impuesto['$'].importe;
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                        res.status(200).json({
                                            ok: true,
                                            mensaje: 'Guardar y Lectura de XML',
                                            error: { message: mensajeError },
                                            xmlResult: xmlResult
                                        });
                                    } else {
                                        res.status(200).json({
                                            ok: true,
                                            mensaje: 'Guardar y Lectura de XML',
                                            error: { message: 'El archivo no tiene el formato correcto' },
                                            xmlResult: xmlResult
                                        });
                                    }
                                } else {
                                    res.status(200).json({
                                        ok: false,
                                        mensaje: 'Guardar y Lectura de XML',
                                        error: { message: 'Error al leer el archivo' },
                                        xmlResult: {}
                                    });
                                }
                            });
                        });
                    } else {
                        res.status(200).json({
                            ok: true,
                            mensaje: 'Guardar y Lectura de XML',
                            error: { message: '' },
                            xmlResult: {}
                        });
                    }
                }
            });
        }, 2000)
    } else {
        fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Guardar y Lectura de XML',
                    error: { message: 'Ocurrio un error al guardar el archivo' },
                    xmlResult: xmlResult
                });
            } else {
                if (extensionArchivo == 'xml') {
                    fs.readFile(urlLocal, function (err, data) {
                        parser.parseString(data, function (err, result) {
                            if (result != undefined && result != null) {
                                var xmlResult = { importe: 0, importeiVA: 0, fecha: '', folio: '', conceptos: [], UUID: '', rfc: '' };
                                var jsonResult = JSON.parse(JSON.stringify(result));
                                if (jsonResult['cfdi:Comprobante'] != null && jsonResult['cfdi:Comprobante']['$'] != null) {
                                    if (typeof jsonResult['cfdi:Comprobante']['$'].total == 'undefined') {
                                        xmlResult.importe = jsonResult['cfdi:Comprobante']['$'].Total;
                                    } else {
                                        xmlResult.importe = jsonResult['cfdi:Comprobante']['$'].total;
                                    }
                                    if (typeof jsonResult['cfdi:Comprobante']['$'].fecha == 'undefined') {
                                        xmlResult.fecha = jsonResult['cfdi:Comprobante']['$'].Fecha;
                                    } else {
                                        xmlResult.fecha = jsonResult['cfdi:Comprobante']['$'].fecha;
                                    }
                                    if (typeof jsonResult['cfdi:Comprobante']['$'].folio == 'undefined') {
                                        xmlResult.folio = jsonResult['cfdi:Comprobante']['$'].Folio;
                                    } else {
                                        xmlResult.folio = jsonResult['cfdi:Comprobante']['$'].folio;
                                    }
                                    xmlResult.UUID = jsonResult['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0]['$'].UUID;
                                    var emisor = jsonResult['cfdi:Comprobante']['cfdi:Emisor'];
                                    if (emisor.length > 0) {
                                        if (typeof emisor[0]['$'].rfc == 'undefined') {
                                            xmlResult.rfc = emisor[0]['$'].Rfc;
                                        } else {
                                            xmlResult.rfc = emisor[0]['$'].rfc;
                                        }
                                    } else {
                                        mensajeError += 'No se encontro el rfc del emisor,';
                                    }
                                    var conceptos = jsonResult['cfdi:Comprobante']['cfdi:Conceptos'];
                                    conceptos.forEach(function (concepto) {
                                        concepto['cfdi:Concepto'].forEach(function (item) {
                                          //  xmlResult.conceptos.push(item['$']);
                                          if (typeof item['$'].cantidad == 'undefined') {
                                            xmlResult.conceptos.push({
                                                cantidad: item['$'].Cantidad,
                                                claveProdServ: item['$'].ClaveProdServ,
                                                claveUnidad: item['$'].ClaveUnidad,
                                                descripcion: item['$'].Descripcion,
                                                descuento: item['$'].Descuento,
                                                importe: item['$'].Importe,
                                                valorUnitario: item['$'].ValorUnitario,
                                            });
                                        } else {
                                            xmlResult.conceptos.push({
                                                cantidad: item['$'].cantidad,
                                                claveProdServ: item['$'].claveProdServ,
                                                claveUnidad: item['$'].claveUnidad,
                                                descripcion: item['$'].descripcion,
                                                descuento: item['$'].descuento,
                                                importe: item['$'].importe,
                                                valorUnitario: item['$'].valorUnitario,
                                            });
                                        }
                                        });
                                        
                                    });
                                    var impuestosGeneral = jsonResult['cfdi:Comprobante']['cfdi:Impuestos'][0]['cfdi:Traslados'];
                                    impuestosGeneral.forEach(function (impuestos) {
                                        impuestos['cfdi:Traslado'].forEach(function (impuesto) {
                                            if (typeof impuesto['$'].impuesto == 'undefined') {
                                                if (impuesto['$'].Impuesto == 'IVA' && impuesto['$'].Tasa != '0.00' && impuesto['$'].Importe != '0.00') {
                                                    xmlResult.importeiVA = impuesto['$'].importe;
                                                }
                                            } else {
                                                if (impuesto['$'].impuesto == 'IVA' && impuesto['$'].tasa != '0.00' && impuesto['$'].importe != '0.00') {
                                                    xmlResult.importeiVA = impuesto['$'].importe;
                                                }
                                            }
                                        });
                                    });
                                    res.status(200).json({
                                        ok: true,
                                        mensaje: 'Guardar y Lectura de XML',
                                        error: { message: '' },
                                        xmlResult: xmlResult
                                    });
                                } else {
                                    res.status(200).json({
                                        ok: false,
                                        mensaje: 'Guardar y Lectura de XML',
                                        error: { message: 'El archivo no tiene el formato correcto' },
                                        xmlResult: xmlResult
                                    });
                                }
                            } else {
                                res.status(200).json({
                                    ok: false,
                                    mensaje: 'Guardar y Lectura de XML',
                                    error: { message: 'Error al leer el archivo' },
                                    xmlResult: {}
                                });
                            }
                        });
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Guardar y Lectura de XML',
                        error: { message: '' },
                        xmlResult: {}
                    });
                }
            }
        });
    }
};

anticipoGasto.prototype.get_estatusAnticipoGasto = function(req, res, next) {
    var self = this;
    var params = [];
    this.model.query('SEL_ANTICIPOGASTO_ESTATUS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_eliminaConcepto = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramiteConcepto', value: req.query.idTramiteConcepto, type: self.model.types.INT }
    ];
    this.model.query('UPD_TRAMITECONCEPTO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_actualizaDepartamento = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idArchivoDepartamento', value: req.query.idArchivoDepartamento, type: self.model.types.INT },
        { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.DECIMAL }
    ];
    this.model.query('UPD_PORCENTAJEDEPARTAMENTO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_SalidaEfectivoConcepto = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idTramitePersona', value: req.query.idTramitePersona, type: self.model.types.INT },
        { name: 'idSalida', value: req.query.idSalida, type: self.model.types.INT },
        { name: 'bancoSalida', value: req.query.bancoSalida, type: self.model.types.INT},
        { name: 'bancoEntrada', value: req.query.bancoEntrada, type: self.model.types.INT},
        { name: 'numCuentaSalida', value: req.query.numCuentaSalida, type: self.model.types.STRING},
        { name: 'cuentaContableSalida', value: req.query.cuentaContableSalida, type: self.model.types.STRING},
        { name: 'numCuentaEntrada', value: req.query.numCuentaEntrada, type: self.model.types.STRING},
        { name: 'cuentaContableEntrada', value: req.query.cuentaContableEntrada, type: self.model.types.STRING},
        { name: 'monto', value: req.query.ventaUnitario, type: self.model.types.DECIMAL},
    ];
    this.model.query('UPD_SALIDAEFECTIVOCONCEPTO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_verificaArchivosEvidencia = function(req, res, next) {
    var self = this;
    var idTramiteConcepto =  req.query.idTramiteConcepto;
    var params = [
        { name: 'idTramiteConcepto', value: idTramiteConcepto, type: self.model.types.INT }];
    this.model.query('SEL_VERIFICARCONCEPTO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_verificaArchivosEvidenciaGral = function(req, res, next) {
    var self = this;
    var idTramiteConcepto =  req.query.idTramiteConcepto;
    var params = [
        { name: 'idTramiteConcepto', value: idTramiteConcepto, type: self.model.types.INT }];
    this.model.query('SEL_VERIFICARCONCEPTOGRAL_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
anticipoGasto.prototype.get_getRfcPorNombreRazon = function (req, res, next) {
    var self = this;
    var nombreRazon = req.query.nombreRazon;
    var params = [
        { name: 'nombreRazon', value: nombreRazon, type: self.model.types.STRING }];
    this.model.query('SEL_RFC_POR_NOMBRE_RAZON_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


anticipoGasto.prototype.get_buscarAutorizador = function(req, res, next) {
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var idUsuario = req.query.idUsuario;
    var tipoNotificacion = req.query.tipoNotificacion === undefined ? 1 : req.query.tipoNotificacion;

    var params = [{ name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
                  { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
                  { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
                  { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
                  { name: 'tipoNotificacion', value: tipoNotificacion, type: self.model.types.INT }
                ];
																					
    this.model.query('SEL_AUTORIZADOR_ANTICIPO_GASTOS_SP', params, function(error, result) {
        console.log('resultado: ' + result[0].idAutorizador);
        console.log('resultado: ' + result[0].nombreUsuario);
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_archivosPorReferencia = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT },
        { name: 'urlParametro', value: req.query.urlParametro, type: self.model.types.STRING }
    ];
    this.model.query('[Tramite].[Sp_Tramite_ConceptoArchivo_GETLByIdReferencia]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



anticipoGasto.prototype.get_datosEmpresa = function(req, res, next) {																	  
    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT }];
    this.model.query('SEL_DATOS_EMPRESA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.post_verificaConcepto = function(req, res, next) {
    var self = this;
    var idempresa = req.body.idempresa;
    var idsucursal = req.body.idsucursal;
    var idComprobacion = req.body.idComprobacion;
    var montoComprobacion = req.body.montoComprobacion;
    
    var params = [
        { name: 'idempresa', value: idempresa, type: self.model.types.INT },
        { name: 'idsucursal', value: idsucursal, type: self.model.types.INT },
        { name: 'idComprobacion', value: idComprobacion, type: self.model.types.STRING },
        { name: 'montoComprobacion', value: montoComprobacion, type: self.model.types.DECIMAL }
    ];
    
    this.model.query('[dbo].[SEL_ESTATUSCONCEPTOORDEN_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.post_ActualizaConceptos = function(req, res, next) {
    var self = this;
    var idsolicitud = req.body.idsolicitud;    
    var params = [
        { name: 'idsolicitud', value: idsolicitud, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[UPD_SEGUIMIENTOCONCEPTOEVIDENCIA_EFECTIVO_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_buscarPersona = function(req, res, next) {
    var self = this;
    var idPersona = req.query.idPersona;	
    var esid = req.query.esid;
    var esRFC = req.query.esRFC;
    var esnombre = req.query.esnombre;
    var nombre = req.query.nombre;

    var params = [
        { name: 'idPersona', value: idPersona, type: self.model.types.STRING },
        { name: 'esid', value: esid, type: self.model.types.INT },
        { name: 'esRFC', value: esRFC, type: self.model.types.INT },
        { name: 'esnombre', value: esnombre, type: self.model.types.INT },
        { name: 'nombre', value: nombre, type: self.model.types.STRING },
    ];
    this.model.query('SEL_BUSCARPERSONA_V2_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_revisorComp = function (req, res, next) {
    var self = this;
    var idPertra = req.query.idPertra;
    var params = [
        { name: 'idPertra', value: idPertra, type: self.model.types.INT }
    ];

    this.model.query('[Tramite].[Sp_Tramite_RevisorComprobacion]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_parametrosGvByUsuario = function(req, res,next){
   
    var self = this;

    var idUsuario = req.query.idUsuario;	
    var nacional = req.query.nacional;
    var concepto = req.query.concepto;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.STRING },
        { name: 'nacional', value: nacional, type: self.model.types.INT },
        { name: 'concepto', value: concepto, type: self.model.types.INT }
    ];
    this.model.query('tramites.dbo.SEL_PARAMETROS_GV_BY_USUARIO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


anticipoGasto.prototype.get_updNotificacionParametros = function(req, res, next) {
    var self = this;
       
    var params = [
        { name: 'idTramite', value: req.query.idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[UPD_NOTIFICACION_pARAMETROS]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_saveEdoCuentas = function(req, res, next) {
    var self = this;
    var idDocumento = req.query.idDocumento;
	var idTramite = req.query.idTramite;
	var idPerTra = req.query.idPerTra;
	// var saveUrl = req.body.saveUrl;
	// var idUsuario = req.body.idUsuario;
	// var extensionArchivo = req.body.extensionArchivo;
    // var base64Data = req.body.archivo.split(';base64,').pop();
    
    var params = [
        { name: 'idDocumento', value: idDocumento, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
    ];
    
    this.model.query('INS_TRANS_DETALLE_SP', params, function(error, result) {
        // if( result[0].success == 1  ){
        //     var nombre = "Documento_" + idDocumento + '.' + extensionArchivo;
        //     console.log(saveUrl);
        //     if (!fs.existsSync(saveUrl)) {
        //         fs.mkdirSync(saveUrl);
        //         setTimeout(() => {
        //             fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
        //                 if (err) {
        //                     console.log('Ha ocurrido un error: ' + err);
        //                 }
        //             });
        //         }, 2000)
        //     } else {
        //         fs.writeFile(saveUrl + "\\" + nombre, base64Data, 'base64', function (err) {
        //             if (err) {
        //                 console.log('Ha ocurrido un error: ' + err);
        //             }
        //         });
        //     }
        // }
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_loadDocument = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_AGV_DOCUMENTOS_BORRADOR_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_datosTramitesGastosViaje = function (req, res, next) {
    var self = this;
    
    var idPerTra  = req.query.idPerTra ;
  

    var params = [
        { name: 'idPerTra', value: idPerTra , type: self.model.types.INT }
    ];
    
    this.model.query('OBTIENE_DATOS_TRAMITE_AGV', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });


}

anticipoGasto.prototype.get_actualizaEstatusNotificacion= function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idconceptoArchivo', value: req.query.idconceptoArchivo, type: self.model.types.INT },
        { name: 'tipo', value: req.query.tipo, type: self.model.types.INT }
    ];
    this.model.query('UPD_ESTATUSNOTIFACTURAGV_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

anticipoGasto.prototype.get_actualizaEstatusNotificacionDeMas= function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idconceptoArchivo', value: req.query.idconceptoArchivo, type: self.model.types.INT },
        { name: 'tipo', value: req.query.tipo, type: self.model.types.INT },
        { name: 'monto', value: req.query.monto, type: self.model.types.DECIMAL }
    ];
    this.model.query('[dbo].[UPD_ESTATUSNOTIDEMASGV_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

anticipoGasto.prototype.get_ObtieneCuentaEmpleado = function(req, res, next){

    var self = this;
    //var rfc = 'BOAL7206308S4'
    var rfc = req.query.rfc;
    var url = 'http://192.168.20.59:8085/Service1.asmx?WSDL'
    var args = {RFC: rfc}
    var parseString = require('xml2js').parseString;
    var data={
        id_bpro:0,
        PER_PATERNO:'',
        PER_MATERNO:'',
        PER_NOMRAZON:'',
        PER_RFC:'',
        id_rh:0,
        M4_PATERNO:'',
        M4_MATERNO:'',
        M4_NOMBRE:'',
        M4_RFC:'',
        M4_NUMEROCTA:'',
        M4_BANCO:'',
        M4_IDBANCO:'',
        M4_TITULARCTABCO:'',
        mensajeresultado:''
    }

    soap.createClient(url, function (err, client){
        if(err){
            console.log('soap.createClient: ', err)
        }
        else{
            client.ConsultaPersona(args, function(err, result, raw) {
                if(err){
                    self.view.error(res,{
                        mensaje:'Hubo un problema intentelo de nuevo'
                    })
                }
                else{
                    parseString(raw, function(err, result) {
                        if (err) {
                            self.view.error(res, {
                                mensaje: "Hubo un problema intente de nuevo",
                            });
                        } else {
                            var resultado = result["soap:Envelope"]["soap:Body"][0]["ConsultaPersonaResponse"][0]["ConsultaPersonaResult"][0];
                            var estatus = resultado.mensajeresultado[0] !== '' ? 'OK' : 'ERROR';

                            data.id_bpro = resultado.id_bpro[0] !== '' ? resultado.id_bpro[0] : 0;
                            data.PER_PATERNO = resultado.PER_PATERNO[0] !== '' ? resultado.PER_PATERNO[0] : '';
                            data.PER_MATERNO = resultado.PER_MATERNO[0] !== '' ? resultado.PER_MATERNO[0] : '';
                            data.PER_NOMRAZON = resultado.PER_NOMRAZON[0] !== '' ? resultado.PER_NOMRAZON[0] : '';
                            data.PER_RFC = resultado.PER_RFC[0] !== '' ? resultado.PER_RFC[0] : '';
                            data.id_rh = resultado.id_rh[0] !== '' ? resultado.id_rh[0] : 0;
                            data.M4_PATERNO = resultado.M4_PATERNO[0] !== '' ? resultado.M4_PATERNO[0] : '';
                            data.M4_MATERNO = resultado.M4_MATERNO[0] !== '' ? resultado.M4_MATERNO[0] : '';
                            data.M4_NOMBRE = resultado.M4_NOMBRE[0] !== '' ? resultado.M4_NOMBRE[0] : '';
                            data.M4_RFC = resultado.M4_RFC[0] !== '' ? resultado.M4_RFC[0] : '';
                            data.M4_NUMEROCTA = resultado.M4_NUMEROCTA.length > 0 ? resultado.M4_NUMEROCTA[0] : '';
                            data.M4_BANCO = resultado.M4_BANCO[0] !== '' ? resultado.M4_BANCO[0] : '';
                            data.M4_IDBANCO = resultado.M4_IDBANCO[0] !== '' ? resultado.M4_IDBANCO[0] : '';
                            data.M4_TITULARCTABCO = resultado.M4_TITULARCTABCO[0] !== '' ? resultado.M4_TITULARCTABCO[0] : '';
                            data.mensajeresultado = resultado.mensajeresultado[0] !== '' ? resultado.mensajeresultado[0] : 'No se encontro Información';

                            self.view.expositor(res, {
                                error: false,
                                result: {

                                    
                                    estatus: estatus,
                                    data: data //JSON.stringify(resultado)

                            }
                                
                            });
                        }
                    });
                }
            })
        }
    })


}

anticipoGasto.prototype.get_GetCorreosTesoreria = function (req, res, next) {
    var self = this;
    var params = [];
    this.model.query('[Tramite].[Sp_Tramite_CuentasBanco_GetCorreos]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

anticipoGasto.prototype.get_SalidaEfectivoEstatus = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'perTra', value: req.query.perTra, type: self.model.types.INT },
        { name: 'idTramiteTransferencia', value: req.query.idTramiteTransferencia, type: self.model.types.INT },
        { name: 'idCuenta', value: req.query.idCuenta, type: self.model.types.INT },
    ];

    this.model.query('[Tramite].[Sp_Tramite_GDM_SalidaEfectivoEstatus_UPD]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


anticipoGasto.prototype.get_getDataReporte = function(req, res, next){
    var self = this;

    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var idPerTra = req.query.idPerTra;

    var idToken = req.query.idToken;
    var fecha = req.query.fecha;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        
    ];

    this.model.queryAllRecordSet('SEL_DATA_VALE_CAJA_GASTOS_VIAJE', params, function(error, result){
        console.log(result)
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}

anticipoGasto.prototype.get_getDataReporteToken = function(req, res, next){
    var self = this;

    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;
    var idPerTra = req.query.idPerTra;

    var idToken = req.query.idToken;
    var fecha = req.query.fecha;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idToken', value: idToken, type: self.model.types.INT },
        { name: 'fecha', value: fecha, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('SEL_DATA_VALE_CAJA_GASTOS_VIAJE_TOKEN', params, function(error, result){
        console.log(result)
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });
}


anticipoGasto.prototype.post_saveDocReportePresupuestoGV = function(req, res, next) {
    var self = this;
    
	
	var idPerTra = req.body.idPerTra;
	var saveUrl = ''
	var extensionArchivo = 'pdf'//req.body.extensionArchivo;
    var base64Data = req.body.archivo.split(';base64,').pop();
    var urlParam = req.body.urlParam
    var opcion = req.body.opcion
    var fechaFormatoMilitar = ''
    
    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING.type },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'opcion', value: opcion, type: self.model.types.INT }
    ];
    
    this.model.query('tramites.dbo.SEL_DOCUMENTOS_REPORTE_CONTRALORIA_GV', params, function(error, result) {
        if(opcion === 0)
        {
            if( result[0].success == 1  ){
          
                var nombre = result[0].nombreArchivo //"Reporte_" + idFondoFijo + '.' + extensionArchivo;
                console.log(saveUrl);
                saveUrl = result[0].saveUrl +'_'+ idPerTra + "\\"
    
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
anticipoGasto.prototype.post_CreateNotification = function(req, res, next){
    var self = this;

    var identificador = req.body.identificador
    var descripcion = req.body.descripcion
    var idSolicitante = req.body.idSolicitante
    var idTipoNotificacion = req.body.idTipoNotificacion
    var linkBPRO = req.body.linkBPRO
    var notAdjunto = req.body.notAdjunto
    var notAdjuntoTipo = req.body.notAdjuntoTipo
    var idEmpresa = req.body.idEmpresa
    var idSucursal = req.body.idSucursal
    var departamentoId = req.body.departamentoId

    var params = [
        {name: 'identificador', value: identificador, type: self.model.types.STRING},
        {name: 'idSolicitante', value: idSolicitante, type: self.model.types.INT},
        {name: 'idTipoNotJerarquizada', value: idTipoNotificacion, type: self.model.types.INT},
        {name: 'descripcion', value: descripcion, type: self.model.types.STRING},
        {name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT},
        {name: 'idSucursal', value: idSucursal, type: self.model.types.INT},
        {name: 'idDepartamento', value: departamentoId, type: self.model.types.INT},
        {name: 'linkBPRO', value: linkBPRO, type: self.model.types.STRING},
        {name: 'notAdjunto', value: notAdjunto, type: self.model.types.STRING},
        {name: 'notAdjuntoTipo', value: notAdjuntoTipo, type: self.model.types.STRING}
    ];

    this.model.query('Notificacion.dbo.INS_NOTIFICACION_JERARQUIZADA', params, function(error, result){
        console.log(result)
        self.view.expositor(res,{
            error:error,
            result: result
        });
    });

}

anticipoGasto.prototype.get_PrecioGasolina = function(req, res, next) {
    var self = this;
    var params = [];
    this.model.query('SEL_CONFIGURACION_GASOLINA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_imageComprobante = function(req, res, next) {
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
    
    this.model.query('SEL_FA_DOCUMENTO_COMPROBANTE_GV_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_updRechazoConceptoArchivo = function(req, res, next) {
    var self = this;
    var idConceptoArchivo = req.query.idConceptoArchivo;
    var motivo = req.query.motivo;

    var params = [
        { name: 'idConceptoArchivo', value: idConceptoArchivo, type: self.model.types.INT },
        { name: 'motivo', value: motivo, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_RECHAZO_CONCEPTO_ARCHIVO_GV', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


anticipoGasto.prototype.get_updNotificacionParametrosFacturas = function(req, res, next) {
    var self = this;
    
    var params = [
        { name: 'idTramite', value: req.query.idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[UPD_NOTIFICACION_pARAMETROS_FAC_GV]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_updSolicitudFacturaAprobacion = function(req, res, next) {
    var self = this;
    var idConceptoArchivo = req.query.idConceptoArchivo;
    var motivo = req.query.motivo;

    var params = [
        { name: 'idConceptoArchivo', value: idConceptoArchivo, type: self.model.types.INT },
        { name: 'motivo', value: motivo, type: self.model.types.STRING }
    ];
    
    this.model.query('UPD_SOLICITUD_APROBACION_FACTURA_GV', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_datosSolicitanteByConceptoArchivo = function(req, res, next) {
    var self = this;
    var idConceptoArchivo = req.query.idConceptoArchivo;

    var params = [
        { name: 'idConceptoArchivo', value: idConceptoArchivo, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_CORREOBYCONCEPTOARCHIVO_GV', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_toleranciaComprobacion = function (req, res, next) {
    var self = this;
    
    var params = [];

    this.model.query('[dbo].[SEL_PARAMETRO_TOLERANCIACOMPROBACION_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_validaLeyDeducibilidad = function (req, res, next) {
    var self = this;

    var params = [
        { name: 'idConcepto', value: req.query.idConcepto, type: self.model.types.INT },
        { name: 'kilometros', value: req.query.kilometros, type: self.model.types.INT }
    ];

    this.model.query('[VALIDA_CONCEPTO_LEY_DEDUCIBILIDAD]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_ocportramite = function (req, res, next) {
    var self = this;

    var params = [{ name: 'id_perTra', value: req.query.tramite, type: self.model.types.INT }];

    this.model.query('[Tramite].[Sp_Tramite_OC_PorTramite_GETL]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_departamentosAreaAfectacion = function (req, res, next) {
    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_DEPARTAMENTO_AREA_AFECTACION_GV]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


anticipoGasto.prototype.get_imageComprobanteOrdenPagoGV = function(req, res, next) {
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
    
    this.model.query('SEL_COMPROBANTE_ORDEN_PAGO_GV', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_getToken = function(req, res, next) {
    var self = this;
    var idUsuarioSolicitante = req.query.idUsuarioSolicitante;

    var params = [
        { name: 'idUsuarioSolicitante', value: idUsuarioSolicitante, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_OBTIENE_TOKEN_GV', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_validaToken = function(req, res, next) {
    var self = this;
    var idUsuarioSolicitante = req.query.idUsuarioSolicitante;
    var token = req.query.token;

    var params = [
        { name: 'token', value: token, type: self.model.types.STRING },
        { name: 'idPersona', value: idUsuarioSolicitante, type: self.model.types.INT }
    ];
    
    this.model.query('ValidaToken', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_consultaPresupuestoFirmado = function(req, res, next) {
    var self = this;

    var idPerTra = req.query.idPerTra;
    var idEmpresa = req.query.idEmpresa;
    var idSucursal = req.query.idSucursal;
    var idDepartamento = req.query.idDepartamento;


    var params = [
        { name: 'idPerTra', value: idPerTra, type: self.model.types.STRING },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: idSucursal, type: self.model.types.STRING },
        { name: 'idDepartamento', value: idDepartamento, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_CONSULTA_PRESUPUESTOS_FIRMADOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


anticipoGasto.prototype.get_DocumentosGVOP = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    //var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        //{ name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_DOCUMENTOS_GV_OP]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_DominiosGA = function(req, res, next) {
    var self = this;
    var params = [];
    this.model.query('SEL_OBTIENE_DOMINIOS_CORREOS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_idPersonabyUsuario = function (req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var params = [{ name: 'idUsuario', value: idUsuario, type: self.model.types.INT }];
  
    this.model.query('SEL_IDPERSONABYUSUARIO_GV_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

anticipoGasto.prototype.get_loadDocumentBanco = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idPerTra = req.query.idPerTra;
    var idTramite = req.query.idTramite;

    var params = [
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'idPerTra', value: idPerTra, type: self.model.types.INT },
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_AGV_DOCUMENTOS_CUENTA_BANCO', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_BuscaIne = function(req, res, next) {
    var self = this;
    var urlParam = req.query.urlParam;
    var idpersona = req.query.idpersona;

    var params = [
        { name: 'idpersona', value: idpersona, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    
    this.model.query('BUSCA_INE_PERSONA', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_ValidaEstatusActivo = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('VALIDA_USUARIO_ACTIVO_GV', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.post_AuthBpro = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];
    
    this.model.query('VALIDA_USUARIO_ACTIVO_GV', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

anticipoGasto.prototype.get_ActualizaTramitePoliza = function(req, res, next) {
    var self = this;
    var id_perTra = req.query.id_perTra;
    var poliza = req.query.poliza;
    var documentoConcepto = req.query.documentoConcepto;
    var incremental = req.query.incremental;

    var ordenCompra = req.query.ordenCompra;
    var consPol = req.query.consPol;
    var mesPol = req.query.mesPol;
    var anioPol = req.query.anioPol;

    var params = [
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'poliza', value: poliza, type: self.model.types.STRING },
        { name: 'documentoConcepto', value: documentoConcepto, type: self.model.types.STRING },
        { name: 'incremental', value: incremental, type: self.model.types.INT },
        { name: 'ordenCompra', value: ordenCompra, type: self.model.types.STRING },
        { name: 'consPol', value: consPol, type: self.model.types.INT },
        { name: 'mesPol', value: mesPol, type: self.model.types.INT },
        { name: 'anioPol', value: anioPol, type: self.model.types.INT }
    ];
    
    this.model.query('UPD_TRAMITE_GASTO_VIAJE', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = anticipoGasto;