(function (PV){
	"use strict";

	var def = {
		typeName: "", 
		init: init 
	} 

	function init(scope) {
		scope.buttonClicked=function()
		{
			alert("Hello World");
		}
	}

	PV.toolCatalog.register(def); 

})(window.PIVisualization)
