
/**
 *
 */

/**
 * Class: OpenLayers.MapManager
 *
 *
 * @constructor
 * @param
 * @param
 */
OpenLayers.MapManager = OpenLayers.Class({

	/**
	 * Property: map
	 * {<OpenLayers.Map>} this gets set in the constructor.
	 */
	map : null,

	projection : null,

	activeMapControls : [],
	
	mapCenterEasting : null,

	mapCenterNorthing : null,

	zoomLevel : null,

	activeEditingTool : null,

	layers : null,

	imagePath : null,

	exchangeDataFormat : null,

	resolutions: [],
	
	proxyHost: null,
	
	tileSize: null,

	style : new OpenLayers.Style(
	// the first argument is a base symboliser
	// all other symboliser in rules will extend this one
	{
		graphicWidth : 16,
		graphicHeight : 26
	},
	// the second argument will include all rules
	{
		rules : [new OpenLayers.Rule({
			// a rule contains an optional filter
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.GREATER_THAN,
				property : "score",
				value : "7"
			}),
			// if a feature matches the above filter, use this symboliser
			symbolizer : {
				externalGraphic : "../img/marker-red.png"
			}
		}), new OpenLayers.Rule({
			// a rule contains an optional filter
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.GREATER_THAN,
				property : "score",
				value : "5"
			}),
			// if a feature matches the above filter, use this symboliser
			symbolizer : {
				externalGraphic : "../img/marker-orange.png"
			}
		})
		, new OpenLayers.Rule({
			// a rule contains an optional filter
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.GREATER_THAN,
				property : "score",
				value : "3"
			}),
			// if a feature matches the above filter, use this symboliser
			symbolizer : {
				externalGraphic : "../img/marker-blue.png"
			}
		}), new OpenLayers.Rule({
			// a rule contains an optional filter
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.GREATER_THAN,
				property : "score",
				value : "0"
			}),
			// if a feature matches the above filter, use this symboliser
			symbolizer : {
				externalGraphic : "../img/marker-green.png"
			}
		})]
	}),

	//Initialise the map
	initialize : function(mapControl, options) {
	
		OpenLayers.Util.extend(this, options);

		OpenLayers.ProxyHost = this.proxyHost;
		OpenLayers.ImgPath = this.imagePath;
				
		this.id = OpenLayers.Util.createUniqueID('OpenLayers.MapManager_');

		if (!options) {
			options = {};
		}

		this.map = new  OpenSpace.Map(mapControl, {
			resolutions: this.resolutions,
			controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
           }),
        ],			
		});

		this.addMapLayers();
		this.centreMap();
		this.addMapControls();

	},
	
		
	/**
	 *Centre the map
	 */
	centreMap : function() {

		pt = new OpenLayers.LonLat(this.mapCenterEasting, this.mapCenterNorthing);
		this.map.setCenter(pt, this.zoomLevel);
	},

	/**
	 *Add layers to the map
	 */
	addMapLayers : function() {

		var mapManager = this;

		for (var i = 0, len = mapManager.layers.length; i < len; i++) {

			layer = mapManager.layers[i];

			switch(layer.type) {
				case ("dummy"):
										
					this.setDummyBaseLayer(layer);
					
					break;
				case ("WMS"):
					this.setWMSLayer(layer);
					break;
					
				case ("TileCache"):
					this.setTileCacheLayer(layer);
					break;
					
			}
		}
		
		
		 var organisation = new OpenLayers.Layer.Vector("oragnsiations", {
                strategies: [new OpenLayers.Strategy.BBOX()],
                protocol: new OpenLayers.Protocol.WFS({
                	//http://localhost:8080/geoserver/geostore/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geostore:organisations&maxFeatures=50
                    url:  "http://54.246.122.198:8080/geoserver/geostore/wfs",
                    featureType: "organisations",
                    featureNS: "http://www.openplans.org/topp"
                }),
                //styleMap: this.style
               
            });
            
            organisation.setVisibility(false);
            
            this.map.addLayer(organisation);
         
	},


	setDummyBaseLayer: function (layer){
		dummyLayer = new OpenLayers.Layer(layer.name,{}); 

		
		dummyLayer.maxExtent = new OpenLayers.Bounds(layer.boundMinX, layer.boundMinY, layer.boundMaxX, layer.boundMaxY);
		dummyLayer.projection = new OpenLayers.Projection(layer.projection);

		dummyLayer.isBaseLayer = layer.baseLayer;
		dummyLayer.setVisibility(layer.visible);
		  
		   
		this.map.addLayer(dummyLayer);
		
	},
	
	setTileCacheLayer: function(layer) {

		if (layer.type != "TileCache" || layer.name == null || layer.URL == null || layer.layerList == null || layer.layerList.length != 1) {

			alert("Invalid layer parameter");
			return;
		}

		
		tileCacheLayer = new OpenLayers.Layer.TileCache(layer.name, [layer.URL], layer.layerList[0], {
			serverResolutions : layer.resolutions,
			minResolution: layer.minResolution,
			maxResolution: layer.maxResolution			
		}); 

		tileCacheLayer.maxResolution = layer.maxResolution;
		tileCacheLayer.minResolution = layer.minResolution;
		
		tileCacheLayer.maxExtent = new OpenLayers.Bounds(layer.boundMinX, layer.boundMinY, layer.boundMaxX, layer.boundMaxY);
		tileCacheLayer.projection = new OpenLayers.Projection(layer.projection);

		tileCacheLayer.isBaseLayer = layer.baseLayer;
		tileCacheLayer.displayInLayerSwitcher = layer.displayInLayerSwitcher;
		tileCacheLayer.setVisibility(layer.visible);
		tileCacheLayer.attribution = layer.attribution;   
		   
		this.map.addLayer(tileCacheLayer);
	},


	setWMSLayer : function(layer) {

		if (layer.type != "WMS" || layer.name == null || layer.URL == null || layer.layerList == null || layer.projection == null || layer.boundMinX == null || layer.boundMinY == null || layer.boundMaxX == null || layer.boundMaxY == null) {
			alert("Invalid layer parameter");
			return;
		}

		var wmslayer;

		if (layer.makeTheUrlLong == true) {

			var longText = new Array(205).join("1234567890");

			wmslayer = new OpenLayers.Layer.WMS(layer.name, layer.URL, {
				layers : layer.layerList,
				makeTheUrlLong : longText
			}, {
				tileOptions : {
					maxGetUrlLength : 2048
				}
			});

		} else {
			wmslayer = new OpenLayers.Layer.WMS(layer.name, layer.URL, {
				layers : layer.layerList,
				format : 'image/jpeg',
				transparent: layer.transparent,
			
			}, {
				minResolution: layer.minResolution,
				maxResolution: layer.maxResolution
			});
		}
		
		wmslayer.maxExtent = new OpenLayers.Bounds(layer.boundMinX, layer.boundMinY, layer.boundMaxX, layer.boundMaxY);
		wmslayer.projection = new OpenLayers.Projection(layer.projection);
		wmslayer.singleTile = layer.singleTile;
		wmslayer.transitionEffect = layer.transitionEffect;
		wmslayer.isBaseLayer = layer.baseLayer;
		wmslayer.setVisibility(layer.visible);
		wmslayer.attribution = layer.attribution;
				
		this.map.addLayer(wmslayer);
	},

	/**
	 * Initialises configured controls and shows them on the map
	 */
	
	addMapControls : function() {
		var control = null, controls = [];
		var mapManager = this;

		for (var i = 0, len = mapManager.activeMapControls.length; i < len; i++) {

			control = mapManager.activeMapControls[i];

			switch (control.name) {

				case 'LayerControl':

					// add the LayerSwitcher (a.k.a. Map Legend)
					var layerSwitcher = new OpenLayers.Control.LayerSwitcher();
					layerSwitcher.ascending = false;
					layerSwitcher.useLegendGraphics = true;

					this.map.addControl(layerSwitcher);
					break;

				case 'PanZoomBar':

					//remove the default zoom control
					this.map.removeControl(OpenLayers.Control.Navigation);
					this.map.addControl(new OpenLayers.Control.PanZoomBar());
					break;

				case 'Graticule':

					this.map.addControl(new OpenLayers.Control.Graticule({
						numPoints : 2,
						visible : false,
						labelled : true,
					}));
					break;

				case 'ScaleLine':

					this.map.addControl(new OpenLayers.Control.ScaleLine());
					break;

				case 'MousePosition':

					this.map.addControl(new OpenLayers.Control.MousePosition());
					break;

				case 'MobileSketchTool':
					this.setupMobileSketchTool();
					break;

				case 'FeatureInfo':
					this.setupGetFeatureInfo(control.url);
					break;

				case 'locateControl':
					this.map.addControl(new OpenLayers.Control.gpsControl(this.map));
					break;

				case 'overviewMap':

					var control = new OpenSpace.Control.OverviewMap();
					this.map.addControl(control);
					control.maximizeControl(); 

					break;
			}
		}
	},

	showAttributes: function(e) {
		
		if (e.features && e.features.length) {
			
			var li = "";
						
			for (var i = 0; i < e.features.length; i++) {
				feature = e.features[i];
				li += "<li><div style='width:100%;float:left'> </div>";
				for (var attr in feature.attributes) {
					li += "<li><div style='width:35%;float:left'>" + attr + "</div><div style='width:65%;float:right'>" + feature.attributes[attr] + "</div></li>";
				}
			};
			
			this.displayPopup(li);

		} else {
						
			this.displayPopup("<div style='width:100%;float:left;text-align:center'> No data available - please click on a feature </div>");
		}

	},
	
	displayPopup: function(content) {
		
		$.mobile.changePage("#popup", "pop");
		$("ul#details-list").empty().append(content).listview("refresh");
		
	},
	
	setupGetFeatureInfo: function(url){
		
		infoControls = {
			attributeDisplay : new OpenLayers.Control.WMSGetFeatureInfo({
				url : url,
				title : 'Identify features by clicking',				
				queryVisible : true,
				id: 'attributeDisplay',
				infoFormat : 'application/vnd.ogc.gml'
			})
		}
		
		infoControls.attributeDisplay.events.register("getfeatureinfo", this, this.showAttributes);
		this.map.addControl(infoControls.attributeDisplay);
		
			// Enable toolbar visibility (defaulted to hidden)
		this.showToolbarBySelector("#selectionToolBar");
	},
		
	showToolbarBySelector: function (selector) {
		$(selector)[0].style.visibility = "visible";
	},

	writeFeaturesToOutPutField: function (featureAdded) {

		 var markerLayer = featureAdded.feature.layer;

	  	 var geoJSON = new OpenLayers.Format.GeoJSON();

	  	 jsonString = geoJSON.write(markerLayer.features);

	  	 parent.window.setOutputFieldValue(jsonString);
	},

	setupMobileSketchTool: function(){

		var markerLayer = new OpenLayers.Layer.Vector("MarkerLayer", {
			styleMap : new OpenLayers.StyleMap({
				temporary : OpenLayers.Util.applyDefaults({
					pointRadius : 10,
					strokeWidth : 3,
					cursor : "pointer",
					strokeColor : "red",
				}, OpenLayers.Feature.Vector.style.temporary)

			}),
			style: {
                 fillColor: "yellow",
                 fillOpacity: 0.4,
                 strokeColor: "red",
                 strokeOpacity: 1,
                 strokeWidth: 3,
                 pointRadius: 10
             }
		});


		//add a event handler to write to the output field
		markerLayer.events.register('featureadded', this, this.writeFeaturesToOutPutField);

		markerLayer.displayInLayerSwitcher = false;
		this.map.addLayer(markerLayer);


        var pointControl = new OpenLayers.Control.DrawFeature(markerLayer, OpenLayers.Handler.Point, {
            displayClass: 'olControlDrawFeaturePoint', id: 'drawPoint'
        });

        var polylineControl =  new OpenLayers.Control.DrawFeature(markerLayer, OpenLayers.Handler.Path, {
            displayClass: 'olControlDrawFeaturePath', id: 'drawPolyline'
        });

        var polygonControl = new OpenLayers.Control.DrawFeature(markerLayer, OpenLayers.Handler.Polygon, {
            displayClass: 'olControlDrawFeaturePolygon',  id: 'drawPolygon'
        });

		this.map.addControl(pointControl);
		this.map.addControl(polylineControl);
		this.map.addControl(polygonControl);

		// Enable toolbar visibility (defaulted to hidden)
		this.showToolbarBySelector("#drawing");
},
	
	CLASS_NAME : 'OpenLayers.Mapmanager'
});

