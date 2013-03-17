/**
 * @author coulon_p
 */
OpenLayers.ActionManager = OpenLayers.Class({

	loadedActions : [],

	map : null,

	initialize : function(map) {

		this.map = map;

	},

	getParameters : function(actionDetails) {
		//extract the parameters
		var parameterString = actionDetails.toString().substr(actionDetails.toString().indexOf("%") + 1, actionDetails.toString().length - actionDetails.toString().indexOf("&"));

		return parameterString.split("%");
	},

	loadActions : function() {

		try {

			this.loadedActions = new Array();

			var inputfieldValue = parent.getInputFieldValue();

			//Get the action and its parameters
			var actionDetails = inputfieldValue.toString().substr(inputfieldValue.toString().indexOf("action=") + 7, inputfieldValue.toString().length - inputfieldValue.toString().indexOf("action="));

			var actions = actionDetails.toString().substr(0, actionDetails.toString().indexOf("%")).split(',');

			var parameters = this.getParameters(actionDetails);

			for (var i = 0; i < actions.length; i++) {

				if (actions[i].toString().indexOf("ZoomTo") != -1) {

					this.loadedActions[this.loadedActions.length] = new OpenLayers.ZoomToAction(this.map, parameters);
				}

				if (actions[i].toString().indexOf("EditCreate") != -1) {

					this.loadedActions[this.loadedActions.length] = new OpenLayers.EditAction(this.map, parameters);
				}

				if (actions[i].toString().indexOf("LoadSiteInspection") != -1) {

					this.loadedActions[this.loadedActions.length] = new OpenLayers.LoadSiteInspectionAction(this.map, parameters);
				}
			};

		} catch (ex) {
			//exception occured

		}

	},

	executeAction : function(index) {
		this.loadedActions[index].execute();
	},

	executeActions : function() {

		for (var i = 0; i < this.loadedActions.length; i++) {
			this.loadedActions[i].execute();
		};
	},

	CLASS_NAME : 'OpenLayers.ActionManager'
});
