const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const idString = ()=>{
    const idGen = Date.now().toString();
    return idGen; 
}

const dateNow = ()=>{
    const today = new Date();
    return today.toISOString()
}

const logSchema = new Schema ({
    id: {
        type:String,
        default:idString
    },
    regdate:{
        type: Date,
        default: dateNow,
    },
    type: {
        type:String,
        required:true
    }
});


module.exports = mongoose.model('Log',logSchema,'tblLogs');