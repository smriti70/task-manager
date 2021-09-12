const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');


router.post('/tasks', auth, async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }

});


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10  =>  2nd page of 10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, owner:req.user._id});
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

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error:"Invalid Updates!"});
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        
        if(!task) {
            return res.status(404).send("No task found!");
        }

        updates.forEach((update)=>{
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req,res)=>{

    try {
        const task = await Task.findOneAndRemove({_id: req.params.id, owner: req.user._id});
        if(!task) {
            return res.status(404).send({error:"No Task Found!"});
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
    
});

module.exports = router;