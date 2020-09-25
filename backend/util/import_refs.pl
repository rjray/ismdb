#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use utf8;

use Carp qw(croak);
use Getopt::Long 'GetOptions';

use DBI;

# Used by the keyword-to-tags conversion:
my %META_TAGS = (
    aircraft   => 'An aircraft subject',
    armor      => 'A ground vehicle subject',
    figures    => 'A figurine subject',
    ships      => 'A naval/nautical subject',
    techniques => 'An article focusing on techniques',
    automotive => 'A civilian ground vehicle subject',
    diorama    => 'A diorama subject',
);
my @SCALE_TAGS = (
    6, 8, 9, 12, 16, 20, 24, 25, 30, 32, 35, 43, 48, 72, 76, 96, 100, 144, 150,
    200, 288, 350, 700
);

# This will be the global table of tags, mapping names to IDs:
my %TAGS = ();

my %opts;
GetOptions(\%opts, qw(host=s port=i username=s password=s env:s)) or
    die "Error in command line\n";
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
                if ($key eq 'database') {
                    $dbout ||= $val;
                } else {
                    $opts{$key} ||= $val;
                }
            } else {
                warn "Bad line ($line) in $envfile. Skipping\n";
            }
        }
    } else {
        croak "Error opening $envfile for reading: $!";
    }
}
# port defaults to 3306:
$opts{port} ||= 3306;
# host defaults to localhost:
$opts{host} ||= 'localhost';

my $attrs = {
    AutoCommit => 0,
    RaiseError => 1,
};

my $dbhi = DBI->connect("dbi:SQLite:$dbin", q{}, q{}, { sqlite_unicode => 1 });
my $dbho = DBI->connect(
    "dbi:mysql:database=$dbout;host=$opts{host};port=$opts{port}",
    $opts{username},
    $opts{password},
    $attrs
);
$dbho->{mysql_enable_utf8mb4} = 1;
$dbho->do('set names "UTF8"');

setup_meta_tags($dbho);
seed_record_types($dbho);
migrate_authors($dbhi, $dbho);
migrate_periodicals($dbhi, $dbho);
migrate_reference_table($dbhi, $dbho);
fix_placeholders($dbho);
fix_author_dates($dbho);
fix_magazine_issue_dates($dbho);

$dbhi->disconnect;
$dbho->disconnect;

exit;

sub setup_meta_tags {
    my $dbhout = shift;

    my $sth = $dbhout->prepare(
        'INSERT INTO `Tags` (`id`, `name`, `description`, `type`) VALUES ' .
        '(?, ?, ?, ?)'
    );

    my $result = eval {
        my $id = 0;
        for my $tag (sort keys %META_TAGS) {
            $sth->execute(++$id, $tag, $META_TAGS{$tag}, 'meta');
            $TAGS{$tag} = $id;
        }

        $dbhout->commit;
        return $id;
    };
    if (! $result) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in setup_meta_tags: $err\n";
    }

    print scalar(keys %META_TAGS) . " meta tags seeded to Tags\n";

    my @nationalities = <DATA>;
    chomp @nationalities;
    my $result2 = eval {
        my $id = $result;
        for my $pair (@nationalities) {
            my ($tag, $country) = split /,/ => $pair;
            my $desc = "Manufactured or operated by $country";
            $sth->execute(++$id, $tag, $desc, 'nationality');
            $TAGS{$tag} = $id;
        }

        $dbhout->commit;
        return $id;
    };
    if (! $result2) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in setup_meta_tags: $err\n";
    }

    print scalar(@nationalities) . " nationality tags seeded to Tags\n";

    my $result3 = eval {
        my $id = $result2;
        for my $scale (@SCALE_TAGS) {
            my $tag = "1/$scale";
            my $desc = "$tag scale subject";
            $sth->execute(++$id, $tag, $desc, 'scale');
            $TAGS{$tag} = $id;
        }
        $sth->execute(++$id, 'box-scale', 'Box-scale subject', 'scale');

        $dbhout->commit;
        return $id;
    };
    if (! $result3) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in setup_meta_tags: $err\n";
    }

    printf "%d scale tags seeded to Tags\n", scalar(@SCALE_TAGS) + 1;

    return;
}

sub seed_record_types {
    my $dbhout = shift;

    # For this one, nothing is read from the input DB. Just stuff the following
    # data in:
    my @data = (
        [ 1, 'book', 'Book' ],
        [ 2, 'article', 'Magazine Feature' ],
        [ 3, 'placeholder', 'Magazine Placeholder' ],
        [ 4, 'photos', 'Photo Collection' ],
        [ 5, 'dvdcd', 'DVD-ROM or CD-ROM' ],
    );

    my $sth = $dbhout->prepare(
        'INSERT INTO `RecordTypes` (`id`, `name`, `description`) VALUES ' .
        '(?, ?, ?)'
    );
    my $result = eval {
        for my $row (@data) {
            $sth->execute(@{$row});
        }

        $dbhout->commit;
    };
    if (! $result) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in migrate_record_types: $err\n";
    }

    print scalar(@data) . " rows seeded to RecordTypes\n";

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
        'INSERT INTO `Authors` (`id`, `name`, `createdAt`, `updatedAt`) ' .
        'VALUES (?, ?, ?, ?)'
    );
    my $stha = $dbhout->prepare(
        'INSERT INTO `AuthorAliases` (`authorId`, `name`) VALUES (?, ?)'
    );
    my $result = eval {
        for my $row (@{$data}) {
            my ($id, $name, $aliases) = @{$row};
            $sth->execute($id, $name, $now, $now);
            $authors_count++;

            if ($aliases) {
                my @aliases = split /[|]/, $aliases;
                for my $alias (@aliases) {
                    $stha->execute($id, $alias);
                    $aliases_count++;
                }
            }
        }

        $dbhout->commit;
    };
    if (! $result) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in migrate_authors: $err\n";
    }

    print "$authors_count rows added to Authors\n";
    print "$aliases_count author aliases added\n";

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
        'INSERT INTO `Magazines` (`id`, `name`, `aliases`, `notes`, ' .
        '`createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?, ?)'
    );
    my $result = eval {
        for my $row (@{$data}) {
            $row->[4] = time2str($row->[4]);
            $row->[5] = time2str($row->[5]);
            $sth->execute(@{$row});
        }

        $dbhout->commit;
    };
    if (! $result) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in migrate_periodicals: $err\n";
    }

    print scalar(@{$data}) . " rows added to Magazines\n";

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
    my $data = $sth->fetchall_arrayref;
    $sth->finish;

    my $authors = $dbhout->selectall_hashref('SELECT * FROM Authors', 'id');

    my $sth_ish = $dbhout->prepare(
        'INSERT INTO `MagazineIssues` (`id`, `magazineId`, `number`, ' .
        '`createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)'
    );
    my $sth_auth = $dbhout->prepare(
        'INSERT INTO `AuthorsReferences` (`authorId`, `referenceId`, ' .
        '`order`) VALUES (?, ?, ?)'
    );
    my $sth_tag = $dbhout->prepare('INSERT INTO `Tags` (`name`) VALUES (?)');
    my $sth_tagref = $dbhout->prepare(
        'INSERT INTO `TagsReferences` (`tagId`, `referenceId`) VALUES (?, ?)'
    );
    $sth = $dbhout->prepare(
        'INSERT INTO `References` (`id`, `name`, `type`, `recordTypeId`, ' .
        '`isbn`, `language`, `createdAt`, `updatedAt`, ' .
        '`magazineIssueId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );

    my $ish_id = 0;
    my %ish_map = ();
    for my $row (@{$data}) {
        my @base = @{$row}[0..8];
        $base[7] = time2str($base[7]);
        $base[8] = time2str($base[8]);
        if ($row->[13]) {
            my $key = "$row->[13],$row->[14]";
            if ($ish_map{$key}) {
                $base[9] = $ish_map{$key};
            } else {
                $ish_id++;
                $sth_ish->execute($ish_id, $row->[13], $row->[14],
                                  $base[7], $base[8]);
                $base[9] = $ish_map{$key} = $ish_id;
            }
        } else {
            $base[9] = undef;
        }

        my $keywords = splice @base, 6, 1;
        $sth->execute(@base);

        # 'keywords' is field 6:
        my @tags = keywords2tags($keywords);
        my %applied = ();
        # Check for a reference to scale in the name ($base[1] is name):
        if ($base[1] =~ m{(?:in)? 1/(\d+) (?:scale)?}) {
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
                $TAGS{$tag} = $sth_tag->{mysql_insertid};
            }

            $sth_tagref->execute($TAGS{$tag}, $base[0]);
        }

        my $order = 0;
        for my $author (@{$row}[9..12]) {
            last if ! $author;
            if (! $authors->{$author}) {
                print "  Invalid author ($author) for reference $base[0]\n";
                next;
            }
            $order++;
            $sth_auth->execute($author, $base[0], $order);
        }
    }

    $dbhout->commit;

    print scalar(@{$data}) . " rows added to References\n";
    print "$ish_id rows added to MagazineIssues\n";
    print scalar(keys %TAGS) . " total tags now in Tags\n";

    return;
}

sub fix_placeholders {
    my $dbh = shift;

    $dbh->do(
        'UPDATE `References` SET `recordTypeId` = 3 WHERE ' .
        '`type` = "placeholder"'
    );
    $dbh->commit;

    return;
}

sub fix_author_dates {
    my $dbh = shift;
    my ($fixed, $skipped) = (0, 0);

    my $authors = $dbh->selectall_arrayref(
        'SELECT * FROM `Authors`', { Slice => {} }
    );
    my $sth = $dbh->prepare(
        'UPDATE `Authors` SET `createdAt` = ?, `updatedAt` = ? ' .
        'WHERE `id` = ?'
    );

    for my $author (@{$authors}) {
        my $refs = $dbh->selectall_arrayref(
            'SELECT r.`createdAt`, r.`updatedAt` FROM `References` r ' .
            'LEFT JOIN `AuthorsReferences` ar ON r.`id` = ar.`referenceId` ' .
            "WHERE ar.`authorId` = $author->{id}",
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

    my $refs = $dbh->selectall_arrayref(
        'SELECT * FROM `References` WHERE `magazineIssueId` IS NOT NULL',
        { Slice => {} }
    );
    my $sth = $dbh->prepare(
        'UPDATE `MagazineIssues` SET `createdAt` = ?, `updatedAt` = ? ' .
        'WHERE `id` = ?'
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
            }

            push @tags, $word;
        }
    }

    return @tags;
}

__END__
australian,Australia
austrian,Austria
belgian,Belgium
chinese,China
czech,The Czech Republic
finnish,Finland
french,France
german,Germany
greek,Greece
indian,India
iranian,Iran
iraqi,Iraq
irish,Ireland
israeli,Israel
italian,Italy
japanese,Japan
lebanese,Lebanon
libyan,Libya
mexican,Mexico
dutch,The Netherlands
pakistani,Pakistan
palestinian,Palestine
polish,Poland
russian,Russia
saudi,Saudi Arabia
scottish,Scotland
spanish,Spain
swedish,Sweden
swiss,Switzerland
syrian,Syrian
turkish,Turkey
ukrainian,Ukraine
british,England
