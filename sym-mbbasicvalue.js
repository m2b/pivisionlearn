(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

    var vt={
        Time: Date.now(),
        Value: 100*Math.random()-25
    };

	var definition = { 
		typeName: "mbsimplevalue",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		getDefaultConfig: function(){ 
			return { 
				Height: 150,
				Width: 150 
			} 
		}
	}

    symbolVis.prototype.init = function(scope, elem) 
    { 
        this.onDataUpdate=onDataUpdate;
        function onDataUpdate(data)
        {
            // Only on sporadic updates
            if(data.Label)
            {
                scope.Label=data.Label;
                scope.Units=data.Units;
                scope.DataSource=data.Path.indexOf('|')>-1?"AF Attribute":"Tag";
            }
            scope.Value=data.Value;
            scope.Time=data.Time;
            // console.log(data);
        }
    //    scope.Time=vt.Time;
    //    scope.Value=vt.Value;
    };

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 