const { Router } = require("express");

const {
  getIndex,
  getMovies,
  getBooks,
  getGallery,
  getSinglePost,
  createComment,
  editComment,
  deleteComment,
  getComments,
} = require("../controllers/publicControllers/blogController");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /blog
router.get("/", (req, res) => {
  res.send("homepage");
});

//  @desc   Weblog Index Page
//  @route  GET /blog
router.get("/blog", getIndex);
//get all posts

//  @desc   movies Index Page
//  @route  GET /movies
router.get("/movies", getMovies);
// get all movies with description
//& g
//  @desc   books Index Page
//  @route  GET /books
router.get("/books", getBooks);
// get all books with description

//  @desc   photos Index Page
//  @route  GET /gallery
router.get("/gallery", getGallery);
// get all photoes [ maybe with desc]

//  @desc   weblog post Page
//  @route  GET /post/:id
router.get("/post/:id", getSinglePost);
//  get single post

//  @desc   add post comment
//  @route  POST /post/add-comment/:postid
router.post("/post/add-comment", createComment);

//  @desc   add post comment
//  @route  POST /post/add-comment/:postid
router.put("/post/edit-comment/:id", editComment);

//  @desc   add post comment
//  @route  POST /post/add-comment/:postid
router.delete("/post/delete-comment/:id", deleteComment);

//  @desc   get post comments
//  @route  POST /post/comments/:postid
router.get("/post/comments/:postId",getComments);

module.exports = router;

// //  @desc   Weblog Index Page
// //  @route  GET /
// router.get("/", blogController.getIndex);

// //  @desc   Weblog Post Page
// //  @route  GET /post/:id
// router.get("/post/:id", blogController.getSinglePost);

// //  @desc   Weblog Numric Captcha
// //  @route  GET /captcha.png
// router.get("/captcha.png", blogController.getCaptcha);

// //  @desc   Handle Contact Page
// //  @route  POST /contact
// router.post("/contact", blogController.handleContactPage);
