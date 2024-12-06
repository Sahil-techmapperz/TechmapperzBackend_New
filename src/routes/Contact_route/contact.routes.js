const express = require("express");
const contactRoute = express.Router();
const cors = require("cors");
const contactModel = require("../../model/Contact_model/contact.model");
contactRoute.use(cors());

contactRoute.get("/", async (req, res) => {
  let AllContact = await contactModel.find();
  res.status(200).send(AllContact);
});

contactRoute.post("/", async (req, res) => {
  const { name, email, mobile, projectType, projectdetails } = req.body;

  try {
    if (name && email && mobile && projectType && projectdetails) {
      let AllContact = await contactModel.find();

      // Get the current date and format it as Date-month-year
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      let newcontact = new contactModel({
        name,
        email,
        mobile,
        projectType,
        projectdetails,
        Date: formattedDate, // Add the formatted date to the contact data
        userId: AllContact.length + 1,
      });

      let newres = await newcontact.save();
      res.status(200).json({ "message": "success" });
    }else if(projectType===""){
      let AllContact = await contactModel.find();

      // Get the current date and format it as Date-month-year
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      let newcontact = new contactModel({
        name,
        email,
        mobile,
        projectType:"false",
        projectdetails,
        Date: formattedDate, // Add the formatted date to the contact data
        userId: AllContact.length + 1,
      });

      let newres = await newcontact.save();
      res.status(200).json({ "message": "success" });
    }
    
    else {
      res.status(201).json({ "message": "provide all details" });
    }
  } catch (err) {
    res.status(500).json({ "message": err });
  }
});








contactRoute.delete("/", async (req, res) => {
  const { selectedContactIds } = req.body;

  try {
    if (selectedContactIds && Array.isArray(selectedContactIds)) {
      const result = await contactModel.deleteMany({ _id: { $in: selectedContactIds } });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Contacts deleted successfully." });
      } else {
        res.status(404).json({ message: "No contacts found with the provided ids." });
      }
    } else {
      res.status(400).json({ message: "Invalid request. Provide an array of contact ids." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting contacts.", error: err });
  }
});




module.exports = contactRoute;
