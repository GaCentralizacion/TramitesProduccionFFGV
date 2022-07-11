var subalternos = `${global_settings.urlCORS}api/subalternos` 
registrationModule.factory('subalternosRepository', function($http){
    return{

        clasificacionJerarquia:()=>{
            return $http({
                url:`${subalternos}/clasificacion`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                }
            })
        },
        clasificacionSubalterno:(idUsuario) => {
            return $http({
                url:`${subalternos}/clasificacionSubalternos`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                },
                params:{
                    'idUsuario':idUsuario
                }
            })
        },
        departamentos:(idEmpresa, idSucursal) => {
            return $http({
                url:`${subalternos}/Departamentos`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                },
                params:{
                    'idEmpresa':idEmpresa,
                    'idSucursal':idSucursal
                }
            })
        },
        listaSubalternos:(idEmpresa,idSucursal,idDepartamento,idUsuario) => {
            return $http({
                url:`${subalternos}/listaUsuarios`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                },
                params:{
                    'idEmpresa': idEmpresa,
                    'idSucursal': idSucursal,
                    'idDepartamento': idDepartamento,
                    'idUsuario': idUsuario
                }
            })
        },
        listadoSubalterno:(idUsuario) => {
            return $http({
                url:`${subalternos}/listadoSubalterno`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                },
                params:{
                    'idUsuario':idUsuario
                }
            })
        },
        insertaBorraSubalternos:(idPadre,idUsuario,idEmpresa,idSucursal, idDepartamento,jerarquia, autoriza,opcion) => {
            return $http({
                url:`${subalternos}/insertaBorraSubalternos`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                },
                params:{
                    'idPadre': idPadre,
                    'idUsuario': idUsuario,
                    'idEmpresa': idEmpresa,
                    'idSucursal': idSucursal,
                    'idDepartamento': idDepartamento,
                    'jerarquia': jerarquia,
                    'autoriza': autoriza,
                    'opcion': opcion
                }
            })
        },
        sublaternosAutorizador:(idEmpresa,idSucursal, idDepartamento,idUsuario, autoriza) => {
            return $http({
                url:`${subalternos}/sublaternosAutorizador`,
                method: 'GET',
                headers:{
                    'Content-Type':'aplication/json'
                },
                params:{
                    'idEmpresa': idEmpresa,
                    'idSucursal': idSucursal,
                    'idDepartamento': idDepartamento,
                    'idUsuario': idUsuario,
                    'autoriza': autoriza
                }
            })
        }
    }
});