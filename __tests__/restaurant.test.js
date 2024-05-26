const request = require('supertest');
const app = require('../express/app'); // Import your Express app
const { models } = require('../sequelize'); // Import your Sequelize models

describe('Reservation Search', () => {
  let Restaurant, Table, Reservation;

  beforeAll(async () => {
    // Get references to your Sequelize models
    Restaurant = models.restaurant;
    Table = models.table;
    Reservation = models.reservation;

    // Seed your database with test data
    await Restaurant.bulkCreate([
      {
        name: 'Restaurant A',
        is_gluten_free_friendly: true,
        is_vegetarian_friendly: false,
        is_vegan_friendly: false,
        is_paleo_friendly: false,
      },
      {
        name: 'Restaurant B',
        is_gluten_free_friendly: true,
        is_vegetarian_friendly: true,
        is_vegan_friendly: false,
        is_paleo_friendly: false,
      },
    ]);

    await Table.bulkCreate([
      {
        restaurantId: 1,
        seating: 4,
        available: 2,
      },
      {
        restaurantId: 2,
        seating: 6,
        available: 3,
      },
    ]);

    await Reservation.bulkCreate([
      {
        name: 'John Doe',
        capacity: 2,
        time: new Date('2024-05-25 18:00:00').getTime(),
        restaurantId: 1,
      },
    ]);
  });

  afterAll(async () => {
    // Clean up the test data from the database
    await Restaurant.destroy({ truncate: true });
    await Table.destroy({ truncate: true });
    await Reservation.destroy({ truncate: true });
  });

  it('should return restaurants with available tables and matching dietary requirements', async () => {
    const response = await request(app)
      .get('/reservations/search')
      .query({
        restaurant_name: 'Restaurant A',
        time: new Date('2024-05-25 20:00:00').toISOString(),
        capacity: 4,
        dietary_options: 'gluten_free',
      });

    expect(response.status).toBe(200);
    expect(response.body.restaurants).toHaveLength(1);
    expect(response.body.restaurants[0].name).toBe('Restaurant A');
  });

  it('should return an error if required parameters are missing', async () => {
    const response = await request(app)
      .get('/reservations/search')
      .query({
        time: new Date('2024-05-25 20:00:00').toISOString(),
        capacity: 4,
        dietary_options: 'gluten_free',
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Restaurant Name (restaurant_name) is required');
  });
});
