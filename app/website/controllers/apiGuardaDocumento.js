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


apiGuardaDocumento.prototype.post_GuardaFactura = async (req, res, next) => { 
    var self = this;
    var data = JSON.parse(req.query.data);

    var req = unirest('POST', 'http://192.168.20.123:4400/api/fileUpload/files/')
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
    .attach('file[]', fs.createReadStream(data.file1))
    .attach('file[]', fs.createReadStream(data.file2))
    .end(function (resp) { 
      if (resp.error) throw new Error(resp.error); 
      self.view.expositor(res, {
        result: resp.response
         })
    });

}

   module.exports = apiGuardaDocumento;