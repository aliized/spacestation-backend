//? POST contact-us
//? POST / PUT about-us

const { Router } = require("express");

const router = new Router();

//  @desc   handle contact us
//  @route  GET /contact-us
router.get("/contact-us", (req, res) => {
  res.send(`handle contact us: POST /contact-us`);
});

module.exports = router;
