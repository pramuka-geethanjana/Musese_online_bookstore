const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    pagesCount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    currentRating: {
        type: Number,
        default: 0
    },
    ratingPoints: {
        type: Number,
        default: 0
    },
    ratedCount: {
        type: Number,
        default: 0
    },
    ratedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    purchasesCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],

});

bookSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

bookSchema.set('toJSON', {
    virtuals: true,
});

exports.Book = mongoose.model('Book', bookSchema);
exports.bookSchema = bookSchema;

/**
 * 
 {"_id":{"$oid":"64bb80fd101b752f88960a82"},
 "title":"The Final Empire (Mistborn #1)",
 "author":"Brandon Sanderson",
 "genre":"Fantasy",
 "year":{"$numberInt":"2006"},
 "description":"For a thousand years the ash fell and no flowers bloomed. For a thousand years the Skaa slaved in misery and lived in fear. For a thousand years the Lord Ruler, the \"Sliver of Infinity,\" reigned with absolute power and ultimate terror, divinely invincible. Then, when hope was so long lost that not even its memory remained, a terribly scarred, heart-broken half-Skaa rediscovered it in the depths of the Lord Ruler's most hellish prison. Kelsier \"snapped\" and found in himself the powers of a Mistborn. A brilliant thief and natural leader, he turned his talents to the ultimate caper, with the Lord Ruler himself as the mark.",
 "cover":"https://i.imgur.com/VRtPMP2.jpg",
 "isbn":"076531178X",
 "pagesCount":{"$numberInt":"560"},
 "price":{"$numberInt":"800"},
 "currentRating":{"$numberInt":"5"},
 "ratingPoints":{"$numberInt":"3"},
 "ratedCount":{"$numberInt":"6"},
 "ratedBy":[],"purchasesCount":{"$numberInt":"13"},
 "comments":[],
 "creationDate":{"$date":{"$numberLong":"1690009853864"}},
 "__v":{"$numberInt":"0"}}
 */