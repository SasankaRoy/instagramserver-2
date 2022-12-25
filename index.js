const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const port = 5000;
const CORS = require("cors");
const multer = require("multer");
const path = require("path");
const Cookie = require("cookie-parser");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);

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

const store = new mongoSession({
  uri: process.env.MONGO_URL,
  collection: "mySessions",
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store,

    maxAge: 86400000,
    cookie: {
      expires: new Date(Date.now() + 86400000),
      domain: "https://insta2-o.vercel.app",
      secure: true,
      httpOnly: true,
      path: "https://insta2-o.vercel.app",
    },
  })
);

app.use(express.json());
app.use(helmet());
app.use(Cookie());
app.use(morgan("common"));
app.use(
  CORS({
    // origin: "https://sasanka-insta2-0.netlify.app",
    origin: "https://insta2-o.vercel.app",
    // origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/user", User);
app.use("/api/auth", UserLogin);
app.use("/api/post", PostRoute);
app.use("/api/conversation", Conversation);
app.use("/api/message", Message);
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
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
  res.header("Access-Control-Allow-Origin", "*");
  try {
    return res.status(200).json("file uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

// listen to yhe server on port ...

app.listen(process.env.PORT || 5000, (err) => {
  if (err) console.log(err);
  console.log(`server running on the port${port} `);
});
