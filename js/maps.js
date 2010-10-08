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

	var map = new google.maps.Map( document.getElementById("world_map_canvas"), myOptions);

	var flayer = new google.maps.KmlLayer('http://pipes.yahoo.com/pipes/pipe.run?_id=bdcb80ac39edf7febb833fd9c03e8759&_render=kml&api_key=280bb4feb4e31caead70be49d570964e&nsid=45105880%40N00&per_page=500');
	//var flayer = new google.maps.KmlLayer('http://pipes.yahoo.com/pipes/pipe.run?_id=bdcb80ac39edf7febb833fd9c03e8759&_render=kml&api_key=280bb4feb4e31caead70be49d570964e&nsid=45105880%40N00&per_page=50&sort=date-posted-desc');
	flayer.setMap(map);
}

function day_map_init(elem, kml) {
	var myOptions = { 
		minZoom: 155555, 
		mapTypeId: google.maps.MapTypeId.HYBRID,
		disableDefaultUI: true,
		navigationControl: true
	};

	var map = new google.maps.Map( elem[0], myOptions);
	

	if(kml){
		var flayer = new google.maps.KmlLayer(kml);
		flayer.setMap(map);
	}
}

function map(elem, kml){
	elem = $(elem);
	p = elem.parent();
	map = p.children('.day_map');
	
	if(map.length == 0 ){
		elem.removeClass('bw');
		var map = $(document.createElement('div'));
		map.addClass('day_map');
		elem.parent().append(map);
	}else{
		if(map.is(':visible')){
			elem.addClass('bw');
			map.fadeOut();
		}else{
			elem.removeClass('bw');
			p.children('.day_map').fadeIn();
		}
	}

	kml = 'http://throughnothing.com/kml/' + kml;
	day_map_init(map, kml);
}
