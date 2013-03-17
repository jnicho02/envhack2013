$(function() {

	var configUrl = '../config/web_dev/default.json';

	$.ajax({
		url : configUrl,
		async : false,
		type : 'GET',
		dataType : 'json',
		success : function(config) {

			var mapManager = new OpenLayers.MapManager("map", config);

			var actionManager = new OpenLayers.ActionManager(mapManager.map);

			actionManager.loadActions();

			actionManager.executeActions();

		},
		error : function(request, status, cause) {
			console.log("Error loading map config");
		}
	});

});
