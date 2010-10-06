function load_map_script(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.google.com/maps/api/js?sensor=false";
	document.body.appendChild(script);
}

function world_map_init() {
	var latlng = new google.maps.LatLng(45.397, 20.644);
	var myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var map = new google.maps.Map( document.getElementById("world_map_canvas"), myOptions);

	var flayer = new google.maps.KmlLayer('http://pipes.yahoo.com/pipes/pipe.run?_id=bdcb80ac39edf7febb833fd9c03e8759&_render=kml&api_key=280bb4feb4e31caead70be49d570964e&nsid=45105880%40N00&per_page=500');
	flayer.setMap(map);
};
