const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {verifyTokenUrl} = require('../middlewares/auth');

app.get('/image/:type/:img', verifyTokenUrl, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    
    if(fs.existsSync(pathImg)){
        return res.sendFile(pathImg);
    }
    
    let pathNoImg = path.resolve(__dirname, `../assets/no-image.jpg`);
    res.sendFile(pathNoImg);

});

module.exports = app;
