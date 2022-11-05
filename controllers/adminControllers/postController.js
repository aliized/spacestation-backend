//* Create Post ✔️
//? Update Post ✔️
//! Delete Post ✔️

const fs = require("fs");
const path = require("path");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Post = require("../../models/Post");

exports.createPost = async (req, res, next) => {
  let thumbnail, parsedName, fileName, uploadPath;

  if (req.files.thumbnail) {
    thumbnail = req.files.thumbnail;
    parsedName = path.parse(thumbnail.name);
    fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
    uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
  }

  try {
    req.body = { ...req.body, thumbnail };

    await Post.validation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    await sharp(thumbnail.data)
      .jpeg({ quality: 100 })
      .toFile(uploadPath)
      .catch((err) => {
        throw err;
      });

    await Post.create({
      ...req.body,
      //user: req.userId,
      thumbnail: fileName,
    });

    res
      .status(201)
      .json({ message: `پست ${req.body.title} با موفقیت ساخته شد` });
  } catch (err) {
    next(err);
  }
};

exports.editPost = async (req, res, next) => {
  try {
    let thumbnail, parsedName, fileName, uploadPath;
    if (req.files.thumbnail) {
      thumbnail = req.files.thumbnail;
      parsedName = path.parse(thumbnail.name);
      fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
      uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
    }
    const post = await Post.findOne({ _id: req.params.id }).catch((err) => {
      err.statusCode = 404;
      err.message = "پستی با این شناسه یافت نشد";
      throw err;
    });

    await Post.validation({ ...req.body, thumbnail }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    if (false) {
      //if (post.user.toString() != req.userId) {
      const error = new Error("شما مجوز ویرایش این پست را ندارید");
      error.statusCode = 401;
      throw error;
    } else {
      if (req.files.thumbnail) {
        fs.unlink(
          `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
          async (err) => {
            if (err) {
              throw err;
            } else {
              await sharp(thumbnail.data)
                .jpeg({ quality: 100 })
                .toFile(uploadPath)
                .catch((err) => {
                  throw err;
                });
            }
          }
        );
      }
      const { title, status, body } = req.body;
      post.title = title;
      post.status = status;
      post.body = body;
      post.thumbnail = thumbnail.name ? fileName : post.thumbnail;

      await post.save();

      res
        .status(200)
        .json({ message: `پست ${req.body.title} با موفقیت ویرایش شد` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id).catch((err) => {
      err.statusCode = 404;
      err.message = "پستی با این شناسه یافت نشد";
      throw err;
    });

    const filePath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        const error = new Error("خطای در پاکسازی عکس پست مربوطه رخ داده است");
        error.statusCode = 400;
        throw error;
      } else {
        res
          .status(200)
          .json({ message: `پست ${req.body.title} با موفقیت حذف شد` });
      }
    });
  } catch (err) {
    next(err);
  }
};