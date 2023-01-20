const mongoose = require("mongoose");
const yup = require("yup");

//* yup Schema
const postValidator = yup.object().shape({
  title: yup.string()
    .required("عنوان پست الزامی می باشد")
    .min(5, "عنوان پست نباید کمتر از 5 کارکتر باشد")
    .max(100, "عنوان پست نباید بیشتر از 100 کاراکتر باشد"),
  body: yup.string().required("لطفا محتوایی برای پست وارد کنید"),
  thumbnail: yup.object().shape({
    name: yup.string().required("عکس پست الزامی می باشد"),
    size: yup.number().max(3000000, "عکس نباید بیشتر از 3 مگابایت باشد"),
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
const postSchema = new mongoose.Schema({
  title: {
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
postSchema.index({ title: "text" });

//* add yup validation method to mongoose statics
postSchema.statics.validation = function (body) {
  return postValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Post", postSchema);
