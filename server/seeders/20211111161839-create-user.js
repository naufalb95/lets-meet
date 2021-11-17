"use strict";
const { encode } = require("../helpers/bcrypt");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
            email: "frengkigans@gmail.com",
            password: encode("frengkicute"),
            username: "Frengki Alfiansyah",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            email: "damarpengensetia@gmail.com",
            password: encode("frengkicute"),
            username: "Damar Jati Barang",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            email: "farandipengendimanja@gmail.com",
            password: encode("frengkicute"),
            username: "Farandi Angestimah",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            email: "lordnaufal@gmail.com",
            password: encode("frengkicute"),
            username: "Naufal Budiman",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            email: "giokangendiberi@gmail.com",
            password: encode("frengkicute"),
            username: "Giovanni Petir",
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
