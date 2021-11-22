"use strict";

let data = require("../dataSeeder/event.json");
data.forEach((el) => {
    el.isDone = false;
    el.createdAt = new Date();
    el.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Events", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Events", null, {});
  },
};
