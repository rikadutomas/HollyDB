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

const userSchema = new Schema ({
    id: {
        type:String,
        default:idString
    },
    nome: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
       
    },
    favoritos:{
        type: [Number],
        default: [],
    },
    secretToken:{
        type: String,
    },
    validation:{
        type: Boolean,
        default: false,
    },
    role:{
        type: String,
        default: 'Role_User',
    },
    active:{
        type: Boolean,
        default: true,
    },
    regdate:{
        type: Date,
        default: dateNow,
    },
});




module.exports = mongoose.model('User',userSchema,'tblUsers');

