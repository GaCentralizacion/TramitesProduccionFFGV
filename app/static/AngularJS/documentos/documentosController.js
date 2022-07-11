registrationModule.controller('documentosController', function ($scope, $rootScope, $location, localStorageService, documentosRepository) {

    //Variables del controller
    $scope.extensiones;
    $scope.doc = {
        nombre: '',
        extension: 0,
        expiracion: false,
        plusInfo: false,
        infAdicional: ''
    }

    $scope.init = function () {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.getExtensiones();
    }

    $scope.getExtensiones = function () {
        documentosRepository.getExtensiones().then(function (res) {
            if (res.data.length > 0) {
                $scope.extensiones = res.data;
            } else {
                swal('Alto', 'Hubo un error al traer las extensiones', 'warning');
            }
        });
    }

    $scope.saveDocumento = function () {
        if ($scope.doc.extension == 0) {
            swal('Alto', 'Selecciona una extensión para el documento', 'warning');
        } else if ($scope.doc.plusInfo && $scope.doc.infAdicional == '') {
            swal('Alto', 'Debes colocar la inforacion adicional para el documento', 'warning');
        } else {
            $('#loading').modal('show');
            documentosRepository.saveDocumento(
                $scope.doc.nombre,
                $scope.doc.extension,
                $scope.doc.expiracion ? 1 : 0,
                $scope.doc.plusInfo ? 1 : 0,
                $scope.doc.plusInfo ? $scope.doc.infAdicional : '',
                $rootScope.user.usu_idusuario
            ).then(function (res) {
                console.log('res', res);
                $('#loading').modal('hide');
                if (res.data[0].success == 1) {
                    $scope.doc = {
                        nombre: '',
                        extension: 0,
                        expiracion: false,
                        plusInfo: false,
                        infAdicional: ''
                    }
                    swal('Listo', res.data[0].msg, 'success');
                } else {
                    swal('Alto', res.data[0].msg, 'warning');
                }
            });
        }
    }
});
