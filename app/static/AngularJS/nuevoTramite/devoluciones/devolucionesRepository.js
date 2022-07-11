var devoluciones = global_settings.urlCORS + 'api/devoluciones/';

registrationModule.factory('devolucionesRepository', function($http) {
    return {
        allEmpresas: (usu_idusuario) => {
            return $http({
                url: devoluciones + 'allEmpresas/',
                method: "GET",
                params: {usu_idusuario: usu_idusuario},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        sucByidEmpresa: (idEmpresa, usu_idusuario) => {
            return $http({
                url: devoluciones + 'sucByidEmpresa/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    usu_idusuario: usu_idusuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        allFormaPago: () => {
            return $http({
                url: devoluciones + 'allFormaPago/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        departamentos: (idEmpresa, idSucursal) => {
            return $http({
                url: devoluciones + 'departamentos/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        documentosByTramite: (idTramite) => {
            return $http({
                url: devoluciones + 'documentosByTramite/',
                method: "GET",
                params: {
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveTramite: (data) => {
            return $http({
                url: devoluciones + 'saveTramite/',
                method: "POST",
                data: {
                    idUsuario: data.idUsuario,
                    idTramite: data.idTramite,
                    idFormaPago: data.idFormaPago,
                    idDepartamento: data.idDepartamento,
                    observaciones: data.observaciones,
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal,
                    estatus: data.estatus,
                    devTotal: data.devTotal,
                    idCliente: data.idCliente,
                    cuentaBancaria: data.cuentaBancaria,
                    numeroCLABE: data.numeroCLABE,
                    cveBanxico: data.cveBanxico,
                    bancoTipoCuenta: data.bancoTipoCuenta,
                    esDeIdEstatus: data.esDeIdEstatus,
                    idMotivo : data.idMotivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveDocumentos: (data) => {
            return $http({
                url: devoluciones + 'saveDocumentos/',
                method: "POST",
                data: {
                    idDocumento: data.idDocumento,
                    idTramite: data.idTramite,
                    idPerTra: data.idPerTra,
                    saveUrl: data.saveUrl,
                    idUsuario: data.idUsuario,
                    extensionArchivo: data.extensionArchivo,
                    archivo: data.archivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        dataBorrador: (idPerTra) => {
            return $http({
                url: devoluciones + 'dataBorrador/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        imageBorrador: (idPerTra, idTramite) => {
            return $http({
                url: devoluciones + 'imageBorrador/',
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra,
                    idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateBorrador: (idPerTra, idEmpresa, idFormaPago, observaciones, idSucursal, idDepartamento, devTotal, idCliente, cuentaBancaria, numeroCLABE, cveBanxico, bancoTipoCuenta) => {
            return $http({
                url: devoluciones + 'updateBorrador/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    idEmpresa: idEmpresa,
                    idFormaPago: idFormaPago,
                    observaciones: observaciones,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento,
                    devTotal: devTotal,
                    idCliente: idCliente,
                    cuentaBancaria: cuentaBancaria,
                    numeroCLABE: numeroCLABE,
                    cveBanxico: cveBanxico,
                    bancoTipoCuenta: bancoTipoCuenta
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateDocumentos: (data) => {
            return $http({
                url: devoluciones + 'updateDocumentos/',
                method: "POST",
                data: {
                    idDocumento: data.idDocumento,
                    idTramite: data.idTramite,
                    idPerTra: data.idPerTra,
                    saveUrl: data.saveUrl,
                    idUsuario: data.idUsuario,
                    extensionArchivo: data.extensionArchivo,
                    archivo: data.archivo,
                    det_idPerTra: data.det_idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateBorradorSolicitado: (idPerTra) => {
            return $http({
                url: devoluciones + 'updateBorradorSolicitado/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        clientePerPersona: (idCliente, idEmpresa, idSucursal) => {
            return $http({
                url: devoluciones + 'clientePerPersona/',
                method: "GET",
                params: {
                    idCliente: idCliente,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        clienteDocumentos: (idCliente, idEmpresa, idSucursal, tipo, idPerTra) => {
            return $http({
                url: devoluciones + 'clienteDocumentos/',
                method: "GET",
                params: {
                    idCliente: idCliente,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    tipo: tipo,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveClienteDocumentos: (idPerTra, string) => {
            return $http({
                url: devoluciones + 'saveClienteDocumentos/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    string: string
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        estatusDevoluciones: (idPerTra) => {
            return $http({
                url: devoluciones + 'estatusDevoluciones/',
                method: "GET",
                params: {  idPerTra: idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updFinalizado: (idPerTra) => {
            return $http({
                url: devoluciones + 'updFinalizado/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBancoCVEBanxico: (idPerTra) => {
            return $http({
                url: devoluciones + 'bancoCVEBanxico/',
                method: "GET",
                params: {
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBancoConcentra: (idEmpresa) => {
            return $http({
                url: devoluciones + 'bancoConcentra/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
        ,
        sendMailCliente: (to, subject, html) => {
            return $http({
                url: devoluciones + 'sendMailCliente/',
                method: "GET",
                params: { 
                    to: to,
                    subject: subject,
                    html: html
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBancoTipoCuenta:() => {
            return $http({
                url: devoluciones + 'getBancoTipoCuenta',
                method: 'GET',
                params: {},
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        },
        getObtieneCorreoRol:(data) => {
            return $http({
                url: devoluciones + 'getObtieneCorreoRol',
                method: 'GET',
                params: {
                    idTramite: data.idTramite,  
                    idRol: data.idRol,  
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cancelarTramite: (idPerTra, comentarios) => {
            return $http({
                url: devoluciones + 'cancelarTramite/',
                method: "GET",
                params: {
                    idPerTra: idPerTra,
                    comentarios: comentarios
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        motivoDevolucion: () => {
            return $http({
                url: devoluciones + 'motivoDevolucion/',
                method: "GET",
                params: { },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        validaCuentaBancaria: function (ctaBancaria,convenio, idCliente) {

            return $http({
                url: devoluciones + 'validaCuentaBancaria',
                method: 'GET',
                params: {
                    ctaBancaria: ctaBancaria,
                    convenio : convenio,
                    idCliente : idCliente

                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            // return $http.get(url + 'validaCuentaBancaria/', {
            //     params: {
            //         ctaBancaria: ctaBancaria,
            //         convenio : convenio
            //     }
            // });
        },
        tramitePendiente: function (idCliente,idEmpresa,idSucursal) {

            return $http({
                url: devoluciones + 'tramitependiente',
                method: 'GET',
                params: {
                    idCliente: idCliente,
                    idEmpresa : idEmpresa,
                    idSucursal : idSucursal

                },
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            // return $http.get(url + 'validaCuentaBancaria/', {
            //     params: {
            //         ctaBancaria: ctaBancaria,
            //         convenio : convenio
            //     }
            // });
        }
    };

});