const User = require("../models/User");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const {
  isFileTypeSupported,
  uploadImageToCloudinary,
} = require("../utils/ImageUploader");
const sendToken = require("../utils/sendToken");

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword, subscribedDailyDigest=true } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("Please enter all the required fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Both the passwords must be the same", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    password,
    profileImage: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    subscribedDailyDigest,
    isActive: true,
    isDeleted: false,
  });
  
  sendToken(user, 201, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all the required fields", 400));
  }

  let user = await User.findOne({ email, isActive: true, isDeleted: false }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }
  user.password= null;

  sendToken(user, 200, res);
});

// exports.logout = catchAsyncErrors(async (_, res) => {
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     success: true,
//     message: "Logged Out",
//   });
// });

exports.getAllUsers = catchAsyncErrors(async (_, res) => {
    const users = await User.find({ isActive: true, isDeleted: false }).select("_id firstName lastName");
    res.status(200).json({
      success: true,
      users,
    });
});

exports.getUserById = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      success: true,
      user,
    });
})

exports.updateUserProfile = catchAsyncErrors(async (req, res) => {
  const { firstName, lastName, email, mobile, subscribedDailyDigest }= req.body;
  if(!firstName || !lastName || !email){
    return next(new ErrorHandler("Please enter all the required details",401));
  }

  let profileImage = req.files? req.files.profileImage : null;
  if(profileImage){
    const supportedTypes = ["jpg", "jpeg", "png", "svg"];
    if (!isFileTypeSupported(profileImage.name, supportedTypes)) {
      return next(new ErrorHandler("Unsupported file format.", 400));
    }
    profileImage= await uploadImageToCloudinary(profileImage,process.env.CLOUDINARY_PROFILE_FOLDER_NAME)
  }

  const user = await User.findByIdAndUpdate(req.params.id, {
    firstName,
    lastName,
    email,
    mobile,
    profileImage,
    subscribedDailyDigest
  })

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data:user,
  });
})






