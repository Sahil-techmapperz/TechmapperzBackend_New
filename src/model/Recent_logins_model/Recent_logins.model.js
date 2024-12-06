const mongoose =require('mongoose')

const Recent_login_Schema=new mongoose.Schema ({
    email: {type:String},
    loginTime:{type: String},
});



let Recent_login_model=mongoose.model("Recent_login",Recent_login_Schema)

module.exports=Recent_login_model;