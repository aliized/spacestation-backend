const { Router } = require("express");
//const { authenticated } = require("../middlewares/auth");

const adminController = require("../controllers/adminController");

const router = new Router();


//*Blog Admins
//  @desc   Dashboard Handle Image Upload
//  @route  POST /dashboard/image-upload
//? router.post("/image-upload", authenticated, adminController.uploadImage);

//? done
//  @desc   Dashboard Handle Post Creation
//  @route  POST /admin/add-post
router.post("/add-post", adminController.createPost);
//authenticated, 

//? done
//  @desc   Dashboard Handle Post Edit
//  @route  POST /admin/edit-post/:id
router.put("/edit-post/:id", adminController.editPost);
//authenticated, 

//? done
//  @desc   Dashboard Delete Post
//  @route  GET /admin/delete-post/:id
router.delete("/delete-post/:id",  adminController.deletePost);
// authenticated,



//*Movies Admins
//  @desc   Dashboard Handle Post Creation
//  @route  POST /dashboard/add-post
//? router.post("/add-post", authenticated, adminController.createPost);

//*Gallery Admins
//  @desc   Dashboard Handle Post Creation
//  @route  POST /dashboard/add-post
//? router.post("/add-post", authenticated, adminController.createPost);


//*Books Admins
//  @desc   Dashboard Handle Post Creation
//  @route  POST /dashboard/add-post
//? router.post("/add-post", authenticated, adminController.createPost);





module.exports = router;


