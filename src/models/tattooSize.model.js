const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

// ── TattooSize ────────────────────────────────────────────────
class TattooSize extends Model {}

TattooSize.init({
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
  description: {
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
  modelName: 'TattooSize',
  tableName: 'tattoo_sizes',
  timestamps: false,
});

TattooSize.associate = (models) => {
  TattooSize.hasMany(models.Booking, { foreignKey: 'size_id', as: 'bookings' });
};

module.exports = TattooSize;