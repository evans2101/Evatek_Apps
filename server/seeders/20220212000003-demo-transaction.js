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
    // create loop to generate 500 transactions
    for (let i = 0; i < 500; i++) {
      // create transaction
      await queryInterface.bulkInsert(
        "transactions",
        [
          {
            userId: Math.floor(Math.random() * 100) + 1,
            status: ["Pending", "Success", "Failed"][
              Math.floor(Math.random() * 3)
            ],
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
    await queryInterface.bulkDelete("Transactions", null, {});
  },
};
