const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const passportConf = require("../config/passport");
const { ensureAuthenticated } = require("../config/auth");
router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("accounts/login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlush: true
  })
);

router.get("/profile", ensureAuthenticated, function(req, res, next) {
  console.log(req.user);
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);
    res.render("accounts/profile", {
      user
    });
  });
});

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
        user.profile.picture = user.gravatar();
        user.save(function(err, user) {
          if (err) return next(err);
          req.logIn(user, err => {
            if (err) return next(err);
            req.flash(
              "signMsg",
              `Welcome ${user.profile.name}.You are registered!!`
            );
            return res.redirect("/");
          });
        });
      }
    });
  }
});
router.get("/logout", (req, res) => {
  req.logout();
  return res.redirect("/");
});

router.get("/edit-profile", ensureAuthenticated, function(req, res, next) {
  res.render("accounts/edit-profile", { message: req.flash("success") });
});

router.post("/edit-profile", ensureAuthenticated, function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.profile.address = req.body.address;
    console.log(user.profile.address);
    user.save(function(err) {
      if (err) return next(err);
      req.flash("success", "Successfully Edited your profile");
      return res.redirect("/edit-profile");
    });
  });
});

module.exports = router;
