const express = require('express')
const path = require('path');
const FilmeModel = require('../models/filme');
const FilmeCounter = require('../models/filmesCounter');
const router = express.Router();
const currentYear = new Date().getFullYear()
const LogModel = require('../models/logs');

function addLogRecord(opsType,obs=''){
    const obj = {
        type: opsType,
        obs: obs
    }

    LogModel.create(obj).catch((err)=>{
        console.log(err);
    })
}

module.exports = {addLogRecord}