(function (PV) {
    "use strict";
 
    function addMinutes(date,minutes) {
        date.setTime(date.getTime() + minutes*60000);
        return date;
    };

    function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

    // configOptions add config panel
    // Decimals,BackgroundColor,BorderRadiuse are user defined.  In this case used to dynamically style symbol.
	var definition = { 
        typeName: "mbtimeseries",
        iconUrl: "Scripts/app/editor/symbols/ext/timeseries.png",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){ 
			return { 
                DataShape: "Timeseries",
				Height: 150,
                Width: 150,
                Decimals: 2,
                BackgroundColor: '#ff5733',
                BorderRadius: 10
			} 
        },
        configOptions: function(){
            return [{
                title: "Format Symbol",
                mode: "format"
            }];
        }
    }
    
    var ts=[
        {
            Time: new Date(),
            Value: 100*Math.random()
        },
        {
            Time: addMinutes(new Date(),20),
            Value: 100*Math.random()
        },
    ];

    symbolVis.prototype.init = function(scope, elem) 
    {   
//        scope.Values=ts;

        this.onDataUpdate=onDataUpdate;
        
        // Extra credit challenge 8
        this.onConfigChange=function(newConfig,oldConfig)
        {
            console.log("Config changed from "+Object.entries(oldConfig)+" to "+Object.entries(newConfig));
        }

        // Initial scope style
        scope.symbolStyle={ 'background-color': scope.config.BackgroundColor, 'border-radius': scope.config.BorderRadius + 'px'};
        
        // Change on mouseover
        scope.changeBackgroundColor=function(enter,color)
        {
            if(enter && color!==undefined)
            {
                scope.symbolStyle={ 'background-color': color, 'border-radius': scope.config.BorderRadius + 'px'};
            }
            else if(!enter)
            {
                if(color!==undefined)
                    scope.symbolStyle={ 'background-color': color, 'border-radius': scope.config.BorderRadius + 'px'};
                else
                    scope.symbolStyle={ 'background-color': scope.config.BackgroundColor, 'border-radius': scope.config.BorderRadius + 'px'};
            }
        };

        function onDataUpdate(data)
        {
            // Deal with null data
            if(!data)
                return;

            // console.log(data)

            // In Multi-item, each item gets its own onDataUpdate
            // information is encapsulated in a single element array
            var item=data.Data[0];
            // Only on sporadic updates
            if(item.Label)
            {
                scope.Label=item.Label;
                scope.Units=item.Units;
                scope.DataSource=item.Path.indexOf('|')>-1?"AF Attribute":"Tag";
            }
            scope.StartTime=item.StartTime;
            scope.EndTime=item.EndTime;
            scope.Values=item.Values;
        }
    };

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
