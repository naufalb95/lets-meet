const { Event } = require('../models')

const authorization = async (req, res, next) => {

    const userId = +req.user.id;
    const { eventId } = req.params;
    try {
        const foundEvent = await Event.findByPk(eventId);

        if (!foundEvent) {
            throw new Error("Event Not Found")
        }

        if (foundEvent.eventOrganizerId === userId) {
            next()
        }
        else {
            throw new Error("Access Denied")
        }

    } catch (err) {
        if (err.message === "Event Not Found") {
            res.status(404).json( { msg: "Event Not Found" } )
        } else if (err.message === "Access Denied") {
            res.status(403).json( { msg: "Not Enough Access" } )
        } else {
            res.status(500).json( { msg: err.message} )
        }
    }
}

module.exports = authorization;