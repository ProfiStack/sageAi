module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define("Quiz", {
    id: { primaryKey: true, type: DataTypes.UUID },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    quiz: DataTypes.JSON,
    order: DataTypes.INTEGER
  });

  Quiz.associate = (models) => {};

  /**
   * This method can be used to conveniently check whether the Quiz can perform
   * a given action on an entity. This can prove useful if you still need to
   * perform an authorization check without necessary doing it at the
   * routing level.
   *
   * @param action
   * @param entity
   * @param req
   * @returns {Promise<boolean>}
   */
  return Quiz;
};
