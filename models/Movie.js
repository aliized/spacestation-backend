const mongoose = require("mongoose");
const Yup = require("Yup");

//* Yup Schema
const movieValidator = Yup.object().shape({
  name: Yup.string()
    .required("نام فیلم الزامی می باشد")
    .min(5, "نام فیلم نباید کمتر از 5 کارکتر باشد")
    .max(100, "نام فیلم نباید بیشتر از 100 کاراکتر باشد"),
  body: Yup.string().required("لطفا محتوایی درباره ی فیلم وارد کنید"),
  thumbnail: Yup.object().shape({
    name: Yup.string().required("عکس فیلم الزامی می باشد"),
    size: Yup.number().max(3 * 1000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
    mimetype: Yup.mixed().oneOf(
      ["image/jpeg", "image/png"],
      "تنها پسوندهای png و jpeg پشتیبانی می شوند"
    ),
  }),
  status: Yup.mixed().oneOf(
    ["private", "public"],
    "یکی از 2 وضعیت خصوصی یا عمومی را انتخاب کنید"
  ),
});

//* Mongoose Schema
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  directors: {
    type: String,
    required: true,
  },
  writers: {
    type: String,
    required: true,
  },
  Actors: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["private", "public"],
  },
  thumbnail: {
    type: String,
    required: true,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//* for search indexing e125
movieSchema.index({ name: "text" });

//* add Yup validation method to mongoose statics
movieSchema.statics.validation = function (body) {
  return movieValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Movie", movieSchema);
