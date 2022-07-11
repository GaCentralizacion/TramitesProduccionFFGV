registrationModule.controller('misTramitesController', function ($scope, $rootScope, $location, localStorageService, misTramitesRepository, homeRepository, $interval, globalFactory) {
    //Variables del controlador
    $scope.tramites = [];
    $scope.tab = 1;

    $scope.init = () => {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.getTramitesByArea();
    };

    $scope.goNuevoTramite = function () {
        localStorage.removeItem('borrador');
        $location.path('/nuevoTramite');
    }

    $scope.goVerTramite = function (tramite) {
        if (!localStorage.getItem('borrador')) {
            localStorage.setItem('borrador', JSON.stringify({ idPerTra: tramite.id_perTra, idTramite: tramite.id_tramite }));
            $location.path('/nuevoTramite');
        } else {
            localStorage.removeItem('borrador');
            localStorage.setItem('borrador', JSON.stringify({ idPerTra: tramite.id_perTra, idTramite: tramite.id_tramite }));
            $location.path('/nuevoTramite');
        }
    };

    $scope.goNuevoTramite = function () {
        localStorage.removeItem('borrador');
        $location.path('/nuevoTramite');
    }

    $scope.isSet = function (tabNum) {
        return $scope.tab === tabNum;
    };

    $scope.setTab = function (newTab) {
        $('#tableMisTramite').DataTable().destroy();
        $('#tableMisTramite').DataTable().destroy();
        $scope.tab = newTab;
        if (newTab == 1) {
            $scope.getTramitesByArea();
        } else if (newTab == 2) {
            $scope.getTramitesByAreaAtendidos();
        } else {
            $scope.getTramitesByAreaFin();
        }
    };




    $scope.getTramitesByArea = () => {
        $scope.tramites = [];
        $('#loading').modal('show');
        misTramitesRepository.misTramites($rootScope.user.usu_idusuario).then((res) => {
            if (res.data.length > 0) {
                $scope.tramites = res.data;
                globalFactory.filtrosTablaTramites('tableMisTramite', 'MIS TRAMITES', 5);

                // $('#tableMisTramite').DataTable().destroy();


                setTimeout(() => {


                    $('#tableMisTramite_length').hide();
                    $('#loading').modal('hide');
                }, 1000);
            } else {
                $('#loading').modal('hide');
                // globalFactory.filtrosTablaTramites('tableMisTramite', 'MIS TRAMITES', 5);
                $('#tableMisTramite').DataTable().destroy();

                swal('', 'No hay trámites para revisar', 'warning');
            }
        });
    }

    $scope.getTramitesByAreaFin = function () {
        $scope.tramites = [];
        $('#loading').modal('show');
        misTramitesRepository.misTramitesFinalizados($rootScope.user.usu_idusuario).then((res) => {
            if (res.data.length > 0) {
                $scope.tramites = res.data;
                globalFactory.filtrosTablaTramites('tableMisTramite', 'MIS TRAMITES', 5);
                //$('#tableMisTramite').DataTable().destroy();
                setTimeout(() => {
                    $('#tableMisTramite_length').hide();
                    $('#loading').modal('hide');
                }, 1000);
            } else {
                $('#tableMisTramite').DataTable().destroy();

                $('#loading').modal('hide');

                swal('', 'No hay trámites en el historial', 'warning');
            }
        });
    }
    $scope.getTramitesByAreaAtendidos = function () {
        $scope.tramites = [];
        $('#loading').modal('show');
        misTramitesRepository.misTramitesAtendidos($rootScope.user.usu_idusuario).then((res) => {
            if (res.data.length > 0) {
                $scope.tramites = res.data;
                globalFactory.filtrosTablaTramites('tableMisTramite', 'MIS TRAMITES', 5);
                setTimeout(() => {
                    $('#tableMisTramite_length').hide();
                    $('#loading').modal('hide');
                }, 1000);
            } else {
                $('#tableMisTramite').DataTable().destroy();

                $('#loading').modal('hide');

                swal('', 'No hay trámites en el historial', 'warning');
            }
        });
    }

});