const mongoose = require('mongoose');

const idString = ()=>{
    const idGen = Date.now().toString();
    return idGen; 
}

const dateNow = ()=>{
    const today = new Date();
    return today.toISOString()
}

const profSchema = new mongoose.Schema({
    id: {
        type: Number,
        default:idString
    },
    nome: {
        type: String,
        required: true,
    },
    regdate:{
        type: Date,
        default: dateNow,
    }
})



module.exports = mongoose.model('Prof', profSchema,'tblProf');
