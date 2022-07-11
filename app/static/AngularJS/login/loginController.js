registrationModule.controller('loginController', function ($scope, $rootScope, $location, loginRepository, localStorageService) {
    $scope.urlReturn = '';
    $scope.init = function () {
        $rootScope.ver = false;
        $scope.getUrlReturn();
        localStorage.removeItem('usuario');
        setTimeout(function () {
            $(".cargando").remove();
        }, 500);
    };

    $scope.getUrlReturn = () =>{
        loginRepository.getUrlReturn().then((res)=>{
            $scope.urlReturn = res.data[0].pr_descripcion;
        });
    }
    
    $scope.loading = false;

    $scope.login = function() {
        toggle(true);
        var usu_cu = $("#txtUsuario").val();
        var pwd_cu = $("#txtPass").val();
        var msj = validaIndex(usu_cu, pwd_cu);
	    if (msj != "LOS SIGUIENTES CAMPOS SON OBLIGATORIOS:<br>"){
            $("#msjParrafo").html(msj);
            toggle(false);
	    }else{
            loginRepository.login(usu_cu, pwd_cu).then((res) => {
                var data = res.data;
                if(data == null || data == ""){
                    $("#msjParrafo").html('Ocurrio un error<br>');
                    toggle(false);
                }
                else if(data["code"] != "01") {
                    $("#msjParrafo").html(data["error"]);
                    toggle(false);
                }
                else {
                    var cadena=(data["msg"]).split("&");
                    var idUsuario = cadena[1];
                    openApp(idUsuario);
                    //toggle(false);
                }
            }, error => {
                console.log(error);
                swal('Alto', 'Ocurrio un error', 'error');
            });
        }
    }

    function validaIndex(usu_qs, pwd_qs){
        var msj = "LOS SIGUIENTES CAMPOS SON OBLIGATORIOS:<br>";
        if (usu_qs.trim()== null || usu_qs.trim() == ""){msj += " * USUARIO <br>";}
        if (pwd_qs.trim()== null || pwd_qs.trim() == ""){msj += " * CONTRASE&Ntilde;A <br>";}
        return msj;
    }

    function toggle(value){
        $scope.loading = value;
    }

    function openApp(idUsuario) {
        var url='/'; // Tramites
        var titulo = "_top";

        console.log( 'url', url );
        console.log( 'titulo', titulo );

        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", url);
        form.setAttribute("target", titulo);

        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "idUsuario");
        hiddenField.setAttribute("value", idUsuario);
        form.appendChild(hiddenField);

        console.log(form);
        document.body.appendChild(form);
        form.submit();
    };
});
