const { Router } = require("express");

const userController = require("../controllers/publicControllers/userController");
const { authenticated } = require("../middlewares/auth");

const router = new Router();

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register", userController.register);

//  @desc   Login Handle
//  @route  POST /users/login
router.post("/login", userController.handleLogin);

//  @desc   Handle Forget Password
//  @route  POST /users/forget-password
router.post("/forget-password", userController.handleForgetPassword);

//  @desc   Handle reset Password
//  @route  POST /users/reset-password/:token
router.post("/reset-password/:token", userController.handleResetPassword);

// @desc    Change Profile Pic
// @route   POST /users/edit-profilepic
router.post("/edit-profilepic", authenticated, userController.editProfilePic);

// @desc    Change Full Name
// @route   POST /users/edit-fullname
router.put("/edit-fullname", authenticated, userController.editFullName);

//  @desc   authCheck
//  @route  POST /users/auth
router.post("/auth", authenticated, userController.getUser);

module.exports = router;
