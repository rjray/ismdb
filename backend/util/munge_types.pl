#!/usr/bin/perl

use 5.018;
use strict;
use warnings;
use utf8;

use Carp qw(croak);
use Getopt::Long 'GetOptions';

use DBI;
use YAML qw(DumpFile);

my %opts;
GetOptions(\%opts, qw(publishers|p=s series|s=s)) or
    die "Error in command line\n";

my ($dbin) = @ARGV;

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

my $dbh = DBI->connect("dbi:SQLite:$dbin", q{}, q{}, { sqlite_unicode => 1 });
my $data = $dbh->selectall_arrayref(
    'SELECT DISTINCT(`type`) FROM `reference_table` WHERE `record_type` = 1'
);
$dbh->disconnect;

my %publishers = ();
my %series = ();
for my $entry (@{$data}) {
    my $line = $entry->[0];

    if ($line eq 'Book') {
        next;
    }
    if ($line =~ /^Tank Magazine/) {
        next;
    }
    if ($line =~ /^Abteilung/) {
        $publishers{$line}++;
        next;
    }

    my $matched = 0;
    for my $rule (@RULESET) {
        if ($line =~ $rule) {
            my $name = $1;
            $matched++;

            if (! $series{$name}) {
                $series{$name} = {
                    name => $name,
                    publisher => undef,
                };
            }

            last;
        }
    }

    if (! $matched) {
        $publishers{$line}++;
    }
}

for my $pub (sort keys %publishers) {
    $publishers{$pub} = { name => $pub };
}

if ($opts{publishers}) {
    DumpFile($opts{publishers}, \%publishers);
    print scalar(keys %publishers) . " publishers written.\n";
}

if ($opts{series}) {
    DumpFile($opts{series}, \%series);
    print scalar(keys %series) . " series written.\n";
}

exit;
