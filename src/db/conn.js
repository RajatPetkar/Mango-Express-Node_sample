const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/FormRegistration')
.then(()=>{
    console.log('Connection successful to mangoDB');
})
.catch((err)=>{
    console.log(err);
});
