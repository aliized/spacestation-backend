const mongoose = require("mongoose");
const Yup = require("Yup");

//* Yup Schema
const postValidator = Yup.object().shape({
  body: Yup.string().required("لطفا محتوایی برای کامنت خود وارد کنید"), 
});

//* Mongoose Schema
const postSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "public",
    enum: ["private", "public"],
  },
});

//* add Yup validation method to mongoose statics
postSchema.statics.validation = function (body) {
  return postValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Comment", postSchema);
