registrationModule.controller('reportesComprobacionGVController', function ($sce, $scope, reportesComprobacionGVRepository) {
   

    $scope.datos = {
        
        "empresa":"",
        "sucursal":"",
        "departamento":"",
        "solicitante": "",
        "viajaA":"",
        "motivo":"",
        "cliente":"",
        "fechaInicial":"",
        "fechaFinal":"",
        "autorizador":"",
        "comprobaciones":[]
    }

    $scope.init = () => {

        console.log('inicio')
        $scope.dataUsuario = JSON.parse(localStorage.getItem('usuario'));
        $scope.getListaComprobacionesGV();
    }

    $scope.getListaComprobacionesGV = function() {

       
        reportesComprobacionGVRepository.listaTablero().then(resp => {

            $scope.listaGV = resp.data;
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
                    "order": [[0, "desc"]],
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

    $scope.goReporte = function (id, idEmpresa, empresa, idSucursal, sucursal, idDepartamento, departamento, solicitante, viajeA, motivo, cliente, FechaIni, fechaFin, idSolicitante, autorizador, idAutorizador, fechaRegistroDevolucion, idDevolucion, idPersona) {

        $scope.general = {
            'template': {'shortid': 'H1ju7d9kD'},
            'data': {}
        };

        $scope.datos = {
          'data':{
            "empresa": empresa,
            "sucursal": sucursal,
            "departamento": departamento,
            "solicitante": `IDBPRO: ${idPersona} ${solicitante}`,
            "viajaA": viajeA,
            "motivo": motivo,
            "cliente": cliente,
            "fechaInicial": FechaIni,
            "fechaFinal":fechaFin,
            "autorizador":`Usuario: ${idAutorizador} ${autorizador}`,
            "fechaRegistroDevolucion":fechaRegistroDevolucion,
            "idDevolucion":idDevolucion
          },
            "comprobaciones":[]
            ,"solicitudes":[]
        }

        //console.log('RESUMEN  ',$scope.data.resumen)
        $("#loading").modal("show");
        reportesComprobacionGVRepository.getDataReporte(idEmpresa,idSucursal,idDepartamento,id).then(resp => {
         
           
            $scope.datos.comprobaciones = resp.data[0];
            //$scope.general.data = $scope.datos;
            console.log(JSON.stringify($scope.general))

            reportesComprobacionGVRepository.importeSolicitud(id).then(resp => {
                $scope.datos.solicitudes = resp.data[0]
                $scope.general.data = $scope.datos;

                reportesComprobacionGVRepository.reporte($scope.general).then((resp) => {

                    var file = new Blob([resp.data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    $scope.content = $sce.trustAsResourceUrl(fileURL);
    
                    $("#loading").modal("hide");
                    $scope.reporteHtml = '';
                    $('#pdfReferenceContent object').remove();
                    $('#pdfReferenceContent').find('iframe').remove();
                    $scope.modalTitle = 'reporte';
                    $("#mostrarPdf").modal("show");
                    //$scope.reporteHtml = resp.data;
                    var pdf = $scope.content;
                    $("").appendTo('#pdfReferenceContent');
                    $(`<object data="${$scope.content}" type="application/pdf" style="width:100%;height:90%"></object>`).appendTo('#pdfReferenceContent');
                    // $("" + pdf + "").appendTo('#pdfReferenceContent');
                    
    
                });

            })

         
        });

    }

    $scope.subirEvidencia = function (id, idEmpresa, idSucursal, idDepartamento) {
        $scope.modalTitle = 'Evidencias reporte de comprobación de gastos de viaje'
        $scope.documento = {url:'',archivo:'', ext_nombre:'PDF'};
        document.getElementById("wizard-picture").value = null;
        $scope.selIdPerTra = id
        $scope.selIdEmpresa = idEmpresa;
        $scope.selIdSucursal = idSucursal;
        $scope.selIdDepartamento = idDepartamento
        //$('#pdfReferenceContent').find('input').remove();
        //$('#pdfReferenceContent').find('iframe').remove();
        $("#viewCargaReporte").modal({backdrop: 'static', keyboard: false}) // evitamos que se cierre el modal dando clic fuera de el
        $("#viewCargaReporte").modal("show");
    }

    $scope.loadEvidenciaReporte = function(id, idEmpresa, idSucursal, idDepartamento){
        var pdf = {url:''}
        $scope.selIdPerTra = id
        $scope.selIdEmpresa = idEmpresa;
        $scope.selIdSucursal = idSucursal;
        $scope.selIdDepartamento = idDepartamento
        reportesComprobacionGVRepository.loadEvidencia($scope.selIdPerTra, $scope.selIdEmpresa, $scope.selIdSucursal, $scope.selIdDepartamento, '').then(resp => {
           
           pdf.url = resp.data[0].url
           $scope.verPdf(pdf);
           $("#viewCargaReporte").modal("hide");
       })
    }

    $scope.guardarEvidencia = function() {
        console.log('guarda reporte')
        reportesComprobacionGVRepository.saveDocReporteComprobacionGV($scope.selIdPerTra, $scope.selIdEmpresa, $scope.selIdSucursal, $scope.selIdDepartamento, $scope.documento.archivo.archivo).then(resp => {
           console.log(resp)
           swal('Información','El reporte se ha guardado correctamente', 'success')
           $("#viewCargaReporte").modal("hide");
       })
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
        $('#pdfReferenceContent object').remove();
        $scope.modalTitle = documento.doc_nomDocumento;
        $("#mostrarPdf").modal({backdrop: 'static', keyboard: false})
        $("#mostrarPdf").modal("show");
        var pdf = documento.url;
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

     $scope.loadEvidenciaPresupuestos = function(id){
        var pdf = {url:''}
       reportesComprobacionGVRepository.loadEvidenciaPresupuestos(id).then(resp => {
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
                   "order": [[0, "desc"]],
                   "language": {
                       search: '<i class="fa fa-search" aria-hidden="true"></i>',
                       searchPlaceholder: 'Buscar',
                       oPaginate: {
                           sNext: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                           sPrevious: '<i class="fa fa-caret-left" aria-hidden="true"></i>'
                       }
                   }
               });
               $('#historicoEvidencias_length').hide();
               $('#historicoEvidencias').find('object').remove();
           })
           $("#viewhistoricoCargado").modal({backdrop: 'static', keyboard: false})
           $("#viewhistoricoCargado").modal("show");
        
       })
    }

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
    
})