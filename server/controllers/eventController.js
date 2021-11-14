const { Event, Category, User, Participant } = require("../models");
const { Op } = require("sequelize");
const cron = require('node-cron');

const CRON_SCHEDULER = {}


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


    console.log(req.body.dateAndTime, "<<< date and time");

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
      })

      let dateInput = req.body.dateAndTime

      let minute = dateInput.slice(14, 16)
      let hour = dateInput.slice(11, 13)
      let day = dateInput.slice(8, 10)
      let month = dateInput.slice(5, 7)

      console.log(minute, " ", hour, " ", day, " ", month, " ");

      CRON_SCHEDULER[result.id] = cron.schedule(`${minute} ${hour} ${day} ${month} *`, () => {
        console.log('Running on');
      }, {
        scheduled: false,
        timezone: "Asia/Jakarta"
      });

      // console.log(CRON_SCHEDULER, "ISI POST")

      CRON_SCHEDULER[result.id].start()

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
        if (day == "tomorrow") {
          let today = new Date();
          let tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(23, 59, 59, 59);
          condition.dateAndTime = {
            [Op.between]: [today, tomorrow]
          };
        }
        if (day == "today") {
          let today = new Date();
          condition.dateAndTime = {
            [Op.between]: [
              today.setHours(0, 0, 0, 0),
              today.setHours(23, 59, 59, 0),
            ],
          };
        }
        if (day == "thisWeek") {
          let today = new Date();
          let sunday = new Date();
          sunday.setDate(sunday.getDate() + (7 - sunday.getDay()));
          sunday.setHours(23, 59, 59, 59);
          condition.dateAndTime = {
            [Op.between]: [today, sunday],
          };
        }
        if (day == "nextWeek") {
          let sundayFirst = new Date();
          sundayFirst.setDate(
            sundayFirst.getDate() + (7 - sundayFirst.getDay())
          );
          sundayFirst.setHours(23, 59, 59, 59);
          let sundayLast = new Date();
          sundayLast.setDate(sundayLast.getDate() + (14 - sundayLast.getDay()));
          sundayLast.setHours(23, 59, 59, 59);
          condition.dateAndTime = {
            [Op.between]: [sundayFirst, sundayLast],
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
    try {
      const { eventId } = req.params;
      const event = await Event.findByPk(eventId, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      const eventOrganizer = await User.findByPk(event.eventOrganizerId, {
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
      const participants = await Participant.findAll({
        where: { eventId: event.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      res.status(200).json({ event, eventOrganizer, participants });
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


      CRON_SCHEDULER[id].stop();

      delete CRON_SCHEDULER[id]

      let dateInput = req.body.dateAndTime

      let minute = dateInput.slice(14, 16)
      let hour = dateInput.slice(11, 13)
      let day = dateInput.slice(8, 10)
      let month = dateInput.slice(5, 7)

      console.log(minute, " ", hour, " ", day, " ", month, " ");

      CRON_SCHEDULER[id] = cron.schedule(`${minute} ${hour} ${day} ${month} *`, () => {
        console.log('Running a job (edit)');
      }, {
        scheduled: false,
        timezone: "Asia/Jakarta"
      });

      CRON_SCHEDULER[id].start()




      res.status(200).json(eventResult);
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    console.log('delete triggered')

    const { eventId } = req.params;
    try {
      const foundEvent = await Event.findByPk(eventId);
      await Event.destroy({ where: { id: eventId } });
      const result = `Event ${foundEvent.name} has been deleted`;

      CRON_SCHEDULER[eventId].stop();

      console.log(CRON_SCHEDULER, "cek");

      //  CRON_SCHEDULER[eventId].destroy()

      delete CRON_SCHEDULER[eventId]

      //  console.log(CRON_SCHEDULER);

      res.status(200).json({ result });
    } catch (err) {
      console.log(err);
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
      next(err);
    }
  }
}

module.exports = EventController;
