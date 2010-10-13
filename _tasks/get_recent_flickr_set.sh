#!/bin/bash

if [[ ! -n "$1" ]]; then
	echo "Usage: $0 [photoset_id]"
	exit 0;
fi

curl "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=27e43dc3a31d4dc2f73bcf1e91dec82c&photoset_id=$1&format=json" > flickr_recent_set.json
