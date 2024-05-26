const { DataTypes } = require('sequelize');
/*
	Here are the tables in a restuarant
	I split this into a new table due to allow restaurant to have any configurations possible
	Perhaps a restuants has 5 seating table or 7 seating table. Its not the norm, but didnt want to restrict restaurants
	It makes it easier for a start up to add new features faster 
	It will make some impact to performance
*/

module.exports = (sequelize) => {
	sequelize.define('table', {
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

		// Seating is like 2 seat on a table, or 4 seats on a table
		seating: {
			type: DataTypes.INTEGER,
		},

		// How many of those tables do we have? IE Three (2 seat tables)
		available:{
			type: DataTypes.INTEGER,
		}
	});
};
