const mongoose =require('mongoose')

const jobSchema=new mongoose.Schema ({
    userId:{type:Number,required:true},
    JobID: String,
    Jobtype: String,
    location: String,
    experience: String,
    designetion: String,
    description: String,
    education: String,
    perksBenefits: String,
    candidateProfile: String,
    roleResponsibility: String,
    salary: String,
    Date:{type:String},
});

let Jobsmodel=mongoose.model("jobs",jobSchema)

module.exports=Jobsmodel;