const { Event } = require("../models");

const authorization = async (req, res, next) => {
  const userId = +req.user.id;
  const { eventId } = req.params;
  try {
    const foundEvent = await Event.findByPk(eventId);

    if (!foundEvent) {
      throw { name: "Event Not Found" };
    }

    if (foundEvent.eventOrganizerId === userId) {
      next();
    } else {
      throw { name: "Access Denied" };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authorization;
