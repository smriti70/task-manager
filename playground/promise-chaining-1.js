require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('60acb824fc4a78364040b687',{age:20}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:20});
// }).then((count)=>{
//     console.log(count);
// }).catch((e)=>{
//     console.log(e);
// });

const UpdateUserAndCount = async (id,age) =>{
    const user = await User.findByIdAndUpdate(id,{age});
    const count = await User.countDocuments({age});
    return count;
}

UpdateUserAndCount('60acb824fc4a78364040b687',2).then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
});

