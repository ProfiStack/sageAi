module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Startups", "title");
  },
  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Startups", "title", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Test",
    });
  },
};
