const mongoose = require('mongoose');
// Crypto from Node : https://nodejs.org/dist/latest-v14.x/docs/api/crypto.html | https://nodejs.org/api/crypto.html
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true, // for removing the extra space at start and end
            required: true,
            max: 12,
            unique: true,
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String, // how strong hashed password will be
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        }
    },
    { 
        timestamps: true 
    }
);

// https://mongoosejs.com/docs/guide.html#virtuals
// virtual fields - password to hashpassowrd transition
userSchema.virtual('password')
    .set(function(password){
        // create temp password
        this._password = password
        // generate salt
        this.salt = this.makeSalt()
        //encrypt password
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function(){
        return this._password
    })
// methods -> 
// authenticate(comparing the passwords and authenticate the user), 
// encryptPassword(this function hash the password), 
// makeSalt(generate salt value)
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            // crypto mechanism with sha1 - hashing algorithm and secret will be this.salt (https://nodejs.org/dist/latest-v14.x/docs/api/crypto.html)
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    // generating Salt
    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
}
// export user model
module.exports = mongoose.model('User', userSchema);



