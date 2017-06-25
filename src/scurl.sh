#!/bin/sh
export SCURL_PPID=$PPID
ABSPATH=$(dirname $(readlink -f -- "$0"))
SCURLPATH="$ABSPATH/index.js"
node $SCURLPATH $@
exit $?
