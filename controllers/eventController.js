const { Event, Category, User, Participant } = require("../models");
const { Op } = require("sequelize");
const thisWeek = require("../helpers/thisWeek");
const date = require("date-and-time");

class EventController {
  static async create(req, res, next) {
    const {
      name,
      dateAndTime,
      location,
      description,
      maxParticipants,
      categoryId,
    } = req.body;
    const imgUrl = req.body.imgUrl
      ? req.body.imgUrl
      : "https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png";
    const eventOrganizerId = req.user.id;
    try {
      const result = await Event.create({
        name,
        dateAndTime,
        location,
        description,
        maxParticipants,
        imgUrl,
        categoryId,
        eventOrganizerId,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async findAll(req, res, next) {
    try {
      const { eventName, day, location, distance, category } = req.query;
      let condition = {};
      if (eventName) condition.name = { [Op.iLike]: `%${eventName}%` };
      if (category) condition.categoryId = category;
      if (location) {
        if (location == "online") {
          condition.location = "online";
        } else {
          condition.location = { [Op.iLike]: `%${location}%` };
        }
      }

      if (day) {
        if (day == "this week") {
          condition.dateAndTime = {
            [Op.between]: [new Date(), thisWeek(new Date())],
          };
        }
        if (day == "tomorrow") {
          condition.dateAndTime = {
            [Op.between]: [new Date(), tomorrow],
          };
        }
      }
      const result = await Event.findAll({
        where: condition,
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
        ],
        order: [["id", "ASC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async userJoinEvent(req, res, next) {
    const userId = req.user.id;
    const { eventId } = req.params;
    try {
      const foundUser = await User.findByPk(userId);
      const foundEvent = await Event.findByPk(eventId);
      await Participant.create({ userId, eventId });
      const result = `${foundUser.username} Succes Join Event ${foundEvent.name}`;
      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async detailEvent(req, res, next) {
    const { eventId } = req.params;
    try {
      const result = await Event.findByPk(eventId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async updateEvent(req, res, next) {
    const {
      name,
      dateAndTime,
      location,
      description,
      maxParticipants,
      categoryId,
    } = req.body;
    const id = req.params.eventId;

    try {
      const result = await Event.update(
        {
          name,
          dateAndTime,
          location,
          description,
          maxParticipants,
          categoryId,
        },
        {
          where: { id },
          returning: true,
        }
      );

      const eventResult = result[1][0];
      res.status(200).json(eventResult);
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    const { eventId } = req.params;
    try {
      const foundEvent = await Event.findByPk(eventId);
      await Event.destroy({ where: { id: eventId } });
      const result = `Event ${foundEvent.name} has been deleted`;
      res.status(200).json({ result });
    } catch (err) {
      next(err);
    }
  }

  static async userLeaveEvent(req, res, next) {
    const userId = req.user.id;
    const { eventId } = req.params;
    try {
      const foundUser = await User.findByPk(userId);
      const foundEvent = await Event.findByPk(eventId);
      const foundPartipant = await Participant.findOne({
        where: { userId, eventId },
      });

      if (foundPartipant) {
        await Participant.destroy({ where: { userId, eventId } });
        const result = `${foundUser.username} Succes Left ${foundEvent.name} Event`;
        res.status(200).json({ result });
      } else {
        res.status(404).json({ message: "You never joined this event" });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = EventController;
