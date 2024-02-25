#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;

my $types = [
    [ 'book', 'Book' ],
    [ 'magazine_feature', 'Magazine Feature' ],
    [ 'photo_collection', 'Photo Collection' ],
];
chomp(my @all_data = <DATA>);

my ($feature, $tags) = split_data(@all_data);

local $" = q{,};

print "Writing feature_tags.csv...\n";
if (open my $fh, '>', 'feature_tags.csv') {
    my $id = 0;
    for my $tag (@{$feature}) {
        $id++;
        print {$fh} "$id,@{$tag}\n";
    }
    close $fh or die "Error closing feature_tags.csv: $!\n";
} else {
    die "Error opening feature_tags.csv: $!\n";
}
print "...done\n";

print "Writing tags.csv...\n";
if (open my $fh, '>', 'tags.csv') {
    my $id = 0;
    for my $tag (@{$tags}) {
        $id++;
        print {$fh} "$id,@{$tag}\n";
    }
    close $fh or die "Error closing tags.csv: $!\n";
} else {
    die "Error opening tags.csv: $!\n";
}
print "...done\n";

print "Writing reference_types.csv...\n";
if (open my $fh, '>', 'reference_types.csv') {
    my $id = 0;
    for my $type (@{$types}) {
        $id++;
        print {$fh} qq($id,@{$type},""\n);
    }
    close $fh or die "Error closing reference_types.csv: $!\n";
} else {
    die "Error opening reference_types.csv: $!\n";
}
print "...done\n";

sub split_data {
    my @data = @_;
    my (@feature, @tags);

    # Skip the first line, it's mostly for doc purposes
    shift @data;

    # Feature tags data
    while (defined(my $line = shift @data)) {
        last if ($line =~ /^DATA/);

        push @feature, [ split /,/ => $line ];
    }

    # Meta tags data
    while (defined(my $line = shift @data)) {
        last if ($line =~ /^DATA/);

        my ($tag, $desc) = split /,/ => $line;
        push @tags, [ $tag, 'meta', $desc ];
    }

    # Nationality tags
    while (defined(my $line = shift @data)) {
        last if ($line =~ /^DATA/);

        my ($tag, $desc) = split /,/ => $line;
        push @tags, [
            $tag, 'nationality', "Manufactured or operated by $desc"
        ];
    }

    # The rest are scale tags
    for my $scale (@data) {
        push @tags, [ "1/$scale", 'scale', "1/$scale scale subject" ];
    }

    return \@feature, \@tags;
}

__END__
DATA:Feature tags
color illustrations,Subject illustrations (in color)
color plates,Color plates
color profiles,Color profiles
coloring guides,Coloring guides
construction,Focus on construction
conversion,Involves a major conversion
cut-away,Cut-away drawings
detail illustration,Illustrations of details
detailing,Focus on additional detailing
diorama,Diorama subject
drawings,Drawings of subject
finishing,Focus on painting and weathering
history,History-oriented
illustrations,Subject illustrations
interior drawings,Interior drawings
line drawings,Subject line drawings
painting,Focus on painting
photo essay,A series of photos with little or no text
photos,Includes photos of the prototype
placeholder,A placeholder for an issue (no content)
profiles,Profiles of the subject
review,Kit review
scale plans,Scale plans of the subject
scratchbuilding,Focus on scratchbuilding
sidebar,An article sidebar
single topic issue,Issue covers only the one topic
techniques,Focus on modeling techniques
unknown,Unknown feature type
walk-around,Walk-around of the subject
DATA:Tags meta
aircraft,An aircraft subject
armor,A ground vehicle subject
figures,A figurine subject
scifi,A science fiction/fantasy subject
ships,A naval/nautical subject
techniques,An entry focusing on techniques
automotive,A civilian ground vehicle subject
diorama,A diorama subject
DATA:Tags nationality
american,the USA
australian,Australia
austrian,Austria
belgian,Belgium
canadian,Canada
chinese,China
czech,the Czech Republic
egyptian,Egypt
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
syrian,Syria
turkish,Turkey
ukrainian,Ukraine
british,England
DATA:Tags scale
6
8
9
12
16
20
24
25
30
32
35
43
48
72
76
96
100
144
150
200
288
350
700
