const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productsInfo: { type: [] },
    totalPrice: {
        type: Number,
        default: 0,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

receiptSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

receiptSchema.set('toJSON', {
    virtuals: true,
});

exports.Receipt = mongoose.model('Receipt', receiptSchema);
exports.receiptSchema = receiptSchema;
