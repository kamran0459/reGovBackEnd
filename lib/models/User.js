/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => sequelize.define('users', {
  userId: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_id',
  },
  fullName: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: 'full_name',
  },
  userName: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: 'user_name',
  },
  email: {
    type: DataTypes.STRING(254),
    allowNull: false,
    unique: true,
    field: 'email',
  },
  photoUrl: {
    type: DataTypes.STRING(350),
    allowNull: true,
    field: 'photo_url',
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'password',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    default: new Date(),
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    default: new Date(),
    field: 'updated_at',
  }
}, {
  tableName: 'users',
  timestamps: false,
});
