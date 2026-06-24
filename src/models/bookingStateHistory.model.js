const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class BookingStateHistory extends Model {}

BookingStateHistory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prev_state: {
    type: DataTypes.ENUM(
      'pending', 'awaiting_payment', 'confirmed',
      'in_progress', 'completed', 'rescheduled', 'cancelled', 'no_show'
    ),
    allowNull: true,
  },
  new_state: {
    type: DataTypes.ENUM(
      'pending', 'awaiting_payment', 'confirmed',
      'in_progress', 'completed', 'rescheduled', 'cancelled', 'no_show'
    ),
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'BookingStateHistory',
  tableName: 'booking_state_history',
  timestamps: false,
});

BookingStateHistory.associate = (models) => {
  BookingStateHistory.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
};

module.exports = BookingStateHistory;