const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Studio extends Model {}

Studio.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  plan_expires_at: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Studio',
  tableName: 'studios',
  timestamps: false,
});

Studio.associate = (models) => {
  Studio.belongsTo(models.City, { foreignKey: 'city_id', as: 'city' });
  Studio.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  Studio.hasMany(models.Artist, { foreignKey: 'studio_id', as: 'artists' });
};

module.exports = Studio;