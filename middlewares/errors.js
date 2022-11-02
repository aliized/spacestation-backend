exports.errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  let message = error.message;
  const data = error.data;
  const errorArr = [];
  if (error.inner) {
    error.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    message = errorArr;
  }

  res.status(status).json({ message, data });
console.log("======================================================================================")
console.log(error);
};
