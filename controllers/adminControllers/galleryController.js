//* Create Gallery ✔️
//? Update Gallery ✔️
//! Delete Gallery ✔️

const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");

const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Gallery = require("../../models/Gallery");

exports.addPhoto = async (req, res, next) => {
  let photo, parsedName, fileName, uploadPath;

  try {
    if (!req.files || !req.files.photo) {
      const err = new Error("عکس الزامی می باشد");
      err.statusCode = 400;
      throw err;
    }
    photo = req.files.photo;

    const imgSize = sizeOf(photo.data);
    req.body.aspectRatio = (imgSize.width / imgSize.height).toFixed(2);

    parsedName = path.parse(photo.name);
    fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
    uploadPath = `${appRoot}/public/img/gallery/${fileName}`;
    req.body = { ...req.body, photo };

    await Gallery.validation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    await sharp(photo.data)
      .jpeg({ quality: 100 })
      .toFile(uploadPath)
      .catch((err) => {
        throw err;
      });

    await Gallery.create({
      ...req.body,
      user: req.user,
      photo: fileName,
    });

    res.status(201).json({
      message: `عکس ${req.body.alt} با موفقیت به گالری اضافه شد`,
    });
  } catch (err) {
    next(err);
  }
};

exports.editPhoto = async (req, res, next) => {
  try {
    let photo, parsedName, fileName, uploadPath;

    if (!req.files || !req.files.photo) {
      const err = new Error("عکس الزامی می باشد");
      err.statusCode = 400;
      throw err;
    }

    photo = req.files.photo;

    const imgSize = sizeOf(photo.data);
    req.body.aspectRatio = (imgSize.width / imgSize.height).toFixed(2);

    parsedName = path.parse(photo.name);
    fileName = `${parsedName.name}_${shortId.generate()}${parsedName.ext}`;
    uploadPath = `${appRoot}/public/img/gallery/${fileName}`;

    const frame = await Gallery.findOne({ _id: req.params.id }).catch((err) => {
      err.statusCode = 404;
      err.message = "عکسی با این شناسه یافت نشد";
      throw err;
    });

    await Gallery.validation({ ...req.body, photo }).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    if (req.files && req.files.photo) {
      fs.unlink(`${appRoot}/public/img/gallery/${frame.photo}`, async (err) => {
        if (err) throw err;
        else {
          await sharp(photo.data)
            .jpeg({ quality: 100 })
            .toFile(uploadPath)
            .catch((err) => {
              throw err;
            });
        }
      });
    }
    const { alt, caption, status } = req.body;
    frame.alt = alt;
    frame.caption = caption;
    frame.status = status;
    frame.photo = photo.name ? fileName : frame.photo;

    await frame.save();

    res
      .status(200)
      .json({ message: `عکس ${req.body.alt} با موفقیت ویرایش شد` });
  } catch (err) {
    next(err);
  }
};

exports.deletePhoto = async (req, res, next) => {
  try {
    const frame = await Gallery.findByIdAndRemove(req.params.id).catch(
      (err) => {
        err.statusCode = 404;
        err.message = "عکسی با این شناسه یافت نشد";
        throw err;
      }
    );

    const filePath = `${appRoot}/public/img/gallery/${frame.photo}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        const error = new Error("خطای در حذف عکس مربوطه رخ داده است");
        error.statusCode = 400;
        throw error;
      } else {
        res
          .status(200)
          .json({ message: `عکس ${frame.alt} با موفقیت از گالری حذف شد` });
      }
    });
  } catch (err) {
    next(err);
  }
};
