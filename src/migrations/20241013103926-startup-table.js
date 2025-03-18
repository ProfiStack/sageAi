module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Startups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      titleImage: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      website: {
        type: Sequelize.STRING,
        unique: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: false
      },
      moneyRaised: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      productAvailable: {
        type: Sequelize.BOOLEAN,
      },
      generatingRevenue: {
        type: Sequelize.BOOLEAN,
      },
      pitchDeck: {
        type: Sequelize.STRING,
      },
      audienceSize: {
        type: Sequelize.STRING,
      },
      investmentCampaign: {
        type: Sequelize.BOOLEAN,
      },
      moneyToBeRaised: {
        type: Sequelize.INTEGER,
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      companysRunaway: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Startups');
  },
};
