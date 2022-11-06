//* gal= Gallery

const mongoose = require("mongoose");
const Yup = require("Yup");

//* Yup Schema
const galleryValidator = Yup.object().shape({
  photo: Yup.object().shape({
    name: Yup.string().required("عکس الزامی می باشد"),
    size: Yup.number().max(10 * 1000000, "عکس نباید بیشتر از 10 مگابایت باشد"),
    mimetype: Yup.mixed().oneOf(
      ["image/jpeg", "image/png"],
      "تنها پسوندهای png و jpeg پشتیبانی می شوند"
    ),
  }),
  photoAlt: Yup.string()
    .required("متن alt الزامی می باشد")
    .min(5, "متن alt نباید کمتر از 5 کارکتر باشد")
    .max(100, "متن alt نباید بیشتر از 100 کاراکتر باشد"),
  photoDesc: Yup.string().required("لطفا توضیحی درباره ی عکس وارد کنید"),

  status: Yup.mixed().oneOf(
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
  photoAlt: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  photoDesc: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["private", "public"],
  },

  //   user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//* add Yup validation method to mongoose statics
gallerySchema.statics.validation = function (body) {
  return galleryValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Gallery", gallerySchema);
