const jwt = require('jsonwebtoken');
const Register = require('../models/registers');

const auth = async (req, res,next) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Register.findOne({_id:verify._id})
        req.token = token;
        req.user = user;
        
        next();
    } catch (error) {
        res.status(404).send(error);
    }
}
module.exports= auth;