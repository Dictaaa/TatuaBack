
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Portfolio extends Model {}

Portfolio.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  style_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  duration_hours: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sort_order: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
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
  modelName: 'Portfolio',
  tableName: 'portfolio',
  timestamps: false,
});

Portfolio.associate = (models) => {
  Portfolio.belongsTo(models.Artist,      { foreignKey: 'artist_id', as: 'artist' });
  Portfolio.belongsTo(models.TattooStyle, { foreignKey: 'style_id',  as: 'style'  });
};

module.exports = Portfolio;