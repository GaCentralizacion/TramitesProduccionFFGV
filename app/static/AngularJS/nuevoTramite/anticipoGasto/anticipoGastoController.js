registrationModule.controller('anticipoGastoController', function ($scope, $rootScope, $location, anticipoGastoRepository, devolucionesRepository) {
    $scope.idSolicitud = 0;
    $scope.idTramite = 0;
    $scope.accionFormulario = -1;

    $scope.init = () => {
        if (!localStorage.getItem('borrador')) {
            $scope.subTitulo = 'Registro de Anticipo de Gasto';
            $scope.accionFormulario = 0;
            console.log(0);
        } else {
            $scope.idTramite = JSON.parse(localStorage.getItem('borrador')).idTramite;
            $rootScope.usuario = JSON.parse(localStorage.getItem('usuario'));
            $scope.idSolicitud = JSON.parse(localStorage.getItem('borrador')).idPerTra;
            console.log($scope.idSolicitud);
            $scope.subTitulo = 'Numero de solicitud: ' + $scope.idSolicitud;
            var idEstatus = 0;
            anticipoGastoRepository.getAnticipoGastoById($scope.idSolicitud, 5).then((res) => {
                console.log(res);
                if (res.data != null && res.data.length > 0) {
                    idEstatus = res.data[0].idEstatus;
                    if (idEstatus == 0 || idEstatus == 1) {
                        $scope.accionFormulario = 0;
                    }
                    else if (idEstatus == 2) {
                        $scope.comprobar = res.data[0].Comprobar;
                        $('#modalConfirmarAccion').modal('show');
                    } else {
                        $scope.accionFormulario = 1;
                    }
                }
            });
        }
    };

    $scope.confirmarAccion = function (accion) {    
        $scope.accionFormulario = accion; 
        $('#modalConfirmarAccion').modal('hide'); 
    }
});                                                                                                                    