$(document).ready(function() {

	module("validation test");

	var dataTest_NotSelftIntersect = {
		"type" : "Feature",
		"properties" : {},
		"geometry" : {
			"type" : "Polygon",
			"coordinates" : [[[500202.36968994, 200406.64672852], [500083.35113525, 199742.12646484], [500420.57037354, 199871.06323242], [500673.48480225, 200262.8326416], [500202.36968994, 200406.64672852]]]
		},
		"crs" : {
			"type" : "name",
			"properties" : {
				"name" : "EPSG:27700"
			}
		}
	};

	var dataTest_SelftIntersect = {
		"type" : "Feature",
		"properties" : {},
		"geometry" : {
			"type" : "Polygon",
			"coordinates" : [[[499929.61883545, 200121.49810791], [498913.00201416, 199957.84759521], [499855.23223877, 199481.77337646], [499225.42572021, 200156.21185303], [499929.61883545, 200121.49810791]]]
		},
		"crs" : {
			"type" : "name",
			"properties" : {
				"name" : "EPSG:27700"
			}
		}
	};

	var dataTest_Area = {
		"type" : "Feature",
		"properties" : {},
		"geometry" : {
			"type" : "Polygon",
			"coordinates" : [[[500202.36968994, 200406.64672852], [500083.35113525, 199742.12646484], [500420.57037354, 199871.06323242], [500673.48480225, 200262.8326416], [500202.36968994, 200406.64672852]]]
		},
		"crs" : {
			"type" : "name",
			"properties" : {
				"name" : "EPSG:27700"
			}
		}
	};

	test("Test - Not Self Intersect Polygon", function() {

		var selfInteresectRule = new OpenLayers.SelfIntersectRule();

		var geoJSON = new OpenLayers.Format.GeoJSON();
		feature = geoJSON.read(dataTest_NotSelftIntersect);

		equal(selfInteresectRule.execute(feature[0]), true);

	});

	test("Test - Self Intersect Polygon", function() {

		var selfInteresectRule = new OpenLayers.SelfIntersectRule();

		var geoJSON = new OpenLayers.Format.GeoJSON();
		feature = geoJSON.read(dataTest_SelftIntersect);

		equal(selfInteresectRule.execute(feature[0]), false);

	});
	
	test("Test - Area Too Large", function() {

		var maxAreaRule = new OpenLayers.MaxAreaRule({
			maxArea : 500
		});

		var geoJSON = new OpenLayers.Format.GeoJSON();
		feature = geoJSON.read(dataTest_Area);

		equal(maxAreaRule.execute(feature[0]), false);

	});
	
	test("Test - Area Not Too Large", function() {

		var maxAreaRule = new OpenLayers.MaxAreaRule({
			maxArea : 5000000
		});

		var geoJSON = new OpenLayers.Format.GeoJSON();
		feature = geoJSON.read(dataTest_Area);

		equal(maxAreaRule.execute(feature[0]), true);

	});
	
	test("Test - Area Too Small", function() {

		var minAreaRule = new OpenLayers.MinAreaRule({
			minArea : 500000000
		});

		var geoJSON = new OpenLayers.Format.GeoJSON();
		feature = geoJSON.read(dataTest_Area);

		equal(minAreaRule.execute(feature[0]), false);

	});
	
	test("Test - Area Not Too Small", function() {

		var minAreaRule = new OpenLayers.MinAreaRule({
			minArea : 5000
		});

		var geoJSON = new OpenLayers.Format.GeoJSON();
		feature = geoJSON.read(dataTest_Area);

		equal(minAreaRule.execute(feature[0]), true);

	})

});



