registrationModule.controller('misTramitesValesController', function ($scope, $rootScope, $location, localStorageService, misTramitesValesRepository,fondoFijoRepository,devolucionesRepository, anticipoGastoRepository,clientesRepository, aprobarDevRepository) {
    $scope.tramites = [];
    $scope.frmVale = false;
    $scope.frmComprovarVale = false;
    $scope.vales = [];
    $scope.frmValeRecepcion = false; 
    $scope.btnVale = false;
    $scope.frmParametros = false;
    $scope.dobleFF = false;
    $scope.btnParametro= false;
    $scope.allEstatusVales = [];
    $scope.razonesRechazo = '';
    $scope.tipoRetencion = false;
    $scope.verNombrePersona = false;
    $scope.activabtn = false;
    $scope.activaNuevoVale = false;
    $scope.disableDepartamentos = true;
    $scope.depVale = null;
    $scope.departamentosArea = 0;
    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = ".</p></div>";

    $scope.minevidenciachar = 35;

    $scope.init = () => {
        $scope.toleranciaVales();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();  
        $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
        $scope.tipoDescuento = [{ id:1, text:'Devolver dinero'},{ id:2, text:'Descuento nomina'}]
        $scope.nombreUsuario=JSON.parse(localStorage.getItem('usuario')).nombre;
        fondoFijoRepository.getTipoUsuario($rootScope.user.usu_idusuario,3).then(function successCallback(response) {
            if(response.data.length > 0)
            {
                $scope.tipoUsuario = response.data[0].tipoUsuarioFF;
                 if ($scope.tipoUsuario == 4)
                {
                    $scope.btnVale = false;
                    $scope.btnParametro= true;
                    $scope.getParamFF();
                }
                else{
                    $scope.btnVale = true;
                    $scope.btnVale = $scope.tipoUsuario == 3 ? true : false;
                }
              
            }  
            $scope.traeFF();
            $scope.frmlistVales = true;
            $scope.getMisVales();
            $scope.traetiposFF();
            $scope.openWizard();
            $scope.traeEmpleado();
        }, function errorCallback(response) {
        });
    };



    $scope.toleranciaVales = function(){
        misTramitesValesRepository.toleranciaVale().then( ( result ) => {
            $scope.tolerancia = result.data[0].centavos;
            console.log( "toleranciaVales", $scope.tolerancia );
        })
    }

    $scope.goNuevoVale = function() {
        $scope.traeEmpleado();
        //localStorage.removeItem('borrador');
        // $scope.traerAutorizadores();
        $scope.limpiar();
        $scope.frmNewVale = true;
        $scope.btnVale = false;
        $scope.estatusVale = 0;
        $scope.frmlistVales = false;
        $scope.frmComprovarVale = false;
        $scope.verNombrePersona = false;
        $scope.nombrePersona  = '';
        $scope.traeFF();
    }
    $scope.regresarmisVales = function(tipo) {
        $scope.limpiar();
        $scope.getMisVales();
        if(tipo == 1)
        {
            $scope.frmNewVale = false;
            $scope.btnVale = true;
            $scope.frmComprovarVale = false;
        }
        else
        {
            $scope.frmValeRecepcion = false;
            $scope.btnParametro= true;
        }
        $scope.frmParametros = false;
        $scope.frmlistVales = true;
    }

    $scope.limpiar = function() {
        $scope.estatusVale = 0;
        $scope.descripcionVale = '';
        $scope.tipoGasto = 0;
        $scope.importeVale = '';
        $scope.FFSucursal = 0; 
    }
    $scope.getMisVales = function () {
        misTramitesValesRepository.misVales($rootScope.user.usu_idusuario).then((res) => {
            if(res.data.length > 0)
            {
            $scope.vales = res.data;
            // $scope.vales.forEach(item => {
            //     if(item.estatusVale == 2 ||item.estatusVale == 3|| item.estatusVale == 4) 
            //     {$scope.activaNuevoVale = true;}
            // });
            $('#tableMisVales').DataTable().destroy();
                setTimeout(()=>{
                    $('#tableMisVales').DataTable({
                        destroy: true,
                        "responsive": true,
                        searching: true,
                        paging: true,
                        autoFill: false,
                        fixedColumns: true,
                        pageLength: 5,
                        "order": [[ 2, "desc" ]],
                        "language": {
                            search: '<i class="fa fa-search" aria-hidden="true"></i>',
                            searchPlaceholder: 'Buscar',
                            oPaginate: {
                                sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                                sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                            }
                        }       
                    });
                    $('#tableMisVales_length').hide();
                    
                }, 500);
            }
        });
    };

    $scope.goNuevoTramite = function() {
        localStorage.removeItem('borrador');
        $location.path('/nuevoTramite');
    }
    $scope.traeEmpleado=function(){
        fondoFijoRepository.getidPersonabyUsuario($rootScope.user.usu_idusuario).then(function successCallback(response) {
          $scope.IDPersona = response.data[0].PER_IDPERSONA;
          $scope.activabtn = $scope.IDPersona == '0' ? false : true;
          $scope.idPersona = response.data[0].PER_IDPERSONA;
          if($scope.IDPersona != '0')
          { $scope.buscarPersona($scope.IDPersona);}
      }, function errorCallback(response) {
      });
  }

    $scope.traeFF=function(){
        misTramitesValesRepository.getlistaFondoFijoSuc($rootScope.user.usu_idusuario).then(function successCallback(response) {
          $scope.FondoFijoSuc = response.data;
           //Buscar al autorizador al que se le va a enviar la notificación
          // $scope.buscarAutorizador( $scope.FondoFijoSuc[0].idEmpresa);
           $scope.idSucursalEmpleado = $scope.FondoFijoSuc[0].idSucursal;
      }, function errorCallback(response) {
      });    
      }

      $scope.getTipoComprobante = function ( selSucursal) {
        $scope.tipoComprobanteList = [];
        misTramitesValesRepository.getTipoComprobante(selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.tipoComprobanteList = res.data;
                $scope.tipoComprobanteList = removeItemFromArr( $scope.tipoComprobanteList, 'ARRENDAMIENTO' );
            }
        });
    };

    function removeItemFromArr( arr, item ) {
        return arr.filter( function( e ) {
            return !e.PAR_DESCRIP1.includes(item) ;
        } );
    };

    function removeDepFromArr( arr, item ) {
        return arr.filter( function( e ) {
            return !e.nombre.includes(item) ;
        } );
    };

    $scope.getIVABySucursal = function ( selSucursal) {
        $scope.IVAList = [];
        fondoFijoRepository.obtieneIVAbySucursal(selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.IVAList = res.data;
            }
        });
    };

    // $scope.getConceptoAfectacion = function (selEmpresa, selSucursal, tipoArea, tipoIVA) {     
    //     misTramitesValesRepository.getConceptoAfectacion(selEmpresa,selSucursal, tipoArea.PAR_IDENPARA, tipoIVA.PAR_DESCRIP1).then((res) => {
    //         if (res != null && res.data != null && res.data.length > 0) {
    //             $scope.conceptoGastoList = [];
    //             $scope.disabledTipoComprobante = false;
    //             $scope.conceptoGastoList = res.data;
    //         }
    //     });
    // };

    $scope.getConceptoAfectacion = function (selEmpresa, selSucursal) {     
        misTramitesValesRepository.getConceptoAfectacion(selEmpresa,selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.conceptoGastoList = [];
                $scope.disabledTipoComprobante = false;
                $scope.conceptoGastoList = res.data;
            }
        });
    };

      $scope.getAreaAfectacion = function (selEmpresa, selSucursal) {
        $scope.areaAfectacionList = [];
        anticipoGastoRepository.getAreaAfectacion(selEmpresa, selSucursal).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.areaAfectacionList = res.data;
            }
        });
    };

    $scope.asignarAreaAfectacion = function (selCNC_CONCEPTO1) {
        if (selCNC_CONCEPTO1 != null && selCNC_CONCEPTO1 != '') {
            $scope.selCNC_CONCEPTO1 = selCNC_CONCEPTO1;
            if ($scope.idConceptoSeleccion != null && $scope.idConceptoSeleccion > 0 && $scope.selCNC_CONCEPTO1 != null && $scope.selCNC_CONCEPTO1 != '') {
                $scope.getCuentaContable();
            }
        } else {
            $scope.selCNC_CONCEPTO1 = '';
        }
          //Validar tipoIVA
    
        //   if($scope.selCNC_CONCEPTO1 != undefined && $scope.idtipoComprobante != undefined)
        //   {
        //       $scope.getConceptoAfectacion($scope.selEmpresa, $scope.selSucursal, $scope.selCNC_CONCEPTO1, $scope.idtipoComprobante );
        //   }
        
          
    }

    $scope.getCuentaContable = function () {
        var data = {
            idEmpresa: $scope.selEmpresa,
            idSucursal: $scope.selSucursal,
            CNC_CONCEPTO1: $scope.selCNC_CONCEPTO1,
            CNC_CONCEPTO2: $scope.idConceptoSeleccion
        };
        anticipoGastoRepository.getCuentaContable(data).then((res) => {
            if (res != null && res.data != null && res.data.length > 0) {
                $scope.numeroCuenta = res.data[0].CNC_CUENTA;
            }
        });
    };

    $scope.asignarConcepto = function (idConcepto) {
        if (idConcepto != null && idConcepto != 0) {
            $scope.idConceptoSeleccion = idConcepto;
            var concepto = $scope.conceptoGastoList.filter(concepto => concepto.id == idConcepto);
            if ($scope.idConceptoSeleccion != null && $scope.idConceptoSeleccion > 0 && $scope.selCNC_CONCEPTO1 != null && $scope.selCNC_CONCEPTO1 != '') {
                $scope.getCuentaContable();
            }
        } else {
            $scope.idConceptoSeleccion = 0;
        }
    }

    //   $scope.traerAutorizadores=function(){
    //     fondoFijoRepository.getAutorizadoresFondoFijo(2, $rootScope.user.usu_idusuario).then(function successCallback(response) {
    //       $scope.autorizador = response.data[0].idAutorizador;
    //   }, function errorCallback(response) {
    //   });
    //   }

      $scope.traetiposFF=function(){
        fondoFijoRepository.getTipoGastoFF().then(function successCallback(response) {
          $scope.tipoGastos = response.data;
      }, function errorCallback(response) {
      });    
      }

      $scope.validaVale = function () { 
            errorVale =     $scope.FFSucursal == undefined || $scope.FFSucursal == 0 ||
                        //$scope.depVale == null ||  	// Coal EYH 02022022
                        //$scope.tipoGasto == undefined || $scope.tipoGasto == 0 ||
                        //$scope.autorizador == undefined || $scope.autorizador == 0 ||
                        $scope.importeVale == undefined ||  $scope.importeVale ==  ""|| 
                        $scope.descripcionVale == undefined || $scope.descripcionVale == "" ? true : false;
            if(errorVale)
            {
            swal("Atención", "Los campos son obligatorios.", "warning");
            }
            if($scope.depVale == null || $scope.depVale == "" || $scope.depVale == 0) 	// Coal EYH 02022022
            {
            swal("Atención", "El Departamento es obligatorio.", "warning");
            }
            else
            {
                if($scope.idPersona ==  "" ||  $scope.idPersona == 0 )
                {swal("Atención", "El ID Personsa no puede ser vacio o cero", "warning");}
                else if($scope.importeVale == 0)
                {swal("Atención", "El importe a solicitar debe ser mayor a $0.00", "warning");}
                else
                {
                    dataSave = {
                        idVale: 0,
                        idUsuario: $rootScope.user.usu_idusuario,
                        descripcion: $scope.descripcionVale,
                        estatus: 1,
                        importe: parseFloat($scope.importeVale),
                        idFondoFijo: $scope.FFSucursal,
                        idtipoGasto: $scope.tipoGasto,
                        idAutorizador: $scope.autorizador, 
                        valeCompuesto: 0,
                        idFondoFijo2: 0,
                        importeFF1: 0,
                        importeFF2: 0,
                        idPersona: $scope.idPersona,
                        idDepartamento: $scope.depVale.idDepartamento
                        }
                        misTramitesValesRepository.validaValesUsuario($rootScope.user.usu_idusuario).then(function successCallback(response) {
                            if (response.data[0].success == 1) {
                            $scope.guardarvale(dataSave);
                            }
                            else if(response.data[0].success == 3) {
                                swal("Atención", "Usuario dado de baja.", "warning")
                            }
                            else if(response.data[0].success == 2) {
                                swal("Atención", "No puede solicitar un Nuevo Vale, hasta que compruebe sus evidencias que contienen rechazo de finanzas", "warning")
                            }
                            else
                            {
                                swal("Atención", "No puede solicitar un Nuevo Vale, hasta que compruebe sus Vales", "warning");  
                            }
                        }, function errorCallback(response) {
                        });  
                
                }
            
            }
        };

    $scope.guardarvale = function(dataSave) {     
        swal({
          title: '¿Deseas solicitar tu trámite?',
          text: 'Se enviará el vale a aprobación por el monto de $' + formatMoney($scope.importeVale),
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
                       fondoFijoRepository.saveTramiteVale(dataSave).then((resf) => {
                           if (resf.data[0].success == 1) {
                            $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, resf.data[0].id_perTra, 2, 'Se creo el vale '+ resf.data[0].vale, 1, 1);
                            $scope.idPersona = 0;
                            //html = $scope.html1 + 'Solicitud Vale' + "<br><br>Estimado " + resf.data[0].nombreAutorizador + " el vale "  + resf.data[0].vale + " fue solicitado"  + $scope.html2;
                            //$scope.sendMail(resf.data[0].correo, resf.data[0].asunto, html);
                            $scope.nombreVale = resf.data[0].vale;
                            $scope.descripcionValeRes = resf.data[0].descripcion;
                            //$scope.idEmpresa = resf.data[0].idEmpresa;
                           
                            $scope.sendNotificacion(resf);    

                            $scope.getMisVales();
                            $scope.regresarmisVales(1);
                            // if(dataSave.valeCompuesto == 0)
                            // { $scope.obtenerPagareVale(dataSave.importe);}
                            // else
                            // { 
                            //     $scope.obtenerPagareVale(dataSave.importeFF1);
                            //     $scope.obtenerPagareVale(dataSave.importeFF2);
                            // }
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

    $scope.obtenerPagareVale = function(data){
        var date = new Date();
        var doc = new jsPDF('p','px','letter');
  
        var lMargin=15; //left margin in mm
        var rMargin=15; //right margin in mm
        var pdfInMM=410;  
  
        doc.setFontSize(12);
        doc.text('ANEXO 1', 180,130);
        doc.text('FOLIO '+ $scope.nombreVale, 230,130);
        doc.text('AGENCIA SUCURSAL', 45,150);
        doc.text('VALE PROVISIONAL DE CAJA', 45,170);
        doc.text( ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear(), 230,170);
        doc.text('$ ' + data, 45,190);
        doc.text('Importe ('+ $scope.numeroALetras(data) + ' ' + $scope.centavos +'/100 M.N.)', 45,210);
        doc.text('', 45,230);
        doc.text('CONCEPTO O MOTIVO', 45,230);
        doc.text($scope.descripcionValeRes, 45,250);
  
        var parrafo1='DE ACUERDO A LAS POLITICAS DE LAS SOCIEDADES DE GRUPO ANDRADE, LAS CANTIDADES ENTREGADAS DEBEN SER COMPROBADAS Y/O DEVUELTO EL DINERO A LA CAJA, EN UN PLAZO NO MAYOR A 48 HORAS';
        var parrafo2='"Yo que recibo el importe del presente vale a mi entera satisfacción, para el cumplimiento de la política indicada, en caso de no comprobar los gastos dentro del plazo establecido, reconozco que debo esta cantidad y me obligo a pagar en una sola exhibición, autorizando me sea descontada por nómina."';
  
        var lines1=doc.splitTextToSize(parrafo1, (pdfInMM-lMargin-rMargin));
        var lines2=doc.splitTextToSize(parrafo2, (pdfInMM-lMargin-rMargin));
  
        var dim = doc.getTextDimensions('Text');
        var lineHeight = dim.h;
        lineTop1 = (lineHeight/2)*lines1.length + 10;
  
        for(var i=0;i<lines1.length;i++){
          lineTop = (lineHeight/2)*i;
          doc.text(lines1[i],45,285+lineTop); 
        }
  
        for(var i=0;i<lines2.length;i++){
          lineTop = (lineHeight/2)*i;
          doc.text(lines2[i],45,285+lineTop+lineTop1); 
        }
        doc.save('PagareVale.pdf');
      }

    $scope.obtenerVale=function(monto){
        var date = new Date();
        var doc = new jsPDF('p','px','letter');
  
        var lMargin=15; //left margin in mm
        var rMargin=15; //right margin in mm
        var pdfInMM=410;  // width of A4 in mm
       
        doc.setFontSize(8);
        doc.text('México, D.F. a '+ ('0' + date.getDate()).slice(-2) +' de '+ date.toLocaleString("es", { month: "long"  })+ ' de ' +  date.getFullYear()+'. ', 320,100);
        doc.setFontSize(14);
        doc.text('VALE ', 180,130);
        doc.setFontSize(11);
        var paragraph = 'Con esta fecha se entregan $'+ monto +' ('+ $scope.numeroALetras(monto) + ' ' + $scope.centavos +'/100 M.N.) al Sr/Sra. '+$scope.nombreUsuario+', por concepto de manejo de vale de fondo fijo, mismo que será manejado para cubrir exclusivamente gastos menores de la empresa.';
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
  
        doc.text('Responsable Vale de Fondo Fijo.',180,230);
        doc.text('Sr/Sra. '+$scope.nombreUsuario+'.',160,250);
        doc.text('Recibe Vale de Fondo Fijo.',198,265); 
        doc.save('Vale.pdf');
      };

      $scope.modalEvidencias = function (data, accion) {
        document.getElementById("frm_subir_factura").reset();
        $scope.EvidenciaXML = undefined;
        $scope.EvidenciaPDF = undefined;
        $scope.bloqueoBoton = false;
        $scope.conceptoGastoList = [];
        $scope.evidenciaSelected = [];
        $scope.verTipoFactura = false;
        $scope.motivoEvidencia = '';
        $scope.tipoGasto = ''
        $scope.idComprobacionVale = data == undefined ? '' : data.idComprobacionVale;
        $scope.montoComprobacionVale = data == undefined ? '' :  data.monto;
        if($scope.selEmpresa == 12 ||$scope.selEmpresa == 16 || $scope.selEmpresa == 17 || $scope.selEmpresa == 18)
        {
            $scope.tipoGastos = $scope.tipoGastos.filter(x => x.id == 2);
        }      
        if(accion == 1)
        {
        $scope.tipoGasto =null;
        $scope.accion = accion;
        $scope.verFactura = false;
        $scope.verDocImagen = false;
        $scope.tipoEvidencias = [{ id:1, text:'Factura'},{ id:2, text:'Vale Azul (No deducible)'}]
        $scope.getAreaAfectacion($scope.selEmpresa, $scope.selSucursal);
        $scope.getConceptoAfectacion($scope.selEmpresa, $scope.selSucursal);
        $scope.getTipoComprobante($scope.selSucursal);
        $scope.getIVABySucursal($scope.selSucursal);
        $scope.getRFCEmpresa($scope.nombreEmpresa);
        $scope.traeDepartamentos($scope.selEmpresa, $scope.selSucursal);
        $scope.disabledTipoComprobante = true;
        $scope.verCombo = true;
        $scope.verInventario = false;
        $scope.verGasto = false;
        $scope.verFactura = false;
        $scope.verDocImagen = false;
        $scope.verOrdenes= false;
        $scope.verGuardarOrden = false;
        $scope.idProveedor = '';
        $scope.departamento = '';
        $("#agregaEvidencia").modal("show");
        }
        else
        {
        $scope.datosEvidencia = data;
        $scope.verCombo = false
        $scope.accion = accion;
        $scope.getTipoComprobante($scope.selSucursal);
        $scope.getIVABySucursal($scope.selSucursal);
        let tipoEvidencia =  data.esFactura == 'S' ? 1 : 2
        $scope.getRFCEmpresa($scope.nombreEmpresa);
        if(tipoEvidencia== 2)
        {
            $scope.montoEvidenciaVale = data.monto;
        }
        $scope.SeleccionaTipo(tipoEvidencia);
        if($scope.datosEvidencia.tipoGasto == 1)
        {
            $scope.verEvidenciaFacturas = false;
        }
        else
        {
            $scope.verEvidenciaFacturas = true;
        }

        $("#actualizaEvidencia").modal("show");
        }


        $scope.validaMotivo();
 
    };

    // $scope.modalDescuento = function (data, accion) {

    //     $("#modalDescuento").modal("show");
    // };

    // $scope.enviarDescuento = function () {

    //     $("#modalDescuento").modal("show");
    // };

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
      

    $scope.regresarComprobacion = function() {
        $scope.tipoEvidencias = [];
        $scope.areaAfectacionList = [];
        $scope.conceptoGastoList = [];
        $scope.montoEvidenciaVale = null;
        $scope.EvidenciaVale = null;
        $scope.EvidenciaPDF = null;
        $scope.EvidenciaXML = null;

        $("#agregaEvidencia").modal("hide");
        $("#actualizaEvidencia").modal("hide");
    }

    $scope.SeleccionaTipo = function (tipo) {
        if(tipo == 1)
        {
            $scope.verFactura = true;
            $scope.disabledCoprobanteData = false;
            $scope.idtipoComprobante = '';
            $scope.idtipoIVA = '';
            $scope.idConceptoSeleccion = '';
            $scope.verTipoFactura = false;
            $scope.verDocImagen = false;
        }
        else if(tipo == null)
        {
            $scope.verFactura = false;
            $scope.verDocImagen = false;
            $scope.disabledCoprobanteData = false;
            $scope.verTipoFactura = true;
        }
        else
        {
            $scope.verFactura = false;
            $scope.verDocImagen = true;
            $scope.tipoRetencion = false;
            $scope.disabledCoprobanteData = true;
            $scope.idtipoComprobante =  $scope.tipoComprobanteList.length == 0 ? '' :  $scope.tipoComprobanteList.filter(tipo => tipo.PAR_IMPORTE1 == 0 && tipo.PAR_IMPORTE2 == 0)[0];
            $scope.idtipoIVA = $scope.IVAList.length == 0 ? '' :  $scope.IVAList.filter(iva => iva.PAR_IMPORTE1 == '0')[0];
            $scope.idConceptoSeleccion  =  $scope.conceptoGastoList.length == 0 ? '' : $scope.conceptoGastoList.filter(con => con.PAR_DESCRIP1.includes('NO DEDUCIBLES'))[0].PAR_IDENPARA;
            $scope.verTipoFactura = true;
        }

        console.log($scope.verFactura, $scope.verDocImagen)
    }

    $scope.SeleccionaTipoGasto = function (tipo) {
        if(tipo == 1)
        {
            $scope.verInventario = true;
            $scope.verGasto = false;
            $scope.verFactura = false;
            $scope.verDocImagen = false;
            $scope.verOrdenes= false;
            $scope.verGuardarOrden = false;
        }
        else if(tipo == null)
        {
            $scope.verInventario = false;
            $scope.verGasto = false;
            $scope.verFactura = false;
            $scope.verDocImagen = false;
            $scope.verOrdenes= false;
            $scope.verGuardarOrden = false;
        }
        else
        {
            $scope.verInventario = false;
            $scope.verGasto = true;
            $scope.verOrdenes= false;
            $scope.verGuardarOrden = false;
        }
    }

    $scope.goVerVale = function(vale){
        $scope.numeroSolicitud = 'Vale ' + vale.nombreVale;
        $scope.frmlistVales = false;
        $scope.listaVales = [];
        $scope.id_perTra = vale.id_perTra;
        $scope.idVale = vale.idVale;
        $scope.saveUrl = vale.saveUrl;
        $scope.descripcionVale = vale.descripcion;
        $scope.tipoGasto = vale.idtipotramite;
        $scope.importeVale = vale.montoSolicitado;
        $scope.FFSucursal = vale.id;
        $scope.estatusVale = vale.estatusVale;   
        $scope.estatus = vale.estatus; 
        $scope.solicitante = vale.solicitante;
        $scope.departamento = vale.departamento;  
        $scope.motivoRechazo = vale.comentario;
        $scope.autorizador = vale.idAutorizador;
        $scope.valeSucursal = vale.idSucursal;
        $scope.valeEmpresa = vale.idEmpresa;
        $scope.nombreVale =  vale.nombreVale;
        $scope.idFondoFijo =  vale.idFondoFijo;
        $scope.nombreEmpresa = vale.nombreEmpresa;
	$scope.nomAutorizador = vale.nomAutorizador;
        if($scope.tipoUsuario == 3)
            {
               if($scope.estatusVale == 1)
               {
                $scope.frmNewVale = true;
                $scope.btnVale = false;
                $scope.nuevovale = false;  
               }
               else
               {
                $scope.frmComprovarVale = true;
                $scope.selEmpresa = vale.idEmpresa;
                $scope.selSucursal = vale.idSucursal;
                $scope.getParametro('MAX_VFF');
                $scope.getParametroFactura('MAX_FFF');
                $scope.listaValesFF($scope.id_perTra, vale.idVale);
               }
            
            }
        else  
            {
            $scope.listaValesFF($scope.id_perTra,  vale.idVale);
            $scope.btnVale = false;
            $scope.frmValeRecepcion = true; 
            }
	console.log($scope.id_perTra)
        console.log($scope.idVale)
        $scope.buscarAutorizador();
        $scope.ValidaNotificacion($scope.id_perTra,  vale.idVale);       
    };

    $scope.ValidaNotificacion = function (id_perTra, idVale) {
        misTramitesValesRepository.getValidaNotificacion(id_perTra, idVale).then(function (result) {
            if (result.data[0].success == 1) {
                $scope.sendNotificacion(result);
                swal('Fondo Fijo', 'Notificación enviada correctamente', 'success');
                $scope.getMisVales();
                $scope.regresarmisVales(1);
            }
            else{
                console.log("NO hay Notificacion, fue enviada correctamente")                
            }
        });
    }

    $scope.listaValesFF = function (id_perTra, idVale) {
        misTramitesValesRepository.getListaVales(id_perTra, idVale).then(function (result) {
            if (result.data.length > 0) {
                $scope.listaVales = result.data;
                var sumtotalPed = 0;
                var sumExc= 0;
                angular.forEach($scope.listaVales, function (list, key) {
                    if(list.idestatus != 3)
                    {
                        sumtotalPed += list.monto;
                    }

                    var centavos  = $scope.tolerancia * 1; //.10;
                    var centavosnegativo = centavos * -1;

                    if (sumtotalPed <= $scope.importeVale) {
                     list.NoAutorizada = false;
                    }
                    else
                    {   
                        var diferencia = sumtotalPed - $scope.importeVale;
                        diferencia = diferencia.toFixed(2);
                        console.log("================diferencia", diferencia);
                        if( diferencia >= centavosnegativo && diferencia <= centavos ){
                            list.NoAutorizada = false;
                        }
                        else{
                            list.NoAutorizada = true;
                            list.montoExcedente = sumtotalPed -$scope.importeVale - sumExc;
                            sumExc += list.montoExcedente;
                        }
                        
                        
                    }
                });
            }
        });
    }

    $scope.sendMail = function(to, subject, html) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito ")')
                 //insertar en la bitácora para registrar que el correo se envió exitosamente
                 $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Correo enviado a '+to , 1, 1);
            } else {
                console.log('Ocuerrio un error al emviar el correo "( ')
                 //insertar en la bitácora para registrar que no se pudo enviar el correo
                 $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'No se pudo entregar el correo a '+to+' Asunto: '+subject, 1, 1);
            }
        });
    };

    $scope.subirEvidencia = async function () {
        $scope.bloqueoBoton = true;
        console.log( "montoEvidenciaVale a validar", $scope.montoEvidenciaVale );
        let errorvalidar =  $scope.montoEvidenciaVale == undefined ||  $scope.montoEvidenciaVale == "" ||  $scope.montoEvidenciaVale == null ||
                            $scope.tipoGasto == undefined || $scope.tipoGasto == 0 ||
                            $scope.selCNC_CONCEPTO1 == undefined || $scope.selCNC_CONCEPTO1 == 0 ||  $scope.selCNC_CONCEPTO1 == '' ||
                            $scope.idConceptoSeleccion == undefined || $scope.idConceptoSeleccion == 0 ||  $scope.idConceptoSeleccion == '' ||
                            $scope.motivoEvidencia == undefined || $scope.motivoEvidencia == "" || $scope.motivoEvidencia ==  null ||
                            $scope.idtipoComprobante == undefined 
                            $scope.EvidenciaVale == undefined || $scope.EvidenciaVale == null   ? true : false;
        if(errorvalidar)
        {
        swal("Atención", "Los campos son obligatorios.", "warning");
        $scope.bloqueoBoton = false;
        }
        else
        {
        
        if($scope.montoEvidenciaVale >  parseFloat($scope.amountFondoFijo))
        {
            swal("Atención", "El monto maximo es de $ " + $scope.amountFondoFijo, "warning");
            $scope.bloqueoBoton = false;
        }
        else{
        var validaRet = await ValidaRetenciones($scope.valeSucursal, $scope.idtipoComprobante.PAR_IDENPARA, $scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion);
        if(validaRet[0].estatus == 1)
        {
        $('#loading').modal('show');
        $("#agregaEvidencia").modal("hide");
        sendData = 
            {
            idVale : $scope.idVale,
            idEstatus : 1,
            nombreArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[0],
            extensionArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[1],
            saveUrl: $scope.saveUrl + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_' + $scope.idVale,
            monto : parseFloat($scope.montoEvidenciaVale),
            archivo: $scope.EvidenciaVale.archivo,
            tipoGasto: $scope.tipoGasto,
            areaAfectacion: $scope.selCNC_CONCEPTO1,
            conceptoAfectacion: $scope.idConceptoSeleccion,
            numeroCuenta: $scope.numeroCuenta,
            tipoComprobante: $scope.idtipoComprobante.PAR_IDENPARA,
            tipoIVA: $scope.idtipoIVA.PAR_IDENPARA,
            IVA: $scope.ivaVale,
            IVAretencion: $scope.retencion, 
            ISRretencion: $scope.ISRretencion,
            subTotal: $scope.subtotalVale,
            motivoEvidencia: $scope.motivoEvidencia
            }
            // dataOrden = 
            // {
            // idusuario: $rootScope.user.usu_idusuario,
            // idempresa: $scope.valeEmpresa,
            // idsucursal: $scope.valeSucursal,
            // id_perTra: $scope.id_perTra,
            // proceso: 1,
            // precioUnitario: parseFloat($scope.montoEvidenciaVale),
            // areaAfectacion: $scope.selCNC_CONCEPTO1,
            // conceptoContable: $scope.idConceptoSeleccion,
            // tipoComprobante: $scope.idtipoComprobante.PAR_IDENPARA,
            // producto: $scope.nombreVale,
            // observaciones:  $scope.numeroSolicitud,
            // descuento: 0
            // }
           //let orden = await guardaOrdenMasiva(dataOrden); 
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
           $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, $scope.id_perTra, 0, 'Se inserto el vale evidencia id '+ result.idValeEvidencia, 1, 1);
            $scope.listaValesFF($scope.id_perTra, $scope.idVale);
            $('#loading').modal('hide');
        }
        else
        {
            swal("Atención",validaRet[0].mensaje , "warning");
            $scope.bloqueoBoton = false;
            //$("#agregaEvidencia").modal("show");
        }
        }
    }
    }

    $scope.ActualizarEvidencia = async function () {
        let errorvalidar =  //$scope.montoEvidenciaVale == undefined ||  $scope.montoEvidenciaVale == "" ||  $scope.montoEvidenciaVale == null ||
                            $scope.EvidenciaVale == undefined || $scope.EvidenciaVale == null   ? true : false;
        if(errorvalidar)
        {
        swal("Atención", "Los campos son obligatorios.", "warning");
        }
        else
        {
        $("#agregaEvidencia").modal("hide");
        $('#loading').modal('show');
        sendData = 
            {
            idValeEvidencia: $scope.datosEvidencia.idValeEvidencia,
            ruta: $scope.datosEvidencia.idValeEvidencia,
            idVale : $scope.idVale,
            idEstatus : 1,
            nombreArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[0],
            extensionArchivo: $scope.EvidenciaVale.nombreArchivo.split('.')[1],
            saveUrl: $scope.saveUrl + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_' + $scope.idVale,
            monto : parseFloat($scope.montoEvidenciaVale),
            archivo: $scope.EvidenciaVale.archivo
            }
           let result = await actualizarEvidencia(sendData);
           var r = result;
           if(result.estatus == 1)
           {
              $scope.tipoEvidencias = [];
              $scope.montoEvidenciaVale = null;
              $scope.EvidenciaVale = null;
              $scope.EvidenciaPDF = null;
              $scope.EvidenciaXML = null;   
              $("#actualizaEvidencia").modal("hide");
              let bodyUsuFondo = 
              '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
              '<p>Estimado usuario '+ result.usuFondo +', se actualizo la siguiente Evidencia de Vale, favor de enviar a Corporativo para su revisión. </p>' +
              '<p>Solicitud de Fondo Fijo: '+ result.id_perTra  +' </p>' +
              '<p>Folio Fondo Fijo: ' +  result.idFondoFijo +'</p>' +
              '<p>Folio Vale: ' +  result.idVale +'</p>' +
              '<p>Folio Comprobación Vale: ' +  result.idComprobacionVale +'</p>' +
              '<p>Cantidad: $'+  result.monto   + '</p>';      
              $scope.sendMail(result.correoFondo, 'Actualización de Comprobación Vale de Fondo Fijo ' + result.id_perTra, bodyUsuFondo);
           }
           else
           { 
               $("#actualizaEvidencia").modal("show");
           }
            $scope.listaValesFF($scope.id_perTra, $scope.idVale);
            $('#loading').modal('hide');
        }
    }


    $scope.ActualizarFacturas  = async function () {
        let errorvalidar =  $scope.EvidenciaPDF == undefined || $scope.EvidenciaPDF == null ||
                            $scope.EvidenciaXML == undefined || $scope.EvidenciaXML == null ? true : false;
        if(errorvalidar)
        {
            swal("Atención", "Los campos son obligatorios.", "warning");
        }
        else
        {
            var resolved = [];
            var errors = [];
            var facturas = [{tipo: 'xml', evidencia: $scope.EvidenciaXML}, {tipo: 'pdf', evidencia: $scope.EvidenciaPDF}]
            for (var item = 0; item < facturas.length; item++) 
            { 
                sendData = 
                {
                idValeEvidencia: $scope.datosEvidencia.idValeEvidencia,
                ruta: $scope.datosEvidencia.idValeEvidencia,
                idVale : $scope.idVale,
                idEstatus : 1,
                nombreArchivo: facturas[item].evidencia.nombreArchivo.split('.')[0],
                extensionArchivo: facturas[item].evidencia.nombreArchivo.split('.')[1],
                saveUrl: $scope.saveUrl + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_' + $scope.idVale,
                monto : parseFloat($scope.montoEvidenciaVale),
                archivo: facturas[item].evidencia.archivo
                }
                try {
                    resolved.push(await actualizarFactura(sendData));
                }
                catch (e) {
                    errors.push(e);
                }
            }

            if(resolved[1].estatus == 1)
            {
               $scope.tipoEvidencias = [];
               $scope.montoEvidenciaVale = null;
               $scope.EvidenciaVale = null;
               $scope.EvidenciaPDF = null;
               $scope.EvidenciaXML = null;   
               $("#actualizaEvidencia").modal("hide");
               let bodyUsuFondo = 
               '<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" /></center></div><br>' +
               '<p>Estimado usuario '+ resolved[1].usuFondo +', se actualizo la siguiente Evidencia de Vale, favor de enviar a Corporativo para su revisión. </p>' +
               '<p>Solicitud de Fondo Fijo: '+ resolved[1].id_perTra  +' </p>' +
               '<p>Folio Fondo Fijo: ' +  resolved[1].idFondoFijo +'</p>' +
               '<p>Folio Vale: ' +  resolved[1].idVale +'</p>' +
               '<p>Folio Comprobación Vale: ' +  resolved[1].idComprobacionVale +'</p>' +
               '<p>Cantidad: $'+  resolved[1].monto   + '</p>';      
               $scope.sendMail(resolved[1].correoFondo, 'Actualización de Comprobación Vale de Fondo Fijo ' + resolved[1].id_perTra, bodyUsuFondo);
            }
            else
            { 
                $("#actualizaEvidencia").modal("show");
            }
        }
    }

    
    $scope.renunciaEvidencia =  function () {
        swal({
            title: '¿Deseas renunciar a esta Comprobación?',
            text: 'Se rechazara esta Comprobación',
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
              misTramitesValesRepository.renunciaEvidencia($scope.datosEvidencia.idValeEvidencia).then(function (result) {
                if (result.data != undefined) {
                    log.console(result)
                    $('#loading').modal('hide');   
                    $("#actualizaEvidencia").modal("hide");
                    $scope.regresarmisVales(1);
                }
            });
          } else {
              swal('Cancelado', 'No se aplicaron los cambios', 'error');
          }
      });


   
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
    async function ValidaRetenciones (idsucursal, tipoComprobante, areaAfectacion, conceptoContable) {
        return new Promise((resolve, reject) => {
        fondoFijoRepository.validaRetencionesOC(idsucursal, tipoComprobante, areaAfectacion, conceptoContable).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
        });
    });
    }
    async function guardaFacturas (sendData) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.guardarFactura(sendData).then(function (result) {
            if (result.data.length > 0) {
                resolve({estatus:1, ruta: result.data[0].saveURL, idValeEvidencia: result.data[0].idValeEvidencia});
            }
            else
            {reject({estatus:0})}
        });
    });
    }

    async function actualizarEvidencia (sendData) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.guardarEvidencia(sendData).then(function (result) {
            if (result.data.length > 0) {
                //resolve({estatus:1, ruta: result.data[0].saveURL, idValeEvidencia: result.data[0].idValeEvidencia});
                resolve(result.data[0])
            }
            else
            {reject({estatus:0})}
        });
    });
    }

    async function actualizarFactura (sendData) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.guardarFactura(sendData).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data[0])
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
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        $("#mostrarPdf").modal("show");
    }

    $scope.SubirFacturas = async function () {
        console.log( "montoEvidenciaVale a validar", $scope.subtotalVale, $scope.montoEvidenciaVale );
        $scope.bloqueoBoton = true;
        let errorvalidar =  $scope.EvidenciaPDF == undefined || $scope.EvidenciaPDF == null ||
                            $scope.tipoGasto == undefined || $scope.tipoGasto == 0 ||
                            //$scope.montoEvidenciaVale == undefined ||  $scope.montoEvidenciaVale == "" ||  $scope.montoEvidenciaVale == null ||
                            $scope.selCNC_CONCEPTO1 == undefined || $scope.selCNC_CONCEPTO1 == 0 ||  $scope.selCNC_CONCEPTO1 == '' ||
                            $scope.idConceptoSeleccion == undefined || $scope.idConceptoSeleccion == 0 ||  $scope.idConceptoSeleccion == '' ||
                            $scope.motivoEvidencia == undefined || $scope.motivoEvidencia == "" || $scope.motivoEvidencia ==  null ||
                            
                            $scope.idtipoComprobante == undefined || $scope.idtipoComprobante == null || $scope.idtipoComprobante == ''
                            || $scope.idtipoIVA === undefined || $scope.idtipoIVA === null || $scope.idtipoIVA == ''
                            $scope.EvidenciaXML == undefined || $scope.EvidenciaXML == null ? true : false;

        
        console.log( "idtipoComprobante", $scope.idtipoComprobante )
        console.log( "idtipoIVA", $scope.idtipoIVA )
        // return true;

        if(errorvalidar)
        {
        $scope.bloqueoBoton = false;
        swal("Atención", "Los campos son obligatorios.", "warning");
        }
        else
        {    
            // if($scope.montoEvidenciaVale >  parseFloat($scope.amountFondoFijo))
            if($scope.montoEvidenciaVale >  parseFloat($scope.amountFondoFijoFactura))
            {   
                $scope.bloqueoBoton = false;
                swal("Atención", "El monto maximo es de $ " + $scope.amountFondoFijoFactura, "warning");
            }
            else{
            var validaRet = await ValidaRetenciones($scope.valeSucursal, $scope.idtipoComprobante.PAR_IDENPARA, $scope.selCNC_CONCEPTO1, $scope.idConceptoSeleccion);
            if(validaRet[0].estatus == 1)
            {
           $("#agregaEvidencia").modal("hide");
           $('#loading').modal('show');
            var resolved = [];
            var errors = [];
            var facturas = [{tipo: 'xml', evidencia: $scope.EvidenciaXML}, {tipo: 'pdf', evidencia: $scope.EvidenciaPDF}]
            for (var item = 0; item < facturas.length; item++) 
            {        
            sendData = 
               {
                    idVale : $scope.idVale,
                    idEstatus : 1,
                    nombreArchivo: facturas[item].evidencia.nombreArchivo.split('.')[0],
                    extensionArchivo: facturas[item].evidencia.nombreArchivo.split('.')[1],
                    saveUrl: $scope.saveUrl + 'FondoFijo/' + 'FondoFijo_' + $scope.id_perTra + '/Vales_'+ $scope.idVale,
                    monto :  $scope.montoEvidenciaVale,
                    archivo: facturas[item].evidencia.archivo,
                    tipoGasto: $scope.tipoGasto,
                    areaAfectacion: $scope.selCNC_CONCEPTO1,
                    conceptoAfectacion: $scope.idConceptoSeleccion,
                    numeroCuenta: $scope.numeroCuenta,
                    tipoComprobante: $scope.idtipoComprobante.PAR_IDENPARA,
                    tipoIVA: $scope.idtipoIVA.PAR_IDENPARA,
                    IVA: $scope.ivaVale,
                    IVAretencion: $scope.retencion, 
                    ISRretencion: $scope.ISRretencion,
                    subTotal: $scope.subtotalVale,
                    motivoEvidencia: $scope.motivoEvidencia
                }
                resolved.push(await guardaFacturas(sendData));
            }
            setTimeout(function(){ console.log('pasaron 2 segundos') }, 2000);
            try {
                if(resolved[1].estatus == 1)
                {  
                    misTramitesValesRepository.validaFactura(resolved[0].ruta).then(function (result) {
                        //EVITA EL RESULT DE LA VALIDACION
                        result.data.return.codigo = 1;
                        if (parseInt(result.data.return.codigo) == 0) {
                            $('#loading').modal('hide');
                            $("#agregaEvidencia").modal("show");
                            swal('Error', '¡Factura no válida, por validaFactura!', 'error');
                        } else if (parseInt(result.data.return.codigo) == 2) {
                            $('#loading').modal('hide');
                            swal('Error', '¡No se ha podido verificar!', 'error');                       
                            $("#agregaEvidencia").modal("show");
                        } else {
                            var xmltemp = JSON.stringify(result.data.xml_objet)
                            xmltemp = xmltemp.replace(/\\"/g, ' ')
                            xmltemp = xmltemp.replace(/\\/g, '/')
                            xmltemp = xmltemp.toUpperCase()
                            var xml = JSON.parse(xmltemp)
                            var sxml = result.data.xml   
                            var UUID = xml['CFDI:COMPROBANTE']['CFDI:COMPLEMENTO'][0]['TFD:TIMBREFISCALDIGITAL'][0].$['UUID']
                            var RFC_Emisor = xml['CFDI:COMPROBANTE']['CFDI:EMISOR'][0].$['RFC']
                            var RFC_Emisor_Razon = xml['CFDI:COMPROBANTE']['CFDI:EMISOR'][0].$['NOMBRE']
                            var RFC_Receptor = xml['CFDI:COMPROBANTE']['CFDI:RECEPTOR'][0].$['RFC']
                            var subTotal = xml['CFDI:COMPROBANTE'].$['SUBTOTAL']
                            var Total = xml['CFDI:COMPROBANTE'].$['TOTAL']
                            var Fecha = xml['CFDI:COMPROBANTE'].$['FECHA']
    
                            if ((xml['CFDI:COMPROBANTE'].$['SERIE'] == undefined || xml['CFDI:COMPROBANTE'].$['SERIE'] == '') && (xml['CFDI:COMPROBANTE'].$['FOLIO'] == undefined || xml['CFDI:COMPROBANTE'].$['FOLIO'] == '')) {
                                Folio = xml['CFDI:COMPROBANTE']['CFDI:COMPLEMENTO'][0]['TFD:TIMBREFISCALDIGITAL'][0].$['UUID'];
                                var values = Folio.split('-');
                                var tamaño = values.length;
                                Folio = values[tamaño - 1];
                            } else if (xml['CFDI:COMPROBANTE'].$['SERIE'] == undefined || xml['CFDI:COMPROBANTE'].$['SERIE'] == '') {
                                Folio = xml['CFDI:COMPROBANTE'].$['FOLIO'];
                            } else {
                                Folio = xml['CFDI:COMPROBANTE'].$['SERIE'] + xml['CFDI:COMPROBANTE'].$['FOLIO'];
                            }
                            $scope.folioFactura = xml['CFDI:COMPROBANTE'].$['FOLIO'];
                            $scope.serieFactura = xml['CFDI:COMPROBANTE'].$['SERIE'];
                            var parametros = 
                            {
                                idVale : resolved[1].idValeEvidencia,
                                numFactura: Folio,
                                uuid: UUID,
                                fechaFactura: Fecha,
                                subTotal: subTotal,
                                iva: subTotal * 0.16,
                                total: Total,
                                //xml: sxml,
                                rfcEmisor: RFC_Emisor,
                                rfcEmisorRazon: RFC_Emisor_Razon,
                                rfcReceptor: RFC_Receptor,
                                mesCorriente: $scope.mesCorriente,
                                tipoNotificacion: $scope.tipoNotificacion,
                                estatusNotificacion: $scope.estatusNotificacion
                            }
                            misTramitesValesRepository.insertarFactura(parametros).then(function (result) {
                                if (result.data[0].success == 1)
                                {
                                $('#loading').modal('hide');
                                $scope.tipoEvidencias = [];
                                $scope.montoEvidenciaVale = null;
                                $scope.EvidenciaVale = null;
                                $scope.EvidenciaPDF = null;
                                $scope.EvidenciaXML = null;
                                $scope.listaValesFF($scope.id_perTra, $scope.idVale); 
                                if(result.data[0].existeProveedor == 0)
                                {
                                    swal('Atención', 'La factura contiene un proveedor no localizado, Razón: ' + $scope.xmlRazonEmisor + ', se guardo como proveedor vario', 'warning');
                                }
                                if($scope.mesCorriente ==3)
                                {
                                    swal('Atención', 'La factura contiene una Fecha de un periodo cerrado, favor de enviar a Finanzas para su revisión' ,'warning');
                                }
                                if($scope.mesCorriente ==4)
                                {
                                    swal('Atención', 'La factura contiene una Fecha de meses anteriores, favor de enviar a Finanzas para su revisión' ,'warning');
                                }
                                if($scope.mesCorriente ==5)
                                {
                                    swal('Atención', 'La factura contiene una Fecha de un año anterior, favor de enviar a Finanzas para su revisión' ,'warning');
                                }
                                } 
                                else if (result.data[0].success == 2)
                                {
                                    eliminaFacturas(resolved);
                                    $('#loading').modal('hide');
                                    $scope.tipoEvidencias = [];
                                    $scope.montoEvidenciaVale = null;
                                    $scope.EvidenciaVale = null;
                                    $scope.EvidenciaPDF = null;
                                    $scope.EvidenciaXML = null;
                                    swal('Error', 'La factura ya fue agregada previamente como evidencia', 'error');
                                }
                                else if (result.data[0].success == 3)
                                {
                                    eliminaFacturas(resolved);
                                    $('#loading').modal('hide');
                                    $scope.tipoEvidencias = [];
                                    $scope.montoEvidenciaVale = null;
                                    $scope.EvidenciaVale = null;
                                    $scope.EvidenciaPDF = null;
                                    $scope.EvidenciaXML = null;
                                    swal('Error', 'El monto de la factura no es suficiente', 'error');
                                }
                                else {
                                    $('#loading').modal('hide');
                                    $("#agregaEvidencia").modal("show");
                                    swal('Error', 'La factura no pudo ser guardada, intente nuevamente.', 'error');
                                   
                                }
                            }, function (error) {
                                $('#loading').modal('hide');
                                swal('Error', '¡Factura no guardada!', 'error');
                                $("#agregaEvidencia").modal("show");
                                //misTramitesValesRepository.eliminaFactura(item.PathDB)
                            })
                        }
                    }, function (error) {
                        $('#loading').modal('hide');
                        $("#agregaEvidencia").modal("show");
                        swal('Error', 'Ocurrió un error en la petición de validar factura', 'error');
                    });
                }
            } catch (e) {
                errors.push(e);
            }
        }
        else
        { 
            $scope.bloqueoBoton = false;
            swal("Atención",validaRet[0].mensaje , "warning");
        }
        }
    }
    };

    $scope.AutorizarRechazarEvidencia = function (item,tipo) {
        $('#loading').modal('show');
        misTramitesValesRepository.updateTramiteValeEvidencia(item.idValeEvidencia,tipo,'').then(function (result) {
            if (result.data.length > 0) {
                $scope.listaValesFF($scope.id_perTra, item.idVale); 
                $('#loading').modal('hide');
            }
            else
            {
                $('#loading').modal('hide');
            }
        });
    }

    eliminaFacturas= async function (datos) {
       var x = datos;
       var resolved = [];
       var errors = [];
       for (var item = 0; item < datos.length; item++) 
       {  
        resolved.push(await eliminaFactura(datos[item].idValeEvidencia));
       }     
    };


    async function eliminaFactura (idValeEvidencia) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.EliminarEvidenciaFactura(idValeEvidencia).then(function (result) {
            if (result.data.length > 0) {
                resolve({estatus:1});
            }
            else
            {reject({estatus:0})}
        });
    });
    }

    $scope.modalComentarios = function (item,tipo) {
        $scope.itemRechazo = item;
        $scope.tipoRechazo = tipo;
        $("#rechazarDoc").modal("show");
    };

    $scope.cancelRechazo = function () {
        $("#rechazarDoc").modal("hide");
        $scope.razonesRechazo = '';
    }
    
    $scope.sendRechazo = function () {
        if ($scope.razonesRechazo == '') {
            swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
        } else {
            $("#rechazarDoc").modal("hide");
            $("#loading").modal("show");
            misTramitesValesRepository.updateTramiteValeEvidencia($scope.itemRechazo.idValeEvidencia,$scope.tipoRechazo,$scope.razonesRechazo).then(function (result) {
                if (result.data.length > 0) {
                    $scope.listaValesFF($scope.id_perTra, $scope.itemRechazo.idVale); 
                    $('#loading').modal('hide');
                }
                else
                {
                    $('#loading').modal('hide');
                }
            });
        }
    }

    $scope.eliminarEvidencia = function (item) {
        $('#loading').modal('show');
        misTramitesValesRepository.eliminarEvidencia(item.idValeEvidencia,item.evidencia).then(function (result) {
            if (result.data.length > 0) {
                $scope.listaValesFF($scope.id_perTra, item.idVale); 
                $('#loading').modal('hide');
            }
            else
            {
                $('#loading').modal('hide');
            }
        });
    }

    $scope.goParametros = function() {
        //localStorage.removeItem('borrador');
        $scope.limpiar();
        $scope.frmNewVale = false;
        $scope.btnVale = false;
        $scope.estatusVale = 0;
        $scope.frmlistVales = false;
        $scope.frmComprovarVale = false;
        $scope.frmParametros = true;
        $scope.frmValeRecepcion = false;
        $scope.btnParametro= false;
    }

    $scope.getParamFF = function () {
        misTramitesValesRepository.getParametroFF($rootScope.user.usu_idusuario).then((res) => {
            $scope.parametro = parseInt(res.data[0].porcentaje);
        });
    }

    $scope.getParametro = function (parametro) {
        fondoFijoRepository.paramFondoFijo(parametro).then((res) => {
            $scope.amountFondoFijo = parseInt(res.data[0].pr_descripcion);
        });
    }

    $scope.getParametroFactura = function (parametro) {
        fondoFijoRepository.paramFondoFijo(parametro).then((res) => {
            $scope.amountFondoFijoFactura = parseInt(res.data[0].pr_descripcion);
        });
    }
    
    $scope.actualizarParametro = function () {
       errorParametro = $scope.parametro == undefined || $scope.parametro == "" ? true : false;
       if(errorParametro)
       {
       swal("Atención", "Los campos son obligatorios.", "warning");
       }
       else
       {
        misTramitesValesRepository.updParametroFondoFijo($rootScope.user.usu_idusuario,$scope.parametro).then((res) => {
            if(res.data[0].success == 1)
            {
            swal("Exito", "Parametro Actualizado", "success");
            $scope.getParamFF();
            }
        });
        }
    }

    $scope.checkFF= function () {
        if($scope.checkboxFF){
            $scope.dobleFF = true;
        } else {
            $scope.dobleFF = false;
            $scope.importeVale2 = "";
        }
    };

    $scope.validaValeDoble = function () {

        errorVale =    $scope.FFSucursal == undefined || $scope.FFSucursal == 0 ||
                       $scope.FFSucursal2 == undefined || $scope.FFSucursal2 == 0 ||
                       $scope.tipoGasto == undefined || $scope.tipoGasto == 0 ||
                       $scope.importeVale == undefined ||  $scope.importeVale ==  ""||
                       $scope.importeVale2 == undefined ||  $scope.importeVale2 ==  ""||
                       $scope.descripcionVale == undefined || $scope.descripcionVale == "" ? true : false;
        if(errorVale)
        {
          swal("Atención", "Los campos son obligatorios.", "warning");
        }
        else
        {
            dataSave = {
                idUsuario: $rootScope.user.usu_idusuario,
                descripcion: $scope.descripcionVale,
                estatus: 1,
                importe: parseFloat($scope.importeVale) + parseFloat($scope.importeVale2),
                idFondoFijo: $scope.FFSucursal,
                idtipoGasto: $scope.tipoGasto,
                valeCompuesto: 1,
                idFondoFijo2: $scope.FFSucursal2,
                importeFF1: parseFloat($scope.importeVale),
                importeFF2: parseFloat($scope.importeVale2),
                }
          $scope.guardarvale(dataSave);
        }
    };
    
$scope.validaValeAct = function () {

        errorVale =     $scope.FFSucursal == undefined || $scope.FFSucursal == 0 ||
                       $scope.importeVale == undefined ||  $scope.importeVale ==  ""||
                       $scope.descripcionVale == undefined || $scope.descripcionVale == "" ? true : false;
        if(errorVale)
        {
          swal("Atención", "Los campos son obligatorios.", "warning");
        }
        if($scope.depVale == null || $scope.depVale == "" || $scope.depVale == 0) 	// Coal EYH 02022022
            {
            swal("Atención", "El Departamento es obligatorio.", "warning");
            }
        else
        {
            dataSave = {
                idVale: $scope.idVale,
                descripcion: $scope.descripcionVale,
                estatus: 1,
                importe: parseFloat($scope.importeVale),
                idFondoFijo: $scope.FFSucursal,
                idtipoGasto: $scope.tipoGasto,
                idAutorizador: $scope.autorizador,
                valeCompuesto: 0,
                idFondoFijo2: 0,
                importeFF1: 0,
                importeFF2: 0,
                }
          $scope.guardarvale(dataSave);
        }
    };


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

    async function promiseInsertaDatos(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto,canal) {
        return new Promise((resolve, reject) => {
            fondoFijoRepository.insertaPoliza(idusuario,idsucursal,tipoProceso,documentoOrigen,ventaUnitario,tipoProducto, canal).then(function (result) {
                if (result.data.length > 0) {
                    resolve(true);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    
    /////////Se agrega para notificar la aprobación o rechazo del vale
    $scope.sendNotificacion = function (resf) {
        //$("#loading").modal("show");
        var tipoNot = 16;
    
        var notG = {
            //Obtener el id del vale
            "identificador": parseInt(resf.data[0].id),
            "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la aprobación del vale "+ resf.data[0].vale +
            " por la cantidad de $" + formatMoney(resf.data[0].importe) + " pesos.",
            "idSolicitante": $scope.user.usu_idusuario,
            "idTipoNotificacion": tipoNot,
            "linkBPRO": global_settings.urlCORS + "aprobarVale?employee=67&idVale=" + resf.data[0].vale,
            "notAdjunto": "",
            "notAdjuntoTipo": "",
            "idEmpresa": resf.data[0].idEmpresa,
            "idSucursal": resf.data[0].idSucursal,
            "departamentoId": resf.data[0].idDepartamento
        };
        
        clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
    
                let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a aprobación a genrente de area', 1, 1);
                html = ` ${$scope.html1} Solicitud de Aprobación de Vale <br><br>Estimado(a) ${$scope.nombreAutorizador} el Vale ${resf.data[0].vale} fue solicitado, por la cantidad de $${formatMoney(resf.data[0].importe)}  <br><br>
                Usuario Tramites: ${$rootScope.user.nombre} <br>
                Usuario BPRO:  ${$scope.nombrePersona}
                ${$scope.html2}
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Tramite</a></p>
                <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                
                //$scope.sendMail("jorge.conelly@coalmx.com", resf.data[0].asunto, html);
                var correoAutorizador = $scope.correoAutorizador;
                $scope.sendMail(correoAutorizador, resf.data[0].asunto, html);
                //$("#loading").modal("hide");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                //Eliminar el vale ya que va a existir una inconsistencia entre el vale creado
                //y la notificación ya que no se pudo notificar 
                $scope.eliminarSolicitudVale(resf.data[0].id, resf.data[0].vale)

                $("#loading").modal("hide");
            }
        });
    }
    ////////////////FIN

        /////////Se agrega verificar a qué autorizador se le va a enviar la notificación
        $scope.eliminarSolicitudVale = function (id, idVale) {
            misTramitesValesRepository.getEliminarSolicitudVale(id, idVale).then((res) => {
                if (res.data[0].success == 1) {
                    console.log("Se eliminó la solicitud de vale");
                } else {
                    console.log("Ocurrió un error al eliminar la solicitud de vale");
                }
            });
        }

     /////////Se agrega verificar a qué autorizador se le va a enviar la notificación
     $scope.buscarAutorizador = function () {
        misTramitesValesRepository.getBuscarAutorizador($scope.FFSucursal).then((res) => {
            //$scope.idEmpresa = res.data[0].idEmpresa;
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].usu_correo;
            $scope.nombreAutorizador = res.data[0].nombreUsuario; 
        });
    }

    $scope.AutorizadorVale = function () {
        if($scope.depVale != null)
        {
            $scope.idAutorizador = $scope.depVale.idAutorizador;
            $scope.correoAutorizador = $scope.depVale.correo;
            $scope.nombreAutorizador = $scope.depVale.autorizador; 
	    $scope.nomAutorizador = $scope.depVale.nomAutorizador; 
        }
    }
    async function verificaValesEvidencia(idVale) {
        return new Promise((resolve, reject) => {
            fondoFijoRepository.verificaValesEvidencia(idVale).then(function (result) {
                if (result.data.length > 0) {
                    resolve(result.data[0]);
                }
            }).catch(err => {
                reject(false);
            });
    
        });
    }

    $scope.actualizarMontos = function () {

        if( $scope.verFactura ){
            if( $scope.idtipoIVA === undefined || $scope.idtipoComprobante === undefined){
                $scope.tipoRetencion = false;
                return true;
            }    
        }
        

        $scope.comprobante = $scope.idtipoComprobante;
        $scope.ivaCalc = $scope.idtipoIVA;
        if($scope.montoEvidenciaVale != undefined)
        {

            let retIVA = (Number($scope.comprobante.PAR_IMPORTE1 / 100));
            let retISR = (Number($scope.comprobante.PAR_IMPORTE2 / 100));
            let subTotal =(Number($scope.montoEvidenciaVale)  /(1 + (Number($scope.ivaCalc.PAR_IMPORTE1)/100))).toFixed(2);
            let IVA = (Number($scope.ivaCalc.PAR_IMPORTE1)/100);
            $scope.ivaVale = (subTotal * IVA).toFixed(2);
            $scope.retencion = retIVA == 0 ? 0 :(subTotal *  retIVA).toFixed(2);
            $scope.ISRretencion = retISR == 0 ? 0 : (subTotal *  retISR).toFixed(2);
            if(retIVA == 0 && retISR == 0)
            {
                $scope.subtotalVale = (Number($scope.montoEvidenciaVale) - Number($scope.ivaVale));
            }
            else if (retIVA != 0 && retISR == 0)
            {
                let iva =  Number($scope.ivaVale) - Number($scope.retencion);
                $scope.subtotalVale = (Number(subTotal) - Number(iva));
            }
            else
            {
                $scope.subtotalVale =  (Number(subTotal) + Number($scope.ivaVale) - Number($scope.retencion) - Number($scope.ISRretencion)).toFixed(2);
            }

            // let retIVA = (Number($scope.comprobante.PAR_IMPORTE1 / 100));
            // let retISR = (Number($scope.comprobante.PAR_IMPORTE2 / 100));
            // $scope.ivaVale = (Number($scope.montoEvidenciaVale) * (Number($scope.ivaCalc.PAR_IMPORTE1)/100)).toFixed(2);
            // $scope.retencion = retIVA == 0 ? 0 :(Number($scope.montoEvidenciaVale) *  retIVA).toFixed(2);
            // $scope.ISRretencion = retISR == 0 ? 0 : (Number($scope.montoEvidenciaVale) *  retISR).toFixed(2);
            // if(retIVA == 0 && retISR == 0)
            // {
            //     $scope.subtotalVale = (Number($scope.montoEvidenciaVale) - Number($scope.ivaVale));
            // }
            // else if (retIVA != 0 && retISR == 0)
            // {
            //     let iva =  Number($scope.ivaVale) - Number($scope.retencion);
            //     $scope.subtotalVale = (Number($scope.montoEvidenciaVale) - Number(iva));
            // }
            // else
            // {
            //     $scope.subtotalVale =  (Number($scope.montoEvidenciaVale) + Number($scope.ivaVale) - Number($scope.retencion) - Number($scope.ISRretencion)).toFixed(2);
            // }
          
            // // if($scope.comprobante.PAR_DESCRIP1.toUpperCase == 'FACTURA')
            // // {
            // //     $scope.ivaVale = (Number($scope.montoEvidenciaVale) * .16).toFixed(2);
            // //     $scope.retencion = 0;
            // //     $scope.subtotalVale = (Number($scope.montoEvidenciaVale) / 1.16).toFixed(2);
            // // }
            // // else
            // // {
            // //     let ret = (100 / Number($scope.comprobante.PAR_IMPORTE1)).toFixed(2);
            // //     $scope.ivaVale = (Number($scope.montoEvidenciaVale) * .16).toFixed(2);
            // //     $scope.retencion = ((Number($scope.montoEvidenciaVale) - Number($scope.ivaVale))/  ret).toFixed(2);
            // //     $scope.subtotalVale = (Number($scope.montoEvidenciaVale) - Number($scope.ivaVale) - Number($scope.retencion)).toFixed(2);

            // // }
            $scope.tipoRetencion = true;
        }
        else
        {
            $scope.tipoRetencion = false;
        }

    }; 

    $scope.buscarPersona = function (idPersona) {
        if(idPersona == 0  || idPersona == undefined || idPersona == '' || idPersona == null)
        {
            swal("Atención", "El Id BPRO es necesario.", "warning");
        }
        else
        {

            var esid = 0;
            var esnombre = 0;
            var nombre ='';
            var esRFC = rfcValido(idPersona);
            if(esRFC == 0)           
            {
                esid = tiene_numeros(idPersona);
                if(esid == 0)
                {
                var divisiones = idPersona.split(" ");
                esnombre = 1;
                nombre = divisiones[0];
                }
            }
            
            misTramitesValesRepository.getBuscarPersona(idPersona, esid, esRFC, esnombre, nombre, $scope.idSucursalEmpleado).then((res) => {
                if (res.data[0].estatus == 1) {
                    $scope.idPersona = res.data[0].idPersona;
                    $scope.nombrePersona = res.data[0].nombre;
                    $scope.verNombrePersona = true;
                    $scope.activabtn = true;
                } else {
                    swal("Atención", res.data[0].msj, "warning");
                    $scope.verNombrePersona = false;
                    $scope.activabtn = false;
                }
            });
        }
    }

    function tiene_numeros(texto){
        var numeros="0123456789";
        for(i=0; i<texto.length; i++){
           if (numeros.indexOf(texto.charAt(i),0)!=-1){
              return 1;
           }
        }
        return 0;
     }

     function rfcValido(rfc, aceptarGenerico = true) {
        const re       = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
        var   validado = rfc.match(re);
    
        if (!validado)  //Coincide con el formato general del regex?
            return 0;
    
        //Separar el dígito verificador del resto del RFC
        const digitoVerificador = validado.pop(),
              rfcSinDigito      = validado.slice(1).join(''),
              len               = rfcSinDigito.length,
    
        //Obtener el digito esperado
              diccionario       = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
              indice            = len + 1;
        var   suma,
              digitoEsperado;
    
        if (len == 12) suma = 0
        else suma = 481; //Ajuste para persona moral
    
        for(var i=0; i<len; i++)
            suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
        digitoEsperado = 11 - suma % 11;
        if (digitoEsperado == 11) digitoEsperado = 0;
        else if (digitoEsperado == 10) digitoEsperado = "A";
    
        //El dígito verificador coincide con el esperado?
        // o es un RFC Genérico (ventas a público general)?
        if ((digitoVerificador != digitoEsperado)
         && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
            return 0;
        else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
            return 0;
        return 1;
    }
    // $scope.actualizarConceptoGasto = function () {
    //           //Validar tipoIVA
     
    //           if($scope.selCNC_CONCEPTO1 != undefined && $scope.idtipoComprobante != undefined)
    //           {
    //               $scope.getConceptoAfectacion($scope.selEmpresa, $scope.selSucursal, $scope.selCNC_CONCEPTO1, $scope.idtipoComprobante );
    //           }
    //           $scope.actualizarMontos();
    // }
 
    $scope.$watch('EvidenciaXML', function (nv, ov) {
        console.log('$watch EvidenciaXML')
        if (!$scope.extraerRFC(nv)) {
            $scope.EvidenciaXML = ov;
        }
    }, false);

    $scope.extraerRFC = async function(nv) {
        try{
            if (!nv || nv == null)
                return true;

            $scope.verTipoFactura = true;
            var parts = nv.archivo.split(',');
            var xml = atob(parts[1]);

            if (xml.substr(0, 3) === 'ï»¿')
                xml = xml.substr(3);
            if (xml.substr(0, 3) === 'o;?')
            {
                swal('Alto', 'Error la factura tiene caracteres invalidos o;?', 'warning');
                $scope.xmlRFC = '';
                $scope.EvidenciaXML = null;
                return false;
                //xml = xml.substr(3);
            }
               
            
                parser = new DOMParser();
            xmlDocument = parser.parseFromString(xml, "text/xml");

            $scope.mesCorriente = 1;
            $scope.tipoNotificacion = 0;
            $scope.estatusNotificacion = 0;

            $scope.xmlRFC = xmlDocument.getElementsByTagName("cfdi:Receptor")[0].getAttribute('Rfc');
            $scope.xmlRazonEmisor = xmlDocument.getElementsByTagName("cfdi:Emisor")[0].getAttribute('Nombre');
            $scope.montoEvidenciaVale = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('Total');
            $scope.FormaPago = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('FormaPago');
            $scope.fechaFacturaEvidenciaVale = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('Fecha');
            $scope.fechaFacturaEvidenciaVale = $scope.fechaFacturaEvidenciaVale.substring(0, 10);
            var yearFac = $scope.fechaFacturaEvidenciaVale.substring(0, 4);
            var monthFac = $scope.fechaFacturaEvidenciaVale.substring(7, 5);

            let dateObj = new Date();
            let month = String(dateObj.getMonth() + 1).padStart(2, '0');
            let day = String(dateObj.getDate()).padStart(2, '0');
            let year = dateObj.getFullYear();
            fecha = year + "-" + month + "-" + day;

            //if ($scope.FormaPago != '01') {
            //    swal('Alto', 'Se solicita que método de pago sea en efectivo', 'warning');
            //    $scope.FormaPago = '';
            //    $scope.EvidenciaXML = null;
            //    return false;
            //}
            if ($scope.xmlRFC != $scope.empresaRFC) {
                swal('Alto', 'El RFC del documento (' + $scope.xmlRFC + ') no coincide con el de la empresa (' + $scope.empresaRFC + ').', 'warning');
                $scope.xmlRFC = '';
                $scope.EvidenciaXML = null;
                return false;
            }
            $scope.pasaFactura = true;
            if (Number(yearFac) < year) {
                swal('Alto', 'La factura es de un año pasado, Favor de solicitar al proveedor: La actualización de la factura con fecha del mes corriente.', 'warning');
                $scope.mesCorriente = 5;
                $scope.tipoNotificacion = 2;
                $scope.estatusNotificacion = 1;
            } else {
                if (Number(monthFac) < Number(month)) {
                    let mesPasado = Number(month) - Number(monthFac);
                    //Mes inmediato Anterior
                    if (mesPasado == 1) {
                        //Validar si el mes anterior esta abierto
                        let periodo = yearFac + monthFac;
                        var periodoContable = await validaPeriodoContable($scope.valeSucursal, periodo);
                        if (periodoContable[0].PAR_DESCRIP2 == 'ABIERTO') {
                            $scope.mesCorriente = 2;
                            $scope.tipoNotificacion = 0;
                            $scope.estatusNotificacion = 0;
                        } else {
                            //Enviar notificacion para finanzas
                            $scope.mesCorriente = 3;
                            $scope.tipoNotificacion = 1;
                            $scope.estatusNotificacion = 1;
                        }

                    }
                    //Mes pasados
                    else {
                        swal('Alto', 'Favor de solicitar al proveedor: La actualización de la factura con fecha del mes corriente.', 'warning');
                        $scope.mesCorriente = 4;
                        $scope.tipoNotificacion = 1;
                        $scope.estatusNotificacion = 1;
                    }
                }
            }
            //var jsonXML = JSON.parse(JSON.stringify(xmlToJson($.parseXML(xml))));
            var conceptos = '';
            var jsonXML = JSON.parse(JSON.stringify(xmlToJson(xmlDocument)));

            if (jsonXML['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto']['cfdi:Impuestos'] != undefined) {
                console.log($scope.tipoComprobanteList);
                console.log($scope.IVAList);
                conceptos = jsonXML['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto']['cfdi:Impuestos'];

                if (conceptos['cfdi:Retenciones'] != undefined) {
                    var retenciones = conceptos['cfdi:Retenciones']['cfdi:Retencion'];
                    var retArray = Array.isArray(retenciones);
                    var traslados = conceptos['cfdi:Traslados']['cfdi:Traslado'];
                    var trasArray = Array.isArray(traslados);
                    var tieneISR = false;
                    var tieneIVA = false;
                    var tipoComprobante = '';
                    var nombreComprobante = '';
                    var tipoIVA = '';
                    var nombreIVA = '';
                    if (retArray) {
                        retenciones.forEach(function(retencion) {
                            console.log("===================", 1);
                            var x = retencion['@attributes'];
                            let TasaOCuota = retencion['@attributes'].TasaOCuota * 100;
                            $scope.tipoComprobanteList.forEach(function(tipo) {
                                if (tipo.PAR_IMPORTE1 > 0) {
                                    if (tipo.PAR_IMPORTE1 == TasaOCuota) {
                                        tipoComprobante = tipo;
                                        console.log("===================", 2);
                                        tieneISR = true;
                                    }
                                }
                                if (tipo.PAR_IMPORTE2 > 0) {
                                    if (tipo.PAR_IMPORTE2 == TasaOCuota) {
                                        tipoComprobante = tipo;
                                        console.log("===================", 3);
                                    }
                                }

                            });
                        });
                    } else {

                        $scope.tipoComprobanteList.forEach(function(tipo) {
                            console.log("===================", tipo);
                            if (tipo.PAR_IMPORTE1 > 0) {
                                let TasaOCuota = parseFloat(retenciones['@attributes'].TasaOCuota * 100).toFixed(4);
                                TasaOCuota = TasaOCuota.includes('10.66') ? 10.6667 : TasaOCuota;
                                if (tipo.PAR_IMPORTE1 == TasaOCuota) {
                                    tipoComprobante = tipo;
                                    console.log("===================", 4);
                                    tieneISR = true;
                                }
                            }
                        });

                    }
                    if (trasArray) {
                        traslados.forEach(function(traslado) {
                            var z = traslado['@attributes'];
                            let TasaOCuota = traslado['@attributes'].TasaOCuota * 100;
                            $scope.IVAList.forEach(function(tipo) {
                                if (tipo.PAR_IMPORTE1 == TasaOCuota) {
                                    tipoIVA = tipo;
                                }
                            });
                        });
                    } else {
                        let TasaOCuota = traslados['@attributes'].TasaOCuota * 100;
                        $scope.IVAList.forEach(function(tipo) {
                            if (tipo.PAR_IMPORTE1 == TasaOCuota) {
                                tipoIVA = tipo;
                            }
                        });
                    }
                    console.log("===================", 5);
                    $scope.idtipoComprobante = tipoComprobante;
                    $scope.idtipoIVA = tipoIVA;
                } else {
                    var traslados = conceptos['cfdi:Traslados']['cfdi:Traslado'];
                    var trasArray = Array.isArray(traslados);
                    if (trasArray) {
                        traslados.forEach(function(traslado) {
                            var z = traslado['@attributes'];
                            let TasaOCuota = traslado['@attributes'].TasaOCuota * 100;
                            $scope.IVAList.forEach(function(tipo) {
                                if (tipo.PAR_IMPORTE1 == TasaOCuota) {
                                    tipoIVA = tipo;
                                }
                            });
                        });
                    } else {
                        let TasaOCuota = traslados['@attributes'].TasaOCuota * 100;
                        $scope.IVAList.forEach(function(tipo) {
                            if (tipo.PAR_IMPORTE1 == TasaOCuota) {
                                tipoIVA = tipo;
                            }
                        });
                    }
                    console.log("===================", 6);
                    $scope.idtipoComprobante = $scope.tipoComprobanteList.filter(tipo => tipo.PAR_IMPORTE1 == 0 && tipo.PAR_IMPORTE2 == 0)[0];
                    $scope.idtipoIVA = tipoIVA;
                }

            } else {
                console.log($scope.tipoComprobanteList);
                console.log($scope.IVAList);
                console.log("===================", 7);
                conceptos = jsonXML['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto'];
                var concepArray = Array.isArray(traslados);
                if (concepArray) {
                    conceptos.forEach(function(concepto) {
                        var x = concepto;
                        var Traslados = concepto['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado']['@attributes'];
                        $scope.idtipoComprobante = $scope.tipoComprobanteList.filter(tipo => tipo.PAR_IMPORTE1 == 0 && tipo.PAR_IMPORTE2 == 0)[0];
                        $scope.idtipoIVA = $scope.IVAList.filter(iva => iva.PAR_IMPORTE1 == (Traslados.TasaOCuota * 100))[0]
                    });
                }
                else
                {
                    $scope.idtipoComprobante =  $scope.tipoComprobanteList.length == 0 ? '' :  $scope.tipoComprobanteList.filter(tipo => tipo.PAR_IMPORTE1 == 0 && tipo.PAR_IMPORTE2 == 0)[0];
                    $scope.idtipoIVA = $scope.IVAList.length == 0 ? '' :  $scope.IVAList.filter(iva => iva.PAR_IMPORTE1 == '0')[0];
                
                }
            }

            console.log("===================", 8);
            $scope.verTipoFactura = true;
            $scope.tipoRetencion = true;
            $scope.actualizarMontos()
            return true;
        }
        catch( e ){
            $scope.disabledCoprobanteData = false;
            //console.warning("Error al cargar factura: ", e);
            swal('Alto', 'Ocurrio un error en la lectura de la factura XML', 'warning');
            $scope.xmlRFC = '';
            $scope.EvidenciaXML = null;

        }
        
    }

    // $scope.extraerRFC = async function (nv) {

    //     if (!nv || nv == null)
    //         return true;

    //     var parts = nv.archivo.split(',');
    //     var xml = atob(parts[1]);

    //     if (xml.substr(0, 3) === 'ï»¿')
    //         xml = xml.substr(3);

    //     parser = new DOMParser();
    //     xmlDocument = parser.parseFromString(xml, "text/xml");

    //     $scope.mesCorriente = 1;
    //     $scope.tipoNotificacion = 0;
    //     $scope.estatusNotificacion = 0;

    //     $scope.xmlRFC = xmlDocument.getElementsByTagName("cfdi:Receptor")[0].getAttribute('Rfc');
    //     $scope.xmlRazonEmisor = xmlDocument.getElementsByTagName("cfdi:Emisor")[0].getAttribute('Nombre');
    //     $scope.montoEvidenciaVale  = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('Total');
    //     $scope.FormaPago  = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('FormaPago');
    //     $scope.fechaFacturaEvidenciaVale  = xmlDocument.getElementsByTagName("cfdi:Comprobante")[0].getAttribute('Fecha');
    //     $scope.fechaFacturaEvidenciaVale = $scope.fechaFacturaEvidenciaVale.substring(0, 10);
    //     var yearFac = $scope.fechaFacturaEvidenciaVale.substring(0, 4);
    //     var monthFac = $scope.fechaFacturaEvidenciaVale.substring(7, 5);

    //     let dateObj = new Date();
    //     let month =  String(dateObj.getMonth() +1).padStart(2, '0');
    //     let day = String(dateObj.getDate()).padStart(2, '0');
    //     let year = dateObj.getFullYear();
    //     fecha =  year + "-" + month + "-" + day;
     
    // if ($scope.FormaPago != '01') {
    //     swal('Alto', 'Se solicita que método de pago sea en efectivo', 'warning');
    //     $scope.FormaPago = '';
    //     $scope.EvidenciaXML = null;
    //     return false;
    // }
    // if ($scope.xmlRFC != $scope.empresaRFC) {
    //     swal('Alto', 'El RFC del documento (' + $scope.xmlRFC + ') no coincide con el de la empresa (' + $scope.empresaRFC + ').', 'warning');
    //     $scope.xmlRFC = '';
    //     $scope.EvidenciaXML = null;
    //     return false;
    // }
    // $scope.pasaFactura = true;
    // if(Number(yearFac) < year)
    // {
    //     swal('Alto', 'La factura es de un año pasado, Favor de solicitar al proveedor: La actualización de la factura con fecha del mes corriente.', 'warning');           
    //     $scope.mesCorriente = 5;
    //     $scope.tipoNotificacion = 2;
    //     $scope.estatusNotificacion = 1;
    // }
    // else
    // {
    //     if(Number(monthFac) < Number(month))
    //     {
    //         let mesPasado = Number(month) - Number(monthFac);
    //         //Mes inmediato Anterior
    //         if(mesPasado == 1)
    //         {
    //         //Validar si el mes anterior esta abierto
    //         let periodo = yearFac + monthFac;
    //         var periodoContable = await validaPeriodoContable($scope.valeSucursal,periodo);
    //         if(periodoContable[0].PAR_DESCRIP2 == 'ABIERTO')
    //         {
    //             $scope.mesCorriente = 2;
    //             $scope.tipoNotificacion = 0;
    //             $scope.estatusNotificacion = 0; 
    //         }
    //         else
    //         {
    //         //Enviar notificacion para finanzas
    //             $scope.mesCorriente = 3;
    //             $scope.tipoNotificacion = 1;
    //             $scope.estatusNotificacion = 1;
    //         }

    //         }
    //         //Mes pasados
    //         else
    //         {
    //         swal('Alto', 'Favor de solicitar al proveedor: La actualización de la factura con fecha del mes corriente.', 'warning');
    //             $scope.mesCorriente = 4;
    //             $scope.tipoNotificacion = 1;
    //             $scope.estatusNotificacion = 1;
    //         }
    //     }
    // }

    //     var jsonXML = JSON.parse(JSON.stringify(xmlToJson($.parseXML(xml))));
    //     var conceptos = '';
    //     if(jsonXML['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto']['cfdi:Impuestos'] != undefined)
    //     {
    //         console.log($scope.tipoComprobanteList);
    //         console.log($scope.IVAList);
    //         conceptos = jsonXML['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto']['cfdi:Impuestos'];

    //         if(conceptos['cfdi:Retenciones'] != undefined)
    //         {
    //             var retenciones = conceptos['cfdi:Retenciones']['cfdi:Retencion'];
    //             var retArray = Array.isArray(retenciones);
    //             var traslados =  conceptos['cfdi:Traslados']['cfdi:Traslado'];
    //             var trasArray = Array.isArray(traslados);
    //             var tieneISR = false;
    //             var tieneIVA = false;
    //             var tipoComprobante = '';
    //             var nombreComprobante = '';
    //             var tipoIVA = '';
    //             var nombreIVA = '';
    //             if(retArray)
    //             {
    //             retenciones.forEach(function (retencion) {
    //                 var x = retencion['@attributes'];  
    //                 let TasaOCuota =   retencion['@attributes'].TasaOCuota * 100;
    //                 $scope.tipoComprobanteList.forEach(function (tipo) {
    //                     if(tipo.PAR_IMPORTE1 > 0)
    //                     {
    //                         if(tipo.PAR_IMPORTE1 == TasaOCuota)
    //                         {
    //                             tipoComprobante = tipo;
    //                             tieneISR = true;
    //                         }
    //                     }
    //                     if(tipo.PAR_IMPORTE2 > 0)
    //                     {
    //                         if(tipo.PAR_IMPORTE2 == TasaOCuota)
    //                         {
    //                             tipoComprobante = tipo;
    //                         }
    //                     }
                        
    //                 });
    //             });
    //             }
    //             else
    //             {
    //                 $scope.tipoComprobanteList.forEach(function (tipo) {
    //                     if(tipo.PAR_IMPORTE1 > 0)
    //                     {
    //                         let TasaOCuota=  parseFloat(retenciones['@attributes'].TasaOCuota *100).toFixed(4);
    //                         TasaOCuota = TasaOCuota.includes('10.66') ? 10.6667 :TasaOCuota;
    //                         if(tipo.PAR_IMPORTE1 == TasaOCuota)
    //                         {
    //                             tipoComprobante = tipo;
    //                             tieneISR = true;
    //                         }
    //                     }                        
    //                 });

    //             }
    //             if(trasArray)
    //             {
    //             traslados.forEach(function (traslado) {
    //                 var z = traslado['@attributes']; 
    //                 let TasaOCuota =   traslado['@attributes'].TasaOCuota * 100;  
    //                 $scope.IVAList.forEach(function (tipo) {
    //                     if(tipo.PAR_IMPORTE1 == TasaOCuota)
    //                     {
    //                         tipoIVA = tipo;
    //                     }
    //                 });
    //             });
    //             }
    //             else
    //             {
    //             let TasaOCuota= traslados['@attributes'].TasaOCuota * 100;  
    //             $scope.IVAList.forEach(function (tipo) {
    //             if(tipo.PAR_IMPORTE1 == TasaOCuota)
    //             {
    //                 tipoIVA = tipo;
    //             }
    //             });
    //             }
    //         $scope.idtipoComprobante = tipoComprobante;
    //         $scope.idtipoIVA = tipoIVA;
    //         }
    //         else
    //         {
    //             var traslados =  conceptos['cfdi:Traslados']['cfdi:Traslado'];
    //             var trasArray = Array.isArray(traslados);
    //             if(trasArray)
    //             {
    //             traslados.forEach(function (traslado) {
    //                 var z = traslado['@attributes']; 
    //                 let TasaOCuota =   traslado['@attributes'].TasaOCuota * 100;  
    //                 $scope.IVAList.forEach(function (tipo) {
    //                     if(tipo.PAR_IMPORTE1 == TasaOCuota)
    //                     {
    //                         tipoIVA = tipo;
    //                     }
    //                 });
    //             });
    //             }
    //             else
    //             {
    //             let TasaOCuota= traslados['@attributes'].TasaOCuota * 100;  
    //             $scope.IVAList.forEach(function (tipo) {
    //             if(tipo.PAR_IMPORTE1 == TasaOCuota)
    //             {
    //                 tipoIVA = tipo;
    //             }
    //             });
    //             }
    //             $scope.idtipoComprobante =   $scope.tipoComprobanteList.filter(tipo => tipo.PAR_IMPORTE1 == 0 && tipo.PAR_IMPORTE2 == 0)[0];
    //             $scope.idtipoIVA = tipoIVA;
    //         }
               
    //     }
    //     else
    //     {
    //         console.log($scope.tipoComprobanteList);
    //         console.log($scope.IVAList);
    //         conceptos = jsonXML['cfdi:Comprobante']['cfdi:Conceptos']['cfdi:Concepto'];
    //         conceptos.forEach(function (concepto) {
    //             var x = concepto;
    //             var Traslados = concepto['cfdi:Impuestos']['cfdi:Traslados']['cfdi:Traslado']['@attributes'];
    //             $scope.idtipoComprobante =   $scope.tipoComprobanteList.filter(tipo => tipo.PAR_IMPORTE1 == 0 && tipo.PAR_IMPORTE2 == 0)[0];
    //             $scope.idtipoIVA = $scope.IVAList.filter(iva => iva.PAR_IMPORTE1 == (Traslados.TasaOCuota * 100))[0]      
    //         });
    //     }
    //     $scope.verTipoFactura = true;
    //     return true;
    // }

    $scope.enviarFinanzas = function (data) {
        $scope.obtineCorreoNotificacion(22);
        swal({
            title: '¿Deseas enviar a Revisión la Factura?',
            text: 'Se enviara la evidencia de Factura a revisión',
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
              $scope.sendNotificacionFactura(data)
          } else {
              swal('Cancelado', 'No se aplicaron los cambios', 'error');
          }
      });
    }
    
    $scope.sendNotificacionFactura = function (resf) {
        var tipoNot = 22;
        var notG = {
            //Obtener el id del vale
            "identificador": parseInt(resf.idValeEvidencia),
            "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la revisión de la Factura"+ resf.nombreVale,
            "idSolicitante": $scope.user.usu_idusuario,
            "idTipoNotificacion": tipoNot,
            "linkBPRO": global_settings.urlCORS + "aprobarVale?employee=67&IdComprobacion=" + resf.idValeEvidencia,
            "notAdjunto": "",
            "notAdjuntoTipo": "",
            "idEmpresa": resf.idEmpresa,
            "idSucursal": resf.idSucursal,
            "departamentoId": 0
        };
        
      	 clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
                let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                html = ` ${$scope.html1} Solicitud de Revisión de Factura<br><br>Folio Comprobación Vale: ${resf.idComprobacionVale} ${$scope.html2}
                <p><br>El usuario ${$scope.user.nombre} de la Sucursal  ${resf.nomSucursal} a solicitado la revisión de la Factura ${resf.nombreVale} , fecha de creación  ${resf.feFFVale}  <br></p>
                <p><br>Por el monto de $${formatMoney(resf.monto)}, // motivo: ${resf.motivo}  <br></p>
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Comprobación</a></p>
                <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                $scope.sendMail($scope.CorreoFinanzas, 'Solicitud de Aprobación de Factura', html);
                $scope.listaValesFF($scope.id_perTra, $scope.idVale); 
                $scope.actualizaEstatusNotificacion(resf.idValeEvidencia,2);
                //$scope.regresarmisVales(1);
                $("#loading").modal("hide");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                $("#loading").modal("hide");
            }
        });
    }

       
    $scope.actualizaEstatusNotificacion = function (idValeEvidencia, tipo) {
        misTramitesValesRepository.actualizaEstatusNotificacion(idValeEvidencia, tipo).then((res) => {
            if (res.data[0].success == 1) {
                console.log('Ok al actualizar la notificación')
                } else {
                console.log('Error al actualizar la notificación')
            }
        });
    }
 

    $scope.actualizaEstatusNotificacionEvidencia = function (idValeEvidencia, estatus) {
        misTramitesValesRepository.actualizaEstatusNotificacionEvidencia(idValeEvidencia, estatus).then((res) => {
            if (res.data[0].success == 1) {
                console.log('Ok al actualizar la notificación')
                } else {
                console.log('Error al actualizar la notificación')
            }
        });
    }
    $scope.obtineCorreoNotificacion = function (tipoNot){
        aprobarDevRepository.getCorreoNotificacion(tipoNot).then((resp) => {     
            if(resp.data != undefined){
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

    function xmlToJson( xml ) {
 
        // Create the return object
        var obj = {};
       
        if ( xml.nodeType == 1 ) { // element
          // do attributes
          if ( xml.attributes.length > 0 ) {
          obj["@attributes"] = {};
            for ( var j = 0; j < xml.attributes.length; j++ ) {
              var attribute = xml.attributes.item( j );
              obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if ( xml.nodeType == 3 ) { // text
          obj = xml.nodeValue;
        }
       
        // do children
        if ( xml.hasChildNodes() ) {
          for( var i = 0; i < xml.childNodes.length; i++ ) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if ( typeof(obj[nodeName] ) == "undefined" ) {
              obj[nodeName] = xmlToJson( item );
            } else {
              if ( typeof( obj[nodeName].push ) == "undefined" ) {
                var old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push( old );
              }
              obj[nodeName].push( xmlToJson( item ) );
            }
          }
        }
        return obj;
      };

    $scope.getRFCEmpresa = function (empresa) {
    anticipoGastoRepository.getRfcPorNombreRazon(empresa).then((response) => {
        if (response.data != null) {
            $scope.empresaRFC = response.data[0].PER_RFC;
        }
    });
}    

$scope.traeDepartamentos=function(idEmpresa,idSucursal){
    $scope.idSucursal=$scope.sucursal
    fondoFijoRepository.getDepartamentos(idEmpresa, idSucursal).then(function successCallback(response) {
      $scope.departamentos = response.data;
      //$scope.departamentos = removeDepFromArr( $scope.departamentos, 'OTROS' );

  }, function errorCallback(response) {
  });
  }

  $scope.traeDepartamentosXFondo=function(){
    if($scope.FFSucursal != null)
    {
    $scope.disableDepartamentos = false;
    misTramitesValesRepository.getDepartamentosXFondo($scope.FFSucursal).then(function successCallback(response) {
      $scope.departamentosVales = response.data;
  }, function errorCallback(response) {
  });
}
else
{
    $scope.departamentosVales = [];
    $scope.disableDepartamentos = true;
}
  }
    
  $scope.traeDepartamentosXFondosFijos=function(){
    fondoFijoRepository.getTiposolicitudXFondo($scope.FFSucursal).then(function successCallback(response) {
        $scope.departamentosArea = response.data[0].estatusVales
        if($scope.departamentosArea == 1)
        {
         //Departamentos Area
         if($scope.FFSucursal != null)
         {
         $scope.disableDepartamentos = false;
         misTramitesValesRepository.getDepartamentosXFondoAreaFF($scope.FFSucursal).then(function successCallback(response) {
          $scope.departamentosVales = response.data;
        }, function errorCallback(response) {
      });
        }
        else
            {
            $scope.departamentosVales = [];
            $scope.disableDepartamentos = true;
            }
        }
        else
        {
            //Departamentos Flotillas
            if($scope.FFSucursal != null)
            {
            $scope.disableDepartamentos = false;
            misTramitesValesRepository.getDepartamentosXFondosFijos($scope.FFSucursal).then(function successCallback(response) {
              $scope.departamentosVales = response.data;
          }, function errorCallback(response) {
          });
            }
            else
            {
            $scope.departamentosVales = [];
            $scope.disableDepartamentos = true;
            }
        }
    }, function errorCallback(response) {
    });
  }
  
$scope.buscarOrdenesProveedor=function(idProveedor){
    //$('#loading').modal('show');   
    if(idProveedor== ''|| idProveedor == undefined)
    { swal("Atención", 'El ID Proveedor es obligatorio', "warning");}
    else if( $scope.departamento == ''||  $scope.departamento == undefined)
    { swal("Atención", 'El Departamento es obligatorio', "warning");}
    else
    {
    misTramitesValesRepository.getOrdenesCompra(idProveedor, $scope.selEmpresa, $scope.selSucursal, $scope.departamento).then(function successCallback(response) {
      $scope.ordenes = response.data;
      if($scope.ordenes.length > 0)
      {
          $scope.nombreProveedor = $scope.ordenes[0].nombreProveedor
          $scope.verOrdenes = true;  
      }
      else{
          $scope.nombreProveedor = ''
          $scope.verOrdenes = false;
          swal("Atención", 'No se encontranron Ordendes de Compra', "warning");
        }
      //$('#loading').modal('hide');  
      
  }, function errorCallback(response) {
  });
}
  }

  $scope.seleccionaOrden=function(idOrden){
    misTramitesValesRepository.getValidaOrdenCompra(idOrden.orden,$scope.selSucursal).then(function successCallback(response) {
      $scope.verGuardarOrden = true;
      $scope.datosOrden = response.data[0];
      $scope.datosPlanta = response.data[1];
      $scope.datosPeriodo = response.data[2];
      $scope.documentosOrden = response.data[3];
      $scope.datosOrdenFactura = response.data[4];
      //Valida Planta
      if($scope.datosOrden[0].oce_idproveedor == $scope.datosPlanta[0].PAR_IMPORTE1)
      {
        swal("Atención", 'No puede ser Planta', "warning");
        $scope.verGuardarOrden = false;
        return false;
      }
      if($scope.documentosOrden.length == 0)
      {
        swal("Atención", 'La orden no tiene documentación', "warning");
        $scope.verGuardarOrden = false;
        return false;
      }
      else
      {
        $scope.documentosOrden.forEach(item => {
            if(item.Doc_Id == 15 && item.Fecha_Creacion == null)
            {
            swal("Atención", 'La orden no tiene comprobante', "warning");
            $scope.verGuardarOrden = false;
            return false;
            }
            if(item.Doc_Id == 20 && item.Fecha_Creacion == null)
            {
            swal("Atención", 'La orden no tiene factura', "warning");
            $scope.verGuardarOrden = false;
            return false;
            }
          });
      }
      $scope.montoOrden = $scope.datosOrden[0].oce_importetotal;
  }, function errorCallback(response) {
  });
  }

  $scope.SubirOrdenEvidencia=function(){
    console.log('SubirOrdenEvidencia');
    
        dataOrden= {
            idVale : $scope.idVale,
            idEstatus : 1,
            tipoGasto: $scope.tipoGasto,
            iva:  $scope.datosOrdenFactura[0].iva,
            monto: $scope.datosOrdenFactura[0].importe,
            uuid: $scope.datosOrdenFactura[0].uuid,
            rfcEmisor:  $scope.datosOrdenFactura[0].rfc_emisor,
            rfcReceptor:  $scope.datosOrdenFactura[0].rfc_receptor,
            fechafactura: $scope.datosOrdenFactura[0].fecha_factura,
            PER_IDPERSONA: $scope.datosOrden[0].oce_idproveedor,
            ordenCompra: $scope.datosOrdenFactura[0].folioorden,
            motivoEvidencia: $scope.motivoEvidencia
          }


          // if(dataOrden.monto >  parseFloat($scope.amountFondoFijo))
          if(dataOrden.monto >  parseFloat($scope.amountFondoFijoFactura))
          {swal("Atención", "El monto maximo es de $ " + $scope.amountFondoFijoFactura, "warning");
       
        }
        else if($scope.motivoEvidencia == '' ||$scope.motivoEvidencia == undefined ||$scope.motivoEvidencia == null )
        {
        swal("Atención", "El motivo es obligatorio", "warning");
        }
          else{
            $('#loading').modal('show');
            misTramitesValesRepository.insertarFacturaOrden(dataOrden).then(function successCallback(result) {
                if (result.data[0].success == 1)
                {
                    $('#loading').modal('hide');
                    $("#agregaEvidencia").modal("hide");
                    $scope.tipoEvidencias = [];
                    $scope.listaValesFF($scope.id_perTra, $scope.idVale); 
                }
                else if  (result.data[0].success == 2)
                {
                    $('#loading').modal('hide');
                    $("#agregaEvidencia").modal("show");
                    swal('Error', 'La factura ya fue agregada previamente como evidencia', 'error');
                }
                else
                {
                    $('#loading').modal('hide');
                    $("#agregaEvidencia").modal("show");
                    swal('Error', 'La factura no pudo ser guardada, intente nuevamente.', 'error');
                }
            }, function errorCallback(response) {
            });
        
          
            }

      }

      async function validaPeriodoContable(idSucursal, periodo) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.validaPeriodoContable(idSucursal,periodo).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
            else
            {reject('Error')}
        });
    });
    }

    $scope.enviarNotiComprobacion = function(dataSave) {  
        //$scope.buscarAutorizadorNoti(dataSave.idFondo);
        //$scope.buscarAutorizadorNotiVale(dataSave.idEmpresa, dataSave.idSucursal, dataSave.idDepVale);
        fondoFijoRepository.getTiposolicitudXFondo(dataSave.idFondo).then(function successCallback(response) {
            $scope.departamentosArea = response.data[0].estatusVales
            if($scope.departamentosArea == 1)
            {
             //Departamentos Area
             $scope.buscarAutorizadorNotiValeArea(dataSave.idEmpresa, dataSave.idSucursal, dataSave.idDepVale);
            }
            else
            {
                //Departamentos Flotillas
                $scope.buscarAutorizadorNotiVale(dataSave.idEmpresa, dataSave.idSucursal, dataSave.idDepVale);
            }
        }, function errorCallback(response) {
        });

        swal({
          title: '¿Deseas enviar a Revisión la Comprobación del Vale?',
          text: 'Se enviará la comprobacipon a revisión por el monto excedente de $' +  formatMoney(dataSave.montoExcedente),
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
           $scope.listaValesFF($scope.id_perTra, $scope.idVale); 
          
        } else {
            swal('Cancelado', 'No se aplicaron los cambios', 'error');
            $('#loading').modal('hide');
        }
    });

    $scope.listaValesFF($scope.id_perTra, $scope.idVale);
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
            "departamentoId": resf.idDepVale
        };
        
        clientesRepository.notGerente(notG).then(function (result) {
            if (result.data[0].success == true) {
                $scope.actualizaEstatusNotificacionEvidencia(resf.idValeEvidencia, 1);
                let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a aprobación a Corporativo', 1, 1);
                html = ` ${$scope.html1} Solicitud de Aprobación de Comprobación de Mas Vale, por el monto execente de $${formatMoney(resf.montoExcedente)} <br><br>Folio Comprobación Vale: ${resf.idComprobacionVale} ${$scope.html2}
                <p><a href=' ${notG.linkBPRO} ' target="_blank">Revisar Comprobación</a></p>
                <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                
                //var correoAutorizador = $scope.correoAutorizador;
                $scope.sendMail($scope.correoAutorizador, 'Solicitud de Aprobación de Comprobacion de Mas Vale', html);   
                $("#loading").modal("hide");
                $scope.listaValesFF($scope.id_perTra, $scope.idVale);
                //$scope.regresarmisVales(1);
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                $("#loading").modal("hide");
            }
        });
    }
    ////////////////FIN

    $scope.buscarAutorizadorNoti = function (idFondoFijo) {
        misTramitesValesRepository.getBuscarAutorizador(idFondoFijo).then((res) => {
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].usu_correo;
            $scope.nombreAutorizador = res.data[0].nombreUsuario; 
        });
    }

    $scope.buscarAutorizadorNotiVale = function (idEmpresa, idSucursal, idDepartamento) {
        misTramitesValesRepository.getBuscarAutorizadorXDepartamento(idEmpresa, idSucursal, idDepartamento).then((res) => {
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].correo;
            $scope.nombreAutorizador = res.data[0].autorizador; 
        });
    }
    $scope.buscarAutorizadorNotiValeArea = function (idEmpresa, idSucursal, idDepartamento) {
        misTramitesValesRepository.getBuscarAutorizadorXDepartamentoArea(idEmpresa, idSucursal, idDepartamento).then((res) => {
            $scope.idAutorizador = res.data[0].idAutorizador;
            $scope.correoAutorizador = res.data[0].correo;
            $scope.nombreAutorizador = res.data[0].autorizador; 
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



    $scope.validaMotivo = function(){
        $scope.motivoValido = false;
        if( $scope.motivoEvidencia.length == 0 ){
           $scope.msgCaracteresMotivo = $scope.minevidenciachar + ' caracteres como minimo.'; 
        }
        else if( $scope.motivoEvidencia.length < $scope.minevidenciachar ){
           $scope.classCaracteresMotivo = 'text-danger';
           $scope.msgCaracteresMotivo = ($scope.minevidenciachar - $scope.motivoEvidencia.length) + ' caracteres para un motivo válido.';
        }
        else if( $scope.motivoEvidencia.length >= $scope.minevidenciachar ){
            $scope.classCaracteresMotivo = 'text-success';
            $scope.msgCaracteresMotivo = 'Motivo de evidencia válido';   
            $scope.motivoValido = true;
        }
    }

    $scope.enviarRevisionVale = async function(det){
        $scope.razonApertura = '';
        $scope.valeDescuento = 'Soliciutd Apertura Vale ' + det.nombreVale;
        var validaVale = await validaApertura(det.idVale);
        console.log(validaVale)
        if(validaVale[0].estatus == 1)
        {
        $("#mostrarAperturaVale").modal("show");
        $scope.envioApertura = {
            idVale: det.idVale,
            nombreVale: det.nombreVale,
            idSucursal: det.idSucursal,
            idEmpresa: det.idEmpresa,
            idDepartamento: 0,
            monto: validaVale[0].monto,
            nombreFinanzas: validaVale[0].nombreFinanzas,
            correoFinanzas: validaVale[0].correoFinanzas,
            asunto: validaVale[0].asunto
        }
        }
        else
        {
            swal("Atención", validaVale[0].msj, "warning");
        }
    }

    async function validaApertura (idVale) {
        return new Promise((resolve, reject) => {
        misTramitesValesRepository.getvalidaValeApertura(idVale).then(function (result) {
            if (result.data.length > 0) {
                resolve(result.data);
            }
        });
    });
    };

    $scope.cancelApertura = function () {
        $("#mostrarAperturaVale").modal("hide");
    }

    $scope.enviarApertura = function () {
        if($scope.razonApertura == undefined || $scope.razonApertura == "" || $scope.razonApertura ==  null)
        {
            swal("Atencion!", "La razón de apertura es necesaria...", "warning");
        }
        else{
        $scope.sendNotificacionAperturaVale($scope.envioApertura);
        $("#mostrarAperturaVale").modal("hide");
        }
    }

        /////////Se agrega para notificar la apartura del vale
        $scope.sendNotificacionAperturaVale = function (resf) {
            var tipoNot = 56;
        
            var notG = {
                //Obtener el id del vale
                "identificador": parseInt(resf.idVale),
                "descripcion": "El usuario " + $rootScope.user.nombre + " a solicitado la apertura del vale "+ resf.nombreVale +
                " por la cantidad de $" + formatMoney(resf.monto) + " pesos.",
                "idSolicitante": $scope.user.usu_idusuario,
                "idTipoNotificacion": tipoNot,
                "linkBPRO": global_settings.urlCORS + "aprobarVale?employee=67&idVale=" + resf.idVale,
                "notAdjunto": "",
                "notAdjuntoTipo": "",
                "idEmpresa": resf.idEmpresa,
                "idSucursal": resf.idSucursal,
                "departamentoId": resf.idDepartamento
            };
            
            clientesRepository.notGerente(notG).then(function (result) {
                if (result.data[0].success == true) {
        
                    let link = global_settings.urlApiNoty + 'api/notification/approveNotificationMail/?idAprobacion=' + result.data[0].apr_id + '&identificador=' + result.data[0].not_id + '&respuesta=';
                    $scope.guardarBitacoraProceso($rootScope.user.usu_idusuario, localStorage.getItem('id_perTra'), 0, 'Se envio a apertura de vale ' + resf.nombreVale, 1, 1);
                    html = ` ${$scope.html1} Solicitud de Apertura de Vale <br><br>Estimado(a) ${resf.nombreFinanzas} el Vale ${resf.nombreVale} paso a descuento, por la cantidad de $${formatMoney(resf.monto)}  <br><br>
                    ${$scope.html2}
                    <p>Motivo: ${$scope.razonApertura}</p> 
                    <p><a href=" ${link} 1" target="_blank">Aprobar</a></p> 
                    <p><a href=" ${link} 0" target="_blank">Rechazar</a></p>`;
                    $scope.sendMail(resf.correoFinanzas, resf.asunto, html);
                    $scope.actualizaApertura(resf.idVale, $scope.razonApertura);
                    $scope.getMisVales();
                    //$("#loading").modal("hide");
                } else {
                    swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                    //Eliminar el vale ya que va a existir una inconsistencia entre el vale creado
                    //y la notificación ya que no se pudo notificar 
                    $("#loading").modal("hide");
                }
            });
        }
        ////////////////FIN

        $scope.actualizaApertura = function(idVale, razonApertura) {
            misTramitesValesRepository.actualizaAperturaVale(idVale,razonApertura).then(function (result) {
                if (result.data.length > 0) {
                   
                }
            });
        };
    
});
