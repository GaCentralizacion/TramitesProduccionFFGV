registrationModule.controller('nuevoTramiteController', function ($scope, $rootScope, $location, localStorageService, nuevoTramiteRepository) {
    
    $scope.allTramites = [];
    $scope.selTramite = 0;

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.getAllTramite();
        if( !localStorage.getItem('borrador') ){
        }else{
            $scope.selTramite = JSON.parse(localStorage.getItem('borrador')).idTramite;
        }
    };

    $scope.goNuevoTramite = function() {
        $scope.selTramite = 0;
        localStorage.removeItem('borrador');
        $scope.init();
    }

    $scope.getAllTramite = function(){
        nuevoTramiteRepository.allTramites($rootScope.user.usu_idusuario).then((res)=>{
            $scope.allTramites = res.data;
        });
    };

    $scope.selectTramite = function(){
        if( $scope.selTramite == null || $scope.selTramite == undefined){
            $scope.selTramite = 0;
        }
    }

    $scope.goMisTramies = function(){
        $location.path('/misTramites');
    }
});
 