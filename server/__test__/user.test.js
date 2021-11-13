const request = require('supertest');
const app = require('../app');
const {User, Event, Participant} = require('../models');

describe('User fiture', () => {
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
})

beforeAll(() => {
    User.destroy({
        where: {
            email: 'test@test.com'
        }
    })
    // async () => await Product.create( { name: 'test', description: 'test', price: 111111, imgUrl: 'test', CategoryId: 1, AuthorId: 242 })
    // async () => await Product.create( { name: 'test', description: 'test', price: 111111, imgUrl: 'test', CategoryId: 1, AuthorId: 242 })
    
    // Product.destroy({
    //     where: {}
    // })
})