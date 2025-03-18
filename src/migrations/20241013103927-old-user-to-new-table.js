const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    const users = [
      'Malakaly02@hotmail.com',
      'Nishtabudhiraja@gmail.com',
      'adamjeddy@outlook.com',
      'adi_thomasbg@hotmail.com',
      'ahmadqusaiyousef@gmail.com',
      'amralinahas@gmail.com',
      'ayman26babikir@gmail.com',
      'bishoy.shohdy01@gmail.com',
      'contact@ciprianspiridon.com',
      'deep.16shah@me.com',
      'emadmekhaeil0@gmail.com',
      'farahfaisal2000@gmail.com',
      'farahhossama.2001@gmail.com',
      'faridu86@gmail.com',
      'h.ahmedansari1@gmail.com',
      'halabasemdee@gmail.com',
      'hananakhtar268@gmail.com',
      'hasank@gmail.com',
      'hassan.khan@naimaat.com',
      'heyvilaca@gmail.com',
      'hussainm15121@gmail.com',
      'juicyygeorge@icloud.com',
      'kakde822@gmail.com',
      'karimaly2508@gmail.com',
      'kejalvakil@gmail.com',
      'khaledhuossaini@gmail.com',
      'maalsaadi0@gmail.com',
      'mahek.mukati@gmail.com',
      'majidjafarali@gmail.com',
      'malak.mahfouz1@gmail.com',
      'mangafaizan@gmail.com',
      'marketing@myracingsyndicate.com',
      'meenritemad@outlook.com',
      'mnrulz@hotmail.com',
      'mohdabeen@gmail.com',
      'munzerasfahani@gmail.com',
      'nadaparveen59@gmail.com',
      'nayab@naimaat.com',
      'nishantmeshram171@gmail.com',
      'nizarsalloumpr@gmail.com',
      'parekhgourang@gmail.com',
      'puniyanianustha@gmail.com',
      'renud10@gmail.com',
      'saadkhatri16@gmail.com',
      'sahilk1801@gmail.com',
      'sakshi31chudiwala@gmail.com',
      'sandhrasusan1997@gmail.com',
      'saud.almns@gmail.com',
      'semhar.tesfu@outlook.com',
      'vaibhavasati2000@gmail.com',
      'marleetoma@gmail.com',
      'faridahusam@gmail.com',
      'areebamuhammad21@gmail.com',
      'bentelgeiran@gmail.com',
      'rafaellarashad@hotmail.com',
      'test@gmail.com',
      'abhishek918@outlook.com',
      'saisrikarkadiyam@gmail.com',
      'marinaossama8@gmail.com',
      'fady.costandy@gmail.com',
      'aneeshsunil2001@hotmail.com',
      'emadst00@yahoo.com',
      'raniatsm@gmail.com'
    ]
    const hashedPassword = await bcrypt.hash('Welcome$123', 10);
    const userPromises = users.map((user) => {
      return User.create({ id: uuidv4(), fullName: 'User User', email: user, password: hashedPassword, role: 'STARTUP' });
    })
    await Promise.all(userPromises);
  },

  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Startups');
  },
};
