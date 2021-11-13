"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
      Participant.belongsTo(models.Event, {
        foreignKey: "eventId",
        targetKey: "id",
      });
    }
  }
  Participant.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Event ID is required." },
          notEmpty: { msg: "Event ID is required." },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID is required." },
          notEmpty: { msg: "User ID is required." },
        },
      },
    },
    {
      sequelize,
      modelName: "Participant",
    }
  );
  return Participant;
};
