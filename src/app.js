require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const app = express();
const register = require('./models/registers');
// const router = require('../src/router/router');
require('./db/conn');
const auth = require('../src/middleware/auth')
const port = process.env.PORT || 3000;

// app.use(router);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

hbs.registerPartials(path.join(__dirname, '../templates/partials'));

app.set('views', path.join(__dirname, '../templates/views'));
app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, '../public/'))) 

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/secret', auth,(req, res) => {
    res.render('secret');
    // console.log(req.cookies.jwt);
})

app.get('/logout', auth, async(req, res) => {
    try {
        // req.user.tokens = req.user.tokens.filter((ele)=>{
        //     return ele.token !== req.token
        // }) // logout current device

        // logout all devices

        req.user.tokens = [];

        res.clearCookie('jwt');
        await req.user.save();
        res.render('login');
    } catch (error) {
       res.status(404).send(error) 
    }
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try {
        const fn = req.body.fn;
        const ln = req.body.ln;
        const gender = req.body.gender;
        const email = req.body.email;
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(cpassword==password){
            const registerEmp = new register({
                first_name : fn,
                last_name : ln,
                gender : gender,
                email : email,
                password : password,
                cpassword : cpassword
            });

            const token = await registerEmp.generateAuthToken();

            res.cookie('jwt',token,{
                httpOnly:true,
                expires: new Date(Date.now() + 4000000)
            });

            const result = await registerEmp.save(); 
            res.render('index'); 
            console.log(token) 
        }
    } catch (error) {
        res.send(error);
    }
})

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const result = await register.findOne({email : email})
        const isValid = await bcrypt.compare(password, result.password);

        const token = await result.generateAuthToken();
        res.cookie('jwt',token,{
            httpOnly:true,
            expires: new Date(Date.now() + 5000000)
        });

        
        if(isValid){
            res.status(201).render('index');
        }else{
            res.status(404).send('Invalid');
        }
    } catch (error) {
        res.status(404).send('xxx');
    }
})

app.listen(port,()=>{
    console.log('listening on port')
})
