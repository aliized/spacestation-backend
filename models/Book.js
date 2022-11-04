const mongoose = require("mongoose");
const Yup = require("Yup");

//* Yup Schema
const bookValidator = Yup.object().shape({
  name: Yup.string()
    .required("نام کتاب الزامی می باشد")
    .min(5, "نام کتاب نباید کمتر از 5 کارکتر باشد")
    .max(100, "نام کتاب نباید بیشتر از 100 کاراکتر باشد"),
  body: Yup.string().required("لطفا محتوایی درباره ی کتاب وارد کنید"),
  thumbnail: Yup.object().shape({
    name: Yup.string().required("عکس کتاب الزامی می باشد"),
    size: Yup.number().max(3000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
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
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
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
bookSchema.index({ name: "text" });

//* add Yup validation method to mongoose statics
bookSchema.statics.validation = function (body) {
  return bookValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Book", bookSchema);
