#!/bin/sh
export CURLY_PPID=$PPID
ABSPATH=$(dirname $(readlink -f -- "$0"))
CURLYPATH="$ABSPATH/index.js"
node $CURLYPATH $@
exit $?
