// Start with the map page
//window.location.replace(window.location.href.split("#")[0] + "#mappage");

var selectedFeature = null;

// fix height of content
function fixContentHeight() {

	var footer = $("div[data-role='footer']:visible"), content = $("div[data-role='content']:visible:visible"), viewHeight = $(window).height(), contentHeight = viewHeight - footer.outerHeight();

	if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
		contentHeight -= (content.outerHeight() - content.height() + 1);
		content.height(contentHeight);
	}

	if (window.map && window.map instanceof OpenLayers.Map) {
		if (!layerinitialised) {
			layerinitialised = true;
		}

		map.updateSize();
	} else {
		// initialise map
		init(function(feature) {
			selectedFeature = feature;
			$.mobile.changePage("#popup", "pop");
		});

	}
}

var layerinitialised = false;
var loaded = false;
var map;

var init = function(onSelectFeatureFunction) {

	if (!loaded) {

		var modeManager = new OpenLayers.ModeManager('../config/mode-mapping-mobile.json');
		var configUrl = modeManager.getConfigUrl();

		$.ajax({
			url : configUrl,
			async : false,
			type : 'GET',
			dataType : 'json',
			success : function(config) {
				loaded = true;
				var mapManager = new OpenLayers.MapManager("map", config);
				map = mapManager.map;

				var actionManager = new OpenLayers.ActionManager(mapManager.map);

				actionManager.loadActions();

				actionManager.executeActions();

				initLayerList();

				//enable the tooltips
				$(document).tooltip();

			},
			error : function(request, status, cause) {
				console.log("Error loading map config");
			}
		});
	}

};

// one-time initialisation of button handlers
$("#refreshInspection").live('click', function() {
	document.location.href = document.location.href;
});

$("#minus").live('click', function() {

	if (map != null) {
		map.zoomOut();
	}

});

// one-time initialisation of button handlers
$("#plus").live('click', function() {

	if (map != null) {
		map.zoomIn();
	}

});

$("#zoomMaxtent").live('click', function() {

	if (map != null) {
		map.zoomToMaxExtent();
	}

});

$("#pan").live('click', function() {

	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);

	if (map != null) {
		map.pan();
	}
});

$("#addhoc").live('click', function() {

	//Disable all drawing tools
	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);

	deactivateControl(map.getControlsBy("id", "journalEntry")[0]);
	deactivateControl(map.getControlsBy("id", "attributeDisplay")[0]);
	deactivateControl(map.getControlsBy("id", "inspectionTool")[0]);

	attributeDisplay = map.getControlsBy("id", "adhocInspection")[0];

	if (attributeDisplay == null) {
		displayPopup("<div style='width:100%;float:left;text-align:center'> Tool not available </div>");
		return null;
	}

	attributeDisplay.activate();

});

$("#journal").live('click', function() {

	//Disable all drawing tools
	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);

	deactivateControl(map.getControlsBy("id", "adhocInspection")[0]);
	deactivateControl(map.getControlsBy("id", "attributeDisplay")[0]);
	deactivateControl(map.getControlsBy("id", "inspectionTool")[0]);

	attributeDisplay = map.getControlsBy("id", "journalEntry")[0];

	if (attributeDisplay == null) {
		displayPopup("<div style='width:100%;float:left;text-align:center'> Tool not available </div>");
		return null;
	}

	attributeDisplay.activate();

});

$("#attributeDisplay").live('click', function() {

	//Disable all drawing tools
	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);

	deactivateControl(map.getControlsBy("id", "adhocInspection")[0]);
	deactivateControl(map.getControlsBy("id", "journalEntry")[0]);
	deactivateControl(map.getControlsBy("id", "inspectionTool")[0]);

	attributeDisplay = map.getControlsBy("id", "attributeDisplay")[0];

	if (attributeDisplay == null) {
		displayPopup("<div style='width:100%;float:left;text-align:center'> Tool not available </div>");
		return null;
	}

	attributeDisplay.activate();

});

$("#inspection").live('click', function() {

	//Disable all drawing tools
	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);

	deactivateControl(map.getControlsBy("id", "adhocInspection")[0]);
	deactivateControl(map.getControlsBy("id", "journalEntry")[0]);
	deactivateControl(map.getControlsBy("id", "attributeDisplay")[0]);

	inspectionTool = map.getControlsBy("id", "inspectionTool")[0];

	if (inspectionTool == null) {
		displayPopup("<div style='width:100%;float:left;text-align:center'> Tool not available </div>");
		return null;
	}

	inspectionTool.activate();

});

function displayPopup(content) {

	$.mobile.changePage("#popup", "pop");
	try {
		$("ul#details-list").empty().append(content).listview("refresh");
	} catch(e) {
		return;
	}

};

function deactivateControl(control) {

	if (control != null) {
		control.deactivate();
	}
};

$("#drawPoint").live('click', function() {

	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);

	var control = map.getControlsBy("id", "drawPoint")[0];
	control.activate();
});

$("#drawPolygon").live('click', function() {
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);
	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);

	var control = map.getControlsBy("id", "drawPolygon")[0];
	control.activate();

});

$("#drawPolyline").live('click', function() {

	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);

	var control = map.getControlsBy("id", "drawPolyline")[0];
	control.activate();
});

$("#clear").live('click', function() {

	deactivateControl(map.getControlsBy("id", "drawPoint")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolygon")[0]);
	deactivateControl(map.getControlsBy("id", "drawPolyline")[0]);

	markerLayer = map.getLayersByName("MarkerLayer");

	if (markerLayer[0] != null) {

		markerLayer[0].destroyFeatures();
	}

	parent.window.setOutputFieldValue(null);
});

$("#locate").live('click', function() {
	var control = map.getControlsBy("id", "locate-control")[0];

	control.zoomToCurrentLocation();

});

//fix the content height AFTER jQuery Mobile has rendered the map page
$('#mappage').live('pageshow', function() {
	try {
		fixContentHeight();
	} catch(ex) {

	}
});

$(window).bind("orientationchange resize pageshow", fixContentHeight);

function initLayerList() {
	try {
		$("<li> ", {
			"data-role" : "list-divider",
			text : " Base Layers"
		}).appendTo('#layerslist');

		var baseLayers = map.getLayersBy("isBaseLayer", true);
		$.each(baseLayers, function() {
			addLayerToList(this);
		});

		$('<li>', {
			"data-role" : "list-divider",
			text : "Overlay Layers"
		}).appendTo('#layerslist');
		var overlayLayers = map.getLayersBy("isBaseLayer", false);
		$.each(overlayLayers, function() {
			addLayerToList(this);
		});
		$('#layerslist').listview('refresh');

		map.events.register("addlayer", this, function(e) {
			addLayerToList(e.layer);
		});

		// All layers added, trigger create to enable JQuery mobile styling
		$('#layerspage').trigger("create");
	} catch(ex) {
		//alert('initLayerList' + ex);
	}

	$("#opacity-slider").slider({
		min : 0,
		max : 1,
		step : 0.1,
		value : 1,
		change : function(event, ui) {

			var baseLayers = map.getLayersBy("isBaseLayer", true);
			$.each(baseLayers, function() {
				this.setOpacity(ui.value);
			});
		}
	});
}

function addLayerToList(layer) {

	if (layer.displayInLayerSwitcher == false) {
		return;
	}

	var item = $('<li>', {
		"data-icon" : "check",
		"class" : layer.visibility ? "checked" : "",
		"title" : "if layer is not available - zoom in"
	}).append($('<a />', {
		text : layer.name
	}).click(function() {

		if (layer.isBaseLayer) {
			layer.map.setBaseLayer(layer);
		} else {
			layer.setVisibility(!layer.getVisibility());
		}
	})).appendTo('#layerslist');
	layer.events.on({
		'visibilitychanged' : function() {
			$(item).toggleClass('checked');
		}
	});

}
