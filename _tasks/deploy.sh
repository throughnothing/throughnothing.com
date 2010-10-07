#!/bin/bash

rsync --recursive --delete _site/ /var/www/travel.throughnothing.com
