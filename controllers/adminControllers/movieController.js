//* Create Movie ✔️
//? Update Movie ✔️
//! Delete Movie ✔️

const fs = require("fs");
const path = require("path");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Movie = require("../../models/Movie");

exports.createMovie = async (req, res, next) => {
  try {
    let thumbnail, parsedName, fileName, uploadPath;

    if (req.files && req.files.thumbnail) {
      thumbnail = req.files.thumbnail;
      parsedName = path.parse(thumbnail.name);
      fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
      uploadPath = `${appRoot}/public/img/movies/${fileName}`;
    }
    req.body = { ...req.body, thumbnail };

    await Movie.validation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    await sharp(thumbnail.data)
      .jpeg({ quality: 100 })
      .toFile(uploadPath)
      .catch((err) => {
        throw err;
      });

    await Movie.create({
      ...req.body,
      //user: req.userId,
      thumbnail: fileName,
    });

    res
      .status(201)
      .json({ message: `فیلم ${req.body.name} با موفقیت اضافه شد` });
  } catch (err) {
    next(err);
  }
};

exports.editMovie = async (req, res, next) => {
  try {
    let thumbnail, parsedName, fileName, uploadPath;
    if (req.files && req.files.thumbnail) {
      thumbnail = req.files.thumbnail;
      parsedName = path.parse(thumbnail.name);
      fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
      uploadPath = `${appRoot}/public/img/movies/${fileName}`;
    }

    const movie = await Movie.findOne({ _id: req.params.id }).catch((err) => {
      err.statusCode = 404;
      err.message = " فیلمی با این شناسه یافت نشد";
      throw err;
    });

    await Movie.validation({ ...req.body, thumbnail }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    if (false) {
      //if (movie.user.toString() != req.userId) {
      const error = new Error("شما مجوز ویرایش این  فیلم را ندارید");
      error.statusCode = 401;
      throw error;
    } else {
      if (req.files && req.files.thumbnail) {
        fs.unlink(
          `${appRoot}/public/img/movies/${movie.thumbnail}`,
          async (err) => {
            if (err) throw err;
            else {
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
      const { name, directors, writers, actors, status, body } = req.body;

      movie.name = name;
      movie.directors = directors;
      movie.writers = writers;
      movie.actors = actors;
      movie.status = status;
      movie.body = body;
      movie.thumbnail = thumbnail.name ? fileName : movie.thumbnail;

      await movie.save();

      res
        .status(200)
        .json({ message: `فیلم ${req.body.name} با موفقیت ویرایش شد` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id).catch((err) => {
      err.statusCode = 404;
      err.message = " فیلمی با این شناسه یافت نشد";
      throw err;
    });

    const filePath = `${appRoot}/public/img/movies/${movie.thumbnail}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        const error = new Error("خطای در حذف عکس فیلم مربوطه رخ داده است");
        error.statusCode = 400;
        throw error;
      } else {
        res
          .status(200)
          .json({ message: `فیلم ${movie.name} با موفقیت پاک شد` });
      }
    });
  } catch (err) {
    next(err);
  }
};
