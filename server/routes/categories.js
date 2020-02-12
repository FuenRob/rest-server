const express = require('express');
const _ = require('underscore');
const {verifyToken, verifyRole} = require('../middlewares/auth');
const app = express();
const Category = require('../models/Category');

app.get('/categoria', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let conditions = {
        
    }

    Category.find(conditions)
        .sort('name')
        .populate('user', 'name')
        .skip(from)
        .limit(limit)
        .exec((err, categories) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }
    
        Category.countDocuments(conditions,(err, sumCategories) => {
            res.json({
                ok: true,
                categories,
                sumCategories
            });
        });
    });
});

app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryBD) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }

        if(!categoryBD){
            return res.status(500).json({
                ok: false,
                err
             });
        }

        res.json({
            ok: true,
            category: categoryBD
        });
    });
});

app.post('/categoria', verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        if(!categoryBD){
            return res.status(500).json({
                ok: false,
                err
             });
        }

        res.json({
            ok: true,
            category: categoryBD
        });
    });
});

app.put('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description', 'status']);
    
    Category.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoryBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        res.json({
            ok: true,
            category: categoryBD
        });
    });
});

app.delete('/categoria/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryBD) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }

        if(!categoryBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no encontrada'
                } 
             });
        }
        
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });
});

module.exports = app;
