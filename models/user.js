const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;
const crypto = require("crypto");
// User schema
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String,
  profile: {
    name: {
      type: String,
      default: ""
    },
    picture: {
      type: String,
      default: ""
    },
    address: String
  },

  history: [
    {
      date: Date,
      paid: {
        type: Number,
        default: 0
      }
      // item: {
      //   type: Schema.Types.ObjectId,
      //   ref: ""
      // }
    }
  ]
});

// for hash the  password

UserSchema.pre("validate", function(next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// compare the password in the databse with the user type in the form
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return "https://gravatar.com/avatar/?s" + size + "&d=retro";
  let md5 = crypto
    .createHash("md5")
    .update(this.email)
    .digest("hex");
  return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};
module.exports = mongoose.model("User", UserSchema);
