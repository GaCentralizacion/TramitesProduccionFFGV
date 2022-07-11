registrationModule.controller('historicoReporteFFController', function ($sce, $scope, historicoReporteFFRepository) {    
    $scope.init = () => {

        console.log('inicio')
        $scope.dataUsuario = JSON.parse(localStorage.getItem('usuario'));
       
    }
})