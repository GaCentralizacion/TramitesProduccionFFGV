var misTramites = global_settings.urlCORS + 'api/misTramites/';

registrationModule.factory('misTramitesRepository', function($http) {
    return {
        misTramites: function(idUsuario) {
            return $http({
                url: misTramites + 'misTramites/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        misTramitesFinalizados: function(idUsuario) {
            return $http({
                url: misTramites + 'misTramitesFinalizados/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        misTramitesAtendidos: function(idUsuario) {
            return $http({
                url: misTramites + 'misTramitesAtendidos/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});
