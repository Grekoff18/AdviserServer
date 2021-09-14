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

  async saveToken(userId, refreshToken) {
    const hasToken = await tokenModel.findOne({user: userId});
    if (hasToken) {
      hasToken.refreshToken = refreshToken;
      return hasToken.save();
    }

    const token = await tokenModel.create({user: userId, refreshToken});
    return token;
  }
}

module.exports = new TokenService();