/**
 * @author coulon_p
 */

OpenLayers.ZoomToAction = OpenLayers.Class(OpenLayers.BaseAction, {

	easting : null,

	northing : null,

	initialize : function(map, options) {

		OpenLayers.BaseAction.prototype.initialize.apply(this, arguments);

		var eastingValue = null;
		var northingValue = null;

		for (var i = 0; i < options.length; i++) {
			parameter = options[i]

			if (parameter.toString().indexOf("x=") != -1) {
				eastingValue = this.getParemeterValue(parameter);
			}

			if (parameter.toString().indexOf("y=") != -1) {
				northingValue = this.getParemeterValue(parameter);
			}
		};

		if (eastingValue == 0 || northingValue == 0) {
			alert("invalid parameter for ZoomTo action");
			return;
		}
		
		OpenLayers.Util.extend(this, {
			easting : eastingValue,
			northing : northingValue
		});

	},

	execute : function() {

		pt = new OpenLayers.LonLat(this.easting, this.northing);
		this.map.setCenter(pt, 14);
	},

	CLASS_NAME : 'OpenLayers.ZoomToAction'
});
