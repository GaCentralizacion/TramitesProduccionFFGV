    let http = require("http"),
    https = require("https");
    var LoginView = require('../views/reference'),
    LoginModel = require('../models/dataAccess')

    var confParams = require('../../../conf.json');

var Login = function(conf) {
    this.conf = conf || {};

    this.view = new LoginView();
    this.model = new LoginModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


// Login.prototype.get_login = function(req, res, next) {
//     var self = this;
//     var usuario = req.query.usuario;
//     var contrasena = req.query.contrasena

//     var params = [
//         { name: 'usuario', value: usuario, type: self.model.types.STRING },
//         { name: 'contrasena', value: contrasena, type: self.model.types.STRING }
//     ];
//     // this.model.queryAllRecordSet('SEL_VALIDAUSUARIO_PRUEBA_SP', params, function(error, result) {
//         self.view.expositor(res, {
//             //error: error,
//             result: 'Llegue'
//         });
//     // });
// };

Login.prototype.get_login = function(req, res, next) {
    var self = this;
    var usuario = req.query.usuario;
    var contrasena = req.query.contrasena

    var host = this.conf.parameters.login_host; //'192.168.20.121';
    var port = this.conf.parameters.login_port; //8083;

    var param = {
        usu_cu:usuario,
        pwd_cu:contrasena
    }

    var options = {
        host: host,
        path: '/Aplicaciones/lgn.itg?' + toParams(param),
        port: port
    }

    getJSON(options).then(({status, cookie, data}) => {
        // Obtener cookie de session
        var session;
        if (typeof cookie !== 'undefined' && cookie.length > 0)
            session = cookie[0];
        if(data.code == '01')
        {
            var options = {
                host: host,
                path: '/Aplicaciones/Us.itg',
                port: port,
                headers: { 'Cookie': session } // Mandar la cookie de sesion para obtener el usuario
            }
            getJSON(options).then(({status, cookie, data}) => {
                self.view.expositor(res, {
                    //error: error,
                    result: data
                });    
            }, (error) => {
                self.view.expositor(res, {
                    //error: error,
                    result: {
                        'code':'99',
                        'msg':'',
                        'error': 'ERROR GENERAL',
                        'errocode': error
                    }
                });
            });
        }
        else
        {
            self.view.expositor(res, {
                //error: error,
                result: data
            });
        }
    }, (error) => {
        self.view.expositor(res, {
            //error: error,
            result: {
                'code': '99',
                'msg': '',
                'error': 'ERROR GENERAL',
                'errocode' : error
            }
        });
    });
};

Login.prototype.get_getUser = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var entra = req.query.entra;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'entra', value: entra, type: self.model.types.INT }
    ];
    this.model.query('SEL_USUNOMBRE_ROL_SP', params, async function(error, result) {
        let allMenu = await promiseGetAllMenu(idUsuario);
        self.view.expositor(res, {
            error: error,
            result: {res: result, menu: allMenu.data},
        });
    });
};

promiseGetAllMenu = (idUsuario)=>{
    return new Promise((resolve)=>{
        try {
            model = new LoginModel({
                parameters: confParams
            });

            let params = [
                { name: 'idUsuario', value: idUsuario, type: model.types.INT }
            ];
		

            model.query('[SEG_SEL_USUARIO_PERFIL_SP]', params, async function(error, result) {
		
                if( result.length > 0 ){
                    resolve({success : 1, data: result});
                }else{
                    resolve({success : 0});
                };
            });
        } catch (error) {
            resolve({success: 0, err: error});
        };
    });
};

Login.prototype.get_urlReturn = function(req, res, next) {
    var self = this;
    
    this.model.query('SEL_URL_RETURN_PARAMS_SP', [], function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


function toParams(data) {
    return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
}

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 */
function getJSON(options)
{
    //console.log('rest::getJSON');
    let reqHandler = +options.port === 443 ? https : http;
    options.method = 'GET';

    return new Promise((resolve, reject) => {
        let req = reqHandler.request(options, (res) =>
        {
            let output = '';
            //console.log('rest::', options.host + ':' + res.statusCode);
            res.setEncoding('utf8');

            // Obtener cookies
            var rawcookies = res.headers['set-cookie'];
            var cookies;
            if (typeof rawcookies !== 'undefined' && rawcookies.length > 0) {
                // the array is defined and has at least one element
                cookies = rawcookies[0].split(";");
            }

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', () => {
                try {
                    let obj = JSON.parse(output);
                    // console.log('rest::', obj);
                    resolve({
                        statusCode: res.statusCode,
                        cookie: cookies,
                        data: obj
                    });
                }
                catch(err) {
                    //console.error('rest::end', err);
                    reject(err);
                }
            });
        });

        req.on('error', (err) => {
            //console.error('rest::request', err);
            reject(err);
        });

        req.end();
    });
};

module.exports = Login;
