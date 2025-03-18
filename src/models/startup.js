module.exports = (sequelize, DataTypes) => {
  const Startup = sequelize.define("Startup", {
    id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
    companyName: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    logo: DataTypes.STRING,
    titleImage: DataTypes.STRING,
    industry: DataTypes.STRING,
    moneyRaised: DataTypes.INTEGER,
    productAvailable: DataTypes.BOOLEAN,
    generatingRevenue: DataTypes.BOOLEAN,
    pitchDeck: DataTypes.STRING,
    audienceSize: DataTypes.STRING,
    investmentCampaign: DataTypes.BOOLEAN,
    moneyToBeRaised: DataTypes.INTEGER,
    companysRunaway: DataTypes.INTEGER,
    isActive: false,
    ownerId: DataTypes.UUIDV4
  });

  Startup.associate = (models) => { };

  /**
   * This method can be used to conveniently check whether the Startup can perform
   * a given action on an entity. This can prove useful if you still need to
   * perform an authorization check without necessary doing it at the
   * routing level.
   *
   * @param action
   * @param entity
   * @param req
   * @returns {Promise<boolean>}
   */
  return Startup;
};
