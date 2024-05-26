const { Op, Sequelize } = require('sequelize');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

const Reservation = models.reservation;
const Restaurant = models.restaurant;
const Table = models.table;

async function search(req, res) {

	const { query } = req;

	const restaurantName = query.restaurant_name;
	const time = query.time;
	const reservationCapacity = query.capacity;
	const dietaryOptions = query.dietary_options;

	console.log(query);

	if (!restaurantName){
		return res.status(400).send(`Restaurant Name (restaurant_name) is required`)
	}

	if (!time){
		return res.status(400).send(`Time (time) is required`)
	}

	if (!reservationCapacity){
		return res.status(400).send(`Capacity (capacity) is required`)
	}

	if (!dietaryOptions){
		return res.status(400).send(`Dietary Options (dietary_options) is required`)
	}

	// 2024-05-25 19:00:00
	const startTime = new Date(time).getTime();

	const dietaryRequirements = {
		is_gluten_free_friendly: true,
		is_vegetarian_friendly: false,
		is_vegan_friendly: false,
		is_paleo_friendly: false,
	  };

	try {
		const restaurants = await Restaurant.findAll({
			where: dietaryRequirements,
			include: [
			  {
				model: Table,
				required: true,
				where: {
				  seating: {
					[Op.gte]: reservationCapacity,
				  },
				  available: {
					[Op.gt]: Sequelize.literal(`(
					  SELECT COUNT(*)
					  FROM "reservations"
					  WHERE "reservations"."restaurantId" = "restaurant"."id"
						AND "reservations"."time" BETWEEN '${startTime}' AND '${startTime + 2 * 60 * 60 * 1000}'
					)`),
				  },
				},
			  },
			  {
				model: Reservation,
				required: false,
				where: {
				  time: {
					[Op.notBetween]: [startTime, (startTime + 2 * 60 * 60 * 1000)],
				  },
				},
			  },
			],
		  });
	
  
		return res.status(200).json({ restaurants });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Internal server error' });
	}

};


module.exports = {
	search,
};
