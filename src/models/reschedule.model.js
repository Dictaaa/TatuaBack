const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Reschedule extends Model {}

Reschedule.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prev_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  prev_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  new_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  new_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  requested_by: {
    type: DataTypes.ENUM('client', 'artist', 'admin'),
    defaultValue: 'client',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Reschedule',
  tableName: 'reschedules',
  timestamps: false,
});

Reschedule.associate = (models) => {
  Reschedule.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
};


module.exports = Reschedule;