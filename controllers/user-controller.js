const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

const cookieLifetime = process.env.JWT_TIME_EXPIRATION * 24 * 60 * 60 * 1000;

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
        maxAge: cookieLifetime,
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
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: cookieLifetime,
        httpOnly: true
      })

      return res.json(userData);
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");

      return res.json(token);
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
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: cookieLifetime,
        httpOnly: true
      })

      return res.json(userData);
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  };

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      // Send error to error-middleware
      next(error);
    }
  }
}

module.exports = new UserController();