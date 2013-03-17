(function() {


	$.widget("digiright.WebApplication", {

		options : {
			rootUrl : ""
		},

		_create : function() {
			var content = "<!--[if IE]>	<iFrame src='" + this.options.rootUrl + "app/digiRightApp.html' width='500' height='85%' seamless></iFrame><![endif]--><!--[if !IE]> <-->	<iFrame src='" + this.options.rootUrl + "app/digiRightApp.html' width='100%' height='100%' seamless></iFrame><!--> <![endif]-->";
			this.element.append( content );

		},

		getInputFieldValue : function() {
			return inputfieldvalue;
		},

		getOutputFieldValue : function() {
			return outputfieldvalue;
		},

		setInputFieldValue : function(intputValue) {

			setInputFieldValue(intputValue);
		},

		setOutputFieldValue : function(outputValue) {
			outputfieldvalue = outputValue;
		},

		setIsNextButtonEnabled : function(isEnabled) {
			document.getElementById('nextButton').disabled = isEnabled;
		}
	});


		$.widget("digiright.mobileApplication", {

		options : {
			rootUrl : ""
		},

		_create : function() {

			var content = "<!--[if IE]>	<iFrame src='" + this.options.rootUrl + "app/digiRightMobile.html#mappage' width='500' height='85%' seamless></iFrame><![endif]--><!--[if !IE]> <-->	<iFrame src='" + this.options.rootUrl + "app/digiRightMobile.html' width='100%' height='100%' seamless></iFrame><!--> <![endif]-->";
			this.element.append( content );

		},

		getInputFieldValue : function() {
			return inputfieldvalue;
		},

		getOutputFieldValue : function() {
			return outputfieldvalue;
		},

		setInputFieldValue : function(intputValue) {

			setInputFieldValue(intputValue);
		},

		setOutputFieldValue : function(outputValue) {
			outputfieldvalue = outputValue;
		},

		setIsNextButtonEnabled : function(isEnabled) {
			document.getElementById('nextButton').disabled = isEnabled;
		}
	});


})();

var inputfieldvalue;
var outputfieldvalue;

function getInputFieldValue() {
	return inputfieldvalue;
};

function getOutputFieldValue() {
	return outputfieldvalue;
};

function setInputFieldValue(intputValue) {
	inputfieldvalue = intputValue;
};

function setOutputFieldValue(outputValue) {
	outputfieldvalue = outputValue;
};

function setIsNextButtonEnabled(isEnabled) {
	document.getElementById('nextButton').disabled = isEnabled;
};