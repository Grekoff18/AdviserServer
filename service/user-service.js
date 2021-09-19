const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dtos");
const ApiError = require("../exceptions/api-error");

class UserService {
  /**
   * @param {String} email 
   * @param {String} password 
   * @param {String} userName 
   * @param {Number} userAge 
   * @returns {Object}
   */
  async registerUser(email, password, userName, userAge) {
    // ? Search in db for users with current email
    const candidate = await UserModel.findOne({email});
    try {
      // ? If we had user with current email, throw new error
      if (candidate) {
        // User already exist in DB === true ? BadRequest : Something else
        throw ApiError.BadRequest(`User with email ${email} already exist`);
      }

      const hashedPassword = await bcrypt.hash(password, 3);
      const activationLink = uuid.v4();
      const user = await UserModel.create({
        email, 
        password: hashedPassword, 
        userName, 
        userAge,
        activationLink
      });

      await mailService.sendActivationMsg(email, `${process.env.API_URL}/api/v1/activate/${activationLink}`);
      // ? Here we create user dto which has needed properties for token payload
      const userDto = new UserDto(user);
      // ? Here we get our tokens | access && refresh
      const tokens = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      return { ...tokens, user: userDto }
    } catch (error) {
      console.error(error);
    }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})

    if (!user) throw ApiError.BadRequest("Incorrect link to activate your account");

    user.isActivated = true;
    return user.save();
  }
}

module.exports = new UserService();