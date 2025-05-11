module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoleUsers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        unique: true,  // Unique constraint
        allowNull: false,  // Add not-null constraint if desired
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),  // Default value for createdAt
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),  // Default value for updatedAt
      },
    });
  },

  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RoleUsers');
  },
};
