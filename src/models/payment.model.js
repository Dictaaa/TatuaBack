const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Payment extends Model {}

Payment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  method_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kind: {
    type: DataTypes.ENUM('deposit', 'balance', 'full'),
    defaultValue: 'deposit',
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  receipt_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  external_ref: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING(255),
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
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: false,
});

Payment.associate = (models) => {
  Payment.belongsTo(models.Booking,       { foreignKey: 'booking_id', as: 'booking' });
  Payment.belongsTo(models.PaymentMethod, { foreignKey: 'method_id',  as: 'method'  });
};

module.exports = Payment;