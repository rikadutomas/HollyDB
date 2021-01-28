const express=require('express')
const path = require('path');
const ProfModel = require('../models/prof');
const router = express.Router();

const mongoURI = process.env.MDB_ACCESS;
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const store = new MongoDBSession({
    uri: mongoURI,
    collection:'tblSessions',
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


router.get('/getProf',isAuth, async (req,res)=>{
    await ProfModel.find().sort({id:-1})
    .then(prof=>{
        res.json(prof)
    })
    .catch(err=>{
        console.log('Erro em GetProf: ' + err);
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde'});
    })
})

router.get('/getProf/name',isAuth,async (req,res)=>{
    await ProfModel.find().sort({nome:1})
    .then(prof=>{
        res.json(prof)
    })
    .catch(err=>{
        console.log('Erro em GetProf: ' + err);
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde'});
    })
})

router.get('/getProfById/:id',isAuth,async (req,res)=>{
    const id = req.params.id;
    console.log(id);
    const exists = await ProfModel.findOne({id:id}).catch(err=>{
        console.log('Erro :' + err);
        return res.send({result:'Erro servidor. Pff Tente mais tarde'})
    });
    console.log(exists);

    if(!exists){
        return res.send({result:'ID Inexistente'})
    }
    return res.send(exists);
})

router.post('/addProf',isAuth, async(req,res)=>{
    const nome=req.body.nome;
    const exists = await ProfModel.find({nome:{$regex: new RegExp('^' + nome, 'i')}}).catch(err=>{
        console.log('Erro :' + err);
        return res.send({result:'Erro servidor. Pff Tente mais tarde'})
    });
    if(exists!=''){
        return res.send({result:'Profissional Ja existe'});
    }
    let prof = new ProfModel({nome});
    prof = await prof.save();
    console.log(prof)
    return res.json({result:'ok',id:prof.id});
})

router.post('/updateProf',isAuth,async (req,res)=>{
    const id = req.body.id;
    const nome = req.body.nome;
    const exists = await ProfModel.findOneAndUpdate({id:id},{nome:nome}).catch(err=>{
        console.log('Erro :' + err);
        return res.send({result:'Erro servidor. Pff Tente mais tarde'})
    })
    if(!exists){
        return res.send({result:'Id Inexistente'})
    }
    return res.send({result:'ok'})
})

router.post('/apagarProf',isAuth,async (req,res)=>{
    const id = req.body.id;
    const exists = await ProfModel.findOneAndDelete({id:id}).catch(err=>{
        console.log('Erro :' + err);
        return res.send({result:'Erro de ligação ao servidor. Pff Tente mais tarde'})
    });
    if(!exists){
        return res.send({result:'ID Inexistente'})
    }
    return res.send({result:'ok'});
})

module.exports = router;