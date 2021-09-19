const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }
      const {email, password, userName, userAge} = req.body;
      const userData = await userService.registerUser(email, password, userName, userAge);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: process.env.JWT_TIME_EXPIRATION * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      return res.json(userData);
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async login(req, res, next) {
    try {
      
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async logout(req, res, next) {
    try {
      
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async refreshToken(req, res, next) {
    try {
      
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async getAllUsers(req, res, next) {
    try {
      res.json(["Perviy", "Vtoroy"])
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  }
}

module.exports = new UserController();