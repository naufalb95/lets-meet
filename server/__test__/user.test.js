const request = require('supertest');
const app = require('../app');
const { User, Category, Event } = require('../models');

describe('Register fiture', () => {
    test('register success', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "test@test.com",
                password: "test",
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body).toEqual({"message": "Success create account, username: test"});
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('register invalid cause username not given', (done) => {
        request(app)
            .post('/users/register')
            .send({
                email: "test228@gmail.com",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Username is required"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause username already registered', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "test228@gmail.com",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Username must be unique"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause username validation not met', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test test",
                email: "test228@gmail.com",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "maximum 16 characters allowed and no space allowed in username."});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause email not given', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Email is required"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause password not given', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "test1@gmail.com",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Password is required"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause email empty', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Email is required"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause password empty', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "test@gamil.com",
                password: "",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Password is required"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause email already registered', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test112",
                email: "test@test.com",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Email must be unique"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause email invalid', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "test",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Invalid email format"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })

    test('register invalid cause username already regitered', (done) => {
        request(app)
            .post('/users/register')
            .send({
                username: "test",
                email: "test@gmail.com",
                password: "test1",
            })

        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body).toEqual({"message": "Username must be unique"});
            done()
        })

        .catch((err) => {
            done(err)
        })
    })
})

describe('Login fiture', () => {
    test('login success', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: "test@test.com",
                password: "test",
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("access_token", expect.any(String))
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('login invalid cause wrong password', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: "test@test.com",
                password: "test2",
            })

        .then((res) => {
            expect(res.status).toBe(401);
            expect(res.body).toEqual({"message": "Invalid email / password"});
            done();
        })

        .catch((err) => {
            done(err)
        })
    })

    test('login invalid cause wrong email', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: "test123@test.com",
                password: "test2",
            })

        .then((res) => {
            expect(res.status).toBe(401);
            expect(res.body).toEqual({"message": "Invalid email / password"});
            done();
        })

        .catch((err) => {
            done(err)
        })
    })

    test('login invalid cause email not registered', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: "test123@test.com",
                password: "test2",
            })

        .then((res) => {
            expect(res.status).toBe(401);
            expect(res.body).toEqual({"message": "Invalid email / password"});
            done();
        })

        .catch((err) => {
            done(err)
        })
    })
})

beforeAll( async () => {
    await User.destroy({
        where: {
            email: 'test@test.com'
        }
    })
})

afterAll( async ()=>{
    await User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
})
