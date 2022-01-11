/*
  Create/remove indexes and primary key constraint on
  FeatureTagsMagazineFeatures table.
 */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint("FeatureTagsMagazineFeatures", {
      fields: ["featureTagId", "magazineFeatureId"],
      name: "featuretags_magazinefeatures_pk",
      type: "primary key",
    });
    await queryInterface.addIndex("FeatureTagsMagazineFeatures", {
      fields: ["featureTagId"],
      name: "featuretags_magazinefeatures_featuretag",
    });
    await queryInterface.addIndex("FeatureTagsMagazineFeatures", {
      fields: ["referenceId"],
      name: "featuretags_magazinefeatures_magazinefeature",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "FeatureTagsMagazineFeatures",
      "featuretags_magazinefeatures_pk"
    );
    await queryInterface.removeIndex(
      "FeatureTagsMagazineFeatures",
      "featuretags_magazinefeatures_featuretag"
    );
    await queryInterface.removeIndex(
      "FeatureTagsMagazineFeatures",
      "featuretags_magazinefeatures_magazinefeature"
    );
  },
};
