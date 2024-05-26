const request = require('supertest');
const app = require('../express/app'); // Import your Express app
const sequelize = require('../sequelize');

describe('Reservation', () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Seed your database with test data
    await sequelize.models.restaurant.create({
      name: 'Test Restaurant',
      is_gluten_free_friendly: true,
      is_vegetarian_friendly: false,
      is_vegan_friendly: false,
      is_paleo_friendly: false,
    });

    await sequelize.models.table.create({
      restaurantId: 1,
      seating: 4,
      available: 2,
    });
  });

  afterAll(async () => {
    // Clean up the test data from the database
    await sequelize.models.restaurant.destroy({ truncate: true });
    await sequelize.models.table.destroy({ truncate: true });
    await sequelize.models.reservation.destroy({ truncate: true });
  });

  describe('POST /reservation', () => {
    it('should create a new reservation', async () => {
      const response = await request(app)
        .post('/api/reservation')
        .send({
          reservation_name: 'John Doe',
          restaurant_id: 1,
          time: new Date('2024-05-25 19:00:00').toISOString(),
          capacity: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.reservation.name).toBe('John Doe');
      expect(response.body.reservation.restaurantId).toBe(1);
      expect(response.body.reservation.capacity).toBe(2);
    });

    it('should return an error if required parameters are missing', async () => {
      const response = await request(app)
        .post('/api/reservation')
        .send({
          reservation_name: 'John Doe',
          time: new Date('2024-05-25 19:00:00').toISOString(),
          capacity: 2,
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Restaurant Name (restaurant_name) is required');
    });
  });

  describe('DELETE /reservation/:id', () => {
    let reservationId;

    beforeAll(async () => {
      const reservation = await sequelize.models.reservation.create({
        name: 'John Doe',
        capacity: 2,
        time: new Date('2024-05-25 19:00:00').getTime(),
        restaurantId: 1,
      });
      reservationId = reservation.id;
    });

    it('should delete an existing reservation', async () => {
      const response = await request(app).delete(`/api/reservation/${reservationId}`);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Successfully Deleted');

      const deletedReservation = await sequelize.models.reservation.findByPk(reservationId);
      expect(deletedReservation).toBeNull();
    });

    it('should return an error if the reservation does not exist', async () => {
      const nonExistingId = 999;
      const response = await request(app).delete(`/api/reservation/${nonExistingId}`);

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('Reservation not found');
    });
  });
});
