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
    // create loop to generate 800 orders
    for (let i = 0; i < 800; i++) {
      // create order
      await queryInterface.bulkInsert(
        "orders",
        [
          {
            userId: Math.floor(Math.random() * 100) + 1,
            transactionId: Math.floor(Math.random() * 500) + 1,
            productId: Math.floor(Math.random() * 200) + 1,
            qty: Math.floor(Math.random() * 10) + 1,
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
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
