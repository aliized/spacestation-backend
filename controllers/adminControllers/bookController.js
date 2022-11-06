//* Create Book ✔️
//? Update Book ✔️
//! Delete Book ✔️

const fs = require("fs");
const path = require("path");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Book = require("../../models/Book");

exports.createBook = async (req, res, next) => {
  let thumbnail, parsedName, fileName, uploadPath;
 

  if (req.files && req.files.thumbnail) {
    thumbnail = req.files.thumbnail;
    parsedName = path.parse(thumbnail.name);
    fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
    uploadPath = `${appRoot}/public/img/books/${fileName}`;
  }
  try {
    req.body = { ...req.body, thumbnail };

    await Book.validation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    await sharp(thumbnail.data)
      .jpeg({ quality: 100 })
      .toFile(uploadPath)
      .catch((err) => {
        throw err;
      });

    await Book.create({
      ...req.body,
      //user: req.userId,
      thumbnail: fileName,
    });

    res
      .status(201)
      .json({ message: `کتاب ${req.body.name} با موفقیت اضافه شد` });
  } catch (err) {
    next(err);
  }
};

exports.editBook = async (req, res, next) => {
  try {
    let thumbnail, parsedName, fileName, uploadPath;
    if (req.files && req.files.thumbnail) {
      thumbnail = req.files.thumbnail;
      parsedName = path.parse(thumbnail.name);
      fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
      uploadPath = `${appRoot}/public/img/books/${fileName}`;
    }

    const book = await Book.findOne({ _id: req.params.id }).catch((err) => {
      err.statusCode = 404;
      err.message = "کتابی با این شناسه یافت نشد";
      throw err;
    });

    await Book.validation({ ...req.body, thumbnail }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    if (false) {
      //if (book.user.toString() != req.userId) {
      const error = new Error("شما مجوز ویرایش این کتاب را ندارید");
      error.statusCode = 401;
      throw error;
    } else {
      if (req.files && req.files.thumbnail) {
        fs.unlink(
          `${appRoot}/public/img/books/${book.thumbnail}`,
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
      const { name,writer, status, body } = req.body;
      book.name = name;
      book.writer = writer;
      book.status = status;
      book.body = body;
      book.thumbnail = thumbnail.name ? fileName : book.thumbnail;

      await book.save();

      res
        .status(200)
        .json({ message: `کتاب ${req.body.name} با موفقیت ویرایش شد` });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id).catch((err) => {
      err.statusCode = 404;
      err.message = "کتابی با این شناسه یافت نشد";
      throw err;
    });

    const filePath = `${appRoot}/public/img/books/${book.thumbnail}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        const error = new Error("خطای در حذف عکس کتاب مربوطه رخ داده است");
        error.statusCode = 400;
        throw error;
      } else {
        res
          .status(200)
          .json({ message: `کتاب ${book.name} با موفقیت حذف شد` });
      }
    });
  } catch (err) {
    next(err);
  }
};