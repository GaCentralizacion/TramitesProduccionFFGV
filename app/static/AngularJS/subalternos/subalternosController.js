registrationModule.controller('subalternosController', function ($scope, $rootScope, $location, localStorageService, subalternosRepository, aprobarDevRepository) {


    $scope.clasificacion=[];
    $scope.listaEmpresas = [];
    $scope.listaSucursales = [];
    $scope.listaDepartamentos = [];
    $scope.listaUsuarios = [];
    $scope.listaAgregados = [];
    $scope.selDepartamento;
    $scope.selEmpresa;
    $scope.selClasificacion;
    $scope.selClasificacionPadre;
    $scope.selSucursal;
    $scope.selSubAlterno;
    $scope.disabledSuc = true;
    $scope.disableDep = true;
    $scope.disableSubAl = true;
    $scope.nombreClasificacion;
    $scope.nombreClasificacionPadre;
    $scope.autorizaciones = [{id:1, nombre:'Si'},{id:0,nombre:'No'}];
    $scope.selAutorizacion = 0;

    $scope.init = () => {
       
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));

        aprobarDevRepository.allEmpresas().then(resp => {
            
            $scope.listaEmpresas = resp.data;
            
        })

        subalternosRepository.clasificacionSubalterno($rootScope.user.usu_idusuario).then(resp=>{
            
            $scope.clasificacion = resp.data;
            $scope.selClasificacion= resp.data[0].id
            $scope.nombreClasificacion = resp.data[0].descripcion
            $scope.selClasificacionPadre = resp.data[1].id
            $scope.nombreClasificacionPadre = resp.data[1].descripcion
        })

        $scope.listadoDeSubalternosCapturados();

    }

    $scope.listadoDeSubalternosCapturados = function(){
        subalternosRepository.listadoSubalterno($rootScope.user.usu_idusuario).then(resp=>{
            $scope.listaAgregados=[]
            $scope.listaAgregados = resp.data;

            $('#subalternos').DataTable().clear();
            $('#subalternos').DataTable().destroy();
            setTimeout(() => {
                
                $('#subalternos').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[ 1, "asc" ]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#subalternos_length').hide();
               

            }, 1000);
        })
    }

    $scope.getSucuesales = function (idEmpresa){
        $scope.disabledSuc = false;
        aprobarDevRepository.sucByidEmpresa(idEmpresa).then(resp => {
     
            $scope.listaSucursales = resp.data;
        })
    }

    $scope.getDepartamentos = function() {
        $scope.disableDep = false;
        subalternosRepository.departamentos($scope.selEmpresa, $scope.selSucursal).then(resp=>{
            
            $scope.listaDepartamentos = resp.data;
        })
    }

    $scope.listaUsuarios = function (){
        $scope.disableSubAl = false;
        subalternosRepository.listaSubalternos($scope.selEmpresa, $scope.selSucursal, $scope.selDepartamento,$rootScope.user.usu_idusuario).then(resp=>{

            $scope.listaUsuarios = resp.data;
        })
    }

    $scope.AgregaBorraSubalternos = function(opcion, idsub, idEmpresa, idSucursal, idDepartamento){

        if(idsub !== undefined){
            $scope.selSubAlterno =  idsub; 
            $scope.selEmpresa = idEmpresa;
            $scope.selSucursal = idSucursal
            $scope.selDepartamento = idDepartamento    
        }
       

        subalternosRepository.insertaBorraSubalternos($scope.selClasificacionPadre, $scope.selSubAlterno, $scope.selEmpresa, $scope.selSucursal, $scope.selDepartamento, $scope.selClasificacion, $scope.selAutorizacion, opcion).then(resp => {
            console.log(resp.data)
            $scope.listadoDeSubalternosCapturados();

        })
    } 

    $scope.checkAutorizador = function(subal){
        subalternosRepository.sublaternosAutorizador(subal.idEmpresa, subal.idSucursal, subal.idDepartamento,subal.idUsuario,subal.autoriza).then(resp => {
          
            $scope.listadoDeSubalternosCapturados();
        })
    }


});