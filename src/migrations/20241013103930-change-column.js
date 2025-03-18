module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Startups', 'ownerId', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false, // if applicable
      defaultValue: 'fafc4076-e99e-415d-9d95-be239a5f34d7'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Startups', 'ownerId', {
      type: Sequelize.UUID,
      defaultValue: null, // revert to previous setting if needed
    });
  },
};
