const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
    totalPrice: {
        type: Number,
        default: 0,
    },

});

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

cartSchema.set('toJSON', {
    virtuals: true,
});

exports.Cart = mongoose.model('Cart', cartSchema);
exports.cartSchema = cartSchema;

/**
 {"_id":{"$oid":"64bab9e2a02778267bd8e2ef"},
 "user":{"$oid":"64bab9e1a02778267bd8e2ec"},
 "books":[],
 "totalPrice":{"$numberInt":"0"},
 "__v":{"$numberInt":"0"}}
 */