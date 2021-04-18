#!/bin/bash
docker run -dti --env ID=$1 --name Server$1 -p $1:3000 serverimagen