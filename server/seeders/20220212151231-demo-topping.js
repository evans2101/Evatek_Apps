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
    const fruits = [
      "Apple",
      "Banana",
      "Cherry",
      "Durian",
      "Elderberry",
      "Fig",
      "Grape",
      "Honeydew",
      "Jackfruit",
      "Kiwi",
    ];
    // create loop to generate 10 toppings
    for (let i = 0; i < 10; i++) {
      // create topping
      await queryInterface.bulkInsert(
        "toppings",
        [
          {
            title: fruits[i],
            price: Math.floor(Math.random() * 20000),
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
    await queryInterface.bulkDelete("Toppings", null, {});
  },
};
