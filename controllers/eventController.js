const { Event, Category, User } = require('../models');
const { Op } = require('sequelize')

class EventController {
    static async create(req, res, next) {
        const { name, dateAndTime, location, description, maxParticipants } = req.body;

        try {
            const result = await Event.create( { name, dateAndTime, location, description, maxParticipants })
            res.status(201).json(result);

        } catch (err) {
            next(err)
        }
    }

    static async findAll(req, res, next) {
        try {
            const { search, day, type, distance, category } = req.query;
            let condition = {};
            if (search) condition.name = { [Op.iLike]: `%${search}%` };
            if (day) condition.dayAndTime = { [Op.gte]: moment().subtract(7, 'days').toDate() };
            if (type === 'online') {
                condition.location = { [Op.iLike]: `%${online}%` };
            } else {
                condition.location = { [Op.iLike]: `%${type}%` };
            }
            if (distance) condition.location = { [Op.iLike]: `%${day}%` };

            if (category) condition.category = category;
            const result = await Event.findAll({
                where: condition,
                include:[{
                    model: Category,
                    attributes: ["name"]
                },
                {
                    model: User,
                    attributes: ["username"]
                }],
                order: [
                    ['id', 'DESC'],
                ],  
            })
            res.status(200).json(result)

        } catch (err) {
            next(err)
        }
    }
}

module.exports = EventController;