"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Participants",
      [
        {
          "eventId": 1,
          "userId": 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "eventId": 1,
          "userId": 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "eventId": 1,
          "userId": 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "eventId": 1,
          "userId": 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "eventId": 2,
          "userId": 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "eventId": 1,
          "userId": 5,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Participants", null, {});
  },
};
