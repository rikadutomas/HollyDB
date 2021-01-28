const mongoose = require('mongoose');

const filmeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    titulopt: {
        type: String,
        required: true,
    },
    realizador: {
        type: String,
        required: true,
    },
    ano: {
        type: Number,
        required: true,
    },
    actor: {
        type: String,
        required: true,
    },
    etaria: {
        type: String,
        required: true,
    },
    genero: {
        type: String,
        required: true,
    },
    duracao: {
        type: Number,
        required: true,
    },    
    sinopse: {
        type: String,
        required: false,
    },
    cover: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        default:true
    }

})



module.exports = mongoose.model('Filme', filmeSchema,'tblFilmes');
