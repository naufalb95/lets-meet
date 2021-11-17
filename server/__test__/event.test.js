const request = require('supertest')
const app = require("../app")
const { Event, User, Category, Participant } = require('../models')
const { sign } = require('../helpers/jwt');
const access_token = sign({ id: 1, email: 'usertest@mail.com' })
const access_token2 = sign({ id: 2, email: 'usertest1@mail.com' })
const access_token3 = sign({ id: 3, email: 'usertest2@mail.com' })
const invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBtYWlsLmNvbSIsImlhdCI6MTYzNjkyNjUyNn0.l4F5cE2MzymVxZMndO83F3N0OqHszlnNzj9qQoC"

beforeAll(async () => {
    jest.restoreAllMocks();

    await User.create({
        username: 'testevent',
        email: 'usertest@mail.com',
        password: '12345678',
    })

    await User.create({
        username: 'testevent1',
        email: 'usertest1@mail.com',
        password: '12345678',
    })

    await User.create({
        username: 'testevent2',
        email: 'usertest2@mail.com',
        password: '12345678',
    })

    await Category.create({
        name: "Technology",
    })

    await Category.create({
        name: "Hobby",
    })

    await Event.create({
        name: 'Jakarta Professional Development Meetup Group',
        dateAndTime: '2021-11-20 16:00:00.000 +0700',
        location: 'Offline',
        description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
        maxParticipants: 50,
        imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
        categoryId: 1,
        isDone: false,
        eventOrganizerId: 1,
        isDone: false,
        "tokenChat": "",
        "longitude": "106.85553068718718",
        "latitude": "-6.228343404007166"
    })

    await Event.create({
        name: 'Intro To Data Science: Online Workshop',
        dateAndTime: '2022-11-28 16:00:00.000 +0700',
        location: 'Online',
        description: 'Join Flatiron School for an introductory workshop on how to use simple and multiple linear regression models from data science instructors. It will be important to understand the relationship between multiple variables in order to make future predictions on behaviors.',
        maxParticipants: 0,
        imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
        categoryId: 2,
        eventOrganizerId: 1,
        isDone: false,
        "tokenChat": "",
        "longitude": "",
        "latitude": ""
    })

    await Event.create({
        name: 'Intro To Data Science: Online Workshop',
        dateAndTime: '2022-01-01 16:00:00.000 +0700',
        location: 'Online',
        description: 'Join Flatiron School for an introductory workshop on how to use simple and multiple linear regression models from data science instructors. It will be important to understand the relationship between multiple variables in order to make future predictions on behaviors.',
        maxParticipants: 30,
        imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
        categoryId: 2,
        eventOrganizerId: 1,
        isDone: false,
        "tokenChat": "",
        "longitude": "106.8957853",
        "latitude": "-6.2146223"
    })

    await Participant.create({
        userId: 2,
        eventId: 1,
    })
})

afterAll(async () => {
    await User.destroy({
        where: {
            email: 'testevent@test.com'
        }
    })

    await User.destroy({
        where: {
            email: 'testevent1@test.com'
        }
    })

    await User.destroy({
        where: {
            email: 'testevent2@test.com'
        }
    })

    await Category.destroy({
        where: {
            name: 'Technology'
        }
    })

    await Event.destroy({
        where: {
            name: 'Jakarta Professional Development Meetup Group'
        }
    })

    await Event.destroy({
        where: {
            name: 'Intro To Data Science: Online Workshop'
        }
    })

    await Participant.destroy({
        where: {
            eventId: 1
        }
    })

    await Category.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })

    await User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })

    await Event.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })

    await Participant.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true
    })
})

describe('Event fiture', () => {
    test('Get All Item Without Filter', (done) => {
        request(app)
            .get('/events')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item With 1 Query Filter ', (done) => {
        request(app)
            .get('/events?day=today')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item With 2 Query Filter ', (done) => {
        request(app)
            .get('/events?eventName=Jakarta Professional Development Meetup Group&day=nextWeek')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item With 3 Query Filter ', (done) => {
        request(app)
            .get('/events?eventName=Jakarta Professional Development Meetup Group&day=tomorrow&location=Semarang')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item With 4 Query Filter ', (done) => {
        request(app)
            .get('/events?eventName=Jakarta Professional Development Meetup Group&day=thisWeek&location=Semarang&category=1')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item With Query Location Online ', (done) => {
        request(app)
            .get('/events?location=Online')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item With Query Location Offline ', (done) => {
        request(app)
            .get('/events?location=Offline&distance=10&latitude=-6.161683&longitude=106.8415304')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Item If Empty Data Result', (done) => {
        request(app)
            .get('/events')
            .query({
                filter: {
                    eventName: "Gionya Damar",
                    day: "",
                    location: "",
                    category: ""
                },
            })

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get Event Detail by Id', (done) => {
        request(app)
            .get('/events/1')
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Get Event Detail by Id Cause Invalid Id Event', (done) => {
        request(app)
            .get('/events/100')
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ "message": "Event Not Found" });
                done()
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Create New Event With Location Offline', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event Offline',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Offline',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 5,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
                "tokenChat": "",
                "longitude": "106.8492431375419",
                "latitude": "-6.16070502742932"
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Create New Event With Location Online', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event Online',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Online',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
                "tokenChat": "",
                "longitude": "",
                "latitude": ""
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Not Login', (done) => {
        request(app)
            .post('/events')
            .send({
                name: 'Test Create Event',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Bandung',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ "message": "Something Wicked Happened" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Invalid Jwt Token', (done) => {
        request(app)
            .post('/events')
            .send({
                name: 'Test Create Event',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Bandung',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .set({ access_token: invalid_token })
            .then((res) => {
                expect(res.status).toBe(401);
                expect(res.body).toEqual({ "message": "Invalid JWT Token" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Empty Name', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: '',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Bandung',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Name is required." });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Empty Date And Time', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event',
                dateAndTime: '',
                location: 'Bandung',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Date is required." });
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Empty Location', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: '',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Location is required." });
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Empty Description', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Bandung',
                description: '',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Description is required." });
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Empty Max Participant', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Bandung',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Max participant is required." });
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Fail Create New Event Cause Empty Category', (done) => {
        request(app)
            .post('/events')
            .set({ access_token })
            .send({
                name: 'Test Create Event',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Bandung',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 50,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "Category is required." });
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Join Event', (done) => {
        request(app)
            .post('/events/1')
            .set({ access_token })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Join Event Fail Cause Invalid Id Event', (done) => {
        request(app)
            .post('/events/100')
            .set({ access_token })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ "message": "Event Not Found" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Join Event Fail Cause User Have Been Joined Event', (done) => {
        request(app)
            .post('/events/1')
            .set({ access_token })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: "You Have Joined This Event" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Join Event Fail Cause Full Participant', (done) => {
        request(app)
            .post('/events/2')
            .set({ access_token: access_token3 })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ message: `Event Full` });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Edit Event With Location Offline', (done) => {
        request(app)
            .put('/events/4')
            .set({ access_token })
            .send({
                name: 'Test Edit',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                description: 'Ddescription Test Edit Event',
                maxParticipants: 30,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Edit Event With Location online', (done) => {
        request(app)
            .put('/events/5')
            .set({ access_token })
            .send({
                name: 'Test Edit',
                dateAndTime: '2021-12-19 16:00:00.000 +0700',
                description: 'Ddescription Test Edit Event',
                maxParticipants: 30,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Edit Event Fail Cause Event Id Invalid', (done) => {
        request(app)
            .put('/events/300')
            .set({ access_token })
            .send({
                name: 'Test Edit',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Solo',
                description: 'Ddescription Test Edit Event',
                maxParticipants: 30,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ message: 'Event Not Found' });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Edit Event Fail Because Forbidden Access', (done) => {
        request(app)
            .put('/events/3')
            .set({ access_token: access_token2 })
            .send({
                name: 'Test Edit',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Solo',
                description: 'Ddescription Test Edit Event',
                maxParticipants: 30,
                imgUrl: 'https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png',
                categoryId: 1,
                isDone: false,
            })
            .then((res) => {
                expect(res.status).toBe(403);
                expect(res.body).toEqual({ "message": "Not Enough Access" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Make Status Event Done', (done) => {
        request(app)
            .patch('/events/4')
            .set({ access_token })
            .send({
                isDone: 'true'
            })

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Make Status Event Done Fail Cause Event Not Found', (done) => {
        request(app)
            .patch('/events/400')
            .set({ access_token })
            .send({
                isDone: 'true'
            })

            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ "message": "Event Not Found" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Make Status Event Done Fail Cause Forbidden Access', (done) => {
        request(app)
            .patch('/events/4')
            .set({ access_token: access_token2 })
            .send({
                isDone: 'true'
            })

            .then((res) => {
                expect(res.status).toBe(403);
                expect(res.body).toEqual({ "message": "Not Enough Access" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Delete Event With Location Offline', (done) => {
        request(app)
            .delete('/events/4')
            .set({ access_token })

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Delete Event With Location Online', (done) => {
        request(app)
            .delete('/events/5')
            .set({ access_token })

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Delete Event Fail Because Invalid Id Event', (done) => {
        request(app)
            .delete('/events/100')
            .set({ access_token })

            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ message: 'Event Not Found' });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Delete Event Fail Because Forbidden Access', (done) => {
        request(app)
            .delete('/events/2')
            .set({ access_token: access_token2 })

            .then((res) => {
                expect(res.status).toBe(403);
                expect(res.body).toEqual({ "message": "Not Enough Access" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Leave Event', (done) => {
        request(app)
            .delete('/events/1/participants')
            .set({ access_token })

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({ "message": "testevent Succes Left Jakarta Professional Development Meetup Group Event" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('User Leave Event Fail Because User Never Join This Event', (done) => {
        request(app)
            .delete('/events/2/participants')
            .set({ access_token })

            .then((res) => {
                expect(res.status).toBe(404);
                expect(res.body).toEqual({ message: "You never joined this event" });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get All Category', (done) => {
        request(app)
            .get('/categories')

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get My Event', (done) => {
        request(app)
            .get('/myevent')
            .set({ access_token })

            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Array));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test("Error 500 When Get My Event", async () => {
        jest.spyOn(Event, "findAll").mockRejectedValue("Error");

        return request(app)
            .get("/myevent")
            .set({ access_token })

            .then((res) => {
                const { body, status } = res
                expect(status).toBe(500)
                expect(body).toEqual(expect.any(Object));
                expect(res.body).toEqual({ "message": "Internal server error." });
            })
    })

    test('Suucessfully Get Token Chat', (done) => {
        request(app)
            .get('/create_chat_token?channelName=test&uid=damar')
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get Chat Token Failed Because Empty channelName', (done) => {
        request(app)
            .get('/create_chat_token?uid=damar')
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual(expect.any(Object));
                expect(res.body).toEqual({ error: 'channel is required' });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Suucessfully Get Video Token', (done) => {
        request(app)
            .get('/create_video_token?channelName=test&uid=damar')
            .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    test('Get Video Token Failed Because Empty channelName', (done) => {
        request(app)
            .get('/create_video_token?uid=damar')
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toEqual(expect.any(Object));
                expect(res.body).toEqual({ error: 'channel is required' });
                done();
            })
            .catch((err) => {
                done(err)
            })
    })

    // test("Add Event Success with Image Kit", async () => {
    //     const filePath = "assets/image.png";
    //     const buffer = Buffer.from(filePath);

    //     const { status, body } = await request(app)
    //       .post("events")
    //       .set({access_token})


    //     expect(status).toBe(201);
    //     expect(body).toEqual(expect.any(Object));
    //     expect(body).toHaveProperty("name");
    //     expect(body).toHaveProperty("dateAndTime");
    //     expect(body).toHaveProperty("location");
    //     expect(body).toHaveProperty("description");
    //     expect(body).toHaveProperty("maxParticipants");
    //     expect(body).toHaveProperty("eventOrganizerId");
    //     expect(body).toHaveProperty("isDone");
    //   })

    // test('Create New Event With Image Kit', (done) => {
    //     const filePath = "assets/image.png";
    //     const buffer = Buffer.from(filePath);

    //     request(app)
    //         .post('/events')
    //         .set({ access_token })
    //         .attach("imgUrl", buffer, "image.png")
    //         .then((res) => {
    //             expect(res.status).toBe(201);
    //             expect(res.body).toEqual(expect.any(Object));
    //             expect(body).toHaveProperty("name");
    //             expect(body).toHaveProperty("dateAndTime");
    //             expect(body).toHaveProperty("location");
    //             expect(body).toHaveProperty("description");
    //             expect(body).toHaveProperty("maxParticipants");
    //             expect(body).toHaveProperty("eventOrganizerId");
    //             expect(body).toHaveProperty("isDone");
    //             done();
    //         })

    //         .catch((err) => {
    //             done(err)
    //         })
    // })

    test('Create New Event With Image Kit', (done) => {
        const filePath = "assets/image.png";
        const buffer = Buffer.from(filePath);
        request(app)
            .post('/events')
            .set({ access_token })
            .field({
                name: 'Test Create Event Offline',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Offline',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 5,
                categoryId: 1,
                isDone: false,
                "tokenChat": "",
                "longitude": "106.8492431375419",
                "latitude": "-6.16070502742932"
            })
            .attach("imgUrl", buffer, "image.png")
            .then((res) => {
                console.log(res.body, "ini body");
                expect(res.status).toBe(201);
                expect(res.body).toEqual(expect.any(Object));
                done();
            })
            .catch((err) => {
                console.log(err, "<<<<<<<<<<<");
                done(err)
            })
    })

    test('Create New Event But Upload Wrong Image', (done) => {
        const filePath = "assets/REACT_JS.TXT";
        const buffer = Buffer.from(filePath);
        request(app)
            .post('/events')
            .set({ access_token })
            .field({
                name: 'Test Create Event Offline',
                dateAndTime: '2022-01-01 16:00:00.000 +0700',
                location: 'Offline',
                description: 'Welcome tech lovers far and wide! We’re an online and in-person tech-enthusiast group hosting live speaking events on a range of tech topics. You can join us in person if possible or on one of our live streams. Look out for our virtual happy hours and other networking events.',
                maxParticipants: 5,
                categoryId: 1,
                isDone: false,
                "tokenChat": "",
                "longitude": "106.8492431375419",
                "latitude": "-6.16070502742932"
            })
            .attach("imgUrl", buffer, "REACT_JS.TXT")
            .then((res) => {
                console.log(res.body, "ini body");
                expect(res.status).toBe(400);
                expect(res.body).toEqual({ error: 'The format besides jpg, jpeg and png is not acceptable' });
                done();
            })
            .catch((err) => {
                console.log(err, "<<<<<<<<<<<");
                done(err)
            })
    })

    test("Error Image Kit", async () => {
        jest.spyOn(Event, "create").mockRejectedValue("Error");

        return request(app)
            .post("/events")
            .set({ access_token })
            

            .then((res) => {
                const { body, status } = res
                expect(status).toBe(500)
                expect(body).toEqual(expect.any(Object));
                expect(res.body).toEqual({ "message": "Internal server error." });
            })
    })


})