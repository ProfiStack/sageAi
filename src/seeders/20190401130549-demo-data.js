const { getRoles, getUsers, getArticles, getRoleUser } = require('../__mock__');

module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    // seed roles
    const roles = await queryInterface.bulkInsert('Roles', getRoles(), {
      returning: true,
    });

    // seed users
    const users = await queryInterface.bulkInsert('Users', getUsers(), {
      returning: true,
    });

    return queryInterface.bulkInsert('RoleUsers', getRoleUser(roles, users));
  },

  // eslint-disable-next-line
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RoleUsers', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
