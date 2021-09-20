const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dtos");
const ApiError = require("../exceptions/api-error");

class UserService {
  /**
   * @param {Object} user
   * @returns {Object}
   */
  async setUserData(user) {
    // ? Here we create user dto which has needed properties for token payload
    const userDto = new UserDto(user);
    // ? Here we get our tokens | access && refresh
    const tokens = tokenService.generateTokens({...userDto});
    // ? Save tokens in DB
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
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
      return await this.setUserData(user);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {String} activationLink
   * @returns {Promise<*>}
   */
  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})

    if (!user) throw ApiError.BadRequest("Incorrect link to activate your account");

    user.isActivated = true;
    return user.save();
  }

  /**
   * @param {String} email
   * @param {String} password
   * @returns {Object}
   */
  async login(email, password) {
    // ? Check by email
    const user = await UserModel.findOne({email});
    if (!user) {
      throw ApiError.BadRequest("The user with current email isn't registered");
    }

    // ? Check by pass
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw ApiError.BadRequest("Wrong password");
    }

    return await this.setUserData(user);
  }

  /**
   * @param {String} refreshToken
   * @returns {Promise<*>}
   */
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  /**
   * @param {String} refreshToken
   * @returns {Object}
   */
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    return await this.setUserData(user);
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();