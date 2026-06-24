const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class BodyZone extends Model {}

BodyZone.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(80),
    allowNull: false,
    unique: true,
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
  modelName: 'BodyZone',
  tableName: 'body_zones',
  timestamps: false,
});

BodyZone.associate = (models) => {
  BodyZone.hasMany(models.Booking, { foreignKey: 'zone_id', as: 'bookings' });
};


module.exports = BodyZone;