registrationModule.controller('tramitesController', function ($scope, $rootScope, $location, localStorageService, tramitesRepository) {

    //Varibales del controlador
    $scope.areas;
    $scope.tram = {
        nombre: '',
        area: 0
    };
    //Varibales para drag and drop
    $scope.models = {
        selected: null,
        lists: { "A": [], "B": [] }
    };

    $scope.init = function () {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.getAllAreas();
        $scope.getAllDocs();
    }

    $scope.getAllAreas = function () {
        tramitesRepository.getAllAreas().then(function (res) {
            if (res.data.length > 0) {
                $scope.areas = res.data;
            } else {
                swal('Alto', 'Ocurrio un error al cargar las areas', 'warning');
            }
            $scope.areas = res.data;
        });
    }

    $scope.getAllDocs = function () {
        tramitesRepository.allDocumentos().then(function (res) {
            if (res.data.length > 0) {
                $scope.models.lists.B = res.data;
            } else {
                swal('Alto', 'No se cargaron los documentos', 'warning');
            }
        });
    }

    $scope.saveTramite = function () {
        if ($scope.tram.area == 0 || $scope.tram.area == null || $scope.tram.area == undefined || $scope.tram.area == '') {
            swal('Alto', 'Debes seleccionar una area', 'warning');
        } else {
            $('#loading').modal('show');
            tramitesRepository.saveTramite($scope.tram.nombre, $scope.tram.area, $rootScope.user.usu_idusuario).then(function (res) {
                if (res.data[0].success == 1) {
                    $scope.saveDocsTramite(res.data[0].idTramite);
                } else {
                    swal('Alto', 'Hubo un error al guardar el tramite', 'warning');
                }
            });
        }
    }

    $scope.saveDocsTramite = function (idTramite) {
        var data = '';
        for (var i = 0; i < $scope.models.lists.A.length; i++) {
            if (i + 1 == $scope.models.lists.A.length) {
                data = data + '' + idTramite + ',' + $scope.models.lists.A[i].id_documento;
            } else {
                data = data + '' + idTramite + ',' + $scope.models.lists.A[i].id_documento + '|';
            }
        };
        setTimeout(function () {
            tramitesRepository.saveDocsTramite(data).then(function (res) {
                $('#loading').modal('hide');
                if (res.data[0].success == 1) {
                    $scope.resetForm();
                    swal('Listo', res.data[0].msg, 'success');
                } else {
                    swal('Alto', 'Hubo un error al guardar los documentos del tramite', 'warning');
                }
            });
        }, 1500);
    }

    $scope.resetForm = function () {
        $scope.tram = {
            nombre: '',
            area: 0
        };
        $scope.models = {
            selected: null,
            lists: { "A": [], "B": [] }
        };
        setTimeout(() => {
            $scope.getAllDocs();
        }, 1000);
    }

    // Drag an Drop
    // Model to JSON for demo purpose
    $scope.$watch('models', function (model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});
