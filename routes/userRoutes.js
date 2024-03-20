const express= require('express');
const { register, login, getAllUsers, getUserById, updateUserProfile } = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middleware/auth');
const router= express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getAllUsers").get(isAuthenticatedUser,getAllUsers);
router.route("/getUser/:id").get(isAuthenticatedUser,getUserById)
router.route("/updateUserProfile").post(isAuthenticatedUser,updateUserProfile)


module.exports=router;