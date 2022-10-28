const express = require("express");
const router = express.Router();
const User = require("../Database/schema/User");
const Crypto = require("crypto-js");

// update user

router.put("/:id", async (req, res) => {
  if (req.body.userid === req.params.id) {
    if (req.body.password) {
      try {
        req.body.password = Crypto.AES.encrypt(
          req.body.password,
          process.env.SECRET_KEY
        ).toString();
      } catch (e) {
        return res.status(404).json(e);
      }
    }
    try {
      const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res
        .status(200)
        .json({ success: "Account has been updated successfully" });
    } catch (error) {
      res.status(404).json(error);
    }
  } else {
    return res.status(400).json({ error: "you can update only your account" });
  }
});

// get user

router.get("/:id", async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(200).json(getUser);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/:username/user", async (req, res) => {
  try {
    console.log(req.params.username);
    const getUser = await User.find({ userName: req.params.username });
    res.status(200).json({ friends: getUser });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get friends

router.get("/friend/:userId/following", async (req, res) => {
  try {
    const findUser = await User.findById(req.params.userId);
    let findFriends = await Promise.all(
      findUser.following.map((uId) => {
        return User.findById(uId);
      })
      );
      let friendLists = [];
      findFriends.map((Fdata) => {
        console.log(Fdata);
        let { _id, userName, profilePicture } = Fdata;
        friendLists.push({ _id, userName, profilePicture });
      });
      res.status(200).json(friendLists);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/friend/:userId/follower", async (req, res) => {
  try {
    const findUser = await User.findById(req.params.userId);
    let findFriends = await Promise.all(
      findUser.followers.map((uId) => {
        return User.findById(uId);
      })
      );
      let friendLists = [];
      findFriends.map((Fdata) => {
        console.log(Fdata);
        let { _id, userName, profilePicture } = Fdata;
        friendLists.push({ _id, userName, profilePicture });
      });
      res.status(200).json(friendLists);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
// follow user

router.put("/:id/follow", async (req, res) => {
  try {
    if (req.body.userId === req.params.id)
      return res.status(404).json({ error: "you cannot follow yourself !!" });
    else {
      let userIsFollowed = await User.findById(req.params.id);
      let userIsFollowing = await User.findById(req.body.userId);

      if (userIsFollowed.followers.includes(req.body.userId)) {
        return res
          .status(400)
          .json({ message: "you already follow this user" });
      } else {
        await userIsFollowed.updateOne({
          $push: { followers: req.body.userId },
        });
        await userIsFollowing.updateOne({
          $push: { following: req.params.id },
        });
        res.status(200).json(` you are following ${userIsFollowed.userName} `);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// unfollow user

router.put("/:id/unfollow", async (req, res) => {
  try {
    let userIsUnFollowed = await User.findById(req.params.id);
    let userIsUnFollowing = await User.findById(req.body.userId);
    if (!userIsUnFollowed.followers.includes(req.body.userId))
      return res.status(404).json({ error: "you are not following this user" });
    else {
      await userIsUnFollowed.updateOne({
        $pull: { followers: req.body.userId },
      });
      await userIsUnFollowing.updateOne({
        $pull: { following: req.params.id },
      });
      res
        .status(200)
        .json({ success: `you unfollow ${userIsUnFollowed.userName}` });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete user

router.put("/:id/delete", async (req, res) => {
  console.log(req.body.userid);
  if (req.body.userid === req.params.id) {
    try {
      const updateUser = await User.deleteOne({ _id: req.params.id });
      console.log(updateUser);
      res
        .status(200)
        .json({ success: "Account has been deleted successfully" });
    } catch (error) {
      res.status(404).json(error);
    }
  } else {
    return res.status(400).json({ error: "you can delete only your account" });
  }
});

module.exports = router;
