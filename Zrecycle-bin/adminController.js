// //* Create Post ✔️
// //? Update Post ✔️
// //! Delete Post ✔️

// //* Create Movie ✔️
// //? Update Movie ✔️
// //! Delete Movie ✔️

// //* Create Book
// //? Update Book
// //! Delete Book

// //* Create Gallery
// //? Update Gallery
// //! Delete Gallery

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
