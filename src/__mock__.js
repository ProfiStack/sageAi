const bcrypt = require('bcrypt');

const appendTimestamps = (data) => {
  return data.map((item) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

//{article.*,role.*,user.*}

const getRoles = () =>
  appendTimestamps([
    {
      name: 'Super Admin',
      permissions: ['*'],
    },
    {
      name: 'CompanyAdmin',
      permissions: ['*'],
    },
    {
      name: 'InvestorAdmin',
      permissions: ['*'],
    },
    {
      name: 'Investors',
      permissions: ['*'],
    },
  ]);

const getUsers = () => {
  return appendTimestamps([
    {
      name: 'Hassan',
      username: 'hasankhn',
      email: 'hassan.khan@naimaat.com',
      password: bcrypt.hashSync('hasankhn', 10),
      roleId: 1,
    },
    {
      name: 'Nayab',
      username: 'nay',
      email: 'nayab@naimaat.com',
      password: bcrypt.hashSync('nay', 10),
      roleId: 1,
    },
  ]);
};

const getArticles = (users) =>
  appendTimestamps([
    {
      title: 'My article',
      body: 'This is me writing',
    },
    {
      title: 'My article no 2',
      body: 'This is me writing again',
    },
  ]);

const getRoleUser = (roles, users) =>
  appendTimestamps([
    {
      roleId: roles[0].id,
      userId: users[0].id,
    },
    {
      roleId: roles[0].id,
      userId: users[1].id,
    },
  ]);

module.exports = {
  getRoles,
  getUsers,
  getArticles,
  getRoleUser,
};
