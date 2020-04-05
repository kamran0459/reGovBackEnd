'use strict';

const user = require('../../../lib/services/user'),
  {normalize, join} = require("path");
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

class Users {
  static async register(payload, UUIDKey, route, callback, JWToken) {
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
        photoUrl: `/images/${payload.files.file.name}`,
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
}

module.exports = {
  userRegistration: Users.register
};

