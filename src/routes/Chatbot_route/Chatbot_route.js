const express = require("express");
const Chatbotroute = express.Router();
const cors = require("cors");
const Chatbotmodel = require("../../model/Chatbot_model/Chatbot_model");
Chatbotroute.use(cors());











Chatbotroute.get("/", async (req, res) => {
  let Alldata = await Chatbotmodel.find();
  res.send(Alldata);
});

Chatbotroute.post("/",async (req, res) => {
 const Dataset=req.body;
 
  try {
    if (Dataset) {
        const newDataset = new Chatbotmodel(Dataset);
        await newDataset.save();

      res.status(200).json({"message":"Data saved successfully"});
    } else {
      res.status(201).json({ "message": "provide all the necessary details" });
    }
  } catch (err) {
    res.status(500).json({ "message": err });
  }


});






Chatbotroute.put('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedJob = req.body;

  try {
    // Update the Dataset in your data store
    const updatedChatbotIdsData = await Chatbotmodel.findOneAndUpdate({ _id: userId }, updatedJob, { new: true });

    if (updatedChatbotIdsData) {
      res.json(updatedChatbotIdsData);
    } else {
      res.status(404).send('Dataset not found');
    }
  } catch (err) {
    console.error('Error updating Dataset:', err);
    res.status(500).send('Internal server error');
  }
});






Chatbotroute.delete("/", async (req, res) => {
  const { selectedChatbotIds } = req.body;

  try {
    if (selectedChatbotIds && Array.isArray(selectedChatbotIds)) {
      const result = await Chatbotmodel.deleteMany({ _id: { $in: selectedChatbotIds } });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "ChatbotIds  deleted successfully." });
      } else {
        res.status(404).json({ message: "No ChatbotIds found with the provided ids." });
      }
    } else {
      res.status(400).json({ message: "Invalid request. Provide an array of ChatbotIds application ids." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting ChatbotIds applications.", error: err });
  }
});




module.exports = Chatbotroute;
