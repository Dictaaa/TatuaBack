const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class TattooStyle extends Model {}

TattooStyle.init({
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
    type: DataTypes.STRING(255),
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
  modelName: 'TattooStyle',
  tableName: 'tattoo_styles',
  timestamps: false,
});

TattooStyle.associate = (models) => {
  TattooStyle.belongsToMany(models.Artist, {
    through: 'artist_styles',
    foreignKey: 'style_id',
    otherKey: 'artist_id',
    as: 'artists',
  });
  TattooStyle.hasMany(models.Portfolio, { foreignKey: 'style_id', as: 'portfolio' });
  TattooStyle.hasMany(models.Booking, { foreignKey: 'style_id', as: 'bookings' });
};

module.exports = TattooStyle;