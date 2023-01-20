//* Create User POST /register
//? Update User PUT
//! Delete User DELETE
//? POST login
//? POST forgetpass
//? POST resetpass/:TOKEN

const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../utils/mailer");

const makeToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

exports.register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  try {
    //* check user available
    const userExists = await User.exists({ email });
    if (userExists) {
      const error = new Error("کاربری با این ایمیل در پایگاه داده موجود است");
      error.statusCode = 422;
      throw error;
    }

    //* validate data
    await User.validation(req.body);

    const registeredUserCount = await User.count();
    if (registeredUserCount === 0) {
    }

    //* create user
    const user = await User.create({
      fullName,
      email,
      password,
      // phone,
      role: registeredUserCount > 0 ? "USER" : "ADMIN",
    });
    sendEmail(email, fullName, "به ایستگاه فضایی خوش اومدی", "ایستگاه فضایی");

    //* get user from database
    const userObject = user.toObject();
    Reflect.deleteProperty(userObject, "password");

    //* make token
    const token = makeToken(user._id);

    //* pass data
    res
      .status(201)
      .json({ token, user: userObject, message: "عضویت موفقیت آمیز بود" });
  } catch (err) {
    next(err);
  }
};

exports.handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //* check if user available
    const user = await User.findOne({ email }).lean();
    if (!user) {
      const error = new Error("کاربری با این ایمیل یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    //* check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("کلمه عبور اشتباه است");
      error.statusCode = 422;
      throw error;
    }

    //* delete user password and pass data
    Reflect.deleteProperty(user, "password");

    //* make token
    const token = makeToken(user._id);

    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  
  return res.status(200).json(req.user);
};

exports.handleForgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("کاربری با ایمیل در پایگاه داده ثبت نشده");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;

    sendEmail(
      user.email,
      user.fullName,
      "SpaceStation | فراموشی رمز عبور",
      `
        جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید
        <a href="${resetLink}">تغییر رمز عبور</a>
    `
    );

    res.status(200).json({
      message: "لینک تغییر رمز عبور به ایمیل شما ارسال شد",
    });
  } catch (err) {
    next(err);
  }
};

exports.handleResetPassword = async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error("شما مجوز این عملیات را ندارید");
      error.statusCode = 401;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error("کلمه های عبور یکسان نمی باشند");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findOne({ _id: decodedToken.userId });

    if (!user) {
      const error = new Error("کاربری با این شناسه در پایگاه داده یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "عملیات با موفقیت انجام شد" });
  } catch (err) {
    next(err);
  }
};
