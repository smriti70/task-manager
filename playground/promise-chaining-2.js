require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndRemove('60a94ed102c02d3ffc2e90a0').then((user)=>{
//     console.log(user);
//     return Task.find({'completed':false})
// }).then((users)=>{
//     console.log(users);
// }).catch((e)=>{
//     console.log(e);
// })

const removeUserAndCount = async (id)=>{
    const task = await Task.findByIdAndRemove(id);
    const count = await Task.countDocuments({completed:false});
    return count;
}

removeUserAndCount('60a94ed102c02d3ffc2e90a0').then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
})