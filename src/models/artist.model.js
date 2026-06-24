const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');  // <-- faltaba esto

class Artist extends Model {
  async comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
  }
}

Artist.init({
  id:              { type: DataTypes.INTEGER,      autoIncrement: true, primaryKey: true },
  studio_id:       { type: DataTypes.INTEGER,      allowNull: true },
  slug:            { type: DataTypes.STRING(100),  allowNull: false, unique: true },
  name:            { type: DataTypes.STRING(150),  allowNull: false },
  handle:          { type: DataTypes.STRING(80),   allowNull: false },
  city_id:         { type: DataTypes.INTEGER,      allowNull: false },
  plan_id:         { type: DataTypes.INTEGER,      allowNull: false, defaultValue: 1 },
  plan_expires_at: { type: DataTypes.DATEONLY,     allowNull: true },
  bio:             { type: DataTypes.TEXT,         allowNull: true },
  tagline:         { type: DataTypes.STRING(255),  allowNull: true },
  hero_image_url:  { type: DataTypes.STRING(500),  allowNull: true },
  whatsapp:        { type: DataTypes.STRING(20),   allowNull: true },
  instagram:       { type: DataTypes.STRING(100),  allowNull: true },
  facebook:        { type: DataTypes.STRING(100),  allowNull: true },
  tiktok:          { type: DataTypes.STRING(100),  allowNull: true },
  year_started:    { type: DataTypes.SMALLINT,     allowNull: true },
  total_tattoos:   { type: DataTypes.INTEGER,      defaultValue: 0 },
  rating_avg:      { type: DataTypes.DECIMAL(3,2), defaultValue: 0.00 },
  total_reviews:   { type: DataTypes.INTEGER,      defaultValue: 0 },
  is_available:    { type: DataTypes.BOOLEAN,      defaultValue: true },
  is_active:       { type: DataTypes.BOOLEAN,      defaultValue: true },
  email:           { type: DataTypes.STRING(150),  allowNull: true, unique: true },
  password:        { type: DataTypes.STRING(255),  allowNull: true },
  created_at:      { type: DataTypes.DATE,         allowNull: true },
  updated_at:      { type: DataTypes.DATE,         allowNull: true },
}, {
  sequelize,
  modelName: 'Artist',
  tableName: 'artists',
  timestamps: false,
  hooks: {
    beforeCreate: async (artist) => {
      if (artist.password) {
        artist.password = await bcrypt.hash(artist.password, 12);
      }
    },
    beforeUpdate: async (artist) => {
      if (artist.changed('password') && artist.password) {
        artist.password = await bcrypt.hash(artist.password, 12);
      }
    },
  },
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
  indexes: [
    { fields: ['slug'] },
    { fields: ['city_id'] },
    { fields: ['is_active', 'is_available'] },
  ],
});

Artist.associate = (models) => {
  Artist.belongsTo(models.City,   { foreignKey: 'city_id',   as: 'city'   });
  Artist.belongsTo(models.Plan,   { foreignKey: 'plan_id',   as: 'plan'   });
  Artist.belongsTo(models.Studio, { foreignKey: 'studio_id', as: 'studio' });

  Artist.belongsToMany(models.TattooStyle, {
    through: 'artist_styles',
    foreignKey: 'artist_id',
    otherKey: 'style_id',
    as: 'styles',
  });

  Artist.hasMany(models.Service,               { foreignKey: 'artist_id', as: 'services'   });
  Artist.hasMany(models.Portfolio,             { foreignKey: 'artist_id', as: 'portfolio'  });
  Artist.hasMany(models.Booking,               { foreignKey: 'artist_id', as: 'bookings'   });
  Artist.hasMany(models.Review,                { foreignKey: 'artist_id', as: 'reviews'    });
  Artist.hasMany(models.AvailabilitySchedule,  { foreignKey: 'artist_id', as: 'schedule'   });
  Artist.hasMany(models.AvailabilityException, { foreignKey: 'artist_id', as: 'exceptions' });
  Artist.hasOne (models.ArtistConfig,          { foreignKey: 'artist_id', as: 'config'     });
};

module.exports = Artist;