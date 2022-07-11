var procesoView = require('../views/reference'),
    procesoModel = require('../models/dataAccess'),
    cron = require('node-cron'),
    http = require('http'),
    sendMail = require('./sendMail')
var conf = require('../../../conf');
Rutas = require ('../../../conf.json');
var envioCorreoAM = Rutas.envioCorreoAM;
var envioCorreoPM = Rutas.envioCorreoPM;
var envioCorreoTesoreria = Rutas.envioCorreoTesoreria; 
var envioCorreoOCPendientesFF = Rutas.envioCorreoOCPendientesFF;



var proceso = function (conf) {
    this.conf = conf || {};
    this.view = new procesoView();
    this.model = new procesoModel({
        parameters: this.conf.parameters
    });
    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
};

cron.schedule(envioCorreoAM, function () {
            console.log(`=====INICIO DEL PROCESO ENVIO CORREOS=====`);
            var model = new procesoModel({
                parameters: conf
            });  
            var params = [];
        
             model.queryAllRecordSet('SEL_VERIFICARPENDIENTESCAJA_SP', params, function (error, result) {
                 if (error) {
                } else {
                     var tablaFondos = result[0];
                     var tablaVales = result[1];
                    
                     if(tablaFondos.length == 0)
                     {console.log("SIN PENDIENTES");}
                     else
                     {
                         for (i = 0; i < tablaFondos.length; i += 1) {
                            tablaFondos[i].detalle = [];
                         }

                         tablaFondos.forEach(f => {
                            tablaVales.forEach(v => {
                                if(f.idFondoFijo == v.idFondoFijo)
                                {
                                    f.detalle.push(v);
                                }
                            });
                               
                             
                             var params = {
                                 to: f.correo,
                                 subject: f.asunto,
                                 html: obtenerDetalle(f)
                             }
                             sendMail2(f.correo, f.asunto, obtenerDetalle(f));

                         });  
                                   
                     }  
                     }
                 });    
            });

cron.schedule(envioCorreoPM, function () {
                console.log(`=====INICIO DEL PROCESO ENVIO CORREOS=====`);
                var model = new procesoModel({
                    parameters: conf
                });  
                var params = [];

                var ts = Date.now() / 1000;
            var x  = ts;
                 model.queryAllRecordSet('SEL_VERIFICARPENDIENTESCAJA_SP', params, function (error, result) {
                     if (error) {
                    } else {
                         var tablaFondos = result[0];
                         var tablaVales = result[1];
                        
                         if(tablaFondos.length == 0)
                         {console.log("SIN PENDIENTES");}
                         else
                         {
                             for (i = 0; i < tablaFondos.length; i += 1) {
                                tablaFondos[i].detalle = [];
                             }
    
                             tablaFondos.forEach(f => {
                                tablaVales.forEach(v => {
                                    if(f.idFondoFijo == v.idFondoFijo)
                                    {
                                        f.detalle.push(v);
                                    }
                                });
                                   
                                 
                                 var params = {
                                     to: f.correo,
                                     subject: f.asunto,
                                     html: obtenerDetalle(f)
                                 }
                                 sendMail2(f.correo + ';' + f.correoEscalado, f.asunto, obtenerDetalle(f));
    
                             });  
                                       
                         }  
                         }
                     });    
                });

cron.schedule(envioCorreoTesoreria, function () {
console.log(`=====INICIO DEL PROCESO ENVIO CORREOS TESORERIA=====`);
var model = new procesoModel({
    parameters: conf
});  
var params = [];
    model.queryAllRecordSet('SEL_VERIFICARPENDIENTESTESORERIA_SP', params, function (error, result) {
        if (error) {
        } else {
        var tablaCabecero = result[0][0]; 
        var tablaTesoreria = result[1];                    
        if(tablaTesoreria.length == 0)
        {console.log("SIN PENDIENTES");}
        else
        {                
        var params = {
             to: tablaCabecero.correo,
             subject: tablaCabecero.asunto,
             html: obtenerDetalleTesoreria(tablaTesoreria)
         }
         sendMail2(tablaCabecero.correo, tablaCabecero.asunto, obtenerDetalleTesoreria(tablaTesoreria)) 
                      
        }  
        }
    });    
});
                  



function obtenerDetalle(datos) {
        var html =`<!DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <body>`;
                html += `<b>LISTADO COMPROBACIONES</b>
                <table border="1">
                <thead><tr  bgcolor="#E6E0E0">
                <td style="font-weight: bold; padding-right: 30px" colspan="2">FONDO FIJO</td>
                <td style="font-weight: bold; padding-right: 30px" colspan="2">RESPONSABLE</td>
                <td style="font-weight: bold; padding-right: 30px">VALE</td>
                <td style="font-weight: bold; padding-right: 30px" colspan="2">SOLICITANTE</td>
                <td style="font-weight: bold; padding-right: 30px" colspan="2">COMPROBACIÓN</td>
                <td style="font-weight: bold; padding-right: 30px">MONTO</td>
                <td style="font-weight: bold; padding-right: 30px">FECHA</td>
                </tr><thead>
                <tbody>   
                ${datos.detalle.map(det => {
                    return `<tr>
                                <td colspan="2">${det.idFondoFijo}</td>
                                <td colspan="2">${det.Cajero}</td>
                                <td>${det.idVale}</td>
                                <td colspan="2">${det.Solicitante}</td> 
                                <td colspan="2">${det.idComprobacionVale}</td>
                                <td>$${det.monto}</td>
                                <td>${det.fechaComprobacion}</td>
                            </tr>`
                }).join('')}
                </tbody>
                </table>
                <p> Recuerda que debes aprobar o rechazar todas las comprobaciones de los vales.</p>`;           
            html += `</body>
            </html>`
            return html;
        };

function obtenerDetalleTesoreria(datos) {
            var html =`<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    </head>
                    <body>`;
                    html += `<b>LISTADO TRAMITES</b>
                    <table border="1">
                    <thead><tr  bgcolor="#E6E0E0">
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">TRAMITE</td>
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">TIPO</td>
                    <td style="font-weight: bold; padding-right: 60px" colspan="4">EMPRESA</td>
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">SUCURSAL</td>
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">BANCO SALIDA</td>
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">CUENTA SALIDA</td>
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">BANCO ENTRADA</td>
                    <td style="font-weight: bold; padding-right: 30px" colspan="2">CUENTA ENTRADA</td>
                    <td style="font-weight: bold; padding-right: 30px">MONTO</td>
                    </tr><thead>
                    <tbody>   
                    ${datos.map(det => {
                        return `<tr>
                                    <td colspan="2">${det.id_perTra}</td>
                                    <td colspan="2">${det.tipo}</td>
                                    <td colspan="4">${det.empresa}</td>
                                    <td colspan="2">${det.sucursal}</td>
                                    <td colspan="2">${det.bancoSalida}</td> 
                                    <td colspan="2">${det.cuentaSalida}</td>
                                    <td colspan="2">${det.bancoEntrada}</td> 
                                    <td colspan="2">${det.cuentaEntrada}</td>
                                    <td>${det.monto}</td>
                                </tr>`
                    }).join('')}
                    </tbody>
                    </table>
                    <p> NOTA: Este es un correo para indicarle los tramites que tiene pendientes de procesar. Los cuales deben ser procesados desde el sistema de Fondos Fijos.</p>`;           
                html += `</body>
                </html>`
                return html;
            };


function sendMail2 (to, subject, html){
    var self = new procesoView();
        sendMail.envia(to, subject, html).then((resPromise)=>{
            //self.view.expositor(res, {
            //    result: resPromise
            //});
        });
}


module.exports = proceso;