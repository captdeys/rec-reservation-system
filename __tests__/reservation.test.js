const request = require('supertest');
const app = require('../express/app'); // Import your Express app
const sequelize = require('../sequelize');

describe('Reservation', () => {
  let Restaurant, Table, Reservation;

  beforeAll(async () => {
    // Get references to your Sequelize models
    Restaurant = models.restaurant;
    Table = models.table;
    Reservation = models.reservation;

    // Seed your database with test data
    await Restaurant.create({
      name: 'Test Restaurant',
      is_gluten_free_friendly: true,
      is_vegetarian_friendly: false,
      is_vegan_friendly: false,
      is_paleo_friendly: false,
    });

    await Table.create({
      restaurantId: 1,
      seating: 4,
      available: 2,
    });
  });

  afterAll(async () => {
    // Clean up the test data from the database
    await Restaurant.destroy({ truncate: true });
    await Table.destroy({ truncate: true });
    await Reservation.destroy({ truncate: true });
  });

  describe('POST /reservations', () => {
    it('should create a new reservation', async () => {
      const response = await request(app)
        .post('/reservations')
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
        .post('/reservations')
        .send({
          reservation_name: 'John Doe',
          time: new Date('2024-05-25 19:00:00').toISOString(),
          capacity: 2,
        });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Restaurant Name (restaurant_name) is required');
    });
  });

  describe('DELETE /reservations/:id', () => {
    let reservationId;

    beforeAll(async () => {
      const reservation = await Reservation.create({
        name: 'John Doe',
        capacity: 2,
        time: new Date('2024-05-25 19:00:00').getTime(),
        restaurantId: 1,
      });
      reservationId = reservation.id;
    });

    it('should delete an existing reservation', async () => {
      const response = await request(app).delete(`/reservations/${reservationId}`);

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Successfully Deleted');

      const deletedReservation = await Reservation.findByPk(reservationId);
      expect(deletedReservation).toBeNull();
    });

    it('should return an error if the reservation does not exist', async () => {
      const nonExistingId = 999;
      const response = await request(app).delete(`/reservations/${nonExistingId}`);

      expect(response.status).toBe(500);
      expect(response.body.msg).toBe('Internal server error');
    });
  });
});
