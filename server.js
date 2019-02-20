const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const secret = require("./config/secret");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "Himanshu sharma",
    store: new MongoStore({
      url: secret.database,
      autoReconnect: true
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.signMsg = req.flash("signMsg");
  next();
});

//routes
const mainRoutes = require("./routes/mainRoutes");
const user = require("./routes/user");
app.use(mainRoutes);
app.use(user);

mongoose.connect(
  secret.database,
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
