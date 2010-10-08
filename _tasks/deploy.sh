#!/bin/bash

rsync --recursive --delete --verbose _site/ throughnothing@throughnothing.com:/var/www/travel.throughnothing.com/
