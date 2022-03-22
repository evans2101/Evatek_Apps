"use strict";

// import bcrypt
const bcrypt = require("bcrypt");
// generate salt
const salt = bcrypt.genSaltSync(10);
// generate hash
const hash = bcrypt.hashSync("12345678", salt);
// import faker
const { default: faker } = require("@faker-js/faker");
// set locale to id_ID
faker.locale = "id_ID";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // create loop to generate 100 users
    for (let i = 0; i < 100; i++) {
      // create user
      await queryInterface.bulkInsert(
        "users",
        [
          {
            fullName: faker.name.findName(),
            email: faker.internet.email(),
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
