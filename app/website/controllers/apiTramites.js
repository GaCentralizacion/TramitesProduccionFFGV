var apiTramitesView = require('../views/reference'),
    apiTramitesModel = require('../models/dataAccess')
var fs = require("fs");

//Varibles a ocupar para guardar documento
var errorSave = 0;
var updateSave = 0;
var noUpdate = 0;

var apiTramites = function(conf) {
    this.conf = conf || {};

    this.view = new apiTramitesView();
    this.model = new apiTramitesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

apiTramites.prototype.post_getDocumentosByTramite = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var idProspecto = req.body.idProspecto;
    var idTipoProspecto = req.body.idTipoProspecto;
    var urlParam = req.body.urlParam;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'idTipoProspecto', value: idTipoProspecto, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    this.model.query('SEL_DOCUMENTOS_BY_TRAMITE_API_SP', params, function(error, result) {
        try {
            if (result.length > 0) {
                respuesta = {
                    success: 1,
                    msg: 'Se encotraron documentos para el tramite.',
                    data: result
                };
            } else {
                respuesta = {
                    success: 0,
                    msg: 'No se encontro ningun documento para el tramite.'
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun documento para el tramite.'
            };
        }
        self.view.expositor(res, {
            result: respuesta
        });
    });
};

apiTramites.prototype.post_savePersona = function(req, res, next) {
    var self = this;


    var moralFisica = req.body.moralFisica;
    var idTramite = req.body.idTramite;
    var rfc = req.body.rfc;
    var nombre = req.body.nombre;
    moralFisica == 0 ? apellido1 = '' : apellido1 = req.body.apellido1;
    moralFisica == 0 ? apellido2 = '' : apellido2 = req.body.apellido2;
    var cuentaBancaria = req.body.cuentaBancaria;
    var idProspecto = req.body.idProspecto;
    var idTipoProspecto = req.body.idTipoProspecto;

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'rfc', value: rfc, type: self.model.types.STRING },
        { name: 'nombre', value: nombre, type: self.model.types.STRING },
        { name: 'apellido1', value: apellido1, type: self.model.types.STRING },
        { name: 'apellido2', value: apellido2, type: self.model.types.STRING },
        { name: 'moralFisica', value: moralFisica, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: cuentaBancaria, type: self.model.types.STRING },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'idTipoProspecto', value: idTipoProspecto, type: self.model.types.INT }
    ];

    this.model.query('[INS_PERSONA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

apiTramites.prototype.post_saveDocsTramite = function(req, res, next) {
    var self = this;
    var body = req.body;

    if (body.length == 0) {
        var respuesta = {
            success: 0,
            msg: "Debes adjuntar minimo un documento."
        }
        self.view.expositor(res, {
            result: respuesta
        });
    } else {

        apiTramites.saveDocBD(self, body, res, 0, body[0].id_PerTra);
    }
};

apiTramites.saveDocBD = function(self, body, res, contDocs, id_PerTra_) {

    if (contDocs < body.length - 1) {

        var numCuentas = body[contDocs].numCuentas ? body[contDocs].numCuentas : 0;
        var banxico = body[contDocs].banxico ? body[contDocs].banxico : "";
        var banco = body[contDocs].banco ? body[contDocs].banco : "";
        var rfc = !body[contDocs].rfc || body[contDocs].rfc == '' ? '' : body[contDocs].rfc;
        var cuentaB = !body[contDocs].cuentaB || body[contDocs].cuentaB == '' ? '' : body[contDocs].cuentaB;
        var clabe = !body[contDocs].clabe || body[contDocs].clabe == '' ? '' : body[contDocs].clabe;

        var params = [
            { name: 'idProspecto', value: body[contDocs].idProspecto, type: self.model.types.INT },
            { name: 'idTipoProspecto', value: body[contDocs].idTipoProspecto, type: self.model.types.INT },
            { name: 'idTramite', value: body[contDocs].idTramite, type: self.model.types.INT },
            { name: 'idDocumento', value: body[contDocs].idDocumento, type: self.model.types.INT },
            { name: 'id_PerTra', value: id_PerTra_, type: self.model.types.INT },
            { name: 'numCuentas', value: numCuentas, type: self.model.types.INT },
            { name: 'idBanxico', value: banxico, type: self.model.types.STRING },
            { name: 'banco', value: banco, type: self.model.types.STRING },
            { name: 'rfc', value: rfc, type: self.model.types.STRING },
            { name: 'cuentaBancaria', value: cuentaB, type: self.model.types.STRING },
            { name: 'clabe', value: clabe, type: self.model.types.STRING }
        ];

        self.model.query('INS_DOCUMENTO_PERSONTA_DETALLE_SP', params, function(error, result) {
            if (result[0].success == 1) {
                id_PerTra_ = result[0].id_PerTra;
                var dir = result[0].rutaSave + 'Persona_' + body[contDocs].per_rfc + '_' + body[contDocs].idTramite;
                var base64Data = body[contDocs].base64.split(';base64,').pop();

                if (body[contDocs].idDocumento == 9 && body[contDocs].idTipoProspecto == 1) {
                    var nombre = "Documento_" + body[contDocs].idDocumento + '_' + body[contDocs].banxico + "." + body[contDocs].nombreImg.split(".")[1];

                } else {
                    var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];
                }

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    setTimeout(() => {
                        fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                            if (err) {
                                console.log('Ha ocurrido un error: ' + err);
                                apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                            } else {
                                apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                            }
                        });
                    }, 2000)
                } else {
                    fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                            apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                        } else {
                            apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                        }
                    });
                }
            } else {
                if (result[0].success == 2) {
                    id_PerTra_ = result[0].id_PerTra;
                    var dir = result[0].rutaSave + 'Persona_' + body[contDocs].per_rfc + '_' + body[contDocs].idTramite;
                    var base64Data = body[contDocs].base64.split(';base64,').pop();
                    if (body[contDocs].idDocumento == 9 && body[contDocs].idTipoProspecto == 1) {
                        var nombre = "Documento_" + body[contDocs].idDocumento + '_' + body[contDocs].banxico + "." + body[contDocs].nombreImg.split(".")[1];

                    } else {
                        var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];
                    }

                   // var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];

                    updateSave += 1;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        setTimeout(() => {
                            fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                                if (err) {
                                    console.log('Ha ocurrido un error: ' + err);
                                    apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                                } else {
                                    apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                                }
                            });
                        }, 2000)
                    } else {
                        fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                            if (err) {
                                console.log('Ha ocurrido un error: ' + err);
                                apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                            } else {
                                apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                            }
                        });
                    }
                } else if (result[0].success == 3) {
                    noUpdate += 1;
                    apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                } else {
                    errorSave += 1;
                    apiTramites.saveDocBD(self, body, res, contDocs + 1, id_PerTra_);
                }
            }
        });
    } else {
        apiTramites.saveLastDoc(self, body, res, contDocs, id_PerTra_);
    }

}

apiTramites.saveLastDoc = function(self, body, res, contDocs, id_PerTra_) {
    var respuesta = {
        success: 1,
        msg: '',
        id_PerTra_: id_PerTra_
    }
    var numCuentas = body[contDocs].numCuentas ? body[contDocs].numCuentas : 0;
    var banxico = body[contDocs].banxico ? body[contDocs].banxico : "";
    var banco = body[contDocs].banco ? body[contDocs].banco : "";
    var rfc = !body[contDocs].rfc || body[contDocs].rfc == '' ? '' : body[contDocs].rfc;
    var cuentaB = !body[contDocs].cuentaB || body[contDocs].cuentaB == '' ? '' : body[contDocs].cuentaB;
    var clabe = !body[contDocs].clabe || body[contDocs].clabe == '' ? '' : body[contDocs].clabe;

    var params = [
        { name: 'idProspecto', value: body[contDocs].idProspecto, type: self.model.types.INT },
        { name: 'idTipoProspecto', value: body[contDocs].idTipoProspecto, type: self.model.types.INT },
        { name: 'idTramite', value: body[contDocs].idTramite, type: self.model.types.INT },
        { name: 'idDocumento', value: body[contDocs].idDocumento, type: self.model.types.INT },
        { name: 'id_PerTra', value: id_PerTra_, type: self.model.types.INT },
        { name: 'numCuentas', value: numCuentas, type: self.model.types.INT },
        { name: 'idBanxico', value: banxico, type: self.model.types.STRING },
        { name: 'banco', value: banco, type: self.model.types.STRING },
        { name: 'rfc', value: rfc, type: self.model.types.STRING },
        { name: 'cuentaBancaria', value: cuentaB, type: self.model.types.STRING },
        { name: 'clabe', value: clabe, type: self.model.types.STRING }


    ];

    console.log("parametros ultimo Archivo", params);

    self.model.query('INS_DOCUMENTO_PERSONTA_DETALLE_SP', params, function(error, result) {

        
        console.log("parametros ultimo Archivo", params);
        console.log("Error Ultimo Archivo",error);
        console.log("result Ultimo Archivo",result);

        if (result[0].success == 1) {

            // if (body[contDocs].idDocumento == 11) {
            //     body[contDocs].idDocumento = body[contDocs].idDocumento + '_' + result[0].id_PerTra;
            // }

            var dir = result[0].rutaSave + 'Persona_' + body[contDocs].per_rfc + '_' + body[contDocs].idTramite;
            var base64Data = body[contDocs].base64.split(';base64,').pop();

            if (body[contDocs].idDocumento == 9 && body[contDocs].idTipoProspecto == 1) {
                var nombre = "Documento_" + body[contDocs].idDocumento + '_' + body[contDocs].banxico + "." + body[contDocs].nombreImg.split(".")[1];

            } else {
                var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];
            }

            //   var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];
            respuesta.msg = result[0].msg;
            respuesta.id_PerTra_ = result[0].id_PerTra;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                setTimeout(() => {
                    fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {

                        if (err) {
                            console.log('Ha ocurrido un error: ' + err);
                        } else {
                            if (errorSave > 0 && noUpdate > 0) {
                                respuesta.msg = 'Se termino el guardado, pero 1 o mas documentos no se pueden actualizar por que estan en revision o esta mal la informacion proporcionada';
                            } else if (updateSave > 0) {
                                respuesta.msg = 'Se termino el guardado, 1 o mas documentos se actualizaron';
                            } else if (errorSave > 0) {
                                respuesta.msg = 'Se termino el guardado, pero en 1 o mas documentos la informacion es incorrecta';
                            } else if (noUpdate > 0) {
                                respuesta.msg = 'Se termino el guardado, 1 o mas documentos no se pueden actualizar por que estan en revisio';
                            }
                            self.view.expositor(res, {
                                error: error,
                                result: respuesta
                            });
                        }
                    });
                }, 2000)
            } else {
                fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                    if (err) {
                        console.log('Ha ocurrido un error: ' + err);
                    } else {

                        if (errorSave > 0 && noUpdate > 0) {
                            respuesta.msg = 'Se termino el guardado, pero 1 o mas documentos no se pueden actualizar por que estan en revision o esta mal la informacion proporcionada';
                        } else if (updateSave > 0) {
                            respuesta.msg = 'Se termino el guardado, 1 o mas documentos se actualizaron';
                        } else if (errorSave > 0) {
                            respuesta.msg = 'Se termino el guardado, pero en 1 o mas documentos la informacion es incorrecta';
                        } else if (noUpdate > 0) {
                            respuesta.msg = 'Se termino el guardado, 1 o mas documentos no se pueden actualizar por que estan en revisio';
                        }
                        self.view.expositor(res, {
                            error: error,
                            result: respuesta
                        });
                    }
                });
            }
        } else {
            if (body.length == 1) {
                if (result[0].success == 2) {
                    respuesta.id_PerTra_ = result[0].id_PerTra;
                    var dir = result[0].rutaSave + 'Persona_' + body[contDocs].per_rfc + '_' + body[contDocs].idTramite;
                    var base64Data = body[contDocs].base64.split(';base64,').pop();
                    if (body[contDocs].idDocumento == 9 && body[contDocs].idTipoProspecto == 1) {
                        var nombre = "Documento_" + body[contDocs].idDocumento + '_' + body[contDocs].banxico + "." + body[contDocs].nombreImg.split(".")[1];

                    } else {
                        var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];
                    }

                    //var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];

                    respuesta.success = 1;
                    respuesta.msg = 'Se actualizo el documento'
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        setTimeout(() => {
                            fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                                if (err) {
                                    console.log('Ha ocurrido un error: ' + err);
                                }
                            });
                        }, 2000)
                    } else {
                        fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                            if (err) {
                                console.log('Ha ocurrido un error: ' + err);
                            }
                        });
                    }
                    self.view.expositor(res, {
                        error: error,
                        result: respuesta
                    });
                } else if (result[0].success == 3) {
                    respuesta.success = 1;
                    respuesta.id_PerTra_ = result[0].id_PerTra;
                    respuesta.msg = 'No se puede actualizar el documento por que esta en revision'
                    self.view.expositor(res, {
                        error: error,
                        result: respuesta
                    });
                } else {
                    respuesta.id_PerTra_ = result[0].id_PerTra;
                    respuesta.success = result[0].success;
                    respuesta.msg = result[0].msg;
                    self.view.expositor(res, {
                        error: error,
                        result: respuesta
                    });
                }
            } else {

                 if (result[0].success == 2) {
                    respuesta.id_PerTra_ = result[0].id_PerTra;
                    var dir = result[0].rutaSave + 'Persona_' + body[contDocs].per_rfc + '_' + body[contDocs].idTramite;
                    var base64Data = body[contDocs].base64.split(';base64,').pop();
                    if (body[contDocs].idDocumento == 9 && body[contDocs].idTipoProspecto == 1) {
                        var nombre = "Documento_" + body[contDocs].idDocumento + '_' + body[contDocs].banxico + "." + body[contDocs].nombreImg.split(".")[1];

                    } else {
                        var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];
                    }

                    //var nombre = "Documento_" + body[contDocs].idDocumento + "." + body[contDocs].nombreImg.split(".")[1];

                    respuesta.success = 1;
                    respuesta.msg = 'Se actualizo el documento'
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        setTimeout(() => {
                            fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                                if (err) {
                                    console.log('Ha ocurrido un error: ' + err);
                                }
                            });
                        }, 2000)
                    } else {
                        fs.writeFile(dir + "\\" + nombre, base64Data, 'base64', function(err) {
                            if (err) {
                                console.log('Ha ocurrido un error: ' + err);
                            }
                        });
                    }
                    self.view.expositor(res, {
                        error: error,
                        result: respuesta
                    });
                } else if (result[0].success == 3) {
                    respuesta.success = 1;
                    respuesta.id_PerTra_ = result[0].id_PerTra;
                    respuesta.msg = ' No se puede actualizar uno o mas documentos por que estan en revision'
                    self.view.expositor(res, {
                        error: error,
                        result: respuesta
                    });
                } else {
                    respuesta.id_PerTra_ = result[0].id_PerTra;
                    respuesta.success = result[0].success;
                    respuesta.msg = result[0].msg;
                    self.view.expositor(res, {
                        error: error,
                        result: respuesta
                    });

                }


                if (errorSave > 0 && noUpdate > 0) {
                    respuesta.msg = 'Se termino el guardado, pero 1 o mas documentos no se pueden actualizar por que estan en revision o esta mal la informacion proporcionada';
                } else if (updateSave > 0) {
                    respuesta.msg = 'Se termino el guardado, 1 o mas documentos se actualizaron';
                } else if (errorSave > 0) {
                    respuesta.msg = 'Se termino el guardado, pero en 1 o mas documentos la informacion es incorrecta';
                } else if (noUpdate > 0) {
                    respuesta.msg = 'Se termino el guardado, 1 o mas documentos no se pueden actualizar por que estan en revisio';
                }

                self.view.expositor(res, {
                    error: error,
                    result: respuesta
                });
            }
        }
    });
};

apiTramites.prototype.post_getEstatusTramite = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var idProspecto = req.body.idProspecto;
    var tipoProspecto = req.body.tipoProspecto;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'tipoProspecto', value: tipoProspecto, type: self.model.types.INT }
    ];

    this.model.query('SEL_ESTATUS_TRAMITE_SP', params, function(error, result) {

        try {
            if (result[0].success == 1) {
                respuesta = {
                    success: 1,
                    msg: 'Se encontro estatus para este tramite y persona.',
                    data: result
                };
            } else if (result[0].success == 3) {
                respuesta = {
                    success: -1,
                    msg: 'Tiene un trámite rechazado, puede volver a solicitar',
                    data: result
                };
            } else {
                respuesta = {
                    success: -1,
                    msg: result[0].msg
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun estatus para este tramite y persona'
            };
        }

        self.view.expositor(res, {
            error: error,
            result: respuesta
        });
    });
};

// Clientes
apiTramites.prototype.post_getDocumentosByTramiteNew = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT }
    ];
    this.model.query('SEL_DOCUMENTOS_BY_NEW_TRAMITE_API_SP_CLIENTES', params, function(error, result) {
        try {
            if (result.length > 0) {
                respuesta = {
                    success: 1,
                    msg: 'Se encotraron documentos para el tramite.',
                    data: result
                };
            } else {
                respuesta = {
                    success: 0,
                    msg: 'No se encontro ningun documento para el tramite.'
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun documento para el tramite.'
            };
        }
        self.view.expositor(res, {
            result: respuesta
        });
    });
};

apiTramites.prototype.post_getDocumentosByTramiteClienteTra = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var id_perTra = req.body.id_perTra;
    var urlParam = req.body.urlParam;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'id_perTra', value: id_perTra, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];

    this.model.query('SEL_DOCUMENTOS_BY_TRAMITE_API_SP_CLIENTES', params, function(error, result) {
        try {
            if (result.length > 0) {
                respuesta = {
                    success: 1,
                    msg: 'Se encotraron documentos para el tramite.',
                    data: result
                };
            } else {
                respuesta = {
                    success: 0,
                    msg: 'No se encontro ningun documento para el tramite.'
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun documento para el tramite.'
            };
        }
        self.view.expositor(res, {
            result: respuesta
        });
    });
};


apiTramites.prototype.post_getDocumentosByTramiteSubidos = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var idProspecto = req.body.idProspecto;
    var idTipoProspecto = req.body.idTipoProspecto;
    var urlParam = req.body.urlParam;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'idTipoProspecto', value: idTipoProspecto, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING }
    ];
    this.model.query('SEL_DOCUMENTOS_SUBIDOS_SP', params, function(error, result) {
        try {
            if (result.length > 0) {
                respuesta = {
                    success: 1,
                    msg: 'Se encotraron documentos para el tramite.',
                    data: result
                };
            } else {
                respuesta = {
                    success: 0,
                    msg: 'No se encontro ningun documento para el tramite.'
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun documento para el tramite.'
            };
        }
        self.view.expositor(res, {
            result: respuesta
        });
    });
};
apiTramites.prototype.post_getDocumentosBancoByTramite = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var idProspecto = req.body.idProspecto;
    var idTipoProspecto = req.body.idTipoProspecto;
    var urlParam = req.body.urlParam;
    var rfc = !req.body.rfc || req.body.rfc == '' ? '' : req.body.rfc;



    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'idTipoProspecto', value: idTipoProspecto, type: self.model.types.INT },
        { name: 'urlParam', value: urlParam, type: self.model.types.STRING },
        { name: 'rfc', value: rfc, type: self.model.types.STRING }
    ];
    this.model.query('SEL_DOCUMENTOS_BY_TRAMITE_CUENTA_API_SP', params, function(error, result) {


        try {
            if (result.length > 0) {
                respuesta = {
                    success: 1,
                    msg: 'Se encotraron documentos para el tramite.',
                    data: result
                };
            } else {
                respuesta = {
                    success: 0,
                    msg: 'No se encontro ningun documento para el tramite.'
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun documento para el tramite.'
            };
        }
        self.view.expositor(res, {
            result: respuesta
        });
    });
};

apiTramites.prototype.post_savePersonaCuentas = function(req, res, next) {
    var self = this;


    var moralFisica = req.body.moralFisica;
    var idTramite = req.body.idTramite;
    var rfc = req.body.rfc;
    var nombre = req.body.nombre;
    moralFisica == 0 ? apellido1 = '' : apellido1 = req.body.apellido1;
    moralFisica == 0 ? apellido2 = '' : apellido2 = req.body.apellido2;
    var cuentaBancaria = req.body.cuentaBancaria;
    var idProspecto = req.body.idProspecto;
    var idTipoProspecto = req.body.idTipoProspecto;

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'rfc', value: rfc, type: self.model.types.STRING },
        { name: 'nombre', value: nombre, type: self.model.types.STRING },
        { name: 'apellido1', value: apellido1, type: self.model.types.STRING },
        { name: 'apellido2', value: apellido2, type: self.model.types.STRING },
        { name: 'moralFisica', value: moralFisica, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: cuentaBancaria, type: self.model.types.STRING },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'idTipoProspecto', value: idTipoProspecto, type: self.model.types.INT }
    ];

    this.model.query('[INS_PERSONA_CUENTA_BANCARIA_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

apiTramites.prototype.post_getEstatusTramiteCuenta = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var rfc = req.body.rfc;
    var tipoProspecto = req.body.tipoProspecto;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'rfc', value: rfc, type: self.model.types.STRING },
        { name: 'tipoProspecto', value: tipoProspecto, type: self.model.types.INT }
    ];

    this.model.query('SEL_ESTATUS_TRAMITE_CUENTA_SP', params, function(error, result) {

        try {
            if (result[0].success == 1) {
                respuesta = {
                    success: 1,
                    msg: 'Se encontro estatus para este tramite y persona.',
                    data: result
                };
            } else {
                respuesta = {
                    success: -1,
                    msg: result[0].msg
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun estatus para este tramite y persona'
            };
        }

        self.view.expositor(res, {
            error: error,
            result: respuesta
        });
    });
};

apiTramites.prototype.post_getPersonaTramite = function(req, res, next) {
    var self = this;
   
    var params = [
      
        { name: 'rfc', value: req.body.rfc, type: self.model.types.STRING }
      
    ];
    this.model.query('SEL_PERSONA_TRAMITE_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

apiTramites.prototype.post_getCuentasDocumentos = function(req, res, next) {
    var self = this;
   
    var params = [
      
        { name: 'idTramite', value: req.body.idTramite, type: self.model.types.STRING },
        { name: 'idProspecto', value: req.body.idProspecto, type: self.model.types.STRING },
        { name: 'idTipoProspecto', value: req.body.idTipoProspecto, type: self.model.types.STRING },
        { name: 'urlParam', value: req.body.urlParam, type: self.model.types.STRING }
      
    ];
    this.model.query('SEL_DOCUMENTOS_CUENTA_API_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
apiTramites.prototype.post_validarTramitePortal = function(req, res, next) {
    var self = this;
    var idTramite = req.body.idTramite;
    var idProspecto = req.body.idProspecto;
    var tipoProspecto = req.body.tipoProspecto;

    var respuesta = {
        success: 0,
        msg: '',
        data: []
    };

    var params = [
        { name: 'idTramite', value: idTramite, type: self.model.types.INT },
        { name: 'idProspecto', value: idProspecto, type: self.model.types.INT },
        { name: 'tipoProspecto', value: tipoProspecto, type: self.model.types.INT }
    ];

    this.model.query('SEL_ESTATUS_TRAMITE_PORTAL_SP', params, function(error, result) {

        try {
            if (result[0].success == 1) {
                respuesta = {
                    success: 1,
                    msg: 'Se encontro estatus para este tramite y persona.',
                    data: result
                };
            } else if (result[0].success == 3) {
                respuesta = {
                    success: -3,
                    msg: 'Tiene un trámite rechazado, puede volver a solicitar',
                    data: result
                };
            } else if (result[0].success == 4) {
                respuesta = {
                    success: 1,
                    msg: 'Tiene un trámite en revision.',
                    data: result
                };
            } else if (result[0].success == 2) {
                respuesta = {
                    success: 2,
                    msg: 'Tiene un trámite Aprobado',
                    data: result
                };
            } 
            else {
                respuesta = {
                    success: -1,
                    msg: result[0].msg
                };
            }
        } catch (e) {
            respuesta = {
                success: 0,
                msg: 'No se encontro ningun estatus para este tramite y persona'
            };
        }

        self.view.expositor(res, {
            error: error,
            result: respuesta
        });
    });
};





module.exports = apiTramites;