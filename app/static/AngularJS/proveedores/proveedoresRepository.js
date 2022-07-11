var proveedoresURL = global_settings.urlProveedores + 'api/usuario/'
registrationModule.factory('proveedoresRepository', function($http) {
    return {


        /*******PROVEEDORES***********/
        getObtenerCuentas: (idProspecto, opcion, rfc) => {
            return $http({
                url: proveedoresURL + 'obtenerBancosProspecto/',
                method: "GET",
                params: {
                    idProspecto: idProspecto,
                    opcion: opcion,
                    rfc: rfc

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTipocuenta: (idProspecto) => {
            return $http({
                url: proveedoresURL + 'tipoCuenta/',
                method: "GET",
                params: {
                    idProspecto: idProspecto


                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarTipocuenta: (idCuentaBancaria, tipoCta, nombreTipoCtaBancaria, idPerTra) => {
            return $http({
                url: proveedoresURL + 'guardaTipoCuenta/',
                method: "POST",
                params: {
                    idCuentaBancaria: idCuentaBancaria,
                    tipoCta: tipoCta,
                    nombreTipoCtaBancaria: nombreTipoCtaBancaria,
                    idPerTra :idPerTra


                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarTipoProveedor: (idProspecto, rol, nombreRol, empresaId, empresaBD) => {
            return $http({
                url: proveedoresURL + 'guardaTipoProveedor/',
                method: "POST",
                params: {
                    idProspecto: idProspecto,
                    rol: rol,
                    nombreRol: nombreRol,
                    empresaId: empresaId,
                    empresaBD: empresaBD
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getObtenerTipoProveedor: (idProspecto) => {
            return $http({
                url: proveedoresURL + 'obtenerTipoProveedor/',
                method: "GET",
                params: {
                    idProspecto: idProspecto


                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getObtenerRolesProveedor: (idProspecto) => {
            return $http({
                url: proveedoresURL + 'obtenerRolesProveedor/',
                method: "GET",
                params: {
                    idProspecto: idProspecto


                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        eliminarRolProveedor: (idProspectoRol) => {
            return $http({
                url: proveedoresURL + 'eliminarRolProveedor/',
                method: "POST",
                params: {
                    idProspectoRol: idProspectoRol
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        validarRFC: (rfc) => {
            return $http({
                url: proveedoresURL + 'validarRFC/',
                method: "GET",
                params: {
                    rfc: rfc
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarProveedor: (idUsuario, idProspecto, idPerTra) => {
            return $http({
                url: proveedoresURL + 'altaUsuarioBpro/',
                method: "POST",
                data: {
                    idProspecto: idProspecto,
                    idUsuario: idUsuario,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        traerMarcas: () => {
            return $http({
                url: proveedoresURL + 'traerMarcas/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        obtenerEstatusCuenta: (idProspecto, idPerTra) => {
            return $http({
                url: proveedoresURL + 'estatusCuenta/',
                method: "GET",
                params: {
                    idProspecto: idProspecto,
                    idPerTra : idPerTra


                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarCuentaBancariaProveedor: (idUsuario, rfc, idPerTra) => {
            return $http({
                url: proveedoresURL + 'aprobarCuentasBancarias/',
                method: "POST",
                data: {
                    rfc: rfc,
                    idUsuario: idUsuario,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        obtenerDatosProspecto: (idProspecto) => {
            return $http({
                url: proveedoresURL + 'obtenerDatosProspecto/',
                method: "GET",
                params: {
                    idProspecto: idProspecto
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        datosProveedor: (rfc) => {
            return $http({
                url: proveedoresURL + 'datosProveedor/',
                method: "GET",
                params: {
                    rfc: rfc


                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        enviarNotificacionTesoreria: (idUsuario, idProspecto, idPerTra) => {
            return $http({
                url: proveedoresURL + 'enviarNotificacionTesoreria/',
                method: "POST",
                data: {
                    idProspecto: idProspecto,
                    idUsuario: idUsuario,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarProveedorTesoreria: (idUsuario, idProspecto, idPerTra) => {
            return $http({
                url: proveedoresURL + 'altaUsuarioBproTesoreria/',
                method: "POST",
                data: {
                    idProspecto: idProspecto,
                    idUsuario: idUsuario,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        aprobarCuentaBancariaProveedorTesoreria: (idUsuario, rfc, idPerTra) => {
            return $http({
                url: proveedoresURL + 'aprobarCuentaBancariaProveedorTesoreria/',
                method: "POST",
                data: {
                    rfc: rfc,
                    idUsuario: idUsuario,
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateTipoCuenta: (idPerTra) => {
            return $http({
                url: proveedoresURL + 'updateTipoCuenta/',
                method: "POST",
                data: {
                    
                    idPerTra: idPerTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
        /******************/
    };

});