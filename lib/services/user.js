'use strict';

const validator = require('../validator');
const userRepo = require('../repositories/user');
const _ = require('lodash');
const hash = require('../hash');

class UserService {
  static getDetails(payload) {
    return validator.validate(payload, validator.schemas.user.userDetails)
      .then(() => {
        const query = payload.allowedGroups ? {
          name: {$in: payload.allowedGroups},
          orgCode: payload.orgCode
        } : {orgCode: payload.orgCode};
        console.log('================================' + JSON.stringify(query));
        return Promise.all([
          userRepo.getGroups({_id: payload.id}, 'name', true),
          groupRepo.find(query, 'name', true),
          loginAttemptsRepo.lastLoginIn(payload.id)
        ]);
      })
      .then((res) => {
        const user = res[0] || {};
        const groups = res[1] || [];
        user.lastLoginTime = res[2];
        user.groups = user.groups || [];
        for (const group of user.groups) {
          group.isAssigned = true;
        }
        for (const group of groups) {
          if (!_.find(user.groups, {'_id': group._id})) {
            group.isAssigned = false;
            user.groups.push(group);
          }
        }
        const params = {
          userId: payload.userID,
          documents: user,
          docType: 'actions',
          page: permissionConst.userDetails.pageId,
          component: ''
        };
        return permissionsHelper.embed(params);
      })
      .then((res) => {
        return {
          searchResult: _.get(res, 'documents[0]', {}),
          actions: res.pageActions || []
        };
      });
  }

  static async create(payload, errorMsg) {
    await validator.validate(payload, validator.schemas.user.create);
    payload.data.password = hash['sha512'](payload.data.password);
    await userRepo.create(payload.data, errorMsg);
  }

  static update(payload) {
    let customValidates = validator.schemas.user.update;
    if (_.get(payload, 'data.userType') === commonConst.user.userTypeKeys.human) {
      customValidates = _.merge({}, customValidates, validator.schemas.user.createHuman);
    }

    /* if (_.get(payload, 'data.userType') === commonConst.user.userTypeKeys.api) {
  customValidates = _.merge({}, customValidates, validator.schemas.user.userTypeAPI);
  }*/
    return validator.errorValidate(payload, customValidates)
      .then(() => {
        delete payload.data.password;
        delete payload.data.passwordHashType;
        payload.data.updatedBy = payload.updatedBy;
        payload.data.updatedAt = payload.updatedAt;
        return userRepo.findOneAndUpdate({_id: payload.data.id}, payload.data);
      });
  }
}

module.exports = UserService;
