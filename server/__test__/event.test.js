const request = require('supertest')
const app = require("../app")
const { createToken } = require('../helpers/jwt')
const { Event, User, Category } = require('../models')
const sign = require('../helpers/jwt');

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
})

beforeAll( async () => {

    
})