var cuentaAutorizada = global_settings.urlCORS + 'api/cuentaAutorizada/';

registrationModule.factory('ValidacionCuentaRepository', function($http) {
    return {
        detallecuenta: (perTra) => {
            return $http({
                url: cuentaAutorizada + 'detallecuenta/',
                method: "GET",
                params: {
                    perTra: perTra,
                    urlParam: global_settings.urlCORS.split('//').pop().split(':')[0],
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        estatuscuenta: (perTra, estatus, comentariorechazo) => {
            return $http({
                url: cuentaAutorizada + 'estatuscuenta/',
                method: "GET",
                params: {
                    perTra: perTra,
                    Estatus: estatus,
                    comentariorechazo: comentariorechazo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});