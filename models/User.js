const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Yup = require("yup");


userValidator = Yup.object().shape({
    fullName: Yup.string()
      .required("نام شما الزامی میباشد")
      .min(2, "نام شما نباید کمتر از 2 کاراکتر باشد")
      .max(50, "نام شما نباید بیشتر از 50 کاراکتر باشد"),
    email: Yup.string()
      .email("ایمیل معتبر نمی باشد")
      .required("ایمیل الزامی می باشد"),
    password: Yup.string()
      .min(8, "کلمه عبور نباید کمتر از 8 کاراکتر باشد")
      .max(40, "کلمه عبور نباید بیشتر از 40 کاراکتر باشد")
      .required("کلمه عبور الزامی می باشد"),
    confirmPassword: Yup.string()
      .required("تکرار کلمه عبور الزامی می باشد")
      .oneOf([Yup.ref("password"), null], "کلمه ی عبور و تکرار آن یکسان نیستند"),
  });


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "نام شما الزامی می باشد"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255,
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