'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Events',
        'latitude',
        {
          type: Sequelize.STRING,
        },
        {
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'Events',
        'latitude',
        {}
      )
  }
};
