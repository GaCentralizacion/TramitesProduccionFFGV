var tramitesURL = global_settings.urlCORS + 'api/tramites/';

registrationModule.factory('tramitesRepository', function ($http) {
    return {
        getAllAreas: function () {
            return $http({
                url: tramitesURL + 'allAreas/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        allDocumentos: function () {
            return $http({
                url: tramitesURL + 'allDocumentos/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveTramite: function (tramNombre, idArea, idUsuario) {
            return $http({
                url: tramitesURL + 'saveTramite/',
                method: "POST",
                data: {
                    tramNombre: tramNombre,
                    idArea: idArea,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveDocsTramite: function (input) {
            return $http({
                url: tramitesURL + 'saveDocsTramite/',
                method: "POST",
                data: {
                    input: input
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});