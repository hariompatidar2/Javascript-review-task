const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      maxlength: [30, "First name can not exceed 30 characters"],
      minlength: [2, "First name can not be less than 2 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
      maxlength: [30, "Last name can not exceed 30 characters"],
      minlength: [2, "Last name can not be less than 2 characters"],
      trim: true,
    }, 
    email: {
      type: String,
      required: [true, "Please enter your email"],
      maxlength: [30, "Email can not exceed 30 characters"],
      minlength: [2, "Email can not be less than 2 characters"],
      trim: true,
      unique: true,
      index: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      select: false,
    },
    profileImage: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      maxlength: [10, "Mobile number can not exceed 10 characters"],
      minlength: [10, "Mobile number can not be less than 10 characters"],
      trim: true,
      validate: [validator.isMobilePhone, "Please enter a valid mobile number"],
    },
    subscribedDailyDigest:{
      type:Boolean,
      default:true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash the password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare the password with the hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

// generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetPasswordToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetPasswordToken;
};

module.exports= mongoose.model("User",userSchema);
