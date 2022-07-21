var misTramitesVales = global_settings.urlCORS + 'api/fondoFijo/';

registrationModule.factory('misTramitesValesRepository', function($http) {
    return {
        misVales: function(idUsuario) {
            return $http({
                url: misTramitesVales + 'misvales/',
                method: "GET",
                params: {
                    idusuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarEvidencia: (data) => {
            return $http({
                url: misTramitesVales + 'saveEvidencias/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarFactura: (data) => {
            return $http({
                url: misTramitesVales + 'saveFacturas/',
                method: "POST",
                data: {data},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        EliminarEvidenciaFactura: (idValeEvidencia) => {
            return $http({
                url: misTramitesVales + 'EliminarEvidenciaFactura/',
                method: "POST",
                data: {idValeEvidencia:idValeEvidencia},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        actualizarEvidencia: (data) => {
            return $http({
                url: misTramitesVales + 'updateEvidencias/',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getListaVales: function(id_perTra, idVale) {
            return $http({
                url: misTramitesVales + 'ListaVales/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    idVale: idVale
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        validaFactura: function (path) {
            return $http({
                url: misTramitesVales + 'validaFactura/',
                method: "GET",
                params: {
                    path: path
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaFactura: function (path) {
            return $http({
                url: misTramitesVales + 'validaFactura/',
                method: "GET",
                params: {
                    path: path
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertarFactura: function (parametros) {
            return $http({
                url: misTramitesVales + 'insertarFactura/',
                method: "GET",
                params: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertarFacturaOrden: function (parametros) {
            return $http({
                url: misTramitesVales + 'insertarFacturaOrden/',
                method: "GET",
                params: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateTramiteValeEvidencia: (idValeEvidencia, accion, comentario, compNoAutorizado, idUsuario) => {
            return $http({
                url: misTramitesVales + 'updateTramiteValeEvidencia/',
                method: "POST",
                data: {
                    idValeEvidencia: idValeEvidencia,
                    accion: accion,
                    comentario: comentario,
                    compNoAutorizado: compNoAutorizado,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getlistaFondoFijoSuc: (idUsuario) => {
            return $http({
                url: misTramitesVales + 'FondoFijoxSucursalUsuario/',
                method: "GET",
                params: {idUsuario:idUsuario},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getParametroFF: (userId) => {
            return $http({
                url: misTramitesVales + 'parametroFondoFijo/',
                method: "GET",
                params: {userId:userId},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updParametroFondoFijo: (userId, porcentaje) => {
            return $http({
                url: misTramitesVales + 'updParametroFondoFijo/',
                method: "GET",
                params: {userId:userId, porcentaje: porcentaje},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminarEvidencia: function (idValeEvidencia, url) {
            return $http({
                url: misTramitesVales + 'eliminaEvidencia/',
                method: "GET",
                params: {
                    idValeEvidencia: idValeEvidencia,
                    url: url
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        // getConceptoAfectacion: (idEmpresa, idSucursal, areaAfec, retencion ) => {
        //     return $http({
        //         url: misTramitesVales + 'ConceptoAfectacion/',
        //         method: "GET",
        //         params: {
        //             idEmpresa: idEmpresa,
        //             idSucursal: idSucursal,
        //             areaAfec: areaAfec,
        //             retencion: retencion
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },
        getConceptoAfectacion: (idEmpresa, idSucursal) => {
            return $http({
                url: misTramitesVales + 'ConceptoAfectacion/',
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
        getBuscarAutorizador: (idFondoFijo) => {
            return $http({
                url: misTramitesVales + 'buscarAutorizador/',
                method: "GET",
                params: {idFondoFijo:idFondoFijo},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getEliminarSolicitudVale: (id, idVale) => {
            return $http({
                url: misTramitesVales + 'eliminarSolicitudVale/',
                method: "GET",
                params: {
                    id: id,
                    idVale: idVale
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipoComprobante: (idSucursal) => {
            return $http({
                url: misTramitesVales + 'valesTipoComprobante/',
                method: "GET",
                params: {idSucursal:idSucursal},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getBuscarPersona: (idPersona, esid, esRFC, esnombre, nombre, idsucursal) => {
            return $http({
                url: misTramitesVales + 'buscarPersona/',
                method: "GET",
                params: {
                    idPersona:idPersona,
                    esid: esid,
                    esRFC: esRFC,
                    esnombre,
                    nombre: nombre,
                    idsucursal: idsucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenesCompra: (idProveedor, idEmpresa, idSucursal, idDepartamento) => {
            return $http({
                url: misTramitesVales + 'obtenerOrdenesCompra/',
                method: "GET",
                params: {
                    idProveedor:idProveedor,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getValidaOrdenCompra: (idOrden, idSucursal) => {
            return $http({
                url: misTramitesVales + 'ValidaOrdenCompra/',
                method: "GET",
                params: {
                    idOrden:idOrden,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaValesUsuario: function (idUsuario) {
            return $http({
                url: misTramitesVales + 'validaValesUsuario/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaPeriodoContable: function (idSucursal,periodo) {
            return $http({
                url: misTramitesVales + 'validaPeriodoContable/',
                method: "GET",
                params: {
                    idSucursal: idSucursal,
                    periodo: periodo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaEstatusNotificacion: function (idValeEvidencia, tipo) {
            return $http({
                url: misTramitesVales + 'actualizaEstatusNotificacion/',
                method: "GET",
                params: {
                    idValeEvidencia: idValeEvidencia,
                    tipo: tipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaEstatusNotificacionEvidencia: function (idValeEvidencia, estatus) {
            return $http({
                url: misTramitesVales + 'actualizaEstatusNotificacionEvidencia/',
                method: "GET",
                params: {
                    idValeEvidencia: idValeEvidencia,
                    estatus: estatus
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        renunciaEvidencia: function (idComprobacion) {
            return $http({
                url: misTramitesVales + 'renunciaEvidencia/',
                method: "GET",
                params: {
                    idComprobacion: idComprobacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDepartamentosXFondo: function (idFondo) {
            return $http({
                url: misTramitesVales + 'departamentosXFondo/',
                method: "GET",
                params: {
                    idFondo: idFondo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDepartamentosXFondoAreaFF: function (idFondo) {
            return $http({
                url: misTramitesVales + 'departamentosXFondoAreaFF/',
                method: "GET",
                params: {
                    idFondo: idFondo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDepartamentosXFondosFijos: function (idFondo) {
            return $http({
                url: misTramitesVales + 'departamentosXFondosFijos/',
                method: "GET",
                params: {
                    idFondo: idFondo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getBuscarAutorizadorXDepartamento: (idEmpresa, idSucursal, idDepartamento) => {
            return $http({
                url: misTramitesVales + 'buscarAutorizadorXDepartamento/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento}
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getBuscarAutorizadorXDepartamentoArea: (idEmpresa, idSucursal, idDepartamento) => {
            return $http({
                url: misTramitesVales + 'buscarAutorizadorXDepartamentoArea/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idDepartamento: idDepartamento}
                    ,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        toleranciaVale: () => {
            return $http({
                url: misTramitesVales + 'toleranciaVale/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getvalidaValeApertura: (idVale) => {
            return $http({
                url: misTramitesVales + 'validaValeApertura/',
                method: "GET",
                params: {
                    idVale: idVale,
                    },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaAperturaVale: (idVale, razonApertura) => {
            return $http({
                url: misTramitesVales + 'actualizaAperturaVale/',
                method: "GET",
                params: {
                    idVale: idVale,
                    razonApertura: razonApertura
                    },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

	    getValidaNotificacion: function(id_perTra, idVale) {
            return $http({
                url: misTramitesVales + 'ValidaNotificacion/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    idVale: idVale
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getDataComplementoFF: (id_perTra,idVale) => {
            return $http({
                url: misTramitesVales + 'getDataComplementoFF/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    idVale: idVale
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

    };

});
