'use strict';

const {model} = require('../models');

const User = model.users;

class UsersRepo {
  static async create(payload, errorMsg = {userID: 'userID Already exists'}) {

    let user = await User.findAll({where: {email: payload.email}, raw: true});
    if (user.length) {
      throw (errorMsg);
    }
    return User.create(payload);
  }

  static async findUser(payload, errorMsg = {userID: 'user does not exits in system'}) {

    let user = await User.findOne({where: {email: payload.email}, raw: true});
    if (user) {
      return user;
    }
    throw (errorMsg);
  }
}

module.exports = UsersRepo;
