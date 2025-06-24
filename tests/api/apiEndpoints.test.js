// tests/api/apiEndpoints.test.js
jest.setTimeout(30000);
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

// Import app _after_ setting NODE_ENV
const app = require('../../app');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Connect Mongoose to in-memory server
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('API CRUD Tests for /api/students', () => {
  let studentId;

  // Seed one record so GET returns >0
  beforeEach(async () => {
    const res = await request(app)
      .post('/api/students')
      .send({
        name: 'Seed User',
        age: 30,
        grade: 'A',
        email: 'seed@user.com'
      });
    studentId = res.body._id;
  });

  afterEach(async () => {
    // Clear collection
    await mongoose.connection.db.collection('students').deleteMany({});
  });

  it('POST   /api/students → create student', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({ name: 'John', age: 21, grade: 'B', email: 'john@doe.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('GET    /api/students → all students', async () => {
    const res = await request(app).get('/api/students');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET    /api/students/:id → single student', async () => {
    const res = await request(app).get(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(studentId);
  });

  it('PUT    /api/students/:id → update student', async () => {
    const res = await request(app)
      .put(`/api/students/${studentId}`)
      .send({ grade: 'C' });
    expect(res.statusCode).toBe(200);
    expect(res.body.grade).toBe('C');
  });

  it('DELETE /api/students/:id → delete student', async () => {
    const res = await request(app).delete(`/api/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Student deleted successfully');

  });
});
