#!/bin/bash

rm -rf _site/*
jekyll

rsync --recursive --delete --verbose _site/ throughnothing@throughnothing.com:/var/www/travel.throughnothing.com/
