const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const User = require('../models/User');
const Product = require('../models/Product');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {
    
    let type = req.params.type;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se encuentra el fichero'
            }
        });
    }

    // Valida tipo
    let types = ['users', 'products'];

    if(types.indexOf(type) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de modelo a editar no es el correcto.'
            }
        });
    }

    let file = req.files.file;
    let nameFile = file.name.split('.');
    let extension = nameFile[nameFile.length - 1];

    // Extensiones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensiones.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensión del fichero no es la permitida.'
            }
        });
    }

    // Cambiar nombre de archivo
    let name = `${id}-${new Date().getMilliseconds()}.${extension}`;


    file.mv(`uploads/${type}/${name}`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Asignar img al objeto que corresponda
        uploadImg(id, res, name, type);
    });
        
});

function uploadImg(id, res, nameFile, type){
    switch(type){
        case 'users':
            userImg(id, res, nameFile, type);
            break; 
        case 'products':
            productImg(id, res, nameFile, type);
            break;
    }
}

function userImg(id, res, nameFile, type) {
    User.findById(id, (err, user) => {
        if (err){
            dropFile(nameFile, type);

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!user) {
            dropFile(nameFile, type);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        dropFile(user.img, type);

        user.img = nameFile;
        user.save((err, userSave) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: userSave
            });
        });
    });
}

function productImg(id, res, nameFile, type) {
    Product.findById(id, (err, product) => {
        if (err){
            dropFile(nameFile, type);

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!product) {
            dropFile(nameFile, type);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        dropFile(product.img, type);

        product.img = nameFile;
        product.save((err, productSave) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productSave
            });
        });
    });
}

function dropFile(name, type){
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${name}`);
    if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;
