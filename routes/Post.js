const express = require("express");
const router = express.Router();
const Post = require("../Database/schema/Post");
const User = require("../Database/schema/User");
const jwt = require("jsonwebtoken");

// create a post ...

router.post("/", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const newPost = await new Post(req.body);
    let savePost = await newPost.save();

    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update post ...

router.put("/:id", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    let findPost = await Post.findById(req.params.id);

    if (findPost.userId === req.body.userId) {
      const updatePost = await findPost.updateOne({ $set: req.body });
      res.status(200).json({ success: "post has been updated" });
    } else {
      res.status(404).json({ error: "you can only update your post" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// likes the post ...

router.put("/:id/like", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    let findPost = await Post.findById(req.params.id);
    if (findPost.likes.includes(req.body.userId)) {
      await findPost.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ success: "disLike" });
    } else {
      await findPost.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ success: "Like" });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// comment on a post

router.put("/:id/comment", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log(req.body);
  try {
    let findPost = await Post.findById(req.params.id);
    await findPost.updateOne({ $push: { comments: req.body } });
    res.status(200).json({ success: "you comment on this post" });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// get a post ...

router.get("/:id", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    let findAPost = await Post.findById(req.params.id);
    if (findAPost) {
      res.status(200).json(findAPost);
    } else {
      res.status(404).json({ error: "No post exists " });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// get timeline post of user with his/her following users...

router.get("/:id/timeline", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    let currUser = await User.findById(req.params.id);
    let findAllPost = await Post.find({ userId: req.params.id });
    let followingUserPost = await Promise.all(
      currUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    res.status(200).json(findAllPost.concat(...followingUserPost));
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get user's all post and userData too ...

router.get("/:username/posts", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const getUser = await User.findOne({ userName: req.params.username });
  const getUserAllPost = await Post.find({ userId: getUser._id });

  res.status(200).json({ posts: getUserAllPost, userData: getUser });
});

// delete post ...

router.put("/:id/deletepost", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log(req.params.id, req.body.userId);
  try {
    let post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({ success: "post has been deleted" });
    } else {
      res.status(404).json({ error: "you can delete you post only" });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
