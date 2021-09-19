const ApiError = require("../exceptions/api-error");

module.exports = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({
        message: err.message,
        errors: err.errors
      })
  }

  // ? 500 error status code === something went wrong on the server
  return res.status(500).json({message: "Something went wrong"});
}