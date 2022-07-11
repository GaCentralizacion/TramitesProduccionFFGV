registrationModule.controller('aprobarController', function ($sce, $scope, $rootScope, $location, localStorageService, aprobarRepository, proveedoresRepository, clientesRepository, devolucionesRepository, $q) {
    $scope.id_perTra = 0;
    $scope.titleTramite = '';
    //Variables para los datos del usuario
    $scope.nombre = '';
    $scope.rfc = '';
    $scope.m_F;
    $scope.cuentaBancaria = '';
    $scope.moralFisica;
    $scope.aprobarDocs;
    $scope.verDocumento = 0;
    $scope.verImagen;
    $scope.verPdfDocumento;
    $scope.modalTitle = '';
    $scope.razonesRechazo = '';
    $scope.sendDetIdPerTra;
    $scope.activarAprobar = true;
    $scope.nombreEstatus = '';
    $scope.traEstatus = 0;
    $scope.IdTipoTramite = 0;
    // Variable para identificar tipo prospecto: Proveedor = 1 / Cliente = 2; validar componentes a mostar en el .html
    $scope.id_TipoProspecto = 0;
    /*Proveedores*/
    $scope.tipoTramite = 0;
    $scope.idProspecto = 0;
    $scope.bancosProspecto = [];
    $scope.tiposProveedor = [];
    $scope.mostrarAlerta = false;
    $scope.noCuentas = 0;
    $scope.mostrarTipoProv = true;
    $scope.User = [];
    $scope.cuentasProveedor = [];
    $scope.tesoreria = 0;
    $scope.finanzas = 0;
    $scope.observacionesR = "";
    $scope.verComentarios = false;
    /***/

    //Inicio Clientes
    $scope.arrayDocumentos = [];
    $scope.id_persona = 0;
    $scope.documentaCyc = [];
    $scope.detTramite = [];
    $scope.not = [];
    $scope.bloquea = false;
    $scope.verEnvia = false;
    $scope.idEmpresaC = 0;
    $scope.idTipoAgrupacionC = 0;
    $scope.idPersonaC = 0;
    $scope.verEditar = false;
    $scope.montoAutorizado = 0.00;
    $scope.agenciasCartera = [];
    //Fin Clientes
    $scope.showDocumenosRechazados = true;
    $scope.showRechazados = false;


    $scope.html1 = "<div style=\"width:310px;height:140px\"><center><img style=\"width: 100% \" src=\"https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png\" alt=\"GrupoAndrade\" />" +
        "</center></div><div><p><br>";
    $scope.html2 = "</p></div>";
    $scope.docClienteFrontUrl = global_settings.urlFrontDocCliente;

    $scope.init = () => {
        var url = window.location.href;

        if (getParameterByName('idTramite') != '') {
            $scope.id_perTra = getParameterByName('idTramite');
            $scope.tesoreria = 1;
            $scope.usuAutoriza = getParameterByName('employee');

            $('#mainnav-menu').hide();
            $('#verEdit').hide();
        } else if ((localStorage.getItem('id_perTra'))) {
            $scope.finanzas = 1;
            $scope.id_perTra = parseInt(localStorage.getItem('id_perTra'));
           
        } else {
            $location.path('/');
            localStorage.removeItem('usuario');
            localStorage.removeItem('id_perTra');
        }
        if ($scope.id_perTra > 0) {
            $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
            $scope.getUsuarioAprobar();
            $scope.getDocsAprobar();
            $scope.getActivarAprobarTramite();
            $scope.getEstatusTramite();
        }
    };
    //Inicio Clientes

    $scope.getReporteBuro = function () {
        $('#loading').modal('show');
        if($scope.detTramite.id_TramiteAsolicitar == 3 || $scope.detTramite.id_TramiteAsolicitar == 6 ){
            clientesRepository.getReporteContado($scope.detTramite.per_idpersona).then(function(result) {
                var data = result
                clientesRepository.getReportePdfContado(data.data).then(function(result) {
                    var file = new Blob([result.data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                    $('#loading').modal('hide');
                    window.open($scope.rptResumenConciliacion, "FACTURAS DEL CLIENTE", "width=700,height=500,scrollbars=NO");
                });
            });
        }else {
        clientesRepository.getReporteBuro($scope.detTramite.per_idpersona).then(function(result) {
            var data = result
            clientesRepository.getReportePdf(data.data).then(function (result) {
                var file = new Blob([result.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                $('#loading').modal('hide');
                window.open($scope.rptResumenConciliacion, "BURO INTERNO DEL CLIENTE", "width=700,height=500,scrollbars=NO");
            });
        });
        }
    };


    $scope.detalleBuro = function () {
        $('#loading').modal('show');
        clientesRepository.getReporteBuroDetalle($scope.detTramite.per_idpersona).then(function (result) {
            var data = result
            clientesRepository.getReportePdf(data.data).then(function (result) {
                var file = new Blob([result.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                $('#loading').modal('hide');
                window.open($scope.rptResumenConciliacion, "DETALLE BURO INTERNO DEL CLIENTE", "width=700,height=500,scrollbars=NO");
            });
        });
    };

    $scope.getEstatus = function (monto, idPerTra) {
        aprobarRepository.getEstatus($scope.IdTipoTramite, monto, idPerTra).then(function (result) {
            $scope.allEstatusDevolucion = result.data;
        });
    };

    $scope.getCarteras = function () {
        clientesRepository.getdetCre($scope.idProspecto, $scope.id_perTra).then(function (result) {
            $scope.detTramite = result.data[0];
            if ($scope.detTramite.estatus == 8) {
                $scope.detTramite.estatus = 1;
            }

            //set val IdEmpresa and IdtipoAgrupador
            $scope.idEmpresaC = $scope.detTramite.idEmpresa;
            $scope.idTipoAgrupacionC = $scope.detTramite.tipoAgrupacion;
            $scope.idPersonaC = $scope.detTramite.per_idpersona;

            $scope.getEstatus($scope.detTramite.monto, $scope.id_perTra);
            clientesRepository.getMontoSucursal($scope.id_perTra).then(function (result) {
                if (result.data.length > 0) {
                    $scope.montosSucursales = result.data;
                } else { console.log('Departamentos no disponibles por el momento, intentelo mas tarde'); }
            });
        });
    };

    $scope.apruebaTranspaso = function() {
        var falta = 0;
        angular.forEach($scope.aprobarDocs, function(value, key) {
            if(value.estatus == null || value.estatus == 0 || value.estatus == 1 || value.estatus == 3){
                falta = 1;
            }
        }); 

        if(falta == 0){
            swal({
                title: "Estas seguro?",
                text: "Deseas aprobar el tramite del cliente",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Enviar",
                closeOnConfirm: false
            },
            function() {
                clientesRepository.insTraspaso($scope.id_perTra).then(function(result) {
                    if (result.data[0].success == 1) {
                        swal('Listo', 'Se aprobar el tramite con exito ', 'success');
                    } else {
                        swal('Listo', 'Servicio no disponible', 'success');
                    }
                    $location.path('/home');
                });
            });

        }else{
            swal("Atencion!", "Documentación incompleta" , "warning");
        }
        
    };

    $scope.getDocumentaCyc = function () {
        clientesRepository.docCyc($scope.id_perTra).then(function (result) {
            if (result.data.length > 0) {
                $scope.documentaCyc = result.data;
                for (var a = 0; a < $scope.documentaCyc.length; a++) {
                    if ($scope.documentaCyc[a].renglones == 1 && $scope.documentaCyc[a].observacion != '') {
                        $scope.documentaCyc[a].observacion = parseFloat($scope.documentaCyc[a].observacion);
                        $scope.verEnvia = true;
                    }
                }
            } else {
                console.log('No tiene documetacion CyC')
            }
        });
    };

    $scope.guardarComentCyc = function () {
        var cont = 0,
            campo = "";
        for (var a = 0; a < $scope.documentaCyc.length; a++) {
            if (($scope.documentaCyc[a].observacion == '' || $scope.documentaCyc[a].observacion == null) && $scope.documentaCyc[a].renglones == 1) {
                cont = cont + 1;
                swal("Atencion!", "Falta ingresar " + $scope.documentaCyc[a].descripcion, "warning");
                break;
            }
        }
        if (cont == 0) {
            swal({
                title: '¿Desea Guardar comentarios',
                text: 'Se adjuntaran a la documetacion',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        clientesRepository.guardaDocumentaCyc($scope.documentaCyc).then(function (result) {
                            if (result.data.result.success == 1) {
                                $scope.getDocumentaCyc();
                                swal('Listo', 'Se Guardaron los datos', 'success');
                            } else {
                                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
                            }
                        });
                    } else {
                        swal('Cancelado', 'No se guardaron observaciones', 'warning');
                    }
                });
        }
    };

    $scope.updTramite = function (txt, status) {
        clientesRepository.updTramite(0, txt, status, $scope.id_perTra, 0, 0, 0, 0).then(function (result) {
            if (result.data[0][0].success == 1) {
                if (status == 2)
                    swal("Listo!", "Documento enviado con exito al Gerente General ", "success");
            } else {
                swal("Atencion!", "Servicio no disponible por el momento ...", "warning");
            }
        });
    };

    $scope.enviaAcyc = function () {
        swal({
            title: "Estas seguro de aprobar el tramite?",
            text: "Sera enviado al departamento de Cyc",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Enviar",
            closeOnConfirm: false
        },
            function () {
                html = $scope.html1 + "<br><br>Estimado Departamento de Cyc, favor de revisar el tramite solicitado <br> para acceder busque en en dashboard el #" + $scope.id_perTra + " de tramite indicado en este correo <br><br><br>Para revisar el tramite de click <a href='" + $scope.detTramite.link + "'>AQUI</a>" + $scope.html2;
                $scope.updTramite('El tramite sera revisado por el Departamento de Cyc', 3);
                $scope.sendMail($scope.detTramite.correoCYC, 'Tramite #' + $scope.id_perTra + ' solicitado a revisar', html);
                swal('Listo', 'Se envió a revisión', 'success');
                $location.path('/home');
            });
    };

    $scope.enviarDocs = function(estatus) {

        $scope.arrayDocumentos = [];
        var a = 0;
        var estimado = "Gerente General"
        var correoRevisor = $scope.detTramite.correoG;
        angular.forEach($scope.aprobarDocs, function(value, key) {
            if (value.archivo) {
                var arch = {
                    "idProspecto": $scope.idProspecto,
                    "idTipoProspecto": 2,
                    "idTramite": $scope.tipoTramite,
                    "per_rfc": $scope.rfc,
                    "nombreImg": value.archivo.nombreArchivo.split('.')[1] == 'jpg' ? value.archivo.nombreArchivo.split('.')[0] + '.jpeg' : value.archivo.nombreArchivo,
                    "idDocumento": value.id_documento,
                    "base64": value.archivo.archivo,
                    "id_PerTra": $scope.id_perTra
                };
                $scope.arrayDocumentos[a] = arch;
                a += 1;
            }
        });

        var jsonData = { "data": $scope.arrayDocumentos };

        var tamanio = 1;
        if(estatus == 0){
            tamanio = 2;
            estatus = 1;
        }

        if ($scope.arrayDocumentos.length == tamanio) {
            swal({
                    title: "Estas seguro?",
                    text: "Deseas enviar el archivo seleccionado",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Enviar",
                    closeOnConfirm: false
                },
                function() {

                    clientesRepository.subirDocumento(jsonData.data).then(function(result) {
                        if (result.data.success == 1) {
                            if (estatus == 2) {
                                estimado = "Departamento de Cyc"
                                correoRevisor = $scope.detTramite.correoCYC;
                            }
                            if(estatus != 3){
                                html = $scope.html1 + "<br><br>Estimado " + estimado + ", favor de revisar el tramite solicitado <br> para acceder busque en en dashboard el #" + $scope.id_perTra + " de tramite indicado en este correo <br><br><br>Para revisar el tramite de click <a href='" + $scope.detTramite.link + "'>AQUI</a> " + $scope.html2;
                                $scope.updTramite('Se adjunto el archivo y sera revisado por el' + estimado, estatus + 1);
                                $scope.sendMail(correoRevisor, 'Tramite #' + $scope.id_perTra + ' solicitado a revisar', html);
                                swal('Listo', 'Se envió a revisión', 'success');
                                $location.path('/home');
                            }else {
                                location.reload();
                                swal('Listo', 'Operación realizada', 'success');
                            }

                        } else { swal("Atencion!", "Servicio no disponible por el momento ...", "warning"); }
                    });
                });
        } else {
            swal("Atencion!", "Adjunte el archivo correctamente...", "warning");
        }
    };
    
    $scope.editarTramite = function(){
        swal({
            title: "Estas seguro de modificar el monto solicitado ? ",
            text: "los importes asigandos seran aplicados en caso de ser aprobados",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Aceptar",
            closeOnConfirm: false
        },
        function() {
                        swal('Ok', 'Puedes modificar el importe', 'success');
                        $scope.verEditar = true;

                        clientesRepository.getSucurAgrupacion($scope.detTramite.idEmpresa, $scope.detTramite.tipoAgrupacion).then(function(result) {
                            if (result.data.length > 0) {
                                $scope.agenciasCartera = result.data;
                                console.log($scope.agenciasCartera)
                            } else { AlertFactory.error('Por el momento no hay carteras/sucursales disponibles') }
                        });
        });
    };

    $scope.sumarValores = function() {
        if ($scope.montoAutorizado > 0.00) {
            var suma = 0.00
            $scope.montoAutorizado = parseFloat($scope.montoAutorizado);
            angular.forEach($scope.agenciasCartera, (value, key) => {
                suma += parseFloat(value.montoSuc);
            });
            if (suma > $scope.montoAutorizado) {
                swal('Alto', 'No puedes destinar mas del monto solicitado', 'warning');
            } else {
                if (suma < $scope.montoAutorizado) {
                    swal('Alto', 'Debes destinar todo el monto solicitado entre las sucursales', 'warning');
                } else {
                    swal({
                            title: "Desea Guardar y enviar a revision",
                            text: "los importes asigandos a las sucursales?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "Iniciar",
                            closeOnConfirm: false
                        },
                        function() {

                            clientesRepository.updTramiteCyc($scope.id_perTra,$scope.detTramite.monto,$scope.montoAutorizado,$rootScope.user.usu_idusuario).then(function(result) {
                            if (result.data[0].exito == 1) {
                                angular.forEach($scope.agenciasCartera, (value, key) => {
                                    if (value.idSucursal > 0) {
                                            clientesRepository.updMontosCyc($scope.id_perTra, value.idSucursal, value.montoSuc).then(function(result) {
                                                if (result.data[0].exito == 1) {
                                                    if (key == $scope.agenciasCartera.length - 1) {
                                                       var destinatario = 'al COMITE de GA';
                                                       var estatRev = 5;
                                                       var tipoNot = 6;
                                                       var txtComite = "<p><strong>SI DESEA QUE SE MODIFIQUE EL MONTO SOLICITADO, FAVOR DE PONERSE EN CONTACTO CON EL DEPARTAMENTO DE CRÉDITO Y COBRANZA PARA MODIFICAR EL MONTO Y HAGA CASO OMISO A ESTA NOTIFICAIÓN</strong></p>";
                                                       var encab = "<p><strong>Tramite  # "+ $scope.id_perTra +"</strong></p>";
                                                        var notG = {
                                                            "identificador": $scope.id_perTra,
                                                            "descripcion": encab + "Modificaión de crédito solicitado para  " + $scope.nombre + ",el cliente  previamente había solicitado  $" + $scope.detTramite.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "  para el departamento de " + $scope.detTramite.PAR_DESCRIP1 + " <p><strong>pero solo se le autorizo un total de $" + $scope.montoAutorizado.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</strong></p>" + txtComite,
                                                            "idSolicitante": $scope.user.usu_idusuario,
                                                            "idTipoNotificacion": tipoNot,
                                                            "linkBPRO": global_settings.urlCORS + "aprobar?employee=88&idTramite=" + $scope.id_perTra,
                                                            "notAdjunto": "",
                                                            "notAdjuntoTipo": "",
                                                            "idEmpresa": $scope.detTramite.idEmpresa,
                                                            "idSucursal": $scope.detTramite.idSucursal,
                                                            "departamentoId": 0
                                                        };
                            
                                                        clientesRepository.notGerente(notG).then(function(result) {
                                                            if (result.data[0].success == true) {
                                                                $scope.updTramite('Enviado a revision ' + destinatario, estatRev);
                                                                swal('Listo', 'Se envió a revisión final', 'success');
                                                                $location.path('/home');
                                                            } else { swal("Atencion!", "Servicio no disponible por el momento ...", "warning"); }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                 });
                            }
                            });
                        });
                }
            }
        } else {
            swal('Alto', 'Ingresa un monto a solicitar', 'warning');
        }
    };

    $scope.agendaInvestigacion = function () {

        var cont = 0,
            campo = "";
        for (var a = 0; a < $scope.documentaCyc.length; a++) {
            if (($scope.documentaCyc[a].observacion == '' || $scope.documentaCyc[a].observacion == null) && $scope.documentaCyc[a].renglones == 1) {
                cont = cont + 1;
                swal("Te falto ingresar: " + $scope.documentaCyc[a].descripcion + " y dar click en el boton GUARDAR, se volveran a cargar los datos INICIALES", "Detente !!!", "warning");
                break;
            }
        }
        if (cont == 0) {

            var destinatario = '';
            var estatRev = 0;
            var tipoNot = 0;
            var totalCartera = 0;
            let CarteraActual = "",
            CarteraAmpliar = "";
            var txtComite = "";

            clientesRepository.getCarteras($scope.idPersonaC, $scope.idEmpresaC, $scope.idTipoAgrupacionC).then(function(result) {
                           
                if (result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        CarteraActual += "<p>" + result.data[i].Clave + " $" + result.data[i].Total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</p>";
                        totalCartera += result.data[i].Total;
                    }
                } else {
                    CarteraActual = "<p>Cliente nuevo, no cuenta con ningún tipo de credito.</p>"
                }
                totalCartera = $scope.detTramite.monto +  totalCartera;

            if (totalCartera <= 100000.00) {
                destinatario = 'a Finanzas';
                estatRev = 4;
                tipoNot = 5;
            } else {
                destinatario = 'al COMITE de GA';
                estatRev = 5;
                tipoNot = 6;
                txtComite = "<p><strong>SI DESEA QUE SE MODIFIQUE EL MONTO SOLICITADO, FAVOR DE PONERSE EN CONTACTO CON EL DEPARTAMENTO DE CRÉDITO Y COBRANZA PARA MODIFICAR EL MONTO Y HAGA CASO OMISO A ESTA NOTIFICAIÓN</strong></p>";
            }
            var encab = "<p><strong>Tramite  # "+ $scope.id_perTra +"</strong></p>";
            swal({
                title: '¿Deseas enviar la documentación con los cometarios escritos?',
                text: destinatario,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        //Llamada obteniendo carteras
                       
                            for (var b = 0; b < $scope.montosSucursales.length; b++) {
                                CarteraAmpliar += "<p>" + $scope.montosSucursales[b].nombreSuc + " $" + $scope.montosSucursales[b].monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</p>";
                            }

                            var notG = {
                                "identificador": $scope.id_perTra,
                                "descripcion": encab + "El cliente " + $scope.nombre + " a solicitado la Autorización De crédito por $" + $scope.detTramite.monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "  para el departamento de " + $scope.detTramite.PAR_DESCRIP1 + " <p><strong>CRÉDITO SOLICITADO:</strong></p>" + CarteraAmpliar + " <p><strong>CRÉDITO ACTUAL:</strong></p> " + CarteraActual + txtComite,
                                "idSolicitante": $scope.user.usu_idusuario,
                                "idTipoNotificacion": tipoNot,
                                "linkBPRO": global_settings.urlCORS + "aprobar?employee=88&idTramite=" + $scope.id_perTra,
                                "notAdjunto": "",
                                "notAdjuntoTipo": "",
                                "idEmpresa": $scope.detTramite.idEmpresa,
                                "idSucursal": $scope.detTramite.idSucursal,
                                "departamentoId": 0
                            };

                            clientesRepository.notGerente(notG).then(function(result) {
                                if (result.data[0].success == true) {
                                    $scope.updTramite('Enviado a revision ' + destinatario, estatRev);
                                    swal('Listo', 'Se envió a revisión final', 'success');
                                    $location.path('/home');
                                } else { swal("Atencion!", "Servicio no disponible por el momento ...", "warning"); }
                            });

                    } else {
                        swal(
                            'Cancelado',
                            'No se renvio a revision ...',
                            'error'
                        );
                    }
                });
            });
        } else { $scope.getDocumentaCyc(); }

    };
    //Fin Clientes

    $scope.getUsuarioAprobar = () => {
        aprobarRepository.getUserAprobar($scope.id_perTra).then((res) => {
            if (res.data.length > 0) {
                $scope.titleTramite = 'Aprobar ' + res.data[0].tra_nomTramite;
                $scope.nombre = res.data[0].nombre;
                $scope.rfc = res.data[0].per_rfc;
                $scope.m_F = res.data[0].per_moralFisica;
                $scope.cuentaBancaria = res.data[0].per_cuentaBancaria;
                $scope.moralFisica = res.data[0].per_moralFisica;
                $scope.id_TipoProspecto = res.data[0].id_TipoProspecto;
                /*Proveedores*/
                $scope.tipoTramite = res.data[0].id_tramite;
                $scope.idProspecto = res.data[0].id_Prospecto;
                $scope.estatusProceso = res.data[0].esDe_IdEstatus;
                //Cliente
                $scope.id_persona = res.data[0].id_persona

                //PagoSeminuevos
                $scope.idClienteSemi = res.data[0].id_Prospecto;


                if ($scope.id_TipoProspecto == 1) {
                    $scope.getDocsCuentasAprobar();
                    obtenerCuentas();
                    $scope.getTipocuenta($scope.idProspecto);
                    $scope.obtenerTipoProveedor($scope.idProspecto);
                    $scope.obtenerRolesProveedor($scope.idProspecto);
                    $scope.IdTipoTramite = 1;
                    $scope.getEstatus(0, $scope.id_perTra);
                    $scope.getEstatusTramiteProveedores($scope.idProspecto);
                    $scope.getActivarAprobarTramite();
                    $scope.titleAutorizar = 'Proveedor'

                }
                if ($scope.id_TipoProspecto == 2) {
                    $scope.getDocumentaCyc();
                    $scope.getCarteras();
                    $scope.IdTipoTramite = 3;
                    $scope.titleAutorizar = 'Cliente'
                }
            } else {
                swal('ALto', 'Ocurrio un error al cargar el usuario a aprobar, intentalo mas tarde', 'warning');
            }
        });
    }
    var obtenerCuentas = function () {

        $scope.numeroDeCuentas = 0;
        $scope.cuentasProveedor = [];
        if($scope.tipoTramite== 17){

            aprobarRepository.obtenerCuentaSemi($scope.id_perTra).then((res) => {
               if(res.data){
                $scope.cuentasProveedor = res.data;
                $scope.cuentaRevisar = res.data[0].banco;

               }
            });



        }else{
           
    
            var promiseCuentas = cuentas($scope.idProspecto, 1);
            promiseCuentas.then(function (result) {
                $scope.bancosProspecto = result;
                for (var i = 0; i < result.length; i++) {
                    $scope.cuentasProveedor.push(result[i]);
                }
                var promiseCuentas_2 = cuentas($scope.idProspecto, 2);
                promiseCuentas_2.then(function (result_2) {
                    $scope.bancosProspectoConTipoCta = result_2;
                    for (var i = 0; i < result_2.length; i++) {
                        $scope.cuentasProveedor.push(result_2[i]);
                    }
                    $scope.numeroDeCuentas = $scope.bancosProspecto.length + $scope.bancosProspectoConTipoCta.length;
                    $scope.getActivarAprobarTramite();
                });
            });

        }

       

    };

    $scope.getEstatusTramiteProveedores = function (idProspecto) {
        proveedoresRepository.obtenerEstatusCuenta(idProspecto, $scope.id_perTra).then((res) => {
            if (res.data) {
                if (res.data[0].estatusProceso == 5) {
                    $scope.detTramite.estatus = res.data[0].estatusProceso
                } else {
                    $scope.detTramite.estatus = $scope.estatusProceso;
                }

                console.log( $scope.detTramite.estatus, "Estatus Proveedores");
            }
        });
    }
    $scope.getEstatusTramite = function () {
        aprobarRepository.getEstatusTramite($scope.id_perTra).then((res) => {
            $scope.nombreEstatus = res.data[0].est_nombre;
            $scope.traEstatus = res.data[0].petr_estatus;
            console.log($scope.traEstatus, "estatus");
        });
    }

    $scope.getDocsAprobar = function () {
        aprobarRepository.getDocsAprobar($scope.id_perTra).then(function (res) {
            if (res.data.length) {
                $scope.verDocumento = 1;
                $scope.aprobarDocs = res.data;
            } else {
                $scope.verDocumento = 0;
            }
            var totalDocumentosRechazados = 0
            angular.forEach($scope.aprobarDocs, (value, key)=>{
                if( value.estatus === 3 ){
                    totalDocumentosRechazados += 1;
                }
            });

            if( totalDocumentosRechazados > 0 ){
                $scope.showDocumenosRechazados = false;
                $scope.showRechazados = true;
            }else{
                $scope.showDocumenosRechazados = true;
                $scope.showRechazados = false;
            };





        });
    }

    $scope.getActivarAprobarTramite = function () {

        aprobarRepository.activarAprobarTramite($scope.id_perTra, $scope.numeroDeCuentas).then(function (res) {
            if (res.data[0].success == 1) {
                $scope.activarAprobar = false;
            } else {
                $scope.activarAprobar = true;
            }
        });
    }

    $scope.verPdf = function (documento) {
        $scope.verComentarios = false;

        if (documento.id_documento == 9 && $scope.id_TipoProspecto == 1) {
            $scope.verModalCuentas(documento);

        } else if (documento.id_documento == 45 && $scope.id_TipoProspecto == 2) {
            $scope.getReporteBuro();
        } else {
            $('#pdfReferenceContent object').remove();
            $scope.modalTitle = documento.nombreDoc;
            if (documento.estatus == 3) {
                $scope.verComentarios = true;
                $scope.observacionesR = documento.det_observaciobes;
            } else {
                $scope.verComentarios = false;
            }
            var pdf = documento.rutaDocumento;
            $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
            // $("#mostrarModalCuentas").modal("hide");
            $('#mostrarPdf').insertAfter($('body'));
            $("#mostrarPdf").modal("show");

        }



    }
    $scope.verPdfCuentas = function (documento) {
        $scope.verComentarios = false;
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = documento.nombreDoc;
        $scope.cuentaBancaria = documento.noCuenta;
        $scope.cuentaClabe = documento.clabe;
        $scope.sendDetIdPerTra = documento.detIdPerTra;
        if (documento.estatus == 3) {
            $scope.verComentarios = true;
            $scope.observacionesR = documento.det_observaciobes;
        } else {
            $scope.verComentarios = false;
        }



      
        var pdf = documento.rutaDocumento;
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='480px' >").appendTo('#pdfReferenceContent');
        // $("#mostrarModalCuentas").modal("hide");
        $('#mostrarPdf').insertAfter($('body'));
        $("#mostrarPdf").modal("show");
    }


    $scope.verImagenModal = function (documento) {
        $scope.modalTitle = documento.nombreDoc;
        $scope.verImagen = documento.rutaDocumento;
        // $("#mostrarModalCuentas").modal("hide");
        $("#mostrarImagen").modal("show");
    }

    $scope.rechazarDocumento = function (documento) {
        $scope.sendDetIdPerTra = documento.detIdPerTra;
        $scope.modalTitle = documento.nombreDoc
        $("#rechazarDoc").modal("show");
    }

    $scope.aprobarDocumento = function (documento) {
        $("#loading").modal("show");
        aprobarRepository.aprobarDocumento(documento.detIdPerTra).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                $scope.getDocsAprobar();
                $scope.getActivarAprobarTramite();
                swal('Listo', 'Se aprobó el documento', 'success');
            } else {
                $("#loading").modal("hide");
                swal('Alto', 'Ocurrió un error al aprobar el documento intentelo mas tarde', 'warning');
            }
        });
    }

    $scope.sendRechazo = function () {
        if ($scope.razonesRechazo == '') {
            swal('Alto', 'Debes mandar las razones por la cual rechazas el documento', 'warning');
        } else {
            $("#rechazarDoc").modal("hide");
            $("#loading").modal("show");
            aprobarRepository.rechazarDocumento($scope.sendDetIdPerTra, $scope.razonesRechazo).then((res) => {
                if (res.data[0].success == 1) {
                    var to, subject, html;
                    if ($scope.id_TipoProspecto == 2) {
                        $scope.updTramite('Documentación rechazada', 8);
                        to = $scope.detTramite.correo + ";"+ $scope.detTramite.correoCYC 
                        if($scope.detTramite.id_TramiteAsolicitar != 8){
                            to+=";"+ $scope.detTramite.correoG + ";" + $scope.detTramite.correoGA;
                        }
                        html = $scope.html1 + $scope.titleTramite + "<br><br>Estimado " + $scope.nombre + " el documento " + $scope.modalTitle + " fue rechazado por lo siguente: <br>" + $scope.razonesRechazo + $scope.html2;
                        if ($scope.detTramite.recibeNot == 1)
                            $scope.sendMail(to, 'Tramite #' + $scope.id_perTra + ' - Rechazo de documento', html);
                    }

                    if ($scope.id_TipoProspecto == 1) {
                        proveedoresRepository.datosProveedor($scope.rfc).then((result) => {

                            if (result.data) {
                                var to, subject, html;
                                to = result.data[0].email;
                                html = $scope.html1 + $scope.titleTramite + "<br><br>Estimado " + $scope.nombre + " el documento " + $scope.modalTitle + " fue rechazado. Por favor ingrese al portal para conocer las observaciones.  <br>" + $scope.razonesRechazo + $scope.html2;
                                $scope.sendMail(to, 'Tramite #' + $scope.id_perTra + ' - Rechazo de documento - Depto. Finanzas', html);
                            }

                        });
                    }

                    $("#loading").modal("hide");
                    $scope.getEstatusTramite();
                    $scope.getDocsAprobar()
                    $scope.razonesRechazo = '';
                    $scope.sendDetIdPerTra = 0;
                    swal('Listo', res.data[0].msg, 'success');
                } else {
                    $scope.sendDetIdPerTra = 0;
                    $("#loading").modal("hide");
                    swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
                }
            });
        }
    }

    $scope.cancelRechazo = function () {
        $("#rechazarDoc").modal("hide");
        $scope.razonesRechazo = '';
    }

    $scope.aprobarTramite = function () {
        if ($scope.id_TipoProspecto == 1) {
            if ($scope.tipoTramite == 1 || $scope.tipoTramite == 2) {
                if ($scope.bancosProspecto.length == 0) {
                    $scope.AprobarT();
                } else {
                    swal('Alto', 'Favor de agregar el tipo de cuenta bancaria.', 'warning');
                }
            } else if ($scope.tipoTramite == 5) {
                if ($scope.bancosProspecto.length == 0) {
                    $scope.AprobarT();
                } else {
                    swal('Alto', 'Favor de agregar el tipo de cuenta bancaria', 'warning');
                }
            }
        } else {
            $scope.AprobarT();
        }
    }

    $scope.AprobarT = function () {
        if ($scope.moralFisica != $scope.m_F) {
            swal({
                title: '¿Deseas aprobar el trámite cambiando el tipo de persona?',
                text: 'Se cambiara el tipo de person Fisica o Moral',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aprobar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        $("#loading").modal("show");
                        $scope.sendAprobarTramite(1);
                    } else {
                        swal(
                            'Cancelado',
                            'No se aplicaron los cambios',
                            'error'
                        );
                    }
                });
        } else {
            swal({
                title: '¿Estas seguro de aprobar el trámite?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aprobar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    if (isConfirm) {
                        // $("#loading").modal("show");
                        $scope.sendAprobarTramite(0);
                    } else {
                        swal(
                            'Cancelado',
                            'No se aplicaron los cambios',
                            'error'
                        );
                    }
                });
        }
    };

    $scope.sendAprobarTramite = function (cambio) {
        if ($scope.id_TipoProspecto == 1) {
            if ($scope.tipoTramite == 1 || $scope.tipoTramite == 2) {
                console.log("rol", $rootScope.user);
                if ($scope.finanzas == 1) {
                    aprobarRepository.aprobarTramiteFinanzas($scope.id_perTra, cambio, $scope.moralFisica, $scope.user.usu_idusuario).then((res) => {
                        if (res.data[0].success == 1) {
                            proveedoresRepository.enviarNotificacionTesoreria($scope.user.usu_idusuario, $scope.idProspecto,$scope.id_perTra).then((result)=>{
                                if(result.data.estatus == 1){
                                    enviarCorreoProveedorTesoreria();
                                    $scope.getEstatusTramite();
                                    $scope.getEstatusTramiteProveedores($scope.idProspecto);
                                    $("#loading").modal("hide");
                                    swal('Listo', "Se aprobó el trámite correctamente.", 'success');

                                } else {
                                    $("#loading").modal("hide");
                                    swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                                }

                            });
                        }
                    });
                } else if ($scope.tesoreria == 1) {
                    console.log("aprueba Tesoreria");
                    proveedoresRepository.aprobarProveedorTesoreria( $scope.usuAutoriza, $scope.idProspecto, $scope.id_perTra).then((result) => {
                        if (result.data.estatus == 1) {
                            aprobarRepository.aprobarTramite($scope.id_perTra, cambio, $scope.moralFisica,  $scope.usuAutoriza).then((res) => {
                                if (res.data[0].success == 1) {
                                    $scope.getEstatusTramite();
                                    $scope.getEstatusTramiteProveedores($scope.idProspecto);
                                    $("#loading").modal("hide");
                                    swal('Listo', res.data[0].msg, 'success');
                                } else {
                                    $("#loading").modal("hide");
                                    swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                                }
                            });

                        }else if(result.data.estatus == -4){
                            swal('Error', 'Error al enviar el correo de Activación', 'error');
                        }
                         else {
                            swal('Error', 'Ocurrio un error al aprobar trámite', 'error');

                        }

                    });


                }

            } else {
                if ($scope.finanzas == 1) {
                    aprobarRepository.aprobarTramiteFinanzas($scope.id_perTra, cambio, $scope.moralFisica, $scope.user.usu_idusuario).then((res) => {
                        if (res.data[0].success == 1) {
                            proveedoresRepository.enviarNotificacionTesoreria($scope.user.usu_idusuario, $scope.idProspecto,$scope.id_perTra).then((result)=>{
                                if(result.data.estatus == 1){
                                    enviarCorreoProveedorTesoreria();
                                    $scope.getEstatusTramite();
                                    $scope.getEstatusTramiteProveedores($scope.idProspecto);
                                    $("#loading").modal("hide");
                                    swal('Listo', "Se aprobó el trámite correctamente.", 'success');

                                } else {
                                    $("#loading").modal("hide");
                                    swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                                }

                            });
                        //     $scope.getEstatusTramite();
                        //     $("#loading").modal("hide");
                        //     swal('Listo', res.data[0].msg, 'success');
                        // } else {
                        //     $("#loading").modal("hide");
                        //     swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                        }

                    });

                } else if ($scope.tesoreria == 1) {

                    console.log("aprueba Tesoreria cuentas"); 
                     proveedoresRepository.aprobarCuentaBancariaProveedorTesoreria($scope.usuAutoriza, $scope.rfc, $scope.id_perTra).then((result) => {
                        if (result.data.estatus == 1) {
                            aprobarRepository.aprobarTramite($scope.id_perTra, cambio, $scope.moralFisica, $scope.usuAutoriza).then((res) => {
                                if (res.data[0].success == 1) {
                                    $scope.getEstatusTramite();
                                    $scope.getEstatusTramiteProveedores($scope.idProspecto);
                                    $("#loading").modal("hide");
                                    swal('Listo', res.data[0].msg, 'success');
                                } else {
                                    $("#loading").modal("hide");
                                    swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                                }
                            });

                        } else {
                            swal('Error', 'Ocurrio un error al aprobar trámite', 'error');

                        }

                    });

                    // proveedoresRepository.aprobarCuentaBancariaProveedor($scope.user.usu_idusuario, $scope.rfc, $scope.id_perTra).then((result) => {
                    //     if (result.data.estatus == 1) {
                    //         aprobarRepository.aprobarTramite($scope.id_perTra, cambio, $scope.moralFisica, $scope.user.usu_idusuario).then((res) => {
                    //             if (res.data[0].success == 1) {
                    //                 $scope.getEstatusTramite();
                    //                 $("#loading").modal("hide");
                    //                 swal('Listo', res.data[0].msg, 'success');
                    //             } else {
                    //                 $("#loading").modal("hide");
                    //                 swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                    //             }
                    //         });

                    //     } else {
                    //         swal('Error', 'Ocurrio un error al aprobar trámite', 'error');

                    //     }

                    // });


                }
            }

        } else {
            aprobarRepository.aprobarTramite($scope.id_perTra, cambio, $scope.moralFisica, $scope.user.usu_idusuario, $scope.idProspecto, $scope.id_TipoProspecto).then((res) => {
                if (res.data[0].success == 1) {
                    $scope.getEstatusTramite();
                    $("#loading").modal("hide");
                    swal('Listo', res.data[0].msg, 'success');
                } else {
                    $("#loading").modal("hide");
                    swal('Alto', 'No se pudo aprobar el trámite intentalo mas tarde', 'warning');
                }
            });
        }
    }

    $scope.rechazarTramite = function () {
        swal({
            title: '¿Esta acción rechazará todo el trámite, desea proceder?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $("#loading").modal("show");
                    aprobarRepository.rechazarTramite($scope.id_perTra, $scope.user.usu_idusuario).then((res) => {
                        if (res.data[0].success == 1) {
                            if ($scope.id_TipoProspecto == 2) { $scope.updTramite('Rechazo tramite ' + $scope.user.usu_idusuario, 6); }
                            if ($scope.id_TipoProspecto == 1) {
                              
                                proveedoresRepository.datosProveedor($scope.rfc).then((result) => {

                                    if (result.data) {
                                        var to, subject, html;
                                        to = result.data[0].email;
                                        html = $scope.html1 + $scope.titleTramite + "<br><br>Estimado " + $scope.nombre + " su trámite fue rechazado. <br>  Para iniciar un nuevo trámite, por favor entre al Portal de Proveedores.  <br> " + $scope.html2;
                                        $scope.sendMail(to, 'Tramite #' + $scope.id_perTra + ' - Rechazado', html);
                                        proveedoresRepository.updateTipoCuenta($scope.id_perTra).then((resu) => {

                                            console.log("update tipo Cuenta",resu);
        
                                        });
                                    }

                                });
                            }


                            $scope.getEstatusTramite();
                            $("#loading").modal("hide");
                            swal('Listo', res.data[0].msg, 'success');
                           // $location.path('/home');
                        } else {
                            $("#loading").modal("hide");
                            swal('Alto', 'No se pudo rechazar el trámite intento mas tarde', 'warning');
                        }
                    });
                } else {
                    swal(
                        'Cancelado',
                        'No se aplicaron los cambios',
                        'error'
                    );
                }
            });
    }

    $scope.goHome = function () {
        $location.path('/home');
    }
    var cuentas = function (idProspecto, opcion) {
        var rfc = "";
        if ($scope.tipoTramite == 5) {
            rfc = $scope.rfc
        }
        var cuentas = $q.defer();
        proveedoresRepository.getObtenerCuentas(idProspecto, opcion, rfc).then(function successCallback(result) {
            cuentas.resolve(result.data);
        }, function errorCallback(result) {
            cuentas.reject(result);
        });
        return cuentas.promise;
    };
    $scope.getTipocuenta = function (idProspecto) {
        proveedoresRepository.getTipocuenta(idProspecto).then(function (tipoCuenta) {
            if (tipoCuenta.data) {
                $scope.tipoCuentas = tipoCuenta.data;
            }
        });
    }
    $scope.varBancoCuenta = function () {

        obtenerCuentas();
        $("#mostrarCuentasBancarias").modal("show");
    }
    $scope.guardaTipoCuenta = function () {
        proveedoresRepository.guardarTipocuenta($scope.cuentaBancaria.idCuentaBancaria, $scope.tipoCuenta.cveTipoCuenta, $scope.tipoCuenta.tipoCuenta, $scope.id_perTra).then(function (result) {
            if (result.data[0].result == 1) {

                obtenerCuentas();
                limpiarCampos();
                swal("Listo!", "Se guardó con éxito el registro.", "success");
            }
        });
    }
    $scope.getTipocuenta = function (idProspecto) {
        proveedoresRepository.getTipocuenta(idProspecto, 2).then(function (result) {
            if (result.data) {
                $scope.tipoCuentas = result.data;
            }
        });
    }
    $scope.cambiarTipoCuenta = function (cuenta) {
        proveedoresRepository.guardarTipocuenta(cuenta.idCuentaBancaria, '', '').then(function (result) {
            if (result.data[0].result == 1) {

                obtenerCuentas();
                limpiarCampos();
                swal("Listo!", "Se eliminó con éxito el registro.", "success");
            }
        });
    }
    var limpiarCampos = function () {
        $scope.tipoCuenta = "";
        $scope.bancosProspecto = "";

    }
    $scope.verTiposProveedor = function () {
        $scope.obtenerRolesProveedor($scope.idProspecto);
        $scope.obtenerMarcas();
        $("#mostrarTipoProveedor").modal("show");
    }

    $scope.verCuentas = function () {
        $("#mostrarCuentasBancarias").modal("show");

    }
    $scope.obtenerTipoProveedor = function (idProspecto) {
        proveedoresRepository.getObtenerTipoProveedor(idProspecto).then(function (result) {
            if (result.data) {
                $scope.tiposProveedor = result.data;
            }
        });
    }
    $scope.guardaTipoProveedor = function () {
        var ban = 0;
        angular.forEach($scope.marcas, function (value, key) {
            if (value.selected) {
                ban = ban + 1;
            }
        });
        if (ban == 0) {
            swal("Atención!", "Favor de seleccionar las empresas donde se asignaran permisos.", "warning");
        } else {
            var loopPromises = [];
            angular.forEach($scope.marcas, function (value, key) {
                var deferred = $q.defer();
                if (value.selected) {
                    loopPromises.push(proveedoresRepository.guardarTipoProveedor($scope.idProspecto, $scope.tipoProv.cveProveedor, $scope.tipoProv.tipoProveedor, value.emp_idempresa, value.emp_nombrebd).then(function (result) { }));
                }
            });
            $q.all(loopPromises).then(function () {
                $('.wrapper .list').slideToggle('fast');
                $scope.obtenerMarcas();
                $scope.obtenerRolesProveedor($scope.idProspecto);
                $scope.obtenerTipoProveedor($scope.idProspecto)
            });
        }
    }

    $scope.obtenerRolesProveedor = function (idProspecto) {
        proveedoresRepository.getObtenerRolesProveedor(idProspecto).then(function (result) {
            if (result.data) {
                $scope.rolesProveedor = result.data;
            }
        });
    }

    var limpiarCamposTipoProv = function () {
        $scope.tipoProv = "";

    }
    $scope.eliminarRol = function (rol) {
        proveedoresRepository.eliminarRolProveedor(rol.idProspectoRol).then(function (result) {

            if (result.data[0].result == 1) {
                swal("Listo!", "Se eliminó el tipo de proveedor correctamente.", "success");
            } else {
                swal("Error!", "Ocurrió un error al eliminar el tipo de proveedor.", "error");
            }
            $scope.obtenerTipoProveedor($scope.idProspecto);
            $scope.obtenerRolesProveedor($scope.idProspecto);
            limpiarCamposTipoProv();
        });
    }
    $scope.validarRFC = function (rfc) {
        proveedoresRepository.validarRFC(rfc).then(function (result) {
            if (result.data[0].result == 1) {
                $scope.activarAprobar = false;
                $scope.mostrarAlerta = true;
                swal("Error!", "El RFC se encuentra en EFOS del SAT.", "error");
            } else {
                $scope.activarAprobar = true;
                $scope.mostrarAlerta = false;
            }
        });
    }

    $scope.obtenerMarcas = function () {
        proveedoresRepository.traerMarcas().then(function (result) {
            if (result.data) {
                $scope.marcas = result.data;
            }
        });
    }

    $('.selected-items-box').bind('click', function (e) {
        $('.wrapper .list').slideToggle('fast');
    });

    $scope.getSelectedItems = function (item) {
        return item.selected;
    };

    $scope.verModalCuentas = function (documento) {
        $scope.modalTitle = "Estados de cuenta bancarios";
        $scope.getDocsCuentasAprobar();
        $("#mostrarModalCuentas").modal("show");
    }

    $scope.getDocsCuentasAprobar = function () {
        aprobarRepository.getDocsCuentasAprobar($scope.id_perTra).then(function (res) {
            if (res.data.length) {
                $scope.verDocumento = 1;
                $scope.aprobarCuentasDocs = res.data;
            } else {
                $scope.verDocumento = 0;
            }
        });
    }
    $scope.rechazarDocumentoBancario = function (documento) {
        $scope.sendDetIdPerTra = documento.detIdPerTra;
        $scope.modalTitle = documento.nombreDoc
        $("#rechazarDocBancario").modal("show");
    }

    $scope.rechazarEstadoCuenta = function(){
        $("#mostrarPdf").modal("hide");
        $('#rechazarDocBancario').insertAfter($('body'));
        $("#rechazarDocBancario").modal("show");
    }

    $scope.aprobarEstadoCuenta = function(){
        $("#loading").modal("show");
        aprobarRepository.aprobarDocumentoBancario($scope.sendDetIdPerTra).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                $scope.getEstatusTramite();
                $scope.getDocsAprobar();
                $scope.getDocsCuentasAprobar();
                $scope.getActivarAprobarTramite();
                swal('Listo', 'Se aprobó el documento', 'success');
            } else {
                $("#loading").modal("hide");
                swal('Alto', 'Ocurrio un error al aprobar el documento intentelo mas tarde', 'warning');
            }
        });


        // $("#mostrarPdf").modal("hide");
        // $('#rechazarDocBancario').insertAfter($('body'));
        // $("#rechazarDocBancario").modal("show");
    }

    $scope.aprobarDocumentoBancario = function (documento) {
        $("#loading").modal("show");
        aprobarRepository.aprobarDocumentoBancario(documento.detIdPerTra).then((res) => {
            if (res.data[0].success == 1) {
                $("#loading").modal("hide");
                $scope.getDocsAprobar();
                $scope.getDocsCuentasAprobar();
                $scope.getActivarAprobarTramite();
                swal('Listo', 'Se aprobó el documento', 'success');
            } else {
                $("#loading").modal("hide");
                swal('Alto', 'Ocurrio un error al aprobar el documento intentelo mas tarde', 'warning');
            }
        });
    }
    $scope.sendRechazoBancario = function () {
        if ($scope.razonesRechazo == '') {
            swal('Alto', 'Debes enviar la razón por la cual rechazas el documento', 'warning');
        } else {
            $("#rechazarDoc").modal("hide");
            $("#loading").modal("show");
            if ($scope.finanzas == 1) {
                aprobarRepository.rechazarDocumentoBancario($scope.sendDetIdPerTra, $scope.razonesRechazo).then((res) => {
                    if (res.data[0].success == 1) {

                        proveedoresRepository.datosProveedor($scope.rfc).then((result) => {

                            if (result.data) {
                                var to, subject, html;
                                to = result.data[0].email;
                                html = $scope.html1 + $scope.titleTramite + "<br><br>Estimado " + $scope.nombre + " su Estado de Cuenta fue rechazado por la siguiente razon: <br> " + $scope.razonesRechazo + " <br> Favor de adjuntar nuevamente el documento desde el Portal de Proveedores.  <br> " + $scope.html2;
                                $scope.sendMail(to, 'Tramite #' + $scope.id_perTra + ' - Documento Rechazado - Depto. Finanzas', html);
                            }
                            $("#loading").modal("hide");
                        $("#rechazarDocBancario").modal("hide");
                        $scope.getEstatusTramite();
                        $scope.getDocsAprobar();
                        $scope.getDocsCuentasAprobar();
                        $scope.razonesRechazo = '';
                        $scope.sendDetIdPerTra = 0;
                        swal('Listo', res.data[0].msg, 'success');

                            

                        });
                        // $scope.updTramite('Documentación rechazada', 8);
                        
                    } else {
                        $scope.sendDetIdPerTra = 0;
                        $("#loading").modal("hide");
                        swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
                    }
                });

            } else if ($scope.tesoreria == 1) {
                aprobarRepository.rechazarDocumentoBancarioTesoreria($scope.sendDetIdPerTra, $scope.razonesRechazo, $scope.usuAutoriza).then((res) => {
                    if (res.data[0].success == 1) {
                        proveedoresRepository.datosProveedor($scope.rfc).then((result) => {

                            if (result.data) {
                                var to, subject, html;
                                to = result.data[0].email;
                                html = $scope.html1 + $scope.titleTramite + "<br><br>Estimado " + $scope.nombre + " su Estado de Cuenta fue rechazado por la siguiente razon: <br> " + $scope.razonesRechazo + " <br> Favor de adjuntar nuevamente el documento desde el Portal de Proveedores.  <br> " + $scope.html2;
                                $scope.sendMail(to, 'Tramite #' + $scope.id_perTra + ' - Documento Rechazado - Depto. Tesoreria', html);
                            }

                            $("#loading").modal("hide");
                            $("#rechazarDocBancario").modal("hide");
                            $scope.getEstatusTramite();
                            $scope.getDocsAprobar();
                            $scope.getDocsCuentasAprobar();
                            $scope.razonesRechazo = '';
                            $scope.sendDetIdPerTra = 0;
                            swal('Listo', res.data[0].msg, 'success');

                        });

                        //$scope.updTramite('Documentación rechazada', 8);

                    } else {
                        $scope.sendDetIdPerTra = 0;
                        $("#loading").modal("hide");
                        swal('Alto', 'Ocurrio un error al rechazar el documento', 'warning');
                    }
                });

            }

        }
    }

    $scope.cancelRechazoBancario = function () {
        $("#rechazarDocBancario").modal("hide");
        $scope.razonesRechazo = '';
    };
    $scope.seleccionarTodas = function () {
        if ($scope.seleccionarTodo == true) {


            angular.forEach($scope.marcas, function (value, key) {
                value.selected = true;
            });


        } else if ($scope.seleccionarTodo == false) {
            angular.forEach($scope.marcas, function (value, key) {
                value.selected = false;
            });
        }
    };

    /**********************************************************************/

    $scope.sendMail = function (to, subject, html) {
        devolucionesRepository.sendMailCliente(to, subject, html).then((res) => {
            if (res.data.response.success == 1) {
                console.log('Correo enviado con exito ")')
            } else {
                console.log('Ocurrió un error al emviar el correo "( ')
            }
        });
    };

    $scope.mostrarInfoProspecto = function () {
        $("#mostrarModalInfoProspecto").modal("show");
        proveedoresRepository.obtenerDatosProspecto($scope.idProspecto).then((res) => {
            console.log('Datos Prospecto', res.data[0])
            $scope.User = res.data[0];
            // if (res.data) {
            //     console.log('Datos Prospecto', res.data)
            // }
        });

    };

    var getDatosProspecto = function () {
        proveedoresRepository.obtenerDatosProspecto($scope.idProspecto).then((res) => {
            console.log('Datos Prospecto', res.data[0])
            $scope.User = res.data[0];
            // if (res.data) {
            //     console.log('Datos Prospecto', res.data)

            // }
        });
    };

    var enviarCorreoProveedorTesoreria = function () {
        proveedoresRepository.datosProveedor($scope.rfc).then((result) => {

            if (result.data) {
                var to, subject, html;
                to = result.data[0].email;
                html = $scope.html1 + $scope.titleTramite + "<br><br>Estimado " + $scope.nombre + " su trámite fue enviado a validación por Tesoreria. <br>  " + $scope.html2;
                $scope.sendMail(to, 'Tramite #' + $scope.id_perTra + ' - Validación Tesoreria', html);
            }
        });
    }

    $scope.salirTramite = function(){
        $location.path('/home');
    }

    $scope.cargarApiClientes = function () {
        $("#loadModalCXC").modal("show");
        var param = {
            idCliente: $scope.idClienteSemi,
            idProceso: 7,
            idUsuarioBpro: $scope.usuAutoriza,  // $rootScope.currentEmployee,
            parametros : [{ idPertra : parseInt($scope.id_perTra)  }]
           
        }
        aprobarRepository.apiDocCliente(param).then((res) => {
            var urlClie = $scope.docClienteFrontUrl + "/login?usuarioBpro=" + res.data.recordsets[0][0].user + "&token=" + res.data.recordsets[0][0].token;
            $scope.urlCli = $sce.trustAsResourceUrl(urlClie);
            console.log('URLCLI', urlClie);
            console.log("url", $scope.urlCli);
            $("#loadModalCXC").modal("hide");
            $("#mostrarApiDocumentos").modal("show");
        })
    };

    $scope.mostrarApiDocumentos = function(){
        $scope.cargarApiClientes();
    };

    $scope.cerrarApiDocumentos = function(){
        aprobarRepository.activarAprobarTramite($scope.id_perTra, 1).then(function (res) {
            if (res.data[0].success == 1) {
                $scope.activarAprobar = false;
            } else {
                $scope.activarAprobar = true;
            }
        });
        $scope.getDocsAprobar();
        $scope.getEstatus(0,$scope.id_perTra);
        $scope.getEstatusTramite();
        $scope.getEstatusTramiteProveedores($scope.idClienteSemi);


        $("#mostrarApiDocumentos").modal("hide");
    };

    $scope.aprobarCuentaSeminuevos = function(){
        $("#loadModalCXC").modal("show");
        aprobarRepository.aprobarTramiteSemi($scope.id_perTra, $scope.idClienteSemi,$scope.usuAutoriza).then(function (res) {
            if (res.data[0].success == 1) {

                aprobarRepository.apiDocClienteToken(res.data[0].token).then((result) => {
                    $scope.getDocsAprobar();
                    $scope.getEstatus(0,$scope.id_perTra);
                    $scope.getEstatusTramite();
                    $scope.getEstatusTramiteProveedores($scope.idClienteSemi);
                  



                });

                // 'http://192.168.20.137:4094/acceso/GetImportarDocumentosExpedienteCompra?token=1c95ba2903-898682E5'


        //        $scope.activarAprobar = false;
            } else {
          //      $scope.activarAprobar = true;

             swal('Alto', 'Ocurrió un error al aprobar la cuenta bancaria.', 'warning');
            }
            $("#loadModalCXC").modal("hide");
        });

    }


 


});