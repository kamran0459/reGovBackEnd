'use strict';

const user = require('../../../lib/services/user'),
  {findUser} = require('../../../lib/repositories/user'),
  {normalize, join} = require("path"),
  validator = require('../../../lib/validator'),
  {generateToken} = require('../../../lib/helpers/jwt'),
  {sha512} = require('../../../lib/hash'),
  appConfig = require("../../../AppConfig");

class Users {
  static async register(payload, UUIDKey, route, callback, JWToken) {
    let response = {
      responseMessage: {
        action: "registration",
        data: {
          message: {
            status: 'OK',
            description: 'User register successfully',
            displayToUser: true,
            newPageURL: '/userList'
          }
        }
      }
    };
    try {
      let required = true;
      if (payload.files && Object.keys(payload.files).length > 0) {
        if (payload.files.file) {
          required = false;
          payload.files.file.mv(normalize(join(global.appDir, 'public/images', payload.files.file.name)));
        }
      }
      if (required) {
        response.responseMessage.data.message.description = "Identity photo required";
        response.responseMessage.data.message.status = "ERROR";
        return callback(response);
      }

      payload["data"] = {
        userName: payload["userName"],
        email: payload["email"],
        password: payload["password"],
        fullName: payload["fullName"],
        photoUrl: `/images/${payload.files.file.name}`
      };

      response.responseMessage.data.message.description = 'User register successfully';
      response.responseMessage.error = undefined;
      response.responseMessage.data.message.status = "OK";
      let userRegister = await user.create(payload);
      return callback(response);
    } catch (e) {
      response.responseMessage.data.message.description = e;
      response.responseMessage.error = new Error(e).stack;
      response.responseMessage.data.message.status = "ERROR";
      return callback(response);
    }
  }

  static async login(payload, UUIDKey, route, callback, JWToken) {
    let response = {
      loginResponse: {
        action: "registration",
        data: {
          message: {
            status: 'OK',
            description: 'Login successful',
            displayToUser: true,
            newPageURL: '/userList'
          }
        }
      }
    };
    try {
      await validator.validate(payload, validator.schemas.user.login);
      let userData = await findUser({email: payload.email});
      if (userData["photoUrl"]) {
        userData["photoUrl"] = `${appConfig.restURL}${userData["photoUrl"]}`
      }
      if (userData.password === sha512(payload.password)) {
        delete userData.password;
        let token = generateToken(userData);
        response.loginResponse.data.user = {
          user: userData,
          token
        };
        return callback(response);
      }
      else {
        response.loginResponse.data.message.description = "Email or Password incorrect";
        response.loginResponse.data.message.status = "ERROR";
        return callback(response);
      }

    } catch (e) {
      response.loginResponse.data.message.description = e;
      response.loginResponse.error = new Error(e).stack;
      response.loginResponse.data.message.status = "ERROR";
      return callback(response);
    }
  }
}

module.exports = {
  userRegistration: Users.register,
  login: Users.login
};

