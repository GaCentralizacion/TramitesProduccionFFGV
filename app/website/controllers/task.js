var taskView = require('../views/reference'),
    taskModel = require('../models/dataAccess'),
    cron = require('node-cron'),
    Promise = require('bluebird'),
    http = require('http')
var conf = require('../../../conf');
Rutas = require ('../../../conf.json');
var enviaDescuentoNomina = Rutas.enviaDescuentoNomina;


var task = function (conf) {
    this.conf = conf || {};
    this.view = new taskView();
    this.model = new taskModel({
        parameters: this.conf.parameters
    });
    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
};

cron.schedule(enviaDescuentoNomina, function () {
           // console.log(`=====INICIO DEL PROCESO ENVIO DESCUENTO NOMINA FONDO=====`);
           // console.log(Date.now())
            var model = new taskModel({
                parameters: conf
            });  
            var params = [];
        
            // model.queryAllRecordSet('UPD_FONDO_SALIDAEFECTIVO_TRAMITE_SP', params, function (error, result) {
            //     if (error) {
            //     } else {
            //         var tablaSucursal = result[0];
            //         var tablaBO = result[1];
            //         var tablaOV = result[2];
            //         var tablaOT = result[3];
                    
            //         if(tablaSucursal.length == 0)
            //         {console.log("SIN DATOS");}
            //         else
            //         {
            //             for (i = 0; i < tablaSucursal.length; i += 1) {
            //                 tablaSucursal[i].detalleBO = [];
            //                 tablaSucursal[i].detalleOV = [];
            //                 tablaSucursal[i].detalleOT = [];
            //             }
            //             tablaSucursal.forEach(s => {
            //                 if(s.BO == 1)
            //                 {
            //                     tablaBO.forEach(p => {
            //                        if(s.idSucursal == p.idSucursal)
            //                         {
            //                             s.detalleBO.push(p);
            //                         }
            //                     });
                               
            //                 }

            //       
            //                 var params = {
            //                     correoDe: s.correoDe,
            //                     correoPara: s.correoPara,
            //                     CCO: s.CCO,
            //                     asunto: s.asunto,
            //                     texto: '',
            //                     bodyhtml: obtenerDetalleBO(s)
            //                 }
            //                 sendMail(params).then(resSM => {
            //                     console.log("Envío mail: " + resSM);
            //                     });
            //             });  
                                   
            //         }  
            //         }
            //     });    
            });

cron.schedule(enviaDescuentoNomina, function () {
//console.log(`=====INICIO DEL PROCESO ENVIO DESCUENTO NOMINA ANTICIPO=====`);
//console.log(Date.now())
var model = new taskModel({
    parameters: conf
});  
var params = [];
// model.queryAllRecordSet('UPD_FONDO_SALIDAEFECTIVO_TRAMITE_SP', params, function (error, result) {
//     if (error) {
//     } else {
//         var tablaSucursal = result[0];
//         var tablaBO = result[1];
//         var tablaOV = result[2];
//         var tablaOT = result[3];
        
//         if(tablaSucursal.length == 0)
//         {console.log("SIN DATOS");}
//         else
//         {
//             for (i = 0; i < tablaSucursal.length; i += 1) {
//                 tablaSucursal[i].detalleBO = [];
//                 tablaSucursal[i].detalleOV = [];
//                 tablaSucursal[i].detalleOT = [];
//             }
//             tablaSucursal.forEach(s => {
//                 if(s.BO == 1)
//                 {
//                     tablaBO.forEach(p => {
//                        if(s.idSucursal == p.idSucursal)
//                         {
//                             s.detalleBO.push(p);
//                         }
//                     });
                   
//                
//       
//                 var params = {
//                     correoDe: s.correoDe,
//                     correoPara: s.correoPara,
//                     CCO: s.CCO,
//                     asunto: s.asunto,
//                     texto: '',
//                     bodyhtml: obtenerDetalleBO(s)
//                 }
//                 sendMail(params).then(resSM => {
//                     console.log("Envío mail: " + resSM);
//                     });
//             });  
                       
//         }  
//         }
//     });    
});
            
       
cron.schedule(enviaDescuentoNomina, async  function () {
       // console.log(`=====INICIO ORDENES COMPRA VALES=====`);
        var model = new taskModel({
            parameters: conf
        });  
        var params = [];
        var self = this;
        model.query('SEL_VALES_ORDENESCOMPRA_SP', params,async function (error, result) {
            if (error) {
            }
            else {
               // console.log(result);
                var solicitudes = result;
                if(solicitudes.length == 0)
                     {console.log("SIN RESULTADOS VALES");}
                     else
                     {
                        var resolved = [];
                        var errors = [];
                        for (var i = 0; i < solicitudes.length; i++) {
                            try {
                             if(solicitudes[i].ordencompra != null)
                             { 
                                var params = {
                                    idempresa: solicitudes[i].idempresa,
                                    idsucursal: solicitudes[i].idsucursal,
                                    idVale: solicitudes[i].idvale,
                                    montoComprobacion: solicitudes[i].monto
                                }
                                var justificado = await verificaVale(params);  
                                var  verVale =  JSON.parse(justificado);

                                console.log('Vale Detalle')
                                console.log(verVale)
                                if(verVale[0].justificado == 1)
                                        {
                                            if(verVale[0].JustificoMas > 0 && solicitudes[i].compNoAutorizado == 0)
                                            {
                                                if(verVale[0].comprobadoMas > 0)
                                                {
                                                    var paramsPolizaCVFR = {
                                                        idusuario: solicitudes[i].idusuario,
                                                        idsucursal: solicitudes[i].idsucursal,
                                                        tipoProceso: 8,
                                                        documentoOrigen: solicitudes[i].idComprobacionVale,
                                                        ventaUnitario: verVale[0].JustificoMas - verVale[0].comprobadoMas,
                                                        tipoProducto: '',
                                                        canal: solicitudes[i].canal,
                                                        id_perTra: 0,
                                                        banco: '',
                                                        departamento: ''
                                                     }
                                                     let PolizaCVFR = await sendPoliza(paramsPolizaCVFR);
                                                }
                                                else
                                                {
                                                var paramsPolizaAVFF = {
                                                    idusuario: solicitudes[i].idusuario,
                                                    idsucursal: solicitudes[i].idsucursal,
                                                    tipoProceso: 7,
                                                    documentoOrigen: solicitudes[i].idComprobacionVale,
                                                    ventaUnitario: solicitudes[i].monto - verVale[0].JustificoMas,
                                                    tipoProducto: '',
                                                    canal: solicitudes[i].canal,
                                                    id_perTra: 0,
                                                    banco: '',
                                                    departamento: ''
                                                 }
                                                 let PolizaAVFF = await sendPoliza(paramsPolizaAVFF);
                                                     var paramsPolizaCVFR = {
                                                        idusuario: solicitudes[i].idusuario,
                                                        idsucursal: solicitudes[i].idsucursal,
                                                        tipoProceso: 8,
                                                        documentoOrigen: solicitudes[i].idComprobacionVale,
                                                        ventaUnitario: verVale[0].JustificoMas,
                                                        tipoProducto: '',
                                                        canal: solicitudes[i].canal,
                                                        id_perTra: 0,
                                                        banco: '',
                                                        departamento: ''
                                                     }
                                                     let PolizaCVFR = await sendPoliza(paramsPolizaCVFR);

                                                }
                                            }
                                            else if(verVale[0].JustificoMas  > 0 && solicitudes[i].compNoAutorizado == 1)
                                            {
        
                                                if(verVale[0].comprobadoMas > 0)
                                                {
                                                    let PolizaAVFF = await sendPoliza(paramsPolizaAVFF);
                                                    var paramsPolizaCVFR = {
                                                       idusuario: solicitudes[i].idusuario,
                                                       idsucursal: solicitudes[i].idsucursal,
                                                       tipoProceso: 9,
                                                       documentoOrigen: solicitudes[i].idComprobacionVale,
                                                       ventaUnitario: verVale[0].JustificoMas - - verVale[0].comprobadoMas,
                                                       tipoProducto: '',
                                                       canal: solicitudes[i].canal,
                                                       id_perTra: 0,
                                                       banco: '',
                                                       departamento: ''
                                                    }
                                                    let PolizaCVFR = await sendPoliza(paramsPolizaCVFR);
                                                }
                                                else
                                                {
                                                var paramsPolizaAVFF = {
                                                    idusuario: solicitudes[i].idusuario,
                                                    idsucursal: solicitudes[i].idsucursal,
                                                    tipoProceso: 7,
                                                    documentoOrigen: solicitudes[i].idComprobacionVale,
                                                    ventaUnitario: solicitudes[i].monto - verVale[0].JustificoMas,
                                                    tipoProducto: '',
                                                    canal: solicitudes[i].canal,
                                                    id_perTra: 0,
                                                    banco: '',
                                                    departamento: ''
                                                 }
                                                 let PolizaAVFF = await sendPoliza(paramsPolizaAVFF);
                                                     var paramsPolizaCVFR = {
                                                        idusuario: solicitudes[i].idusuario,
                                                        idsucursal: solicitudes[i].idsucursal,
                                                        tipoProceso: 9,
                                                        documentoOrigen: solicitudes[i].idComprobacionVale,
                                                        ventaUnitario: verVale[0].JustificoMas,
                                                        tipoProducto: '',
                                                        canal: solicitudes[i].canal,
                                                        id_perTra: 0,
                                                        banco: '',
                                                        departamento: ''
                                                     }
                                                     let PolizaCVFR = await sendPoliza(paramsPolizaCVFR);
                                                    }
                                            }
                                            else
                                            {
                                                var paramsPolizaAVFF = {
                                                    idusuario: solicitudes[i].idusuario,
                                                    idsucursal: solicitudes[i].idsucursal,
                                                    tipoProceso: 7,
                                                    documentoOrigen: solicitudes[i].idComprobacionVale,
                                                    ventaUnitario: solicitudes[i].monto,
                                                    tipoProducto: '',
                                                    canal: solicitudes[i].canal,
                                                    id_perTra: 0,
                                                    banco: '',
                                                    departamento: ''
                                                 }
                                                 let PolizaAVFF = await sendPoliza(paramsPolizaAVFF);
                                            }   
                                        } 
                                        else
                                        {
                                            var params = {
                                                idusuario: solicitudes[i].idusuario,
                                                idsucursal: solicitudes[i].idsucursal,
                                                tipoProceso: 7,
                                                documentoOrigen: solicitudes[i].idComprobacionVale,
                                                ventaUnitario: solicitudes[i].monto,
                                                tipoProducto: '',
                                                canal: solicitudes[i].canal,
                                                id_perTra: 0,
                                                banco: '',
                                                departamento: ''
                                             }
                                             let Poliza = await sendPoliza(params);
                                            //  sendPoliza(params).then(resSM => {
                                            //      console.log("Envío poliza: " + resSM);
                                            //      });
                                        }
                                    }
                            } catch (e) {
                                errors.push(e);
                            }
                        }           
                     }
            }
        }); 
});

cron.schedule(enviaDescuentoNomina, function () {
  //  console.log(`=====INICIO ORDENES GASTOS DE VIAJE=====`);
   // console.log(Date.now())
    var model = new taskModel({
        parameters: conf
    });  
    var params = [];
    model.query('SEL_CONCEPTOS_ORDENESCOMPRA_SP', params,async function (error, result) {
        if (error) {
        }
        else {
                   // console.log(result);
                    var solicitudes = result;
                    if(solicitudes.length == 0)
                         {console.log("SIN RESULTADOS GV");}
                         else
                         {
                            var resolved = [];
                            var errors = [];
                            for (var i = 0; i < solicitudes.length; i++) {
                                try {
                                 if(solicitudes[i].ordencompra != null)
                                 { 
                                    var params = {
                                        idempresa: solicitudes[i].idempresa,
                                        idsucursal: solicitudes[i].idsucursal,
                                        idComprobacion: solicitudes[i].idConcepto,
                                        montoComprobacion: solicitudes[i].monto
                                    }
                                    var justificado = await verificaConcepto(params);  
                                    var  verVale =  JSON.parse(justificado);
                                    // console.log('Solicitud Anticipo Gastos')
                                    // console.log(solicitudes[i])
                                    console.log('Concepto Detalle')
                                    console.log(verVale)

                                    if(verVale[0].justificado == 1)
                                            {
                                                if(verVale[0].JustificoMas > 0 && solicitudes[i].compNoAutorizado == 0)
                                                {
                                                    if((solicitudes[i].monto - verVale[0].JustificoMas) > 0)
                                                    {
                                                    var paramsPolizaAGVV = {
                                                        idusuario: solicitudes[i].idusuario,
                                                        idsucursal: solicitudes[i].idsucursal,
                                                        tipoProceso: 19,
                                                        documentoOrigen: solicitudes[i].idComprobacionConcepto,
                                                        ventaUnitario: solicitudes[i].monto - verVale[0].JustificoMas,
                                                        tipoProducto: '',
                                                        canal: solicitudes[i].canal,
                                                        id_perTra: 0,
                                                        banco: '',
                                                        departamento: ''
                                                     }
                                                     let PolizaAGVV = await sendPoliza(paramsPolizaAGVV);
                                                    //  sendPoliza(paramsPolizaAGVV).then(resSM => {
                                                    //      console.log("Envío poliza: " + resSM);
                                                    //      });
                                                    }
                                                         var paramsPolizaCGFR = {
                                                            idusuario: solicitudes[i].idusuario,
                                                            idsucursal: solicitudes[i].idsucursal,
                                                            tipoProceso: 20,
                                                            documentoOrigen: solicitudes[i].idComprobacionConcepto,
                                                            ventaUnitario: verVale[0].JustificoMas,
                                                            tipoProducto: '',
                                                            canal: solicitudes[i].canal,
                                                            id_perTra: 0,
                                                            banco: '',
                                                            departamento: ''
                                                         }
                                                         //let PolizaCFGR = await sendPoliza(paramsPolizaCGFR);
                                                        //  sendPoliza(paramsPolizaCGFR).then(resSM => {
                                                        //      console.log("Envío poliza: " + resSM);
                                                        //      });
                                                }
                                                else if(verVale[0].JustificoMas  > 0 && solicitudes[i].compNoAutorizado == 1)
                                                {
                                                    var paramsPolizaAGVV = {
                                                        idusuario: solicitudes[i].idusuario,
                                                        idsucursal: solicitudes[i].idsucursal,
                                                        tipoProceso: 19,
                                                        documentoOrigen: solicitudes[i].idComprobacionConcepto,
                                                        ventaUnitario: solicitudes[i].monto - verVale[0].JustificoMas,
                                                        tipoProducto: '',
                                                        canal: solicitudes[i].canal,
                                                        id_perTra: 0,
                                                        banco: '',
                                                        departamento: ''
                                                     }
                                                     let PolizaAGVV = await sendPoliza(paramsPolizaAGVV);
                                                    //  sendPoliza(paramsPolizaAGVV).then(resSM => {
                                                    //      console.log("Envío poliza: " + resSM);
                                                    //      });
                                                         
                                                         var paramsPolizaCGFN = {
                                                            idusuario: solicitudes[i].idusuario,
                                                            idsucursal: solicitudes[i].idsucursal,
                                                            tipoProceso: 21,
                                                            documentoOrigen: solicitudes[i].idComprobacionConcepto,
                                                            ventaUnitario: verVale[0].JustificoMas,
                                                            tipoProducto: '',
                                                            canal: solicitudes[i].canal,
                                                            id_perTra: 0,
                                                            banco: '',
                                                            departamento: ''
                                                         }
                                                         let PolizaCGFN = await sendPoliza(paramsPolizaCGFN);
                                                        //  sendPoliza(paramsPolizaCGFN).then(resSM => {
                                                        //      console.log("Envío poliza: " + resSM);
                                                        //      });
                                                }
                                                else
                                                {
                                                    var paramsPolizaAGVV = {
                                                        idusuario: solicitudes[i].idusuario,
                                                        idsucursal: solicitudes[i].idsucursal,
                                                        tipoProceso: 19,
                                                        documentoOrigen: solicitudes[i].idComprobacionConcepto,
                                                        ventaUnitario: solicitudes[i].monto,
                                                        tipoProducto: '',
                                                        canal: solicitudes[i].canal,
                                                        id_perTra: 0,
                                                        banco: '',
                                                        departamento: ''
                                                     }
                                                     let PolizaAGVV = await sendPoliza(paramsPolizaAGVV);
                                                    //  sendPoliza(paramsPolizaAGVV).then(resSM => {
                                                    //      console.log("Envío poliza: " + resSM);
                                                    //      });
                                                }   
                                            } 
                                            else
                                            {
                                                var params = {
                                                    idusuario: solicitudes[i].idusuario,
                                                    idsucursal: solicitudes[i].idsucursal,
                                                    tipoProceso: 19,
                                                    documentoOrigen: solicitudes[i].idComprobacionConcepto,
                                                    ventaUnitario: solicitudes[i].monto,
                                                    tipoProducto: '',
                                                    canal: solicitudes[i].canal,
                                                    id_perTra: 0,
                                                    banco: '',
                                                    departamento: ''
                                                 }
                                                 let PolizaAGVV = await sendPoliza(params);
                                                //  sendPoliza(params).then(resSM => {
                                                //      console.log("Envío poliza: " + resSM);
                                                //      });
                                            }
                                        }
                                } catch (e) {
                                    errors.push(e);
                                }
                            }
                        }
        }
    }); 
});


cron.schedule(enviaDescuentoNomina, () => {

    var model = new taskModel({
        parameters: conf
    });  
    var params = [];

    model.query('SEL_ORDENES_COMPRA_TRANSFERENCIA_GV', params,async function (error, result) {
        if(result !== undefined){
            if(result.length > 0 ){

                for(let i= 0; i< result.length; i++){

                    var params = {
                        idusuario: 0,
                        idsucursal: result[i].idsucursal,
                        tipoProceso: 28,
                        documentoOrigen: result[i].documentoOrigen,
                        ventaUnitario: result[i].monto,
                        tipoProducto: 'AC',
                        canal: 'OT',
                        id_perTra: result[i].idPertra,
                        banco: '',
                        departamento: '',
                        ordenCompra: result[i].ordencompra,
                        ordenesMasivas: result[i].ordenesMasivas
                    }

                    let PolizaAGVV = await sendPoliza(params);
                }

                
            }   
        }
        
     }); 

})
 
async function verificaVale (params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/fondoFijo/verificaVale",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (res3) {
            var response = "";
            res3.on('data', (d) => {
                response += d;
            }).on('end', () => {
                resolve(response);
            }).on('error', function (err) {
                console.log('HTTP2 request failed: ' + err);
                reject(err);
            });
        });
    req.write(JSON.stringify(params));
    req.end();
  });
}

async function verificaConcepto (params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/anticipoGasto/verificaConcepto",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (res3) {
            var response = "";
            res3.on('data', (d) => {
                response += d;
            }).on('end', () => {
                resolve(response);
            }).on('error', function (err) {
                console.log('HTTP2 request failed: ' + err);
                reject(err);
            });
        });
    req.write(JSON.stringify(params));
    req.end();
  });
}

async function sendPoliza(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/fondoFijo/insertPoliza",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (res3) {
            var response = "";
            res3.on('data', (d) => {
                response += d;
            }).on('end', () => {
                console.log(response);
                resolve(response);
            }).on('error', function (err) {
                console.log('HTTP2 request failed: ' + err);
                reject(err);
            });
        });
    req.write(JSON.stringify(params));
    req.end();
  });
}
function sendMail(params) {
    return new Promise((resolve, reject) => {
        var puerto = conf.urlCORS.split(':')[2].substr(0, 4), host = conf.urlCORS.split('//')[1].split(':')[0];
        var req = http.request({
            host: host,
            port: puerto,
            path: "/api/sendMail/envia",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        }, function (res3) {
            var response = "";
            res3.on('data', (d) => {
                response += d;
            }).on('end', () => {
                console.log(response);
                resolve(response);
            }).on('error', function (err) {
                console.log('HTTP2 request failed: ' + err);
                reject(err);
            });
        });
    req.write(JSON.stringify(params));
    req.end();
  });
}

module.exports = task;