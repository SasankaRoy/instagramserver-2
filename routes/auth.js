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
  if (req.cookies.usertoken) {
    let usertoken = req.cookies?.usertoken;
    console.log("Usertoken", usertoken, "mware");
    let encode = jwt.verify(usertoken, process.env.MY_SECRETKEY);
    const findUser = await User.findById(encode._id);
    req.user = findUser;
    // res.status(200).json({user:findUser});
    console.log(encode._id, "cookies");
    next();
  } else {
    next();
  }
};
router.post("/login", Mware, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.user) {
    res.status(200).json({ findUser: req.user });
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
          res.cookie("usertoken", token, {
            expires: new Date(Date.now() + 86400000),
            Credential: true,
            sameSite: "none",
            secure: true,
            domain: ".sasanka-insta2-0.netlify.app",
            httpOnly: true,
          });
          res.status(200).json({ findUser });
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
  res.clearCookie("usertoken");
  res.status(200).json({ success: "success" });
});

module.exports = router;
