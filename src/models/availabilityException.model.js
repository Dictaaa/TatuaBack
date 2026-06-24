const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class AvailabilityException extends Model {}

AvailabilityException.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  kind: {
    type: DataTypes.ENUM('blocked', 'special_hours'),
    defaultValue: 'blocked',
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'AvailabilityException',
  tableName: 'availability_exceptions',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['artist_id', 'date'] },
    { fields: ['date'] },
  ],
});

AvailabilityException.associate = (models) => {
  AvailabilityException.belongsTo(models.Artist, { foreignKey: 'artist_id', as: 'artist' });
};


module.exports = AvailabilityException;