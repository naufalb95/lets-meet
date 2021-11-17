const { Event, Category, User, Participant } = require("../models");
const { Op } = require("sequelize");
// const cron = require("node-cron");
const {RtmTokenBuilder, RtmRole, RtcRole, RtcTokenBuilder} = require('agora-access-token');
const APP_ID = "bba821c9f0374c0a86b015c0668097d8";
const APP_CERTIFICATE = "07331de6cdcb4a3ebe1686214c79921c";

// const CRON_SCHEDULER = {};

class EventController {
    static async create(req, res, next) {
        const {
        name,
        dateAndTime,
        location,
        description,
        maxParticipants,
        categoryId,
        longitude,
        latitude,
        } = req.body;

        const imgUrl = req.body.imgUrl ? req.body.imgUrl : "https://www.belfercenter.org/themes/belfer/images/event-default-img-med.png";
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
                longitude,
                latitude,
            });

        // if (location === "Online") {
        //     let dateInput = req.body.dateAndTime;

        //     let minute = dateInput.slice(14, 16);
        //     let hour = dateInput.slice(11, 13);
        //     let day = dateInput.slice(8, 10);
        //     let month = dateInput.slice(5, 7);

        //     CRON_SCHEDULER[result.id] = cron.schedule(
        //     `${minute} ${hour} ${day} ${month} *`,
        //     () => {
        //         console.log("Running on");
        //     },
        //     {
        //         scheduled: false,
        //         timezone: "Asia/Jakarta",
        //     }
        //     );

        //     CRON_SCHEDULER[result.id].start();
        // }

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    static async findAll(req, res, next) {
        try {
            const { eventName, day, location, distance, category, latitude, longitude } = req.query;
            let condition = {};
            
            if (eventName) {
                condition.name = { [Op.iLike]: `%${eventName}%` };
            }

            if (category) {
                condition.categoryId = category;
            }

            if (location === "Online") {
                condition.location = "Online";
            } else if (location === "Offline") {
                condition.location = "Offline";
            }

            if (day) {
                if (day == "tomorrow") {
                    let today = new Date();
                    let tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(23, 59, 59, 59);
                    condition.dateAndTime = {
                        [Op.between]: [today, tomorrow],
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

            let result = await Event.findAll({
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

            if (distance && location !== 'Online') {    
                result = result.filter((item) => {
                    const lon1 = longitude * Math.PI / 180;
                    const lon2 = item.longitude * Math.PI / 180;
                    const lat1 = latitude * Math.PI / 180;
                    const lat2 = item.latitude * Math.PI / 180;
                
                    // Haversine formula
                    let dlon = lon2 - lon1;
                    let dlat = lat2 - lat1;
                    let a = Math.pow(Math.sin(dlat / 2), 2)
                    + Math.cos(lat1) * Math.cos(lat2)
                    * Math.pow(Math.sin(dlon / 2),2);
                
                    let c = 2 * Math.asin(Math.sqrt(a));
                
                    // Radius of earth in kilometers. Use 3956
                    // for miles
                    let r = 6371;
                
                    // calculate the result
                    return(c * r) <= +distance;
                });
            }

            let container = result

            for(let i = 0; i < container.length; i++) {
                const foundParticipant = await Participant.findAll({ where: { eventId: +result[i].id } });
                let participantsContainer = []

                let objUser = {}
                if (foundParticipant.length > 0) {
                    for (let j = 0; j < foundParticipant.length; j++) {
                        const userId = foundParticipant[j].dataValues.userId;
                        const foundUser = await User.findByPk(userId);
                        
                        objUser = {
                            userId: foundUser.id,
                            username: foundUser.username,
                            email: foundUser.email,
                        }
                        participantsContainer.push(objUser);
                    }
                }
                container[i].dataValues.participants = participantsContainer
            }

            res.status(200).json(container);
        } catch (err) {
            next(err);
        }
    }

    static async userJoinEvent(req, res, next) {
        const userId = req.user.id;
        const { eventId } = req.params;
        try {
            const foundUser = await User.findByPk(userId);
            const foundEvent = await Event.findByPk(eventId);
            const foundParticipant = await Participant.findOne({
                where: {
                userId,
                eventId,
                },
            });
            const numberOfParticipants = await Participant.count({
                where: {
                eventId,
                },
            });

            if (!foundEvent) {
                throw { name: "Event Not Found" };          
            }
            if (foundEvent.maxParticipants > numberOfParticipants) {
                if (foundEvent && !foundParticipant) {
                    await Participant.create({ userId, eventId });
                    const result = `${foundUser.username} Succes Join Event ${foundEvent.name}`;
                    res.status(201).json({ message: result });
                } else if (foundParticipant) {
                    throw { name: "You Have Joined This Event" };
                }
            } else {
                throw { name: "Event Full" };
            }
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

        if (event) {
            const eventOrganizer = await User.findByPk(event.eventOrganizerId, {
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            }});
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
            ]});
            res.status(200).json({ event, eventOrganizer, participants });
        } else {
            throw { name: "Event Not Found" };
        }
        } catch (err) {
            next(err);
        }
    }

    static async updateEvent(req, res, next) {
        try {
            const {
                name,
                dateAndTime,
                description,
                maxParticipants,
                imgUrl,
                categoryId,
            } = req.body;

            const id = req.params.eventId;
            const userId = +req.user.id;

            const foundEvent = await Event.findByPk(id);

            if (!foundEvent) {
                throw { name: "Event Not Found" };
            }

            if (foundEvent.eventOrganizerId === userId) {
                const result = await Event.update(
                {
                    name,
                    dateAndTime,
                    description,
                    maxParticipants,
                    imgUrl,
                    categoryId,
                },
                {
                    where: { id },
                    returning: true,
                }
                );

                const eventResult = result[1][0];

                // if (foundEvent.location === "Online") {
                //   CRON_SCHEDULER[id].stop();

                //   delete CRON_SCHEDULER[id];

                //   let dateInput = req.body.dateAndTime;

                //   let minute = dateInput.slice(14, 16);
                //   let hour = dateInput.slice(11, 13);
                //   let day = dateInput.slice(8, 10);
                //   let month = dateInput.slice(5, 7);

                //   console.log(minute, " ", hour, " ", day, " ", month, " ");

                //   CRON_SCHEDULER[id] = cron.schedule(
                //     `${minute} ${hour} ${day} ${month} *`,
                //     () => {
                //       console.log("Running a job (edit)");
                //     //   await Event.update(
                //     },
                //     {
                //       scheduled: false,
                //       timezone: "Asia/Jakarta",
                //     }
                //   );

                //   CRON_SCHEDULER[id].start();
                // }

                res.status(200).json(eventResult);
            } else {
                throw { name: "Access Denied" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async deleteEvent(req, res, next) {
        const { eventId } = req.params;
        const userId = +req.user.id;
        try {
            const foundEvent = await Event.findByPk(eventId);

            if (!foundEvent) {
                throw { name: "Event Not Found" };
            }
            if (foundEvent.eventOrganizerId === userId) {
                await Event.destroy({ where: { id: eventId } });
                // if (foundEvent.location === "Online") {
                //   CRON_SCHEDULER[eventId].stop();
                //   delete CRON_SCHEDULER[eventId];
                // }
                res.status(200).json({ message: `Event ${foundEvent.name} has been deleted` });
            } else {
                throw { name: "Access Denied" };
            }
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
            res
            .status(200)
            .json({
                message: `${foundUser.username} Succes Left ${foundEvent.name} Event`,
            });
        } else {
            throw { name: "You never joined this event" };
        }
        } catch (err) {
        next(err);
        }
    }

    static async eventDone(req, res, next) {
        const { eventId } = req.params;
        const userId = +req.user.id;
        const isDone = {
            isDone: req.body.isDone
        }
        try {
            const foundEvent = await Event.findByPk(eventId);

            if (!foundEvent) {
                throw { name: "Event Not Found" };
            }

            if (foundEvent.eventOrganizerId === userId) {
                await Event.update(
                    isDone, {
                        where: {
                            id: eventId
                        },
                        returning: true,
                    }
                )
                res.status(200).json({message: 'event ended.'});
            } else {
                throw { name: "Access Denied" };
            }
        } catch (err) {
            next(err);
        }
    }

    static async getMyEvent(req, res, next) {
        try {
            const userId = +req.user.id;
            let foundParticipant = await Participant.findAll({
                where: { userId },
                include: [
                    {
                    model: Event,
                    }
                ]
            });

            let foundMyEvent = await Event.findAll({
                where: { eventOrganizerId: userId },
            })

            // console.log(foundParticipant);
            let result = foundParticipant.map(event => {return event.Event}).concat(foundMyEvent)
            
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    static generateVideoToken(req, res, next) {
        const channelName = req.query.channelName;

        res.header('Access-Control-Allow-Origin', '*');

        if (!channelName) {
            return res.status(400).json({ error: 'channel is required' });
        }

        let uid = req.query.uid;

        if(!uid || uid == '') {
            uid = 0;
        }

        const expirationTimeInSeconds = 86400;
        const roleRtc = RtcRole.PUBLISHER;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
        const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, roleRtc, expirationTimestamp)

        res.status(200).json({ token });
    }

    static generateChatToken(req, res, next) {
        const channelName = req.query.channelName;

        res.header('Access-Control-Allow-Origin', '*');

        if (!channelName) {
            return res.status(400).json({ error: 'channel is required' });
        }

        let uid = req.query.uid;
        let role = RtmRole.PUBLISHER;
        let expireTime = 86400;

        const currentTime = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTime + expireTime;
        
        const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);

        res.status(200).json({ token })
    }
}

module.exports = EventController;