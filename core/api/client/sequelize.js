/* eslint no-console: 0 , no-param-reassign:0 */
const Sequelize = require('sequelize');

function sequelizeConnect(config) {
    if (config.logging) {
        delete config.logging;
    }
    const sequelize = new Sequelize(config);
    sequelize.authenticate()
      .then(() => {
          console.info('Mysql connection has been established successfully');
          console.info(config);
          console.info('***************************************************');
      })
      .catch((err) => {
          console.error('Unable to connect to the database:', err);
      });
    return sequelize;
}


module.exports = sequelizeConnect;
