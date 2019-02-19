const express = require("express");
const router = express.Router();
const User = require("../models/user");
let errorArray = [];
router.get("/signup", (req, res) => {
  res.render("accounts/signup", {
    errors: req.flash("errors"),
    errorArray
  });
});

router.post("/signup", function(req, res, next) {
  let user = new User();
  let { name, email, password, confirm } = req.body;
  if (!name || !email || !password || !confirm) {
    errorArray.push({ msg: "Please fill all the  entry" });
  }
  if (password.length < 6) {
    errorArray.push({ msg: "Password should be 6 digit long" });
  }
  if (password !== confirm) {
    errorArray.push({ msg: "Password are not matching" });
  }
  if (errorArray.length > 0) {
    res.redirect("/signup");
  } else {
    User.findOne({ email }, function(err, existingUser) {
      if (existingUser) {
        req.flash("errors", "This email is already exits");
        return res.redirect("/signup");
      } else {
        user.profile.name = name;
        user.email = email;
        user.password = password;
        user.save(function(err, user) {
          if (err) return next(err);
          res.json("New user has been created");
        });
      }
    });
  }
});

module.exports = router;
