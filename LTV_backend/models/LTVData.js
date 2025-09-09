const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../db');

class LTVData extends Model {}

LTVData.init({
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_id'
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_name'
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_id'
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  ltvValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'ltv_value'
  },
  calculationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'calculation_date'
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'LTVData',
  tableName: 'ltv_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = LTVData;