const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// const myFunction = async() => {
//     const password = 'Red123!';
//     const hashPassword = await bcrypt.hash(password,8);

//     console.log(password);
//     console.log(hashPassword);

//     const isValid = await bcrypt.compare('Red123!',hashPassword);
//     console.log(isValid);
// }

// myFunction();

app.listen(port,()=>{
    console.log("server is up on port " + port);
});