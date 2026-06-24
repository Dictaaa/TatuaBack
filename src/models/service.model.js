const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Service extends Model {}

Service.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  price_from: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  is_quote_only: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  badge: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  sort_order: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
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
  modelName: 'Service',
  tableName: 'services',
  timestamps: false,
});

Service.associate = (models) => {
  Service.belongsTo(models.Artist, { foreignKey: 'artist_id', as: 'artist' });
};

module.exports = Service;