"use strict";

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
    // create loop to generate 1600 pivot ordertoppings
    for (let i = 0; i < 1600; i++) {
      // create pivot order_toppings
      await queryInterface.bulkInsert(
        "ordertoppings",
        [
          {
            orderId: Math.floor(Math.random() * 800) + 1,
            toppingId: Math.floor(Math.random() * 10) + 1,
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
    await queryInterface.bulkDelete("Ordertoppings", null, {});
  },
};
