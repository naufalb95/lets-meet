const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const UserController = require("../controllers/userController");
const EventController = require("../controllers/eventController");
const errorHandler = require("../middlewares/errorHandler");

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/events", EventController.findAll);
router.get("/events/:eventId", EventController.detailEvent);

router.use(authentication);

router.post("/events", EventController.create);
router.post("/events/:eventId", EventController.userJoinEvent);
router.put("/events/:eventId", authorization, EventController.updateEvent);
router.delete("/events/:eventId", authorization, EventController.deleteEvent);
router.delete("/events/:eventId/participants", EventController.userLeaveEvent);

router.use(errorHandler);

module.exports = router;
