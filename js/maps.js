FLICKR_USER_ID="45105880%40N00";
KML_PATH = "http://travel.throughnothing.com/kml/";

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

	var flayer = new google.maps.KmlLayer(
			'http://pipes.yahoo.com/pipes/pipe.run' + 
			'?_id=bdcb80ac39edf7febb833fd9c03e8759&_render=kml' +
			'&api_key=280bb4feb4e31caead70be49d570964e' +
			'&nsid=45105880%40N00&per_page=500'
		);
	/*var flayer = new google.maps.KmlLayer(
			'http://pipes.yahoo.com/pipes/pipe.run' + 
			'?_id=bdcb80ac39edf7febb833fd9c03e8759&_render=kml' +
			'&api_key=280bb4feb4e31caead70be49d570964e' +
			'&nsid=45105880%40N00&per_page=50&sort=date-posted-desc'
		);
	//*/
	flayer.setMap(map);
}

function day_map_init(elem, date, kml) {
	// Get min and max photo dates
	var dates = get_min_max_dates(date);

	var myOptions = { 
		minZoom: 155555, 
		mapTypeId: google.maps.MapTypeId.HYBRID,
		disableDefaultUI: true,
		navigationControl: true,
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.SMALL,
			position: google.maps.ControlPosition.TOP_LEFT
		}
	};

	var map = new google.maps.Map( elem[0], myOptions);

	var kmlStr = 'http://pipes.yahoo.com/pipes/pipe.run' + 
		'?_id=bdcb80ac39edf7febb833fd9c03e8759' + 
		'&_render=kml&api_key=280bb4feb4e31caead70be49d570964e' +
		'&min_taken_date=' + dates.minDateStr  + 
		'&max_taken_date=' + dates.maxDateStr + 
		'&nsid=45105880%40N00&per_page=500';
	var photos = new google.maps.KmlLayer(kmlStr);
	photos.setMap(map);

	if(kml && kml != ""){
		var route = new google.maps.KmlLayer(kml);
		route.setMap(map);
	}
}

function mapt(elem, kml){
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
	dt = new Date(Date.parse(dt.text()));

	kml = KML_PATH + kml;
	day_map_init(map, dt, kml);
}

function get_min_max_dates(date){
	var minDateStr = 
		date.getFullYear() + '-' + 
		two_digits((date.getMonth() + 1)) + '-' + 
		two_digits(date.getDate());
	date.setDate(date.getDate() + 1);
	var maxDateStr = date.getFullYear() + '-' + 
		two_digits((date.getMonth() + 1)) + '-' + 
		two_digits(date.getDate());

	return {minDateStr: minDateStr, maxDateStr: maxDateStr};
}

function two_digits (num){
	if(num < 10)
		num = '0' + num;
	return num;
}
