require('dotenv').config()

function validationEmail(link){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div class="container">
            <div><img src="http://${process.env.DOMAIN_URL}:3000/img/holly_bkg.png" width="70px" alt=""></div>
            <div><h1 style="font-family:sans-serif">Benvindo ao HollyDB</h1></div>
            <div><h4 style="font-family:sans-serif;">Para poder entrar na sua conta e utilizar a totalidade das suas funcionalidades pressione o botao abaixo para validar a sua conta.</h4></div>
            <div>
            <a style="font-family:sans-serif;font-weight:bold;font-size: 24px;" href="${link}">Validar Conta</a>
            </div>
        </div>  
    </body>
    </html>
`
}

module.exports={validationEmail}