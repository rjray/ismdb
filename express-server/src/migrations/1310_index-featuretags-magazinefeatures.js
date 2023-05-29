/*
  Create/remove indexes and primary key constraint on
  FeatureTagsMagazineFeatures table.
 */

export async function up(queryInterface) {
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
    fields: ["magazineFeatureId"],
    name: "featuretags_magazinefeatures_magazinefeature",
  });
}

export async function down(queryInterface) {
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
}
