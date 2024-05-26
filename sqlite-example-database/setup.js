const sequelize = require('../sequelize');

async function reset() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');

	await sequelize.sync({ force: true });

	await sequelize.models.restaurant.bulkCreate([
		{ name: 'lardo', is_gluten_free_friendly: true },
		{ name: 'Panadería Rosetta', is_vegetarian_friendly: true, is_gluten_free_friendly: true, },
		{ name: 'Tetetlán', is_gluten_free_friendly: true, is_paleo_friendly: true, },
		{ name: 'Falling Piano Brewing Co' },
		{ name: 'u.to.pi.a', is_vegetarian_friendly: true, is_vegan_friendly: true, },
	]);

	await sequelize.models.table.bulkCreate([
		{ restaurantId: 1, seating: 2, available: 2 },
		{ restaurantId: 1, seating: 4, available: 2 },

		{ restaurantId: 2, seating: 2, available: 1 },
		{ restaurantId: 2, seating: 4, available: 1 },

		{ restaurantId: 3, seating: 2, available: 1 },
		{ restaurantId: 3, seating: 3, available: 1 },
		{ restaurantId: 3, seating: 4, available: 1 },
		{ restaurantId: 3, seating: 6, available: 1 },

		{ restaurantId: 4, seating: 2, available: 1 },
		{ restaurantId: 4, seating: 4, available: 1 },
		{ restaurantId: 4, seating: 6, available: 1 },

		{ restaurantId: 5, seating: 2, available: 1 },
	]);

	console.log('Done!');
}

reset();
