const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const UserController = require("../controllers/userController");
const CategoryController = require("../controllers/categoryController");
const EventController = require("../controllers/eventController");
const errorHandler = require("../middlewares/errorHandler");
const nocache = require('../middlewares/cacheRTMAgora')
const uploadimage = require('../middlewares/multer')
const imageKit = require('../middlewares/imageKit')

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/events", EventController.findAll);
router.get("/events/:eventId", EventController.detailEvent);
router.get("/categories", CategoryController.getAll);
router.get("/access_token", nocache, EventController.generateTokenChat);
router.get("/access_token_video", EventController.generateTokenVideo);

router.use(authentication);

router.get('/myevent', EventController.getMyEvent);
router.post("/events", uploadimage, imageKit, EventController.create);
router.post("/events/:eventId", EventController.userJoinEvent);
router.put("/events/:eventId", uploadimage, imageKit, EventController.updateEvent);
router.patch("/events/:eventId", EventController.eventDone);
router.delete("/events/:eventId", EventController.deleteEvent);
router.delete("/events/:eventId/participants", EventController.userLeaveEvent);

router.use(errorHandler);

module.exports = router;
