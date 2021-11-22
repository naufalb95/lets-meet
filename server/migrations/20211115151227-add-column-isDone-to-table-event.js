'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Events',
        'isDone',
        {
          type: Sequelize.BOOLEAN,
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
        'isDone',
        {}
      )
  }
};
