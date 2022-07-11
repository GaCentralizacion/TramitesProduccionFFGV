var nuevoTramite = global_settings.urlCORS + 'api/nuevoTramite/';

registrationModule.factory('nuevoTramiteRepository', function($http) {
    return {
        allTramites: function(idUsuario) {
            return $http({
                url: nuevoTramite + 'allTramites/',
                method: "GET",
                params: { idUsuario: idUsuario },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});
