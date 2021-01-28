require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.URL_PORT
const ROOT = __dirname;
const mongoURI = process.env.MDB_ACCESS
const UsersRoute = require('./routes/users')
const FilmesRoute = require('./routes/filmes')
const AdminsRoute = require('./routes/admins')
const ProfRoute = require('./routes/prof')

mongoose
    .connect(mongoURI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
    .then((res) =>{
        console.log('MongoDB Connected')
    })

app.use(bodyParser.urlencoded({limit:'10mb', extended: true}))
app.use(bodyParser.json());
app.use('/users',UsersRoute)
app.use('/filmes',FilmesRoute)
app.use('/admins',AdminsRoute)
app.use('/prof',ProfRoute)

app.use('/img', express.static(path.join(ROOT,'/_public/img')));
app.use('/js', express.static(path.join(ROOT,'/_public/js')));
app.use('/css', express.static(path.join(ROOT,'/_public/css')));

app.use('/adminjs', express.static(path.join(ROOT,'/_admin/js')));
app.use('/admincss', express.static(path.join(ROOT,'/_admin/css')));
app.use('/adminimg', express.static(path.join(ROOT,'/_admin/img')));

app.get('/', (req,res)=>{ 
    const uuid = req.headers
    if(uuid.host == 'admin.hollydb.tk'){
        res.sendFile(path.join(ROOT,'_admin','index.html'));
    }else{
        res.sendFile(path.join(ROOT,'_public','index.html'));
    }
})

app.listen(PORT, console.log('WWW Server running on ' + PORT));
