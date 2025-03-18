module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,  // Unique constraint
        allowNull: false,  // Add not-null constraint if desired
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('Users');
  },
};
