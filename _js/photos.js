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
function random_photos(){
	var photos = [];
	var sets_in_latest_collection = FLICKR_TRAVEL_COLLECTION.collection[0].set.length;
	// Concatenate the latest Collection sets into one
	for(var i = 0; (i < Math.min(FLICKR_SETS.length, sets_in_latest_collection)); i++){
		photos = photos.concat(FLICKR_SETS[i].photos);
	}
	//copy array
	photos = photos.slice(0,photos.length);
	$.each($('#hp_images img'),function(i,img){
		random_photo($(img), photos);
	});
}
function random_photo(img, photos){
	var r = Math.floor(Math.random()*photos.length);
	var p = photos[r];
	img.attr("src", get_flickr_photo_url(p,'s'));
	img.parent().attr("href", get_flickr_photo_url(p,'z'));
	img.parent().attr("target", "_new");
	img.parent().attr("alt", p.title);
	photos.splice(r,1);
}
$(document).ready(function(){
	random_photos();
	setInterval("random_photos()",10000);
});
