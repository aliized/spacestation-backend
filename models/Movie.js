const mongoose = require("mongoose");
const yup = require("yup");

//* yup Schema
const movieValidator = yup.object().shape({
  name: yup.string()
    .required("نام فیلم الزامی می باشد")
    .min(5, "نام فیلم نباید کمتر از 5 کارکتر باشد")
    .max(100, "نام فیلم نباید بیشتر از 100 کاراکتر باشد"),

  body: yup.string().required("لطفا محتوایی درباره ی فیلم وارد کنید"),
  directors: yup.string().required("نام کارگردان الزامی می باشد"),

  writers: yup.string().required("نام نویسندگان الزامی می باشد"),

  actors: yup.string().required("نام بازیگران الزامی می باشد"),

  thumbnail: yup.object().shape({
    name: yup.string().required("عکس فیلم الزامی می باشد"),
    size: yup.number().max(3 * 1000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
    mimetype: yup.mixed().oneOf(
      ["image/jpeg", "image/png", "image/webp"],
      "تنها پسوندهای png و jpeg و webp پشتیبانی می شوند"
    ),
  }),

  status: yup.mixed().oneOf(
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
  actors: {
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//* for search indexing e125
movieSchema.index({ name: "text" });

//* add yup validation method to mongoose statics
movieSchema.statics.validation = function (body) {
  return movieValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Movie", movieSchema);
