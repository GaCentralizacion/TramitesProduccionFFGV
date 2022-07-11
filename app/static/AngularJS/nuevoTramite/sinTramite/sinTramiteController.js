registrationModule.controller('sinTramiteController', function ($scope, $rootScope, $location, localStorageService) {

    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
    };
});