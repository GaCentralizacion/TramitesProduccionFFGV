var tesoreria = global_settings.urlCORS + 'api/tesoreria/';

registrationModule.factory('tesoreriaRespository', function($http) {
    return {
        allTramites: function(idEstatus, idEmpresa, idSucursal, fIni, fFin) {
            return $http({
                url: tesoreria + 'allTramites/',
                method: "GET",
                params: {
                    idEstatus:idEstatus,
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
        difDay: function() {
            return $http({
                url: tesoreria + 'difDay/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateEnRevision: (id_perTra) => {
            return $http({
                url: tesoreria + 'updateEnRevision/',
                method: "GET",
                params: {
                    id_perTra: id_perTra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateEnRevisionFA: (id_perTra,tipo, consecutivo) => {
            return $http({
                url: tesoreria + 'updateEnRevisionFA/',
                method: "GET",
                params: {
                    id_perTra: id_perTra,
                    tipo: tipo,
                    consecutivo: consecutivo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        CuentaSearch: (busqueda) => {
            return $http({
                url: tesoreria + 'CuentaSearch/',
                method: "GET",
                params: {
                    busqueda:busqueda
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        buscaResumen: (idEmpresa, idSucursal, idTramite, fIni,fFin) => {
            return $http({
                url: tesoreria + 'buscaResumen/',
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