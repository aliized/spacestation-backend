const { Router } = require("express");

 blogController = require("../controllers/publicControllers/blogController");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /blog
router.get("/", (req, res) => {
  res.send("homepage");
});

//  @desc   Weblog Index Page
//  @route  GET /blog
router.get("/blog", blogController.getIndex);
//get all posts

//  @desc   movies Index Page
//  @route  GET /movies
router.get("/movies", blogController.getMovies);
// get all movies with description
//& g
//  @desc   books Index Page
//  @route  GET /books
router.get("/books", blogController.getBooks);
// get all books with description

//  @desc   photos Index Page
//  @route  GET /gallery
router.get("/gallery", blogController.getGallery);
// get all photoes [ maybe with desc]

//  @desc   weblog post Page
//  @route  GET /post/:id
router.get("/post/:id", blogController.getSinglePost);
//  get single post

//  @desc   add post comment
//  @route  POST /post/add-comment/:postid
router.post("/post/add-comment/:postid", (req, res) => {
  res.send(
    `handle post comment: POST /post/add-comment/:postid ==> ${req.params.id}`
  );
});

//  @desc   get post comments
//  @route  POST /post/comments/:postid
router.get("/post/comments/:postid", (req, res) => {
  res.send(`handle post comment: GET /post/:id/comment ==> ${req.params.id}`);
});

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