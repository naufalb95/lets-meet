"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.Participant,
        foreignKey: "eventId",
      });
      Event.belongsTo(models.User, { foreignKey: "eventOrganizerId" });
      Event.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }
  Event.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required." },
          notEmpty: { msg: "Name is required." },
        },
      },
      dateAndTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Date is required." },
          notEmpty: { msg: "Date is required." },
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location is required." },
          notEmpty: { msg: "Location is required." },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required." },
          notEmpty: { msg: "Description is required." },
        },
      },
      maxParticipants: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Max participant is required." },
          notEmpty: { msg: "Max participant is required." },
        },
      },
      imgUrl: DataTypes.STRING,
      tokenVideo: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Category is required." },
          notEmpty: { msg: "Category is required." },
        },
      },
      eventOrganizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Event Organizer ID is required." },
          notEmpty: { msg: "Event Organizer ID is required." },
        },
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: { msg: "Is Done is required." },
          notEmpty: { msg: "Is Done is required." },
        },
      },
      tokenChat: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
      },
    },
    {
        hooks: {
            beforeValidate: (event) => {
                event.isDone = false;
            }
        },
        sequelize,
        modelName: "Event",
    }
  );
  return Event;
};
