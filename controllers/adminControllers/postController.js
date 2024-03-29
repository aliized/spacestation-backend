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

  if (req.files && req.files.thumbnail) {
    thumbnail = req.files.thumbnail;
    parsedName = path.parse(thumbnail.name);
    fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
    uploadPath = `${appRoot}/public/img/blog/${fileName}`;
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
      user: req.userId,
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
    if (req.files && req.files.thumbnail) {
      thumbnail = req.files.thumbnail;
      parsedName = path.parse(thumbnail.name);
      fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
      uploadPath = `${appRoot}/public/img/blog/${fileName}`;
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
      if (req.files && req.files.thumbnail) {
        fs.unlink(
          `${appRoot}/public/img/blog/${post.thumbnail}`,
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

    const filePath = `${appRoot}/public/img/blog/${post.thumbnail}`;

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

// const fs = require("fs");
// const path = require("path");

// // const multer = require("multer");
// const sharp = require("sharp");
// const shortId = require("shortid");
// const appRoot = require("app-root-path");

// const Post = require("../models/Post");
// const Movie = require("../models/Movie");
// //const { fileFilter } = require("../utils/multer");

// // exports.uploadImage = (req, res) => {
// //   const upload = multer({
// //     limits: { fileSize: 4000000 },
// //     fileFilter: fileFilter,
// //   }).single("image");

// //   upload(req, res, async (err) => {
// //     if (err) {
// //       if (err.code === "LIMIT_FILE_SIZE") {
// //         return res.status(422).json({
// //           error: "حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد",
// //         });
// //       }
// //       res.status(400).json({ error: err });
// //     } else {
// //       if (req.files.thumbnail) {
// //         const fileName = `${shortId.generate()}_${req.files.image.name}`;
// //         await sharp(req.files.image.data)
// //           .jpeg({
// //             quality: 100,
// //           })
// //           .toFile(`./public/uploads/${fileName}`)
// //           .catch((err) => console.log(err));
// //         res.status(200).json({
// //           image: `http://localhost:3000/uploads/${fileName}`,
// //         });
// //       } else {
// //         res.status(400).json({
// //           error: "جهت آپلود باید عکسی انتخاب کنید",
// //         });
// //       }
// //     }
// //   });
// // };
