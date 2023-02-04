const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const yup = require("yup");

userValidator = yup.object().shape({
  profilePic: yup.object().shape({
    name: yup.string(),
    size: yup.number().max(10 * 1000000, "عکس نباید بیشتر از 10 مگابایت باشد"),
    mimetype: yup
      .mixed()
      .oneOf(
        ["image/jpeg", "image/png", "image/webp"],
        "تنها پسوندهای png و jpeg و webp پشتیبانی می شوند"
      ),
  }),
  fullName: yup
    .string()
    .required("نام شما الزامی میباشد")
    .max(50, "نام شما نباید بیشتر از 50 کاراکتر باشد"),
  email: yup
    .string()
    .trim()
    .email("ایمیل معتبر نمی باشد")
    .required("ایمیل الزامی می باشد"),
  password: yup
    .string()
    .min(8, "کلمه عبور نباید کمتر از 8 کاراکتر باشد")
    .max(40, "کلمه عبور نباید بیشتر از 40 کاراکتر باشد")
    .required("کلمه عبور الزامی می باشد"),
  confirmPassword: yup
    .string()
    .required("تکرار کلمه عبور الزامی می باشد")
    .oneOf([yup.ref("password"), null], "کلمه ی عبور و تکرار آن یکسان نیستند"),
  role: yup.mixed().oneOf(["ADMIN", "CONTENTMANAGER", "USER"]),
});

const userSchema = new mongoose.Schema({
  profilePic: {
    type: String,
    default: "defaultPic.webp",
  },
  fullName: {
    type: String,
    required: [true, "نام شما الزامی می باشد"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  role: {
    type: String,
    default: "USER",
    enum: ["ADMIN", "CONTENTMANAGER", "USER"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.validation = function (body) {
  return userValidator.validate(body, { abortEarly: false });
};

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
