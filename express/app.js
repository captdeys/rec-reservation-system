const express = require('express');
const bodyParser = require('body-parser');

const RestaurantController = require("./routes/restaurant");
const ReservationController = require("./routes/reservation");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

// We provide a root route just as an example
app.get('/', (req, res) => {
	res.send(`
		<h2>Hello World</h2>
	`);
});

app.get(
	`/api/restaurant/search`,
	makeHandlerAwareOfAsyncErrors(RestaurantController.search)
);

app.post(
	`/api/reservation/`,
	makeHandlerAwareOfAsyncErrors(ReservationController.create)
);

app.delete(
	`/api/reservation/:id`,
	makeHandlerAwareOfAsyncErrors(ReservationController.remove)
);

module.exports = app;
