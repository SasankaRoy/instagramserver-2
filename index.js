const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const port = 5000;
const multer = require("multer");
const path = require("path");
const Cookie = require("cookie-parser");

//env file
dotenv.config();

// dataBase connection here...

require("./Database/conn");
app.use("/image", express.static(path.join(__dirname, "public/images")));
// The routes imports here...

const User = require("./routes/user");
const UserLogin = require("./routes/auth");
const PostRoute = require("./routes/Post");
const Conversation = require("./routes/consersation");
const Message = require("./routes/message");

//  MiddleWare...

app.use(express.json());
app.use(helmet());
app.use(Cookie());
app.use(morgan("common"));
app.use("/api/user", User);
app.use("/api/auth", UserLogin);
app.use("/api/post", PostRoute);
app.use("/api/conversation", Conversation);
app.use("/api/message", Message);
app.get("/", (req, res) => {
  res.send("it is working bro yo");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("file uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

// listen to yhe server on port ...

app.listen(process.env.PORT || 5000, (err) => {
  if (err) console.log(err);
  console.log(`server running on the port `);
});
