const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload a word file!'));
        }
        cb(undefined, true);

        // cb(new Error('File must be a PDF!'));
        // cb(undefined, true);
        // cb(undefined, false);
    }
});

router.post('/users', async (req,res) => {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    try{
        res.status(201).send({user,token});
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/login',async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken(); 
        res.send({user,token});
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async(req,res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send();
});

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedItems = ['name','email','password','age'];
    const isValidOperation = updates.every((update) => allowedItems.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error:"Not a valid Operation!"});
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.send(req.user);
    } catch(e) {
        res.status(400).send();
    }

});

router.delete('/users/me', auth, async (req,res) => {
    
    try{
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }

});


module.exports = router;