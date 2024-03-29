const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");

const postController = require("../controllers/adminControllers/postController");
const movieController = require("../controllers/adminControllers/movieController");
const bookController = require("../controllers/adminControllers/bookController");
const galleryController = require("../controllers/adminControllers/galleryController");
const { adminCheck } = require("../middlewares/adminCheck");

const router = new Router();

//*Blog Admins

//? done
//  @desc   Admin Handle Post Creation
//  @route  POST /admin/add-post
//authenticated,

//? done
//  @desc   Admin Handle Post Edit
//  @route  PUT /admin/edit-post/:id
router.put(
  "/edit-post/:id",
  authenticated,
  adminCheck,
  postController.editPost
);
//authenticated,

//? done
//  @desc   Admin Handle Delete Post
//  @route  DELETE /admin/delete-post/:id
router.delete(
  "/delete-post/:id",
  authenticated,
  adminCheck,
  postController.deletePost
);
// authenticated,

//  @desc   Admin Handle Image Upload
//  @route  POST /admin/image-upload
//? router.post("/image-upload", authenticated, adminController.uploadImage);

//*Movies
//? done
//  @desc   Admin Handle movie Creation
//  @route  POST /admin/add-movie
router.post(
  "/add-movie",
  authenticated,
  adminCheck,
  movieController.createMovie
);
//authenticated

//? done
//  @desc   Admin Handle Movie Edit
//  @route  POST /admim/edit-movie/:id
router.put(
  "/edit-movie/:id",
  authenticated,
  adminCheck,
  movieController.editMovie
);
//authenticated,

//? done
//  @desc   Admin Handle Delete Movie
//  @route  DELETE /admin/delete-movie/:id
router.delete(
  "/delete-movie/:id",
  authenticated,
  adminCheck,
  movieController.deleteMovie
);
// authenticated,

//*Books Admins
//  @desc   Admin Handle Book Creation
//  @route  POST /admin/add-book
router.post("/add-book", authenticated, adminCheck, bookController.createBook);

//  @desc   Admin Handle Book Edit
//  @route  PUT /admin/edit-book/:id
router.put(
  "/edit-book/:id",
  authenticated,
  adminCheck,
  bookController.editBook
);

//  @desc   Admin Handle Book Delete
//  @route  DELETE /admin/delete-book/:id
router.delete(
  "/delete-book/:id",
  authenticated,
  adminCheck,
  bookController.deleteBook
);

//*Gallery Admins
//  @desc   Admin Handle Book Creation
//  @route  POST /admin/add-book
router.post(
  "/add-photo",
  authenticated,
  adminCheck,
  galleryController.addPhoto
);

//  @desc   Admin Handle Book Edit
//  @route  PUT /admin/edit-photo/:id
router.put(
  "/edit-photo/:id",
  authenticated,
  adminCheck,
  galleryController.editPhoto
);

//  @desc   Admin Handle Book Delete
//  @route  DELETE /admin/delete-photo/:id
router.delete(
  "/delete-photo/:id",
  authenticated,
  adminCheck,
  galleryController.deletePhoto
);

module.exports = router;
