const mongoose =require('mongoose')

const datasetSchema = new mongoose.Schema({
    questions: [String],
    keywords: [String],
    answers: [String],
    similarityThreshold: Number
  });


  let Chatbotmodel=mongoose.model("chatbot",datasetSchema);

module.exports=Chatbotmodel;