var apiGuardaDocumentoView = require('../views/reference'),
    apiGuardaDocumentoModel = require('../models/dataAccess')

var FormData = require('form-data');
var fs = require('fs');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var unirest = require('unirest');

var apiGuardaDocumento = function(conf){
    this.conf =  conf || {};

    this.view = new apiGuardaDocumentoView()
    this.model = new apiGuardaDocumentoModel({parameters: this.conf.parameters})

    this.response = () => {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }

}

    

apiGuardaDocumento.prototype.post_GuardaFactura = function(req, res, next) { 
    var self = this;
    var data = JSON.parse(req.query.data);


    var guarda = unirest('POST', 'http://192.168.20.123:4400/api/fileUpload/files/')
    .headers({'Accept': 'application/json','Content-Type': 'multipart/form-data'})
    .field('provider', data.provider.toString())
    .field('rfc', '')
    .field('folio', data.folio.toString())
    .field('idRol', '2')
    .field('rfcProvider', data.rfcProvider)
    .field('fechaOC', data.fechaOC)
    .field('tipoDocumento', '1')
    .field('provider', data.provider.toString())
    .field('rfc', '')
    .field('folio', data.folio.toString())
    .field('idRol', '2')
    .field('rfcProvider', data.rfcProvider)
    .field('fechaOC', data.fechaOC)
    .field('tipoDocumento', '1')
    .attach('file[]', fs.createReadStream(data.file1.toString().replace('C:','E:')))
    .attach('file[]', fs.createReadStream(data.file2.toString().replace('C:','E:')))
    .then((response) => {
        console.log(response.body)
        self.view.expositor(res, {result: response.body})
      })
}

apiGuardaDocumento.prototype.get_InsertaLogDocumento = function(req, res, next) {
    
    var self = this;
    var idPertra  =  req.query.idPertra;
    var idVale	  =  req.query.idVale;
    var jsonDatos =  req.query.jsonDatos;
    var respuesta =  req.query.respuesta;


    var params = [
        { name: 'idPertra',  value: idPertra,  type: self.model.types.INT },
        { name: 'idVale',    value: idVale,    type: self.model.types.STRING },
        { name: 'jsonDatos', value: jsonDatos, type: self.model.types.STRING },
        { name: 'respuesta', value: respuesta, type: self.model.types.STRING }
    ];
    this.model.query('INSERTA_LOG_API_DOCUMENTO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

   module.exports = apiGuardaDocumento;