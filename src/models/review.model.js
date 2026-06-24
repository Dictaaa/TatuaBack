const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  timestamps: false,
});

Review.associate = (models) => {
  Review.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  Review.belongsTo(models.Artist,  { foreignKey: 'artist_id',  as: 'artist'  });
  Review.belongsTo(models.Client,  { foreignKey: 'client_id',  as: 'client'  });
};


module.exports = Review;