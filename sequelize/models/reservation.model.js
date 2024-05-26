const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('reservation', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		// We also want it to have a 'restaurantId' field, but we don't have to define it here.
		// It will be defined automatically when Sequelize applies the associations.

		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		capacity: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		time: {
			allowNull: false,
			type: DataTypes.BIGINT,
		},
	});
};
