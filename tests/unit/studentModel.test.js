const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Student = require('../../models/studentModel');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Student.deleteMany(); // Clean up after each test
});

describe('Student Model Unit Tests (in-memory)', () => {
  it('should create a student with valid fields', async () => {
    const student = new Student({
      name: 'Test Student',
      age: 20,
      grade: 'A',
      email: 'test@student.com',
    });

    const savedStudent = await student.save();

    expect(savedStudent._id).toBeDefined();
    expect(savedStudent.name).toBe('Test Student');
    expect(savedStudent.age).toBe(20);
    expect(savedStudent.grade).toBe('A');
    expect(savedStudent.email).toBe('test@student.com');
  });

  it('should throw validation error for missing required fields', async () => {
    const student = new Student({});
    let err;
    try {
      await student.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.name).toBe('ValidationError');
  });

  it('should not allow invalid email format', async () => {
    const student = new Student({
      name: 'Invalid Email',
      age: 22,
      grade: 'B',
      email: 'invalid-email',
    });

    let err;
    try {
      await student.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors?.email).toBeDefined();
  });
});
