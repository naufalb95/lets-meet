'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Events',
        'tokenChat',
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
        'tokenChat',
        {}
      )
  }
};
