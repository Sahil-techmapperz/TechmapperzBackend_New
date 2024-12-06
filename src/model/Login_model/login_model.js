const mongoose =require('mongoose')

const LoginSchema=new mongoose.Schema ({
    email: {type:String},
    password: {type:String},
});

let Loginmodel=mongoose.model("Admin_data",LoginSchema)

module.exports=Loginmodel;