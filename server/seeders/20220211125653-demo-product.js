"use strict";

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
    // create loop to generate 200 products
    for (let i = 0; i < 200; i++) {
      // create product
      await queryInterface.bulkInsert(
        "products",
        [
          {
            title: faker.commerce.productName(),
            price: Math.floor(Math.random() * 200000),
            image: faker.image.image(),
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
    await queryInterface.bulkDelete("Products", null, {});
  },
};
