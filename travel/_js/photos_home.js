var photos = [];
function get_flickr_photo_url(p,size){
  if(!size)
    size = "";
  else
    size = "_" + size;
  return "http://farm" + p.farm + ".static.flickr.com/" + 
    p.server + "/" + p.id + "_" + p.secret + size + ".jpg";
}
function get_flickr_page(p){
  return "http://www.flickr.com/photos/" + FLICKR_USER_ID + '/' + p.id + '/';
}

function preload_images(){
  $.each(photos,function(i,photo){
      var img = new Image();
      img.src = get_flickr_photo_url(photo,'s');
  });
}
function random_photos(duration){
  //copy array
  var l_photos = photos.slice(0,photos.length);
  $.each($('#hp_images img'),function(i,img){
    img = $(img);
    random_photo($(img), l_photos,i,duration);
  });
}
function random_photo(img, photos,i,duration){
  var r = Math.floor(Math.random()*photos.length);
  var p = photos[r];
  photos.splice(r,1);

  // Have the browser pre-load the image
  var image = new Image();
  image.src = get_flickr_photo_url(p,'s');

  img.delay(duration*i+1).fadeOut('slow',function(){
    img.attr("src", image.src);
    img.parent().attr("href", get_flickr_photo_url(p,'z'));
    img.parent().attr("target", "_new");
    img.parent().attr("alt", p.title);
    img.fadeIn('slow');
  });

}
$(document).ready(function(){
  var sets_in_latest_collection = FLICKR_TRAVEL_COLLECTION.collection[0].set.length;
  // Concatenate the latest Collection sets into one
  for(var i = 0; (i < Math.min(FLICKR_SETS.length, sets_in_latest_collection)); i++){
    photos = photos.concat(FLICKR_SETS[i].photos);
  }

  random_photos(0);
  setTimeout(preload_images,2000);
  setInterval('random_photos(500)',20000);
});
