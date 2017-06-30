#!/bin/sh
ABSPATH=$(dirname $(readlink -f -- "$0"))
SCURLPATH="$ABSPATH/index.js"
SCURL_PPID=$PPID node $SCURLPATH $@
exit $?
