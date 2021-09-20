const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
  /**
   * @param {Object} payload
   * @return {Object<accessToken: string, refreshToken: string>}
   */
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: `${process.env.JWT_TIME_EXPIRATION}m`
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: `${process.env.JWT_TIME_EXPIRATION}d`
    })

    return {
      accessToken,
      refreshToken
    }
  };

  /**
   * @param {String} token
   * @returns {null|*}
   */
  validateAccessToken(token) {
    try {
      // ? Compare arg token and secret key
      const tokenData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      return tokenData;
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {String} token
   * @returns {null|*}
   */
  validateRefreshToken(token) {
    try {
      // ? Compare arg token and secret key
      const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      return tokenData;
    } catch (e) {
      return null;
    }
  }

  /**
   * @param {Number} userId
   * @param {String} refreshToken
   * @returns {Promise<any> || String>}
   */
  async saveToken(userId, refreshToken) {
    const hasToken = await tokenModel.findOne({user: userId});
    if (hasToken) {
      hasToken.refreshToken = refreshToken;
      return hasToken.save();
    }

    const token = await tokenModel.create({user: userId, refreshToken});
    return token;
  };

  /**
   * @param {String} refreshToken
   * @returns {Promise<any>}
   */
  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({refreshToken});

    return tokenData;
  }

  /**
   * @param {String} refreshToken
   * @returns {Promise<*>}
   */
  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({refreshToken});

    return tokenData;
  }
}

module.exports = new TokenService();