#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use utf8;

use Carp qw(croak);
use File::Basename 'dirname';
use Getopt::Long 'GetOptions';

use DBI;
use YAML 'LoadFile';

# This will be the global table of tags, mapping names to IDs:
my %TAGS = ();
# This table is used in keywords2tags to identify the meta tags:
my %META_TAGS = ();
# Feature tags are used for magazine articles/features:
my %FEATURE_TAGS = ();
# Tracking author IDs for validity checks:
my %AUTHORS = ();
# For mapping publishers to IDs:
my %PUBLISHERS = ();
# For mapping series to publisher and ID:
my %SERIES = ();

# Regex rules for matching books that are in a series:
my @RULESET = (
    qr{
        ^
        (.*)
        \s+
        (?:(?:vol[.]?|no[.]?|\#)\s*([-\/\d]+))
        (?:\s+(.*))?
        $
    }smxi,
    qr{
        ^
        (.*)
        \s+
        ([-\/\d]+)
        (?:\s+(.*))?
        $
    }smxi,
    qr{
        ^
        (.*)
        \s+
        ([[:alpha:]]+[-.]?\d+)
        (?:\s+(.*))?
        $
    }smxi,
    qr{^(.*)\s+[(](\d+)[)](?:\s+(.*))?$}smi,
);

my %opts;
GetOptions(\%opts, qw(env:s)) or die "Error in command line\n";
my ($dbin, $dbout) = @ARGV;

if (defined $opts{env}) {
    my $envfile = $opts{env} || $ENV{NODE_ENV} ? ".env.$ENV{NODE_ENV}" : '.env';

    if (open my $fh, '<', $envfile) {
        my @lines = <$fh>;
        close $fh or croak "Error closing $envfile: $!";
        chomp @lines;
        for my $line (@lines) {
            next if (! $line);
            next if ($line =~ /^#/);

            if ($line =~ /^(\w+)=(.*)$/) {
                my $val = $2 || q{};
                (my $key = lc $1) =~ s/^db_//;
                $opts{$key} ||= $val;
            } else {
                warn "Bad line ($line) in $envfile. Skipping\n";
            }
        }
    } else {
        croak "Error opening $envfile for reading: $!";
    }
}

my $attrs = {
    AutoCommit => 0,
    RaiseError => 1,
};

my $dbhi = DBI->connect("dbi:SQLite:$dbin", q{}, q{}, { sqlite_unicode => 1 });

my $storage = $dbout || 'ismdb.db';
my $dbho = DBI->connect("dbi:SQLite:dbname=$storage", q{}, q{}, $attrs);
$dbho->do('PRAGMA foreign_keys = ON');

my $dir = dirname __FILE__;
my $publishers_data = LoadFile("$dir/publishers.yaml");
my $series_data = LoadFile("$dir/series.yaml");

read_existing_tags($dbho);
migrate_authors($dbhi, $dbho);
migrate_periodicals($dbhi, $dbho);
setup_pubs_and_series($dbho);
migrate_reference_table($dbhi, $dbho);
fix_author_dates($dbho);
fix_magazine_issue_dates($dbho);

$dbhi->disconnect;
$dbho->disconnect;

exit;

sub read_existing_tags {
    my $dbhout = shift;
    my %type_count = ();

    my $sth = $dbhout->prepare('SELECT id, name, type FROM "Tags" ORDER BY id');
    $sth->execute;
    my $data = $sth->fetchall_arrayref;
    $sth->finish;

    for my $row (@{$data}) {
        my ($id, $name, $type) = @{$row};
        $TAGS{$name} = $id;
        $type_count{$type || 'unknown'}++;
        if ($type eq 'meta') {
            $META_TAGS{$name}++;
        }
    }

    print scalar(keys %TAGS) . " existing tags read:\n";
    for my $type (sort keys %type_count) {
        printf "  %d of type %s\n", $type_count{$type}, $type;
    }

    $sth = $dbhout->prepare('SELECT id, name FROM "FeatureTags" ORDER BY id');
    $sth->execute;
    $data = $sth->fetchall_arrayref;
    $sth->finish;

    for my $row (@{$data}) {
        my ($id, $name) = @{$row};
        $FEATURE_TAGS{$name} = $id;
    }

    print scalar(keys %FEATURE_TAGS) . " existing feature tags read\n";

    return;
}

sub migrate_authors {
    my ($dbhin, $dbhout) = @_;
    my ($authors_count, $aliases_count) = (0, 0);
    my $now = time2str(time);

    my $sth = $dbhin->prepare('SELECT id, name, aliases FROM authors');
    $sth->execute;
    my $data = $sth->fetchall_arrayref;
    $sth->finish;

    $sth = $dbhout->prepare(
        'INSERT INTO "Authors" ("id", "name", "createdAt", "updatedAt") ' .
        'VALUES (?, ?, ?, ?)'
    );
    my $stha = $dbhout->prepare(
        'INSERT INTO "AuthorAliases" ("authorId", "name") VALUES (?, ?)'
    );
    my $result = eval {
        for my $row (@{$data}) {
            my ($id, $name, $aliases) = @{$row};
            $sth->execute($id, $name, $now, $now);
            $AUTHORS{$id} = $name;
            $authors_count++;

            if ($aliases) {
                my @aliases = split /[|]/, $aliases;
                for my $alias (@aliases) {
                    $stha->execute($id, $alias);
                    $aliases_count++;
                }
            }
        }

        1;
    };
    if (! $result) {
        die "failure in migrate_authors: $@\n";
    }

    $dbhout->commit;

    print "$authors_count rows added to Authors\n";
    print "  $aliases_count author aliases added to AuthorAliases\n";

    return;
}

sub migrate_periodicals {
    my ($dbhin, $dbhout) = @_;

    my $sth = $dbhin->prepare(
        'SELECT id, name, aliases, notes, created, updated FROM periodicals'
    );
    $sth->execute;
    my $data = $sth->fetchall_arrayref;
    $sth->finish;

    $sth = $dbhout->prepare(
        'INSERT INTO "Magazines" ("id", "name", "aliases", "notes", ' .
        '"createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?)'
    );
    my $result = eval {
        for my $row (@{$data}) {
            $row->[4] = time2str($row->[4]);
            $row->[5] = time2str($row->[5]);
            $sth->execute(@{$row});
        }

        1;
    };
    if (! $result) {
        die "failure in migrate_periodicals: $@\n";
    }

    $dbhout->commit;

    print scalar(@{$data}) . " rows added to Magazines\n";

    return;
}

sub setup_pubs_and_series {
    my ($dbhout) = @_;

    # Determine all the publishers that need to be created.
    my %publishers = map { $_->{name} => 1 } (values %{$publishers_data});
    for my $sname (keys %{$series_data}) {
        next if (! $series_data->{$sname}->{publisher});
        $publishers{$series_data->{$sname}->{publisher}} = 1;
    }

    my $sth = $dbhout->prepare(
        'INSERT INTO "Publishers" ("id", "name", "notes") VALUES (?, ?, ?)'
    );
    my $pub_id = 0;
    my $result = eval {
        for my $pubname (sort keys %publishers) {
            $pub_id++;
            $sth->execute($pub_id, $pubname, 'Imported from original source.');
            $PUBLISHERS{$pubname} = $pub_id;
        }

        1;
    };
    if (! $result) {
        die "failure in setup_pubs_and_series: $@\n";
    }
    $sth->finish;
    print "$pub_id rows added to Publishers\n";

    $sth = $dbhout->prepare(
        'INSERT INTO "Series" ("id", "name", "notes", "publisherId") ' .
        'VALUES (?, ?, ?, ?)'
    );
    my $series_id = 0;
    my %skeys = ();
    $result = eval {
        for my $sname (sort keys %{$series_data}) {
            my $name = $series_data->{$sname}->{name};
            my $publisher = $series_data->{$sname}->{publisher};
            my $key = "$name|" . ($publisher || q{});
            if ($skeys{$key}) {
                # This name/publisher pair has already been inserted.
                $SERIES{$sname} = $skeys{$key};
                next;
            } else {
                $series_id++;
                my $publisher_id = $publisher ? $PUBLISHERS{$publisher} : undef;
                $sth->execute(
                    $series_id,
                    $name,
                    'Imported from original source.',
                    $publisher_id
                );
                $skeys{$key} = $SERIES{$sname} = [ $series_id, $publisher_id ];
            }
        }

        1;
    };
    if (! $result) {
        die "failure in setup_pubs_and_series: $@\n";
    }
    $sth->finish;
    print "$series_id rows added to Series\n";

    $dbhout->commit;

    return;
}

sub migrate_reference_table {
    my ($dbhin, $dbhout) = @_;

    my $sth = $dbhin->prepare(
        'SELECT id, name, type, record_type, isbn, lang, keywords, created,' .
        'updated, author, author2, author3, author4, magazine, m_number ' .
        'FROM reference_table'
    );
    $sth->execute;
    my $data = $sth->fetchall_arrayref({});
    $sth->finish;

    my $sth_ish = $dbhout->prepare(
        'INSERT INTO "MagazineIssues" ("id", "magazineId", "issue", ' .
        '"createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?)'
    );
    my $sth_auth = $dbhout->prepare(
        'INSERT INTO "AuthorsReferences" ("authorId", "referenceId") ' .
        'VALUES (?, ?)'
    );
    my $sth_tag = $dbhout->prepare('INSERT INTO "Tags" ("name") VALUES (?)');
    my $sth_tagref = $dbhout->prepare(
        'INSERT INTO "TagsReferences" ("tagId", "referenceId") VALUES (?, ?)'
    );
    my $sth_ref = $dbhout->prepare(
        'INSERT INTO "References" ("id", "name", "language", ' .
        '"referenceTypeId", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?)'
    );

    my $ish_id = 0;
    my %ish_map = ();
    my $total_books = 0;
    my $total_features = 0;
    for my $row (@{$data}) {
        my (
            $id, $name, $type, $record_type, $isbn, $lang, $keywords, $created,
            $updated, $magazine, $m_number
        ) = @{$row}{
            qw(
                id name type record_type isbn lang keywords created updated
                magazine m_number
            )
        };
        my @authors = @{$row}{qw(author author2 author3 author4)};

        $created = time2str($created);
        $updated = time2str($updated);

        # Create the basic Reference entry:
        $sth_ref->execute($id, $name, $lang, $record_type, $created, $updated);

        if ($record_type == 2) {
            # This is a magazine article/feature

            my $key = "$magazine,$m_number";
            my $issue_id;
            if ($ish_map{$key}) {
                $issue_id = $ish_map{$key};
            } else {
                $ish_id++;
                $sth_ish->execute(
                    $ish_id, $magazine, $m_number, $created, $updated
                );
                $issue_id = $ish_map{$key} = $ish_id;
            }

            finish_article($dbhout, $id, $type, $issue_id);
            $total_features++;
        } else {
            # This is a book

            finish_book($dbhout, $id, $isbn, $type);
            $total_books++;
        }

        # Handle tags
        my @tags = keywords2tags($keywords);
        my %applied = ();
        # Check for a reference to scale in the name:
        if ($name =~ m{(?:in)? 1/(\d+) (?:scale)?}) {
            my $scale = "1/$1";
            if ($TAGS{$scale}) {
                push @tags, $scale;
            }
        }
        for my $tag (@tags) {
            # "review" was moved to reference's type field:
            next if ($tag eq 'review');
            next if ($applied{$tag}++);
            if (! $TAGS{$tag}) {
                $sth_tag->execute($tag);
                $TAGS{$tag} = $dbhout->last_insert_id();
            }

            $sth_tagref->execute($TAGS{$tag}, $id);
        }

        # Handle authors
        for my $author (@authors) {
            last if ! $author;
            if (! $AUTHORS{$author}) {
                print "  Invalid author ($author) for reference $id\n";
                next;
            }
            $sth_auth->execute($author, $id);
        }
    }

    $dbhout->commit;

    print scalar(@{$data}) . " rows added to References\n";
    print "  $total_books Books\n";
    print "  $total_features MagazineFeatures\n";
    print "$ish_id rows added to MagazineIssues\n";
    print scalar(keys %TAGS) . " total tags now in Tags\n";

    return;
}

sub finish_book {
    my ($dbhout, $reference_id, $isbn, $type) = @_;

    my $publisher_id = undef;
    my $series_id = undef;
    my $series_number = undef;

    if ($publishers_data->{$type}) {
        # This matches a known publisher-string exactly
        $publisher_id = $PUBLISHERS{$publishers_data->{$type}->{name}};
    } else {
        # It doesn't exactly match a known publisher-string
        my $matched = 0;
        for my $rule (@RULESET) {
            if ($type =~ $rule) {
                $matched++;
                my $name = $1;
                my $number = $2;

                if ($SERIES{$name}) {
                    $series_number = $number;
                    ($series_id, $publisher_id) = @{$SERIES{$name}};
                }

                last;
            }
        }
    }

    my $sth = $dbhout->prepare(
        'INSERT INTO "Books" ("referenceId", "isbn", "publisherId", ' .
        '"seriesId", "seriesNumber") VALUES (?, ?, ?, ?, ?)'
    );
    $sth->execute(
        $reference_id, $isbn, $publisher_id, $series_id, $series_number
    );

    return;
}

sub finish_article {
    my ($dbhout, $reference_id, $type, $issue_id) = @_;

    my $sth_mf = $dbhout->prepare(
        'INSERT INTO MagazineFeatures ("referenceId", "magazineIssueId") ' .
        'VALUES (?, ?)'
    );
    my $sth_ftmf = $dbhout->prepare(
        'INSERT INTO FeatureTagsMagazineFeatures ("featureTagId", ' .
        '"magazineFeatureId") VALUES (?, ?)'
    );

    $sth_mf->execute($reference_id, $issue_id);
    for my $ftag (split m{/}, $type) {
        next if ($ftag eq 'article');
        $sth_ftmf->execute($FEATURE_TAGS{$ftag}, $reference_id);
    }

    return;
}

sub fix_author_dates {
    my $dbh = shift;
    my ($fixed, $skipped) = (0, 0);

    my $authors = $dbh->selectall_arrayref(
        'SELECT * FROM "Authors"', { Slice => {} }
    );
    my $sth = $dbh->prepare(
        'UPDATE "Authors" SET "createdAt" = ?, "updatedAt" = ? ' .
        'WHERE "id" = ?'
    );

    for my $author (@{$authors}) {
        my $refs = $dbh->selectall_arrayref(
            'SELECT r."createdAt", r."updatedAt" FROM "References" r ' .
            'LEFT JOIN "AuthorsReferences" ar ON r."id" = ar."referenceId" ' .
            "WHERE ar.\"authorId\" = $author->{id}",
            { Slice => {} }
        );

        if (0 == @{$refs}) {
            print "  Author '$author->{name}' has no references\n";
            $skipped++;
            next;
        }

        my $created =
            (sort { $a->{createdAt} cmp $b->{createdAt} } @{$refs})[0];
        $sth->execute(
            $created->{createdAt}, $created->{createdAt}, $author->{id}
        );
        $fixed++;
    }

    $dbh->commit;

    print "$fixed author records dates corrected, $skipped skipped.\n";

    return;
}

sub fix_magazine_issue_dates {
    my $dbh = shift;
    my ($fixed, $skipped) = (0, 0);

    my $refs = $dbh->selectall_arrayref(<<'QUERY',
SELECT
    r."createdAt", r."updatedAt", mf."magazineIssueId"
FROM
    "References" r LEFT JOIN "MagazineFeatures" mf ON r."id" = mf."referenceId"
WHERE
    r."referenceTypeId" = 2
QUERY
        { Slice => {} }
    );
    my $sth = $dbh->prepare(
        'UPDATE "MagazineIssues" SET "createdAt" = ?, "updatedAt" = ? ' .
        'WHERE "id" = ?'
    );

    my %issues = ();
    for my $ref (@{$refs}) {
        my $mid = $ref->{magazineIssueId};
        push @{$issues{$mid}}, $ref
    }

    for my $mid (sort { $a <=> $b } keys %issues) {
        my $irefs = $issues{$mid};
        if (1 == @{$irefs}) {
            $skipped++;
            next;
        }

        my @lo_created =
            sort { $a->{createdAt} cmp $b->{createdAt} }  @{$irefs};
        my $lo_created = $lo_created[0]->{createdAt};
        my @hi_updated =
            reverse sort { $a->{updatedAt} cmp $b->{updatedAt} }  @{$irefs};
        my $hi_updated = $hi_updated[0]->{updatedAt};
        $sth->execute($lo_created, $hi_updated, $mid);
        $fixed++;
    }

    $dbh->commit;

    print "$fixed magazine issues' dates adjusted ($skipped had only one " .
        "reference)\n";

    return;
}

# 'YYYY-MM-DD HH:MM:SS'
sub time2str {
    my $time = shift;

    my @time = gmtime $time;

    my $str = sprintf '%4d-%02d-%02d %02d:%02d:%02d',
        $time[5] + 1900,
        $time[4] + 1,
        $time[3],
        $time[2],
        $time[1],
        $time[0];

    return $str;
}

# Transform a keywords field to a list of zero or more tags.
sub keywords2tags {
    my $keywords = shift;
    my @tags = ();

    $keywords = lc $keywords;
    $keywords =~ s/^\s+//;
    $keywords =~ s/\s+$//;
    $keywords =~ s/aicraft/aircraft/;

    if ($keywords) {
        my @keywords = split /\s*,\s*/, $keywords;
        while (! $keywords[0]) {
            shift @keywords;
        }
        if ($keywords[0] =~ /^(\S+) (\S+)$/) {
            my ($general, $type) = ($1, $2);
            if ($type eq 'ship') {
                $type = 'ships';
            } elsif ($type eq 'auto') {
                $type = 'automotive';
            }
            if ($META_TAGS{$type}) {
                splice @keywords, 0, 1, $general, $type;
            }
        }
        if ($keywords[0] eq 'luftwaffe') {
            push @keywords, 'german';
        }
        if ($keywords[0] =~ /^i[ad]f/) {
            push @keywords, 'israeli';
        }
        if ($keywords[0] eq 'soviet') {
            $keywords[0] = 'russian';
        }
        for my $word (@keywords) {
            next if (! $word);
            if ($word eq 'ship') {
                $word = 'ships';
            } elsif ($word eq 'auto') {
                $word = 'automotive';
            } elsif ($word eq 'american dress and detail') {
                $word = 'figures';
            } elsif ($word eq 'basic techniques <-> advanced results') {
                $word = 'techniques';
            } elsif ($word eq 'international color and camoflage') {
                next;
            }

            push @tags, $word;
        }
    }

    return @tags;
}

__END__
