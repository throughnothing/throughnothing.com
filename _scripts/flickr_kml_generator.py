#!/usr/bin/env python
import warnings
warnings.filterwarnings("ignore","",DeprecationWarning)

import sys
import flickrapi
import simplejson as json
from datetime import datetime, date, timedelta

OUTPUT=True
FLICKR_USER_ID='45105880@N00'
FLICKR_API_KEY='27e43dc3a31d4dc2f73bcf1e91dec82c'

BASE_KML="""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.1">
<Document><name>Travelling Two Geotagged Photos for [[DATE]]</name>
<description><![CDATA[Geotagged Images from our travels.]]></description>
[[CONTENT]]</Document></kml>"""

KML_PLACEMARK="""
<Placemark><name>[[NAME]]</name>
<description><![CDATA[[[DESC]]]]></description>
<Point><coordinates>[[LONG]],[[LAT]]</coordinates></Point>
</Placemark>"""

KML_DESC="""
<center><a href="[[PHOTO_URL]]" ><img alt="[[ALT]]" src="[[PHOTO_SRC]]"/></a></center>
<p>[[TEXT]]</p>
"""

flickr = flickrapi.FlickrAPI(FLICKR_API_KEY,format="json")

def flickr_rs(r):
  return r[14:(len(r)-1)]

def get_flickr_photo_url(p,s='z'):
  s = '_' + s
  return "http://farm%s.static.flickr.com/%s/%s_%s%s.jpg" % \
    (str(p['farm']), str(p['server']), str(p['id']), str(p['secret']), str(s))

def output(str):
  print str


if len(sys.argv) < 2:
  print "Usage: %s 2010-10-10" % (sys.argv[0])
  sys.exit()

# KML uses long,lat for coordinates
# Mysql Datetime format:
#    'YYYY-MM-DD HH:MM:SS' 
d = datetime.strptime(sys.argv[1],'%Y-%m-%d')
d2 = d + timedelta(days=1)
min_d = d.strftime('%Y-%m-%d')
max_d = d2.strftime('%Y-%m-%d')
#output(min_d + " : " + max_d)

photos = json.loads(flickr_rs(
    flickr.photos_search(
      user_id=FLICKR_USER_ID,
      has_geo=1,
      extras="geo,description",
      min_taken_date=str(min_d),
      max_taken_date=str(max_d)
    )))

placemarks = ""
for p in photos['photos']['photo']:

  #Build Description
  desc = KML_DESC.replace('[[PHOTO_URL]]',get_flickr_photo_url(p))
  desc = desc.replace('[[ALT]]',str(p['title']))
  desc = desc.replace('[[PHOTO_SRC]]',get_flickr_photo_url(p,'m'))
  desc = desc.replace('[[TEXT]]',str(p['description']['_content']))

  ph = KML_PLACEMARK
  ph = ph.replace('[[NAME]]',str(p['title']))
  ph = ph.replace('[[DESC]]',str(desc))
  ph = ph.replace('[[LONG]]',str(p['longitude']))
  ph = ph.replace('[[LAT]]',str(p['latitude']))
  placemarks = placemarks + ph

kml = BASE_KML
kml = kml.replace('[[DATE]]',min_d)
kml = kml.replace('[[CONTENT]]',placemarks)
output(kml)
