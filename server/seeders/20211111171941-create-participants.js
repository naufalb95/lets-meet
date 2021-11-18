"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Participants",
      [
        {
          eventId: 4,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            eventId: 4,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            eventId: 5,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            eventId: 5,
            userId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            eventId: 5,
            userId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            eventId: 5,
            userId: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Participants", null, {});
  },
};
