const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    avatar: {
        type: String,
        default: 'server/assets/images/avatar.png',
    },
    passwordHash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,

    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isCommentsBlocked: {
        type: Boolean,
        default: false
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    receipts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receipt',
    }],
    favoriteBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }]

});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
/**
 
{
    "_id":{"$oid":"64bab9d3a02778267bd8e2e1"},
    "username":"shehan1",
    "email":"shehan1@gmail.com",
    "avatar":"https://drive.google.com/file/d/1dhacjm3hy6Mfs1pk1YVRGjqBxH3jPZCr/view?usp=sharing",
    "passwordHash":"$2a$10$Gh.dGNs8Wi9vHGKubqxEX.9RvflkTl2Yu8QwSk4a2inNBuSotGs/m",
    "isAdmin":true,
    "isCommentsBlocked":false,
    "commentsCount":{"$numberInt":"0"},
    "roles":[
        {"$oid":"64bab39c50c6647e654a346a"},
        {"$oid":"64bab3f79759d22d9fc27c4e"}
    ],
    "receipts":[],
    "favoriteBooks":[],
    "__v":{"$numberInt":"0"},
    "cart":{"$oid":"64bab9d4a02778267bd8e2e4"}
}

 */