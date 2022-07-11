registrationModule.controller('reembolsoFondoFijoController', function ($scope, $routeParams, $rootScope, $location, localStorageService, aprobarFondoRepository,fondoFijoRepository,clientesRepository, aprobarDevRepository,devolucionesRepository, aprobarRepository, ordenDePagoFFAGRepository) {
    $scope.areaUser;
    $scope.activarAprobar = true;
    $scope.razonesRechazo = '';  
    $scope.razonesRechazoEvi = '';
    $scope.verReembolsoFinanzas = false;
    $scope.verBancos = false;
    $scope.botonReembolso = true;
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";
    $scope.init = () => {
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        
        if(getParameterByName('Tramite') != '' && getParameterByName('idReembolso') != '')
        {
            $scope.traerAutorizadores();
            $scope.id_perTra = getParameterByName('Tramite');
            $scope.getDataBorradorReembolso($scope.id_perTra);
            $scope.tipoUsuario = getParameterByName('tipoUsuario');
            $scope.idReembolso = getParameterByName('idReembolso');
            $scope.verReembolsoFinanzas = true;
            $scope.obtenerTipoUsuarioFondoFijoXSucursalTipo($scope.tipoUsuario, $scope.id_perTra );
        }
        else {
            $scope.idRol =  $rootScope.user.idRol;
            $scope.traerAutorizadores();
            //$scope.obtenerTipoUsuarioFF($rootScope.user.usu_idusuario,5);
            //$scope.obtenerTipoUsuarioFondoFijo($rootScope.user.usu_idusuario);
            $scope.id_perTra = localStorage.getItem('id_perTra')
            $scope.obtenerTipoUsuarioFondoFijoXSucursal($rootScope.user.usu_idusuario, $scope.id_perTra);
             $scope.getDocumentosAprobar($scope.id_perTra);
             $scope.getActivarAprobarTramite();
             $scope.getParamNotificacion();
            $scope.getDataBorradorReembolso($scope.id_perTra);
        }
    };
  
    $scope.getDataBorradorReembolso = function(id_perTra) {
        fondoFijoRepository.dataBorradorReembolso(id_perTra).then((res) => {   
        $scope.idUsuario = res.data[0].idResponsable;
        $scope.titleAprobar = 'Fondo No. ' + id_perTra;
         $scope.idFondoFijo = res.data[0].idFondoFijo;
         $scope.traEstatus = res.data[0].id_estatus;
         $scope.traEstatus == 3 ? $scope.estatusFondoFijo = 0 : $scope.estatusFondoFijo = res.data[0].esDe_IdEstatus;
         $scope.departamentosArea = res.data[0].departamentoAreas;
         $scope.traeEmpresas();
          $scope.empresa = res.data[0].idEmpresa;
          $scope.autorizador = res.data[0].idAutorizador;
          $scope.idEmpresa = $scope.empresa.emp_idempresa;
          if($scope.empresa == 12 ||$scope.empresa == 16 || $scope.empresa == 17 || $scope.empresa == 18)
          {
            $scope.tipoSalida = [{ id:1, text:'Orden de Pago'}]
            $scope.tipoSalidaReebolso = [{ id:1, text:'Orden de Pago'}]
          }
          else
          {   
            $scope.tipoSalida = [{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]
            $scope.tipoSalidaReebolso = [{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]
          }
          $scope.nombreEmpresa = $scope.empresa.emp_nombre;
          $scope.solicitante = res.data[0].solicitante;
          $scope.correoCajero = res.data[0].correoCajero;
          $scope.traeSucursales();
          $scope.monto = res.data[0].monto;
          $scope.sucursal =  res.data[0].idSucursal;
          $scope.getImagesBorrador($scope.id_perTra);
          $scope.traeDepartamentos();
          $scope.descripcion = res.data[0].descripcion;
          $scope.departamento = res.data[0].idDepartamento
          $scope.montoAD =  res.data[0].montoCambiado;
          $scope.openWizard();
          $scope.asunto = res.data[0].asunto;
          $scope.dep_nombrecto =  res.data[0].dep_nombrecto;
          $scope.ADFF = res.data[0].aumentodisminucion;
          $scope.idPersona =  res.data[0].PER_IDPERSONA
          $scope.aumentodisminucion = res.data[0].aumentodisminucion == 1 ? 'Aumento': 'Disminución';
          $scope.traeBancos();
          $scope.correoTesoreria = res.data[0].correoTesoreria;
          $scope.correoTesoreria2 = res.data[0].correoTesoreria2;
          $scope.Autorizado = res.data[0].Autorizado;
          $scope.cuentaContable = res.data[0].cuentaContable;
          $scope.tieneRemboolso = true;
          $scope.verRemboolso =  true;
          $scope.estatusFondoFijoCierre =res.data[0].estatusFondoFijo;
          $scope.montoDisponible = res.data[0].montoDisponible;
          $scope.tipoCierre  = res.data[0].tipoCierre;
          $scope.comprobanteCierre = res.data[0].comprobanteCierre;
          $scope.arqueoCierre = res.data[0].arqueoCierre;
          $scope.urlSave= res.data[0].urlSave;
          $scope.idAumentoDecremento = res.data[0].idAumentoDecremento;
          if($scope.verRemboolso)
          {
              $scope.obtieneEvidenciasReembolsoTramite();
              //$scope.obtieneReembolso();
          }
          $scope.obtieneVales();
          $scope.obtineCorreoNotificacion(13);
          $scope.obtieneEstatusReembolso();
          $scope.obtieneBancosReembolso();
        });
    }

    $scope.obtieneBancosReembolso = function () {  
        fondoFijoRepository.getReembolsoBancos($scope.id_perTra).then((res) => {
            if (res.data[0][0].estatus == 1) {
                $scope.verBancos = true;
                $scope.infoBancos = res.data[1][0];
                $scope.getComprobanteTramiteR($scope.infoBancos.id_perTra , $scope.infoBancos.idReembolso);

            } 
        });
    }

    $scope.getComprobanteTramiteR = (id_perTra, idReembolso) => {
        ordenDePagoFFAGRepository.imageComprobante(id_perTra, 10, 'FR', idReembolso).then((res)=>{
            $scope.documento = res.data[0];
        });
    };

    $scope.obtieneVales = function () {  
        aprobarFondoRepository.polizasCompFFGV($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.vales = res.data;
                $scope.verPoliza = $scope.vales.length > 0 ? true : false;
            } 
        });
    }

    $scope.obtieneEstatusReembolso = function () {  
        aprobarFondoRepository.estatusReembolso($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.estatusReembolsoFinanzas = res.data[0].estatusfinanzas;         
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
                if(tipoNot == 22)
                {
                    $scope.CorreoFinanzas = resp.data[0].email;
                }
            }
        });
    }

    $scope.obtieneReembolso = function () {
        aprobarFondoRepository.obtieneReembolso($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.evidenciasReembolsos = res.data;
            } 
        });
    }

    $scope.obtieneEvidenciasReembolsoTramite = function () {
        fondoFijoRepository.obtieneEvidenciasReembolsoTramite($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.evidenciasReembolso = res.data;
                var sum = 0;
                $scope.evidenciasReembolso.forEach(t => {
                    if(t.estatusReembolso == 0 || t.estatusReembolso == 1)
                    { sum+= t.monto}   
                    $scope.verSalidaReembolso = t.estatusPerTraReembolso
                 });
                $scope.montoReembolso =  sum.toFixed(2);
                $scope.evidenciasReembolsoHistorico = res.data[1];
                //$scope.verHistorico = $scope.evidenciasReembolsoHistorico.length > 0 ? true : false;
            } 
        });
    }

    $scope.aprobacionSalidaEfectivo = function () {
        $scope.traeBancos();
        $scope.tipoSalida = [{ id:1, text:'Orden de Pago'},{ id:2, text:'Caja'}]
        $("#modalSalidaEfectivo").modal("show");
    };

    $scope.verImagenModalVale = function(item) {
        if(item.tipoEvidencia == 'pdf')
        {$scope.verPdfVale(item)}
        else
        {
        $scope.modalTitle = 'Evidencia';
        $scope.comentario = item.comentario;
        $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
        $scope.verImagen = item.urlEvidencia;
        $("#mostrarImagen").modal("show");
    }
    }

    $scope.verPdfVale = function(item) {

        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = 'Evidencia';
        $scope.comentario = item.comentario;
        $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
        var pdf = item.urlEvidencia;

        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        if(!isMobile.any() ) { //check if it is not mobile
                    //$("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        //$("#mostrarPdf").modal("show");
        //$('#pdfReferenceContent object').remove();
        //$scope.modalTitle = doc.doc_nomDocumento;
            $("#mostrarPdf").modal("show");
            //var pdf = doc.url;
            $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='500px' <iframe src='https://docs.google.com/viewer?url=" + pdf + "'&embedded=true' > >").appendTo('#pdfReferenceContent');
            $('#mostrarPdf').insertAfter($('body'));
        }else{
            window.open(`https://docs.google.com/viewerng/viewer?url=${pdf}`,'_self');
            
        }





    }
   
    $scope.openWizard = function () {
        fondoFijoRepository.estatusFondoFijo(1).then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusFondoFijo = res.data;
            } else {
                swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
            }
        });
    }
  $scope.traeEmpresas = function () {
    aprobarDevRepository.allEmpresas().then((res) => {
        $scope.empresas = res.data;
    });
};
  $scope.traerAutorizadores=function(){
    fondoFijoRepository.getAutorizadoresFondoFijo(1, $scope.idUsuario).then(function successCallback(response) {
      $scope.autorizadores = response.data
  }, function errorCallback(response) {
  });
  }

  $scope.traeSucursales=function(){    
    $scope.idEmpresa = $scope.empresa;
    fondoFijoRepository.getSucursales($scope.idEmpresa).then(function successCallback(response) {
      $scope.sucursales = response.data;
  }, function errorCallback(response) {
  });
  }


  $scope.traeDepartamentos=function(){
    $scope.idSucursal=$scope.sucursal
    if($scope.departamentosArea == 1)
    {
     //Departamentos Area
     fondoFijoRepository.getDepartamentosAreaFF($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
      $scope.departamentos = response.data;
      //$scope.traeCuentasContables($scope.idEmpresa, $scope.idSucursal);
    }, function errorCallback(response) {
  });
    }
    else
    {
    fondoFijoRepository.getDepartamentos($scope.idEmpresa, $scope.idSucursal).then(function successCallback(response) {
      $scope.departamentos = response.data;
      //$scope.traeCuentasContables($scope.idEmpresa, $scope.idSucursal);
  }, function errorCallback(response) {
  });
    }
  }

  $scope.getImagesBorrador = function(id_perTra) {
    fondoFijoRepository.imageBorrador(
            id_perTra)
        .then((res) => {
            $scope.documentos = res.data;
        });
}

$scope.modalComentarios = function (doc) {
    $scope.nombreDocumento = doc.doc_nomDocumento;
    $scope.sendDetIdPerTra = doc.det_idPerTra;
    $scope.id_documento = doc.id_documento;
    $("#rechazarDoc").modal("show");
};

$scope.cancelRechazo = function () {
    $("#rechazarDoc").modal("hide");
    $scope.razonesRechazo = '';
}

$scope.modalComentariosEvidencia = function (doc) {
    $scope.razonesRechazoEvi = '';
    $scope.idComprobacion = doc.idComprobacion;
    $("#rechazarDocEvidencia").modal("show");
};

$scope.cancelRechazoEvidencia = function () {
    $("#rechazarDocEvidencia").modal("hide");
    $scope.razonesRechazoEvi = '';
}

$scope.backDashboard = function () {
    $location.path('/home');
    window.history.replaceState({}, document.title, $location.path('/home')); 
}

$scope.aprobarRechazarTramite = function (estatus) {
    var aproRech = estatus == 2 ? ' Aprobar ' : ' Rechazar '
    swal({
        title: '¿Estas seguro de' + aproRech + 'el trámite?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: estatus == 2 ? 'Aprobar' : 'Rechazar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                if (estatus == 2) {
                    $scope.sendNotificacion();
                } else {
                    //$("#loading").modal("show");
                    aprobarFondoRepository.aprobarRechazarTramite(localStorage.getItem('id_perTra'), estatus, $scope.observacionesDelTramite).then((res) => {
                        if (res.data[0].success == 1) {
                            $scope.getDataBorrador(localStorage.getItem('id_perTra'));
                            $("#loading").modal("hide");
                            $location.path('/home');
                            estatus == 2 ? swal('Listo', 'Se aprobo con éxito el trámite', 'success') : swal('Listo', 'Se rechazo con éxito el trámite', 'success')
                           
                        } else {
                            $("#loading").modal("hide");
                            estatus == 2 ? swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning') : swal('Alto', 'No se pudo rechazar el trámite intentalo mas tarde', 'warning')
                        }
                    });
                }
            } else {
                swal(
                    'Cancelado',
                    'No se cancelo la acción',
                    'error'
                );
            }
        });
}


$scope.aprobarRechazarTramiteAD = function (estatus) {
    var aproRech = estatus == 2 ? ' Aprobar ' : ' Rechazar '
    swal({
        title: '¿Estas seguro de' + aproRech + 'el trámite?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: estatus == 2 ? 'Aprobar' : 'Rechazar',
        cancelButtonText: 'Cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                if (estatus == 2) {
                    $scope.sendNotificacionAD();
                } else {
                    //$("#loading").modal("show");
                    aprobarFondoRepository.aprobarRechazarTramiteAD(localStorage.getItem('id_perTra'), estatus, $scope.observacionesDelTramite).then((res) => {
                        if (res.data[0].success == 1) {
                            $scope.getDataBorrador(localStorage.getItem('id_perTra'));
                            $("#loading").modal("hide");
                            estatus == 2 ? swal('Listo', 'Se aprobo con éxito el trámite', 'success') : swal('Listo', 'Se rechazo con éxito el trámite', 'success')
                            $location.path('/home');
                        } else {
                            $("#loading").modal("hide");
                            estatus == 2 ? swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning') : swal('Alto', 'No se pudo rechazar el trámite intentalo mas tarde', 'warning')
                        }
                    });
                }
            } else {
                swal(
                    'Cancelado',
                    'No se cancelo la acción',
                    'error'
                );
            }
        });
}


$scope.sendAprobar = function () {
    fondoFijoRepository.aprobarFF($scope.id_perTra).then(function (res) {
        if (res.data[0].success == 1) {
            console.log('Exito')
        } else {
            console.log('Fallo')
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

$scope.sendCierreFF = function () {
    aprobarFondoRepository.cierreFF($scope.id_perTra).then(function (res) {
        if (res.data[0].success == 1) {
            console.log('Exito')
        } else {
            console.log('Fallo')
        }
    });
}

$scope.aprobarGerente = function () {
    $('#loading').modal('show');
    aprobarDevRepository.updateEstatusSendAutorizar($scope.id_perTra, 1, 1).then((res) => {
        if (res.data[0].success == 1) {
            $('#loading').modal('hide');
            swal('Listo', res.data[0].msg, 'success');
            $scope.init();
        } else {
            swal('Alto', 'Ocurrio un error intentalo mas tarde.', 'warning');
        }
    });
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
    //$("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
    //$("#mostrarPdf").modal("show");

    $("#mostrarPdf").modal("show");
    //var pdf = doc.url;
    $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='500px' >").appendTo('#pdfReferenceContent');
    $('#mostrarPdf').insertAfter($('body'));
}

$scope.verComprobante = function(documento) {
    let extension = documento.split('.')[1];
    data = {
        "comentario": '',
        "estatusReembolso": 1,
        "urlEvidencia": $scope.urlSave + 'FondoFijo/FondoFijo_' +$scope.id_perTra + '/' + documento
    }
 
    if(extension == 'pdf')
    {$scope.verPdfVale(data)}
    else
    {
    $scope.modalTitle = 'Evidencia';
    $scope.comentario = data.comentario;
    $scope.verComentarios = data.estatusReembolso == 2 ? true : false;
    $scope.verImagen = data.urlEvidencia;
    $("#mostrarImagen").modal("show");
    }
}

$scope.verComprobanteAD = function(tipo, id) {
    var documento = '';
    if(tipo == 1)
    {
        documento = 'DocumentoAD_' + id + '.pdf';
    }
    else if(tipo == 2)
    {
        documento = 'CartaResponsiva_' + id + '.pdf';
    }
    else
    {
        documento = 'Pagare_' + id + '.pdf';
    }
    data = {
        "comentario": '',
        "estatusReembolso": 1,
        "urlEvidencia": $scope.urlSave + 'FondoFijo/FondoFijo_' +$scope.id_perTra + '/' + documento
    }
 
    $scope.verPdfVale(data)
}

$scope.aprobarDocumento = function (documento) {
    $("#loading").modal("show");
    aprobarRepository.aprobarDocumento(documento.det_idPerTra).then((res) => {
        if (res.data[0].success == 1) {
            $("#loading").modal("hide");
            $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, $scope.id_perTra, 0, 'Se aprobo el documento con det_idPerTra ' +documento.det_idPerTra, 1, 0);
            $scope.getDocumentosAprobar($scope.id_perTra);
            $scope.getImagesBorrador($scope.id_perTra);
            $scope.getActivarAprobarTramite();
            swal('Listo', 'Se aprobo el documento', 'success');
        } else {
            $("#loading").modal("hide");
            swal('Alto', 'Ocurrio un error al aprobar el documento intentelo mas tarde', 'warning');
        }
    });
}

$scope.getActivarAprobarTramite = function () {
    aprobarRepository.activarAprobarTramite(localStorage.getItem('id_perTra')).then(function (res) {
        if (res.data[0].success == 1) {
            $scope.activarAprobar = false;
        } else {
            $scope.activarAprobar = true;
        }
    });
}

$scope.sendRechazo = function () {
    if ($scope.razonesRechazo == '') {
        swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
    } else {
        $("#rechazarDoc").modal("hide");
        $("#loading").modal("show");
        aprobarRepository.rechazarDocumento($scope.sendDetIdPerTra, $scope.razonesRechazo, $scope.id_perTra, $scope.id_documento).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, $scope.id_perTra, 0, 'Se rechazo el documento con det_idPerTra ' +$scope.id_documento, 1, 0);
                $scope.getDocumentosAprobar($scope.id_perTra);
                $scope.getImagesBorrador($scope.id_perTra);
              
                let bodyUsuFondo = 
                '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                '<p>Estimado usuario, '+  $scope.solicitante   +', se rechazo el siguiente documento. </p>' +
                '<p>Solicitud de Fondo Fijo: '+ $scope.id_perTra +' </p>' +
                '<p>Folio Fondo Fijo: ' +  $scope.idFondoFijo +'</p>' +
                '<p>Documento: ' + $scope.nombreDocumento  +'</p>' +
                '<p>Motivo: ' +  $scope.razonesRechazo +'</p>';      
                $scope.sendMail($scope.correoCajero, 'Rechazo de Documento de Fondo Fijo ' + $scope.id_perTra, bodyUsuFondo);
                $scope.razonesRechazo = '';
                $scope.sendDetIdPerTra = 0;
                $scope.getActivarAprobarTramite();
                swal('Listo', res.data[0].msg, 'success');
            } else {
                $scope.sendDetIdPerTra = 0;
                $("#loading").modal("hide");
                swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
            }
        });
    }
}

$scope.sendRechazoEvidencia = function () {
    if ($scope.razonesRechazoEvi == '') {
        swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
    } else {
        $("#rechazarDocEvidencia").modal("hide");
        $("#loading").modal("show");
        aprobarFondoRepository.rechazarEvidencia($scope.razonesRechazoEvi, $scope.idComprobacion).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, $scope.id_perTra, 0, 'Se rechazo la evidencia con id evididenciaComprobacion ' +$scope.idComprobacion, 1, 0);
                $scope.obtieneEvidenciasReembolsoTramite();
                $scope.razonesRechazo = '';
                let bodyUsuFondo = 
                '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                '<p>Estimado usuario, '+ res.data[0].usuFondo +', se rechazo la siguiente Evidencia de Vale. </p>' +
                '<p>Solicitud de Fondo Fijo: '+ $scope.id_perTra  +' </p>' +
                '<p>Folio Fondo Fijo: ' +  res.data[0].idFondoFijo +'</p>' +
                '<p>Folio Vale: ' +  res.data[0].idVale +'</p>' +
                '<p>Folio Comprobación Vale: ' +  res.data[0].idComprobacionVale +'</p>' +
                '<p>Cantidad: $'+  res.data[0].monto   + '</p>' + 
                '<p>Nota: Cuenta con 48 hrs naturales para corregir el rechazo de finanzas, de lo contrario esta comprobación se rechazara y pasara a descuento de nomina directamente.</p>';     
                $scope.sendMail(res.data[0].correoFondo, 'Rechazo de Comprobación Vale de Fondo Fijo ' + $scope.id_perTra , bodyUsuFondo);
                let bodyUsuVale = 
                '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
                '<p>Estimado usuario, '+ res.data[0].usuVale +', se rechazo la siguiente Evidencia de Vale. </p>' +
                '<p>Solicitud de Fondo Fijo: '+ $scope.id_perTra  +' </p>' +
                '<p>Folio Fondo Fijo: ' +  res.data[0].idFondoFijo +'</p>' +
                '<p>Folio Vale: ' +  res.data[0].idVale +'</p>' +
                '<p>Folio Comprobación Vale: ' +  res.data[0].idComprobacionVale +'</p>' +
                '<p>Cantidad: $'+  res.data[0].monto   + '</p>' + 
                '<p>Nota: Cuenta con 48 hrs naturales para corregir el rechazo de finanzas, de lo contrario esta comprobación se rechazara y pasara a descuento de nomina directamente.</p>';       
                $scope.sendMail(res.data[0].correoVale, 'Rechazo de Comprobación Vale de Fondo Fijo ' + $scope.id_perTra, bodyUsuVale);


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
            $scope.guardarBitacoraCorreo($scope.id_perTra, 'Fondo Fijo', to, subject, html, 1, '' );
        } else {
            console.log('Ocuerrio un error al emviar el correo "( ')
            $scope.guardarBitacoraCorreo($scope.id_perTra, 'Fondo Fijo', to, subject, html, 0, res.data.result.error );
        }
    });
};

$scope.getParamNotificacion = function () {
    aprobarDevRepository.paramNotificacion().then((res) => {
        $scope.amountNontificaciones = parseInt(res.data[0].pr_descripcion);
    });
}

$scope.getDocumentosAprobar = function (idPerTra) {
    aprobarDevRepository.documentosAprobar(idPerTra).then((res) => {
        $scope.aprobarDocs = res.data;
    });
}

$scope.SeleccionaTipo = function (tipo) {
    $scope.verBotonSalida = true;
    $scope.bancosObtenidos =  $scope.bancosObtenidos === undefined ?  [...$scope.bancos] : $scope.bancosObtenidos
    if(tipo == 1)
    {
        $scope.bancos = $scope.bancos.filter(x => x.Nombre.indexOf('BANCOMER')>-1);
        $scope.verOrdenPago = true;
        $scope.verCaja = false;
    }
    else if(tipo == null ||tipo == 0)
    {
        $scope.bancos = $scope.bancosObtenidos
        $scope.verOrdenPago = false;
        $scope.verCaja = false;
        $scope.verBotonSalida = false;
    }
    else
    {
        $scope.bancos = $scope.bancosObtenidos
        $scope.verOrdenPago = false;
        $scope.verCaja = true;
    }
}
$scope.SeleccionaTipoR = function (tipo) {
    $scope.verBotonReembolso = true;
    $scope.bancosObtenidos =  $scope.bancosObtenidos === undefined ?  [...$scope.bancos] : $scope.bancosObtenidos

    if(tipo == 1)
    {
        $scope.bancos = $scope.bancos.filter(x => x.Nombre.indexOf('BANCOMER')>-1);
        $scope.verOrdenPagoR = true;
        $scope.verCajaR = false;
    }
    else if(tipo == null || tipo == 0)
    {
        $scope.bancos = $scope.bancosObtenidos
        $scope.verOrdenPagoR = false;
        $scope.verCajaR = false;
        $scope.verBotonReembolso = false;
    }
    else
    {
        $scope.bancos = $scope.bancosObtenidos
        $scope.verOrdenPagoR = false;
        $scope.verCajaR = true;
    }
}

$scope.SeleccionaTipoV = function (tipo) {
    $scope.verBotonVale = true;
    if(tipo == 1)
    {
        $scope.verOrdenPagoV = true;
        $scope.verCajaV = false;
    }
    else if(tipo == null || tipo == 0)
    {
        $scope.verOrdenPagoV = false;
        $scope.verCajaV = false;
        $scope.verBotonVale = false;
    }
    else
    {
        $scope.verOrdenPagoV = false;
        $scope.verCajaV = true;
    }
}

$scope.traeBancos = function(){
    fondoFijoRepository.getBancos($scope.idEmpresa,$scope.sucursal).then(function successCallback(response) {
      $scope.bancos = response.data;
  }, function errorCallback(response) {
  });
  }



$scope.guardarReembolso = function (tipo,bancoSalida,bancoEntrada,estatus) {
    var tipoProceso = true;
    var idTramiteTesoreria = 0;
    if(tipo == 1)
    {
        if(bancoSalida == null || bancoSalida == undefined)
        {
            swal('Atencion', 'No se selecciono el Banco Salida', 'warning');
            tipoProceso = false;
        }
    }
    else
    {
        if((bancoSalida == null || bancoSalida == undefined) && (bancoEntrada == null || bancoEntrada == undefined))
        {
            if(bancoSalida == null || bancoSalida == undefined)
            { swal('Atencion', 'No se selecciono el Banco Salida', 'warning');}
            else if (bancoEntrada == null || bancoEntrada == undefined)
            {swal('Atencion', 'No se selecciono el Banco Entrada', 'warning');}
            else {swal('Atencion', 'No se seleccionaron los Bancos', 'warning');}
            tipoProceso = false;
        }
    }
    if(tipoProceso)
    {
        swal({
            title: 'El Reembolso se avanzara.',
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
    fondoFijoRepository.guardarReembolsoTramite($scope.id_perTra,tipo,bancoSalida == undefined ? 0 : bancoSalida.IdBanco,bancoEntrada == undefined ? 0 :bancoEntrada.IdBanco,estatus,bancoSalida == undefined ? '' : bancoSalida.numeroCuenta, bancoSalida == undefined ? '' : bancoSalida.cuentaContable, bancoEntrada == undefined ? '' : bancoEntrada.numeroCuenta, bancoEntrada == undefined ? '' : bancoEntrada.cuentaContable, idTramiteTesoreria).then((res) => {
       if(res.data[0].success == 1)
       {
        var link = global_settings.urlCORS + "reembolsoFondoFijo?employee=63&idReembolso="+ res.data[0].idReembolso +"&Tramite=" + $scope.id_perTra + "&tipoUsuario=" + res.data[0].tipoUsuario;
        html = ` ${$scope.html1} Solicitud de Revisión para Reembolso de Fondo Fijo <br><br>La solicitud de Fondo Fijo ${$scope.id_perTra}, Folio ${$scope.idFondoFijo} fue solicitada ${$scope.html2}
        <p><a href=' ${link} ' target="_blank">Revisar Tramite</a></p>`;
        
        $scope.sendNotificacionF2(link);
        $scope.sendMail(res.data[0].correo, res.data[0].asunto, html);

        $('#loading').modal('hide');
        $location.path('/home');
       }
       else
       {
        $('#loading').modal('hide');
       }
       
    });
    } else {
    swal(
        'Cancelado',
        'No se cancelo la acción',
        'error'
    );
}
});

    }
}

$scope.guardarReembolso2 = function () {
    swal({
        title: 'El Reembolso se avanzara.',
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
                    fondoFijoRepository.avanzarReembolsoTramite($scope.id_perTra, $scope.idReembolso, $scope.tipoUsuario, 0).then((res) => {
                        if (res.data[0].success == 1) {
                            var ruta =  global_settings.urlCORS + "reembolsoFondoFijo?employee=63&idReembolso="+ res.data[0].idReembolso +"&Tramite=" + $scope.id_perTra + "&tipoUsuario=" + $scope.tipoUsuario;
                            var link = global_settings.urlCORS + "reembolsoFondoFijo?employee=63&idReembolso="+ res.data[0].idReembolso +"&Tramite=" + $scope.id_perTra + "&tipoUsuario=" + res.data[0].tipoUsuario;
                            html = ` ${$scope.html1} Solicitud de Revisión para Reembolso de Fondo Fijo <br><br>La solicitud de Fondo Fijo ${$scope.id_perTra}, Folio ${$scope.idFondoFijo} fue solicitada ${$scope.html2}
                            <p><a href=' ${link} ' target="_blank">Revisar Tramite</a></p>`;
                            $scope.sendNotificacionF3(link);
                            $scope.sendMail(res.data[0].correo, res.data[0].asunto, html);
                            $('#loading').modal('hide');
                            //window.history.replaceState({}, document.title, $location.path('/home')); 
                            //$location.path(ruta);
                            $scope.init(); 
                        } else {
                            $("#loading").modal("hide");
                            swal('Alto', 'Ocurrio un error intentalo mas tarde', 'warning') 
                        }
                    });
                
            } else {
                swal(
                    'Cancelado',
                    'No se cancelo la acción',
                    'error'
                );
            }
        });
}

$scope.guardarReembolso3 = async function () {
   
    swal({
        title: 'El Reembolso se enviara a Tesoreria.',
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
                $scope.botonReembolso = false;
                    fondoFijoRepository.avanzarReembolsoTramite($scope.id_perTra, $scope.idReembolso, $scope.tipoUsuario, $scope.montoReembolso).then( async (res) => {
                        if (res.data[0].success == 1) {
							if(res.data[0].tipo == 1)
							{
                                $scope.idReembolso = res.data[0].idReembolso;
                                let razonSocial = $scope.empresas.filter(x => x.emp_idempresa === $scope.empresa)[0].emp_nombre;
                                let sucuarsalSelected = $scope.sucursales.filter(x=>x.idSucursal === $scope.sucursal)[0].nombre;
							 let body = 
							'<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
							'<p>Se solicito el siguiente Fondo Fijo por Orden de Pago en '+razonSocial+' sucursal '+sucuarsalSelected+'</p>' +
							'<p>Solicitud de Fondo Fijo: '+ $scope.id_perTra + ', Folio ' +  $scope.idFondoFijo +'</p>' +
                            '<p>Empresa: '+ res.data[0].emp_nombre+ '</p>' +
                            '<p>Banco Salida</p>' +
							'<p>Banco: '+ res.data[0].bsNombre+ '</p>' +
							'<p>Número Cuenta: '+ res.data[0].bsNumeroCuenta+ '</p>'+
							'<p>Cantidad: $'+ formatMoney($scope.montoReembolso)  + '</p>';   
							$scope.sendMail($scope.correoTesoreria, 'Reembolso de Efectivo por Orden de Pago, Fondo Fijo ' + $scope.idFondoFijo, body); 
							}							
                            else
                            {
                                $scope.idReembolso = res.data[0].idReembolso;
                                let transferencia = await promiseTransferencia(res.data[0].id_empresa, res.data[0].id_sucursal, res.data[0].bsCuentaContable, res.data[0].beCuentaContable, $scope.montoReembolso, $scope.idUsuario);
                                let saveTransferencia = await promisesaveTransferencia($scope.idUsuario, 13, transferencia[0].folio);
                                $scope.actualizaTramiteReembolso($scope.idReembolso, saveTransferencia[0].idTramite);
                                idTramiteTesoreria = saveTransferencia[0].idTramite;
                                let html1= ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                                <div>
                                    <p>Solicitud de transferencia bancaria</p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de tramite:</span></td>
                                                <td>${saveTransferencia[0].idTramite}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                                <td>${transferencia[0].Empresa}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Origen:</span></td>
                                                <td>${res.data[0].bsNombre} - ${res.data[0].bsNumeroCuenta}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">CLABE Origen:</span></td>
                                                <td> ${res.data[0].bsCuentaClabe}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                                                <td>${res.data[0].beNombre} - ${res.data[0].beNumeroCuenta}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">CLABE Destino:</span></td>
                                                <td> ${res.data[0].beCuentaClabe}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                                <td>${transferencia[0].Usuario}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                                                <td>$${formatMoney($scope.montoReembolso)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>`;
                        
                                let html2= ` <div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                                <div>
                                    <p>Estimado usuario, le informamos que <strong>el sistema de fondo fijos</strong> a generado una transferencia interbancaria:</p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center;" colspan="2"><strong>Datos de la transferencia</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">N&uacute;mero de tramite:</span></td>
                                                <td>${saveTransferencia[0].idTramite}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Empresa:</span></td>
                                                <td>${transferencia[0].Empresa}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Origen:</span></td>
                                                <td>${res.data[0].bsNombre} - ${res.data[0].bsNumeroCuenta}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">CLABE Origen:</span></td>
                                                <td> ${res.data[0].bsCuentaClabe}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Cuenta Destino:</span></td>
                                                <td>${res.data[0].beNombre} - ${res.data[0].beNumeroCuenta}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">CLABE Destino:</span></td>
                                                <td> ${res.data[0].beCuentaClabe}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                                <td>${transferencia[0].Usuario}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><span style="color: #ff0000;">Monto Transferencia:</span></td>
                                                <td>$${formatMoney($scope.montoReembolso)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>`;
                                $scope.sendMail($scope.correoTesoreria, 'Salida de Efectivo por Caja, Fondo Fijo ', html1);
                                $scope.sendMail($scope.correoTesoreria2, 'Salida de Efectivo por Caja, Fondo Fijo ', html2);
                            } 
                            $('#loading').modal('hide');
                            //window.history.replaceState({}, document.title, $location.path('/home')); 
                            //$location.path('/home');
                            $scope.init();  
                        } 
                        else if(res.data[0].success == 2)
                        {
                            $("#loading").modal("hide");
                            swal('Alto', 'Este tramite ya se encuentra en Tesoreria.', 'warning')  
                        } 
                        else {
                            $("#loading").modal("hide");
                            swal('Alto', 'Ocurrio un error intentalo mas tarde', 'warning') 
                        }
                    });
                
            } else {
                swal(
                    'Cancelado',
                    'No se cancelo la acción',
                    'error'
                );
            }
        });  
}


$scope.actualizaTramiteReembolso = function (idReembolso, idTramite) {
    aprobarFondoRepository.actualizaTramiteReembolso(idReembolso, idTramite).then(function (res) {
        if (res.data[0].success == 1) {
            console.log('Exito')
        } else {
            console.log('Fallo')
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

$scope.guardarBitacoraCorreo = function ( id_perTra, proceso, destinatarios, encabezado, cuerpo, enviado, comentario) {
    dataSave = {
        id_perTra: id_perTra,
        proceso : proceso,
        destinatarios : destinatarios,
        encabezado : encabezado,
        cuerpo : cuerpo,
        enviado : enviado,
        comentario : comentario
       }
    fondoFijoRepository.saveBitCorreo(dataSave).then((res) => {
    });
}

$scope.obtenerTipoUsuarioFF = function (idUsuario,tipo) {
fondoFijoRepository.getTipoUsuario(idUsuario,tipo).then(function successCallback(response) {
    $scope.tipoUsuario = response.data[0].tipoUsuarioFF;
  }, function errorCallback(response) {
  });
}

$scope.obtenerTipoUsuarioFondoFijo = function (idUsuario) {
    fondoFijoRepository.getTipoUsuarioFondoFijo(idUsuario).then(function successCallback(response) {
        $scope.tipoUsuario = response.data[0].tipoUsuarioFF;
      }, function errorCallback(response) {
      });
    }

    $scope.obtenerTipoUsuarioFondoFijoXSucursal = function (idUsuario,id_perta) {
        fondoFijoRepository.getTipoUsuarioFondoFijoXSucursal(idUsuario, id_perta).then(function successCallback(response) {
            $scope.tipoUsuario = response.data[0].tipoUsuarioFF;
            $scope.usuarioFinanzas = response.data[0].usuarioFinanzas;
            $scope.idusuarioFinanzas = response.data[0].idUsuario;
          }, function errorCallback(response) {
          });
        }

        $scope.obtenerTipoUsuarioFondoFijoXSucursalTipo = function (tipo,id_perta) {
            fondoFijoRepository.getTipoUsuarioFondoFijoXSucursalTipo(tipo, id_perta).then(function successCallback(response) {
                
                $scope.usuarioFinanzas = response.data[0].usuarioFinanzas;
                $scope.idusuarioFinanzas = response.data[0].idUsuario;
                if($rootScope.user.nombre == $scope.usuarioFinanzas)
                {
                    $scope.tipoUsuario = response.data[0].tipoUsuarioFF;
                }
                else
                {
                    $scope.tipoUsuario = 0;
                }

              }, function errorCallback(response) {
              });
            }

$scope.enviarCierreFF = function () {
swal({
title: '¿Deseas cerrar el Fondo Fijo?',
text: 'El Fondo Fijo se cerrara',
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
if($scope.tipoCierre == 1)
        {
            let CCDepto = zeroDelete($scope.cuentaContable);
        }
        else
        {
            let CCDepto = zeroDelete($scope.cuentaContable);
        }
        $scope.sendCierreFF()
        $('#loading').modal('hide');
        $location.path('/home');
        window.history.replaceState({}, document.title, $location.path('/home')); 
} else {
swal('Cancelado', 'No se aplicaron los cambios', 'error');
$('#loading').modal('hide');
}
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
async function promiseInsertaDatos(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal, id_perTra, banco, departamento) {
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

async function promiseObtieneCC(idsucursal, poliza, idDepartamento) {
    return new Promise((resolve, reject) => {
        fondoFijoRepository.ObtieneCC(idsucursal,poliza,idDepartamento).then(function (result) {
            if (result.data.length > 0) {
            resolve(result.data);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function promiseTransferencia(idempresa,idSucursal, cuentaOrigen, cuentaDestino, monto, idUsuario) {
    return new Promise((resolve, reject) => {
        aprobarFondoRepository.transferenciaCaja(idempresa,idSucursal, cuentaOrigen, cuentaDestino, monto, idUsuario).then(function (result) {
            if (result.data.length > 0) {
            resolve(result.data);
            }
        }).catch(err => {
            reject(false);
        });

    });
}

async function promisesaveTransferencia(idPersona, idTramite, idTransferencia) {
    return new Promise((resolve, reject) => {
        aprobarFondoRepository.saveTransferencia(idPersona, idTramite, idTransferencia).then(function (result) {
            if (result.data.length > 0) {
            resolve(result.data);
            }
        }).catch(err => {
            reject(false);
        });

    });
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

$scope.sendNotificacionF2 = function (link) {
    var tipoNot = 39;
    var notG = {
        "identificador": parseInt(localStorage.getItem('id_perTra')),
        "descripcion": "El usuario " + $scope.usuarioFinanzas  + " a solicitado la aprobación del Reembolso para el Cajero " +
        $scope.solicitante + " por la cantidad de $" + $scope.montoReembolso + " pesos.",
        "idSolicitante": $scope.idusuarioFinanzas,
        "idTipoNotificacion": tipoNot,
        "linkBPRO":  link, 
        "notAdjunto": "",
        "notAdjuntoTipo": "",
        "idEmpresa": $scope.empresa, //0,
        "idSucursal": $scope.sucursal, //0,
        "departamentoId": 0
    };
    
    clientesRepository.notGerente(notG).then(function (result) {
        if (result.data[0].success == true) {
        } else {
            swal("Atencion!", "Servicio no disponible por el momento, No se creo la notificación ...", "warning");
            $("#loading").modal("hide");
        }
    });
}

$scope.sendNotificacionF3 = function (link) {
    var tipoNot = 40;    
    var notG = {
        "identificador": parseInt(localStorage.getItem('id_perTra')),
        "descripcion": "El usuario " + $scope.usuarioFinanzas + " a solicitado la aprobación del Reembolso para el Cajero " +
        $scope.solicitante + " por la cantidad de $" + $scope.montoReembolso + " pesos.",
        "idSolicitante": $scope.idusuarioFinanzas,
        "idTipoNotificacion": tipoNot,
        "linkBPRO":  link, 
        "notAdjunto": "",
        "notAdjuntoTipo": "",
        "idEmpresa": $scope.empresa, //0,
        "idSucursal": $scope.sucursal, //0,
        "departamentoId": 0
    };
    
    clientesRepository.notGerente(notG).then(function (result) {
        if (result.data[0].success == true) {
        } else {
            swal("Atencion!", "Servicio no disponible por el momento, No se creo la notificación ...", "warning");
            $("#loading").modal("hide");
        }
    });
}


});