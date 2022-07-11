var registrationModule = angular.module("registrationModule", ["ngRoute", "colorpicker.module", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.moveColumns', 'angular.filter', 'ui.bootstrap', 'ui.bootstrap.modal', 'dndLists', 'rx'])

.config(function($routeProvider, $locationProvider) {

    /*cheange the routes*/
    $routeProvider.when('/', {
        templateUrl: 'AngularJS/Templates/login.html',
        controller: 'loginController'
    });

    $routeProvider.when('/home', {
        templateUrl: 'AngularJS/Templates/home.html',
        controller: 'homeController'
    });

    $routeProvider.when('/registro', {
        templateUrl: 'AngularJS/Templates/registro.html',
        controller: 'registroController'
    });

    $routeProvider.when('/documentos', {
        templateUrl: 'AngularJS/Templates/documentos.html',
        controller: 'documentosController'
    });

    $routeProvider.when('/tramites', {
        templateUrl: 'AngularJS/Templates/tramites.html',
        controller: 'tramitesController'
    });

    $routeProvider.when('/aprobar', {
        templateUrl: 'AngularJS/Templates/aprobar.html',
        controller: 'aprobarController'
    });

    $routeProvider.when('/misTramites', {
        templateUrl: 'AngularJS/Templates/misTramites.html',
        controller: 'misTramitesController'
    });

    $routeProvider.when('/nuevoTramite', {
        templateUrl: 'AngularJS/Templates/nuevoTramite.html',
        controller: 'nuevoTramiteController'
    });

    $routeProvider.when('/aprobarDev', {
        templateUrl: 'AngularJS/Templates/aprobarDev.html',
        controller: 'aprobarDevController'
    });
    
    $routeProvider.when('/aprobarAnticipoGasto', {
        templateUrl: 'AngularJS/Templates/aprobarAnticipoGasto.html',
        controller: 'aprobarAnticipoGastoController'
    });

    $routeProvider.when('/tesoreriaHome', {
        templateUrl: 'AngularJS/Templates/dashTesoreria.html',
        controller: 'tesoreriaController'
    });

    $routeProvider.when('/comprarOrden', {
        templateUrl: 'AngularJS/Templates/ordenDePago.html',
        controller: 'ordenDePagoController'
    });

    $routeProvider.when('/validacioncuenta', {
        templateUrl: 'AngularJS/validacioncuenta/validacioncuenta.html',
        controller: 'ValidacionCuentaController'
    });

    $routeProvider.when('/comprarOrdenFFAG', {
        templateUrl: 'AngularJS/Templates/ordenDePagoFFAG.html',
        controller: 'ordenDePagoFFAGController'
    });

    $routeProvider.when('/transferencia',{
        templateUrl: 'AngularJS/Templates/transferenciaTramite.html',
        controller: 'transferenciaController'
    });

    $routeProvider.when('/aprobarFondoFijo', {
        templateUrl: 'AngularJS/Templates/aprobarFondo.html',
        controller: 'aprobarFondoController'
    });

    $routeProvider.when('/misVales', {
        templateUrl: 'AngularJS/Templates/TramitesVales.html',
        controller: 'misTramitesValesController'
    });

    $routeProvider.when('/aprobarVale', {
        templateUrl: 'AngularJS/Templates/aprobarVale.html',
        controller: 'aprobarValeController'
    });

    $routeProvider.when('/reportesContraloria', {
        templateUrl: 'AngularJS/Templates/reportesContraloria.html',
        controller: 'reportesContraloriaController'
    });

    $routeProvider.when('/traspasosFondoFijo',{
        templateUrl: 'AngularJS/Templates/traspasosFondoFijo.html',
        controller: 'traspasosFondoFijoController'
    })

    $routeProvider.when('/subalternos', {
        templateUrl: 'AngularJS/Templates/subalternos.html',
        controller: 'subalternosController'
    });

    $routeProvider.when('/aprobarFacturaGV', {
        templateUrl: 'AngularJS/Templates/aprobarFacturaGV.html',
        controller: 'aprobarFacturaGVController'
    });
    $routeProvider.when('/reportesComprobacionGV', {
        templateUrl: 'AngularJS/Templates/reportesComprobacionGV.html',
        controller: 'reportesComprobacionGVController'
    });

    $routeProvider.when('/aprobargastosdemas', {
        templateUrl: 'AngularJS/aprobarDeMas/aprobarDeMas.html',
        controller: 'aprobarGastosDeMasController'
    });

    $routeProvider.when('/gastosdemas', {
        templateUrl: 'AngularJS/gastosdemas/gastosdemas.html',
        controller: 'gastosDeMasController'
    });

    $routeProvider.when('/reembolsoFondoFijo', {
        templateUrl: 'AngularJS/templates/reembolsoFondoFijo.html',
        controller: 'reembolsoFondoFijoController'
    });

    $routeProvider.when('/arqueo', {
        templateUrl: 'AngularJS/Templates/arqueo.html',
        controller: 'reportesContraloriaController'
    });

    $routeProvider.otherwise({ redirectTo: '/home' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed             
        });
        changeHeight(); // when page loads          
    };
});



registrationModule.directive("numberdecimal", function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                var $input = $(this);
                var value = $input.val();
                value = value.replace(/[^0-9\.]/g, '')
                $input.val(value);
                if (event.which == 64 || event.which == 16) {
                    // numbers  
                    return false;
                } if ([8, 9, 13, 27, 37, 38, 39, 40, 110].indexOf(event.which) > -1) {
                    // backspace, tab, enter, escape, arrows  
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // numpad number  
                    return true;
                } else if ([46, 110, 190].indexOf(event.which) > -1) {
                    // dot and numpad dot  
                    return true;
                } else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
});

registrationModule.directive("numberdecimal1punto", function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                var $input = $(this);
                var value = $input.val();
                value = value.replace(/[^0-9\.]/g, '')
                var findsDot = new RegExp(/\./g)
                var containsDot = value.match(findsDot)
                if (containsDot != null && ([46, 110, 190].indexOf(event.which) > -1)) {
                    event.preventDefault();
                    return false;
                }
                $input.val(value);
                if (event.which == 64 || event.which == 16) {
                    // numbers  
                    return false;
                } if ([8, 9, 13, 27, 37, 38, 39, 40, 110].indexOf(event.which) > -1) {
                    // backspace, tab, enter, escape, arrows  
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // numbers  
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    // numpad number  
                    return true;
                } else if ([46, 110, 190].indexOf(event.which) > -1) {
                    // dot and numpad dot  
                    return true;
                } else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})
registrationModule.factory("utils", function($http, rx) {
    return {
        b64toBlob: function(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {
                type: contentType
            });
            return blob;
        }
    }
});