#!/usr/bin/env python
import warnings
warnings.filterwarnings("ignore","",DeprecationWarning)

import web
import flickrapi
import simplejson as json
import beaker
from datetime import date, timedelta, datetime

BASE_KML="""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.1">
<Document><name>Travelling Two Geotagged Photos for [[DATE]]</name>
<description><![CDATA[Geotagged Images from our travels.]]></description>
[[CONTENT]]</Document></kml>"""



BASE_NETWORKLINK_CONTROL="""
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.1">
<NetworkLinkControl>
  <minRefreshPeriod>5</minRefreshPeriod>
  <maxSessionLength>-1</maxSessionLength>         
  <linkSnippet maxLines="2">...</linkSnippet>
</NetworkLinkControl>
[[CONTENT]]
</kml>
"""

KML_PLACEMARK="""
<Placemark><name>[[NAME]]</name>
<description><![CDATA[[[DESC]]]]></description>
<Point><coordinates>[[LONG]],[[LAT]]</coordinates></Point>
</Placemark>"""

KML_DESC="""
<center><a href="[[PHOTO_URL]]" ><img alt="[[ALT]]" src="[[PHOTO_SRC]]"/></a></center>
<p>[[TEXT]]</p>
"""

urls = ( 
  '/json/photos', 'photos_json',
  '/kml/photos/(.*)', 'photos_kml',
  '/kml/photos_bbox', 'photos_bbox'
)
app = web.application(urls, globals())


class flickr:
  USER_ID='45105880@N00'
  API_KEY='27e43dc3a31d4dc2f73bcf1e91dec82c'
  TRAVEL_COLLECTION='1325865-72157624960949253'
  output_s = ''

  def __init__(self):
    self.f = flickrapi.FlickrAPI(self.API_KEY,format="json")

  def call(self, func, **kwargs):
    ff = getattr(self.f,func)
    return json.loads(self.parse_rs(ff(**kwargs)))

  def output(self,s):
    self.output_s = str(self.output_s) + str(s)
  
  def get_output(self):
    return self.output_s

  def parse_rs(self,r):
    return r[14:(len(r)-1)]

  def get_flickr_photo_url(self, p,s='z'):
    s = '_' + s
    return "http://farm%s.static.flickr.com/%s/%s_%s%s.jpg" % \
      (str(p['farm']), str(p['server']), str(p['id']), str(p['secret']), str(s))

# Global flickr object
f = flickr();

def kml_from_photos(ps):
  placemarks = ""
  for p in ps:
    #Build Description
    desc = KML_DESC.replace('[[PHOTO_URL]]',f.get_flickr_photo_url(p))
    desc = desc.replace('[[ALT]]',str(p['title']))
    desc = desc.replace('[[PHOTO_SRC]]',f.get_flickr_photo_url(p,'m'))
    desc = desc.replace('[[TEXT]]',str(p['description']['_content']))

    ph = KML_PLACEMARK
    ph = ph.replace('[[NAME]]',str(p['title']))
    ph = ph.replace('[[DESC]]',str(desc))
    ph = ph.replace('[[LONG]]',str(p['longitude']))
    ph = ph.replace('[[LAT]]',str(p['latitude']))
    placemarks = placemarks + ph

  #kml = BASE_NETWORKLINK_CONTROL
  kml = BASE_KML
  #kml = kml.replace('[[DATE]]',str(p['datetaken']))
  kml = kml.replace('[[CONTENT]]',placemarks)
  #kml = kml.replace('[[UPDATE]]',placemarks)
  return kml

class photos_bbox:
  def GET(self):
    data = web.input()
    print data
    if 'BBOX' not in data:
      return BASE_KML.replace('[[CONTENT]]','');

    my_photos = []

    d = date(2005,1,1)
    d2 = date.today()
    min_d = d.strftime('%Y-%m-%d')
    max_d = d2.strftime('%Y-%m-%d')

    photos = f.call('photos_search',
          user_id=f.USER_ID,
          has_geo=1,
          bbox=data['BBOX'],
          extras="geo,description,date_taken",
          min_taken_date=min_d,
          max_taken_date=max_d,
        )
  
    if 'photos' in photos:
      print "PAGE: " + str(photos['photos']['page'])
      print "Photos: " + str(len(photos['photos']['photo']))
      pages =  photos['photos']['pages']
      my_photos.extend(photos['photos']['photo'])
      for i in range(2, int(pages) + 1):
        photos = f.call('photos_search',
              user_id=f.USER_ID,
              has_geo=1,
              #bbox=data['BBOX'],
              page=i,
              extras="geo,description,date_taken",
              min_taken_date=min_d,
              max_taken_date=max_d,
            )
        print "PAGE: " + str(photos['photos']['page'])
        print "Photos: " + str(len(photos['photos']['photo']))
        my_photos.extend(photos['photos']['photo'])

      print "AllPhotosLength: " + str(len(my_photos))

      return str(kml_from_photos(my_photos))
    else:
      print photos
      return "Nothing Found"


class photos_kml:
  def GET(self,dateStr):
    ds = dateStr.split('-')
    if len(ds) != 3 or len(ds[0]) != 4 or len(ds[1]) != 2 or len(ds[2]) != 2:
      return "Invalid Date"

    d = datetime.strptime(dateStr,'%Y-%m-%d')
    d2 = d + timedelta(days=1)
    min_d = d.strftime('%Y-%m-%d')
    max_d = d2.strftime('%Y-%m-%d')

    photos = f.call('photos_search',
          user_id=f.USER_ID,
          has_geo=1,
          extras="geo,description",
          min_taken_date=str(min_d),
          max_taken_date=str(max_d)
        )

    placemarks = ""
    for p in photos['photos']['photo']:

      #Build Description
      desc = KML_DESC.replace('[[PHOTO_URL]]',f.get_flickr_photo_url(p))
      desc = desc.replace('[[ALT]]',str(p['title']))
      desc = desc.replace('[[PHOTO_SRC]]',f.get_flickr_photo_url(p,'m'))
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
    return kml

class photos_json:
  def GET(self):
    output = ""
    f.output('var FLICKR_USER_ID = "' + f.USER_ID + '";')

    all_collections = f.call(
      'collections_getTree', 
      collection_id=f.TRAVEL_COLLECTION,
      user_id=f.USER_ID)

    collections = {}
    sets = []

    for c in all_collections['collections']['collection']:
      if c['title'] == 'Travel':
        collections = c
        f.output("var FLICKR_TRAVEL_COLLECTION = " + json.dumps(c))
        #Now We are iterating through each collection in "Travel" only
        for tc in c['collection']: 
          for s in tc['set']:
            photos = f.call('photosets_getPhotos',photoset_id=s['id'])
            s['photos'] = photos['photoset']['photo']
            sets.append(s)

    f.output("var FLICKR_SETS = " + json.dumps(sets))
    return f.get_output()



if __name__ == "__main__":
  app.run()
