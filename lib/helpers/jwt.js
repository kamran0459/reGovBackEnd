const {sign} = require("jsonwebtoken");

class Jwt {
  static generateToken(user) {
    const payload = JSON.stringify(user);
    return sign(payload, "secret");
  }
}

module.exports = {
  generateToken: Jwt.generateToken
};
