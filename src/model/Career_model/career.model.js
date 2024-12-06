const mongoose =require('mongoose')

const careerSchema=new mongoose.Schema ({
    userId:{type:Number,required:true},
    name: {type:String},
    mobile: {type:String, required:true},
    designetion: { type:String},
    message: {type:String},
    resume:{type:String},
    Date:{type:String},
    
});

let Careermodel=mongoose.model("career",careerSchema);

module.exports=Careermodel;