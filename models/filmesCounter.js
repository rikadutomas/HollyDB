const mongoose = require('mongoose');

const filmeCounterSchema = new mongoose.Schema({
    seq: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('FilmeCounter', filmeCounterSchema,'tblFilmesCounter');
