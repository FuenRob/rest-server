var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es necesario'] 
    },
    img: {
        type: String,
        required: false
    },
    price: { 
        type: Number, 
        required: [true, 'El precio es necesario'] 
    },
    description: { 
        type: String, 
        required: false 
    },
    status: { 
        type: Boolean, 
        required: true, 
        default: true 
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }
});

module.exports = mongoose.model('Product', productSchema);
