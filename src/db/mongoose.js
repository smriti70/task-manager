const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});



// task1.save().then(()=>{
//     console.log(task1);
// }).catch((e)=>{
//     console.log('Error',e);
// })