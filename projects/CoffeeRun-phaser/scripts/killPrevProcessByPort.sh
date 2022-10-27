#!/bin/bash

PORT=$1
if [ -z ${PORT} ]; then
  echo "There are no port"
  exit 0
fi;

PID=$(lsof -ti:${PORT})

if [ -z ${PID} ]; then
  echo "There are no pid"
  exit 0
fi;

kill -QUIT ${PID}
