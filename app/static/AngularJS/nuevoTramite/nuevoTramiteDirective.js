var newTramitePath = 'AngularJS/nuevoTramite/';

registrationModule.directive('newtramiteSinTramite', function() {
    return {
        restrict: 'E',
        templateUrl: newTramitePath + 'sinTramite/sinTramite.html',
        controller: 'sinTramiteController'
    };
})
.directive('newtramiteDevoluciones', function(){
    return {
        restrict: 'E',
        templateUrl: newTramitePath + 'devoluciones/devoluciones.html',
        controller: 'devolucionesController'
    };
})

.directive('newtramiteFondoFijo', function(){
        return {
            restrict: 'E',
            templateUrl: newTramitePath + 'fondoFijo/fondoFijo.html',
            controller: 'FondoFijoController'
        };
    })
.directive('newanticipoGasto', function(){
    return {
        restrict: 'E',
        templateUrl: newTramitePath + 'anticipoGasto/anticipoGasto.html',
        controller: 'anticipoGastoController'
    };
})
.directive('newsolicitudGasto', function() {
    return {
        restrict: 'E',
        templateUrl: newTramitePath + 'anticipoGasto/solicitud/solicitudGasto.html',
        controller: 'solicitudGastoController'
      };
})
.directive('newcomprobacionGasto', function() {
    return {
        restrict: 'E',
        templateUrl: newTramitePath + 'anticipoGasto/comprobacion/comprobacionGasto.html',
        controller: 'comprobacionGastoController'
      };

});


