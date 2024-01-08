const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    comment: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true,
});

exports.Comment = mongoose.model('Comment', commentSchema);
exports.commentSchema = commentSchema;
