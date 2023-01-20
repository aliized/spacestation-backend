//% GET HomePageIndex
//% GET Index ✔️
//% GET post ✔️
//% GET movies ✔️
//% GET books ✔️
//% GET gallery ✔️
//* POST Comment ✔️
//? PUT Comment ✔️
//! DELETE Comment ✔️
//% GET Comments

const mongoose = require("mongoose");
const appRoot = require("app-root-path");
const modelsPath = `${appRoot}/models`;

//const captchapng = require("captchapng");
const Posts = require(`${modelsPath}/Post`);
const Movies = require(`${modelsPath}/Movie`);
const Books = require(`${modelsPath}/Book`);
const Gallery = require(`${modelsPath}/Gallery`);
const Comment = require(`${modelsPath}/Comment`);
//const { sendEmail } = require("../utils/mailer");

let CAPTCHA_NUM;

exports.getIndex = async (req, res, next) => {
  try {
    const numberOfPosts = await Posts.find({
      status: "public",
    }).countDocuments();

    let posts = await Posts.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!posts) {
      const error = new Error("هیچ پستی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }
    // posts.forEach((post) => {
    //   post.body = post.body.split(" ").slice(0, 180).join(" ");
    // });

    res.status(200).json({ posts, total: numberOfPosts });
  } catch (err) {
    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    let post;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      post = await Posts.findOne({
        _id: req.params.id,
        status: "public",
      });
    } else {
      post = false;
    }
    //???????? .populate(
    //     "user"
    // );

    if (!post) {
      const error = new Error("پستی با این شناسه یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const numberOfMovies = await Movies.find({
      status: "public",
    }).countDocuments();

    const movies = await Movies.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!movies) {
      const error = new Error("هیچ فیلمی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ movies, total: numberOfMovies });
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const numberOfBooks = await Books.find({
      status: "public",
    }).countDocuments();

    const books = await Books.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!books) {
      const error = new Error("هیچ فیلمی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ books, total: numberOfBooks });
  } catch (err) {
    next(err);
  }
};

exports.getGallery = async (req, res, next) => {
  try {
    const totalPhotos = await Gallery.find({
      status: "public",
    }).countDocuments();

    const gallery = await Gallery.find({ status: "public" }).sort({
      // aspectRatio: "asc",
      createdAt: "desc",
    });

    if (!gallery) {
      const error = new Error("هیچ عکسی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ gallery, total: totalPhotos });
  } catch (err) {
    next(err);
  }
};

//% COMMENTS CONTROLLERS

exports.createComment = async (req, res, next) => {
  try {
    await Comment.validation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = req.user._id;
    // console.log(req.body);
    await Comment.create({ ...req.body, user });

    res.status(201).json({ message: `کامنت جدید با موفقیت اضافه شد` });
  } catch (err) {
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id }).catch(
      (err) => {
        err.statusCode = 404;
        err.message = "کامنتی با این شناسه یافت نشد";
        throw err;
      }
    );

    await Comment.validation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    if (false) {
      //if (comment.user.toString() != req.userId) {
      const error = new Error("شما مجوز ویرایش این کامنت را ندارید");
      error.statusCode = 401;
      throw error;
    } else {
      comment.body = req.body.body;
      await comment.save();

      res.status(200).json({ message: `کامنت شما با موفقیت ویرایش شد` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndRemove(req.params.id).catch(
      (err) => {
        err.statusCode = 404;
        err.message = "کامنتی با این شناسه یافت نشد";
        throw err;
      }
    );

    res.status(200).json({ message: `کامنت شما با موفقیت حذف شد` });
  } catch (err) {
    next(err);
  }
};


exports.getComments = async (req, res, next) => {
  // console.log(req.params.postId)
  try {
    const numberOfComments = await Comment.find({
      status: "public",
      post: req.params.postId,
    }).countDocuments();

    const comments = await Comment.find({
      status: "public",
      post: req.params.postId,
    }).sort({
      createdAt: "desc",
    });


    if (!comments) {
      const error = new Error("هیچ کامنتی برای این پست ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ comments, total: numberOfComments });
  } catch (err) {
    next(err);
  }
};
