const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Yup = require("yup");


userValidator = Yup.object().shape({
    username: Yup.string()
      .required("نام کاربری الزامی میباشد")
      .min(4, "نام کاربری نباید کمتر از 4 کاراکتر باشد")
      .max(50, "نام کاربری نباید بیشتر از 50 کاراکتر باشد"),
    email: Yup.string()
      .email("ایمیل معتبر نمی باشد")
      .required("ایمیل الزامی می باشد"),
    password: Yup.string()
      .min(8, "کلمه عبور نباید کمتر از 8 کاراکتر باشد")
      .max(40, "کلمه عبور نباید بیشتر از 40 کاراکتر باشد")
      .required("کلمه عبور الزامی می باشد"),
    confirmPassword: Yup.string()
      .required("تکرار کلمه عبور الزامی می باشد")
      .oneOf([Yup.ref("password"), null], "کلمه های عبور یکسان نیستند"),
  });


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "نام کاربری الزامی می باشد"],
        trim: true,
        unique: true,
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
        maxlength: 40,
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