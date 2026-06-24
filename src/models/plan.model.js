const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Plan extends Model {}

Plan.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.ENUM('free', 'professional', 'studio'),
    allowNull: false,
    unique: true,
  },
  price_month: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  max_artists: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
  },
  gallery_limit: {
    type: DataTypes.SMALLINT,
    defaultValue: 10,
  },
  online_booking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  modelName: 'Plan',
  tableName: 'plans',
  timestamps: false,
});

Plan.associate = (models) => {
  Plan.hasMany(models.Artist, { foreignKey: 'plan_id', as: 'artists' });
  Plan.hasMany(models.Studio, { foreignKey: 'plan_id', as: 'studios' });
};

module.exports = Plan;