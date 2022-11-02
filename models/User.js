const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Yup = require("yup");


userValidator = Yup.object().shape({
    username: Yup.string()
      .required("نام کاربری الزامی میباشد")
      .min(4, "کوتاه")
      .max(50, "بلند"),
    email: Yup.string()
      .email("ایمیل معتبر نمی باشد")
      .required("ایمیل الزامی می باشد"),
    password: Yup.string()
      .min(4, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
      .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد")
      .required("کلمه عبور الزامی می باشد"),
    confirmPassword: Yup.string()
      .required("تکرار کلمه عبور الزامی می باشد")
      .oneOf([Yup.ref("password"), null], "کلمه های عبور یکسان نیستند"),
  });


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "نام و نام خانوادگی الزامی می باشد"],
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
        minlength: 4,
        maxlength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

  

userSchema.statics.userValidation = function (body) {
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