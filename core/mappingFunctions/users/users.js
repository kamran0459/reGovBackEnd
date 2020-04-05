'use strict';

const user = require('../../../lib/services/user');
let response = {
  responseMessage: {
    action: "registration",
    data: {
      message: {
        status: 'OK',
        errorDescription: 'User register successfully',
        displayToUser: true,
        newPageURL: '/userList'
      }
    }
  }
};

class Users {
  static async register(payload, UUIDKey, route, callback, JWToken) {
    try {
      response.responseMessage.data.message.errorDescription = 'User register successfully';
      response.responseMessage.error = undefined;
      response.responseMessage.data.message.status = "OK";
      let userRegister = await user.create(payload);
      return callback(response);
    } catch (e) {
      response.responseMessage.data.message.errorDescription = e;
      response.responseMessage.error = new Error(e).stack;
      response.responseMessage.data.message.status = "ERROR";
      return callback(response)
    }
  }
}

module.exports = {
  userRegistration: Users.register
};

