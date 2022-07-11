var homeURL = global_settings.urlCORS + 'api/home/';

registrationModule.factory('homeRepository', function($http) {
    return {
        getTramitesByArea: (idArea, usuario, idEmpresa, idSucursal, fIni, fFin) => {
            return $http({
                url: homeURL + 'getTramitesByArea/',
                method: "GET",
                params: {
                    idArea: idArea,
                    usuario: usuario,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    fIni : fIni,
                    fFin : fFin

                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTramitesByAreaFinalizados: (idArea, usuario, idEmpresa, idSucursal, fIni, fFin) => {
            return $http({
                url: homeURL + 'getTramitesByAreaFinalizados/',
                method: "GET",
                params: {
                    idArea: idArea,
                    usuario: usuario,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    fIni : fIni,
                    fFin : fFin
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDiasDiferencias: (idArea, usuario) => {
            return $http({
                url: homeURL + 'getDiasDiferencias/',
                method: "GET",
                params: {
                    idArea: idArea,
                    usuario: usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateEnRevision: (id_perTra) => {
            return $http({
                url: homeURL + 'updateEnRevision/',
                method: "GET",
                params: {
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        ordenescompraanticipo: () => {
            return $http({
                url: homeURL + 'ordenescompraanticipo/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        tipoTramite: (usuario) => {
            return $http({
                url: homeURL + 'tipoTramite/',
                method: "GET",
                params: {

                    usuario: usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        empresaResumen: (usuario) => {
            return $http({
                url: homeURL + 'empresaResumen/',
                method: "GET",
                params: {

                    usuario: usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        sucursalResumen: (usuario, idEmpresa) => {
            return $http({
                url: homeURL + 'sucursalResumen/',
                method: "GET",
                params: {

                    usuario: usuario,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getTramitesByAreaAtendidos: (idArea, usuario, idEmpresa, idSucursal, fIni, fFin) => {
            return $http({
                url: homeURL + 'getTramitesByAreaAtendidos/',
                method: "GET",
                params: {
                    idArea: idArea,
                    usuario: usuario,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    fIni : fIni,
                    fFin : fFin
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        buscaResumen: (idEmpresa, idSucursal, idTramite, fIni,fFin) => {
            return $http({
                url: homeURL + 'buscaResumen/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    idTramite: idTramite,
                    fIni : fIni,
                    fFin : fFin
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});