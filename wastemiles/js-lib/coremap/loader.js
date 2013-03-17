(function() {

     var numClick = 0;
     
	//Add the various java script files -- note the importance of the
	//order for adding the various files
	var jsFiles = [
	//JQuery
	'../jquery/jquery.js', '../jquery/jquery-ui.min.js', '../jquerylog/jquery.jqlog-1.3.js',
	
	//Proj4js	
	'../proj4js/lib/proj4js-compressed.js', '../proj4js/lib/defs/EPSG27700.js',
	
	//JSTS - Topology Suite
	//'../jsts-master/lib/javascript.util.js','../jsts-master/lib/jsts.js' , 
	
	//The OpenLayers Editor
	'../ole/lib/loader.js',

	//Components
	'controls/layerSwitcher.js', 'controls/mapManager.js',
	 
	//Application Framework
	'application/applicationManager.js',
	 
	];

	LoadJSFiles("script", jsFiles);

	var cssFiles = ['css/style-coremap.css', 'js-lib/jquery/themes/base/jquery.ui.all.css'];
	
	LoadCSSFiles('link', cssFiles);

	function LoadCSSFiles(fileType, files) {
		
		var tags = new Array(files.length);

	   for (var i = 0, len = files.length; i < len; i++) {
			tags[i] = "<" + fileType + " rel='stylesheet'  href='" + "../" +  files[i] + " ' type='text/css'/>";
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
