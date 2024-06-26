const { Op, Sequelize } = require('sequelize');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

const Reservation = models.reservation;
const Restaurant = models.restaurant;
const Table = models.table;

/*
	Here you will can create the reservation
	1. It checks to make sure the user does not have overlapping reservations
	2. I don't do a check here again to see if the restaurants tables available, my assumption is that users would already have searched before coming here
	3. If I were to do check for table availability, I would utilize the same search functions for restaurants to check if I get any results

	We will assume the reservation name is tied to the user
*/

async function create(req, res) {

	const { body } = req;
	const reservationName = body.reservation_name;
	const restaurantId = body.restaurant_id;
	const time = body.time;
	const capacity = body.capacity;

	console.log(body);
	console.log(reservationName);

	if (!reservationName){
		return res.status(400).send(`Reservation Name (reservationName) is required`)
	}

	if (!restaurantId){
		return res.status(400).send(`Restaurant Name (restaurant_name) is required`)
	}

	if (!time){
		return res.status(400).send(`Time (time) is required`)
	}

	if (!capacity){
		return res.status(400).send(`Capacity (capacity) is required`)
	}
	

	// 2024-05-25 19:00:00
	const startTime = new Date(time).getTime();
	const endTime = startTime + 2 * 60 * 60 * 1000; // End time is 2 hours after start time


	console.log(startTime);
	console.log(startTime.toISOString);
	console.log(startTime.toDateString);

	const existingReservation = await Reservation.findOne({
		where: {
		  name: reservationName,
		  [Op.or]: [
			{
			  time: {
				[Op.between]: [startTime, endTime],
			  },
			},
			{
			  [Op.and]: [
				Sequelize.where(
				  Sequelize.literal(`"time" + (2 * 60 * 60 * 1000)`),
				  {
					[Op.between]: [startTime, endTime],
				  }
				),
			  ],
			},
			{
			  time: {
				[Op.lt]: startTime,
			  },
			  [Op.and]: [
				Sequelize.where(
				  Sequelize.literal(`"time" + (2 * 60 * 60 * 1000)`),
				  {
					[Op.gt]: endTime,
				  }
				),
			  ],
			},
		  ],
		},
	  });

	if (existingReservation) {
		return res.status(400).send(`There is an existing reservation that overlaps with the time you provided under your name. Please choose a time outside your existing reservation.`);
	}

	try {
		const reservation = await Reservation.create({
			name: reservationName,
			restaurantId: restaurantId,
			time: startTime,
			capacity: capacity
		});
		return res.status(200).json({ reservation });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ msg: 'Internal server error' });
	}
};

async function remove(req, res) {
	const id = getIdParam(req);
  
	console.log(id);
  
	try {
	  const deletedCount = await Reservation.destroy({
		where: {
		  id: id,
		},
	  });
  
	  if (deletedCount === 0) {
		return res.status(404).json({ msg: 'Reservation not found' });
	  }
  
	  return res.status(200).json({ msg: 'Successfully Deleted' });
	} catch (err) {
	  console.log(err);
	  return res.status(500).json({ msg: 'Internal server error' });
	}
  }

module.exports = {
	create,
	remove,
};
