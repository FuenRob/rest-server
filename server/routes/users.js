const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/User');
const app = express();

app.get('/usuario', function (req, res) {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let conditions = {
        status: true
    }

    User.find(conditions, 'name email role google status')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }
    
        User.count(conditions,(err, sumUsers) => {
            res.json({
                ok: true,
                users,
                sumUsers
            });
        });
    });
});

// Save user
app.post('/usuario', function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
});

// Update user
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

// Unabled user
app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    User.findByIdAndUpdate(id, {status: false}, {new: true}, (err, user) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        if(!user){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                } 
             });
        }
        
        res.json({
            ok: true,
            user
        });
    });
});

module.exports = app;