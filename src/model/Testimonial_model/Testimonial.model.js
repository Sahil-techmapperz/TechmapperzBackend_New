const mongoose =require('mongoose')

const TestimonialSchema=new mongoose.Schema ({
    userId:{type:Number,required:true},
    name: {type:String},
    Companyname: { type:String},
    message: {type:String},
    avater:{type:String},
    Date:{type:String},
    
});

let Testimonialmodel=mongoose.model("Testimonial",TestimonialSchema);

module.exports=Testimonialmodel;