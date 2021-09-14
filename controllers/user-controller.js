const userService = require("../service/user-service");

class UserController {
  async registration(req, res, next) {
    try {
      const {email, password, userName, userAge} = req.body;
      const userData = await userService.registerUser(email, password, userName, userAge);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: process.env.JWT_TIME_EXPIRATION * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      return res.json(userData);
    } catch (error) {
      console.error(error);
    }
  };

  async login(req, res, next) {
    try {
      
    } catch (error) {
      
    }
  };

  async logout(req, res, next) {
    try {
      
    } catch (error) {
      
    }
  };

  async activate(req, res, next) {
    try {
      
    } catch (error) {
      
    }
  };

  async refreshToken(req, res, next) {
    try {
      
    } catch (error) {
      
    }
  };

  async getAllUsers(req, res, next) {
    try {
      res.json(["Perviy", "Vtoroy"])
    } catch (error) {
      console.error(error);   
    }
  }
}

module.exports = new UserController();