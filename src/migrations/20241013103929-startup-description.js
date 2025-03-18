module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Startups','description', {
        type: Sequelize.STRING,
        allowNull: false,
      defaultValue: 'Test'
  },
)},
  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('Startups', 'description');
  },
};
