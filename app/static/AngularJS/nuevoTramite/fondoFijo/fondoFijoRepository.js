var fondoFijo = global_settings.urlCORS + 'api/fondoFijo/';

registrationModule.factory('fondoFijoRepository', function($http) {
    return {
         getEmpresas: (userId) => {
             return $http({
                 url: fondoFijo + 'empresas/',
                 method: "GET",
                 params: {userId:userId},
                 headers: {
                     'Content-Type': 'application/json'
                 }

             });
         },
         getSucursales: (idEmpresa) => {
            return $http({
                url: fondoFijo + 'sucursales/',
                method: "GET",
                params: {idEmpresa:idEmpresa},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDepartamentos: (idEmpresa, idSucursal) => {
            return $http({
                url: fondoFijo + 'departamentos/',
                method: "GET",
                params: {idEmpresa:idEmpresa,
                        idSucursal:idSucursal},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getCuentasContables: (idEmpresa, idSucursal) => {
            return $http({
                url: fondoFijo + 'cuentasContables/',
                method: "GET",
                params: {idEmpresa:idEmpresa,
                        idSucursal:idSucursal},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getFondoFijoId: (idEmpresa, idSucursal,idDepartamento)=>{
            return $http({
                url: fondoFijo + 'fondoFijoId/',
                method: "GET",
                params: {idEmpresa:idEmpresa,
                        idSucursal:idSucursal,
                        idDepartamento:idDepartamento},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
    
        getAutorizadoresFondoFijo: (idEmpresa, idSucursal, idDepartamento)=>{
            return $http({
                url: fondoFijo + 'usuariosAutorizadoresFondoFijo/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa, 
                    idSucursal: idSucursal, 
                    idDepartamento: idDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getBancos: (idEmpresa, idSucursal) => {
            return $http({
                url: fondoFijo + 'Bancos/',
                method: "GET",
                params: {idEmpresa:idEmpresa, idSucursal: idSucursal},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBancosFondo: (id_perTra,tipo) => {
            return $http({
                url: fondoFijo + 'BancosFondo/',
                method: "GET",
                params: {id_perTra:id_perTra, tipo: tipo},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        saveTramite: (data) => {
            return $http({
                url: fondoFijo + 'saveTramite/',
                method: "POST",
                data: {
                    idFF: data.idFF,
                    idTramite : data.idTramite,
                    idEmpresa : data.idEmpresa,
                    idSucursal : data.idSucursal,
                    idDepartamento : data.idDepartamento,
                    idUsuario : data.idUsuario,
                    idAutorizador : data.idAutorizador,
                    descripcion : data.descripcion,
                    nombreFondoFijo : data.nombreFondoFijo,
                    estatus : data.estatus,
                    monto : data.monto,
                    idPersona : data.idPersona,
                    cuentaContable: data.cuentaContable,
                    departamentoArea: data.departamentoArea
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        dataBorrador: (idPerTra) => {
            return $http({
                url: fondoFijo + 'dataBorrador/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        dataBorradorReembolso: (idPerTra) => {
            return $http({
                url: fondoFijo + 'dataBorradorReembolso/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        obtieneEvidenciasReembolsoTramite: (idPerTra) => {
            return $http({
                url: fondoFijo + 'obtieneEvidenciasReembolsoTramite/',
                method: "GET",
                params: {
                    idPerTra:idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        imageBorrador: (idPerTra) => {
            return $http({
                url: fondoFijo + 'imageBorrador/',
                method: "GET",
                params: {
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                    idPerTra: idPerTra
                    //idTramite: idTramite
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getlistaFondoFijo: (idtramite) => {
            return $http({
                url: fondoFijo + 'FondoFijoxUsuario/',
                method: "GET",
                params: {idtramite:idtramite},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getlistaAumentoDecremento: (idtramite) => {
            return $http({
                url: fondoFijo + 'FondoFijoAumentoDecremento/',
                method: "GET",
                params: {idtramite:idtramite},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getlistaFondoFijoVales: (id_perTra) => {
            return $http({
                url: fondoFijo + 'ListaValesFF/',
                method: "GET",
                params: {id_perTra:id_perTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        FondoFijoReembolso: (id_traDe) => {
            return $http({
                url: fondoFijo + 'FondoFijoReembolso/',
                method: "GET",
                params: {id_traDe:id_traDe},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        FondoFijoReembolsoTramite: (id_traDe, idUsuario, monto) => {
            return $http({
                url: fondoFijo + 'FondoFijoReembolsoTramite/',
                method: "GET",
                params: {
                    id_traDe:id_traDe, 
                    idUsuario:idUsuario, 
                    monto: monto
                 },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoUsuario: (userId,tipo) => {
            return $http({
                url: fondoFijo + 'TipoUsuario/',
                method: "GET",
                params: {userId:userId, tipo: tipo},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoUsuarioFondoFijo: (userId,tipo) => {
            return $http({
                url: fondoFijo + 'TipoUsuarioFondoFijo/',
                method: "GET",
                params: {userId:userId},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoUsuarioFondoFijoXSucursal: (userId,id_perta) => {
            return $http({
                url: fondoFijo + 'TipoUsuarioFondoFijoXSucursal/',
                method: "GET",
                params: {userId:userId, id_perta: id_perta},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoUsuarioFondoFijoXSucursalTipo: (tipo,id_perta) => {
            return $http({
                url: fondoFijo + 'TipoUsuarioFondoFijoXSucursalTipo/',
                method: "GET",
                params: {tipo:tipo, id_perta: id_perta},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getlistaFondoFijoSuc: (idSucursal) => {
            return $http({
                url: fondoFijo + 'FondoFijoxSucursal/',
                method: "GET",
                params: {idSucursal:idSucursal},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoGastoFF: () => {
            return $http({
                url: fondoFijo + 'tipoGastoFondoFijo/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveTramiteVale: (data) => {
            return $http({
                url: fondoFijo + 'saveTramiteVale/',
                method: "POST",
                data: {
                    idVale: data.idVale,
                    idUsuario: data.idUsuario,
                    descripcion: data.descripcion,
                    estatus: data.estatus,
                    importe: data.importe,
                    idFondoFijo: data.idFondoFijo,
                    //idtipoGasto: data.idtipoGasto,
                    idAutorizador: data.idAutorizador,
                    valeCompuesto: data.valeCompuesto,
                    idFondoFijo2: data.idFondoFijo2,
                    importeFF1: data.importeFF1,
                    importeFF2: data.importeFF2,
                    idPersona: data.idPersona,
                    idDepartamento: data.idDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        saveBitProceso: (data) => {
            return $http({
                url: fondoFijo + 'saveBitProceso/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        saveBitCorreo: (data) => {
            return $http({
                url: fondoFijo + 'saveBitCorreo/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        estatusFondoFijo: (tipo) => {
            return $http({
                url: fondoFijo + 'estatusFondoFijoVale/',
                method: "GET",
                params: {tipo:tipo},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getlistaValesXFondoFijo: (id_perTra) => {
            return $http({
                url: fondoFijo + 'ValesFF/',
                method: "GET",
                params: {id_perTra:id_perTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        paramFondoFijo: (parametro) => {
            return $http({
                url: fondoFijo + 'paramFondoFijo/',
                method: "GET",
                params: {parametro: parametro},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarSalidaFF: (id_perTra, estatus, tipo,bancoSalida,bancoEntrada, numCuentaSalida, cuentaContableSalida, numCuentaEntrada, cuentaContableEntrada, idTramiteTesoreria, monto) => {
            return $http({
                url: fondoFijo + 'guardarSalidaFF/',
                method: "GET",
                params: {
                        id_perTra:id_perTra, 
                        estatus: estatus, 
                        tipo: tipo, 
                        bancoSalida:bancoSalida, 
                        bancoEntrada:bancoEntrada,
                        numCuentaSalida: numCuentaSalida,
                        cuentaContableSalida: cuentaContableSalida,
                        numCuentaEntrada: numCuentaEntrada,
                        cuentaContableEntrada: cuentaContableEntrada,
                        idTramiteTesoreria: idTramiteTesoreria,
                        monto: monto
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarReembolso: (id_perTra, tipo,bancoSalida,bancoEntrada, estatus, numCuentaSalida, cuentaContableSalida, numCuentaEntrada, cuentaContableEntrada,idTramiteTesoreria) => {
            return $http({
                url: fondoFijo + 'guardarReembolso/',
                method: "GET",
                params: {
                    id_perTra:id_perTra,  
                    tipo: tipo, 
                    bancoSalida:bancoSalida, 
                    bancoEntrada:bancoEntrada,  
                    estatus: estatus,
                    numCuentaSalida: numCuentaSalida,
                    cuentaContableSalida: cuentaContableSalida,
                    numCuentaEntrada: numCuentaEntrada,
                    cuentaContableEntrada: cuentaContableEntrada,
                    idTramiteTesoreria: idTramiteTesoreria
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarReembolsoTramite: (id_perTra, tipo,bancoSalida,bancoEntrada, estatus, numCuentaSalida, cuentaContableSalida, numCuentaEntrada, cuentaContableEntrada,idTramiteTesoreria) => {
            return $http({
                url: fondoFijo + 'guardarReembolsoTramite/',
                method: "GET",
                params: {
                    id_perTra:id_perTra,  
                    tipo: tipo, 
                    bancoSalida:bancoSalida, 
                    bancoEntrada:bancoEntrada,  
                    estatus: estatus,
                    numCuentaSalida: numCuentaSalida,
                    cuentaContableSalida: cuentaContableSalida,
                    numCuentaEntrada: numCuentaEntrada,
                    cuentaContableEntrada: cuentaContableEntrada,
                    idTramiteTesoreria: idTramiteTesoreria
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        avanzarReembolsoTramite: (id_perTra, idReembolso, tipoUsuario, monto) => {
            return $http({
                url: fondoFijo + 'avanzarReembolsoTramite/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    idReembolso: idReembolso,
                    tipoUsuario: tipoUsuario,
                    monto: monto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        AumentoDisminucionFF: (data) => {
            return $http({
                url: fondoFijo + 'AumentoDisminucionFF/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cierreFF: (data) => {
            return $http({
                url: fondoFijo + 'cierreFF/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
          getidPersonabyUsuario: (idUsuario) => {
            return $http({
                url: fondoFijo + 'idPersonabyUsuario/',
                method: "GET",
                params: {idUsuario:idUsuario},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        insertaPoliza: (idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento) => {
            return $http({
                url: fondoFijo + 'insertPoliza/',
                method: "POST",
                data: {idusuario: idusuario,
                    idsucursal: idsucursal,
                       tipoProceso: tipoProceso,
                       documentoOrigen: documentoOrigen,
                       ventaUnitario: ventaUnitario,
                       tipoProducto: tipoProducto,
                       canal: canal,
                       id_perTra: id_perTra,
                       banco: banco,
                       departamento: departamento
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        insertaPolizaFront: (idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento) => {
            return $http({
                url: fondoFijo + 'insertPolizaFront/',
                method: "POST",
                data: {idusuario: idusuario,
                    idsucursal: idsucursal,
                       tipoProceso: tipoProceso,
                       documentoOrigen: documentoOrigen,
                       ventaUnitario: ventaUnitario,
                       tipoProducto: tipoProducto,
                       canal: canal,
                       id_perTra: id_perTra,
                       banco: banco,
                       departamento: departamento
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        insertPolizaOrden: (idempresa ,idsucursal, proceso,foliofondo,venta,id_perTra) => {
            return $http({
                url: fondoFijo + 'insertPolizaOrden/',
                method: "POST",
                data: {
                    idempresa: idempresa,
                    idsucursal: idsucursal,
                    proceso: proceso,
                    foliofondo: foliofondo,
                    venta: venta,
                    id_perTra:id_perTra
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        insertOrdenMasiva: (data) => {
            return $http({
                url: fondoFijo + 'insertOrdenMasiva/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        verificaValesEvidencia: (idVale) => {
            return $http({
                url: fondoFijo + 'verificaValesEvidencia/',
                method: "GET",
                params: {idVale:idVale},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        verificaVale: (idempresa,idsucursal,idVale,montoComprobacion) => {
            return $http({
                url: fondoFijo + 'verificaVale/',
                method: "POST",
                data: {
                    idempresa: idempresa,
                    idsucursal: idsucursal,
                    idVale: idVale,
                    montoComprobacion: montoComprobacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        valeSinComprobar: (idVale, monto) => {
            return $http({
                url: fondoFijo + 'valeSinComprobar/',
                method: "GET",
                params: {
                    idVale: idVale,
                    monto: monto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDepartamentosPorEvidencia: (idValeEvidencia) => {
            return $http({
                url: fondoFijo + 'departamentosPorEvidencia/',
                method: "GET",
                params: {
                    idValeEvidencia: idValeEvidencia
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardarEvidenciaDepartamento: (idDepartamento, porcentaje, idValeEvidencia) => {
            return $http({
                url: fondoFijo + 'guardarEvidenciaDepartamento/',
                method: "POST",
                data: {
                    idDepartamento: idDepartamento,
                    porcentaje: porcentaje,
                    idValeEvidencia: idValeEvidencia
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminaDepartamentoEvidencia: (idValeEvidenciaDepartamento) => {
            return $http({
                url: fondoFijo + 'eliminaDepartamentoEvidencia/',
                method: "POST",
                data: {
                    idValeEvidenciaDepartamento: idValeEvidenciaDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        dataValeXIdVale: (idVale) => {
            return $http({
                url: fondoFijo + 'dataValeXIdVale/',
                method: "GET",
                params: {idVale: idVale},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        dataValeXIdComprobacion: (idComprobacion) => {
            return $http({
                url: fondoFijo + 'dataValeXIdComprobacion/',
                method: "GET",
                params: {idComprobacion: idComprobacion},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ObtieneCC: (idsucursal, poliza, idDepartamento) => {
            return $http({
                url: fondoFijo + 'obtieneCC/',
                method: "GET",
                params: {idsucursal: idsucursal, poliza: poliza, idDepartamento: idDepartamento},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        aprobarFF: (id_perTra) => {
            return $http({
                url: fondoFijo + 'aprobarFF/',
                method: "GET",
                params: {id_perTra: id_perTra},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneCCbySucursal: (idsucursal) => {
            return $http({
                url: fondoFijo + 'obtieneCCbySucursal/',
                method: "GET",
                params: {idsucursal: idsucursal,},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneIVAbySucursal: (idsucursal) => {
            return $http({
                url: fondoFijo + 'obtieneIVAbySucursal/',
                method: "GET",
                params: {idsucursal: idsucursal,},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizarComprobacionVale: (areaAfectacion, tipoConcepto, tipoComprobante, tipoIva, idComprobacionVale, idProveedor) => {
            return $http({
                url: fondoFijo + 'actualizarComprobacionVale/',
                method: "GET",
                params: {
                    areaAfectacion: areaAfectacion,
                    tipoConcepto: tipoConcepto,
                    tipoComprobante: tipoComprobante,
                    tipoIva: tipoIva,
                    idComprobacionVale: idComprobacionVale,
                    idProveedor: idProveedor
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaRetencionesOC: (idsucursal, tipoComprobante, areaAfectacion, conceptoContable) => {
            return $http({
                url: fondoFijo + 'validaRetencionesOC/',
                method: "GET",
                params: 
                {
                    idsucursal: idsucursal,
                    tipoComprobante: tipoComprobante,
                    areaAfectacion: areaAfectacion,
                    conceptoContable: conceptoContable
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardaPolizaCVFR: (data) => {
            return $http({
                url: fondoFijo + 'guardaPolizaCVFR/',
                method: "GET",
                params: data, 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneCorreoFFAG: (idRol) => {
            return $http({
                url: fondoFijo + 'obtieneCorreoFFAG/',
                method: "GET",
                params:{idRol: idRol}, 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneCorreoReembolso: (idEmpresa, idSucursal) => {
            return $http({
                url: fondoFijo + 'obtieneCorreoReembolso/',
                method: "GET",
                params:{idEmpresa: idEmpresa, idSucursal: idSucursal}, 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getProveedor: (idProveedor) => {
            return $http({
                url: fondoFijo + 'buscarProveedor/',
                method: "GET",
                params: {idProveedor:idProveedor},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        cerrarFF: (idFondoFijo) => {
            return $http({
                url: fondoFijo + 'cerrarFondoFijo/',
                method: "GET",
                params: {idFondoFijo:idFondoFijo},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        envioCierreFF: (idFondoFijo) => {
            return $http({
                url: fondoFijo + 'envioCierreFondoFijo/',
                method: "GET",
                params: {idFondoFijo:idFondoFijo},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        cambiaEstatusReembolso: (idPerTra) => {
            return $http({
                url: fondoFijo + 'cambiaEstatusReembolso/',
                method: "GET",
                params: {idPerTra:idPerTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarEvidenciaComprobacion: (data) => {
            return $http({
                url: misTramitesVales + 'guardarEvidenciaComprobacion/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getAutorizadorVale:(idEmpresa
                            , idSucursal
                            , idDepartamento) => {
            return $http({
                url: fondoFijo + 'getAutorizadorVale/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        allEmpresas: (usu_idusuario) => {
            return $http({
                url: fondoFijo + 'allEmpresas/',
                method: "GET",
                params: {usu_idusuario: usu_idusuario},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBuscarAutorizadorXDepartamentoFF: (idEmpresa, idSucursal) => {
            return $http({
                url: misTramitesVales + 'buscarAutorizadorXDepartamento/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },    
        getDepartamentosAreaFF: (idEmpresa, idSucursal) => {
            return $http({
                url: misTramitesVales + 'DepartamentoAreasFF/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getTiposolicitudFondo: (idEmpresa, idSucursal) => {
            return $http({
                url: misTramitesVales + 'TiposolicitudFondo/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },   
        getTiposolicitudXFondo: (idFondo) => {
            return $http({
                url: misTramitesVales + 'TiposolicitudXFondo/',
                method: "GET",
                params: {
                    idFondo: idFondo
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },     
        getReembolsosxfondo: (idfondoFijo) => {
            return $http({
                url: misTramitesVales + 'reembolsosxFondo/',
                method: "GET",
                params: {
                    idfondoFijo: idfondoFijo
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getBuscaAutorizadoresDepartamentosArea: (idEmpresa, idSucursal) => {
            return $http({
                url: misTramitesVales + 'buscarAutorizadorXDepartamentoFF/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getverificaReembolsos: () => {
            return $http({
                url: misTramitesVales + 'verificaReembolsos/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getverificaRechazoFinanzas: () => {
            return $http({
                url: misTramitesVales + 'verificaRechazoFinanzas/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getverificaValesDescuento: () => {
            return $http({
                url: misTramitesVales + 'verificaValesDescuento/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        traeDireccionLugarTrabajo: (idUsuario, idEmpresa, idSucursal) => {
            return $http({
                url: misTramitesVales + 'direccionLugarTrabajo/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getverificaEstatusVales: () => {
            return $http({
                url: fondoFijo + 'verificaEstatusVales/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getverificaCajeroEspejo: () => {
            return $http({
                url: fondoFijo + 'verificaCajeroEspejo/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaUsuarioEspejo: (id, idEstatus, idUsuario) => {
            return $http({
                url: misTramitesVales + 'actualizaUsuarioEspejo/',
                method: "GET",
                params: {
                    id: id,
                    idEstatus: idEstatus,
                    idUsuario: idUsuario
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        autorizadoresUsuarioEspejo: (idUsuario) => {
            return $http({
                url: misTramitesVales + 'autorizadoresCajeroEspejo/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },getReembolsoBancos: (id_perTra) => {
            return $http({
                url: fondoFijo + 'reembolsoBancos/',
                method: "GET",
                params: {id_perTra:id_perTra},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDataComplementoFF: (id_perTra, idVale) => {
            return $http({
                url: fondoFijo + 'get_dataComplementoFF/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    idVale: idVale
                }
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },        
        ActualizaTramitePolizaFF:(
            idValeFF
            ,idUsuario
            ,poliza
            ,documentoConcepto = ''
            ,incremental = 0
            ,ordenCompra = ''
            ,consPol = 0
            ,mesPol = 0
            ,anioPol= 0
            )=>{
            return $http({
                url: fondoFijo + 'ActualizaTramitePolizaFF',
                method: "GET",
                params: {
                    idValeFF,
                    idUsuario,
                    poliza,
                    documentoConcepto,
                    incremental
                    ,ordenCompra
                    ,consPol 
                    ,mesPol 
                    ,anioPol
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }       
    };
});