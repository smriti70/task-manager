const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error,client)=>{
    if(error){
        return console.log('Unable to Connect!!');
    }
    const db = client.db(databaseName);

    // db.collection('tasks').findOne({_id:new ObjectId("60a73c934173d5308c3d746f")},(error,task)=>{
    //     if(error){
    //         return console.log("Sorry!! Could not find");
    //     }
    //     console.log(task);
    // });

    // db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
    //     if(error){
    //         return console.log("could not find!");
    //     }
    //     console.log(tasks);
    // });

    db.collection('tasks').updateMany({
        completed:false
    },{
        $set:{
            completed:true
        }
    }).then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    });


});