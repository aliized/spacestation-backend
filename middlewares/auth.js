const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticated = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  try {
    if (!authHeader) {
      const error = new Error("you should login first.");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    //Bearer Token => ['Bearer', token]

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      const error = new Error("token is not valid");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decodedToken.id).lean();
    if (!user) {
      req.user = null;
      const error = new Error("token is not valid");
      error.statusCode = 401;
      throw error;
    }
    Reflect.deleteProperty(user, "password");
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
