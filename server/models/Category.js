const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    description: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
