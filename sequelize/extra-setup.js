function applyExtraSetup(sequelize) {
	const { table, restaurant, reservation } = sequelize.models;

	restaurant.hasMany(table, { foreignKey: 'restaurantId' });
	table.belongsTo(restaurant, { foreignKey: 'restaurantId' });
	restaurant.hasMany(reservation, { foreignKey: 'restaurantId' });
	reservation.belongsTo(restaurant, { foreignKey: 'restaurantId' });
}

module.exports = { applyExtraSetup };
