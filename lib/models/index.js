const model = {};
let initialized = false;

const init = (sequelize) => {
  delete module.exports.init; // Destroy itself to clash with a model named 'init'.
  initialized = true;
  model.sequelize = sequelize;
  // users related models
  model.users = sequelize.import('./User.js');
  model.sequelize = sequelize;
  return model;
};

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = { model, init, initialized};
