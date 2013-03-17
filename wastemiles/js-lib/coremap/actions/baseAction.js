/**
 * @author coulon_p
 */
 
OpenLayers.BaseAction = OpenLayers.Class({
	
	map: null,
		
	options: null,
		
	initialize : function(map, options) {
	
	this.map = map;	
	
	this.options = options;
	
	},
	
	execute : function(action) {

	
	},
	
	getParemeterValue : function(parameter) {

		return parameter.substr(parameter.toString().indexOf("=") + 1, parameter.toString().length - parameter.toString().indexOf("="));

	},
	
	CLASS_NAME : 'OpenLayers.BaseAction'
}); 