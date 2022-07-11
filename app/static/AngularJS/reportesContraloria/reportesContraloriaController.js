
registrationModule.controller('reportesContraloriaController', function ($sce, $scope, reportesContraloriaRepository, fondoFijoRepository) {


    $scope.listaFondoFijo = []


    $scope.template;
    $scope.options;
    $scope.reports;

    $scope.general = {
        'template': {},
        'options': {},
        'reports': {},
        'data': {}
    };

    $scope.data = {
        'dato': [],
        'valeAbierto': [],
        'sumValesAbiertos': [],
        'comPendientes': [],
        'sumPendientes': [],
        'reembolso': [],
        'resumen': [],
        'arqueo': [],
        'detalleArqueo': [],
        'detalleArqueoBilletes': []
    };

    $scope.resuman = {
        'totalesValesProvAbiertos': 0,
        'totalesCompPendientes': 0,
        'totalesReembolso': 0,
        'totales': 0,
        'totalFondoFijo': 0,
        'saldoAVerificar': 0,
        'auxiliar': 0,
        'diferencia': 0,
    };

    $scope.reembolso = {
        'numero': 0,
        'fecha': '',
        'solicitante': '',
        'cantidad': 0
    };

    $scope.sumPendiente = {
        'etiqueta': '',
        'cantidad': 0
    };

    $scope.comPendiente = {
        'factura': 0,
        'concepto': '',
        'proveedor': '',
        'fecha': '',
        'cantidad': 0
    };

    $scope.sumValesAbierto = {
        'etiqueta': '',
        'cantidadOriginal': 0,
        'comprobada': 0,
        'porComprobar': 0
    }

    $scope.valeAbierto = {
        'numero': 0,
        'fechaExpedicion': '',
        'solicitante': '',
        'cantidad': 0,
        'comprobada': 0,
        'porComprobar': 0
    };

    $scope.dato = {
        'idFondoFijo': '',
        'fecha': '',
        'hora': '',
        'agencia': '',
        'sucursal': '',
        'departamento': '',
        'responsable': '',
        'monto': '',
    }

    $scope.reports = {
        'save': true
    }

    $scope.options = {
        'preview': true
    }

    // $scope.template = {
    //     'shortid': 'SkezZsweqU'
    // }

    $scope.template = {
        'shortid': 'rJRZlK2TI'
    }

    $scope.dataUsuario;
    $scope.cantidad;
    $scope.sumatoriaArqueo = 0;
    $scope.urlEvidencia = ''
    $scope.tablaReembolso = 0;
    $scope.urlReembolso = ''
    $scope.urlEvidenciaOP = ''
    $scope.documento = {url:'',archivo:'', ext_nombre:'PDF'};
    $scope.autoriza = 0;


    $scope.init = () => {

        $scope.dataUsuario = JSON.parse(localStorage.getItem('usuario'));
        $scope.documento = {url:'',archivo:'', ext_nombre:'PDF'};

        console.log('documento: ',$scope.documento)
        $scope.getListaFondoFijo();
        if($scope.dataUsuario.idRol == 1 || $scope.dataUsuario.idRol == 10 || $scope.dataUsuario.idRol == 13)
        {
            $scope.autorizadoresCajeroEspejo();
        }

        $scope.obtieneArqueos();
    }

    $scope.getListaFondoFijo = function () {


        reportesContraloriaRepository.listaTablero($scope.dataUsuario.usu_idusuario).then(resp => {

            $scope.listaFondoFijo = resp.data;
            $('#tableMisTramite').DataTable().destroy();
            setTimeout(() => {
                $('#tableMisTramite').DataTable({
                    destroy: true,
                    "responsive": false,
                    "scrollX": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[1, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#tableMisTramite_length').hide();
                $('#loading').modal('hide');
            }, 1000);
        })


    }

    $scope.goReporte = function (id) {

        $scope.general = {
            'template': {},
            'options': {},
            'reports': {},
            'data': {}
        };

        $scope.sumValesAbierto = {
            'etiqueta': 'Totales',
            'cantidadOriginal': 0,
            'comprobada': 0,
            'porComprobar': 0
        }

        $scope.resuman = {
            'totalesValesProvAbiertos': 0,
            'totalesCompPendientes': 0,
            'totalesReembolso': 0,
            'totales': 0,
            'totalFondoFijo': 0,
            'saldoAVerificar': 0,
            'auxiliar': 0,
            'diferencia': 0,
        };

        var sumOriginal = 0;
        var sumComprobada = 0;
        var sumPendiente = 0;

        var sumCom = 0
        var sumReem = 0

        var datosCab = [];
        var valesAbiertos = [];
        var sumValesAbiertos = [];
        var CompPendientes = [];
        var sumCompPendientes = [];
        var reembolsos = [];
        var sumReembolsos = [];
        var cabeceroArqueo = {
            'realizo': '',
            'folioFF': '',
            'fecha': ''
        };

        var arqueo = [];
        var detalleArqueoBilletes = [];
        var detalleArqueo = []
        var auxiliarContable = []
        var indiceSumatorias = 0
        var sumaBilletes = 0
        var sumaMonedas = 0
        var totales = 0

        $scope.general.template = {shortid: "HktFjCPzt"};// $scope.template; //'HktFjCPzt';
        $scope.general.options = $scope.options;
        $scope.general.reports = $scope.reports;
        $scope.data.resumen = [];

        //console.log('RESUMEN  ',$scope.data.resumen)
        $("#loading").modal("show");
        reportesContraloriaRepository.getDataReporte(id).then(resp => {
            // console.log(resp.data)    
            // CABECERO
            $scope.dato.idFondoFijo = resp.data[0][0].idFondoFijo;
            $scope.dato.fecha = resp.data[0][0].fecha;
            $scope.dato.hora = resp.data[0][0].hora;
            $scope.dato.agencia = resp.data[0][0].agencia;
            $scope.dato.sucursal = resp.data[0][0].sucursal;
            $scope.dato.departamento = resp.data[0][0].departamento;
            $scope.dato.responsable = resp.data[0][0].responsable;
            $scope.dato.monto = resp.data[0][0].monto

            datosCab.push($scope.dato);

            // vales abiertos
            valesAbiertos = resp.data[1];
            indiceSumatorias = resp.data[1].findIndex(elem => elem.solicitante === 'TOTALES');
            
            // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
            for(let i = 0; i< resp.data[1].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[1][i].cantidad = '$' + formatMoney(resp.data[1][i].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].comprobada = '$' + formatMoney(resp.data[1][i].comprobada) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].porComprobar = '$' + formatMoney(resp.data[1][i].porComprobar) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].autorizadoDeMas =  '$' +formatMoney(resp.data[1][i].autorizadoDeMas)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                $scope.sumValesAbierto.cantidadOriginal = resp.data[1][indiceSumatorias].cantidad;
                $scope.sumValesAbierto.comprobada = resp.data[1][indiceSumatorias].comprobada;
                $scope.sumValesAbierto.porComprobar = resp.data[1][indiceSumatorias].porComprobar;

               resp.data[1][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[1][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].comprobada = '$' + formatMoney(resp.data[1][indiceSumatorias].comprobada) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].porComprobar = '$' + formatMoney(resp.data[1][indiceSumatorias].porComprobar)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].autorizadoDeMas = '$' + formatMoney(resp.data[1][indiceSumatorias].autorizadoDeMas)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

            } else {
                $scope.sumValesAbierto.cantidadOriginal = 0
                $scope.sumValesAbierto.comprobada = 0
                $scope.sumValesAbierto.porComprobar = 0
            }
            sumValesAbiertos.push($scope.sumValesAbierto);
            indiceSumatorias = 0;

            // Comprobantes pendientes
            CompPendientes = resp.data[2];
            indiceSumatorias = resp.data[2].findIndex(elem => elem.concepto === 'TOTAL');

            // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
            for(let i = 0; i< resp.data[2].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[2][i].cantidad = '$' + formatMoney(resp.data[2][i].cantidad) // .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumCom = resp.data[2][indiceSumatorias].cantidad
                resp.data[2][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[2][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumCom = 0
            }
            sumCompPendientes.push(sumCom);
            indiceSumatorias = 0;

            // REEMBOLSO
            reembolsos = resp.data[3];
            indiceSumatorias = resp.data[3].findIndex(elem => elem.solicitante === 'TOTAL');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[3].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[3][i].cantidad ='$' + formatMoney(resp.data[3][i].cantidad) // .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumReem = resp.data[3][indiceSumatorias].cantidad
                resp.data[3][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[3][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            }
            else {
                sumReem = 0
            }

            sumReembolsos.push(sumReem)

            // ARQUEO
            arqueo = resp.data[4]
            //DESGLOSE ARQUEO
            detalleArqueo = resp.data[5];
            indiceSumatorias = resp.data[5].findIndex(elem => elem.nombre === 'Suma Monedas');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[5].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[5][i].total = '$' + formatMoney(resp.data[5][i].total)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumaMonedas = resp.data[5][indiceSumatorias].total
                resp.data[5][indiceSumatorias].total = '$' + formatMoney(resp.data[5][indiceSumatorias].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumaMonedas = 0
            }

            indiceSumatorias = 0

            detalleArqueoBilletes = resp.data[6];
            indiceSumatorias = resp.data[6].findIndex(elem => elem.nombre === 'Suma Billetes');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[6].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[6][i].total = '$' + formatMoney(resp.data[6][i].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumaBilletes = resp.data[6][indiceSumatorias].total
                resp.data[6][indiceSumatorias].total= '$' + formatMoney(resp.data[6][indiceSumatorias].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumaBilletes = 0
            }

            indiceSumatorias = 0

            auxiliarContable = resp.data[7]

            firmantes = resp.data[8]

            totales = $scope.sumValesAbierto.porComprobar + sumCom + sumReem + sumaMonedas + sumaBilletes
            // RESUMEN
            $scope.resuman.totalesValesProvAbiertos = '$' + formatMoney($scope.sumValesAbierto.porComprobar)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totalesCompPendientes = '$' + formatMoney(sumCom)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totalesReembolso = '$' + formatMoney(sumReem)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totales = totales.toFixed(2);
            $scope.resuman.totalFondoFijo = '$' +formatMoney($scope.dato.monto) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.saldoAVerificar = '$' + formatMoney(($scope.dato.monto - $scope.resuman.totales)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });//resp.data[5][12].total
            $scope.resuman.efectivo = '$' +formatMoney((sumaMonedas + sumaBilletes)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            //$scope.resuman.saldoAuxiliar = sumReem > 0 ? (sumaMonedas + sumaBilletes).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : (0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.saldoAuxiliar = resp.data[7][0].SALDOFINAL
            
            $scope.resuman.difAuxiliarContable =  ($scope.resuman.saldoAuxiliar - (sumaMonedas + sumaBilletes)) 
            $scope.resuman.saldoAuxiliar = '$' + formatMoney(resp.data[7][0].SALDOFINAL) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
            // DAMOS EL FORMATO DE MONEDA A LOS TOTALES DE CADA TABLA
            $scope.dato.monto = '$' +formatMoney($scope.dato.monto)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totales = '$' + formatMoney(Number( $scope.resuman.totales)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.difAuxiliarContable  = '$' +formatMoney($scope.resuman.difAuxiliarContable) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

            // ESTRUCTURA DE DATOS
            $scope.data.dato = datosCab;
            $scope.data.valeAbierto = valesAbiertos;
            $scope.data.sumValesAbiertos = sumValesAbiertos;
            $scope.data.comPendientes = CompPendientes;
            $scope.data.reembolso = reembolsos;
            $scope.data.sumPendientes = sumReembolsos
            $scope.data.resumen.push($scope.resuman);
            $scope.data.arqueo = arqueo;
            $scope.data.detalleArqueo = detalleArqueo;
            $scope.data.detalleArqueoBilletes = detalleArqueoBilletes;
            $scope.data.firmaElaboro = [firmantes[0]];
            $scope.data.firmaResponsable = [firmantes[1]];
            $scope.data.firmaAuditor = [firmantes[2]];

           

            $scope.general.data = $scope.data;

            console.log($scope.general)

            reportesContraloriaRepository.reporte($scope.general).then((resp) => {

                var file = new Blob([resp.data], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                $scope.content = $sce.trustAsResourceUrl(fileURL);

                $("#loading").modal("hide");
                $scope.reporteHtml = '';
                $('#pdfReferenceContent object').remove();
                $('#pdfReferenceContent').find('iframe').remove();
                $scope.modalTitle = 'reporte';
                //$scope.reporteHtml = resp.data;
                var pdf = $scope.content;
                $("").appendTo('#pdfReferenceContent');
                $(`<object data="${$scope.content}" type="application/pdf" style="width:100%;height:90%"></object>`).appendTo('#pdfReferenceContent');
                // $("" + pdf + "").appendTo('#pdfReferenceContent');
                $("#mostrarPdf").modal("show");

            });
        });

    }

    $scope.capturaArqueo = function (folio, id, idEmpresa, idSucursal, idDepartamento, idUsuarioResponsable) {
        $scope.enFirma = false;
        var fecha = new Date().toLocaleString('es-MX');//.toLocaleDateString('es-MX',{year:'numeric', month:'2-digit', day:'2-digit'});
        $scope.ids = id;
        $scope.tipoMonedas = [];
        $scope.modalFolio = folio;
        $scope.modalFecha = fecha;
        reportesContraloriaRepository.getCatalogoMonedas().then(resp => {
            $scope.tipoMonedas = [];
            $scope.ordenarAsc(resp.data, 'id');
            $scope.tipoMonedas = resp.data;
            $scope.tipoMonedas.forEach(Element => {
                Element.suma = 0;
                Element.cantidad = 0;
            })
            $('#tableArqueo').DataTable().clear();
            $('#tableArqueo').DataTable().destroy();
            setTimeout(() => {
                $('#tableArqueo').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: false,
                    paging: false,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[1, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#tableArqueo_length').hide();
                $('#loading').modal('hide');

                $("#arqueo").modal("show");
                $scope.idTipoPersona    = 1;

            }, 1000);

        });

    }

    $scope.ordenarAsc = function (p_array_json, p_key) {
        p_array_json.sort(function (a, b) {
            return a[p_key] > b[p_key];
        });
    }

    $scope.datosArqueo = function (dato, cantidad) {
        $scope.sumatoriaArqueo = 0;
        $scope.tipoMonedas[dato - 1].suma = $scope.tipoMonedas[dato - 1].valor * cantidad;
        $scope.tipoMonedas[dato - 1].cantidad = cantidad;
        console.log($scope.tipoMonedas[dato - 1])

        $scope.tipoMonedas.forEach(element => {
            $scope.sumatoriaArqueo += element.suma
        })
    }

    $scope.guardarArqueo = function () {

        var cabecero = {
            idUsuario: $scope.dataUsuario.usu_idusuario,
            montoSaldoCaja: $scope.sumatoriaArqueo,
            idFondoFijo: $scope.ids
        }

        var detalle = []


        $scope.tipoMonedas.forEach(element => {
            var dato = {
                idMoneda: 0,
                cantidadMonedas: 0
            }
            dato.idMoneda = element.id;
            dato.cantidadMonedas = element.cantidad;

            detalle.push(dato)
        });

        
        console.log("Cabecero",  JSON.stringify(cabecero) );
        console.log( "Detalle", JSON.stringify(detalle) );
        reportesContraloriaRepository.guardaArqueo(
            JSON.stringify(cabecero), 
            JSON.stringify(detalle), 
            $scope.token.keyId, 
            $scope.dataUsuario.usu_idusuario,
	        $scope.modalFolio,
            $scope.comentarios
        ).then(resp => {
            if (resp.data[0].estatus === 1) {
                swal('Ok', 'El arqueo se guardo correctamente', 'success');
                swal({
                    title: 'El arqueo se guardo correctamente',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.getListaFondoFijo();
                            $scope.editArqueo();
                            $("#arqueo").modal("hide");

                        }
                    })
                //

            } else {

                swal('Atención!', 'Hubo un problema al guardar el arqueo, intente mas tarde', 'warning');
            }
        })

               

        //  console.log('Ya casi', JSON.stringify(cabecero))
        //  console.log('detalle ', JSON.stringify(detalle));
        //  reportesContraloriaRepository.guardarArqueo(cabecero,detalle).then(resp => {

        //  })
    }


    $scope.viewVales = function (id) {
        $scope.tipoVale=0
        $scope.catalogoVales=[]
        $scope.idFondoFijoSelected = id
        var tipoSeleccionado
        reportesContraloriaRepository.catalogoEstatusValesFF().then(res => {
            $scope.catalogoVales = res.data
            tipoSeleccionado = $scope.catalogoVales.filter(x => x.selected===1);
            $scope.tipoVale= tipoSeleccionado[0].id

            $scope.obtieneVales( $scope.idFondoFijoSelected, $scope.tipoVale)
        })


    }

    $scope.buscaTipoVale= function(){
        $scope.obtieneVales( $scope.idFondoFijoSelected, $scope.tipoVale)
    }

    $scope.obtieneVales = function(id,tipo){
        reportesContraloriaRepository.ObtieneDatosVales(id, tipo).then(resp => {
            $scope.evidenciasVales = []
            $scope.evidenciasVales = resp.data
            $scope.modalTitle = 'Evidencias vales'
            $('#valesEvidencia').DataTable().clear();
            $('#valesEvidencia').DataTable().destroy();
            setTimeout(() => {
                $('#valesEvidencia').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[1, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#valesEvidencia_length').hide();
                $('#viewEvidencia').find('object').remove();
                $("#viewVales").modal("show");
            })

        })
    }

    $scope.verEvidencia = function(url){
        if(url === undefined){
            swal('Aviso','Por el momento no es posible abrir el archivo de evidencia solicitado, favor de intentra mas tarde','warning')
        }else{
            $scope.urlEvidencia = ''
            $('#viewEvidencia').find('object').remove();
            $scope.urlEvidencia = url;
            $("<object class='lineaCaptura' data='" + $scope.urlEvidencia + "' width='100%' height='550px' >").appendTo('#viewEvidencia');           
        }
    }

    $scope.cerrarEvidencia = function(){
        $scope.urlEvidencia = ''
        $('#viewEvidencia').find('object').remove();
    }
   
    $scope.viewComprobaciones = function (id) {

        $scope.tipoComprobacion = 0
        $scope.catalogoCompmrobaciones =[]
        $scope.idComprobanteSelected = id
        var tipoComprobanteseleccionado
        reportesContraloriaRepository.catalogoComprbanteVale().then(res => {
            $scope.catalogoCompmrobaciones = res.data
            tipoComprobanteseleccionado = $scope.catalogoCompmrobaciones.filter(x=> x.selected === '1');
            $scope.tipoComprobacion = tipoComprobanteseleccionado[0].id
            $scope.openViewComprobaciones($scope.idComprobanteSelected, $scope.tipoComprobacion)
        })

    }

    $scope.buscaTipoComprobacion = function(){
        $scope.openViewComprobaciones( $scope.idComprobanteSelected, $scope.tipoComprobacion)
    }

    $scope.openViewComprobaciones = function(id, tipo){
        reportesContraloriaRepository.ObtieneDatosComprobaciones(id, tipo).then(resp => {
            $scope.evidenciasComprobaciones = []
            $scope.evidenciasComprobaciones = resp.data
            $scope.modalTitle = 'Evidencia comprobaciones'
            $('#comprobacionEvidencia').DataTable().clear();
            $('#comprobacionEvidencia').DataTable().destroy();
            setTimeout(() => {
                $('#comprobacionEvidencia').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[1, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#comprobacionEvidencia_length').hide();
                $('#viewEvidenciaCompro').find('object').remove();
                $("#viewComprobaciones").modal("show");
            })

        })
    }

    $scope.verEvidenciaCompro = function (url) {
        if (url === undefined) {
            swal('Aviso', 'Por el momento no es posible abrir el archivo de vale solicitado, favor de intentra mas tarde', 'warning')
        } else {
            $scope.urlEvidencia = ''
            $('#viewEvidenciaCompro').find('object').remove();
            $scope.urlEvidencia = url;
            $("<object class='lineaCaptura' data='" + $scope.urlEvidencia + "' width='100%' height='550px' >").appendTo('#viewEvidenciaCompro');
        }
    }

    $scope.cerrarEvidenciaCompro = function(){
        $scope.urlEvidencia = ''
        $('#viewEvidenciaCompro').find('object').remove();
    }

    $scope.subirEvidencia = function (id, idFondoFijo, idEmpresa, idSucursal, idDepartamento, idUsuarioResponsable) {
        $scope.modalTitle = 'Evidencias reporte arqueo'
        $scope.documento = {url:'',archivo:'', ext_nombre:'PDF'};
        document.getElementById("wizard-picture").value = null;
        $scope.numeroFolio = id;
        $scope.idFondoFijo = idFondoFijo;
        $scope.selIdEmpresas = idEmpresa
        $scope.selIdSucursal = idSucursal
        $scope.selIdDepartamento = idDepartamento
        $scope.selidUsuarioResponsable = idUsuarioResponsable
        $("#viewCargaReporte").modal("show");
    }

    $scope.verPdf = function (documento) {

        if (validURL(documento.url) === false) {
            documento.url = null
        }
        
        if(documento.url === null && documento.archivo !== null && documento.archivo !== undefined && documento.archivo !== ''){
            documento.url = documento.archivo.archivo
        }
        
        if(documento.url === null && documento.archivo === undefined ){
            swal('Aviso', 'El documento no ha sido cargado', 'warning')
            return
        }
        
        if (documento.estatusDocumento == 3) {
            $scope.verComentarios = true;
            $scope.obervacionesDoc = documento.Observaciones;
        } else {
            $scope.verComentarios = false;
        }
       // $('#pdfReferenceContent object').remove();
       //$('#pdfReferenceContent object').remove();
       $('#pdfReferenceContent').find('object').remove();
        $scope.modalTitle = documento.doc_nomDocumento;
        $("#viewhistoricoCargado").modal({backdrop: 'static', keyboard: false})
        $("#mostrarPdf").modal("show");
      
        var pdf = documento.url;
        $('#pdfReferenceContent').find('object').remove();
        $("<object class='lineaCaptura' data='" + pdf + "' width='100%' height='650px' >").appendTo('#pdfReferenceContent');
        $('#mostrarPdf').insertAfter($('body'));
        
    }

    function validURL(myURL) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(myURL);
     }

     $scope.guardarEvidencia = function() {
         console.log('guarda reporte')
        //  $scope.numeroFolio = id;
        // $scope.idFondoFijo = idFondoFijo;
        // $scope.selIdEmpresas = idEmpresa
        // $scope.selIdSucursal = idSucursal
        // $scope.selIdDepartamento = idDepartamento
        // $scope.selidUsuarioResponsable = idUsuarioResponsable
        reportesContraloriaRepository.saveDocReporteContraloria($scope.numeroFolio, $scope.idFondoFijo, $scope.documento.archivo.archivo, $scope.dataUsuario.usu_idusuario, $scope.selIdEmpresas, $scope.selIdSucursal, $scope.selIdDepartamento, $scope.selidUsuarioResponsable).then(resp => {
            console.log(resp)
            swal('Información','El reporte se ha guadado correctameente', 'success')
            $("#viewCargaReporte").modal("hide");
        })
     }

     $scope.loadEvidenciaReporte = function(id, idFondoFijo, idEmpresa, idSucursal, idDepartamento, idUsuarioResponsable){
         var pdf = {url:''}
        reportesContraloriaRepository.loadEvidencia(id, idFondoFijo, idEmpresa, idSucursal, idDepartamento, idUsuarioResponsable).then(resp => {
            $scope.historico = resp.data;

            $('#historicoEvidencias').DataTable().clear();
            $('#historicoEvidencias').DataTable().destroy();
            setTimeout(() => {
                $('#historicoEvidencias').DataTable({
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
                $('##historicoEvidencias_length').hide();
                $('#historicoEvidencias').find('object').remove();
               // $("#historicoEvidencias").modal("show");
            })
            $("#viewhistoricoCargado").modal({backdrop: 'static', keyboard: false})
            $("#viewhistoricoCargado").modal("show");
            // pdf.url = resp.data[0].url
            // $scope.verPdf(pdf);
            // $("#viewCargaReporte").modal("hide");
        })
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

    $scope.verEvidenciaHistorico = function(url, nombre){
        if(url === undefined){
            swal('Aviso','Por el momento no es posible abrir el archivo de evidencia solicitado, favor de intentra mas tarde','warning')
        }else{
            $scope.urlEvidenciaHistorico = ''
          //  $('#viewEvidencia').find('object').remove();
            $scope.urlEvidenciaHistorico = url+nombre;
            $scope.verPdf({url: $scope.urlEvidenciaHistorico})
          //  $("<object class='lineaCaptura' data='" + $scope.urlEvidenciaHistorico + "' width='100%' height='550px' >").appendTo('#viewhistoricoCargado');           
        }
    }

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

    $scope.openModalReembolsos = function(){
        fondoFijoRepository.getverificaReembolsos().then(function successCallback(response) {
            $scope.reembolsosFinanzas = response.data[0];
            $scope.reembolsosTesoreria = response.data[1];
        }, function errorCallback(response) {
        });
        $("#modalReembolsos").modal('show');
    }

    $scope.openModalRechazos = function(){
        fondoFijoRepository.getverificaRechazoFinanzas().then(function successCallback(response) {
            $scope.RechazosFinanzas = response.data;
            $('#rechazosdeFinanzas').DataTable().clear();
            $('#rechazosdeFinanzas').DataTable().destroy();
            setTimeout(() => {
                $('#rechazosdeFinanzas').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 15,
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
                $('#rechazosdeFinanzas_length').hide();
            })

        }, function errorCallback(response) {
        });
        $("#modalRechazosFinanzas").modal('show');
    }

    $scope.openModalDescuentos = function(){
        fondoFijoRepository.getverificaValesDescuento().then(function successCallback(response) {
            $scope.descuentoNomina = response.data;
            $('#descuentoNominaVales').DataTable().clear();
            $('#descuentoNominaVales').DataTable().destroy();
            setTimeout(() => {
                $('#descuentoNominaVales').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 15, 
                    dom: 'Bfrtip',
                    buttons: [
                    'csv', 'excel',
                    ],
                    "order": [[0, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Search',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    },
                });
                $('#descuentoNominaVales_length').hide();
            })

        }, function errorCallback(response) {
        });
        $("#modalDescuentoNomina").modal('show');
    }

    $scope.openModalEstatusVales = function(){
        fondoFijoRepository.getverificaEstatusVales().then(function successCallback(response) {
            $scope.EstatusVales = response.data;
            $('#estatusVales').DataTable().clear();
            $('#estatusVales').DataTable().destroy();
            setTimeout(() => {
                $('#estatusVales').DataTable({
                    scrollY:        "260px",
                    scrollX:        true,
                    //scrollCollapse: false,
                    columnDefs: [
                        { width: 100, targets: 2}
                    ],
                    fixedColumns: true,
                    destroy: true,
                    "responsive": false,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15, 
                    "order": [[0, "desc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Search',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    },
                });
                $('#estatusVales_length').hide();
            })

        }, function errorCallback(response) {
        });
        $("#modalEstatusVales").modal('show');
    }

    $scope.openModalCajeroEspejo = function(){
        $scope.ConfiguracionCajeroEspejo();
        $("#modalCajeroEspejo").modal('show');
    };

    $scope.ConfiguracionCajeroEspejo = function() {
        fondoFijoRepository.getverificaCajeroEspejo().then(function successCallback(response) {
            $scope.cajeroEspejo = response.data;
            $('#cajeroEspejo').DataTable().clear();
            $('#cajeroEspejo').DataTable().destroy();
            setTimeout(() => {
                $('#cajeroEspejo').DataTable({
                    destroy: true,
                    "responsive": false,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15, 
                    "order": [[0, "desc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Search',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    },
                });
                $('#cajeroEspejo_length').hide();
            })

        }, function errorCallback(response) {
        });
    };

    $scope.actualizaUsuarioEspejo = function(dato) {

        var idEstatus = dato.idEstatus == 1 ? 0 : 1;

        swal({
            title: '¿Deseas ' + dato.boton +' el usuario Espejo?',
            text: 'La solicitud sera procesada.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function(isConfirm) {
            if (isConfirm) {   
                $("#modalCajeroEspejo").modal('hide');    
                $scope.cajeroEspejo = [];  
                fondoFijoRepository.actualizaUsuarioEspejo(dato.id, idEstatus, $scope.dataUsuario.usu_idusuario).then(function successCallback(response) {
                    $scope.ConfiguracionCajeroEspejo();
                    $("#modalCajeroEspejo").modal('show');
                }, function errorCallback(response) {
                });
            } else {
                swal('Cancelado', 'No se aplicaron los cambios', 'error');
               
            }
        });
    };

    $scope.autorizadoresCajeroEspejo = function() {
        fondoFijoRepository.autorizadoresUsuarioEspejo($scope.dataUsuario.usu_idusuario).then(function successCallback(response) {
        $scope.autoriza = response.data[0].autoriza;
        }, function errorCallback(response) {
        });
    };

    $scope.openModalEstatusFF = function(){
        fondoFijoRepository.getverificaReembolsos().then(function successCallback(response) {
            $scope.estatusFF = response.data[2];

            $('#estatusFF').DataTable().clear();
            $('#estatusFF').DataTable().destroy();
            setTimeout(() => {
                $('#estatusFF').DataTable({
                    destroy: true,
                    "responsive": false,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: false,
                    pageLength: 15, 
                    "order": [[0, "desc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Search',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    },
                });
                $('#estatusFF_length').hide();
            })

        }, function errorCallback(response) {
        });
        $("#modalEstatusFF").modal('show');
    };

    $scope.verEvidenciaOP = function(url){
        if(url === undefined){
            swal('Aviso','Por el momento no es posible abrir el archivo de evidencia solicitado, favor de intentra mas tarde','warning')
        }
        else if(url == null)
        { swal('Aviso','El comprobante no se a cargado por Tesoreria.','warning')}
        else{
            $scope.urlEvidenciaOP = ''
            $('#viewEvidenciaOP').find('object').remove();
            $scope.urlEvidenciaOP = url;
            $("<object class='lineaCaptura' data='" + $scope.urlEvidenciaOP + "' width='100%' height='550px' >").appendTo('#viewEvidenciaOP');           
        }
    }

    $scope.cerrarEvidenciaOP = function(){
        $scope.urlEvidenciaOP = '';
        $('#viewEvidenciaOP').find('object').remove();
    }

    /**
     * Region Administrador de Cumplimiento
     * Region Administrador de Cumplimiento
     * Region Administrador de Cumplimiento
     * Region Administrador de Cumplimiento
     * Region Administrador de Cumplimiento
     */

    $scope.enFirma          = false;
    $scope.timer            = '';
    $scope.intervalTimer    = null;
    $scope.tokenUsuario     = '';
    $scope.panelError       = { success: false, msg: '' }
    $scope.arqueoFirmado    = false;
    $scope.datosFirma       = { token: '', firmante: '', idUsuario: 0, fechaFirma: '' }
    $scope.idTipoPersona    = 0;
    $scope.loadPDF          = false;
    $scope.comentarios      = '';

    $scope.getToken = function( tipoPersona, arqueo ){
        var datos = {
            idUsuario: $scope.dataUsuario.usu_idusuario,
            idFondoFijo: $scope.ids,
            idTipoPersona: $scope.idTipoPersona,
            idArqueo: arqueo
        }

        console.log("datos", datos);

        reportesContraloriaRepository.solicitaToken( datos ).then(res => {
            $scope.tokenUsuario     = '';

            clearInterval( $scope.intervalTimer );
            $scope.enFirma          = true;
            $scope.arqueoFirmado    = false;
            $scope.token = res.data[0];
            $scope.initTimer();

            if(res.data[0].success == 2){
                $scope.arqueoFirmado    = true;
                $scope.datosFirma       = { 
                    token: $scope.token.token, 
                    firmante: $scope.token.firmante, 
                    idUsuario: $scope.token.idUsuario, 
                    fechaFirma: $scope.token.fechaFirma 
                }
            }
        })
    }

    $scope.editArqueo = function(){
        $scope.enFirma          = false;
        $scope.tokenUsuario     = '';
        $scope.panelError       = { success: false, msg: '' }
        $scope.arqueoFirmado    = false;
        $scope.datosFirma       = { token: '', firmante: '', idUsuario: 0, fechaFirma: '' }
    }

    $scope.initTimer = function(){
        try {
            var temporalizador = 4;
            var minuto = temporalizador;
            var seg = 59;

            $scope.tiempoRestante = '5:00';
            $scope.intervalTimer = setInterval( function(){
                seg = seg - 1;
                if( seg == -1 ){
                    seg = 59;
                    minuto = minuto - 1;
                }

                if( minuto == 0 && seg == 0 ){
                    clearInterval( $scope.intervalTimer );
                    $scope.panelError = { success: true, type:'info', msg: 'El token ha expirado, se ha generado un nuevo para tu firma.' };
                    setTimeout(function(){
                        $scope.panelError = { success: false, type:'', msg: '' };
                    }, 6000);
                    $scope.getToken( 1, 0 );
                }

                // $scope.tiempoRestante = minuto + ':' + seg;
                $scope.$apply(function () {
                    $scope.tiempoRestante = minuto + ':' + zfill(seg, 2);
            });
            },1000 );   
        } catch (error) {
            console.log('Ocurrio un error: ', error);
        }
    }

    $scope.validateToken = function(){
        swal({
            title: '¿Deseas guardar el arqueo?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                if( $scope.tokenUsuario == '' ){
                    $scope.panelError = { success: true, type:'warning', msg: 'Debes introducir tu token para poder continuar' };
                }
                else{
                    var datos = {
                        keyId: $scope.token.keyId,
                        tokenUsuario: $scope.tokenUsuario
                    }
            
                    reportesContraloriaRepository.validaToken( datos ).then(res => {
                        $scope.validacionToken = res.data[0];
        
                        if( $scope.validacionToken.success == 1 ){
                            $scope.panelError = { success: true, type:'success', msg: $scope.validacionToken.msg };
                            $scope.datosFirma       = { 
                                token: $scope.validacionToken.token, 
                                firmante: $scope.validacionToken.firmante, 
                                idUsuario: $scope.validacionToken.idUsuario, 
                                fechaFirma: $scope.validacionToken.fechaFirma 
                            }
                            $scope.arqueoFirmado    = true;
                            clearInterval( $scope.intervalTimer );
                            $scope.guardarArqueo();
                        }
                        else{
                            $scope.panelError = { success: true, type:'warning', msg: $scope.validacionToken.msg };
                            $scope.getToken( 1, 0 );
                        }
                    })
                }
            } else {
                swal(
                    'Cancelado',
                    'Puedes continuar capturando el arqueo',
                    'info'
                );
            }
        });
    }

    $scope.validateTokenResponsable = function(){
        swal({
            title: '¿Deseas firmar el arqueo?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                if( $scope.tokenUsuario == '' ){
                    $scope.panelError = { success: true, type:'warning', msg: 'Debes introducir tu token para poder continuar' };
                }
                else{
                    var datos = {
                        keyId: $scope.token.keyId,
                        tokenUsuario: $scope.tokenUsuario
                    }
            
                    reportesContraloriaRepository.validaToken( datos ).then(res => {
                        $scope.validacionToken = res.data[0];
        
                        if( $scope.validacionToken.success == 1 ){
                            $scope.panelError = { success: true, type:'success', msg: $scope.validacionToken.msg };
                            $scope.datosFirma       = { 
                                token: $scope.validacionToken.token, 
                                firmante: $scope.validacionToken.firmante, 
                                idUsuario: $scope.validacionToken.idUsuario, 
                                fechaFirma: $scope.validacionToken.fechaFirma 
                            }
                            $scope.arqueoFirmado    = true;
                            clearInterval( $scope.intervalTimer );

                            var datos2 = {
                                keyId: $scope.token.keyId,
                                idArqueo: $scope.idArqueo,
                                comentarios: $scope.comentarios
                            }
                            reportesContraloriaRepository.responsableArqueo( datos2 ).then(resResponsable => {
                                console.log( resResponsable );

                                $scope.obtieneArqueos();
                                $scope.goReporteArqueo($scope.idArqueo, $scope.idFondoFijo)

                                // setTimeout(function() {
                                //     $("#mostrarPdf").modal("hide");
                                // }, 5000);
                            })
                        }
                        else{
                            $scope.panelError = { success: true, type:'warning', msg: $scope.validacionToken.msg };
                            $scope.getToken( 1, 0 );
                        }
                    })
                }
            } else {
                swal(
                    'Cancelado',
                    'Es neceario la firma de este documento para continuar con el proceso de entrega del arqueo.',
                    'info'
                );
            }
        });
    }

    function zfill(number, width) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */ 
        var zero = "0"; /* String de cero */  
        
        if (width <= length) {
            if (number < 0) {
                 return ("-" + numberOutput.toString()); 
            } else {
                 return numberOutput.toString(); 
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString()); 
            }
        }
    }

    $scope.obtieneArqueos = function(){
        var datos = {
            idUsuario: $scope.dataUsuario.usu_idusuario
        }
        $scope.panelError = { success: false, type:'success', msg: '' };

        reportesContraloriaRepository.arqueosParaFirma( datos ).then(res => {
            $scope.listaArqueo = res.data;

            $('#tableMisTramite').DataTable().destroy();
            setTimeout(() => {
                $('#tableMisTramite').DataTable({
                    destroy: true,
                    "responsive": false,
                    "scrollX": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true,
                    pageLength: 5,
                    "order": [[1, "asc"]],
                    "language": {
                        search: '<i class="fa fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Buscar',
                        oPaginate: {
                            sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                            sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                        }
                    }
                });
                $('#tableMisTramite_length').hide();
                $('#loading').modal('hide');
            }, 1000);
        })
    }

    $scope.goReporteArqueo = function (id, idFF) {
        $scope.idArqueo = id;
        $scope.idFondoFijo = idFF;
        $scope.idTipoPersona    = 2;

        $scope.general = {
            'template': {},
            'options': {},
            'reports': {},
            'data': {}
        };

        $scope.sumValesAbierto = {
            'etiqueta': 'Totales',
            'cantidadOriginal': 0,
            'comprobada': 0,
            'porComprobar': 0
        }

        $scope.resuman = {
            'totalesValesProvAbiertos': 0,
            'totalesCompPendientes': 0,
            'totalesReembolso': 0,
            'totales': 0,
            'totalFondoFijo': 0,
            'saldoAVerificar': 0,
            'auxiliar': 0,
            'diferencia': 0,
        };

        var sumOriginal = 0;
        var sumComprobada = 0;
        var sumPendiente = 0;

        var sumCom = 0
        var sumReem = 0

        var datosCab = [];
        var valesAbiertos = [];
        var sumValesAbiertos = [];
        var CompPendientes = [];
        var sumCompPendientes = [];
        var reembolsos = [];
        var sumReembolsos = [];
        var cabeceroArqueo = {
            'realizo': '',
            'folioFF': '',
            'fecha': ''
        };

        var arqueo = [];
        var detalleArqueoBilletes = [];
        var detalleArqueo = []
        var auxiliarContable = []
        var indiceSumatorias = 0
        var sumaBilletes = 0
        var sumaMonedas = 0
        var totales = 0

        $scope.general.template = {shortid: "HktFjCPzt"};// $scope.template; //'HktFjCPzt';
        $scope.general.options = $scope.options;
        $scope.general.reports = $scope.reports;
        $scope.data.resumen = [];

        //console.log('RESUMEN  ',$scope.data.resumen)
        $("#loading").modal("show");
        reportesContraloriaRepository.getDataReporteArqueo(id).then(resp => {
            // console.log(resp.data)    
            // CABECERO
            $scope.dato.idFondoFijo = resp.data[0][0].idFondoFijo;
            $scope.dato.fecha = resp.data[0][0].fecha;
            $scope.dato.hora = resp.data[0][0].hora;
            $scope.dato.agencia = resp.data[0][0].agencia;
            $scope.dato.sucursal = resp.data[0][0].sucursal;
            $scope.dato.departamento = resp.data[0][0].departamento;
            $scope.dato.responsable = resp.data[0][0].responsable;
            $scope.dato.monto = resp.data[0][0].monto

            datosCab.push($scope.dato);

            // vales abiertos
            valesAbiertos = resp.data[1];
            indiceSumatorias = resp.data[1].findIndex(elem => elem.solicitante === 'TOTALES');
            
            // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
            for(let i = 0; i< resp.data[1].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[1][i].cantidad = '$' + formatMoney(resp.data[1][i].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].comprobada = '$' + formatMoney(resp.data[1][i].comprobada) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].porComprobar = '$' + formatMoney(resp.data[1][i].porComprobar) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].autorizadoDeMas =  '$' +formatMoney(resp.data[1][i].autorizadoDeMas)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                $scope.sumValesAbierto.cantidadOriginal = resp.data[1][indiceSumatorias].cantidad;
                $scope.sumValesAbierto.comprobada = resp.data[1][indiceSumatorias].comprobada;
                $scope.sumValesAbierto.porComprobar = resp.data[1][indiceSumatorias].porComprobar;

               resp.data[1][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[1][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].comprobada = '$' + formatMoney(resp.data[1][indiceSumatorias].comprobada) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].porComprobar = '$' + formatMoney(resp.data[1][indiceSumatorias].porComprobar)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].autorizadoDeMas = '$' + formatMoney(resp.data[1][indiceSumatorias].autorizadoDeMas)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

            } else {
                $scope.sumValesAbierto.cantidadOriginal = 0
                $scope.sumValesAbierto.comprobada = 0
                $scope.sumValesAbierto.porComprobar = 0
            }
            sumValesAbiertos.push($scope.sumValesAbierto);
            indiceSumatorias = 0;

            // Comprobantes pendientes
            CompPendientes = resp.data[2];
            indiceSumatorias = resp.data[2].findIndex(elem => elem.concepto === 'TOTAL');

            // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
            for(let i = 0; i< resp.data[2].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[2][i].cantidad = '$' + formatMoney(resp.data[2][i].cantidad) // .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumCom = resp.data[2][indiceSumatorias].cantidad
                resp.data[2][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[2][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumCom = 0
            }
            sumCompPendientes.push(sumCom);
            indiceSumatorias = 0;

            // REEMBOLSO
            reembolsos = resp.data[3];
            indiceSumatorias = resp.data[3].findIndex(elem => elem.solicitante === 'TOTAL');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[3].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[3][i].cantidad ='$' + formatMoney(resp.data[3][i].cantidad) // .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumReem = resp.data[3][indiceSumatorias].cantidad
                resp.data[3][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[3][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            }
            else {
                sumReem = 0
            }

            sumReembolsos.push(sumReem)

            // ARQUEO
            arqueo = resp.data[4]
            //DESGLOSE ARQUEO
            detalleArqueo = resp.data[5];
            indiceSumatorias = resp.data[5].findIndex(elem => elem.nombre === 'Suma Monedas');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[5].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[5][i].total = '$' + formatMoney(resp.data[5][i].total)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumaMonedas = resp.data[5][indiceSumatorias].total
                resp.data[5][indiceSumatorias].total = '$' + formatMoney(resp.data[5][indiceSumatorias].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumaMonedas = 0
            }

            indiceSumatorias = 0

            detalleArqueoBilletes = resp.data[6];
            indiceSumatorias = resp.data[6].findIndex(elem => elem.nombre === 'Suma Billetes');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[6].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[6][i].total = '$' + formatMoney(resp.data[6][i].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumaBilletes = resp.data[6][indiceSumatorias].total
                resp.data[6][indiceSumatorias].total= '$' + formatMoney(resp.data[6][indiceSumatorias].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumaBilletes = 0
            }

            indiceSumatorias = 0

            auxiliarContable = resp.data[7]

            firmantes = resp.data[8]

            totales = $scope.sumValesAbierto.porComprobar + sumCom + sumReem + sumaMonedas + sumaBilletes
            // RESUMEN
            $scope.resuman.totalesValesProvAbiertos = '$' + formatMoney($scope.sumValesAbierto.porComprobar)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totalesCompPendientes = '$' + formatMoney(sumCom)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totalesReembolso = '$' + formatMoney(sumReem)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totales = totales.toFixed(2);
            $scope.resuman.totalFondoFijo = '$' +formatMoney($scope.dato.monto) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.saldoAVerificar = '$' + formatMoney(($scope.dato.monto - $scope.resuman.totales)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });//resp.data[5][12].total
            $scope.resuman.efectivo = '$' +formatMoney((sumaMonedas + sumaBilletes)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            //$scope.resuman.saldoAuxiliar = sumReem > 0 ? (sumaMonedas + sumaBilletes).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : (0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.saldoAuxiliar = resp.data[7][0].SALDOFINAL
            
            $scope.resuman.difAuxiliarContable =  ($scope.resuman.saldoAuxiliar - (sumaMonedas + sumaBilletes)) 
            $scope.resuman.saldoAuxiliar = '$' + formatMoney(resp.data[7][0].SALDOFINAL) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
            // DAMOS EL FORMATO DE MONEDA A LOS TOTALES DE CADA TABLA
            $scope.dato.monto = '$' +formatMoney($scope.dato.monto)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totales = '$' + formatMoney(Number( $scope.resuman.totales)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.difAuxiliarContable  = '$' +formatMoney($scope.resuman.difAuxiliarContable) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

            // ESTRUCTURA DE DATOS
            $scope.data.dato = datosCab;
            $scope.data.valeAbierto = valesAbiertos;
            $scope.data.sumValesAbiertos = sumValesAbiertos;
            $scope.data.comPendientes = CompPendientes;
            $scope.data.reembolso = reembolsos;
            $scope.data.sumPendientes = sumReembolsos
            $scope.data.resumen.push($scope.resuman);
            $scope.data.arqueo = arqueo;
            $scope.data.detalleArqueo = detalleArqueo;
            $scope.data.detalleArqueoBilletes = detalleArqueoBilletes;
            $scope.data.firmaElaboro = [firmantes[0]];
            $scope.data.firmaResponsable = [firmantes[1]];
            $scope.data.firmaAuditor = [firmantes[2]];

           

            $scope.general.data = $scope.data;

            console.log($scope.general)

            reportesContraloriaRepository.reporte($scope.general).then((resp) => {

                var file = new Blob([resp.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                $scope.content = $sce.trustAsResourceUrl(fileURL);

                $("#loading").modal("hide");
                $scope.reporteHtml = '';
                $('#pdfReferenceContent object').remove();
                $('#pdfReferenceContent').find('iframe').remove();
                $scope.modalTitle = 'reporte';
                //$scope.reporteHtml = resp.data;
                var pdf = $scope.content;
                $("").appendTo('#pdfReferenceContent');
                $(`<object data="${$scope.content}" type="application/pdf" style="width:100%;height:90%"></object>`).appendTo('#pdfReferenceContent');
                // $("" + pdf + "").appendTo('#pdfReferenceContent');

                $scope.ids = idFF;
                $scope.getToken( 2, $scope.idArqueo )
                $("#mostrarPdf").modal("show");

            });
        });

    }

    $scope.viewArqueo = function (id) {
        $scope.loadPDF = true;
        $scope.general = {
            'template': {},
            'options': {},
            'reports': {},
            'data': {}
        };

        $scope.sumValesAbierto = {
            'etiqueta': 'Totales',
            'cantidadOriginal': 0,
            'comprobada': 0,
            'porComprobar': 0
        }

        $scope.resuman = {
            'totalesValesProvAbiertos': 0,
            'totalesCompPendientes': 0,
            'totalesReembolso': 0,
            'totales': 0,
            'totalFondoFijo': 0,
            'saldoAVerificar': 0,
            'auxiliar': 0,
            'diferencia': 0,
        };

        var sumOriginal = 0;
        var sumComprobada = 0;
        var sumPendiente = 0;

        var sumCom = 0
        var sumReem = 0

        var datosCab = [];
        var valesAbiertos = [];
        var sumValesAbiertos = [];
        var CompPendientes = [];
        var sumCompPendientes = [];
        var reembolsos = [];
        var sumReembolsos = [];
        var cabeceroArqueo = {
            'realizo': '',
            'folioFF': '',
            'fecha': ''
        };

        var arqueo = [];
        var detalleArqueoBilletes = [];
        var detalleArqueo = []
        var auxiliarContable = []
        var indiceSumatorias = 0
        var sumaBilletes = 0
        var sumaMonedas = 0
        var totales = 0

        $scope.general.template = {shortid: "HktFjCPzt"};// $scope.template; //'HktFjCPzt';
        $scope.general.options = $scope.options;
        $scope.general.reports = $scope.reports;
        $scope.data.resumen = [];

        //console.log('RESUMEN  ',$scope.data.resumen)
        $("#loading").modal("show");
        reportesContraloriaRepository.getDataReporteArqueo(id).then(resp => {
            // console.log(resp.data)    
            // CABECERO
            $scope.dato.idFondoFijo = resp.data[0][0].idFondoFijo;
            $scope.dato.fecha = resp.data[0][0].fecha;
            $scope.dato.hora = resp.data[0][0].hora;
            $scope.dato.agencia = resp.data[0][0].agencia;
            $scope.dato.sucursal = resp.data[0][0].sucursal;
            $scope.dato.departamento = resp.data[0][0].departamento;
            $scope.dato.responsable = resp.data[0][0].responsable;
            $scope.dato.monto = resp.data[0][0].monto

            datosCab.push($scope.dato);

            // vales abiertos
            valesAbiertos = resp.data[1];
            indiceSumatorias = resp.data[1].findIndex(elem => elem.solicitante === 'TOTALES');
            
            // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
            for(let i = 0; i< resp.data[1].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[1][i].cantidad = '$' + formatMoney(resp.data[1][i].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].comprobada = '$' + formatMoney(resp.data[1][i].comprobada) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].porComprobar = '$' + formatMoney(resp.data[1][i].porComprobar) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    resp.data[1][i].autorizadoDeMas =  '$' +formatMoney(resp.data[1][i].autorizadoDeMas)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                $scope.sumValesAbierto.cantidadOriginal = resp.data[1][indiceSumatorias].cantidad;
                $scope.sumValesAbierto.comprobada = resp.data[1][indiceSumatorias].comprobada;
                $scope.sumValesAbierto.porComprobar = resp.data[1][indiceSumatorias].porComprobar;

               resp.data[1][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[1][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].comprobada = '$' + formatMoney(resp.data[1][indiceSumatorias].comprobada) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].porComprobar = '$' + formatMoney(resp.data[1][indiceSumatorias].porComprobar)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
               resp.data[1][indiceSumatorias].autorizadoDeMas = '$' + formatMoney(resp.data[1][indiceSumatorias].autorizadoDeMas)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

            } else {
                $scope.sumValesAbierto.cantidadOriginal = 0
                $scope.sumValesAbierto.comprobada = 0
                $scope.sumValesAbierto.porComprobar = 0
            }
            sumValesAbiertos.push($scope.sumValesAbierto);
            indiceSumatorias = 0;

            // Comprobantes pendientes
            CompPendientes = resp.data[2];
            indiceSumatorias = resp.data[2].findIndex(elem => elem.concepto === 'TOTAL');

            // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
            for(let i = 0; i< resp.data[2].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[2][i].cantidad = '$' + formatMoney(resp.data[2][i].cantidad) // .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumCom = resp.data[2][indiceSumatorias].cantidad
                resp.data[2][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[2][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumCom = 0
            }
            sumCompPendientes.push(sumCom);
            indiceSumatorias = 0;

            // REEMBOLSO
            reembolsos = resp.data[3];
            indiceSumatorias = resp.data[3].findIndex(elem => elem.solicitante === 'TOTAL');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[3].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[3][i].cantidad ='$' + formatMoney(resp.data[3][i].cantidad) // .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumReem = resp.data[3][indiceSumatorias].cantidad
                resp.data[3][indiceSumatorias].cantidad = '$' + formatMoney(resp.data[3][indiceSumatorias].cantidad) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            }
            else {
                sumReem = 0
            }

            sumReembolsos.push(sumReem)

            // ARQUEO
            arqueo = resp.data[4]
            //DESGLOSE ARQUEO
            detalleArqueo = resp.data[5];
            indiceSumatorias = resp.data[5].findIndex(elem => elem.nombre === 'Suma Monedas');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[5].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[5][i].total = '$' + formatMoney(resp.data[5][i].total)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumaMonedas = resp.data[5][indiceSumatorias].total
                resp.data[5][indiceSumatorias].total = '$' + formatMoney(resp.data[5][indiceSumatorias].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumaMonedas = 0
            }

            indiceSumatorias = 0

            detalleArqueoBilletes = resp.data[6];
            indiceSumatorias = resp.data[6].findIndex(elem => elem.nombre === 'Suma Billetes');

             // DAMOS EL FORMATO DE MONEDA POR EJEMPLO $123.236
             for(let i = 0; i< resp.data[6].length;i++){
                if(i !== indiceSumatorias){
                    resp.data[6][i].total = '$' + formatMoney(resp.data[6][i].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }

            if (indiceSumatorias > 0) {
                sumaBilletes = resp.data[6][indiceSumatorias].total
                resp.data[6][indiceSumatorias].total= '$' + formatMoney(resp.data[6][indiceSumatorias].total) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            } else {
                sumaBilletes = 0
            }

            indiceSumatorias = 0

            auxiliarContable = resp.data[7]

            firmantes = resp.data[8]

            totales = $scope.sumValesAbierto.porComprobar + sumCom + sumReem + sumaMonedas + sumaBilletes
            // RESUMEN
            $scope.resuman.totalesValesProvAbiertos = '$' + formatMoney($scope.sumValesAbierto.porComprobar)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totalesCompPendientes = '$' + formatMoney(sumCom)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totalesReembolso = '$' + formatMoney(sumReem)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totales = totales.toFixed(2);
            $scope.resuman.totalFondoFijo = '$' +formatMoney($scope.dato.monto) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.saldoAVerificar = '$' + formatMoney(($scope.dato.monto - $scope.resuman.totales)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });//resp.data[5][12].total
            $scope.resuman.efectivo = '$' +formatMoney((sumaMonedas + sumaBilletes)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            //$scope.resuman.saldoAuxiliar = sumReem > 0 ? (sumaMonedas + sumaBilletes).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : (0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.saldoAuxiliar = resp.data[7][0].SALDOFINAL
            
            $scope.resuman.difAuxiliarContable =  ($scope.resuman.saldoAuxiliar - (sumaMonedas + sumaBilletes)) 
            $scope.resuman.saldoAuxiliar = '$' + formatMoney(resp.data[7][0].SALDOFINAL) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
            // DAMOS EL FORMATO DE MONEDA A LOS TOTALES DE CADA TABLA
            $scope.dato.monto = '$' +formatMoney($scope.dato.monto)  //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.totales = '$' + formatMoney(Number( $scope.resuman.totales)) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            $scope.resuman.difAuxiliarContable  = '$' +formatMoney($scope.resuman.difAuxiliarContable) //.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

            // ESTRUCTURA DE DATOS
            $scope.data.dato = datosCab;
            $scope.data.valeAbierto = valesAbiertos;
            $scope.data.sumValesAbiertos = sumValesAbiertos;
            $scope.data.comPendientes = CompPendientes;
            $scope.data.reembolso = reembolsos;
            $scope.data.sumPendientes = sumReembolsos
            $scope.data.resumen.push($scope.resuman);
            $scope.data.arqueo = arqueo;
            $scope.data.detalleArqueo = detalleArqueo;
            $scope.data.detalleArqueoBilletes = detalleArqueoBilletes;
            $scope.data.firmaElaboro = [firmantes[0]];
            $scope.data.firmaResponsable = [firmantes[1]];
            $scope.data.firmaAuditor = [firmantes[2]];

           

            $scope.general.data = $scope.data;

            console.log($scope.general)

            reportesContraloriaRepository.reporte($scope.general).then((resp) => {

                var file = new Blob([resp.data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                $scope.content = $sce.trustAsResourceUrl(fileURL);

                $("#loading").modal("hide");
                $scope.reporteHtml = '';
                $('#pdfReferenceContent object').remove();
                $('#pdfReferenceContent').find('iframe').remove();
                $scope.modalTitle = 'ARQUEO';
                //$scope.reporteHtml = resp.data;
                var pdf = $scope.content;
                $("").appendTo('#pdfReferenceContent');
                $(`<object data="${$scope.content}" type="application/pdf" style="width:100%;height:90%"></object>`).appendTo('#pdfReferenceContent');
                // $("" + pdf + "").appendTo('#pdfReferenceContent');
                $("#mostrarPdf").modal("show");
                $scope.loadPDF = false;
            });
        });

    }

    /**
     * End / Region Administrador de Cumplimiento
     */
})



