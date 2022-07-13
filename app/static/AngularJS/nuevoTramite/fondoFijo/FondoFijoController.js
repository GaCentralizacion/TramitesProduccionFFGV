registrationModule.controller('FondoFijoController', function ($scope, $rootScope, $location, localStorageService, fondoFijoRepository, devolucionesRepository, misTramitesValesRepository, aprobarValeRepository, aprobarRepository,anticipoGastoRepository, clientesRepository,aprobarDevRepository, aprobarFondoRepository,apiBproRepository ) {
    $scope.tab = 1;
    $scope.documentosCliente = [];
    $scope.modalTitle = '';
    $scope.allFondoFijo = [];
    $scope.estatusFF;
    $scope.numeroSolicitud = '';
    $scope.aprobarVale = false;
    $scope.recepcionValeDoc = false;
    $scope.razonesRechazo = '';
    $scope.verDecremento = false;
    $scope.tomarVales = false;
    $scope.bloqueoCajero = false;
    $scope.tablaReembolso = 0;
    $scope.urlReembolso = ''
    $scope.departamentosArea = 0;
    $scope.CreacionFF = 0;
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";
    
    //----------BPRO ENPOINT GV------------
    $scope.complementoPolizas = '';
    $scope.emp_nombrecto = '';
    $scope.suc_nombrecto = '';
    $scope.dep_nombrecto = '';
    $scope.incremental = 0;
    $scope.iPersonaDevFF = 0;

    $scope.apiJson = structuredClone(apiJsonBPRO2detalles)

    // -- FIN BPRO ENPOINT FF -- //

    $scope.init = () => {
        $scope.toleranciaVales()
        $scope.idUsuario=JSON.parse(localStorage.getItem('usuario')).usu_idusuario;
        $scope.traeEmpleado();
        fondoFijoRepository.getTipoUsuario($scope.idUsuario,1).then(function successCallback(response) {
        $scope.tipoUsuario = response.data[0].tipoUsuarioFF;
        $scope.nombreUsuario=JSON.parse(localStorage.getItem('usuario')).nombre;
        $scope.traeEmpresas();
        $scope.idTramite = localStorage.getItem('idTramite');
        //$scope.traerAutorizadores();
        if (!localStorage.getItem('borrador')) {
          $scope.getDocumentosByTramite();
          $scope.getParametro('MIN_FF');
          $scope.nuevo = true;
          $scope.numeroSolicitud = ''
          $scope.estatusFF = 0;
          $scope.CreacionFF = 1;
        }
        else
        {
        $scope.getDataBorrador();
        $scope.numeroSolicitud = 'Fondo Fijo No. ' + JSON.parse(localStorage.getItem('borrador')).idPerTra;
        $scope.CreacionFF = 0;
          $scope.nuevo = false;
          $scope.principal = true;
          $scope.listaFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
          $scope.listaAumentoDecremento(JSON.parse(localStorage.getItem('borrador')).idPerTra);
          $scope.listaValeFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
          $scope.id_perTra = JSON.parse(localStorage.getItem('borrador')).idPerTra; 
          $scope.listaValeEvidenciaFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
          $scope.tipoAD = [{ id:1, text:'Aumento'},{ id:2, text:'Decremento'}]
          $scope.tipoSalida = [{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]
          $scope.tipoSalidaReebolso = [{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]
          //$scope.tipoDescuento = [{ id:1, text:'Devolver dinero'},{ id:2, text:'Descuento nomina'}]
          $scope.tipoDescuento = [{ id:1, text:'Devolver dinero'}]
        }
      }, function errorCallback(response) {
      });
       
    };

    $scope.backTramites = function () {
      $location.path('/misTramites');
  }

  $scope.toleranciaVales = function(){
        misTramitesValesRepository.toleranciaVale().then( ( result ) => {
            $scope.tolerancia = result.data[0].centavos;
            console.log( "toleranciaVales", $scope.tolerancia );
        })
    }

  $scope.autorizarVale = function (vale) {
    $scope.id_perTra = vale.id_perTra;
    $scope.urlValeAutorizado = vale.saveUrl;
    $scope.urlValeAutorizadoEvidencia = vale.rutaAutorizado;
    $scope.motivoRechazo = vale.comentario;
    $scope.modalTitleAV = 'Aprobación Vale ' + vale.nombreVale;
    $scope.idestatus = vale.idestatus;
    $scope.idValeFF = vale.idVale;
    $scope.FondoFijoVale = vale.idFondoFijo;
    $scope.tipoGastoVale = vale.tipoTramite;
    $scope.importeValeFF = vale.montoSolicitado;
    $scope.razonVale = vale.razon;
    //$("#aprobarVale").modal("show");
    $scope.aprobarVale = true;
    $scope.principal = false;
    $scope.nombreDepartamentoVale = vale.dep_nombrecto;
    $scope.nombreVale = vale.nombreVale;
    $scope.sucursalVale = vale.idSucursal;
    $scope.nombrePersona = vale.nombrePersona;
    $scope.nombreSucursal =   $scope.sucursales.filter(f => f.idSucursal == $scope.sucursalVale )[0].nombre;
    $scope.empresaSeleted =  $scope.empresas.filter(f => f.emp_idempresa == $scope.idEmpresa)[0];
    $scope.nombreEmpresa = $scope.empresaSeleted.emp_nombre;
    $scope.descargoVale = false;
    $scope.idDepartamentoVale = vale.idDepartamento
}

$scope.descargaVale = function (importe, razon, nombrePersona) {
    $scope.descargoVale = true;
    fondoFijoRepository.getAutorizadorVale($scope.idEmpresa,  $scope.sucursal, $scope.idDepartamentoVale).then(resp => {
        $scope.autorizadorValeFF = resp.data[0].autorizador
        $scope.obtenerPagareVale(importe,razon, nombrePersona);
    });

    
}

$scope.recepcionVale = function (vale) {
    $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra,  vale.idVale);
    //$scope.numeroSolicitud = 'Vale ' + vale.nombreVale;
    $scope.frmlistVales = false;
    $scope.listaVales = [];
    $scope.id_perTra = vale.id_perTra;
    $scope.idVale = vale.idVale;
    $scope.saveUrl = vale.saveUrl;
    $scope.descripcionVale = vale.razon;
    $scope.tipoGasto = vale.tipoTramite;
    $scope.importeVale = vale.montoSolicitado;
    $scope.FFSucursal = vale.idFondoFijo;
    $scope.estatusVale = vale.estatusVale;   
    $scope.estatus = vale.estatus; 
    $scope.solicitante = vale.responsble;
    $scope.departamento = vale.dep_nombre;  
    $scope.motivoRechazo = vale.comentario;
    $scope.autorizador = vale.idAutorizador;
    $scope.recepcionValeDoc = true;
    $scope.principal = false;
    $scope.nombreDepartamentoVale = vale.dep_nombrecto;
    $scope.nombreVale = vale.nombreVale;
    $scope.sucursalVale = vale.idSucursal;
    $scope.idValeEstatus = vale.idestatus
}
  
$scope.regresarVale = function (vale) {
    $scope.listaValeFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
    $scope.listaFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
    $scope.EvidenciaVale = null;
    //$("#aprobarVale").modal("hide");
    $scope.recepcionValeDoc = false;
    $scope.aprobarVale = false;
    $scope.principal = true;
}

$scope.listaValesFF = function (id_perTra, idVale) {
    misTramitesValesRepository.getListaVales(id_perTra, idVale).then(function (result) {
        if (result.data.length > 0) {
            $scope.listaVales = result.data;
            var sumtotalPed = 0;
            angular.forEach($scope.listaVales, function (list, key) {
                if(list.idestatus != 3)
                {
                    sumtotalPed += list.monto;
                }
                if (sumtotalPed <= $scope.importeVale) {
                 list.NoAutorizada = false;
                }
                else
                {
                    if(list.envioNotificacion == 2)
                    {
                        list.NoAutorizada = false;
                    }
                    else
                    {
                        var diferencia = sumtotalPed - $scope.importeVale;
                        diferencia = diferencia.toFixed(2);

                        var centavos  = $scope.tolerancia * 1; //.10;
                        var centavosnegativo = centavos * -1;
                        if( diferencia >= centavosnegativo && diferencia <= centavos ){
                            list.NoAutorizada = false;
                        }
                        else{
                            list.NoAutorizada = true;  // Se valida aqui la tolerancia
                        }
                        
                    } 
                }
            });
        }
    });
}

$scope.actualizarVale = function (accion) {  
  let errorvale = $scope.EvidenciaVale == undefined || $scope.EvidenciaVale == null   ? true : false;
  if(accion == 3 && errorvale)
    {
        swal('Alto', 'Para autorizar el vale debes adjuntar la evidencia', 'warning');
        return false;
    }
  var sendData= null;
  if(accion == 3)
    {
        sendData = 
        {
        idVale : $scope.idValeFF,
        accion : accion,
        nombreArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[0],
        extensionArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[1],
        saveUrl: $scope.urlValeAutorizado + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_' + $scope.idValeFF,
        archivo: $scope.EvidenciaVale.archivo,
        idUsuario: $rootScope.user.usu_idusuario
        }
    }
  else 
    {
        sendData = {
                        idVale : $scope.idValeFF,
                        accion : accion,
                        comentario: ''
                    }
    }
    swal({
            title: accion == 2 ? '¿Deseas Autorizar el Vale?' : 'Entrega',
            text: accion == 2 ? 'Se autorizara el Vale' : 'Entrega de Efectivo',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
    async function(isConfirm) {
    if (isConfirm) {
            $('#loading').modal('show');   
            var tipoProceso = false;
            let CCDepto = zeroDelete($scope.cuentaContable);
            // INICIO API Bpro Poliza PVFF

             console.log("INICIO API Bpro Poliza PVFF")
            // console.log(accion)
            // console.log(sendData)
 
           // $scope.dataComplementoFF();
            $scope.insertaPolizaFF();            

            // if($scope.idTramite == 10)
            // {           
            // }
            // tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale, 6, $scope.nombreVale, $scope.importeValeFF,  $scope.nombreDepartamentoVale, 'PVFF',JSON.parse(localStorage.getItem('borrador')).idPerTra ,'', CCDepto);          
            // if(tipoProceso)
            // {        
            //         //     aprobarValeRepository.updateTramiteVale(sendData).then((resf) => {
            //         //      if (resf.data[0].success == 1) {
            //         //       $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, JSON.parse(localStorage.getItem('borrador')).idPerTra, 0, 'Se entrego Efectivo vale '+ resf.data[0].vale, 1, 0);
            //         //       $scope.listaValeFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
            //         //       $('#loading').modal('hide');
            //         //       $("#aprobarVale").modal("hide");
            //         //       $scope.regresarVale();
            //         //      }
            //         //      else{
            //         //       $('#loading').modal('hide');
            //         //       swal('Error', 'No se aplicaron los cambios', 'error');
            //         //      }
            //         //  });     
            // }
            // else
            // {
            //     $('#loading').modal('hide');
            //     swal('Atencion', 'No se guardo correctamente, intentelo mas tarde', 'warning');
            // }
            // FIN API Bpro Poliza PVFF       
        } else { 
                swal('Cancelado', 'No se aplicaron los cambios', 'error'); $('#loading').modal('hide');
            }
    });
}

// API 11Julio
$scope.dataComplementoFF = function () {
    fondoFijoRepository.getDataComplementoFF($scope.id_perTra,$scope.idValeFF).then((res) => {
        if (res.data[0].success == 1) {
            $scope.iPersonaDevFF = res.data[0].PER_IDPERSONA;
        }       
    });
};

$scope.insertaPolizaFF = async function () {
    let banco = zeroDelete($scope.cuentaContable);
    let AuthToken;
    let FFVale = $scope.nombreVale 
    let FF = $scope.idFondoFijo 
    let resPoliza
    let respUpdate

    $('#loading').modal('show');
    //Encabezado
    $scope.apiJson.IdEmpresa = $scope.idEmpresa
    $scope.apiJson.IdSucursal = $scope.idSucursal
    $scope.apiJson.Tipo = 2    
    //ContabilidadMasiva
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Proceso = `PVFF${$scope.complementoPolizas}`
    $scope.apiJson.ContabilidadMasiva.Polizas[0].DocumentoOrigen = FFVale
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Canal = `PVFF${$scope.complementoPolizas}`
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Documento = FFVale
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Referencia2 =  FFVale

    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoOrigen= FFVale
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Partida = '1'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].TipoProducto = $scope.nombreDepartamentoVale
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].SubProducto = banco
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Origen = 'DD'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Moneda = 'PE'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].TipoCambio = '1'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].VentaUnitario = $scope.importeValeFF
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Persona1 = $scope.idPersona    
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].DocumentoAfectado = FFVale 
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[0].Referencia2 = FFVale

    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoOrigen= FFVale
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Partida = '2'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].TipoProducto = $scope.nombreDepartamentoVale
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].SubProducto = banco
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Origen = 'FF'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Moneda = 'PE'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].TipoCambio = '1'
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].VentaUnitario = $scope.importeValeFF
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Persona1 = $scope.idPersona
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].DocumentoAfectado = FF 
    $scope.apiJson.ContabilidadMasiva.Polizas[0].Deta[1].Referencia2 = FFVale     

    console.log(JSON.stringify($scope.apiJson))

    let datalog = structuredClone(datalogAPI)
  
        datalog.idSucursal = $scope.idSucursal
        datalog.idVale = $scope.idValeFF
        datalog.opcion = 1        

        AuthToken = await promiseAutBPRO();

        datalog.tokenGenerado = AuthToken.Token
        datalog.unniqIdGenerado = AuthToken.UnniqId
        datalog.jsonEnvio = JSON.stringify($scope.apiJson)

    let respLog = await LogApiBpro(datalog)

        console.log(datalog)
        console.log(respLog)

        datalog.consecutivo = respLog.folio
        datalog.opcion = 2

   resPoliza = await GeneraPolizaBPRO(AuthToken.Token,JSON.stringify($scope.apiJson))

    if(resPoliza.Codigo === '200 OK'){
        datalog.anioPol = resPoliza.Poliza[0].añoPoliza
        datalog.consPol = resPoliza.Poliza[0].ConsecutivoPoliza
        datalog.empresaPol = resPoliza.Poliza[0].EmpresaPoliza
        datalog.mesPol =  resPoliza.Poliza[0].MesPoliza
        datalog.tipoPol = resPoliza.Poliza[0].TipoPoliza
        datalog.jsonRespuesta = JSON.stringify(resPoliza.Poliza[0])
        datalog.codigo = resPoliza.Codigo
        datalog.resuelto = 1

        respUpdate = await promiseActualizaTramiteFF($scope.idValeFF,$scope.idUsuario ,'PVFF', FFVale, $scope.incremental)
        console.log(respUpdate)

        //$scope.getDataOrdenPagoGV();
        $scope.nombreTramite ='APROBAR VALE FF'

        html = $scope.html1 + 'Entrega de efectivo del vale:  ' + FFVale +'  de  Fondo Fijo' + "<br><br> Estimado " + respUpdate.nombreAutorizador + " se realizó la entrega de efectivo por el monto de:  $"+ formatMoney($scope.importeValeFF) + ".  No olvide subir sus comprobaciones en tiempo y forma "  + $scope.html2;
        $scope.sendMail(respUpdate.correo, respUpdate.asunto, html);

        $('#loading').modal('hide');

        swal({
            title:"Aviso",
            type:"info",
            width: 1000,
            text:`La entrega de efectivo genero la siguiente póliza
            Año póliza: ${datalog.anioPol}
            Mes póliza: ${datalog.mesPol}
            Cons póliza: ${datalog.consPol}
            Tipo póliza: ${datalog.tipoPol}
            
            No olvide subir sus comprobaciones en tiempo y forma al sistema`,
            showConfirmButton: true,
            showCloseButton:  false,
            timer:10000         

        })
        
    }else{



        $('#loading').modal('hide');

        datalog.jsonRespuesta = JSON.stringify(resPoliza)

        if(resPoliza.data !== undefined){
            datalog.mensajeError = resPoliza.data.Message 
            datalog.codigo = resPoliza.status.toString()
            datalog.resuelto = 0
        }else{
            datalog.mensajeError = resPoliza.Mensaje
            datalog.codigo = resPoliza.Codigo
            datalog.resuelto = 0
        }

        swal({
            title:"Aviso",
            type:"error",
            width: 1000,
            text: `Se presento un problema al procesar la póliza en BPRO
            No ha sido procesado, favor de notificar al área de sistemas 
            
            Codigo: ${datalog.codigo }
            Respuesta BPRO:  ${datalog.mensajeError}
            
            Reitentar cuando se le notifique la solución a la incidencia`,
            showConfirmButton: true,
            showCloseButton:  false,
            timer:10000
        })
    }

    respLog = await LogApiBpro(datalog)

    $('#loading').modal('hide');
    $("#aprobarVale").modal("hide");
    $scope.regresarVale();

    console.log(respUpdate)
};

async function promiseAutBPRO(){
    return new Promise((resolve, reject) => {
        apiBproRepository.GetTokenBPRO().then(resp =>{
            console.log('token: ',resp.data)
            resolve(resp.data)
        })
    })
}

async function GeneraPolizaBPRO(token, data){
    return new Promise((resolve, reject) => {
        apiBproRepository.GeneraPolizaBPRO(token, data).then(resp =>{
            console.log('respuesta: ',resp.data)
            resolve(resp.data)
        }).catch(error => {
            resolve(error)
        })
    })
}

async function LogApiBpro(data){
    return new Promise((resolve, reject) => {
        apiBproRepository.LogApiBpro(data).then(resp =>{
            console.log('resp: ',resp)
            resolve(resp.data[0])
        })
    })
}

/**
     * 
     * @param {number} idValeFF 
     * @param {number} idusuario 
     * @param {string} poliza 
     * @param {string} documentoConcepto 
     * @param {number} incremental 
     * @returns 
     */
 async function promiseActualizaTramiteFF(idValeFF,idusuario,poliza,documentoConcepto,incremental) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.ActualizaTramitePolizaFF(idValeFF,idusuario,poliza,documentoConcepto,incremental).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data[0]);
            }
        }).catch(err => {
            reject(result.data[0]);
        });

    });
};

$scope.AumentoDisminucionFF = function () {
    let errorvale = $scope.ADmonto  == undefined || $scope.ADmonto == null ||
                    $scope.tipoADSelected == undefined || $scope.tipoADSelected == null || 
                    $scope.EvidenciaAD == undefined || $scope.EvidenciaAD == null ||
                    $scope.cartaResponsiva == undefined || $scope.cartaResponsiva == null ||
                    $scope.pagare == undefined || $scope.pagare == null ? true : false;
      
    if(errorvale)
    {
      swal('Alto', 'Para solicitar un Aumento/Disminución adjuntar las evidencias, el monto y el tipo', 'warning');
      return false;
    }
    sendData = 
    {
    id_perTra : $scope.id_perTra,
    ADmonto : $scope.ADmonto,
    tipo : $scope.tipoADSelected,
    nombreArchivo: $scope.EvidenciaAD.nombreArchivo.split('.')[0],
    extensionArchivo: $scope.EvidenciaAD.nombreArchivo.split('.')[1],
    saveUrl: $scope.urlAD + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra,
    archivo: $scope.EvidenciaAD.archivo,
    nombreArchivoCarta: $scope.cartaResponsiva.nombreArchivo.split('.')[0],
    extensionArchivoCarta: $scope.cartaResponsiva.nombreArchivo.split('.')[1],
    archivoCarta: $scope.cartaResponsiva.archivo,
    nombreArchivoPagare: $scope.pagare.nombreArchivo.split('.')[0],
    extensionArchivoPagare: $scope.pagare.nombreArchivo.split('.')[1],
    archivoPagare: $scope.pagare.archivo,
    tomarVales: $scope.tomarVales == true ? 1 :0
    }
    swal({
      title: '¿Deseas Solicitar un Aumento/Disminución?',
      text: 'Se enviara a aprobación',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      closeOnConfirm: true,
      closeOnCancel: true
  },
  function(isConfirm) {
      if (isConfirm) {
          $('#loading').modal('show');           
          fondoFijoRepository.AumentoDisminucionFF(sendData).then((resf) => {
                       if (resf.data[0].success == 1) {
                        $scope.listaValeFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
                        $('#loading').modal('hide');
                        let tipo = $scope.tipoADSelected == 1 ? 'Aumento' : 'Disminución';
                        $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, JSON.parse(localStorage.getItem('borrador')).idPerTra, 0, 'Se mando a Aumento/Disminución el Fondo Fijo '+ resf.data[0].fondo, 1, 1);
                        html = $scope.html1 + 'Solicitud de ' + tipo +' de  Fondo Fijo' + "<br><br>Estimado " + resf.data[0].nombreAutorizador + " el Fondo Fijo "  + resf.data[0].fondo + " fue solicitado"  + $scope.html2;
                        $scope.sendMail(resf.data[0].correo, resf.data[0].asunto, html);
                        swal('Listo', 'Se guardo el Fondo Fijo correctamente', 'success');
                        $location.path('/misTramites');
                       }
                       else{
                        $('#loading').modal('hide');
                        swal('Error', 'No se aplicaron los cambios', 'error');
                       }
                   });           
      } else {
          swal('Cancelado', 'No se aplicaron los cambios', 'error');
          $('#loading').modal('hide');
      }
  });
  }


  $scope.envioReembolso = function (data) {
  
    swal({
      title: '¿Deseas enviar el Reembolso?',
      text: 'Se enviara a reembolso el monto de $' +formatMoney(data.montoEnvioReembolso),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      closeOnConfirm: true,
      closeOnCancel: true
  },
  function(isConfirm) {
      if (isConfirm) {
         $('#loading').modal('show');           
          fondoFijoRepository.FondoFijoReembolso(data.id_traDe).then(async(resf) => {
                       if (resf.data[0].success == 1) {
                        $('#loading').modal('hide');
                        var correoFinanzas = await obtieneCorreo();
                        let body = $scope.html1 + '<br>Estimado ' + correoFinanzas.nombreUsuario + " favor de autorizar el Reembolso de Efectivo. Folio "  + $scope.idFondoFijo + $scope.html2;
                        $scope.sendMail(correoFinanzas.correo, 'Autorizar la salida de efectivo Folio ' + $scope.idFondoFijo, body);
                        $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario,JSON.parse(localStorage.getItem('borrador')).idPerTra, 0, 'Se envio a Reembolso', 1, 1);
                        $location.path('/misTramites');
                       }
                       else{
                        $('#loading').modal('hide');
                        swal('Error', 'No se aplicaron los cambios', 'error');
                       }
                   });           
      } else {
          swal('Cancelado', 'No se aplicaron los cambios', 'error');
          $('#loading').modal('hide');
      }
  });
  }

  $scope.envioReembolsoTramite = function (data) {
    swal({
      title: '¿Deseas enviar el Reembolso?',
      text: 'Se enviara a reembolso el monto de $' +formatMoney(data.montoEnvioReembolso),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      closeOnConfirm: true,
      closeOnCancel: true
  },
  function(isConfirm) {
      if (isConfirm) {
         $('#loading').modal('show');           
          fondoFijoRepository.FondoFijoReembolsoTramite(data.id_traDe, $scope.idUsuario, data.montoEnvioReembolso).then(async(resf) => {
                       if (resf.data[0].success == 1) {
                        $('#loading').modal('hide');
                        //var correoFinanzas = await obtieneCorreo();
                        var correoFinanzas = await obtieneCorreoReembolso(data.idEmpresa, data.idSucursal);
                        let body = $scope.html1 + '<br>Estimado ' + correoFinanzas.nombreUsuario + " favor de autorizar el Reembolso de Efectivo por el monto $"+ formatMoney(data.montoEnvioReembolso) + ", Solicitud "  + resf.data[0].id_perTraReembolso + $scope.html2;
                        $scope.sendMail(correoFinanzas.correo, 'Autorizar la salida de efectivo Solicitud ' + resf.data[0].id_perTraReembolso, body);
                        $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario,JSON.parse(localStorage.getItem('borrador')).idPerTra, 0, 'Se envio a Reembolso $' + data.montoEnvioReembolso, 1, 1);
                        $location.path('/misTramites');
                       }
                       else{
                        $('#loading').modal('hide');
                        swal('Error', 'No se aplicaron los cambios', 'error');
                       }
                   });           
      } else {
          swal('Cancelado', 'No se aplicaron los cambios', 'error');
          $('#loading').modal('hide');
      }
  });
  }


    $scope.getDataBorrador = function() {
      fondoFijoRepository.dataBorrador(JSON.parse(localStorage.getItem('borrador')).idPerTra).then((res) => {   
        $scope.idUsuario = res.data[0].idResponsable;
        $scope.traeEmpresas();
        $scope.traeEmpleado();
        $scope.departamentosArea = res.data[0].departamentoAreas;
        $scope.idFF = res.data[0].id;
        //$scope.buscarAutorizador($scope.idFF);
        $scope.estatusFF = res.data[0].id_estatus;
        $scope.estatusFondo = res.data[0].esDe_IdEstatus;
        $scope.empresa =res.data[0].idEmpresa;
        $scope.salidaSelected =  res.data[0].idSalidaEfectivo;
        $scope.idFondoFijo =  res.data[0].idFondoFijo;
      
        $scope.SeleccionaTipo($scope.salidaSelected);
        $scope.salidaSelectedR =  res.data[0].idReembolso;
        $scope.SeleccionaTipoR($scope.salidaSelectedR);
        //$scope.autorizador = res.data[0].idAutorizador;
        $scope.idEmpresa = $scope.empresa.emp_idempresa;
        $scope.nombreEmpresa = $scope.empresa.emp_nombre;
        $scope.traeSucursales();
        $scope.monto = res.data[0].monto;
        $scope.sucursal =  res.data[0].idSucursal;
        $scope.getImagesBorrador();
        $scope.traeDepartamentos();
        if($scope.salidaSelected == 2)
        {
            $scope.traeBancosFondo(JSON.parse(localStorage.getItem('borrador')).idPerTra, 1);
        }
        $scope.descripcion = res.data[0].descripcion;
        $scope.departamento = res.data[0].idDepartamento;
        $scope.urlAD = res.data[0].url;
        $scope.estatusFondoFijo = res.data[0].estatusFondoFijo;
        $scope.openWizard();
        $scope.montoDisponible = res.data[0].montoDisponible;
        if($scope.salidaSelectedR == 2)
        {
            $scope.traeBancosFondo(JSON.parse(localStorage.getItem('borrador')).idPerTra, 2);
        }
        $scope.cuentaContable = res.data[0].cuentaContable;
        $scope.cuentaContableFF = res.data[0].cuentaContable;
        console.log($scope.estatusFF);
        console.log(  $scope.estatusFondo);
        
      });
  }
   
      $scope.traeEmpleado=function(){
        fondoFijoRepository.getidPersonabyUsuario($scope.idUsuario).then(function successCallback(response) {
          $scope.idPersona = response.data[0].PER_IDPERSONA;
          $scope.disablePersona = response.data[0].PER_IDPERSONA == 0 ? false : true;
          //$scope.cuentaContable = response.data[0].cuentaContable;
          //$scope.sucursalEmpleado = response.data[0].idsucursal;
      }, function errorCallback(response) {
      });
  }

    $scope.traeEmpresas=function(){
        fondoFijoRepository.allEmpresas($scope.idUsuario).then((res) => {
            $scope.empresas = res.data;
            $scope.traeBancos();
        })
        // devolucionesRepository.allEmpresas($scope.idUsuario).then((res) => {
        //     $scope.empresas = res.data;
        //     $scope.traeBancos();
        // });
        // fondoFijoRepository.getEmpresas($scope.idUsuario).then(function successCallback(response) {
        //     $scope.empresas = response.data;
        //     $scope.traeBancos();
        // }, function errorCallback(response) {
        // });
    }

    $scope.traerAutorizadores=function(){
        if($scope.departamentosArea = 1)
        {
         //Departamentos Area
         fondoFijoRepository.getBuscaAutorizadoresDepartamentosArea($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
            $scope.Autorizadores = response.data;
            $scope.idAutorizador = $scope.Autorizadores.filter(s => s.iddepartamento == $scope.departamento)[0].idAutorizador;
            }, function errorCallback(response) {
            });
        }
        else
        {
        fondoFijoRepository.getAutorizadoresFondoFijo($scope.idEmpresa, $scope.idSucursal, $scope.departamento).then(function successCallback(response) {
        $scope.idAutorizador = response.data[0].idAutorizador;
        }, function errorCallback(response) {
        });
        }
    }

    $scope.buscarAutorizador = function (idFondoFijo) {
        misTramitesValesRepository.getBuscarAutorizador(idFondoFijo).then((res) => {
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].usu_correo;
            $scope.nombreAutorizador = res.data[0].nombreUsuario; 
        });
    }

    $scope.traeSucursales=function(){    
      $scope.idEmpresa = $scope.empresa;
      fondoFijoRepository.getSucursales($scope.idEmpresa).then(function successCallback(response) {
        $scope.sucursales = response.data;
        //$scope.sucursales = $scope.sucursales.filter(s => s.idSucursal == $scope.sucursalEmpleado);
    }, function errorCallback(response) {
    });
    }

    $scope.traeDepartamentos=function(){
      $scope.idSucursal=$scope.sucursal
      $scope.traeDireccionLugarTrabajo ($scope.idUsuario,$scope.idEmpresa, $scope.idSucursal);
    if($scope.CreacionFF == 1)
    {
      fondoFijoRepository.getTiposolicitudFondo($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
        $scope.departamentos = response.data;
        $scope.departamentosArea = response.data[0].estatusFondos
        if($scope.departamentosArea == 1)
        {
         //Departamentos Area
         fondoFijoRepository.getDepartamentosAreaFF($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
          $scope.departamentos = response.data;
          $scope.traeCuentasContables($scope.idEmpresa, $scope.idSucursal);
        }, function errorCallback(response) {
      });
        }
        else
        {
            //Departamentos Centralizacion
          fondoFijoRepository.getDepartamentos($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
              $scope.departamentos = response.data;
              $scope.traeCuentasContables($scope.idEmpresa, $scope.idSucursal);
          }, function errorCallback(response) {
          });
        }
    }, function errorCallback(response) {
    });
    }
    else
    {
        if($scope.departamentosArea == 1)
        {
         //Departamentos Area
         fondoFijoRepository.getDepartamentosAreaFF($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
          $scope.departamentos = response.data;
          $scope.traeCuentasContables($scope.idEmpresa, $scope.idSucursal);
        }, function errorCallback(response) {
      });
        }
        else
        {
            //Departamentos Centralizacion
          fondoFijoRepository.getDepartamentos($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
              $scope.departamentos = response.data;
              $scope.traeCuentasContables($scope.idEmpresa, $scope.idSucursal);
          }, function errorCallback(response) {
          });
        }
    }
 
    }

    $scope.traeCuentasContables=function(idEmpresa, idSucursal){    
        fondoFijoRepository.getCuentasContables(idEmpresa, idSucursal).then(function successCallback(response) {
          $scope.cuentasContables = response.data;
      }, function errorCallback(response) {
      });
      }

    $scope.traeDireccionLugarTrabajo=function(idUsuario, idEmpresa, idSucursal){    
        fondoFijoRepository.traeDireccionLugarTrabajo(idUsuario, idEmpresa, idSucursal).then(function successCallback(response) {
          $scope.direccionLugarTrabajo = response.data[0].direccion
      }, function errorCallback(response) {
      });
      }

    $scope.selectedCuenta = function(){
        $scope.cuentaContable = $scope.cuentaContableFF == undefined ? '' : $scope.cuentaContableFF;
      }

    $scope.traeDepartamentosFF=function(){
        $scope.idSucursal=$scope.sucursal
        fondoFijoRepository.getBuscarAutorizadorXDepartamentoFF($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
          $scope.departamentos = response.data;
      }, function errorCallback(response) {
      });
      }

    $scope.traeBancos = function(){
        fondoFijoRepository.getBancos($scope.idEmpresa).then(function successCallback(response) {
          $scope.bancos = response.data;
      }, function errorCallback(response) {
      });
      }

      $scope.traeBancosFondo = function(id_perTra,tipo){
        fondoFijoRepository.getBancosFondo(id_perTra,tipo ).then(function successCallback(response) {
         if(tipo==1)
         {
         $scope.BancoSalidaFFS= response.data[0].idBancoSalida;
         $scope.BancoEntradaFFS= response.data[0].idBancoEntrada;
         }
         if(tipo==2)
         {
         $scope.BancoSalidaFFR= response.data[0].idBancoSalida;
         $scope.BancoEntradaFFR= response.data[0].idBancoEntrada;  
         }

      }, function errorCallback(response) {
      });
      }
  

  $scope.setTab = function (newTab) {
      $scope.tab = newTab;
      anticipoGastoRepository.datosEmpresa($scope.idEmpresa).then((res) => {
        if(res.data.length > 0)
        {
            $scope.direccionEmpresa = res.data[0].direccion;
        }
    });
    $scope.empresaSeleted =  $scope.empresas.filter(f => f.emp_idempresa == $scope.idEmpresa)[0];
    $scope.nombreEmpresa = $scope.empresaSeleted.emp_nombre;
  };

  $scope.isSet = function (tabNum) {
      return $scope.tab == tabNum;
  };

  $scope.getImagesBorrador = function() {
    fondoFijoRepository.imageBorrador(
            JSON.parse(localStorage.getItem('borrador')).idPerTra)
        .then((res) => {
            $scope.documentos = res.data;
        });
}

  $scope.verImagenModal = function(documento) {
    if (documento.estatusDocumento == 3) {
        $scope.verComentarios = true;
        $scope.obervacionesDoc = documento.Observaciones;
    } else {
        $scope.verComentarios = false;
    }
    $scope.modalTitle = documento.doc_nomDocumento;
    $scope.verImagen = documento.url;
    $("#mostrarImagen").modal("show");
  }


  $scope.verPdf = function(documento) {
    if (documento.estatusDocumento == 3) {
        $scope.verComentarios = true;
        $scope.obervacionesDoc = documento.Observaciones;
    } else {
        $scope.verComentarios = false;
    }
    $('#pdfReferenceContent object').remove();
    $scope.modalTitle = documento.doc_nomDocumento;
    var pdf = documento.url;
    $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
    $("#mostrarPdf").modal("show");
}

$scope.verPdfValeAutorizado = function(url) {
    $("#aprobarVale").modal("hide");
    $('#pdfReferenceContent object').remove();
    $scope.modalTitle = 'Vale Autorizado';
    var pdf = url;
    $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
    $("#mostrarPdf").modal("show");
}

$scope.listaFondoFijo=function(idtramite){
  fondoFijoRepository.getlistaFondoFijo(idtramite).then(function successCallback(response) {
    $scope.listaFF = response.data;
    angular.forEach($scope.listaFF, function (list, key) {
        if(list.montoVales < list.montoReembolso)
        {  list.montoExcedenteVales = list.montoReembolso - list.montoVales}
        else{
            list.montoExcedenteVales = 0;
        }

    });
}, function errorCallback(response) {
});
}

$scope.listaAumentoDecremento=function(idtramite){
    fondoFijoRepository.getlistaAumentoDecremento(idtramite).then(function successCallback(response) {
      $scope.listaAumentoDisminucion = response.data;
  }, function errorCallback(response) {
  });
  }

$scope.listaValeFondoFijo=function(idtramiteDocumento){
    $scope.envioCerrar = true;
  fondoFijoRepository.getlistaValesXFondoFijo(idtramiteDocumento).then(function successCallback(response) {
    $scope.listaVF = response.data;
    angular.forEach($scope.listaVF, function (list, key) {
        if(list.idestatus== 3)
        { $scope.envioCerrar = false;}
    });
}, function errorCallback(response) {
});
}
$scope.listaValeEvidenciaFondoFijo=function(idtramiteDocumento){
    fondoFijoRepository.getlistaFondoFijoVales(idtramiteDocumento).then(function successCallback(response) {
      $scope.listaValesFondoFijo = response.data;
  }, function errorCallback(response) {
  });
  }

    $scope.selectedEmpresa = function(){
      console.log($scope.empresa);

      if($scope.empresa.emp_idempresa!=0){
        $scope.traeSucursales($scope.empresa);
      }else{
       $scope.sucursales = null; 
       $scope.departamentos = null; 
      }
    }

    $scope.selectedSucursal = function(){
      console.log($scope.sucursal);
      if($scope.sucursalId!=0){
        $scope.traeDepartamentos($scope.sucursal);
      }else{
        $scope.departamentos = null; 
      }
    }


    $scope.selectedDepartamento = function(){
      $scope.departamentoSeleted =  $scope.departamentos.filter(f => f.idDepartamento == $scope.departamento)[0];
      $scope.nombreDepartamento = $scope.departamentoSeleted == undefined ? '' : $scope.departamentoSeleted.nombre;
      //$scope.generarIdFondoFijo();
      $scope.generarNombreFondoFijo();
      $scope.traerAutorizadores();
    }
    
    // $scope.selectedAutorizador = function(){
    //   console.log($scope.autorizador);
    //   $scope.idAutorizador = $scope.autorizador.idUsuario;
    //   $scope.nombreAutorizador = $scope.autorizador.nombre;
    // }

    $scope.next=function(pasoActual, pasoSiguiente, current){
     
      if(pasoActual == 'paso1')
      {
        let res = $scope.validarCampos(pasoActual);
        if(res)
        {swal("Atención", "Los campos son obligatorios.", "warning");} 
        else
        {
          if($scope.monto <  parseFloat($scope.amountFondoFijo))
          {swal("Atención", "El monto minimo es de $ " + $scope.amountFondoFijo, "warning");}
          else
          {
          if($scope.idPersona ==  "" ||  $scope.idPersona == 0 )
          {swal("Atención", "El ID Personsa no puede ser vacio o cero", "warning");}
          else
          {
          document.getElementById(pasoActual).style.display ="none";
          document.getElementById(pasoSiguiente).style.display ="block";
          $scope.setProgressBar(++current);
        }
            }
        }
        $scope.empresaSeleted =  $scope.empresas.filter(f => f.emp_idempresa == $scope.idEmpresa)[0];
        $scope.nombreEmpresa = $scope.empresaSeleted.emp_nombre;
        // $scope.direccionEmpresa = $scope.empresaSeleted.Calle + ', '+$scope.empresaSeleted.NumeroExterior+', '
        //                         +($scope.empresaSeleted.NumeroInterior!=null ?  $scope.empresaSeleted.NumeroInterior+', ' :'')
        //                         +$scope.empresaSeleted.Colonia + ', ' +$scope.empresaSeleted.Estado+', '+$scope.empresaSeleted.CP;

        anticipoGastoRepository.datosEmpresa($scope.idEmpresa).then((res) => {
            if(res.data.length > 0)
            {
                $scope.direccionEmpresa = res.data[0].direccion;
            }
        });
      }
      else
      {
        document.getElementById(pasoActual).style.display ="none";
        document.getElementById(pasoSiguiente).style.display ="block";
        $scope.setProgressBar(++current);
      }
      
    };

    $scope.previous=function(pasoActual, pasoAnterior, current){
      document.getElementById(pasoActual).style.display ="none";
      document.getElementById(pasoAnterior).style.display ="block";
      $scope.setProgressBar(--current);
    };

    $scope.setProgressBar=function(curStep){
      var steps=3;
      var percent = parseFloat(100 / steps) * curStep;
      percent = percent.toFixed();
      $(".progress-bar")
        .css("width",percent+"%")
        .html(percent+"%");   
    };
    
    $scope.validarCampos = function (paso) {
      errorFondoP1 = false;
      if(paso == 'paso1')
      {
      errorFondoP1 = $scope.empresa == undefined || $scope.empresa.emp_idempresa == 0 ||
                     $scope.sucursal == undefined || $scope.sucursal.idSucursal == 0 ||
                     //$scope.autorizador == undefined || $scope.autorizador.idUsuario == 0 ||
                     $scope.departamento == undefined || $scope.departamento.idDepartamento == 0 ||
                     $scope.monto == undefined ||  $scope.monto ==  ""|| 
                     $scope.descripcion == undefined || $scope.descripcion == "" ||
                     $scope.cuentaContable == undefined || $scope.cuentaContable == "" ? true : false;
      return errorFondoP1;  
      }
  };


  

  $scope.getDocumentosByTramite = function() {
    $scope.documentos = [];
    devolucionesRepository.documentosByTramite($scope.selTramite).then((res) => {
        $scope.documentos = res.data;
    });
  }

  $scope.getDocumentosAumentoDecremento = function() {
    $scope.documentosAD = [];
    devolucionesRepository.documentosByTramite($scope.selTramite).then((res) => {
        $scope.documentosAD = res.data;
    });
    angular.forEach($scope.documentosAD, function (object, key) {
        if (object.archivo == undefined) {

        }
      });

  }
  $scope.validaDocs =function(documentos){
    var bandera = true;
    angular.forEach(documentos, function (object, key) {
      if (object.archivo == undefined) {
        bandera = false;
        swal('Alto', 'Para solicitar el trámite debes adjuntar todos los documentos', 'warning');
        return false;
      }
    });
  if(bandera)
  {
    //swal("Atención", "Exito!", "success");
    $('#loading').modal('show');
    $scope.solicitaFF();
    $scope.isLoading = true;
  }
  };

  $scope.solicitaFF =function()
  {
    dataSave = {
      idUsuario: $rootScope.user.usu_idusuario,
      idTramite: $scope.selTramite,
      idEmpresa: $scope.empresa.emp_idempresa,
      idSucursal: $scope.sucursal.idSucursal,
      idFormaPago: 1,
      idDepartamento: 0,
      observaciones: $scope.descripcion,
      estatus: 6,
      devTotal: parseFloat($scope.monto),
      idCliente: 1
      }

      dataSaveFF = {
        idFondoFijo:  0,
        idTramite: $scope.selTramite,
        idEmpresa : $scope.empresa,
        idSucursal : $scope.sucursal,
        idDepartamento : $scope.departamento,
        idUsuario : $rootScope.user.usu_idusuario,
        idAutorizador : $scope.idAutorizador,
        descripcion : $scope.descripcion,
        nombreFondoFijo :  $scope.nombreFondoFijo,
        estatus : 0,
        monto : parseFloat($scope.monto),
        idPersona : $scope.idPersona,
        cuentaContable: $scope.cuentaContable,
        departamentoArea: $scope.departamentosArea
        }

      swal({
        title: '¿Deseas solicitar tu trámite?',
        text: 'Se enviará el trámite a aprobación',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Solicitar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function(isConfirm) {
        if (isConfirm) {
            $('#loading').modal('show');            
                     fondoFijoRepository.saveTramite(dataSaveFF).then((resf) => {
                         if (resf.data[0].success == 1) {
                            $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, resf.data[0].idPerTra, 0, 'Se creo el Fondo fijo '+ resf.data[0].fondo, 1, 1);
                            html = $scope.html1 + 'Solicitud Fondo Fijo' + "<br><br>Estimado(a) " + resf.data[0].nombreAutorizador + " la solicitud de Fondo Fijo " + resf.data[0].idPerTra + ", Folio "  + resf.data[0].fondo + " fue solicitado"  + $scope.html2;
                            $scope.sendMail(resf.data[0].correo, resf.data[0].asunto, html);
                            $scope.saveDocumentosTramite(resf.data[0].idPerTra, resf.data[0].saveUrl, 0, $scope.documentos);
                         }
                         else{
                          $('#loading').modal('hide');
                          swal('Error', 'No se aplicaron los cambios', 'error');
                         }
                     });           
        } else {
            swal('Cancelado', 'No se aplicaron los cambios', 'error');
            $('#loading').modal('hide');
        }
    });
  }

  $scope.saveDocumentosTramite = function(idPertra, saveUrl, contDocs, documentos) {
    var sendData = {};

    if (contDocs <= documentos.length - 1) {

        if (documentos[contDocs].hasOwnProperty('archivo')) {
            sendData = {
                idDocumento: documentos[contDocs].id_documento,
                idTramite: documentos[contDocs].id_tramite,
                idPerTra: idPertra,
                saveUrl: saveUrl + 'FondoFijo\\' + 'FondoFijo_' + idPertra,
                idUsuario: $rootScope.user.usu_idusuario,
                extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                archivo: documentos[contDocs].archivo['archivo']
            }

            devolucionesRepository.saveDocumentos(sendData).then((res) => {
                if (res.data[0].success == 1) {
                    $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos);
                } else {
                    $scope.errDocs += 1;
                    $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos);
                }
            });
        } else { $scope.saveDocumentosTramite(idPertra, saveUrl, contDocs + 1, documentos); }

    } else {
        $scope.saveDocumentosSeleccionados(idPertra);
    }
};

$scope.saveDocumentosSeleccionados = function(idPerTra) {
  var data = '';
  for (var i = 0; i < $scope.documentosCliente.length; i++) {
      if ($scope.documentosCliente[i].checado) {
          data = data + '' + $scope.documentosCliente[i].documento + ',' + $scope.documentosCliente[i].checado + ',' + $scope.documentosCliente[i].devFinal + ',' + $scope.documentosCliente[i].tipoDoc + ',' + $scope.documentosCliente[i].cartera + '|';
      }
  } 
  setTimeout(() => {
      devolucionesRepository.saveClienteDocumentos(idPerTra, data.substring(0, data.length - 1)).then((res) => {
          if (res.data[0].success == 1) {
              $('#loading').modal('hide');
              //$scope.limpiarVariables();
              if ($scope.errDocs > 0) {
                  swal('Atencion', 'No se guardo correctamente el Fondo Fijo, intentelo mas tarde', 'warning');
                  $location.path('/misTramites');
              } else {
                  swal('Listo', 'Se guardo el Fondo Fijo correctamente', 'success');
                  $location.path('/misTramites');
              }
          } else {
              $('#loading').modal('hide');
              //$scope.limpiarVariables();
              if ($scope.errDocs > 0) {
                  swal('Atencion', 'No se guardo correctamente el Fondo Fijo, intentelo mas tarde', 'warning');
                  $location.path('/misTramites');
              } else {
                  swal('Listo', 'Se guardo el Fondo Fijo correctamente', 'success');
                  $location.path('/misTramites');
              }
          }
      });
  }, 500)
}


$scope.limpiarVariables = function() {
  $scope.selEmpresa = 0;
  $scope.selSucursal = 0;
  $scope.selFormaPago = 0;
  $scope.selDepartamento = 0;
  $scope.observaciones = '';
  $scope.getDocumentosByTramite();
}

$scope.DocsAumentoDisminucionFF = function() {
    if($scope.ADmonto  == undefined || $scope.ADmonto == null || $scope.ADmonto == 0 || $scope.ADmonto == '')
    {
        swal('Atencion', 'No se pueden descargar los documentos si no ingresa el monto de Aumento/Decremento', 'warning');
    }
    else
    {
        let monto = $scope.tipoADSelected == 1 ?  Number($scope.monto) + Number($scope.ADmonto) :  Number($scope.monto) - Number($scope.ADmonto); 
        $scope.obtenerCartaResponsiva(monto);
        $scope.obtenerPagareFondoFijo(monto)
    }
  }

    $scope.obtenerCartaResponsiva=function(monto){
      var date = new Date();
      var doc = new jsPDF('p','px','letter');

      var lMargin=15; //left margin in mm
      var rMargin=15; //right margin in mm
      var pdfInMM=400;  // width of A4 in mm
     
      doc.setFontSize(9);
      doc.text('Ciudad de México a '+ ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear()+'. ', 320,100);
      //doc.setFontSize(14);
      doc.text('CARTA RESPONSIVA DE FONDO FIJO', 130,130);
      doc.setFontSize(11);
      var paragraph = 'Con esta fecha, se hace entrega a '+$scope.nombreUsuario+ ', quien desempeña el cargo de Cajero, la cantidad de $' + formatMoney(monto) + ', ' +' ('+ $scope.numeroALetras(monto) + ' ' + $scope.centavos +'/100 Moneda Nacional), en efectivo por concepto de fondo fijo de caja de la sociedad denominada ' + $scope.nombreEmpresa +'.';
      var paragraph2= 'Dicho importe deberá ser utilizado para cubrir única y exclusivamente gastos menores de dicha sociedad, comprometiéndose a cumplir con los siguientes puntos:';
      var paragraph3= '1)	Seguir la política establecida para el manejo de gastos de caja chica (fondo fijo de caja) y gastos de viaje de la sociedad en cita, misma que en este acto señala que se le entrego y explicó previamente';
      var paragraph4= '2)	Conservar integro el importe total del fondo entregado, respaldado por dinero en efectivo y/o comprobantes según sea el caso, así como responder de forma personal en caso de faltantes, con independencia de las acciones legales que tome la sociedad antes citada';
      var paragraph5= '3)	Vigilar que el fondo sea utilizado para el fin que fue creado, apegado a la política de gastos de caja chica (fondo fijo de caja) y gastos de viaje';
      var paragraph6= '4)	Recabar los comprobantes dentro de los plazos establecidos en la política de gastos de caja chica (fondo fijo de caja) y gastos de viaje y que no deben de exceder de 48 horas hábiles';
      var paragraph7= '5)	Efectuar los reembolsos de manera correcta, ordenada y oportuna';
      var paragraph8= '6)	Colaborar en la realización de los arqueos periódicos del fondo';

      var lines =doc.splitTextToSize(paragraph, (pdfInMM-lMargin-rMargin));
      var lines2=doc.splitTextToSize(paragraph2, (pdfInMM-lMargin-rMargin));
      var lines3=doc.splitTextToSize(paragraph3, (pdfInMM-lMargin-rMargin));
      var lines4=doc.splitTextToSize(paragraph4, (pdfInMM-lMargin-rMargin));
      var lines5=doc.splitTextToSize(paragraph5, (pdfInMM-lMargin-rMargin));
      var lines6=doc.splitTextToSize(paragraph6, (pdfInMM-lMargin-rMargin));
      var lines7=doc.splitTextToSize(paragraph7, (pdfInMM-lMargin-rMargin));
      var lines8=doc.splitTextToSize(paragraph8, (pdfInMM-lMargin-rMargin));

      var dim = doc.getTextDimensions('Text');
      var lineHeight = dim.h;
      lineTop2 = (lineHeight/2)*lines.length + 10;
      lineTop3 = (lineHeight/2)*lines2.length + 10;
      lineTop4 = (lineHeight/2)*lines3.length + 10;
      lineTop5 = (lineHeight/2)*lines4.length + 10;
      lineTop6 = (lineHeight/2)*lines5.length + 10;
      lineTop7 = (lineHeight/2)*lines6.length + 10;
      lineTop8 = (lineHeight/2)*lines7.length + 10;
      for(var i=0;i<lines.length;i++){
        lineTop = (lineHeight/2)*i;
        doc.text(lines[i],45,160+lineTop); 
      }
      for(var j=0;j<lines2.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines2[j],45,160+lineTop+lineTop2); 
      }
      for(var j=0;j<lines3.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines3[j],45,160+lineTop+lineTop2+lineTop3); 
      }
      for(var j=0;j<lines4.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines4[j],45,160+lineTop+lineTop2+lineTop3+lineTop4); 
      }
      for(var j=0;j<lines5.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines5[j],45,160+lineTop+lineTop2+lineTop3+lineTop4+lineTop5, {maxWidth: 185, align: "justify"}); 
      }
      for(var j=0;j<lines6.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines6[j],45,160+lineTop+lineTop2+lineTop3+lineTop4+lineTop5+lineTop6); 
      }
      for(var j=0;j<lines7.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines7[j],45,160+lineTop+lineTop2+lineTop3+lineTop4+lineTop5+lineTop6+lineTop7); 
      }
      for(var j=0;j<lines8.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines8[j],45,160+lineTop+lineTop2+lineTop3+lineTop4+lineTop5+lineTop6+lineTop7+lineTop8); 
      }

      doc.text('Responsable del Fondo Fijo.',180,400);
      doc.text(' __________________________',80,450);
      doc.text(' __________________________',280,450);
      doc.text('Firma',120,460);
      doc.text('Firma',320,460);
      doc.text('Recibí Fondo Fijo',100,470);
      doc.text('Nombre y cargo',300,470);
      doc.save('CartaResponsiva.pdf');
    };

    $scope.obtenerPagareFondoFijo=function(monto)
    {
      var direccion  = $scope.direccionLugarTrabajo == 'NA' ? $scope.direccionEmpresa : $scope.direccionLugarTrabajo
      var date = new Date();

      var despues = new Date(new Date().setDate(new Date().getDate()+10));
      var doc = new jsPDF('p','px','letter');

      var lMargin=15; //left margin in mm
      var rMargin=15; //right margin in mm
      var pdfInMM=410;  

      doc.setFontSize(9);
      doc.text('Bueno por  $' + formatMoney(monto),360,70);
      doc.setFontSize(14);
      doc.text('PAGARÉ', 195,100);
      doc.text('(A LA VISTA)', 185,110);
      doc.setFontSize(11);
      var parrafo1='Por este pagaré el señor '+$scope.nombreUsuario+', promete incondicionalmente pagar a la orden de la sociedad denominada '+$scope.nombreEmpresa +', la cantidad de $'+ formatMoney(monto) +' ( '+$scope.numeroALetras(monto)+ ' '+ $scope.centavos + '/100 Moneda Nacional) recibida a su entera satisfacción; en su domicilio ubicado en '+ direccion +', o en cualquier otro domicilio que la beneficiaria destine para tal efecto, mediante 1 (una) sola exhibición pagadera A LA VISTA DE SU PRESENTACION.';
      //+ ('0' + despues.getDate()).slice(-2) +'('+ $scope.DecenasY(('0' + despues.getDate()).slice(-2)) +') de '+ despues.toLocaleString("es", { month: "long"  })+ ' de ' +  despues.getFullYear()
      var parrafo2='El importe del presente pagaré generará intereses ordinarios desde su suscripción y hasta su total y completo pago a razón de aplicar sobre saldos insolutos una tasa fija de interés del 10.00% mensual (diez por ciento).';
      var parrafo3='Sin perjuicio de lo establecido en el párrafo anterior, en caso de falta de pago oportuno de cualquier cantidad que deba ser pagada de conformidad con el presente título, se causarán intereses moratorios sobre los pagos vencidos y no pagados, a razón de una tasa anual del 30% (Treinta Por ciento), computados desde la fecha en que el pago venció hasta la fecha de pago efectivo.';
      var parrafo4='EL SUSCRIPTOR autoriza expresamente al beneficiario para ceder, descontar o negociar el presente pagaré y amplía el plazo de su presentación hasta el tercer aniversario de la última fecha de pago sin perjuicio del derecho del beneficiario para poder presentarlo en cualquier tiempo si existiere algún incumplimiento del SUSCRIPTOR.';
      var parrafo5='Para todo lo relativo al presente Pagaré y en su caso para el requerimiento judicial de pago de este Pagaré, serán competentes los tribunales y leyes competentes de la Ciudad de México, renunciando en forma expresa a cualquier otro fuero que en razón de sus domicilios presentes o futuros que pudiera corresponderles y al efecto señalan como tal el que aparece bajo sus firmas.';
      //var parrafo6='Para todo lo relativo a la interpretación, cumplimiento y ejecución del presente pagaré, el (la) suscriptor (a) y el (los) aval (es) así como cualquier tenedor  del presente documento, se someten expresamente a la jurisdicción de las Leyes y Tribunales de la Ciudad de México Distrito Federal, renunciando a cualquier otra jurisdicción  que por razón de sus domicilios presentes o futuros pudiera corresponderles.';

      var lines1=doc.splitTextToSize(parrafo1, (pdfInMM-lMargin-rMargin));
      var lines2=doc.splitTextToSize(parrafo2, (pdfInMM-lMargin-rMargin));
      var lines3=doc.splitTextToSize(parrafo3, (pdfInMM-lMargin-rMargin));
      var lines4=doc.splitTextToSize(parrafo4, (pdfInMM-lMargin-rMargin));
      var lines5=doc.splitTextToSize(parrafo5, (pdfInMM-lMargin-rMargin));
      //var lines6=doc.splitTextToSize(parrafo6, (pdfInMM-lMargin-rMargin));

      var dim = doc.getTextDimensions('Text');
      var lineHeight = dim.h;
      lineTop1 = (lineHeight/2)*lines1.length + 10;
      lineTop2 = (lineHeight/2)*lines2.length + 10;
      lineTop3 = (lineHeight/2)*lines3.length + 10;
      lineTop4 = (lineHeight/2)*lines4.length + 10;
      lineTop5 = (lineHeight/2)*lines5.length + 10;

      for(var i=0;i<lines1.length;i++){
        lineTop = (lineHeight/2)*i;
        doc.text(lines1[i],45,130+lineTop); 
      }
      for(var j=0;j<lines2.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines2[j],45,130+lineTop+lineTop1); 
      }
      for(var j=0;j<lines3.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines3[j],45,130+lineTop+lineTop1+lineTop2); 
      }
    //   doc.setFontSize(9);
    //   doc.text('(I)	   Una tasa moratoria fija del 30%  (treinta por ciento)', 65, 160+lineTop+lineTop1+lineTop2 + 15)
    //   doc.text('(II)	El porcentaje que resulte de multiplicar por 2(dos) la tasa TIIE(TASA DE INTERÉS INTERBANCARIA', 65, 160+lineTop+lineTop1+lineTop2 + 30)
    //   doc.text('             DE EQUILIBRIO) a 28(veintiocho) días.', 65, 160+lineTop+lineTop1+lineTop2 + 37)
      doc.setFontSize(11);
      for(var j=0;j<lines4.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines4[j],45,130+lineTop+lineTop1+lineTop2 +lineTop3); 
      }
      for(var j=0;j<lines5.length;j++){
        lineTop = (lineHeight/2)*j;
        doc.text(lines5[j],45,130+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4); 
      }
      doc.setFontSize(9);
      doc.text('Ciudad de México a '+ ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear()+'. ', 275,360);
    
   
    doc.rect(45, 370, 370, 70); // empty square
    doc.rect(45, 370, 180, 70); // empty square
    doc.setFontSize(7);
    doc.text('Nombre del suscriptor: ' + $scope.nombreUsuario,47,378);
    doc.rect(45, 380, 180, 60); // empty
    doc.text('Domicilio:',47,398); 
    doc.rect(45, 390, 180, 50); // empty square
    doc.text(' __________________________',280,430);
    doc.text('Firma y huella digital',300,438);
    doc.rect(45, 400, 180, 40); // empty square

    doc.rect(45, 470, 370, 70); // empty square
    doc.rect(45, 470, 180, 70); // empty square
    doc.text('Nombre del Aval:',47,478); 
    doc.rect(45, 480, 180, 60); // empty 
    doc.text('Domicilio:',47,498); 
    doc.rect(45, 490, 180, 50); // empty square
    doc.text(' __________________________',280,530);
    doc.text('Firma y huella digital',300,538);
    doc.rect(45, 500, 180, 40); // empty square

    //   for(var j=0;j<lines6.length;j++){
    //     lineTop = (lineHeight/2)*j;
    //     doc.text(lines6[j],45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35); 
    //   }

    //   doc.text('El (la) suscriptor (a)',45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+10);
    //   doc.text('Nombre: _____________________________',45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+20);
    //   doc.text('Representada por:',180,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+35);
    //   doc.text(' _____________________________',180,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+45);

    //   doc.text('Domicilio: ___________________________',45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+65);
    //   doc.text('______________________________________',45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+75);
    //   doc.text('______________________________________',45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+85);
    //   doc.text('Hecho y firmado el presente pagaré en la ciudad de México Distrito Federal, el ' + ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear()+'. ',45,160+lineTop+lineTop1+lineTop2 +lineTop3+lineTop4+lineTop5+35+95);
      doc.save('PagareFondoFijo.pdf');
    }

    $scope.obtenerPagareVale = function(data, razon, nombrePersona){
        var date = new Date();
        var doc = new jsPDF('p','px','letter');
  
        var lMargin=15; //left margin in mm
        var rMargin=15; //right margin in mm
        var pdfInMM=410;  
  
        doc.setFontSize(12);
        doc.text('FOLIO '+ $scope.nombreVale , 45,80);
        doc.text( ('FECHA ' + '0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear(), 45,90);
        doc.text($scope.nombreEmpresa + ' - ' +$scope.nombreSucursal, 45,100);
        doc.text('VALE PROVISIONAL DE CAJA', 175,120);
        doc.text('BUENO POR $' + formatMoney(data), 320,140);


        // doc.text('ANEXO 1', 180,130);
        // doc.text('FOLIO '+ $scope.nombreVale, 230,130);
        // doc.text( ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear(), 230,170);
        // doc.text('$ ' + data, 45,190);
        // doc.text('Importe ('+ $scope.numeroALetras(data) + ' ' + $scope.centavos +'/100 M.N.)', 45,210);
        // doc.text('', 45,230);
        doc.text('Concepto:', 45,160);
        doc.text(razon, 45,180);
  
        var parrafo1='"Yo, en esta fecha manifiesto bajo protesta de decir verdad que he recibido el importe del presente vale  por la cantidad de $'+ formatMoney(data) +', ('+ $scope.numeroALetras(data) + ' ' + $scope.centavos +'/100 Moneda Nacional) a mi entera satisfacción, cantidad que me comprometo y obligo a comprobar dentro de las 24 horas hábiles posteriores a que se me entregó, entregando la documentación correspondiente en cumplimiento a la política de caja chica (fondo fijo de caja) y gastos de viaje de la sociedad al rubro indicado, la cual pertenece al grupo comercial denominado GRUPO ANDRADE. En caso de no comprobar los gastos dentro del plazo establecido, reconozco que debo esta cantidad a la sociedad al rubro citada de manera personal y me obligo incondicionalmente a pagarla en una sola exhibición, autorizando, si así fuese el caso que, dicha cantidad me sea descontada vía nómina, comprometiéndome a firmar la carta instrucción y documentación correspondiente';
        var parrafo2='DE ACUERDO A LAS POLITICAS DE LAS SOCIEDADES DE GRUPO ANDRADE, LAS CANTIDADES ENTREGADAS DEBEN SER COMPROBADAS Y/O DEVUELTO EL DINERO A LA CAJA, EN UN PLAZO NO MAYOR A 24 HORAS HÁBILES.';
  
        var lines1=doc.splitTextToSize(parrafo1, (pdfInMM-lMargin-rMargin));
        var lines2=doc.splitTextToSize(parrafo2, (pdfInMM-lMargin-rMargin));
        var dim = doc.getTextDimensions('Text');
        var lineHeight = dim.h;
        lineTop1 = (lineHeight/2)*lines1.length + 10;
        lineTop2 = (lineHeight/2)*lines2.length + 10;

        for(var i=0;i<lines1.length;i++){
          lineTop = (lineHeight/2)*i;
          doc.text(lines1[i],45,200+lineTop); 
        }
        $scope.autorizadorValeFF
        doc.text('Este vale fue autorizado  de manera electrónica por: ' + $scope.autorizadorValeFF,45,200+lineTop+20);
        //doc.text('Este vale fue autorizado  de manera electrónica por: ' + $scope.nombreAutorizador,45,200+lineTop+20);

        //doc.rect(45, 370, 370, 70); // empty square
        doc.rect(45, 200+lineTop + 20 + 20, 180, 80); // empty square
        doc.rect(45, 200+lineTop + 20 + 20 + 10, 180, 70); // empty
        doc.setFontSize(8);
        doc.text('Recibió ',47,200+lineTop + 20 + 20 + 8);
        doc.text(' __________________________',90, 200+lineTop + 20 + 20 + 40);
        doc.text('Firma y huella digital', 110 ,200+lineTop + 20 + 20 + 50);
        doc.rect(45, 200+lineTop + 20 + 20 + 70, 180, 10); // empty
        doc.text('Nombre: ' + $scope.nombrePersona,47,200+lineTop + 20 + 20 + 68);
        doc.rect(45, 200+lineTop + 20 + 20 + 60, 180, 20); // empty
        doc.text('Cargo: ',47,200+lineTop + 20 + 20 + 78);
        // doc.rect(45, 200+lineTop + 20 + 30, 180, 70); // empty
        // doc.text('Domicilio:',47,398); 
        // doc.text(' __________________________',280,430);
        // doc.text('Firma y huella digital',300,438);
        //doc.rect(45, 200+lineTop + 20 + 30, 180, 20); // empty
        //doc.rect(45, 200+lineTop + 20 + 30, 180, 10); // empty
        //doc.rect(45, 200+lineTop + 20 + 50, 180, 40); // empty square
        
        doc.setFontSize(12);
        for(var i=0;i<lines2.length;i++){
          lineTop = (lineHeight/2)*i;
          doc.text(lines2[i],45,200+lineTop+lineTop1 + 150); 
        }

        // doc.text('Responsable:',190,380);
        // doc.text(' ______________________________________________________',100,400);
        // doc.text(nombrePersona,170,410);
        doc.save('Pagare_Vale.pdf');
      }

    $scope.obtenerVale=function(monto, usuario){
        var date = new Date();
        var doc = new jsPDF('p','px','letter');
  
        var lMargin=15; //left margin in mm
        var rMargin=15; //right margin in mm
        var pdfInMM=410;  // width of A4 in mm
       
        doc.setFontSize(8);
        doc.text('Ciudad de México a '+ ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear()+'. ', 320,100);
        doc.setFontSize(14);
        doc.text('VALE COMPROBACIÓN DE MAS', 160,130);
        doc.setFontSize(11);
        var paragraph = 'Con esta fecha se entregan $'+ formatMoney(monto) +' ('+ $scope.numeroALetras(monto) + ' ' + $scope.centavos +'/100 M.N.) al Sr/Sra. '+ usuario +', por concepto de comprobación de Mas autorizado.';
        //var paragraph2= 'El reembolso de gastos se hará con cheque a su nombre una vez que se haya agotado los recursos del fondo, comprobando el importe de los gastos con documentos fiscales para su deducibilidad.';
        var lines =doc.splitTextToSize(paragraph, (pdfInMM-lMargin-rMargin));
        //var lines2=doc.splitTextToSize(paragraph2, (pdfInMM-lMargin-rMargin));
        var dim = doc.getTextDimensions('Text');
        var lineHeight = dim.h;
        lineTop2 = (lineHeight/2)*lines.length + 10;
        for(var i=0;i<lines.length;i++){
          lineTop = (lineHeight/2)*i;
          doc.text(lines[i],45,160+lineTop); 
        }
        // for(var j=0;j<lines2.length;j++){
        //   lineTop = (lineHeight/2)*j;
        //   doc.text(lines2[j],45,160+lineTop+lineTop2); 
        // }
  
        doc.text('Responsable',198,230);
        doc.text('Sr/Sra. '+usuario+'.',160,250);
        doc.text('Recibe Vale Comprobación de Mas Autorizado.',140,265); 
        doc.save('ValeComprobacion.pdf');
      };

$scope.modalEvidenciaMas = function (data) {
    $scope.itemEvidencia = data;
    $("#EvidenciaComprobacionMas").modal("show");
};

$scope.cerrarComprobacionMas = function (data) {
    $("#EvidenciaComprobacionMas").modal("hide");
};

$scope.EvidenciaComprobacion = async function () {
    let errorvalidar = $scope.EvidenciaComprobacionMas == undefined || $scope.EvidenciaComprobacionMas == null   ? true : false;
    if(errorvalidar)
    {
    swal("Atención", "Los campos son obligatorios.", "warning");
    }
    else
    {
    $("#EvidenciaComprobacionMas").modal("hide");
    $('#loading').modal('show');
    sendData = 
        {
        idValeEvidencia: $scope.itemEvidencia.idValeEvidencia,
        nombreArchivo: $scope.EvidenciaComprobacionMas.nombreArchivo.split('.')[0],
        extensionArchivo: $scope.EvidenciaComprobacionMas.nombreArchivo.split('.')[1],
        saveUrl: $scope.saveUrl + 'FondoFijo/' + 'FondoFijo_' + $scope.itemEvidencia.id_perTra + '/Vales_' + $scope.itemEvidencia.idVale,
        archivo: $scope.EvidenciaComprobacionMas.archivo
        }
       fondoFijoRepository.guardarEvidenciaComprobacion(sendData).then(function (result) {
        if (result.data[0].success == 1) {
            $('#loading').modal('hide');
            $scope.listaValesFF($scope.itemEvidencia.id_perTra,$scope.itemEvidencia.idVale);
            swal('Fondo Fijo', 'Se actualizo el registro correctamente', 'success');
        }
    });
    }
}

    // $scope.obtenerPagareVale = function(){
    //   var date = new Date();
    //   var doc = new jsPDF('p','px','letter');

    //   var lMargin=15; //left margin in mm
    //   var rMargin=15; //right margin in mm
    //   var pdfInMM=410;  

    //   doc.setFontSize(12);
    //   doc.text('ANEXO 1', 180,130);
    //   doc.text('FOLIO', 230,130);
    //   doc.text('AGENCIA SUCURSAL', 45,150);
    //   doc.text('VALE PROVISIONAL DE CAJA', 45,170);
    //   doc.text( ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear(), 230,170);
    //   doc.text('$________________________', 45,190);
    //   doc.text('Importe ('+ $scope.numeroALetras(518.25)+ ')', 45,210);
    //   doc.text('', 45,230);
    //   doc.text('CONCEPTO O MOTIVO', 45,230);
    //   doc.text('__________________________________________________________________________________________________', 45,250);
    //   doc.text('__________________________________________________________________________________________________', 45,270);

    //   var parrafo1='DE ACUERDO A LAS POLITICAS DE LAS SOCIEDADES DE GRUPO ANDRADE, LAS CANTIDADES ENTREGADAS DEBEN SER COMPROBADAS Y/O DEVUELTO EL DINERO A LA CAJA, EN UN PLAZO NO MAYOR A 48 HORAS';
    //   var parrafo2='"Yo que recibo el importe del presente vale a mi entera satisfacción, para el cumplimiento de la política indicada, en caso de no comprobar los gastos dentro del plazo establecido, reconozco que debo esta cantidad y me obligo a pagar en una sola exhibición, autorizando me sea descontada por nómina."';

    //   var lines1=doc.splitTextToSize(parrafo1, (pdfInMM-lMargin-rMargin));
    //   var lines2=doc.splitTextToSize(parrafo2, (pdfInMM-lMargin-rMargin));

    //   var dim = doc.getTextDimensions('Text');
    //   var lineHeight = dim.h;
    //   lineTop1 = (lineHeight/2)*lines1.length + 10;

    //   for(var i=0;i<lines1.length;i++){
    //     lineTop = (lineHeight/2)*i;
    //     doc.text(lines1[i],45,285+lineTop); 
    //   }

    //   for(var i=0;i<lines2.length;i++){
    //     lineTop = (lineHeight/2)*i;
    //     doc.text(lines2[i],45,285+lineTop+lineTop1); 
    //   }
    //   doc.save('PagareVale.pdf');
    // }

    $scope.generarIdFondoFijo=function(){
      fondoFijoRepository.getFondoFijoId($scope.idEmpresa, $scope.idSucursal, $scope.idDepartamento).then(function successCallback(response) {
        $scope.fondoFijoInfo = response.data;
        
        $scope.fondoFijoid = $scope.fondoFijoInfo[0].emp_nombrecto + '-' + $scope.fondoFijoInfo[0].suc_nombrecto + '-' +$scope.fondoFijoInfo[0].dep_nombrecto + '-' + $scope.fondoFijoInfo[0].num;
    }, function errorCallback(response) {
        //alertFactory.error('Error en empresas.');
    });

    }

    $scope.generarNombreFondoFijo=function(){
      $scope.nombreFondoFijo = 'Fondo Fijo ' +$scope.nombreDepartamento;
    }

    $scope.unidades = function(num){
      switch(num)
    {
        case 1: return "UN";
        case 2: return "DOS";
        case 3: return "TRES";
        case 4: return "CUATRO";
        case 5: return "CINCO";
        case 6: return "SEIS";
        case 7: return "SIETE";
        case 8: return "OCHO";
        case 9: return "NUEVE";
    }

    return "";
    }

    $scope.decenas = function(num){
    decena = Math.floor(num/10);
    unidad = num - (decena * 10);

    switch(decena)
    {
        case 1:
            switch(unidad)
            {
                case 0: return "DIEZ";
                case 1: return "ONCE";
                case 2: return "DOCE";
                case 3: return "TRECE";
                case 4: return "CATORCE";
                case 5: return "QUINCE";
                default: return "DIECI" + $scope.unidades(unidad);
            }
        case 2:
            switch(unidad)
            {
                case 0: return "VEINTE";
                default: return "VEINTI" + $scope.unidades(unidad);
            }
        case 3: return $scope.DecenasY("TREINTA ", unidad);
        case 4: return $scope.DecenasY("CUARENTA ", unidad);
        case 5: return $scope.DecenasY("CINCUENTA ", unidad);
        case 6: return $scope.DecenasY("SESENTA ", unidad);
        case 7: return $scope.DecenasY("SETENTA ", unidad);
        case 8: return $scope.DecenasY("OCHENTA ", unidad);
        case 9: return $scope.DecenasY("NOVENTA ", unidad);
        case 0: return $scope.unidades(unidad);
    }
  }

    $scope.DecenasY = function(strSin, numUnidades){
      if (numUnidades > 0)
        return strSin + "Y " + $scope.unidades(numUnidades);

      return strSin;

    }

    $scope.centenas = function(num){

    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);

    switch(centenas)
    {
        case 1:
            if (decenas > 0)
                return "CIENTO " +  $scope.decenas(decenas);
            return "CIEN";
        case 2: return "DOSCIENTOS " + $scope.decenas(decenas);
        case 3: return "TRESCIENTOS " + $scope.decenas(decenas);
        case 4: return "CUATROCIENTOS " + $scope.decenas(decenas);
        case 5: return "QUINIENTOS " + $scope.decenas(decenas);
        case 6: return "SEISCIENTOS " + $scope.decenas(decenas);
        case 7: return "SETECIENTOS " + $scope.decenas(decenas);
        case 8: return "OCHOCIENTOS " + $scope.decenas(decenas);
        case 9: return "NOVECIENTOS " + $scope.decenas(decenas);
    }

    return $scope.decenas(decenas);
}//Centenas()

$scope.seccion=function(num, divisor, strSingular, strPlural){
    cientos = Math.floor(num / divisor);
    resto = num - (cientos * divisor);

    letras = "";

    if (cientos > 0)
        if (cientos > 1)
            letras = $scope.centenas(cientos) + " " + strPlural;
        else
            letras = strSingular;

    if (resto > 0)
        letras += "";

    return letras;
}

$scope.miles = function(num){
    divisor = 1000;
    cientos = Math.floor(num / divisor);
    resto = num - (cientos * divisor);

    strMiles = $scope.seccion(num, divisor, "UN MIL", "MIL");
    strCentenas = $scope.centenas(resto);

    if(strMiles == "")
        return strCentenas;

    return strMiles + " " + strCentenas;
}

$scope.millones = function(num){
  divisor = 1000000;
  cientos = Math.floor(num / divisor);
  resto = num - (cientos * divisor);

  strMillones = $scope.seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
  strMiles = $scope.miles(resto);

  if(strMillones == "")
      return strMiles;

  return strMillones + " " + strMiles;
}

$scope.numeroALetras=function(num){
  var data = {
    numero: num,
    enteros: Math.floor(num),
    //centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
    //letrasCentavos: "",
    letrasMonedaPlural: 'PESOS',//“PESOS”, 'Dólares', 'Bolívares', 'etcs'
    letrasMonedaSingular: 'PESO' //“PESO”, 'Dólar', 'Bolivar', 'etc'

    //letrasMonedaCentavoPlural: "CENTAVOS",
    //letrasMonedaCentavoSingular: "CENTAVO"
};
  $scope.centavos = (((Math.round(num * 100)) - (Math.floor(num) * 100)));
  $scope.centavos = $scope.centavos == 0 ? '00' : $scope.centavos;
if (data.centavos > 0) {
    data.letrasCentavos = "CON " + (function (){
        if (data.centavos == 1)
            return $scope.millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
        else
            return $scope.millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
        })();
};

if(data.enteros == 0)
    return "CERO " + data.letrasMonedaPlural //+ " " + data.letrasCentavos;
if (data.enteros == 1)
    return $scope.millones(data.enteros) + " " + data.letrasMonedaSingular //+ " " + data.letrasCentavos;
else
    return $scope.millones(data.enteros) + " " + data.letrasMonedaPlural //+ " " + data.letrasCentavos;
}

$scope.actualizarTramite = function() {
    swal({
            title: '¿Deseas actualizar tu trámite?',
            text: 'Se sobreescribiran los datos del trámite',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
            if (isConfirm) {
                      
            $scope.updateBorradorImages(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.documentos, 0);
            } 
        });
}

$scope.verImagenModalVale = function(item) {
    if(item.tipoEvidencia == 'pdf')
    {$scope.verPdfVale(item)}
    else
    {
    $scope.modalTitle = 'Evidencia';
    $scope.obervacionesDoc = item.comentario;
    $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
    $scope.verImagen = item.evidencia;
    $("#mostrarImagen").modal("show");
}
    
}

$scope.validaDataComprobacion = function( item, opcion ){
    //console.log("idGastoFondoFijo", item.idGastoFondoFijo)
    //item.tipoComprobante = null;
    if( item.idGastoFondoFijo == 2 ){
        if(
            item.tipoComprobante === undefined || item.tipoComprobante === null ||
            item.tipoIVA === undefined || item.tipoIVA === null ||
            item.areaAfectacion === undefined || item.areaAfectacion === null ||
            item.conceptoAfectacion === undefined || item.conceptoAfectacion === null
            ){
            swal( "Revisión de la comprobación", "No se encontró la información completa, favor de entrar en ‘Editar Comprobación’ y complete el registro.", "warning" );
        }
        else{
            console.log("Valida campos", true)
            if( opcion == 2 ){
                $scope.AutorizarRechazarEvidencia(item, 2 );
            }
            else if( opcion == 3){
                $scope.modalComentarios(item, 3);
            }
        }
    }
    else{
        console.log("Valida campos", false)
        if( opcion == 2 ){
            $scope.AutorizarRechazarEvidencia(item, 2 );
        }
        else if( opcion == 3){
            $scope.modalComentarios(item, 3);
        }
    }
}

$scope.editarEvidencia = function(item) { // idtipoComprobante
    console.log( "item.tipoComprobante", item.tipoComprobante );
    console.log( "item.tipoIVA", item.tipoIVA );
    console.log( "item.areaAfectacion", item.areaAfectacion );
    console.log( "item.conceptoAfectacion", item.conceptoAfectacion );
    

    $scope.modalTitleEdit = 'Edición Comprobación';
    $scope.comp_areaAfectacion = item.areaAfectacion;
    $scope.comp_conceptoAfectacion = item.conceptoAfectacion;
    $scope.comp_tipoComprobante = item.tipoComprobante;
    $scope.comp_tipoIVA = item.tipoIVA;
    $scope.comp_idComprobacionVale = item.idValeEvidencia;
    $scope.getAreaAfectacion($scope.idEmpresa, $scope.sucursalVale);
    $scope.getConceptoAfectacion($scope.idEmpresa, $scope.sucursalVale, item);
    $scope.getTipoComprobante($scope.sucursalVale);
    $scope.getIVABySucursal($scope.sucursalVale);
    $scope.idProveedor = 0;
    $scope.motivoComprobacion = item.motivo;
    $scope.esFactura = item.esFactura == 'S' ? true : false;
    if(item.esFactura == 'S')
    {
        $scope.idProveedor = item.idProveedor
        $scope.buscarProveedor($scope.idProveedor);
        $scope.verProveedor = true;
    }
    else
    { $scope.verProveedor = false;}
    $("#mostrarEditarComprobacion").modal("show");

}

$scope.buscarProveedor = function (idProveedor) {
    if(idProveedor == 0 || idProveedor == '' || idProveedor == undefined)
    {  swal('Alto', 'El ID no puede ser 0 o vacio', 'warning');}
    else
    {
    fondoFijoRepository.getProveedor(idProveedor).then((res) => {
        if (res != null && res.data != null && res.data.length > 0) {
            if(res.data[0].PER_TIPO == 'FIS')
            {
            $scope.nombreProveedor = '';
            swal('Alto', 'El ID pertence a una persona fisica', 'warning');
            }
            else
            { $scope.nombreProveedor = res.data[0].PER_NOMRAZON;}
     
        }
        else{
            swal('Alto', 'El ID no localizado', 'warning');
            $scope.nombreProveedor = '';
        }
    });
}
};

$scope.getAreaAfectacion = function (selEmpresa, selSucursal) {
    $scope.areaAfectacionList = [];
    anticipoGastoRepository.getAreaAfectacion(selEmpresa, selSucursal).then((res) => {
        if (res != null && res.data != null && res.data.length > 0) {
            $scope.areaAfectacionList = res.data;
            $scope.selCNC_CONCEPTO1 = $scope.comp_areaAfectacion;
        }
    });
};

$scope.getConceptoAfectacion = function (selEmpresa, selSucursal, item) {     
    misTramitesValesRepository.getConceptoAfectacion(selEmpresa,selSucursal).then((res) => {
        if (res != null && res.data != null && res.data.length > 0) {
            $scope.conceptoGastoList = res.data;
            $scope.conceptoGastoLista = res.data;
            $scope.idConceptoSeleccion =  $scope.comp_conceptoAfectacion;
            $scope.ConceptoSeleccion  =  $scope.conceptoGastoLista.length == 0 ? '' : $scope.conceptoGastoLista.filter(con => con.PAR_IDENPARA ==  $scope.comp_conceptoAfectacion)[0];
            if($scope.ConceptoSeleccion.PAR_DESCRIP1.includes('NO DEDUCIBLES'))
            {
                $scope.bloqueoCajero1 = true;
                $scope.bloqueoCajero2 = true;
                $scope.bloqueoCajero3 = true;
            }
            else
            {
                $scope.bloqueoCajero1 = false;
                $scope.bloqueoCajero2 = false;
                $scope.bloqueoCajero3 = false;
            }

            if( item.tipoComprobante === undefined || item.tipoComprobante === null ){
                $scope.bloqueoCajero1 = false;
            }
            if( item.conceptoAfectacion === undefined || item.conceptoAfectacion === null ){
                $scope.bloqueoCajero2 = false;
            }
            if( item.tipoIVA === undefined || item.tipoIVA === null ){
                $scope.bloqueoCajero3 = false;
            }
        }
    });
};

$scope.getTipoComprobante = function ( selSucursal) {
    $scope.tipoComprobanteList = [];
    misTramitesValesRepository.getTipoComprobante(selSucursal).then((res) => {
        if (res != null && res.data != null && res.data.length > 0) {
            $scope.tipoComprobanteList = res.data;
            $scope.idtipoComprobante =  $scope.comp_tipoComprobante;
        }
    });
};

$scope.getIVABySucursal = function ( selSucursal) {
    $scope.IVAList = [];
    fondoFijoRepository.obtieneIVAbySucursal(selSucursal).then((res) => {
        if (res != null && res.data != null && res.data.length > 0) {
            $scope.IVAList = res.data;
            $scope.idtipoIVA =  $scope.comp_tipoIVA;
        }
    });
};
$scope.actualizarComprobacion = async function () {
    if($scope.selCNC_CONCEPTO1 == undefined || 
       $scope.idConceptoSeleccion == undefined ||
       $scope.idtipoComprobante == undefined || 
       $scope.idtipoIVA == undefined ||
       ($scope.esFactura == true ? ($scope.idProveedor == 0 || $scope.idProveedor == '') :  $scope.idProveedor)
       )
       { 
        swal('Alto', 'Debes seleccionar todas las opciones', 'warning');
       }
       else
       {
        var validaRet = await ValidaRetenciones($scope.sucursalVale, $scope.idtipoComprobante, $scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion);
        if(validaRet[0].estatus == 1)
        {
        fondoFijoRepository.actualizarComprobacionVale($scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion, $scope.idtipoComprobante, $scope.idtipoIVA, $scope.comp_idComprobacionVale, $scope.idProveedor).then((res) => {
            if (res.data.length > 0) {
                swal('Fondo Fijo', 'Se actualizo el registro correctamente', 'success');
                $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.idVale);
                // $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.idVale);
                $("#mostrarEditarComprobacion").modal("hide");
            }
        });
        }
        else
        {
            swal("Atención",validaRet[0].mensaje , "warning");
        }
       } 
};
$scope.cancelEdit = function () {
    $("#mostrarEditarComprobacion").modal("hide");
}

$scope.verPdfVale = function(item) {
    $('#pdfReferenceContent object').remove();
    $scope.modalTitle = 'Evidencia';
    $scope.obervacionesDoc = item.comentario;
    $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
    var pdf = item.evidencia;
    $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
    $("#mostrarPdf").modal("show");
}

$scope.verPdfComprobacion = function(item) {
    $('#pdfReferenceContent object').remove();
    $scope.modalTitle = 'Evidencia Comprobación de Mas';
    $scope.obervacionesDoc = '';
    $scope.verComentarios = false;
    var pdf = item.rutaComprobacionMas;
    $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
    $("#mostrarPdf").modal("show");
}


   $scope.modalDescuento = function (data, accion) {
    swal({
        title: 'Primero tiene que aprobar/rechazar todas las comprobaciones, de lo contrario se hará el descuento por todo lo que no esté comprobado',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:'Aceptar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                $scope.descuentoSelected = '';
                $("#modalDescuento").modal("show");
            }
        });
        //$scope.descuentoSelected = '';
        //$("#modalDescuento").modal("show");
    };

    $scope.enviarDescuento = async function () {
        if ($scope.descuentoSelected == undefined) {
            swal('Alto', 'Debes seleccionar el tipo de descuento', 'warning');
        } else {
            $("#modalDescuento").modal("hide");
            $("#loading").modal("show");
          
                    var estatusVales = await verificaValesEvidencia($scope.idVale); 
                    let monto = estatusVales == undefined ? $scope.importeVale :  estatusVales.montoSolicitado - estatusVales.montoJustificado
                    var tipoProceso = false;
                    //if($scope.descuentoSelected == 1)
                    //{
                        //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoJustificado, 0);
                        //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'CVFM', $scope.nombreVale,  monto, 0);
                        let CCDepto = zeroDelete($scope.cuentaContable);
                        //Se comenta por que no tenemos datos de config
                        //tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , estatusVales.montoJustificado, '', $scope.nombreDepartamentoVale, 0, '' );
                        tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 10,$scope.nombreVale , monto, '', $scope.nombreDepartamentoVale, JSON.parse(localStorage.getItem('borrador')).idPerTra, '', CCDepto);
                    //}
                    //else
                    //{
                        //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoJustificado, 0);
                        //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'CVFD', $scope.nombreVale,  estatusVales.montoJustificado, 0);
                        //Se comenta por que no tenemos datos de config
                        //tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , estatusVales.montoJustificado, '', $scope.nombreDepartamentoVale, 0, '' );
                      //  tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 11,$scope.nombreVale , monto, '', $scope.nombreDepartamentoVale, JSON.parse(localStorage.getItem('borrador')).idPerTra, '');
                   // }

                    fondoFijoRepository.valeSinComprobar($scope.idVale,monto).then(function (result) {
                        if (result.data.length > 0) {
                            $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.idVale);
                            $scope.regresarVale();
                            $('#loading').modal('hide');
                        }
                    }); 
                    // if(estatusVales.justifico > 0)
                    // {
                    //     if(estatusVales.justificoMas > 0)
                    //     {
                    //        tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , estatusVales.montoSolicitado, '', $scope.nombreDepartamentoVale );
                    //        tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 9,$scope.nombreVale , estatusVales.justificoMas, '', $scope.nombreDepartamentoVale );
                    //     }
                    // }


                    $('#loading').modal('hide');
      
        }  
    };

    $scope.regresarComprobacion = function() {
        $("#modalDescuento").modal("hide");
    }

$scope.AutorizarRechazarEvidencia = function (item,tipo) {
    swal({
        title: '¿Deseas aprobar la Comprobación?',
        text: 'La Comprobación se aprobara',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
     function(isConfirm) {
        if (isConfirm) {
            $('#loading').modal('show');
            misTramitesValesRepository.updateTramiteValeEvidencia(item.idValeEvidencia,tipo,'',0, $rootScope.user.usu_idusuario).then(async function (result) {
                if (result.data.length > 0) {
                    // if(item.esFactura == 'S')
                    // {
                    //     //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  item.monto, 0);
                    //     tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , item.monto, '', $scope.nombreDepartamentoVale, 0, '' );
                    //     $('#loading').modal('hide');  
                    // }
                    // else
                    // {

                    

                    var estatusVales = await verificaVale(item.idEmpresa, item.idSucursal, item.nombreVale, item.monto);
                    var estatusVale = await verificaValesEvidencia(item.idVale);

                    console.log("estatusVales.JustificoMas", estatusVales.JustificoMas);
                    console.log("Validaciones", estatusVales.justificado, estatusVale.justifico, item.compNoAutorizado)
                    //var correoFinanzas = await obtieneCorreo();
                    if((estatusVales.justificado == 1 || estatusVale.justifico == 1) && item.compNoAutorizado == 0)
                    {
                        //let monto = estatusVales.justificado == 1 ? estatusVales.JustificoMas : estatusVale.justificoMas;
                        let montoestatusVales = estatusVales.JustificoMas;
                        let montoestatusVale = estatusVale.justificoMas;
                        if( montoestatusVales > 0 ||  montoestatusVale > 0){
                        	$scope.obtenerVale(montoestatusVales > 0 ? montoestatusVales : montoestatusVale, item.nombreSolicitante)
                        }
                    }
                    var tipoProceso = false;
                    if(item.tipoGasto == 1)
                    {
                        if(estatusVales.justificado == 0  && estatusVales.JustificoMas == 0)
                        {
                            tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 7,item.idComprobacionVale , item.monto, '', $scope.nombreDepartamentoVale, 0, '','' );
                        }
                        else
                        {
                            if(estatusVales.JustificoMas == 0)
                            {
                                tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 7,item.idComprobacionVale , item.monto, '', $scope.nombreDepartamentoVale, 0, '','' );
                            }
                            else
                            {
                              tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 7,item.idComprobacionVale , item.monto - estatusVales.JustificoMas, '', $scope.nombreDepartamentoVale, 0, '','' );
                              if(item.compNoAutorizado == 0)
                              {
                                tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 8,item.idComprobacionVale , estatusVales.JustificoMas, '', $scope.nombreDepartamentoVale, 0, '','' );

                              }
                              else
                              {
                                tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 9,item.idComprobacionVale , estatusVales.JustificoMas, '', $scope.nombreDepartamentoVale, 0, '','' );
                              }
 
                            }

                        }
                        // if(estatusVales.justifico > 0)
                        // {
                        //     if(estatusVales.justificoMas > 0)
                        //     {
                        //         if(estatusVales.comprobado == 0)
                        //        {  
                                   //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoSolicitado, 0);
                    // tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 7,item.idComprobacionVale , item.monto, '', $scope.nombreDepartamentoVale, 0, '','' );
                     
                     if(tipoProceso)
                     {
                        $('#loading').modal('hide');  
                     }
                     else
                     {
                        swal('Alto', 'Ocurrio un error al crear la poliza, Favor de contactar a sistemas', 'warning');
                     }
                           
                     //}       
                            // //    tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'CVFR', $scope.nombreVale,  estatusVales.justificoMas, 0);       
                            // //    tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 8,$scope.nombreVale , estatusVales.justificoMas, '', $scope.nombreDepartamentoVale, 0, '' );
                            // dataPoliza = 
                            // {
                            // id_perTra: JSON.parse(localStorage.getItem('borrador')).idPerTra,
                            // idVale: item.idVale,
                            // idComprobacionVale: item.idValeEvidencia ,
                            // idTramiteConcepto: null,
                            // idComprobacionConcepto:null,
                            // monto: estatusVales.justificoMas,
                            // idTramite: $scope.selTramite
                            // }
                            // let body = $scope.html1 + '<br>Estimado ' + correoFinanzas.nombreUsuario + " favor de autorizar la salida de efectivo. Vale N° "  + $scope.nombreVale + " fue solicitado"  + $scope.html2;
                            //  $scope.sendMail(correoFinanzas.correo, 'Autorizar la salida de efectivo ' + $scope.idFondoFijo, body);
                            //  $scope.guardaPolizaCVFR(dataPoliza);
                        // }
                        //     else
                        //     {
                        //     //    tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoSolicitado, 0);
                        //     //    let orden = await guardaOrdenMasiva(dataOrden);
                        //     //    console.log(orden);
                        //     tipoProceso = await promiseInsertaDatosFront($scope.idUsuario, $scope.sucursalVale , 7,item.idComprobacionVale , item.monto - estatusVales.justificoMas, '', $scope.nombreDepartamentoVale, 0, '','' );
                        //     }
                        // }

                    }
                    else{
                        dataOrden = 
                        {
                        idusuario: $scope.idUsuario,
                        idempresa: $scope.empresa,
                        idsucursal: $scope.sucursalVale,
                        id_perTra: JSON.parse(localStorage.getItem('borrador')).idPerTra,
                        proceso: 1,
                        producto: item.idComprobacionVale
                        }
                        let orden = await guardaOrdenMasiva(dataOrden);
                         console.log(orden);
                        $('#loading').modal('hide'); 
                    }     
                    $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, item.idVale);
                //}
            }
            });      
        } 
    });
}

$scope.guardaPolizaCVFR = function (data) {
    fondoFijoRepository.guardaPolizaCVFR(data).then(function (result) {
        if (result.data.length > 0) {
        }
    });
}

$scope.ComprbarNoAutorizadoEvidencia = function (item,tipo) {
    swal({
        title: '¿Deseas aprobar el vale?',
        text: 'El vale se aprobara solo por el monto del vale solicitado',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
     function(isConfirm) {
        if (isConfirm) {
            $('#loading').modal('show');
            misTramitesValesRepository.updateTramiteValeEvidencia(item.idValeEvidencia,tipo,'',1).then(async function (result) {
                if (result.data.length > 0) {
                   
                    dataOrden = 
                    {
                    idusuario: $scope.idUsuario,
                    idempresa: $scope.empresa,
                    idsucursal: $scope.sucursalVale,
                    id_perTra: JSON.parse(localStorage.getItem('borrador')).idPerTra,
                    proceso: 1,
                    producto: item.idComprobacionVale
                    }
                    let orden = await guardaOrdenMasiva(dataOrden);
                   console.log(orden);
                   $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, item.idVale);
                    // // if(item.esFactura == 'S')
                    // // {
                    // //     //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  item.monto, 0);
                    // //     tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , item.monto, '', $scope.nombreDepartamentoVale, 0, '' );
                    // //     $('#loading').modal('hide');  
                    // // }
                    // // else
                    // // {
                    // $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, item.idVale);
                    // var estatusVales = await verificaValesEvidencia(item.idVale);
                    //  var tipoProceso = false;
                    //  if(estatusVales.justifico > 0)
                    //  {
                    //      if(estatusVales.justificoMas > 0)
                    //      {
                    //          if(estatusVales.comprobado == 0)
                    //         {  
                    //             //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoSolicitado, 0);
                    //             tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , estatusVales.montoSolicitado, '', $scope.nombreDepartamentoVale, 0, '' );
                    //         }       
                    //         //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'CVFR', $scope.nombreVale,  estatusVales.justificoMas, 0);       
                    //         tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 9,$scope.nombreVale , estatusVales.justificoMas, '', $scope.nombreDepartamentoVale, 0, '' );
                    //      }
                    //      else
                    //      {
                    //         //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoSolicitado, 0);
                    //         tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , estatusVales.montoJustificado, '', $scope.nombreDepartamentoVale, 0, '' );
                    //      }
                    //  }
                     $('#loading').modal('hide');                
                //}
            }
            });      
        } 
    });
}

$scope.modalAutorizaVale = function (item,tipo) {
    $scope.itemRechazo = item;
    $scope.tipoRechazo = tipo;
    $("#autorizaCompVale").modal("show");
};

$scope.modalDepartamentos = function (item) {
    $scope.selDepartamento = 0;
    $scope.porcentaje = 0;
    $scope.idValeEvidencia = item.idValeEvidencia;
    $("#modalDepartamento").modal("show");
    $scope.getDepartamentosPorArchivo();
    $scope.errorMensaje = '';
};

$scope.getDepartamentosPorArchivo = function () {
    $scope.porcentajeTotal = 0;
    $scope.departamentosArchivo = [];
    var deptosTemp = [];
    $scope.getDepartamentos($scope.sucursal);
    fondoFijoRepository.getDepartamentosPorEvidencia($scope.idValeEvidencia).then((response) => {
        if (response.data != null && response.data.length > 0) {
            $scope.departamentosArchivo = response.data;
            devolucionesRepository.departamentos($scope.idEmpresa, $scope.sucursal).then((res) => {
                if (response.data != null && response.data.length > 0) {
                    deptosTemp = res.data;
                    $scope.departamentos = [];
                    for (var i = 0; i < deptosTemp.length; i++) {
                        if ($scope.departamentosArchivo.filter(p => p.idDepartamento == deptosTemp[i].idDepartamento).length == 0) {
                            $scope.departamentos.push(deptosTemp[i]);
                        }
                    }
                }
            });

            for (var i = 0; i < $scope.departamentosArchivo.length; i++) {
                $scope.porcentajeTotal = $scope.porcentajeTotal + $scope.departamentosArchivo[i].porcentaje;
            }
        } else {
            devolucionesRepository.departamentos($scope.idEmpresa, $scope.sucursal).then((res) => {
                if (response.data != null && response.data.length > 0) {
                    $scope.departamentos = res.data;
                }
            });
        }
    });
};

$scope.getDepartamentos = function (idSucursal) {
    $scope.departamentos = [];
    $scope.sucursal = idSucursal;
    if ($scope.sucursal == null || $scope.sucursal == undefined || $scope.sucursal == 0) {
        $scope.disabledDepto = true;
        $scope.sucursal = 0;
        $scope.selDepartamento = 0;
    } else {
        devolucionesRepository.departamentos($scope.idEmpresa, $scope.sucursal).then((res) => {
            $scope.departamentos = res.data;
            $scope.disabledDepto = false;
        });
    }
}

$scope.guardarDepartamento = function () {
    $scope.errorMensaje = '';
    if (($scope.porcentajeTotal + $scope.porcentaje) <= 100) {
        fondoFijoRepository.guardarEvidenciaDepartamento($scope.selDepartamento, $scope.porcentaje, $scope.idValeEvidencia).then((res) => {
            if (res != null && res.data != null && res.data.respuesta != 0) {
                $scope.selDepartamento = 0;
                $scope.porcentaje = 0;
                swal('Fondo Fijo', 'Se guardo el registro correctamente', 'success');
                $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.idVale);
                $scope.getDepartamentosPorArchivo();
            } else {
            
                swal('Fondo Fijo', 'Ocurrio un error al guardar el registro', 'success');
            }
        });
    } else {
        $scope.errorMensaje = 'El porcentaje total no debe ser mayor a 100.';
    }
};

$scope.eliminarDepartamentoArchivo = function (departamento) {
    //var deptoDescripcion = $scope.departamentos.filter(depto => depto.idDepartamento == $scope.selDepartamento)[0].nombre;
    fondoFijoRepository.eliminaDepartamentoEvidencia(departamento.idValeEvidenciaDepartamento).then((res) => {
        if (res != null && res.data != null && res.data.respuesta != 0) {
            swal('Fondo Fijo', 'Se proceso la solictud correctamente', 'success');
            $scope.getDepartamentosPorArchivo();
            $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.idVale);
            $scope.conceptosGastoPorSolicitud();
        } else {
            swal('Fondo Fijo', 'Ocurrio un error al guardar el comentario', 'success');
        }
    });
};

$scope.getArchivosPorConcepto = function (concepto) {
    $scope.archivos = [];
    $scope.conceptoSeleccionado = concepto.concepto;
    $scope.concepto = concepto;
    $scope.accionEnviar = true;
    anticipoGastoRepository.getArchivosPorConcepto(concepto.id).then((response) => {
        if (response.data != null && response.data.length > 0) {
            $scope.archivos = response.data;
            /*for (var i = 0; i < $scope.archivos.length; i++) {
                if ($scope.archivos[i].porcentaje != 100) {
                    $scope.accionEnviar = false;
                }
            }*/
        }
    });

};

$scope.modalComentarios = function (item,tipo) {
    $scope.itemRechazo = item;
    $scope.tipoRechazo = tipo;
    $("#rechazarDoc").modal("show");
};

$scope.modalComentariosdocumentos = function (doc) {
    $scope.sendDetIdPerTra = doc.det_idPerTra;
    $scope.id_documento = doc.id_documento;
    $("#rechazarDocSE").modal("show");
};

$scope.cancelRechazo = function () {
    $("#rechazarDoc").modal("hide");
    $("#rechazarDocSE").modal("hide");
    $scope.razonesRechazo = '';
}

$scope.sendRechazo = function () {
    if ($scope.razonesRechazo == '') {
        swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
    } else {
        $("#rechazarDoc").modal("hide");
        $("#loading").modal("show");
        misTramitesValesRepository.updateTramiteValeEvidencia($scope.itemRechazo.idValeEvidencia,$scope.tipoRechazo,$scope.razonesRechazo,0).then(async function (result) {
            if (result.data.length > 0) {
                $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, $scope.itemRechazo.idVale); 
                let bodyUsuVale = 
                '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                '<p>Estimado usuario, '+ $scope.itemRechazo.nombreSolicitante +', se rechazo la siguiente Evidencia de Vale. </p>' +
                '<p>Solicitud de Fondo Fijo: '+ $scope.itemRechazo.id_perTra  +' </p>' +
                '<p>Folio Fondo Fijo: ' +  $scope.itemRechazo.idFondoFijo +'</p>' +
                '<p>Folio Vale: ' +  $scope.itemRechazo.nombreVale +'</p>' +
                '<p>Folio Comprobación Vale: ' +  $scope.itemRechazo.idComprobacionVale +'</p>' +
                '<p>Motivo: ' +  $scope.razonesRechazo +'</p>' +
                '<p>Cantidad: $'+ formatMoney($scope.itemRechazo.monto)   + '</p>';      
                $scope.sendMail($scope.itemRechazo.correoSolicitante, 'Rechazo de Comprobación Vale de Fondo Fijo ' + $scope.itemRechazo.id_perTra, bodyUsuVale);
                $scope.razonesRechazo = '';
                //var estatusVales = await verificaValesEvidencia($scope.itemRechazo.idVale);
               /*  var tipoProceso = false;
                if(estatusVales.justifico > 0)
                {
                    if(estatusVales.justificoMas > 0)
                    {
                       //tipoProceso = await promiseInsertaDpromiseInsertaDatosatosOrden($scope.empresa, $scope.sucursalVale, 'AVFF', $scope.nombreVale,  estatusVales.montoSolicitado, 0);
                       //tipoProceso = await promiseInsertaDatosOrden($scope.empresa, $scope.sucursalVale, 'CVFN', $scope.nombreVale,  estatusVales.justificoMas, 0);
                       tipoProceso = await ($scope.idUsuario, $scope.sucursalVale , 7,$scope.nombreVale , estatusVales.montoSolicitado, '', $scope.nombreDepartamentoVale, 0, '' );
                       tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursalVale , 9,$scope.nombreVale , estatusVales.justificoMas, '', $scope.nombreDepartamentoVale, 0, '' );
                    }
                } */
                $('#loading').modal('hide');
            }
            else
            {
                $('#loading').modal('hide');
            }
        });
    }
}

$scope.sendRechazoSE = function () {
    if ($scope.razonesRechazo == '') {
        swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
    } else {
        $("#rechazarDoc").modal("hide");
        $("#loading").modal("show");
        aprobarRepository.rechazarDocumento($scope.sendDetIdPerTra, $scope.razonesRechazo, $scope.id_perTra, $scope.id_documento).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                swal('Listo', res.data[0].msg, 'success');
            } else {
                $scope.sendDetIdPerTra = 0;
                $("#loading").modal("hide");
                swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
            }
        });
    }
}

$scope.sendMail = function(to, subject, html) {
    devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
        if (res.data.response.success == 1) {
            console.log('Correo enviado con exito ")')
        } else {
            console.log('Ocuerrio un error al emviar el correo "( ')
        }
    });
};
$scope.updateBorradorImages = function(idPerTra, documentos, contDocs) {
    if (contDocs <= documentos.length - 1) {
        if (documentos[contDocs].existe > 0) {
            if (documentos[contDocs].archivo != undefined) {
                sendData = {
                    idDocumento: documentos[contDocs].id_documento,
                    idTramite: documentos[contDocs].id_tramite,
                    idPerTra: idPerTra,
                    saveUrl: documentos[contDocs].saveUrl + 'FondoFijo\\' + 'FondoFijo_' + idPerTra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                    archivo: documentos[contDocs].archivo['archivo'],
                    det_idPerTra: documentos[contDocs].det_idPerTra
                }
                devolucionesRepository.updateDocumentos(sendData).then((res) => {
                    $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
                });
            } else {
                $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
            }
        } else {
            if (documentos[contDocs].archivo != undefined) {
                sendData = {
                    idDocumento: documentos[contDocs].id_documento,
                    idTramite: documentos[contDocs].id_tramite,
                    idPerTra: idPerTra,
                    saveUrl: documentos[contDocs].saveUrl + 'FondoFijo\\' + 'FondoFijo_' + idPerTra,
                    idUsuario: $rootScope.user.usu_idusuario,
                    extensionArchivo: documentos[contDocs].archivo['nombreArchivo'].split('.')[1] == 'jpg' ? 'jpeg' : documentos[contDocs].archivo['nombreArchivo'].split('.')[1],
                    archivo: documentos[contDocs].archivo['archivo']
                }
                devolucionesRepository.saveDocumentos(sendData).then((res) => {
                    $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
                });
            } else {
                $scope.updateBorradorImages(idPerTra, documentos, contDocs + 1);
            }
        }
    } else {
        $scope.saveDocumentosSeleccionados(idPerTra)
    }
}
$scope.openWizard = function() {
    fondoFijoRepository.estatusFondoFijo(1).then((res) => {
        if (res.data.length > 0) {
            $scope.allEstatusFondoFijo = res.data;
        } else {
            swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
        }
    });
}
$scope.SeleccionaTipo = function (tipo) {
    $scope.verBotonSalida = true;
    if(tipo == 1)
    {
        $scope.verOrdenPago = true;
        $scope.verCaja = false;
    }
    else if(tipo == null ||tipo == 0)
    {
        $scope.verOrdenPago = false;
        $scope.verCaja = false;
        $scope.verBotonSalida = false;
    }
    else
    {
        $scope.verOrdenPago = false;
        $scope.verCaja = true;
    }
}
$scope.SeleccionaTipoR = function (tipo) {
    $scope.verBotonReembolso = true;
    if(tipo == 1)
    {
        $scope.verOrdenPagoR = true;
        $scope.verCajaR = false;
    }
    else if(tipo == null || tipo == 0)
    {
        $scope.verOrdenPagoR = false;
        $scope.verCajaR = false;
        $scope.verBotonReembolso = false;
    }
    else
    {
        $scope.verOrdenPagoR = false;
        $scope.verCajaR = true;
    }
}

$scope.getParametro = function (parametro) {
    fondoFijoRepository.paramFondoFijo(parametro).then((res) => {
        $scope.amountFondoFijo = parseInt(res.data[0].pr_descripcion);
    });
}

// $scope.guardarSalidaFF = async function (tipo,bancoSalida,bancoEntrada ) {
//     $('#loading').modal('show');
//     var tipoProceso = false;
//     if(tipo == 1)
//     {
//         tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursal, 1, $scope.idFondoFijo, $scope.monto, 'FONFIJ','FFOP', 0, '' );
//     }
//     else
//     {
//         tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursal, 2, $scope.idFondoFijo, $scope.monto, 'FONFIJ','FFOP', 0, '' );
//         tipoProceso = await promiseInsertaDatos($scope.idUsuario, $scope.sucursal, 3, $scope.idFondoFijo, $scope.monto, 'FONFIJ','FFOP', 0, '' );
//     }
//     if(tipoProceso)
//     {
//     fondoFijoRepository.guardarSalidaFF(JSON.parse(localStorage.getItem('borrador')).idPerTra,3, tipo,bancoSalida == undefined ? 0 : bancoSalida,bancoEntrada == undefined ? 0 :bancoEntrada).then((res) => {
//        if(res.data[0].success == 1)
//        {
//         swal('Listo', 'Se guardo correctamente', 'success');
//         $('#loading').modal('hide');
//         $location.path('/misTramites');
//        }
//        else
//        {
//         swal('Atencion', 'No se guardo correctamente, intentelo mas tarde', 'warning');
//         $('#loading').modal('hide');
//         $location.path('/misTramites');
//        }
//     });
//     }
//     else
//     {swal('Atencion', 'No se guardo correctamente, intentelo mas tarde', 'warning');}
// }

$scope.guardarReembolso = function (tipo,bancoSalida,bancoEntrada,estatus) {
    $('#loading').modal('show');
    fondoFijoRepository.guardarReembolso(JSON.parse(localStorage.getItem('borrador')).idPerTra,tipo,bancoSalida == undefined ? 0 : bancoSalida,bancoEntrada == undefined ? 0 :bancoEntrada,estatus).then((res) => {
       if(res.data[0].success == 1)
       {
        swal('Listo', 'Se guardo correctamente', 'success');
        $('#loading').modal('hide');
        $location.path('/misTramites');
       }
       else
       {
        swal('Atencion', 'No se guardo correctamente, intentelo mas tarde', 'warning');
        $('#loading').modal('hide');
        $location.path('/misTramites');
       }
    });
}

$scope.guardarBitacoraProceso = function (idUsuario,id_perTra,idEstatus,accion,bitacora, proceso) {
    dataSave = {
        idUsuario:  idUsuario,
        id_perTra: id_perTra,
        idEstatus : idEstatus,
        accion : accion,
        bitacora : bitacora,
        proceso : proceso}
    fondoFijoRepository.saveBitProceso(dataSave).then((res) => {
    });
}

$scope.enviarNotiCorpo = function(dataSave) {   
    $scope.obtineCorreoNotificacion(19);
    swal({
      title: '¿Deseas enviar a Revisión la Comprobación del Vale?',
      text: 'Se enviará la comprobacipon a revisión',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Solicitar',
      cancelButtonText: 'Cancelar',
      closeOnConfirm: true,
      closeOnCancel: true
  },
  function(isConfirm) {
      if (isConfirm) {
          $('#loading').modal('show');           
         $scope.sendNotificacion(dataSave);    
        
      } else {
          swal('Cancelado', 'No se aplicaron los cambios', 'error');
          $('#loading').modal('hide');
      }
  });
}
    
    /////////Se agrega para notificar la aprobación o rechazo del vale
    $scope.sendNotificacion = function (resf) {
        //$("#loading").modal("show");
        var tipoNot = 19;
    
        var notG = {
            //Obtener el id del vale
            "identificador": parseInt(resf.idValeEvidencia),
            "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la revisión de la Evidencia del vale "+ resf.nombreVale,
            "idSolicitante": $scope.user.usu_idusuario,
            "idTipoNotificacion": tipoNot,
            "linkBPRO": global_settings.urlCORS + "aprobarVale?employee=67&idVale=" + resf.nombreVale,
            "notAdjunto": "",
            "notAdjuntoTipo": "",
            "idEmpresa": $scope.idEmpresa,
            "idSucursal": $scope.idSucursal,
            "departamentoId": 0
        };
        
        clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
                let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a aprobación a Corporativo', 1, 1);
                html = ` ${$scope.html1} Solicitud de Aprobación de Comprobación de Vale <br><br>Folio Comprobación Vale: ${resf.idComprobacionVale} ${$scope.html2}
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Comprobación</a></p>
                <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                
                //var correoAutorizador = $scope.correoAutorizador;
                $scope.sendMail($scope.CorreoFinanzas, 'Solicitud de Aprobación de Comprobacion de Vale', html);
                $scope.listaValesFF(JSON.parse(localStorage.getItem('borrador')).idPerTra, resf.idVale);

                $("#loading").modal("hide");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                $("#loading").modal("hide");
            }
        });
    }
    ////////////////FIN

    $scope.enviarNotiComprobacion = function(dataSave) {  
        $scope.buscarAutorizador($scope.idFF);
        swal({
          title: '¿Deseas enviar a Revisión la Comprobación del Vale?',
          text: 'Se enviará la comprobacipon a revisión',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Solicitar',
          cancelButtonText: 'Cancelar',
          closeOnConfirm: true,
          closeOnCancel: true
      },
      function(isConfirm) {
        if (isConfirm) {
            $('#loading').modal('show');           
           $scope.sendNotificacionComp(dataSave);    
          
        } else {
            swal('Cancelado', 'No se aplicaron los cambios', 'error');
            $('#loading').modal('hide');
        }
    });
  }

    /////////Se agrega para notificar la aprobar de mas una comprobacion
    $scope.sendNotificacionComp = function (resf) {
        //$("#loading").modal("show");
        var tipoNot = 20;
    
        var notG = {
            //Obtener el id del vale
            "identificador": parseInt(resf.idValeEvidencia),
            "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la revisión de la Evidencia del vale "+ resf.nombreVale + ', que tiene Comprobación de mas, a lo solicitado en el Vale',
            "idSolicitante": $scope.user.usu_idusuario,
            "idTipoNotificacion": tipoNot,
            "linkBPRO": global_settings.urlCORS + "aprobarVale?employee=67&Vale=" + resf.nombreVale,
            "notAdjunto": "",
            "notAdjuntoTipo": "",
            "idEmpresa":resf.idEmpresa,
            "idSucursal": resf.idSucursal,
            "departamentoId": resf.idDepartamento
        };
        
        clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
                let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a aprobación a Corporativo', 1, 1);
                html = ` ${$scope.html1} Solicitud de Aprobación de Comprobación de Mas Vale <br><br>Folio Comprobación Vale: ${resf.idComprobacionVale} ${$scope.html2}
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Comprobación</a></p>
                <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                
                //var correoAutorizador = $scope.correoAutorizador;
                $scope.sendMail($scope.correoAutorizador, 'Solicitud de Aprobación de Comprobacion de Mas Vale', html);
                $("#loading").modal("hide");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                $("#loading").modal("hide");
            }
        });
    }
    ////////////////FIN

$scope.cerrarFF = function (data) {
    swal({
        title: '¿Deseas cerrar el Fondo Fijo?',
        text: 'Se cerrara el fondo fijo, no se podran solicitar Vales, se rechazaran los Vales en estatus (solicitado, autorizado). Si tienes Vales sin comprobación ya no podran ser enviados a reembolso.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function(isConfirm) {
      if (isConfirm) {
          $('#loading').modal('show');           
          fondoFijoRepository.cerrarFF(data.id).then((resf) => {
            if (resf.data[0][0].success == 1) {
               $scope.valesCerrados = resf.data[1];
               angular.forEach($scope.valesCerrados, function (list, key) {
                let html = $scope.html1 + 'Rechazo de Vale' + "<br><br>Estimado(a) " + list.nombre + " el Vale con Folio  " + list.idVale +  " fue rechazado por Cierre del Fondo Fijo"  + $scope.html2;
                $scope.sendMail(list.correo, list.asunto, html);
            });
            $('#loading').modal('hide');
            $scope.listaFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
            $scope.listaValeFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
            }
            else{
            
             swal('Error', 'No se aplicaron los cambios', 'error');
            }
        });   
        
      } else {
          swal('Cancelado', 'No se aplicaron los cambios', 'error');
      }
  });
}

$scope.envioCancelacion = function (data) {
    swal({
        title: '¿Deseas enviar el cierre del Fondo Fijo?',
        text: 'Se enviara a su Gerente de Area',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
    function(isConfirm) {
      if (isConfirm) {
          $('#loading').modal('show');           
          fondoFijoRepository.envioCierreFF(data.id).then((resf) => {
            if (resf.data[0].success == 1) {
            let html = $scope.html1 + 'Cierre de Fondo Fijo' + "<br><br>Estimado(a) " + resf.data[0].nombreAutorizador + " la solicitud de Fondo Fijo " + resf.data[0].idPerTra + ", Folio "  + resf.data[0].fondo + " fue solicitado"  + $scope.html2;
            $scope.sendMail(resf.data[0].correo, resf.data[0].asunto, html);
            $('#loading').modal('hide');
            $scope.listaFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
            $scope.listaValeFondoFijo(JSON.parse(localStorage.getItem('borrador')).idPerTra);
            }
            else{
            
             swal('Error', 'No se aplicaron los cambios', 'error');
             $('#loading').modal('hide');
            }
        });   
        
      } else {
          swal('Cancelado', 'No se aplicaron los cambios', 'error');
          $('#loading').modal('hide');
      }
  });
}

$scope.envioCierreContraloria = function (data) {
    $scope.obtineCorreoNotificacion(21);
    $scope.dataCierre = data;
    $scope.cierreSelected = ''
    $scope.tipoCierreFF = [{ id:1, text:'Deposito'},{ id:2, text:'Caja'}]
    $("#modalCierreFF").modal("show");
}

$scope.enviarCierreFF = function (data) {
    let errorvale = $scope.cierreSelected  == undefined || $scope.cierreSelected == null ||$scope.cierreSelected == ''||
    $scope.EvidenciaCierreFF == undefined  || $scope.EvidenciaArqueoCierreFF == undefined ? true : false;

if(errorvale)
{
swal('Alto', 'Para solicitar un el Cierre de Fondo Fijo debe adjuntar las evidencias y el tipo de cierre', 'warning');
return false;
}
sendData = 
{
id_perTra : $scope.id_perTra,
tipo : $scope.cierreSelected,
nombreArchivoComp: $scope.EvidenciaCierreFF.nombreArchivo.split('.')[0],
extensionArchivoComp: $scope.EvidenciaCierreFF.nombreArchivo.split('.')[1],
saveUrl: $scope.urlAD + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra,
archivoComp: $scope.EvidenciaCierreFF.archivo,
nombreArchivoArqueo: $scope.EvidenciaArqueoCierreFF.nombreArchivo.split('.')[0],
extensionArchivoArqueo: $scope.EvidenciaArqueoCierreFF.nombreArchivo.split('.')[1],
archivoArqueo: $scope.EvidenciaArqueoCierreFF.archivo,
}
swal({
title: '¿Deseas enviar el cierre del Fondo Fijo?',
text: 'Se enviara a Contraloria',
type: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Aceptar',
cancelButtonText: 'Cancelar',
closeOnConfirm: true,
closeOnCancel: true
},
function(isConfirm) {
if (isConfirm) {
$('#loading').modal('show');           
fondoFijoRepository.cierreFF(sendData).then((resf) => {
       if (resf.data[0].success == 1) {
       // $scope.sendNotificacionCierre();
       let link = global_settings.urlCORS + "aprobarFondoFijo?employee=69&idTramite=" + $scope.id_perTra;
       html = ` ${$scope.html1} Solicitud de Cierre de Fondo Fijo <br><br>Estimado ${$scope.nombreAutorizador} la solicitud de Fondo Fijo ${$scope.id_perTra}, Folio ${$scope.idFondoFijo} fue solicitado ${$scope.html2}
       <p><a href=' ${link} ' target="_blank">Revisar Tramite</a></p>`;
       $scope.sendCierreContraloria();
       $scope.sendMail($scope.correo, 'Cierre de Fondo Fijo', html);
       $scope.getDataBorrador(localStorage.getItem('id_perTra'));
       $('#loading').modal('hide');
       $location.path('/misTramites');
       }
       else{
        $('#loading').modal('hide');
        swal('Error', 'No se aplicaron los cambios', 'error');
       }
   });           
} else {
swal('Cancelado', 'No se aplicaron los cambios', 'error');
$('#loading').modal('hide');
}
});
}

$scope.sendNotificacionCierre = function () {
    //$('#loading').modal('show');         
    var tipoNot = 21;

    var notG = {
        "identificador": $scope.id_perTra,
        "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado el cierre del Fondo Fijo por la cantidad de $" + $scope.montoDisponible.toFixed(2) + " pesos.",
        "idSolicitante": $scope.user.usu_idusuario,
        "idTipoNotificacion": tipoNot,
        "linkBPRO": global_settings.urlCORS + "aprobarFondoFijo?employee=69&idTramite=" + $scope.id_perTra,
        "notAdjunto": "",
        "notAdjuntoTipo": "",
        "idEmpresa": $scope.dataCierre.idEmpresa,
        "idSucursal": $scope.dataCierre.idSucursal,
        "departamentoId": 0
    };
    clientesRepository.notGerente(notG).then(function (result) {
        if (result.data[0].success == true) {
            let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
            //$scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a aprobación a Corporativo', 1, 1);
            html = ` ${$scope.html1} Solicitud de Cierre de Fondo Fijo <br><br>Estimado ${$scope.nombreAutorizador} la solicitud de Fondo Fijo ${$scope.id_perTra}, Folio ${$scope.idFondoFijo} fue solicitado ${$scope.html2}
            <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Tramite</a></p>
            <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
            <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
            $scope.sendCierreContraloria();
            $scope.sendMail($scope.correo, 'Cierre de Fondo Fijo', html);
            $scope.getDataBorrador(localStorage.getItem('id_perTra'));
            $('#loading').modal('hide');
            $location.path('/misTramites');
        } else {
            swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
            $("#loading").modal("hide");
        }
    });
}
$scope.sendCierreContraloria = function () {
    aprobarFondoRepository.cierreContraloriaFF($scope.id_perTra).then(function (res) {
        if (res.data[0].success == 1) {
            console.log('Exito')
        } else {
            console.log('Fallo')
        }
    });
}

$scope.obtineCorreoNotificacion = function (tipoNot){
    aprobarDevRepository.getCorreoNotificacion(tipoNot).then((resp) => {     
        if(resp.data != undefined){
            if(tipoNot == 13)
            {
                $scope.correo = resp.data[0].email;
                $scope.nombreAutorizador = resp.data[0].nombreUsuarioMail;
            }
            if(tipoNot == 19)
            {
                $scope.CorreoFinanzas = resp.data[0].email;
            }
            if(tipoNot == 21)
            {
                $scope.correo = resp.data[0].email;
                $scope.nombreAutorizador = resp.data[0].nombreUsuarioMail;
            }
            if(tipoNot == 22)
            {
                $scope.CorreoFinanzas = resp.data[0].email;
            }
            
        }
    });
}

$scope.tipoAumentoDecremento =  function (tipo) {
    //$scope.getDocumentosAumentoDecremento();
    $scope.verDecremento = false;
    $scope.tomarVales = false;
    if(tipo == 1)
    {
        $scope.verDecremento = false;
    }
    else if(tipo == null || tipo == 0)
    {
        $scope.verDecremento = false;
    }
    else
    {
        $scope.verDecremento = true;
    } 
}


async function promiseInsertaDatos(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto,canal, id_perTra, banco, departamento) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.insertaPoliza(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento).then(function (result) {
            if (result.data.length > 0) {
                resolve(true);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function promiseInsertaDatosFront(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto,canal, id_perTra, banco, departamento) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.insertaPolizaFront(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento).then(function (result) {
            if (result.data.length > 0) {
                resolve(true);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function promiseInsertaDatosOrden(idempresa,idsucursal,proceso,foliofondo,venta,id_perTra) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.insertPolizaOrden(idempresa,idsucursal,proceso,foliofondo,venta,id_perTra).then(function (result) {
            if (result.data.length > 0) {
                if(result.data[0].Repuesta == 0)
                {  resolve(true);}
                else{resolve(false);}
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function verificaValesEvidencia(idVale) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.verificaValesEvidencia(idVale).then(function (result) {
            if (result.data != undefined) {
                resolve(result.data[0]);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function verificaVale(idempresa,idsucursal,idVale,montoComprobacion) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.verificaVale(idempresa,idsucursal,idVale,montoComprobacion).then(function (result) {
            if (result.data != undefined) {
                resolve(result.data[0]);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function ValidaRetenciones (idsucursal, tipoComprobante, areaAfectacion, conceptoContable) {
    return new Promise((resolve, reject) => {
    fondoFijoRepository.validaRetencionesOC(idsucursal, tipoComprobante, areaAfectacion, conceptoContable).then(function (result) {
        if (result.data.length > 0) {
            resolve(result.data);
        }
    });
});
}
async function obtieneCorreo() {
    var rol = 10;
    return new Promise((resolve, reject) => {
        fondoFijoRepository.obtieneCorreoFFAG(rol).then(function (result) {
            if (result.data != undefined) {
                resolve(result.data[0]);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function obtieneCorreoReembolso(idEmpresa, idSucursal) {

    return new Promise((resolve, reject) => {
        fondoFijoRepository.obtieneCorreoReembolso(idEmpresa, idSucursal).then(function (result) {
            if (result.data != undefined) {
                resolve(result.data[0]);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function guardaOrdenMasiva(sendData) {
    return new Promise((resolve, reject) => {
    fondoFijoRepository.insertOrdenMasiva(sendData).then(function (result) {
        if (result.data.length > 0) {
            resolve(result.data);
        }
        else
        {reject('Error')}
    });
});
}

function zeroDelete (item)
{
    var x = '';
    var values = item.split('-');
    values.forEach(f => {
        if(values[0] == f)
        {  var str = f;
            var res = str.split("0");
            res.forEach(t => {
                if(t != "")
                { x+= t}
             });
           }
        else
        {x+='-' +parseFloat(f).toFixed(0)}
     });

return x;
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
};

$scope.viewReembolsos = function (id) {
    $scope.tablaReembolso = 0;
    $scope.urlReembolso = ''
    $('#viewEvidenciaReembolso').find('object').remove();
    fondoFijoRepository.getReembolsosxfondo(id).then(res => {
        $scope.reembolsosFondo = []
        $scope.reembolsosFondo = res.data
        $scope.modalTitle = 'Reembolsos Fondo Fijo'
        $('#Reembolsos').DataTable().clear();
        $('#Reembolsos').DataTable().destroy();
        setTimeout(() => {
            $('#Reembolsos').DataTable({
                destroy: true,
                "responsive": true,
                searching: true,
                paging: true,
                autoFill: false,
                fixedColumns: true,
                pageLength: 5,
                "order": [[0, "asc"]],
                "language": {
                    search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    searchPlaceholder: 'Buscar',
                    oPaginate: {
                        sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                    }
                }
            });
            $('#Reembolsos_length').hide();
            $("#viewReembolsos").modal("show");
        })
    })
}

$scope.obtieneEvidenciasReembolsoTramite = function (id_perTra) {
    $scope.idTramiteReembolso = id_perTra;
    $scope.tablaReembolso = 1;
    $scope.urlReembolso = ''
    $('#viewEvidenciaReembolso').find('object').remove();
    fondoFijoRepository.obtieneEvidenciasReembolsoTramite(id_perTra).then((res) => {
        if (res.data.length > 0) {
            $scope.evidenciasReembolso = res.data;
            var sum = 0;
            $scope.evidenciasReembolso.forEach(t => {
                if(t.estatusReembolso == 0 || t.estatusReembolso == 1)
                { sum+= t.monto}   
             });
            $scope.montoReembolso =  sum.toFixed(2);    
        $('#tableEvidencias').DataTable().clear();
        $('#tableEvidencias').DataTable().destroy();
        setTimeout(() => {
            $('#tableEvidencias').DataTable({
                destroy: true,
                "responsive": true,
                searching: true,
                paging: true,
                autoFill: false,
                fixedColumns: true,
                pageLength: 5,
                "order": [[0, "asc"]],
                "language": {
                    search: '<i class="fa fa-search" aria-hidden="true"></i>',
                    searchPlaceholder: 'Buscar',
                    oPaginate: {
                        sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                        sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                    }
                }
            });
            $('#tableEvidencias_length').hide();
            $('#viewEvidenciaReembolso').find('object').remove();
        })
        } 
    });
}
$scope.cerrarReembolso = function(){
    $scope.tablaReembolso = 0;  
    $scope.urlReembolso = ''
}

$scope.verEvidenciaReembolso = function (url) {
    if (url === undefined) {
        swal('Aviso', 'Por el momento no es posible abrir el archivo de vale solicitado, favor de intentra mas tarde', 'warning')
    } else {
        $scope.urlReembolso = ''
        $('#viewEvidenciaReembolso').find('object').remove();
        $scope.urlReembolso = url;
        $("<object class='lineaCaptura' data='" + $scope.urlReembolso + "' width='100%' height='550px' >").appendTo('#viewEvidenciaReembolso');
    }
}

$scope.cerrarEvidenciaReembolso = function(){
    $scope.urlReembolso = ''
    $('#viewEvidenciaReembolso').find('object').remove();
}

});