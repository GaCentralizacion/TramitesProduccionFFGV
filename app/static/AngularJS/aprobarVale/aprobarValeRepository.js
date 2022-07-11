var aprobarVale = global_settings.urlCORS + 'api/fondoFijo/';

registrationModule.factory('aprobarValeRepository', function($http) {
    return {
        getlistaValesXFondoFijo: (idUsuario) => {
            return $http({
                url: aprobarVale + 'ValesFondoFijo/',
                method: "GET",
                params: {idUsuario:idUsuario},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        updateTramiteVale: (sendData) => {
            return $http({
                url: aprobarVale + 'updateTramiteVale/',
                method: "POST",
                data: sendData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };

});
