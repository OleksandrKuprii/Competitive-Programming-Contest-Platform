# parse_time.awk
# Parses cpu and wall time from bash 'time' command
# Output in seconds
#
# Igor Zashchelkin © 2020

NF {
    split($2, a, "m")
    split(a[2], b, "s")

    printf "%f\n", (a[1] * 60 + b[1])
}

NR == 3 { exit }
