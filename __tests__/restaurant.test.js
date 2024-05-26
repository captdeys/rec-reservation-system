const request = require('supertest');
const app = require('../express/app'); // Import your Express app
const sequelize = require('../sequelize');

describe('Reservation Search', () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Seed your database with test data
    await sequelize.models.restaurant.bulkCreate([
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


    await sequelize.models.table.bulkCreate([
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

    await sequelize.models.reservation.bulkCreate([
      {
        name: 'John Doe',
        capacity: 2,
        time: new Date('2024-05-27 18:00:00').getTime(),
        restaurantId: 1,
      },
    ]);
  });

  afterAll(async () => {
    // Clean up the test data from the database
    await sequelize.models.restaurant.destroy({ truncate: true });
    await sequelize.models.table.destroy({ truncate: true });
    await sequelize.models.reservation.destroy({ truncate: true });
  });

  it('should return restaurants with available tables and matching dietary requirements', async () => {
    const response = await request(app)
      .get('/api/restaurant/search')
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
      .get('/api/restaurant/search')
      .query({
        time: new Date('2024-05-25 20:00:00').toISOString(),
        capacity: 4,
        dietary_options: 'gluten_free',
      });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Restaurant Name (restaurant_name) is required');
  });
});
