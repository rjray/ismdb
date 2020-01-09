#!/usr/bin/perl

use strict;
use warnings;

use Getopt::Long 'GetOptions';

use DBI;

my %opts;
GetOptions(\%opts, qw(database=s host=s port=i user=s password=s)) or
    die "Error in command line\n";
my ($dbin, $dbout) = @ARGV;

my $attrs = {
    AutoCommit => 0,
    RaiseError => 1,
};

my $dbhi = DBI->connect("dbi:SQLite:$dbin", q{}, q{});
my $outdsn = $dbout =~ /[.]db$/ ?
    "dbi:SQLite:$dbout" :
    "dbi:mysql:database=$dbout;host=$opts{host};port=$opts{port}";
my $dbho = DBI->connect($outdsn, $opts{user}, $opts{password}, $attrs);

migrate_record_types($dbhi, $dbho);
migrate_authors($dbhi, $dbho);
migrate_periodicals($dbhi, $dbho);
migrate_reference_table($dbhi, $dbho);
fix_placeholders($dbho);

$dbhi->disconnect;
$dbho->disconnect;

exit;

sub migrate_record_types {
    my ($dbhin, $dbhout) = @_;

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
        'INSERT INTO `RecordTypes` (`id`, `description`, `notes`) VALUES ' .
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

    print scalar(@data) . " rows added to RecordTypes\n";

    return;
}

sub migrate_authors {
    my ($dbhin, $dbhout) = @_;

    my $sth = $dbhin->prepare('SELECT id, name, aliases FROM authors');
    $sth->execute;
    my $data = $sth->fetchall_arrayref;
    $sth->finish;

    $sth = $dbhout->prepare(
        'INSERT INTO `Authors` (`id`, `name`, `aliases`) VALUES (?, ?, ?)'
    );
    my $result = eval {
        for my $row (@{$data}) {
            $sth->execute(@{$row});
        }

        $dbhout->commit;
    };
    if (! $result) {
        my $err = $@;
        $dbhout->rollback;
        die "failure in migrate_authors: $err\n";
    }

    print scalar(@{$data}) . " rows added to Authors\n";

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

    my $sth_ish = $dbhout->prepare(
        'INSERT INTO `MagazineIssues` (`id`, `magazineId`, `number`, ' .
        '`createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?)'
    );
    my $sth_auth = $dbhout->prepare(
        'INSERT INTO `AuthorsReferences` (`authorId`, `referenceId`, ' .
        '`order`) VALUES (?, ?, ?)'
    );
    $sth = $dbhout->prepare(
        'INSERT INTO `References` (`id`, `name`, `type`, `recordTypeId`, ' .
        '`isbn`, `language`, `keywords`, `createdAt`, `updatedAt`, ' .
        '`magazineIssueId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
                $sth_ish->execute(
                    $ish_id, $row->[13], $row->[14], $base[7], $base[8]
                );
                $base[9] = $ish_map{$key} = $ish_id;
            }
        } else {
            $base[9] = undef;
        }

        $sth->execute(@base);

        my $order = 0;
        for my $author (@{$row}[9..12]) {
            last if ! $author;
            $order++;
            $sth_auth->execute($author, $base[0], $order);
        }
    }

    $dbhout->commit;

    print scalar(@{$data}) . " rows added to References\n";
    print "$ish_id rows added to MagazineIssues\n";

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
