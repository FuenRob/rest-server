const express = require('express');
const _ = require('underscore');
const {verifyToken} = require('../middlewares/auth');
const app = express();
const Product = require('../models/Product');

app.get('/producto', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let conditions = {
        
    }

    Product.find(conditions)
        .sort('name')
        .populate('category', 'name')
        .populate('user', 'name')
        .skip(from)
        .limit(limit)
        .exec((err, products) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }
    
        Product.countDocuments(conditions,(err, sumProducs) => {
            res.json({
                ok: true,
                products,
                sumProducs
            });
        });
    });
});

app.get('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
            .populate('user','name')
            .populate('category', 'name')
            .exec((err, productBD) => {
                if(err){
                    return res.status(500).json({
                    ok: false,
                    err  
                    });
                }

                if(!productBD){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    product: productBD
                });
            }
    );
});

// Browse products
app.get('/producto/buscar/:term', verifyToken, (req, res)=>{
    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    Product.find({name: regex})
            .populate('category', 'name')
            .exec((err, productos) => {
                if(err){
                    return res.status(400).json({
                       ok: false,
                       err  
                    });
                }

                res.json({
                    ok: true,
                    product: productos
                });
            });
});

app.post('/producto', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        status: body.status,
        category: body.categoryId,
        user: req.user._id
    });

    product.save((err, productBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        if(!productBD){
            return res.status(500).json({
                ok: false,
                err
             });
        }

        res.json({
            ok: true,
            product: productBD
        });
    });
});

app.put('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        if(!productBD){
            return res.status(400).json({
               ok: false,
               err: {
                   message: 'El producto no existe'
               } 
            });
        }

        productBD.name = body.name;
        productBD.price = body.price;
        productBD.description = body.description;
        productBD.enable = body.enable;
        productBD.category = body.categoryId;
        productBD.user = req.user._id;

        productBD.save((err, product) => {
            if(err){
                return res.status(400).json({
                   ok: false,
                   err  
                });
            }

            res.json({
                ok: true,
                product
            });
        })

    });
});

app.delete('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(id, {status: false}, (err, productBD) => {
        if(err){
            return res.status(500).json({
               ok: false,
               err  
            });
        }

        if(!productBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no encontrado'
                } 
             });
        }
        
        res.json({
            ok: true,
            message: 'Poducto borrado'
        });
    });
});

module.exports = app;
