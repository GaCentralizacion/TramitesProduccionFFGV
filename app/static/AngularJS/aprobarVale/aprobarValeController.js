registrationModule.controller('aprobarValeController', function ($scope, $rootScope, $location, localStorageService, misTramitesValesRepository,fondoFijoRepository, aprobarValeRepository,devolucionesRepository) {

    $scope.vales = []; 
    $scope.btnParametro= false;
    $scope.allEstatusVales = [];
    $scope.razonesRechazo = '';
    $scope.verComprobacion = false;
    $scope.verComprobacionMas = false;
    $scope.verComprobacionFactura = false;
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
    "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";
    $scope.init = () => {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();  
        if (getParameterByName('idVale') != '') {
            $scope.frmlistVales = false;
            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
            //$scope.listaValeFondoFijo($rootScope.user.usu_idusuario);
            $scope.openWizard();
            $scope.idVale = getParameterByName('idVale');
            $scope.getDataValeXIdVale($scope.idVale);

        }
        else if(getParameterByName('Vale') != '')
        { 
            $scope.frmlistVales = false;
            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
            $scope.openWizard();
            $scope.idVale = getParameterByName('Vale');
            $scope.getDataXIdVale($scope.idVale);

        }
        else if(getParameterByName('IdComprobacion') != '')
        { 
            $scope.frmlistVales = false;
            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
            $scope.openWizard();
            $scope.idComprobacion = getParameterByName('IdComprobacion');
            $scope.getDataXIdComprobacion($scope.idComprobacion);

        }
        else{
            $scope.frmlistVales = true;
            $scope.ShowExit = true;
            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
            $scope.listaValeFondoFijo($rootScope.user.usu_idusuario);
            $scope.openWizard();
        }
        }

    $scope.listaValeFondoFijo=function(idUsuario){
        aprobarValeRepository.getlistaValesXFondoFijo(idUsuario).then(function successCallback(response) {
          $scope.listaVF = response.data;
          $('#tableVale').DataTable().destroy();
          setTimeout(() => {
              $('#tableVale').DataTable({
                  destroy: true,
                  "responsive": false,
                  searching: true,
                  paging: true,
                  autoFill: false,
                  fixedColumns: true,
                  pageLength: 5,
                  "language": {
                      search: '<i class="fa fa-search" aria-hidden="true"></i>',
                      searchPlaceholder: 'Buscar',
                      oPaginate: {
                          sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                          sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                      }
                  }
              });
              $('#tableVale_length').hide();
          }, 1000);
      }, function errorCallback(response) {
      });
    }

    $scope.autorizarVale = function (vale) {
        $scope.id_perTra = vale.id_perTra;
        $scope.urlValeAutorizado = vale.saveUrl;
        $scope.urlValeAutorizadoEvidencia = vale.rutaAutorizado;
        $scope.motivoRechazo = vale.comentario;
        $scope.modalTitleAV = 'Vale No. ' + vale.nombreVale;
        $scope.idestatus = vale.idestatus;
        $scope.idValeFF = vale.idVale;
        $scope.FondoFijoVale = vale.idFondoFijo;
        $scope.tipoGastoVale = vale.tipoTramite;
        $scope.importeValeFF = vale.montoSolicitado;
        $scope.razonVale = vale.razon;
        $scope.frmlistVales = false;
        $scope.aprobarVale = true;
    }

    $scope.modalComentarios = function (item) {
        $("#rechazar").modal("show");
    };

    $scope.verPdfValeAutorizado = function(url) {
        $("#aprobarVale").modal("hide");
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = 'Vale Autorizado';
        var pdf = url;

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
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $("#mostrarPdf").modal("show");
        }else{
            window.open(`https://docs.google.com/viewerng/viewer?url=${pdf}`,'_self');
            
        }

        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $("#mostrarPdf").modal("show");
    }

    $scope.actualizarVale = function (accion) {
        //let errorvale = $scope.EvidenciaVale == undefined || $scope.EvidenciaVale == null   ? true : false;
        // if(accion == 2)
        // {
        //   swal('Alto', 'Para autorizar el vale debes adjuntar la evidencia', 'warning');
        //   return false;
        // }
        var sendData= null;
        if(accion == 2)
        {
          sendData = 
          {
          idVale : $scope.idValeFF,
          accion : accion,
        //   nombreArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[0],
        //   extensionArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[1],
        //   saveUrl: $scope.urlValeAutorizado + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_' + $scope.idValeFF,
        //   archivo: $scope.EvidenciaVale.archivo,
          comentario: ''
          }
        }
        swal({
          title: '¿Deseas Autorizar el Vale?' ,
          text: 'Se autorizara el Vale',
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
              aprobarValeRepository.updateTramiteVale(sendData).then((resf) => {
                           if (resf.data[0].success == 1) {
                            $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, resf.data[0].id_perTra, 2, 'Se aprobo el vale '+ resf.data[0].vale, 1, 1);
                            $scope.frmlistVales = true;
                            $scope.aprobarVale = false;
                            $scope.EvidenciaVale = null; 
                            $scope.listaValeFondoFijo($rootScope.user.usu_idusuario);
                            $('#loading').modal('hide');
                            html = $scope.html1 + 'Solicitud Vale' + "<br><br>Estimado " + resf.data[0].nombreAutorizador + " el vale "  + resf.data[0].vale + " fue aprobado"  + $scope.html2;
                            $scope.sendMail(resf.data[0].correo, resf.data[0].asunto, html);
                           }
                           else if(resf.data[0].success == 2)
                           {
                            swal("Atención", "El fondo fijo no cuenta con suficiente efectivo", "warning");
                            $('#loading').modal('hide');
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

    $scope.regresarmisVales = function(tipo) {
        $scope.frmlistVales = true;
        $scope.aprobarVale = false;
        $scope.EvidenciaVale = null;
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

    $scope.subirEvidencia = async function () {
        let errorvalidar =  $scope.montoEvidenciaVale == undefined ||  $scope.montoEvidenciaVale == "" ||  $scope.montoEvidenciaVale == null ||
                            $scope.EvidenciaVale == undefined || $scope.EvidenciaVale == null   ? true : false;
        if(errorvalidar)
        {
        swal("Atención", "Los campos son obligatorios.", "warning");
        }
        else
        {
        
        if($scope.montoEvidenciaVale >  parseFloat($scope.amountFondoFijo))
        {swal("Atención", "El monto maximo es de $ " + $scope.amountFondoFijo, "warning");}
        else{
        $("#agregaEvidencia").modal("hide");
        $('#loading').modal('show');
        sendData = 
            {
            idVale : $scope.idVale,
            idEstatus : 1,
            nombreArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[0],
            extensionArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[1],
            saveUrl: $scope.saveUrl + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_' + $scope.idVale,
            monto : parseFloat($scope.montoEvidenciaVale),
            archivo: $scope.EvidenciaVale.archivo
            }
           let result = await guardaEvidencia(sendData);
           var r = result;
           if(result.estatus == 1)
           {
              $scope.tipoEvidencias = [];
              $scope.montoEvidenciaVale = null;
              $scope.EvidenciaVale = null;
              $scope.EvidenciaPDF = null;
              $scope.EvidenciaXML = null;   
           }
           else
           { 
               $("#agregaEvidencia").modal("show");
           }
            $scope.listaValesFF($scope.id_perTra, $scope.idVale);
            $('#loading').modal('hide');
        }
    }
    }

    async function guardaEvidencia (sendData) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.guardarEvidencia(sendData).then(function (result) {
            if (result.data.length > 0) {
                resolve({estatus:1, ruta: result.data[0].saveURL, idValeEvidencia: result.data[0].idValeEvidencia});
            }
            else
            {reject({estatus:0})}
        });
    });
    }

    $scope.verImagenModal = function(item) {
        if(item.tipoEvidencia == 'pdf')
        {$scope.verPdf(item)}
        else
        {
            $scope.modalTitle = 'Evidencia';
            $scope.comentario = item.comentario;
            $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
            $scope.verImagen = item.evidencia;
            $("#mostrarImagen").modal("show");
        }
    }

    $scope.verPdf = function(item) {
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = 'Evidencia';
        $scope.comentario = item.comentario;
        $scope.verComentarios = item.estatusReembolso == 2 ? true : false;
        var pdf = item.evidencia;

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
            $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
            $("#mostrarPdf").modal("show");
        }else{
            window.open(`https://docs.google.com/viewerng/viewer?url=${pdf}`,'_self');  
        }
    
    }

    $scope.cancelRechazo = function () {
        $("#rechazar").modal("hide");
        $scope.razonesRechazo = '';
    }
    
    $scope.sendRechazo = function () {
        if ($scope.razonesRechazo == '') {
            swal('Alto', 'Debes mandar las razones por la cual rechazas el vale', 'warning');
        } else {
        sendData = 
          {
          idVale : $scope.idValeFF,
          accion : 5,
          comentario: $scope.razonesRechazo
          }
            $("#rechazar").modal("hide");
            $("#loading").modal("show");
            aprobarValeRepository.updateTramiteVale(sendData).then((resf) => {
                if (resf.data[0].success == 1) {
                $scope.frmlistVales = true;
                $scope.aprobarVale = false;
                $scope.EvidenciaVale = null; 
                 $scope.listaValeFondoFijo($rootScope.user.usu_idusuario);
                 html = $scope.html1 + 'Solicitud Vale' + "<br><br>Estimado " + resf.data[0].nombreAutorizador + " el vale "  + resf.data[0].vale + " fue rechazado"  + $scope.html2;
                $scope.sendMail(resf.data[0].correo, resf.data[0].asunto, html);
                 $('#loading').modal('hide');
                }
                else{
                 $('#loading').modal('hide');
                 swal('Error', 'No se aplicaron los cambios', 'error');
                }
            });    
        }
    }

    $scope.openWizard = function() {
        fondoFijoRepository.estatusFondoFijo(2).then((res) => {
            if (res.data.length > 0) {
                $scope.allEstatusVales = res.data;
            } else {
                swal('Alto', 'Ocurrio un error al mostrar el proceso, intento mas tarde', 'warning');
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

    $scope.getDataValeXIdVale = function(idVale) {
        fondoFijoRepository.dataValeXIdVale(idVale).then((res) => {  
        
            $scope.id_perTra = res.data[0].id_perTra;
            $scope.urlValeAutorizado = res.data[0].saveUrl;
            $scope.urlValeAutorizadoEvidencia = res.data[0].rutaAutorizado;
            $scope.motivoRechazo = res.data[0].comentario;
            $scope.modalTitleAV = 'Vale No. ' + res.data[0].idVale;

            //Se pone otro estatus para que no aparezcan los botones de rechazar y autorizar
            $scope.idestatus = res.data[0].estatusVale;
            $scope.idValeFF = res.data[0].idVale;
            $scope.FondoFijoVale = res.data[0].idFondoFijo;
            $scope.tipoGastoVale = res.data[0].tipoTramite;
            $scope.importeValeFF = res.data[0].montoSolicitado;
            $scope.razonVale = res.data[0].descripcion;
            $scope.frmlistVales = false;
            $scope.aprobarVale = true;
            $scope.listaValesFF($scope.id_perTra, res.data[0].id);
            $scope.verEvidencias = ($scope.idestatus == 3 || $scope.idestatus == 4) ? true : false;
        });
    }

    $scope.listaValesFF = function (id_perTra, idVale) {
        misTramitesValesRepository.getListaVales(id_perTra, idVale).then(function (result) {
            if (result.data.length > 0) {
               // $scope.listaVales = result.data;
                $scope.verComprobacion = true;
                $scope.listaVales = [];
                result.data.forEach(t => {
                if(t.estatusReembolso == 2)
                {$scope.listaVales.push(t);}
                 });
            }
        });
    }

    $scope.getDataXIdVale = function(idVale) {
        fondoFijoRepository.dataValeXIdVale(idVale).then((res) => {  
        
            $scope.id_perTra = res.data[0].id_perTra;
            $scope.urlValeAutorizado = res.data[0].saveUrl;
            $scope.urlValeAutorizadoEvidencia = res.data[0].rutaAutorizado;
            $scope.motivoRechazo = res.data[0].comentario;
            $scope.modalTitleAV = 'Vale No. ' + res.data[0].idVale;

            //Se pone otro estatus para que no aparezcan los botones de rechazar y autorizar
            $scope.idestatus = res.data[0].estatusVale;
            $scope.idValeFF = res.data[0].idVale;
            $scope.FondoFijoVale = res.data[0].idFondoFijo;
            $scope.tipoGastoVale = res.data[0].tipoTramite;
            $scope.importeValeFF = res.data[0].montoSolicitado;
            $scope.razonVale = res.data[0].descripcion;
            $scope.frmlistVales = false;
            $scope.aprobarVale = true;
            $scope.listaVales($scope.id_perTra, res.data[0].id);
            $scope.verEvidencias = ($scope.idestatus == 3 || $scope.idestatus == 4) ? true : false;
        });
    }

    $scope.listaVales = function (id_perTra, idVale) {
        misTramitesValesRepository.getListaVales(id_perTra, idVale).then(function (result) {
            if (result.data.length > 0) {
                $scope.verComprobacionMas = true;
                $scope.listaVales = [];
                 var sumtotalPed = 0;
                 var sumExc= 0;
                 angular.forEach(result.data, function (list, key) {
                     if(list.idestatus != 3)
                     {
                         sumtotalPed += list.monto;
                     }
                     if (sumtotalPed > $scope.importeValeFF) {
                        list.NoAutorizada = true;
                        list.comprbacionMas = sumtotalPed -$scope.importeValeFF - sumExc;
                        sumExc += list.comprbacionMas;
                         //list.comprbacionMas = sumtotalPed - $scope.importeValeFF;
                        $scope.listaVales.push(list)
                     }
                     else
                     {
                        list.comprbacionMas = 0;
                        $scope.listaVales.push(list)  
                     }
                 });
                 $scope.montoComprobado = sumtotalPed;

            }
        });
    }


    $scope.getDataXIdComprobacion = function(idComprobacion) {
        fondoFijoRepository.dataValeXIdComprobacion(idComprobacion).then((res) => {  
        
            $scope.id_perTra = res.data[0].id_perTra;
            $scope.urlValeAutorizado = res.data[0].saveUrl;
            $scope.urlValeAutorizadoEvidencia = res.data[0].rutaAutorizado;
            $scope.motivoRechazo = res.data[0].comentario;
            $scope.modalTitleAV = 'Vale No. ' + res.data[0].idVale;

            //Se pone otro estatus para que no aparezcan los botones de rechazar y autorizar
            $scope.idestatus = res.data[0].estatusVale;
            $scope.idValeFF = res.data[0].idVale;
            $scope.FondoFijoVale = res.data[0].idFondoFijo;
            $scope.tipoGastoVale = res.data[0].tipoTramite;
            $scope.importeValeFF = res.data[0].montoSolicitado;
            $scope.razonVale = res.data[0].descripcion;
            $scope.frmlistVales = false;
            $scope.aprobarVale = true;
            $scope.listaValesxComprobacion($scope.id_perTra, res.data[0].id, idComprobacion);
            $scope.verEvidencias = ($scope.idestatus == 3 || $scope.idestatus == 4) ? true : false;
        });
    }


    $scope.listaValesxComprobacion = function (id_perTra, idVale, idComprobacion) {
        misTramitesValesRepository.getListaVales(id_perTra, idVale).then(function (result) {
            if (result.data.length > 0) {
                $scope.verComprobacionFactura = true;
                $scope.listaVales = [];
                 var sumtotalPed = 0;
                 angular.forEach(result.data, function (list, key) {
                 if(list.idValeEvidencia == idComprobacion)
                 {
                 if(list.estatusNotificacion == 2 || list.estatusNotificacion == 5)
                 {
                    $scope.listaVales.push(list)
                 }
                }
                 });

                 $scope.montoComprobado = sumtotalPed;

            }
        });
    }
});
