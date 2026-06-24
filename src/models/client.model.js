const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Client extends Model {}

Client.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  whatsapp: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
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
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'clients',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['whatsapp'] },
    { fields: ['email'] },
  ],
});

Client.associate = (models) => {
  Client.hasMany(models.Booking, { foreignKey: 'client_id', as: 'bookings' });
  Client.hasMany(models.Review,  { foreignKey: 'client_id', as: 'reviews'  });
};

module.exports = Client;