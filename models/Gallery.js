//* gal= Gallery

const mongoose = require("mongoose");
const yup = require("yup");

//* yup Schema
const galleryValidator = yup.object().shape({
  photo: yup.object().shape({
    name: yup.string().required("عکس الزامی می باشد"),
    size: yup.number().max(10 * 1000000, "عکس نباید بیشتر از 10 مگابایت باشد"),
    mimetype: yup
      .mixed()
      .oneOf(
        ["image/jpeg", "image/png", "image/webp"],
        "تنها پسوندهای png و jpeg و webp پشتیبانی می شوند"
      ),
  }),
  alt: yup
    .string()
    .required("متن alt الزامی می باشد")
    .min(5, "متن alt نباید کمتر از 5 کارکتر باشد")
    .max(100, "متن alt نباید بیشتر از 100 کاراکتر باشد"),
  caption: yup.string().required("لطفا توضیحی درباره ی عکس وارد کنید"),
  aspectRatio: yup.number().required(),
  status: yup
    .mixed()
    .oneOf(
      ["private", "public"],
      "یکی از 2 وضعیت خصوصی یا عمومی را انتخاب کنید"
    ),
});

//* Mongoose Schema
const gallerySchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  caption: {
    type: String,
    required: true,
  },
  aspectRatio: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["private", "public"],
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

//* add yup validation method to mongoose statics
gallerySchema.statics.validation = function (body) {
  return galleryValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Gallery", gallerySchema);
