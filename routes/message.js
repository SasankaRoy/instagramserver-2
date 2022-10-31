const router = require("express").Router();
const Message = require("../Database/schema/Messages");

// save/add sms...
router.post("/",async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    try {
        const newMessage = new Message(req.body);

        const saveMessage = await newMessage.save();
        res.status(200).json(saveMessage);
        
    } catch (error) {
        res.status(500).json({ error})
    }
})


// get sms

router.get('/:conversationId',async (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    try {
        const messages = await Message.find({
            conversationId:req.params.conversationId,
        });
        res.status(200).json({ messages})
    } catch (error) {
        res.status(500).json({ error})
    }
})
module.exports = router;