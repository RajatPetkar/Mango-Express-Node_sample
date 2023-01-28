const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Data = mongoose.Schema({
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    address : {
        type: String,
    },
    gender : {
        type: String,
        required: true
    },
    DOB : {
        type: Number,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
        unique: true
    },
    cpassword : {
        type: String,
        required: true,
        unique: true
    },
    tokens:[{
        token:{
           type: String,
           required: true 
        }
    }]
});

Data.methods.generateAuthToken = async function(){
    try {
        const token =  jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();

        console.log(token);
        return token;
    } catch (error) {
        res.send(error)
    }
}

Data.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword = await bcrypt.hash(this.cpassword, 10);
    }
    next();
})
const Register = new mongoose.model('Register',Data);

module.exports = Register;