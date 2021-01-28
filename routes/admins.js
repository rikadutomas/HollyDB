require('dotenv').config()
const express=require('express')
const UserModel = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoURI = process.env.MDB_ACCESS;
const randomstr = require('randomstring');
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../config/smtp');
const SMTP_HTML = require('../views/validationEmail')
const store = new MongoDBSession({
    uri: mongoURI,
    collection:'tblSessions',
});
const transporter = nodemailer.createTransport({
    host:SMTP_CONFIG.host,
    port:SMTP_CONFIG.port,
    secure:false,
    auth:{
        user:SMTP_CONFIG.user,
        pass:SMTP_CONFIG.pass,
    },
    tls:{
        rejectUnauthorized:false,
    }
});


router.use(
    session({
        secret:process.env.RT_HASH,
        resave:false,
        saveUninitialized:false,
        name:'session.hollydb.sid',
        sameSite:true,
        store:store,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    })
);

const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.json({result:'error'});
    }
}

router.post('/register', async (req,res)=>{
    const {nome, email, password} = req.body;
    let user = await UserModel.findOne({email});
    if(nome==''||email==''||password==''){
        return res.json({result:'Todos os campos sao obrigatorios'});
    }
    if(user){
        return res.json({result:'Email Ja Existe'});
    }
    if(!validateEmail(email)){
        return res.json({result:'Email Invalido'});
    }
    console.log(validatePassword(password));
    if(!validatePassword(password)){
        return res.json({result:'Password Invalida: Tem de ser entre 6 a 20 caracteres,conter pelo menos um numero, uma maiúscula e uma minúscula'});
    }
    const hashPsw = await bcrypt.hash(password,10);
    const secretToken = await randomstr.generate();

    user = new UserModel({
        nome,
        email,
        password:hashPsw,
        secretToken:secretToken
    });
    await user.save();

    const hashLink = `http://192.168.0.10:3000/users/validarConta/${secretToken}`;
    sendValidationMail(email,hashLink);

    res.json({result:'ok'});
});

router.get('/validarConta/:id',async (req,res)=>{
    const secretToken = req.params.id.trim();
    console.log(secretToken)
    const user = await UserModel.findOneAndUpdate({secretToken},{validation:true,secretToken:''}).catch((err)=>{
        return res.json({result:'Server Error'});
    });
    console.log(user);
    if(user==null){
        return res.json({result:'Invalid ID'});
    }
    const hashEmail = strEncode(user.email);
    req.session.isAuth = true;
    req.session.email = hashEmail;
    return res.redirect('/');
});

router.post('/login', async (req,res)=>{
    const {email, password} = req.body; 
    let user = await UserModel.findOne({email});
    if(!user){
        return res.json({result:'Email/Password Invalido'});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.json({result:'Email/Password Invalido'});
    }
    if(!user.validation){
        return res.json({result:'Aguarda Validacao'});
    }
    else{
        const hashEmail = await strEncode(user.email);
        req.session.isAuth = true;
        req.session.email = hashEmail;
        return res.json({
            result:'ok', 
            nome:user.nome,
            favoritos:user.favoritos,
        });    
    }
});

router.get('/favoritos',isAuth, (req,res)=>{
    res.send('Favoritos Page');
})

router.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.json({result:'ok'});
    })
})

router.post('/session',isAuth, async (req,res)=>{
    email = strDecode(req.session.email);
    let user = await UserModel.findOne({email});
    return res.json({
        result:'ok', 
        nome:user.nome,
        favoritos:user.favoritos,
    })
});

router.post('/updateFavoritos',isAuth, async (req,res)=>{
    const email = strDecode(req.session.email);
    const favoritos = req.body.favoritos; 
    await UserModel.findOneAndUpdate({email},{favoritos:favoritos})
    return res.json({result:'ok'})
});

router.post('/terminarUser',isAuth,async(req,res)=>{
    const password  = req.body.password;
    console.log(password);
    const email = strDecode(req.session.email);
    console.log('email :' + email);
    user = await UserModel.findOne({email});
    console.log(user);
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch){
        return res.json({result:'Password Invalida'});
    }
    await UserModel.findOneAndDelete({email}).catch((err)=>{
        console.log(err);
        return res.json({result:'Erro ao apagar o utilizador. Pff tente de novo'});
    });
    req.session.destroy();
    return res.json({result:'ok'});
});

router.post('/renewPassword',isAuth,async(req,res)=>{
    const email = strDecode(req.session.email);
    const {pswantiga,pswnova,pswconf} = req.body;
    let user = await UserModel.findOne({email});
    console.log(user);
    console.log('Psw Antiga ' + pswantiga)
    console.log('Psw DB' + user.password)
    const isMatch = await bcrypt.compare(pswantiga,user.password);
    console.log('isMatch? ' + isMatch);
    if (!isMatch){
        return res.json({result:'Password Actual Invalida'});
    }
    if(pswnova!=pswconf){
        return res.json({result:'Password Nova e de confirmacao nao coincidem'});
    }
    console.log(validatePassword(pswnova));
    if(!validatePassword(pswnova)){
        return res.json({result:'Password Invalida: Tem de ser entre 6 a 20 caracteres,conter pelo menos um numero, uma maiúscula e uma minúscula'});
    }
    const hashPsw = await bcrypt.hash(pswnova,10);
    await UserModel.findOneAndUpdate({email},{password:hashPsw})
    res.json({result:'ok'});
})


router.post('/sendEmail',(req,res)=>{
    sendValidationMail();
    res.json({result:'Email Sent'});
})


function validateEmail(mail){
    var mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(mail.match(mailformat)){
        return true;
    }else{
        return false;
    }
}
//entre 6 a 20 caracteres que contêm pelo menos um dígito numérico, uma maiúscula e uma letra minúscula

function validatePassword(psw){
    const passformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(psw.match(passformat)) return true;
    else return false;
}

function strEncode(str){
    const buff = Buffer.from(str, 'utf-8');
    return buff.toString('base64');
}

function strDecode(str){
    const buff = Buffer.from(str, 'base64');
    return buff.toString('utf-8');
}

async function sendValidationMail(email,link){
    let out = SMTP_HTML.validationEmail(link);
    const mailSent = await transporter.sendMail({
        subject: "HOLLYDB - Valide a sua conta",
        from: "HOLLY DB <hollydbfilmes@gmail.com>",
        to: email,
        html:out,
    }).catch((err)=>{
        console.log(err);
    });
    console.log(mailSent);
}

module.exports = router;