const express = require("express");
const Recent_login_Route = express.Router();
const cors = require("cors");
const Recent_login_model = require("../../model/Recent_logins_model/Recent_logins.model");
Recent_login_Route.use(cors());

Recent_login_Route.get("/", async (req, res) => {
    try {
        const recentLogins = await Recent_login_model.find().sort({ loginTime: -1 }).limit(10);
        res.json(recentLogins);
    } catch (error) {
        res.status(500).send('Error fetching recent logins');
    }
});
Recent_login_Route.post("/", async (req, res) => {
    const { email } = req.body;
 


    const getCurrentDateString = () => {
        const date = new Date();
        const offsetInMinutes = 5 * 60 + 30; // Indian Standard Time (IST) is UTC +5:30
        const indianDate = new Date(date.getTime() + offsetInMinutes * 60000);
      
        const year = indianDate.getUTCFullYear();
        const month = String(indianDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(indianDate.getUTCDate()).padStart(2, '0');
        let hours = indianDate.getUTCHours();
        const minutes = String(indianDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(indianDate.getUTCSeconds()).padStart(2, '0');
      
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
        hours = String(hours).padStart(2, '0');
      
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      };

      

    if (!email) {
        res.status(400).send('Missing email');
        return;
    }

    try {
        let date = getCurrentDateString ();
        const newLogin = new Recent_login_model({ email, "loginTime": date });
        await newLogin.save();
        res.status(201).json(newLogin);
    } catch (error) {
        res.status(500).send('Error adding new login data');
    }
});








module.exports = Recent_login_Route;