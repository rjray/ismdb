/*
  Seed the currently-known feature tags.
 */

module.exports = {
  up: async (queryInterface) => {
    const tags = `color illustrations
color plates
color profiles
coloring guides
construction
conversion
cut-away
detail illustration
detailing
diorama
drawings
finishing
history
illustrations
interior drawings
line drawings
painting
photo essay
photos
placeholder
profiles
review
scale plans
scratchbuilding
sidebar
single topic issue
techniques
unknown
walk-around`
      .split("\n")
      .map((name) => ({ name }));

    await queryInterface.bulkInsert("FeatureTags", tags);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("FeatureTags", null, {});
  },
};
