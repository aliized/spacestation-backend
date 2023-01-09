const { Router } = require("express");

const userController = require("../controllers/publicControllers/userController");

const router = new Router();



//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register", userController.createUser);

//  @desc   Login Handle
//  @route  POST /users/login
router.post("/login", userController.handleLogin);

//  @desc   Handle Forget Password
//  @route  POST /users/forget-password
router.post("/forget-password", userController.handleForgetPassword);

//  @desc   Handle reset Password
//  @route  POST /users/reset-password/:token
router.post("/reset-password/:token", userController.handleResetPassword);

module.exports = router;
