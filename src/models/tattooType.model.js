const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

// ── TattooType ────────────────────────────────────────────────
class TattooType extends Model {}

TattooType.init({
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
  modelName: 'TattooType',
  tableName: 'tattoo_types',
  timestamps: false,
});

TattooType.associate = (models) => {
  TattooType.hasMany(models.Booking, { foreignKey: 'type_id', as: 'bookings' });
};


module.exports = TattooType;