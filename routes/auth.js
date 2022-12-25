const express = require("express");
const router = express.Router();
const User = require("../Database/schema/User");
const Crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

// signin route

router.post("/signin", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      res.status(404).json({ error: "user already exists" });
      return;
    } else {
      let encodedPassword = Crypto.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();

      const newUser = await new User({
        userName: req.body.name,
        email: req.body.email,
        password: encodedPassword,
      });
      await newUser.save();
      res.status(200).json(req.body);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

// Login route

const Mware = async (req, res, next) => {
  if (req.session.usertoken) {
    const decode = jwt.verify(req.session.usertoken, process.env.MY_SECRETKEY);
    const user = await User.findById(decode._id);
    console.log("from the middleWare", user);
    req.findUser = user;
    next();
  } else next();
};
router.post("/login", Mware, async (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Origin", "https://sasanka-insta2-0.netlify.app");
  // res.setHeader("Access-Control-Allow-Origin", "https://sasanka-insta-2-0.vercel.app");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.findUser) {
    res.status(200).json({ findUser: req.findUser });
  } else {
    try {
      const findUser = await User.findOne({ email: req.body.email });
      if (findUser) {
        let checkPassword = Crypto.AES.decrypt(
          findUser.password,
          process.env.SECRET_KEY
        );
        let originalPassword = checkPassword.toString(Crypto.enc.Utf8);
        if (!(originalPassword === req.body.password)) {
          res.status(404).json({ error: "Password not matched" });
        } else {
          const token = jwt.sign(
            { _id: findUser._id },
            process.env.MY_SECRETKEY
          );
          req.session.usertoken = token;
          res.status(200).json({ findUser });
          console.log(req.session, "from the router");
        }
      } else {
        res
          .status(401)
          .json({ error: `can't find user named "${req.body.email}"` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
});

// logOut..

router.get("/logout", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  req.session.destroy();
  res.status(200).json({ success: "success" });
});

module.exports = router;
