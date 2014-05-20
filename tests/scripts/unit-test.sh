#!/bin/bash
BASE_DIR=`dirname $0`

KARMA_CONF=${BASE_DIR}/../conf/karma.conf.js
if [[ -n "$1" ]]
  then
    KARMA_CONF=$1
fi

echo "Base dir is = "${BASE_DIR}
echo "Karma conf is = "${KARMA_CONF}

echo ""
echo "Starting UnitTest Karma Server"
echo "-------------------------------------------------------------------"

karma start ${KARMA_CONF} $*