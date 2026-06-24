const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class ArtistConfig extends Model {}

ArtistConfig.init({
  artist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  deposit_percent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 50.00,
  },
  cancellation_policy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  reschedule_policy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notify_ws_new: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  notify_ws_payment: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  min_advance_days: {
    type: DataTypes.SMALLINT,
    defaultValue: 2,
  },
  slot_duration_min: {
    type: DataTypes.SMALLINT,
    defaultValue: 60,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ArtistConfig',
  tableName: 'artist_config',
  timestamps: false,
});

ArtistConfig.associate = (models) => {
  ArtistConfig.belongsTo(models.Artist, { foreignKey: 'artist_id', as: 'artist' });
};


module.exports = ArtistConfig;