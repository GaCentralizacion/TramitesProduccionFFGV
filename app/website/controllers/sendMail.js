const nodemailer = require('nodemailer');
const Promise = require('bluebird');

function envia (to, subject, html){
    return new Promise(function(resolve, reject){
        // var transporter = nodemailer.createTransport({
        //     host: '192.168.20.17',
        //     port: 25,
        //     secure: false,
        //     ignoreTLS: true,
        //     auth: { user: 'noreply', pass: 'P4n4m4!' }
        // });
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',            
            secure: false,           
            auth: {
                user: 'reportes.bpro1@grupoandrade.com',
                pass: '#h&EdV4R'
            },
            tls: { rejectUnauthorized: false }
       });

         var message = {
            from: '"Grupo Andrade"<reportes.bpro1@grupoandrade.com>',
            to: to,
            subject: subject + '== PRUEBAS ==' ,
            html: html,
        };
        transporter.sendMail(message, function(err) {
            if (!err) {
                resolve({response: {success: 1, msg: 'Se envió el correo con éxito.'}});
            } else {
                resolve({response: {success: 0, msg: 'No se envió el correo con éxito, intentelo mas tarde.', error: err}});
            }
        });
        transporter.close;
     });
    
};

function enviaComite(url,idAprobacion, identificador, correo, emp_id, not_descripcion, token, subject, linkUrl, not_identificador) {
    return new Promise(function(resolve, reject){


    var link = url + 'api/notification/approveNotification/?idAprobacion=' + idAprobacion + '&identificador=' + identificador + '&token=' + token + '&respuesta='

     subject = 'Revisión de trámite';
    // var transporter = nodemailer.createTransport({
    //     host: '192.168.20.17',
    //     port: 25,
    //     secure: false,
    //     ignoreTLS: true,
    //     auth: { user: 'noreply', pass: 'P4n4m4!' }
    // });
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',            
        secure: false,           
        auth: {
            user: 'reportesauxiliar@grupoandrade.com',
            pass: 'SuuDU3%56pl#'
        },
        tls: { rejectUnauthorized: false }
   });

    var urlTramite = '';
    if (linkUrl != '1')
        urlTramite = '<p><a href="' + linkUrl + '" target="_blank">Revisar Tramite</a></p>';
  
    var message = {
        from: '"Grupo Andrade"<grupoandrade.reportes@grupoandrade.com.mx>',
        to: correo,
        subject: subject + '== PRUEBAS ==',
        html: '<div style="width:310px;height:140px"><center><img style="width: 100%" src="https://cdn.discordapp.com/attachments/588785789438001183/613027505137516599/logoA.png" alt="GrupoAndrade" /></center></div>' +
            '</div> <p> ' + not_descripcion + ' </p><br>' +
            '<p>No. Trámite: ' + not_identificador + ' </p><br>' +
            '<p><a href="' + link + '1" target="_blank">Aprobar</a></p><br>' +
            '<p><a href="' + link + '0" target="_blank">Rechazar</a></p><br>' + urlTramite,
    }
  
    transporter.sendMail(message, function(err) {
        if (!err) {
            resolve({response: {success: 1, msg: 'Se envió el correo con éxito.'}});
        } else {
            resolve({response: {success: 0, msg: 'No se envió el correo con éxito, intentelo mas tarde.', error: err}});
        }
      
    });

    transporter.close;
});

};


module.exports = { envia, enviaComite };
