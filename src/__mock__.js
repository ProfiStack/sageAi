const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

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
      role: 'Super Admin',
    },
    {
      role: 'Users',
    },
  ]);

const getUsers = () => {
  return appendTimestamps([
    {
      id: uuidv4(),  // ✅ Generate UUID manually
      fullName: 'Hassan',
      gender: 'Male',
      email: 'hasankhn06@gmail.com',
      password: bcrypt.hashSync('hasankhn', 10),
      role: 'SUPERADMIN',
      country: 'Pakistan',
    },
    {
      id: uuidv4(),  // ✅ Generate UUID manually
      fullName: 'Salman',
      gender: 'Male',
      email: 'salmankhn.sk28@gmail.com',
      password: bcrypt.hashSync('Sallu', 10),
      role: 'SUPERADMIN',
      country: 'Pakistan',
    },
  ]);
};

const getRoleUser = (roles, users) =>
  appendTimestamps([
    {
      id: uuidv4(),  // ✅ Generate UUID manually
      roleId: roles[0].id,
      userId: users[0].id,
    },
    {
      id: uuidv4(),  // ✅ Generate UUID manually
      roleId: roles[0].id,
      userId: users[1].id,
    },
  ]);

module.exports = {
  getRoles,
  getUsers,
  getRoleUser,
};
