KML_PATH = "http://travel.throughnothing.com/kml/";

/* Flickr Functions */
function get_photos_kml(date){
  var dates = get_min_max_dates(date);
  //For testing when google wants to cache the kml files :P
  //var kmlStr = KML_PATH + dates.minDateStr + '-photos.kml?dummy=' + (new Date().getTime());
  var kmlStr = KML_PATH + dates.minDateStr + '-photos.kml';
  return kmlStr;
}
/* End Flickr Functions */

function world_map_init() {
  var myOptions = { 
    zoom: 3, 
    mapTypeId: google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true,
    navigationControl: true,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  };

  var map = new google.maps.Map( $("#world_map_canvas")[0], myOptions);

  if(window.location.hash){
    var dateStr = window.location.hash.split('#')[1];
    var kml = 'http://travel.throughnothing.com/kml/' + 
      dateStr + '.kml';
    //Add Route Layer
    var hash_layer = new google.maps.KmlLayer(kml);
    hash_layer.setMap(map);

    //Add Flickr Layer
    var dateParts = dateStr.split('-');
    var kmlStr = get_photos_kml(new Date(dateParts[0],dateParts[1]-1,dateParts[2]));
    var photos = new google.maps.KmlLayer(kmlStr);
    photos.setMap(map);
  }else{
    var flayer = new google.maps.KmlLayer(
        KML_PATH + 'all_photos.kml');
    /*var flayer = new google.maps.KmlLayer(
        'http://pipes.yahoo.com/pipespipe.run' + 
        '?_id=bdcb80ac39edf7febb833fd9c03e8759&_render=kml' +
        '&api_key=280bb4feb4e31caead70be49d570964e' +
        '&nsid=45105880%40N00&per_page=500'
      );
      */
    flayer.setMap(map);
  }
}

function day_map_init(elem, date) {
  // Get min and max photo dates
  var dates = get_min_max_dates(date);
  var kml = KML_PATH + dates.minDateStr + '.kml';

  var myOptions = { 
    minZoom: 1, 
    mapTypeId: google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true,
    navigationControl: true,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_LEFT
    }
  };

  var map = new google.maps.Map( elem[0], myOptions);
  if(kml && kml != ""){
    var route = new google.maps.KmlLayer(kml);
    route.setMap(map);
  }

  var kmlStr = get_photos_kml(date);
  if (kmlStr && kmlStr != ""){
    var photos = new google.maps.KmlLayer(kmlStr);
    photos.setMap(map);
  }
}

function mapt(elem){
  elem = $(elem);
  p = elem.parent();
  var mapw = p.children('.day_map_wrap');
  var map = mapw.children('.day_map');
  
  if(map.length == 0 ){
    map = $(document.createElement('div'));
    map.addClass('day_map');
    mapw = $(document.createElement('div'));
    mapw.addClass('day_map_wrap');
    mapw.append(map);
    elem.parent().append(mapw);
  }else{
    if(map.is(':visible')){
      mapw.fadeOut();
    }else{
      mapw.fadeIn();
    }
  }

  // Get the entry's post date
  var dt = p.children('.date');
  dt = new Date(dt.text());
  day_map_init(map, dt);
}

function get_min_max_dates(date){
  var minDateStr = 
    date.getFullYear() + '-' + 
    two_digits((date.getMonth() + 1)) + '-' + 
    two_digits(date.getDate());
  var d2 = new Date(date)
  d2.setDate(date.getDate() + 1);
  var maxDateStr = d2.getFullYear() + '-' + 
    two_digits((d2.getMonth() + 1)) + '-' + 
    two_digits(d2.getDate());

  return {minDateStr: minDateStr, maxDateStr: maxDateStr};
}

function two_digits (num){
  if(num < 10)
    num = '0' + num;
  return num;
}
