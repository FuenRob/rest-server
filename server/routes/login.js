const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require('../models/User');
const app = express();

app.post('/login', (req, res) =>{
    
    let body = req.body;

    User.findOne({email: body.email}, (err, user) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }

        if(!user){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incrorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incrorrectos'
                }
            });
        }

        let token = jwt.sign({
            user
        }, process.env.SEED_AUTH, {expiresIn: process.env.TOKEN_TIME});

        res.json({
            ok: true,
            user,
            token
        });

    });
});

// Google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) =>{

    let token = req.body.idtoken;

    let googleUser = await verify(token)
                            .catch(err => {
                                res.status(403).json({
                                    ok: false,
                                    err
                                });
                            });

    User.findOne({email: googleUser.email}, (err, user) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }

        if(user){
            if(user.google === false){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You must use your normal authentication'
                    } 
                 });
            }else{
                let token = jwt.sign({
                    user
                }, process.env.SEED_AUTH, {expiresIn: process.env.TOKEN_TIME});

                return res.json({
                    ok: true,
                    user,
                    token
                });
            }
        }else{
            // Create new user
            let newUser = new User();

            newUser.name = googleUser.name;
            newUser.email = googleUser.email;
            newUser.img = googleUser.picture;
            newUser.google = true;
            newUser.password = ':)';

            newUser.save((err, user) => {
                if(err){
                    return res.status(500).json({
                       ok: false,
                       err  
                    });
                }

                let token = jwt.sign({
                    user
                }, process.env.SEED_AUTH, {expiresIn: process.env.TOKEN_TIME});

                return res.json({
                    ok: true,
                    user,
                    token
                });
            });
        }
    });
});

module.exports = app;