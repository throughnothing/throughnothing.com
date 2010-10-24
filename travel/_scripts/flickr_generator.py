#!/usr/bin/env python
import warnings
warnings.filterwarnings("ignore","",DeprecationWarning)

import sys
import flickrapi
import simplejson as json
from datetime import date, datetime, timedelta

#CONF
FLICKR_USER_ID='45105880@N00'
FLICKR_API_KEY='27e43dc3a31d4dc2f73bcf1e91dec82c'
#END CONF

#KML CONF
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
#END KML CONF

###################################################################################

class FlickrGenerator:
  def __init__(self):
    self.flickr = flickrapi.FlickrAPI(FLICKR_API_KEY,format="json")

  def _parse_rs(self,r):
    return r[14:(len(r)-1)]

  def _output(self,str):
    print str

  def _get_flickr_photo_url(self,p,s='z'):
    s = '_' + str(s)
    return "http://farm%s.static.flickr.com/%s/%s_%s%s.jpg" % \
      (str(p['farm']), str(p['server']), str(p['id']), str(p['secret']), str(s))

  def call(self,func, **kwargs):
    ff = getattr(self.flickr,func)
    return json.loads(self._parse_rs(ff(**kwargs)))

  def _kml_from_photos(self,ps):
    placemarks = ""
    for p in ps:
      #Build Description
      desc = KML_DESC.replace('[[PHOTO_URL]]',self._get_flickr_photo_url(p))
      desc = desc.replace('[[ALT]]',str(p['title']))
      desc = desc.replace('[[PHOTO_SRC]]',self._get_flickr_photo_url(p,'m'))
      desc = desc.replace('[[TEXT]]',str(p['description']['_content']))

      ph = KML_PLACEMARK
      ph = ph.replace('[[NAME]]',str(p['title']))
      ph = ph.replace('[[DESC]]',str(desc))
      ph = ph.replace('[[LONG]]',str(p['longitude']))
      ph = ph.replace('[[LAT]]',str(p['latitude']))
      placemarks = placemarks + ph

    kml = BASE_KML
    kml = kml.replace('[[CONTENT]]',placemarks)
    return kml

  def _photos_search(self, **kwargs):
    my_photos = []
    photos = self.call('photos_search', **kwargs)

    if 'photos' in photos:
      pages =  photos['photos']['pages']
      my_photos.extend(photos['photos']['photo'])
      for i in range(2, int(pages) + 1):
        kwargs['page'] = i
        photos = self.call('photos_search',**kwargs)
        my_photos.extend(photos['photos']['photo'])

      return my_photos
    else:
      print photos
      return False


  def travel_photos_json(self):
    # Output Basic Variables
    self._output('var FLICKR_USER_ID = "' + FLICKR_USER_ID + '";')


    all_collections = self.call('collections_getTree', user_id=FLICKR_USER_ID)
    collections = {}
    sets = []

    for c in all_collections['collections']['collection']:
      if c['title'] == 'Travel':
        collections = c
        self._output("var FLICKR_TRAVEL_COLLECTION = " + json.dumps(c))
        #Now We are iterating through each collection in "Travel" only
        for tc in c['collection']: 
          for s in tc['set']:
            photos = self.call('photosets_getPhotos',photoset_id=s['id'])
            s['photos'] = photos['photoset']['photo']
            sets.append(s)

    self._output("var FLICKR_SETS = " + json.dumps(sets))


  def photos_kml_date(self, dateStr):
    ds = dateStr.split('-')
    if len(ds) != 3 or len(ds[0]) != 4 or len(ds[1]) != 2 or len(ds[2]) != 2:
      return "Invalid Date"

    d = datetime.strptime(dateStr,'%Y-%m-%d')
    d2 = d + timedelta(days=1)
    min_d = d.strftime('%Y-%m-%d')
    max_d = d2.strftime('%Y-%m-%d')

    args = {
      'user_id':FLICKR_USER_ID,
      'has_geo':1,
      'extras':"geo,description",
      'min_taken_date':str(min_d),
      'max_taken_date':str(max_d)
    }
    photos = self._photos_search(**args)
    if photos != False:
      self._output(str(self._kml_from_photos(photos)))
    else:
      self._output("Error Retrieving Result!")

  def photos_kml_all(self):
    my_photos = []
    
    args = {
      "user_id":FLICKR_USER_ID,
      "has_geo":1,
      "extras":"geo,description,date_taken"
    }

    photos = self._photos_search(**args)
    if photos != False:
      self._output(str(self._kml_from_photos(photos)))
    else:
      self.output("Error retrieving photos!")

def usage():
  print "Wrong Usage!"

if __name__ == "__main__":
  if sys.argv > 1:
    fg = FlickrGenerator()
    function = sys.argv[1]
    args = sys.argv[2:]
    #try:
    func = getattr(fg,function)
    func(*args)
    #except Exception, e:
      #sys.stderr.write("%s %s\n" % ("Error Executing: ", e))
  else:
    usage()
