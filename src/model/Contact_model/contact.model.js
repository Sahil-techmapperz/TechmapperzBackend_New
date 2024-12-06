const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  userId:{type:Number,required:true},
  name: { type: String, required:true},
  email: { type: String, required: true},
  mobile : {type:String,required:true},
  projectdetails: { type: String, required: true},
  projectType:{type:String},
  Date: { type: String, required: true},
});

const contactModel = model("Contact", contactSchema);

module.exports = contactModel;