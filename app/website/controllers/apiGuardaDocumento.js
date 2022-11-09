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

    var filePDF = data.file1.toString();
    var fileXML = data.file2.toString();

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
    .attach('file[]', fs.createReadStream(filePDF))
    .attach('file[]', fs.createReadStream(fileXML))
    .then((response) => {
        console.log(response.body)
        let respuesta  = response.body.msg[0]
        console.log('respuesta: ',respuesta);
        if(respuesta === 'Proceso terminado.'){
            //**Borramos archivo */
            fs.unlinkSync(filePDF)
            fs.unlinkSync(fileXML)
        }

        self.view.expositor(res, {result: response.body})
      })
}

apiGuardaDocumento.prototype.post_GuardaPDFVale = function(req, res, next) { 
    var self = this;

    /**
     * "{
     * url:string,
     * namefile: string,
     * file: base64
     * }"
     */
    var data = JSON.parse(req.query.data)

    var guarda = unirest('POST','http://192.168.20.92/ApiDocumentos/api/Files/saveDocument')
    .headers({'Content-Type': 'application/json'})
    .send(JSON.stringify(data))
    .end( function(res){
        if(res.error) throw new Error(res.error)
        console.log(res.raw_body)
    })
}

apiGuardaDocumento.prototype.get_RecuperaDocumento = function(req, res, next) {

    var self = this;
    var url =  req.query.url;

    var request = require('request');
    var options = {
      'method': 'GET',
      'url': 'http://192.168.20.92/ApiDocumentos/api/Files/getDocument',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"url": url})
    
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      self.view.expositor(res, {
        result: JSON.parse(response.body)
        });
    });

 }


apiGuardaDocumento.prototype.get_InsertaLogDocumento = function(req, res, next) {
    
    var self = this;
    var idPertra  =  req.query.idPertra;
    var idVale	  =  req.query.idVale;
    var jsonDatos =  req.query.jsonDatos;
    var respuesta =  req.query.respuesta;
    var oc        =  req.query.oc

    var params = [
        { name: 'idPertra',  value: idPertra,  type: self.model.types.INT },
        { name: 'idVale',    value: idVale,    type: self.model.types.STRING },
        { name: 'jsonDatos', value: jsonDatos, type: self.model.types.STRING },
        { name: 'respuesta', value: respuesta, type: self.model.types.STRING },
        { name: 'oc',        value: oc,        type: self.model.types.STRING}
    ];
    this.model.query('INSERTA_LOG_API_DOCUMENTO', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

apiGuardaDocumento.prototype.get_UrlRecuperaDocumento = function(req, res, next){
    var self = this;
    
    var ordenCompra = req.query.oc
    var params = [
        {name:'OC', value: ordenCompra, type: self.model.types.STRING}
    ]

    this.model.query('Centralizacionv2.dbo.SEL_DOCUMENTO_PROVEEDORES_RUTA_SP', params, function(error, result){
        self.view.expositor(res,{
            error: error,
            result:result
        })
    })
}

   module.exports = apiGuardaDocumento;