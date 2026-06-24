const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class City extends Model {}

City.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'City',
  tableName: 'cities',
  timestamps: false,
});

City.associate = (models) => {
  City.hasMany(models.Artist, { foreignKey: 'city_id', as: 'artist' });
};



module.exports = City;