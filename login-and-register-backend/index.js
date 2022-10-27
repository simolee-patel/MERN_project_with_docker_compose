const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 3001;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  User.findOne({email: email}, (err, user) => {
    if (user) {
      if (user.password === password) {
        res.send({status: 1, message: "Success", user: user});
      } else {
        res.send({status: 0, message: "Please enter valid credentials"});
      }
    } else {
      res.send({status: 0, message: "Please enter valid credentials"});
    }
  });
});

app.post("/register", (req, res) => {
  console.log(req.body);
  const {name, email, password} = req.body;
  User.findOne({email: email}, (err, user) => {
    if (user) {
      res.send({status: 1, message: "User already registered"});
    } else {
      const user = new User({name, email, password});
      user.save((err) => {
        if (err) {
          res.send({status: 0, err: err});
        } else {
          res.send({status: 1, message: "Success"});
        }
      });
    }
  });
});

mongoose.connect(
  "mongodb://mongo:27017/login_reg_db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB connected successfully!");
  }
);

const userschema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userschema);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
