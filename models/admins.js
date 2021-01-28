const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema ({
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
        type: Array,
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
        default: 'Role_Admin',
    },

});

module.exports = mongoose.model('User',userSchema,'tblUsers');