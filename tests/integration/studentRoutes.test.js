const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Student = require('../../models/studentModel');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Integration Test: Student Routes', () => {
  let createdStudentId;

  it('should create a new student', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({ name: 'Test User', age: 22, grade: 'A', email: 'testuser@kiit.ac.in' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');
    createdStudentId = res.body._id;
  });

  it('should fetch all students', async () => {
    const res = await request(app).get('/api/students');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a student', async () => {
    const res = await request(app)
      .put(`/api/students/${createdStudentId}`)
      .send({ name: 'Updated User' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated User');
  });

  it('should delete a student', async () => {
    const res = await request(app).delete(`/api/students/${createdStudentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
