//% GET HomePageIndex
//% GET Index ✔️
//% GET post ✔️
//% GET movies ✔️
//% GET books ✔️
//% GET gallery ✔️
//* POST Comment
//? PUT Comment
//! DELETE Comment
//% GET Comments


const Yup = require("yup");
//const captchapng = require("captchapng");
const Posts = require("../../models/Post");
const Movies = require('../../models/Movie');
const Books = require('../../models/Book');
const Gallery = require('../../models/Gallery');
//const { sendEmail } = require("../utils/mailer");

let CAPTCHA_NUM;




exports.getIndex = async (req, res, next) => {
  try {
    const numberOfPosts = await Posts.find({
      status: "public",
    }).countDocuments();

    const posts = await Posts.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!posts) {
      const error = new Error("هیچ پستی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ posts, total: numberOfPosts });
  } catch (err) {
    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Posts.findOne({ _id: req.params.id, status: "public" });
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
    const numberOfGallery = await Gallery.find({
      status: "public",
    }).countDocuments();

    const gallery = await Gallery.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!gallery) {
      const error = new Error("هیچ فیلمی در پایگاه داده ثبت نشده است");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ gallery, total: numberOfGallery });
  } catch (err) {
    next(err);
  }
};