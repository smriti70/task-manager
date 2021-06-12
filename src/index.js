const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
 

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log("server is up on port " + port);
});


// const pet = {
//     name: "Hal"
// }

// pet.toJSON = function(){
//     return this
// }

// console.log(JSON.stringify(pet));

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//     // const task = await Task.findById('60bf1f8cfc91f41cd0406963');
//     // await task.populate('owner').execPopulate();
//     // console.log(task);

//     const user = await User.findById('60bf05131b6a551788a71f5c');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// main();