const express = require("express");
const TestimonialRoute = express.Router();
const cors = require("cors");
const Testimonialmodel = require("../../model/Testimonial_model/Testimonial.model");
TestimonialRoute.use(cors());
const multer = require('multer');
const upload = multer();
const ImageKit = require('imagekit');



const imagekit = new ImageKit({
  publicKey: "public_uw+Iy20W6XHXO3AjkXEW2K+2tgo=",
  privateKey: "private_B4IrCM6a0Q7Q+r/03UZGZINFyrE=",
  urlEndpoint: "https://ik.imagekit.io/lrrkr27gr",
});



const uploadFile = async (fileBuffer, fileName) => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: "/uploads",
    });

    return response.url;
  } catch (error) {
    console.log(error);
    return null;
  }
};


TestimonialRoute.get("/", async (req, res) => {
  let AllTestimonial = await Testimonialmodel.find();
  res.send(AllTestimonial);
});

TestimonialRoute.post("/", upload.single("file"), async (req, res, next) => {
  const { body: { data } } = req;
  const { name, Companyname, message} = JSON.parse(data);
  const { originalname, mimetype, buffer } = req.file;
 
  try {
    if (name && Companyname && message && buffer  && originalname && mimetype && buffer) {

      let filetype = mimetype.split("/");
      let fileName = originalname.split(".")
      let file = `${fileName[0]}.${filetype[1]}`;


      const avater_url = await uploadFile(buffer, file);
      // console.log(avater_url);
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;


      let AllTestimonial = await Testimonialmodel.find();
      let newTestimonial = new Testimonialmodel({ name, Companyname, message, "avater": avater_url, userId: AllTestimonial.length + 1,Date: formattedDate, });
      await newTestimonial.save();
      res.status(200).json({"newTestimonial":newTestimonial});
    } else {
      res.status(201).json({ "message": "provide all the necessary details" });
    }
  } catch (err) {
    res.status(500).json({ "message": err });
  }


});






TestimonialRoute.put('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedJob = req.body;

  try {
    // Update the job in your data store
    const updatedTestimonialData = await Testimonialmodel.findOneAndUpdate({_id: userId }, updatedJob, { new: true });

    if (updatedTestimonialData) {
      res.json(updatedTestimonialData);
    } else {
      res.status(404).send('Job not found');
    }
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).send('Internal server error');
  }
});






TestimonialRoute.delete("/", async (req, res) => {
  const { selectedTestimonialIds } = req.body;

  try {
    if (selectedTestimonialIds && Array.isArray(selectedTestimonialIds)) {
      const result = await Testimonialmodel.deleteMany({ _id: { $in: selectedTestimonialIds } });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Testimonial  deleted successfully." });
      } else {
        res.status(404).json({ message: "No Testimonial found with the provided ids." });
      }
    } else {
      res.status(400).json({ message: "Invalid request. Provide an array of Testimonial application ids." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting Testimonial applications.", error: err });
  }
});




module.exports = TestimonialRoute;
