const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"');
            }
            else if(value.length<=6){
                throw new Error('Enter a password of length greater than 6');
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Not a valid age!');
            }
        }
    }
});

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Cannot Login");
    }

    const isValidPassword = await bcrypt.compare(password,user.password);

    if(!isValidPassword){
        throw new Error("Cannot Login");
    }
    return user;
}

// hash the password before saving
userSchema.pre('save',async function(next){
    let user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }

    next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;