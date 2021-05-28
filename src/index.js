const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req,res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        res.status(201).send(user);
    } catch(e) {
        res.status(400).send(e);
    }

});

app.get('/users',async (req,res)=>{

    try {
        const users = await User.find({});
        res.send(users);
    } catch(e) {
        res.status(500).send(e);
    }
    
});

app.get('/users/:id',async (req,res)=>{
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send("No User Found");
        }
        res.send(user);
    } catch(e) {
        res.status(500).send(e);
    }

});

app.patch('/users/:id',async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedItems = ['name','email','passwprd','age'];
    const isValidOperation = updates.every((update) => allowedItems.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error:"Not a valid Operation!"});
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!user){
            return res.status(404).send("No user found!");
        } 
        res.send(user);
    } catch(e) {
        res.status(400).send();
    }

});

app.delete('/users/:id',async (req,res)=>{
    
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send({error:"Cannot find user"});
        }
        res.send(user);
    } catch(e) {
        res.status(500).send(e);
    }

});

app.post('/tasks',async (req,res)=>{
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }

});

app.get('/tasks',async (req,res)=>{

    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send(e);
    }

});

app.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);
        if(!task){
            return res.status(404).send("No task Found!");
        }
        res.send(task);
    } catch(e) {
        res.status(500).send(e);
    }

    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send("No tasks were found!");
    //     }
    //     res.send(task);
    // }).catch((e)=>{
    //     res.status(500).send(e);
    // });
});

app.patch('/tasks/:id',async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error:"Invalid Updates!"});
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!task) {
            return res.status(404).send("No task found!");
        }
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
    
});

app.delete('/tasks/:id',async (req,res)=>{

    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task) {
            return res.status(404).send({error:"No Task Found!"});
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
    
});

app.listen(port,()=>{
    console.log("server is up on port " + port);
});