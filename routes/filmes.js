const express = require('express')
const path = require('path');
const FilmeModel = require('../models/filme');
const FilmeCounter = require('../models/filmesCounter');
const router = express.Router();
const multer = require('multer')
const currentYear = new Date().getFullYear()
const LOGS = require('./logs');

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


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../img_temp/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Ups... not a valid file'), false);
    }

};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/getFilmes', isAuth,async (req, res) => {
    await FilmeModel.find()
        .then(filmes => {
            LOGS.addLogRecord('VIEW_FILME')
            res.json(filmes)
        })
        .catch(err => {
            console.log('Erro em GetFilmes: ' + err);
            return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
        })

})

router.get('/getFilmesActive', async (req, res) => {
    await FilmeModel.find({active:true})
        .then(filmes => {
            LOGS.addLogRecord('VIEW_FILME')
            res.json(filmes)
        })
        .catch(err => {
            console.log('Erro em GetFilmes: ' + err);
            return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
        })

})

router.get('/getMax', async (req, res) => {
    await FilmeModel.find({},{id:1}).sort({id:-1}).limit(1)
        .then(filmes => {
            res.json(filmes)
        })
        .catch(err => {
            console.log('Erro em GetFilmes: ' + err);
            return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
        })

})

router.post('/getFilmesFilter', async (req, res) => {
    const fldsearch = req.body.fld;
    const str = req.body.str;
    await FilmeModel.find({ [fldsearch]: str })
        .then(filmes => {
            LOGS.addLogRecord('SEARCH_FILME')
            res.json(filmes)
        })
        .catch(err => {
            console.log('Erro em GetFilmes: ' + err);
            return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
        })

})

router.get('/getFilmeById/:id', async (req, res) => {
    const id = req.params.id.trim();
    await FilmeModel.findOne({ id: id })
        .then(filmes => {
            return res.json(filmes)
        })
        .catch(err => {
            console.log('Erro em GetFilmes: ' + err);
            return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
        })
})

router.post('/createFilme', upload.single('productimage'), async (req, res) => {
    console.log(req.file);

})

router.post('/updateFilme',isAuth, async (req, res) => {
    const filme = req.body;
    console.log(filme);
    const validacao = validarFilme(filme, 'update');
    if (validacao.result != 'ok') {
        return res.send(validacao);
    }
    const exists = await FilmeModel.findOneAndUpdate({ id: filme.id }, {
        titulo: filme.titulo,
        titulopt: filme.titulopt,
        ano: filme.ano,
        etaria: filme.etaria,
        genero: filme.genero,
        duracao: filme.duracao,
        realizador: filme.realizador,
        actor: filme.actor,
        sinopse: filme.sinopse,
        video: filme.video,
        cover: filme.cover
    }).catch((err) => {
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
    });
    return res.send({ result: 'ok' });
});

router.post('/changeFilmeState',isAuth, async (req, res) => {
    const id = req.body.id;
    const state = req.body.state

    await FilmeModel.findOneAndUpdate({ id:id }, {
        active:!state,
    }).catch((err) => {
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
    });
    return res.send({ result: 'ok' });
});

router.post('/inserirFilme',isAuth, async (req, res) => {
    const filme = req.body;
    const validacao = validarFilme(filme, 'inserir');
    if (validacao.result != 'ok') {
        return res.send(validacao);
    }
    const test = await FilmeModel.find({ titulo: filme.titulo }).catch((err) => {
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
    })

    if (test!='') {
        if(test.ano == filme.ano){
            return res.send({ result: 'Filme Existente na BD' })
        }   
    } 


    const obj = {
        id:filme.id,
        titulo: filme.titulo,
        titulopt: filme.titulopt,
        ano: filme.ano,
        etaria: filme.etaria,
        genero: filme.genero,
        duracao: filme.duracao,
        realizador: filme.realizador,
        actor: filme.actor,
        sinopse: filme.sinopse,
        video: filme.video,
        cover: filme.cover
    }
    console.log('=====================================================================')
    const out = await FilmeModel.create(obj).catch((err)=>{
        console.log(err);
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
    })
    console.log(out)
    return res.send({ result: 'ok' });
});

router.post('/deleteFilme',isAuth, async (req, res) => {
    const id = req.body.id
    const exists = await FilmeModel.findOneAndDelete({ id: id }).catch((err) => {
        console.log(err);
        return res.status(400).send({ result: 'Erro de ligação ao servidor. Pff Tente mais tarde' });
    })
    if (!exists) {
        return res.send({ result: 'Id Invalido' });
    }
    return res.send({ result: 'ok' });
})


function validarFilme(filme, opp) {
    const data = [];
    let out;
    for (let fld in filme) {
        if (filme[fld] == '') {
            if (fld == 'id') {
                if (opp == 'update') {
                    data.push(fld + ': Nao pode ser vazio');
                }
            } else {
                data.push(fld + ': Nao pode ser vazio');
            }

        }
    }
    if (opp == 'update') {
        if (isNaN(parseInt(filme.id))) data.push('ID: Tem de ser Numerico');
    }
    if (isNaN(parseInt(filme.duracao))) data.push('Duracao: Tem de ser Numerico');
    if (isNaN(parseInt(filme.ano))) {
        data.push('Ano: Tem de ser Numerico');
    } else {
        if (filme.ano < 1888 || filme.ano > (currentYear + 5)) {
            data.push('Ano: Tem de ser entre 1888 e ' + (currentYear + 5));
        }
    }

    if (filme.video.substring(0, 8) != 'https://') {
        if (filme.video.substring(0, 7) != 'http://') {
            data.push('Video: URL Invalido');
        }
    }

    if (filme.cover.substring(0, 8) != 'https://') {
        if (filme.cover.substring(0, 7) != 'http://') {
            data.push('Capa: URL Invalido');
        }
    }

    if (data.length < 1) {
        out = { result: 'ok' }
    } else {
        out = { result: 'err', data: data }
    }
    return out;
}

module.exports = router;