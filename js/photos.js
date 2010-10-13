var FLICKR_API_KEY = '27e43dc3a31d4dc2f73bcf1e91dec82c';
var MOST_RECENT_PHOTOSET = '72157625017917965';

/* RECENT FLICKR JSON */
var recent_photos = {"photoset":{"id":"72157625017917965", "primary":"5073219907", "owner":"45105880@N00", "ownername":"throughnothing", "photo":[{"id":"5073624215", "secret":"6827119ba4", "server":"4131", "farm":5, "title":"Heading to the Barefoot Run", "isprimary":"0"}, {"id":"5074222384", "secret":"ddf0426fde", "server":"4132", "farm":5, "title":"Beautiful NYC Metro Ceiling", "isprimary":"0"}, {"id":"5074223198", "secret":"8fbc4ee26f", "server":"4151", "farm":5, "title":"On the ferry to Governor's Island", "isprimary":"0"}, {"id":"5073623493", "secret":"066b3b198b", "server":"4146", "farm":5, "title":"New York City from Governor's Island", "isprimary":"0"}, {"id":"5073627375", "secret":"6e0bd716b2", "server":"4110", "farm":5, "title":"Walking to the starting line", "isprimary":"0"}, {"id":"5074225352", "secret":"d16d593e59", "server":"4092", "farm":5, "title":"Me and Mom", "isprimary":"0"}, {"id":"5074226420", "secret":"eb202a86b3", "server":"4147", "farm":5, "title":"Almost Race Time", "isprimary":"0"}, {"id":"5073219907", "secret":"162a6e7146", "server":"4112", "farm":5, "title":"Whole Group Panorama", "isprimary":"1"}, {"id":"5074227270", "secret":"50bfbfb1c7", "server":"4105", "farm":5, "title":"Lots of bare feet!", "isprimary":"0"}, {"id":"5074227984", "secret":"1de8e4de54", "server":"4149", "farm":5, "title":"Durant prepping everyone for the race", "isprimary":"0"}, {"id":"5073631425", "secret":"a61451cb48", "server":"4149", "farm":5, "title":"Everyone's ready to go", "isprimary":"0"}, {"id":"5073834497", "secret":"6bb1cc4ddd", "server":"4106", "farm":5, "title":"Persistence trot with barefoot Ted", "isprimary":"0"}, {"id":"5073833565", "secret":"0af0584ae5", "server":"4104", "farm":5, "title":"Barefoot Ted wild foraging in NYC", "isprimary":"0"}, {"id":"5073632341", "secret":"77a1933bee", "server":"4112", "farm":5, "title":"\"Finishing\"", "isprimary":"0"}, {"id":"5073633189", "secret":"dd2052fa73", "server":"4106", "farm":5, "title":"Yummy Coconut Water", "isprimary":"0"}, {"id":"5074230982", "secret":"d0d4d3c972", "server":"4108", "farm":5, "title":"NYC Metro Escalator", "isprimary":"0"}, {"id":"5074231974", "secret":"c39196ec1e", "server":"4129", "farm":5, "title":"NYC Metro Bench", "isprimary":"0"}, {"id":"5074232900", "secret":"4481e78dc6", "server":"4147", "farm":5, "title":"Walking through the metro station", "isprimary":"0"}, {"id":"5074233864", "secret":"d8f1511e3e", "server":"4126", "farm":5, "title":"Downtown Smoke Stack", "isprimary":"0"}, {"id":"5074235064", "secret":"f743ce9cdb", "server":"4088", "farm":5, "title":"PJ Clarke's for lunch", "isprimary":"0"}, {"id":"5073638579", "secret":"c1d560734c", "server":"4128", "farm":5, "title":"By the harbour", "isprimary":"0"}, {"id":"5074236456", "secret":"5a418215dc", "server":"4153", "farm":5, "title":"DSC_3579", "isprimary":"0"}, {"id":"5074237080", "secret":"9f460d07c2", "server":"4149", "farm":5, "title":"DSC_3590", "isprimary":"0"}, {"id":"5073640761", "secret":"054e50bb53", "server":"4104", "farm":5, "title":"Lonely Sailboat", "isprimary":"0"}, {"id":"5074238648", "secret":"ce569df9a9", "server":"4090", "farm":5, "title":"Holding back the smile", "isprimary":"0"}, {"id":"5074239756", "secret":"614bf52a6f", "server":"4091", "farm":5, "title":"Vibrams by the harbour", "isprimary":"0"}, {"id":"5074240992", "secret":"618aa12de7", "server":"4133", "farm":5, "title":"Dog Free !?! :(", "isprimary":"0"}, {"id":"5074241626", "secret":"e5aa525a4c", "server":"4154", "farm":5, "title":"Tunnel out of NYC", "isprimary":"0"}, {"id":"5074242236", "secret":"892f525662", "server":"4130", "farm":5, "title":"Bye Bye NYC", "isprimary":"0"}, {"id":"5074242854", "secret":"9bf498967f", "server":"4107", "farm":5, "title":"Good Ole' Jersey Gas Line", "isprimary":"0"}], "page":1, "per_page":500, "perpage":500, "pages":1, "total":"30"}, "stat":"ok"}
/* END RECENT FLICKR JSON */

function get_flickr_photo_url(p){
	return "http://farm" + p.farm + ".static.flickr.com/" + 
		p.server + "/" + p.id + "_" + p.secret + "_s.jpg";
}

function get_flickr_page(p){
	var user_id = recent_photos.photoset.owner;
	return "http://www.flickr.com/photos/" + user_id + '/' + p.id + '/';
}

function random_photos(){
	var photos = recent_photos.photoset.photo;
	//copy array
	photos = photos.slice(0,photos.length);
	$.each($('#images img'),function(i,img){
		random_photo($(img), photos);
	});
}

function random_photo(img, photos){
	var r = Math.floor(Math.random()*photos.length);
	var p = photos[r];
	img.attr("src", get_flickr_photo_url(p));
	img.parent().attr("href", get_flickr_page(p));
	img.parent().attr("target", "_new");
	img.parent().attr("alt", p.title);
	photos.splice(r,1);
}

$(document).ready(function(){
	random_photos();
	setInterval("random_photos()",10000);
});
