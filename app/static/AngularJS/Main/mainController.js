registrationModule.controller('mainController', function ($scope, $rootScope, $location, localStorageService, loginRepository) {
    $rootScope.menu = [];
    $scope.init = function () {
	

               
        var entra = 0;
        if (!($('#lgnUser').val().indexOf('[') > -1) || getParameterByName('employee') != '') {
            var idUsuario = 0;
            if (!($('#lgnUser').val().indexOf('[') > -1) == true) {
                idUsuario = $('#lgnUser').val()
                entra = 1;
            } else {
                idUsuario = getParameterByName('employee');
                entra = 2;
            }
            loginRepository.getUser(idUsuario, entra).then(function (res) {
                if (res.data.res.length == 1) {
                        if (!($('#lgnUser').val().indexOf('[') > -1) == true) {
                            localStorage.setItem('usuario', JSON.stringify(res.data.res[0]));
                            $rootScope.ver = true;
                            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
                            $rootScope.userInit = idUsuario;
                            setTimeout(function () {
                                $(".cargando").remove();
                                if ($rootScope.user.idRol == 1) {
                                    $rootScope.verBotones = true;
                                } else {
                                    $rootScope.verBotones = false;
                                }
                            }, 500);
                        } else {
                            setTimeout(function () {
                                $(".cargando").remove();
                                $('#navbar').hide();
                                $('#mainnav-container').hide();
                                $('.btn-circleBack').hide();
                            }, 500);
                        }
                    localStorage.setItem('menu', JSON.stringify(res.data.menu));
                    $rootScope.menu = res.data.menu;
                    $location.path(res.data.res[0].pathUrl);

                } else {
                    swal('Alto', 'No tienes acceso a esta aplicacion', 'error');
                }
            });
        } else if (localStorage.getItem('usuario')) {
            $rootScope.ver = true;
            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
            loginRepository.getUser($rootScope.user.usu_idusuario, 1).then(function (res) {
                if (res.data.res.length == 1) {
                      
                    localStorage.setItem('menu', JSON.stringify(res.data.menu));
                    $rootScope.menu = res.data.menu;
                  
                } else {
                    swal('Alto', 'No tienes acceso a esta aplicacion', 'error');
                }
            });

           // $rootScope.menu = JSON.parse(localStorage.getItem('menu'));
            setTimeout(function () {
                $(".cargando").remove();
            }, 500);
        } else {
            //swal('Alto', 'Accede desde el panel de aplicaciones', 'error');
        }
    }

    // ************** NOTA se limpian todos los localStorage utilizados
    $scope.salir = function () {
        var ancho = $('#mainnav-menu-wrap').width();
        if (ancho > 200)
            $(".mainnav-toggle").click();
        localStorage.removeItem('usuario');
        localStorage.removeItem('id_perTra');
        $location.path('/');
    }
});
