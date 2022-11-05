const { Router } = require("express");
//const { authenticated } = require("../middlewares/auth");

const postController = require("../controllers/adminControllers/postController");
const movieController = require("../controllers/adminControllers/movieController");


const router = new Router();

//*Blog Admins

//? done
//  @desc   Admin Handle Post Creation
//  @route  POST /admin/add-post
router.post("/add-post", postController.createPost);
//authenticated,

//? done
//  @desc   Admin Handle Post Edit
//  @route  PUT /admin/edit-post/:id
router.put("/edit-post/:id", postController.editPost);
//authenticated,

//? done
//  @desc   Admin Handle Delete Post
//  @route  DELETE /admin/delete-post/:id
router.delete("/delete-post/:id", postController.deletePost);
// authenticated,

//  @desc   Admin Handle Image Upload
//  @route  POST /admin/image-upload
//? router.post("/image-upload", authenticated, adminController.uploadImage);







//*Movies 
//? done
//  @desc   Admin Handle movie Creation
//  @route  POST /admin/add-movie
 router.post("/add-movie", movieController.createMovie);
//authenticated



//? done
//  @desc   Admin Handle Movie Edit
//  @route  POST /admim/edit-movie/:id
router.put("/edit-movie/:id", movieController.editMovie);
//authenticated,



//? done
//  @desc   Admin Handle Delete Movie
//  @route  DELETE /admin/delete-movie/:id
router.delete("/delete-movie/:id", movieController.deleteMovie);
// authenticated,







//*Books Admins
//  @desc   Dashboard Handle Post Creation
//  @route  POST /dashboard/add-post
//? router.post("/add-book", authenticated, adminController.createPost);

//*Gallery Admins
//  @desc   Dashboard Handle Post Creation
//  @route  POST /dashboard/add-post
//? router.post("/add-photo", authenticated, adminController.createPost);

module.exports = router;
