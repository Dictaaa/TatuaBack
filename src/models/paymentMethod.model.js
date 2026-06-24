const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class PaymentMethod extends Model {}

PaymentMethod.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  detail: {
    type: DataTypes.STRING(200),
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
}, {
  sequelize,
  modelName: 'PaymentMethod',
  tableName: 'payment_methods',
  timestamps: false,
});

PaymentMethod.associate = (models) => {
  PaymentMethod.hasMany(models.Payment, { foreignKey: 'method_id', as: 'payments' });
};


module.exports = PaymentMethod;