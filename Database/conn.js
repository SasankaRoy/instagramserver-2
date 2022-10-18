const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("dataBase is connected  yoo !");
  })
  .catch((err) => {
    console.log(err);
  });
