const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Booking extends Model {}

Booking.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  state: {
    type: DataTypes.ENUM(
      'pending',
      'awaiting_payment',
      'confirmed',
      'in_progress',
      'completed',
      'rescheduled',
      'cancelled',
      'no_show'
    ),
    defaultValue: 'pending',
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  style_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  size_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reference_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  booked_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  estimated_hours: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
  },
  estimated_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  deposit_percent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 50.00,
  },
  deposit_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  final_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  artist_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  modelName: 'Booking',
  tableName: 'bookings',
  timestamps: false,
  indexes: [
    { fields: ['artist_id'] },
    { fields: ['client_id'] },
    { fields: ['state'] },
    { fields: ['booked_date'] },
  ],
});

Booking.associate = (models) => {
  Booking.belongsTo(models.Artist,      { foreignKey: 'artist_id', as: 'artist' });
  Booking.belongsTo(models.Client,      { foreignKey: 'client_id', as: 'client' });
  Booking.belongsTo(models.TattooType,  { foreignKey: 'type_id',   as: 'type'   });
  Booking.belongsTo(models.TattooStyle, { foreignKey: 'style_id',  as: 'style'  });
  Booking.belongsTo(models.BodyZone,    { foreignKey: 'zone_id',   as: 'zone'   });
  Booking.belongsTo(models.TattooSize,  { foreignKey: 'size_id',   as: 'size'   });

  Booking.hasMany(models.Payment,             { foreignKey: 'booking_id', as: 'payments'     });
  Booking.hasMany(models.BookingStateHistory, { foreignKey: 'booking_id', as: 'stateHistory' });
  Booking.hasMany(models.Reschedule,          { foreignKey: 'booking_id', as: 'reschedules'  });
  Booking.hasOne (models.Review,              { foreignKey: 'booking_id', as: 'review'       });
};

module.exports = Booking;