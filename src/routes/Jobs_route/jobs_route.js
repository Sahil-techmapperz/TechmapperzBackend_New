const express = require("express");
const jobRoute = express.Router();
const cors = require("cors");
const Jobsmodel = require("../../model/Jobs_model/jobs_model");
jobRoute.use(cors());

jobRoute.get("/", async (req, res) => {
  let AllJob = await Jobsmodel.find();
  res.status(200).json(AllJob);
});

jobRoute.post("/", async (req, res) => {
  const{description,designetion,experience,location,JobID,Jobtype}=req.body;

  try{
  if(description&&designetion&&experience&&location&&JobID&&Jobtype){
    let AllJob=await Jobsmodel.find();
    let newJob= new Jobsmodel({description,designetion,Jobtype,experience,location,userId:AllJob.length+1,JobID});
    await newJob.save();
    res.status(200).json({"message":"Job Posted successfully"});
  }else{
    res.status(201).json({"message":"provide all details"});
  }
}catch(err){
  res.status(500).json({"message":err.message})
}
});




jobRoute.put('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedJob = req.body;

  try {
    // Update the job in your data store
    const updatedJobData = await Jobsmodel.findOneAndUpdate({_id: userId }, updatedJob, { new: true });

    if (updatedJobData) {
      res.json(updatedJobData);
    } else {
      res.status(404).send('Job not found');
    }
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).send('Internal server error');
  }
});



jobRoute.delete("/", async (req, res) => {
  const { selectedjobsIds} = req.body;
  

  try {
    if (selectedjobsIds&& Array.isArray(selectedjobsIds)) {
      const result = await Jobsmodel.deleteMany({ _id: { $in: selectedjobsIds} });
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "job deleted successfully." });
      } else {
        res.status(404).json({ message: "No job found with the provided ids." });
      }
    } else {
      res.status(400).json({ message: "Invalid request. Provide an array of career ids." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting job.", error: err });
  }
});



module.exports = jobRoute;