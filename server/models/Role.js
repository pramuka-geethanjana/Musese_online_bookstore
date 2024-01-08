const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

});

roleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

roleSchema.set('toJSON', {
    virtuals: true,
});

exports.Role = mongoose.model('Role', roleSchema);
exports.roleSchema = roleSchema;
/**
 * 
 {
    "_id":{"$oid":"64bab39c50c6647e654a346a"},
    "name":"User",
    "users":[
        {"$oid":"64bab42e4e57422ed884a70b"},
        {"$oid":"64bab88a09577de054c743ad"},
        {"$oid":"64bab9d3a02778267bd8e2e1"},
        {"$oid":"64bab9e1a02778267bd8e2ec"}
    ],
    "__v":{"$numberInt":"3"}
}


 {
    "_id":{"$oid":"64bab3f79759d22d9fc27c4e"},
    "name":"Admin",
    "users":[
        "64baa699e2a3363ae8b72709"]
}
 */