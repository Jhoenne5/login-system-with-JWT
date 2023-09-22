const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email:{
       type: String,
       required: [true, "Please enter Email"],
        unique: true,
        lowercase: true, 
        validate:[isEmail,"Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true, "Please enter a password"], 
        minlength: [6, "minimum password length is 6 characters"]
    }
})

userSchema.pre('save', async function(next){
const salt  = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password, salt);
next()
})
//STATIC METHOD FOR LOGIN
    userSchema.statics.login = async function (email, password) {

    const user = await this.findOne({email: email})

        if(user){
            let auth = await bcrypt.compare(password, user.password)
            if(auth){
                return user
            }
            throw Error("invalid password")
        }
        throw Error("invalid email")

    }
    const User = mongoose.model('user', userSchema);
    module.exports = User;