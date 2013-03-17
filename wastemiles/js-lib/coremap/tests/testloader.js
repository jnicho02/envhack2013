(function() {

	var numClick = 0;

	//Add the various java script files -- note the importance of the
	//order for adding the various files
	var jsFiles = [
	//JQuery
	'../../jquery/jquery.js', '../../jquery/jquery-ui.min.js', '../../jquerylog/jquery.jqlog-1.3.js',
	//OpenLayers
	'../../openlayers/lib/OpenLayers.js', '../../openlayers/lib/OpenLayers/Lang/en.js',
	//Proj4js
	'../../proj4js/lib/proj4js-compressed.js', '../../proj4js/lib/defs/EPSG27700.js',
	//The OpenLayers Editor
	'../../ole/lib/loader.js',

	//DigiRight validation management
	'../validation/baserule.js', '../validation/selfintersectrule.js', '../validation/maxarearule.js', '../validation/minarearule.js', '../validation/validationManager.js', '../validation/maxdigitisedfeature.js'];

	LoadJSFiles("script", jsFiles);

	function LoadJSFiles(fileType, files) {

		var scripts = document.getElementsByTagName(fileType);
		var src = scripts[scripts.length - 1].src;
		var path = src.substring(0, src.lastIndexOf("/") + 1);

		var tags = new Array(files.length);

		var el = document.getElementsByTagName("head").length ? document.getElementsByTagName("head")[0] : document.body;

		for (var i = 0, len = files.length; i < len; i++) {
			tags[i] = "<" + fileType + " src='" + path + files[i] + "'></" + fileType + ">";
		}

		document.write(tags.join(""));
	}

}
)();
