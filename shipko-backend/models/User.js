const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserModel = new Schema({
    user_name:{ type : String, required:true, unique:[true, 'User name should be unique.']},
    first_name:  {type : String, required:true}, 
    last_name: {type : String, required:true},
    stream:{ type: String},
    mobile:{ type: String, required: function(){
        return this.mobile && this.mobile.length === 10
    },unique:[true, 'Mobile should be unique.']},
    email:{ type: String, required:true, unique:[true, 'Email should be unique.']},
    created_at: {type: Date, default:Date.now()},
    updated_at: {type: Date, default:Date.now()},
    role:{type:String, required:true},
    status: {type:Number, required:true},
    address:{type:Object},
    login_details:{type:Object},
    password:{type:String, required:true},
    isLogin:{type:Boolean, default:false},
    isDeleted:{type:Boolean, default:false}
});

const User = module.exports = mongoose.model('users', UserModel);

// User.watch().
//     on('change', data => console.log(new Date(), data));


User.createUser = async function(user){
    try {
        return await this.create(user);
    } catch (error) {
        return false;
    }  
} 

User.countUsers = async function(where){
    return await this.count(where);
}

User.getUser = async function(where, select, skip, limit, sort){
    try {
        skip = skip || 0;
        limit = limit || 10;
        select = select || ['email', 'first_name', 'last_name', 'login_details', 'address', 'stream', 'mobile', 'role'];
        return await this.find(where).select(select).skip(skip).limit(limit).sort(sort);
    } catch (error) {
        return [];
    }
}

User.updateUser = async function(where, updateData){
    try {
        var data = {
            $set: updateData
        }
        return await this.updateOne(where, data);
    } catch (error) {
        console.log(error)
        return false;
    }
}
