registrationModule.controller('ValidacionCuentaController', function ($scope, $rootScope, $location, localStorageService, ValidacionCuentaRepository, devolucionesRepository) {
    console.log("Este es un ejemplo");
    $rootScope.user = JSON.parse(localStorage.getItem('usuario'));
    $scope.vc_cuenta = localStorage.getItem('vc_cuenta');
    $scope.vc_cuenta = JSON.parse( $scope.vc_cuenta );

    console.log( "$scope.vc_cuenta", $scope.vc_cuenta );

    $scope.init = function(){
        ValidacionCuentaRepository.detallecuenta( $scope.vc_cuenta.id_perTra ).then( res =>{
            $scope.cuenta = res.data[0];
            console.log( "detallecuenta", res );

            $('#estadoCuenta').find('iframe').remove();
            $("").appendTo('#estadoCuenta');
            $(`<object data="${$scope.cuenta.EstadoCuenta}" type="application/pdf" style="width:100%;height:500px"></object>`).appendTo('#estadoCuenta');

            $('#INE').find('iframe').remove();
            $("").appendTo('#INE');
            $(`<object data="${$scope.cuenta.INE}" type="application/pdf" style="width:100%;height:500px"></object>`).appendTo('#INE');
        });
    }

    $scope.regresar = function(){
        $location.path('tesoreriaHome');
    }

    $scope.aprobar = function(){
        swal({
            title: "Validación de la cuenta",
            text: "¿Esta seguro en la confirmación de la cuenta?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Confirmar",
            closeOnConfirm: false
        },
        function() {
            $scope.cambioestatus( 3 );
        });
    }

    $scope.rechazar = function(){
        if( $scope.comentariorechazo == '' ){
            swal('Rechazo de Cuenta', 'Debes proporcionar el motivo del rechazo', 'warning');
        }
        else{
            swal({
                title: "Validación de la cuenta",
                text: "¿Esta seguro de rechazar la cuenta?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Rechazar",
                closeOnConfirm: false
            },
            function() {
                $scope.cambioestatus( 4 );
            });
        }
    }

    $scope.comentariorechazo = '';
    $scope.cambioestatus = function( estatus ){
        console.log( "estatus", estatus );
        $(".modal-backdrop").hide();
        ValidacionCuentaRepository.estatuscuenta( $scope.vc_cuenta.id_perTra, estatus, $scope.comentariorechazo ).then( res =>{

            if( estatus == 3 ){
                html = $scope.bodyTramitesCuenta( $scope.cuenta, $scope.vc_cuenta.nombre, 'APROBADA', '' );
                $scope.sendMail($scope.cuenta.sorreoSilicitante, "PRUEBAS - Solicitud de validación de cuenta APROBADA para Gastos de Viaje", html);
                
            }
            else if( estatus == 4 ){
                html = $scope.bodyTramitesCuenta( $scope.cuenta, $scope.vc_cuenta.nombre, 'RECHAZADA', "<small>Motivo del rechazo:</small> <b>" + $scope.comentariorechazo + "</b>" );
                $scope.sendMail($scope.cuenta.sorreoSilicitante, "PRUEBAS - Solicitud de validación de cuenta RECHAZADA para Gastos de Viaje", html);
            }
            

            $scope.regresar()
            swal('Estatus de Cuenta', 'La cuenta ha cambiado de estatus satisfactoriamente', 'success');
        });
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

    $scope.bodyTramitesCuenta = function( cuenta, solicitante, estatus, motivo ){
        var html = `<div style="width: 310px; height: 140px;"><center><img style="width: 80%;" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>
                    <div>
                        <p>Solicitud validación de cuenta bancaria</p><br>
                        <small>Estatus:</small> ` + estatus + `<br>
                        ` + motivo + `
                        <br><br>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="text-align: center;" colspan="2"><strong>Detalle de la solicitud</strong></td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Tr&aacute;mite:</span></td>
                                    <td>` + cuenta.id_perTra + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Solicitante:</span></td>
                                    <td>` + solicitante + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">CLABE:</span></td>
                                    <td>` + cuenta.ca_clabe + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">No. Cuenta:</span></td>
                                    <td>` + cuenta.ca_cuenta + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Banco:</span></td>
                                    <td>` + cuenta.ca_banconombre + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Plaza:</span></td>
                                    <td>` + cuenta.ca_plaza + `</td>
                                </tr>
                                <tr>
                                    <td style="text-align: right;"><span style="color: #ff0000;">Sucursal:</span></td>
                                    <td>` + cuenta.ca_sucursal + `</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`;

        return html;
    } 
});