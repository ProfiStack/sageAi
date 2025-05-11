module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { autoIncrement: true, primaryKey: true, type: DataTypes.UUID },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    country: DataTypes.STRING,
    gender: DataTypes.STRING
  });

  User.associate = (models) => {};

  /**
   * This method can be used to conveniently check whether the user can perform
   * a given action on an entity. This can prove useful if you still need to
   * perform an authorization check without necessary doing it at the
   * routing level.
   *
   * @param action
   * @param entity
   * @param req
   * @returns {Promise<boolean>}
   */
  return User;
};
