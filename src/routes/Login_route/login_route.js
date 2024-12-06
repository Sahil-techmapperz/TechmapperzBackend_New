const express = require("express");
const AdminRoute = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const Loginmodel = require("../../model/Login_model/login_model");
AdminRoute.use(cors());

AdminRoute.get("/", async (req, res) => {
  res.send("welcome to AdminRoute");
});



// LOGIN

//Post Request
AdminRoute.post("/signin", async (req, res) => {
  try {
    const user = await Loginmodel.find({ email: req.body.email, password: req.body.password });

    if (user[0].email) {
      const token = jwt.sign({ userId: user[0]._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(200).send({user,token});

    } else {

      res.status(404).json({
        message: "NO USER NOT FOUND",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "EMAIL OR PASSWORD IS INCORRECT",
    });
  }
});





module.exports = AdminRoute;