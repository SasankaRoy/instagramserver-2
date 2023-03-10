const router = require("express").Router();
const Conversation = require("../Database/schema/conversation");

// new conversation...

router.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const newConversation = new Conversation({
      member: [req.body.senderId, req.body.receiverId],
    });
    let saveConversation = await newConversation.save();
    res.status(200).json(saveConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get conversation of a user...

router.get("/:userId", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const conversation = await Conversation.find({
      member: { $in: [req.params.userId] },
    });
    res.status(200).json({ conversation });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
