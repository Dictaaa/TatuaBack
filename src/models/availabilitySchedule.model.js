const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

// ── AvailabilitySchedule ──────────────────────────────────────
class AvailabilitySchedule extends Model {}

AvailabilitySchedule.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day_of_week: {
    type: DataTypes.SMALLINT,    // 0 = Sun … 6 = Sat
    allowNull: false,
    validate: { min: 0, max: 6 },
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
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
  modelName: 'AvailabilitySchedule',
  tableName: 'availability_schedule',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['artist_id', 'day_of_week'] },
  ],
});

AvailabilitySchedule.associate = (models) => {
  AvailabilitySchedule.belongsTo(models.Artist, { foreignKey: 'artist_id', as: 'artist' });
};



module.exports = AvailabilitySchedule;