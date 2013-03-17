(function() {

	var numClick = 0;

	var cssFiles = ['../js-lib/jquery/themes/mobile/jquery.mobile.css', '../css/style.mobile-jq.css', '../js-lib/openlayers/theme/default/style.mobile.css'];

	LoadCSSFiles('link', cssFiles);

	//Add the various java script files -- note the importance of the
	//order for adding the various files
	var jsFiles = [
	//JQuery
	 '../jquery/jquery.js','../jquery/jquery.mobile.js',

	//OpenLayers
	'../openlayers/lib/OpenLayers.js', '../openlayers/lib/OpenLayers/Lang/en.js',
	//Proj4js
	'../proj4js/lib/proj4js-compressed.js', '../proj4js/lib/defs/EPSG27700.js', 'controls/controlClick.js',
	'controls/locateControl.js','controls/adhockInspectionTool.js','controls/mapManager.js',
	
	//DigiRight Application Framework
	'application/mobile-applicationManager.js',

	//DigiRight action management
	'actions/actionManager.js', 'actions/baseAction.js', 'actions/zoomToAction.js','actions/loadJSONAction.js','actions/LoadSiteInspectionAction.js',

	//DigiRight mode management
	'mode/modeManager.js', 

	//Utility
	'util/jsondataconvertor.js'];

	LoadJSFiles("script", jsFiles);

	function LoadCSSFiles(fileType, files) {

		var tags = new Array(files.length);

		for (var i = 0, len = files.length; i < len; i++) {
			tags[i] = "<" + fileType + " rel='stylesheet'  href='" + files[i] + " ' type='text/css'/>";
		}

		document.write(tags.join(""));
	}

	function LoadJSFiles(fileType, files) {

		var scripts = document.getElementsByTagName(fileType);
		var src = scripts[scripts.length - 1].src;
		var path = src.substring(0, src.lastIndexOf("/") + 1);

		var tags = new Array(files.length);

		for (var i = 0, len = files.length; i < len; i++) {
			tags[i] = "<" + fileType + " src='" + path + files[i] + "'></" + fileType + ">";
		}

		document.write(tags.join(""));
	}

}
)();
