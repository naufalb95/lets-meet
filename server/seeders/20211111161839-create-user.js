"use strict";
const { encode } = require("../helpers/bcrypt");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "user1@mail.com",
          password: encode("user1"),
          username: "user1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user2@mail.com",
          password: encode("user2"),
          username: "user2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
