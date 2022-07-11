var documentosURL = global_settings.urlCORS + 'api/documentos/';

registrationModule.factory('documentosRepository', function ($http) {
    return {
        getExtensiones: function () {
            return $http({
                url: documentosURL + 'allDocumentos/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        saveDocumento: function (nombreDocumento, extension, expiracion, plusInfo, infAdicional, idUsuario) {
            return $http({
                url: documentosURL + 'saveDocumento/',
                method: "POST",
                data: {
                    nombreDocumento: nombreDocumento,
                    extension: extension,
                    expiracion: expiracion,
                    plusInfo: plusInfo,
                    infAdicional: infAdicional,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
    };

});