const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//routes
const mainRoutes = require("./routes/mainRoutes");
const user = require("./routes/user");
app.use(mainRoutes);
app.use(user);

mongoose.connect(
  "mongodb://root:abc123@ds141815.mlab.com:41815/amazon-clone",
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDB is connected");
    }
  }
);

const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
