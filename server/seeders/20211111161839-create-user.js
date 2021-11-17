"use strict";
const { encode } = require("../helpers/bcrypt");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "damar@mail.com",
          password: encode("damar"),
          username: "damar",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "naufal@mail.com",
          password: encode("naufal"),
          username: "naufal",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "frengki@mail.com",
          password: encode("frengki"),
          username: "frengki",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "gio@mail.com",
          password: encode("gio"),
          username: "gio",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "farandi@mail.com",
          password: encode("farandi"),
          username: "farandi",
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
