-- Basic schema for the ISMDB database. Generally assumes that the tables, etc.
-- do not yet exist, though should work if any of them do.

PRAGMA foreign_keys = ON;

--
-- This first set of tables is for the basic references structure. This breaks
-- down to:
--
--   Reference types
--   The basic reference core
--   Three types of reference:
--     Books
--     Magazine features
--     Photo collections
--   Book support:
--     Publishers
--     Series
--   Magazine feature support:
--     Magazines
--     Magazine issues
--

-- ReferenceTypes delineate references as being books, articles, etc.
CREATE TABLE "ReferenceTypes" (
       id          INTEGER PRIMARY KEY,
       name        TEXT UNIQUE NOT NULL,
       description TEXT NOT NULL,
       notes       TEXT
);

-- References are the building block of the database, the primary reason for it.
CREATE TABLE "References" (
       id              INTEGER PRIMARY KEY,
       name            TEXT NOT NULL,
       language        TEXT,
       createdAt       DATETIME NOT NULL,
       updatedAt       DATETIME NOT NULL,
       referenceTypeId INTEGER NOT NULL,
       FOREIGN KEY(referenceTypeId) REFERENCES "ReferenceTypes"(id)
);

-- The PhotoCollections table links only to References.

-- PhotoCollections are groupings of photos, either physical or digital.
CREATE TABLE PhotoCollections (
       referenceId  INTEGER PRIMARY KEY,
       location     TEXT,
       media        TEXT,
       FOREIGN KEY(referenceId) REFERENCES "References"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);

-- For the Books table, it is necessary to first define Publishers and Series.

-- Publishers are entities that produce books.
CREATE TABLE Publishers (
       id    INTEGER PRIMARY KEY,
       name  TEXT NOT NULL,
       notes TEXT
);

-- Series are (optional) groupings of related books. They also reference a
-- Publisher.
CREATE TABLE Series (
       id          INTEGER PRIMARY KEY,
       name        TEXT NOT NULL,
       notes       TEXT,
       publisherId INTEGER,
       FOREIGN KEY(publisherId) REFERENCES "Publishers"(id)
         ON UPDATE CASCADE
);

-- Books table. Refers to "References" (non-optional), "Publishers" (optional),
-- and "Series" (optional).
CREATE TABLE Books (
       referenceId  INTEGER PRIMARY KEY,
       isbn         TEXT,
       seriesNumber TEXT,
       publisherId  INTEGER,
       seriesId     INTEGER,
       FOREIGN KEY(referenceId) REFERENCES "References"(id)
         ON DELETE CASCADE ON UPDATE CASCADE,
       FOREIGN KEY(publisherId) REFERENCES "Publishers"(id)
         ON UPDATE CASCADE,
       FOREIGN KEY(seriesId) REFERENCES "Series"(id)
         ON UPDATE CASCADE
);

-- For the MagazineFeature table, it is necessary to first define Magazines and
-- MagazineIssues.

-- Magazines are the base data for a given serial publication.
CREATE TABLE Magazines (
       id        INTEGER PRIMARY KEY,
       name      TEXT NOT NULL,
       language  TEXT,
       aliases   TEXT,
       notes     TEXT,
       createdAt DATETIME NOT NULL,
       updatedAt DATETIME NOT NULL
);

-- MagazineIssues represent single instances of Magazines, so that the features
-- can be associated with a specific issue.
CREATE TABLE MagazineIssues (
       id         INTEGER PRIMARY KEY,
       issue      TEXT NOT NULL,
       magazineId INTEGER,
       createdAt  DATETIME NOT NULL,
       updatedAt  DATETIME NOT NULL,
       FOREIGN KEY(magazineId) REFERENCES "Magazines"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);

-- MagazineFeatures table. Refers to both "References" and "MagazineIssues",
-- both non-null.
CREATE TABLE MagazineFeatures (
       referenceId     INTEGER PRIMARY KEY,
       magazineIssueId INTEGER NOT NULL,
       FOREIGN KEY(referenceId) REFERENCES "References"(id)
         ON DELETE CASCADE ON UPDATE CASCADE,
       FOREIGN KEY(magazineIssueId) REFERENCES "MagazineIssues"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- This set of tables is for authors support. This looks like:
--
--   Authors
--   Author aliases
--   Many-to-many linkage between authors and references
--

-- Authors are the credited creators of a given reference.
CREATE TABLE Authors (
       id        INTEGER PRIMARY KEY,
       name      TEXT UNIQUE NOT NULL,
       createdAt DATETIME NOT NULL,
       updatedAt DATETIME NOT NULL
);

-- AuthorAliases allows for a given author to be known by some variations.
CREATE TABLE AuthorAliases (
       id       INTEGER PRIMARY KEY,
       name     TEXT NOT NULL,
       authorId INTEGER NOT NULL,
       FOREIGN KEY(authorId) REFERENCES "Authors"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);

-- The AuthorsReferences table manages the many-to-many relationship between
-- authors and the references they're credited with. Note the compound primary
-- key and the two explicitly-created indices.
CREATE TABLE AuthorsReferences (
       authorId    INTEGER NOT NULL,
       referenceId INTEGER NOT NULL,
       PRIMARY KEY(authorId, referenceId),
       FOREIGN KEY(authorId) REFERENCES "Authors"(id)
         ON DELETE CASCADE ON UPDATE CASCADE,
       FOREIGN KEY(referenceId) REFERENCES "References"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX authors_references_author ON AuthorsReferences(authorId);
CREATE INDEX authors_references_reference ON AuthorsReferences(referenceId);

--
-- This set of tables is for tags. This breaks down into two types: general
-- tags and feature tags. General tags apply to references and feature tags
-- are sort of "sub-tags" for magazine features. This looks like:
--
--   Tags
--   Many-to-many linkage between tags and references
--   Reference tags
--   Many-to-many linkage between feature tags and magazine features
--

-- Tags are the search-terms used to find references.
CREATE TABLE Tags (
       id          INTEGER PRIMARY KEY,
       name        TEXT UNIQUE NOT NULL,
       type        TEXT,
       description TEXT
);

-- The TagsReferences table manages the many-to-many relationship between tags
-- and the references they're associated with. Note the compound primary key and
-- the two explicitly-created indices.
CREATE TABLE TagsReferences (
       tagId       INTEGER NOT NULL,
       referenceId INTEGER NOT NULL,
       PRIMARY KEY(tagId, referenceId),
       FOREIGN KEY(tagId) REFERENCES "Tags"(id)
         ON DELETE CASCADE ON UPDATE CASCADE,
       FOREIGN KEY(referenceId) REFERENCES "References"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX tags_references_tag ON TagsReferences(tagId);
CREATE INDEX tags_references_reference ON TagsReferences(referenceId);

-- FeatureTags classify MagazineFeatures records.
CREATE TABLE FeatureTags (
       id          INTEGER PRIMARY KEY,
       name        TEXT UNIQUE NOT NULL,
       description TEXT
);

-- The FeatureTagsMagazineFeatures table manages the many-to-many relationship
-- between feature tags and the magazine feature records they're associated
-- with. Note the compound primary key and the two explicitly-created indices.
CREATE TABLE FeatureTagsMagazineFeatures (
       featureTagId      INTEGER NOT NULL,
       magazineFeatureId INTEGER NOT NULL,
       PRIMARY KEY(featureTagId, magazineFeatureId),
       FOREIGN KEY(featureTagId) REFERENCES "FeatureTags"(id)
         ON DELETE CASCADE ON UPDATE CASCADE,
       FOREIGN KEY(magazineFeatureId) REFERENCES "MagazineFeatures"(id)
         ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX featuretags_magazinefeatures_featuretag ON
  FeatureTagsMagazineFeatures(featureTagId);
CREATE INDEX featuretags_magazinefeatures_magazinefeature ON
  FeatureTagsMagazineFeatures(magazineFeatureId);

--
-- Lastly, the Users table section. Originally, this included scopes (based on
-- OAuth2 protocol) but these are no longer part of the plan. So there is just
-- the one table for now.
--

-- Users table has basic data, but the important parts are the user-name and the
-- password.
CREATE TABLE Users (
       id        INTEGER PRIMARY KEY,
       name      TEXT NOT NULL,
       email     TEXT UNIQUE NOT NULL,
       username  TEXT UNIQUE NOT NULL,
       password  TEXT NOT NULL,
       createdAt DATETIME NOT NULL,
       updatedAt DATETIME NOT NULL
);

-- End.
