#!/usr/bin/env python
import warnings
warnings.filterwarnings("ignore","",DeprecationWarning)

import flickrapi
import simplejson as json
###################################
# What data we need:
#   - collections under Travel ("Trips")
#   - Photos in latest collection(s?)
###################################

OUTPUT=True
FLICKR_USER_ID='45105880@N00'
FLICKR_API_KEY='27e43dc3a31d4dc2f73bcf1e91dec82c'
TRAVEL_COLLECTION='1325865-72157624960949253'

flickr = flickrapi.FlickrAPI(FLICKR_API_KEY,format="json")

def flickr_rs(r):
  return r[14:(len(r)-1)]

def output(str):
  print str


# Output Basic Variables
output('var FLICKR_USER_ID = "' + FLICKR_USER_ID + '";')


all_collections = json.loads(flickr_rs(flickr.collections_getTree(collection_id=TRAVEL_COLLECTION,user_id=FLICKR_USER_ID)))

collections = {}
sets = []

for c in all_collections['collections']['collection']:
  if c['title'] == 'Travel':
    collections = c
    output("var FLICKR_TRAVEL_COLLECTION = " + json.dumps(c))
    #Now We are iterating through each collection in "Travel" only
    for tc in c['collection']: 
      for s in tc['set']:
        photos = json.loads(flickr_rs(flickr.photosets_getPhotos(photoset_id=s['id'])))
        s['photos'] = photos['photoset']['photo']
        sets.append(s)

output("var FLICKR_SETS = " + json.dumps(sets))
