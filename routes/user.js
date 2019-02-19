const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("accounts/signup");
});

router.post("/signup", function(req, res, next) {
  let user = new User();
  let { name, email, password } = req.body;
  User.findOne({ email }, function(err, existingUser) {
    if (existingUser) {
      console.log(email + " is already exits");
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
});

module.exports = router;
