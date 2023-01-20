const mongoose = require("mongoose");
const yup = require("yup");

//* yup Schema
const commentValidator = yup.object().shape({
  body: yup.string().required("لطفا محتوایی برای کامنت خود وارد کنید"),
});

//* Mongoose Schema
const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Post"
  },
  user: {
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

//* add yup validation method to mongoose statics
commentSchema.statics.validation = function (body) {
  return commentValidator.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Comment", commentSchema);
