var loginURL = global_settings.urlCORS + 'api/login/';

registrationModule.factory('loginRepository', function($http) {
    return {
        login: function(usuario, contrasena) {
            return $http({
                url: loginURL + 'login/',
                method: "GET",
                params: {
                    usuario: usuario,
                    contrasena: contrasena
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getUser: function(idUsuario, entra) {
            return $http({
                url: loginURL + 'getUser/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    entra: entra
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getUrlReturn: () => {
            return $http({
                url: loginURL + 'urlReturn/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
    };

});
