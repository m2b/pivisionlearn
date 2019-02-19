(function (PV) {
    "use strict";

    function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

    // configOptions add config panel
    // Decimals,BackgroundColor,BorderRadiuse are user defined.  In this case used to dynamically style symbol.
	var definition = { 
        typeName: "mbtrend",
        iconUrl: "Scripts/app/editor/symbols/ext/timeseries.png",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){ 
			return { 
                DataShape: "Timeseries",
				Height: 450,
                Width: 800,
                ChartType: "line",
                BarOrLineColor: 'rgba(255, 99, 132, 0.2)'
			} 
        },
        configOptions: function(){
            return [{
                title: "Format Symbol",
                mode: "format"
            }];
        }
    }
    
    function getConfig(){
		return {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    type: 'bar',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(0,0,0,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
						type: 'time',
						distribution: 'series',
						ticks: {
							source: 'labels'
						}
					}],
                    yAxes: [{
						scaleLabel: {
							display: true,
							labelString: ''
						}
                    }]
                }
            }
        }
	}

    symbolVis.prototype.init = function(scope, elem) 
    {   
//        scope.Values=ts;

		// Reference to container
		var container=elem.find('#container')[0];
		// Create unique id to work with the container for this symbol (i.e. using symbol name)
		container.id="barChart_"+scope.symbol.name;  // Needed if multiple charts on the page which is not handled by PV Symbol SDK
    
        var ctx = document.getElementById("trend").getContext('2d');
        var cfg = getConfig();
        // Override with what was saved
        cfg.data.datasets[0].backgroundColor=scope.config.BarOrLineColor.toLowerCase();
        cfg.data.datasets[0].type=scope.config.ChartType;
        // Create the chart
        var chart = new Chart(ctx,cfg);

        this.onDataUpdate=onDataUpdate;
        
        // Set the bar/line style if changed
        this.onConfigChange=function(newConfig,oldConfig)
        {
            var isDirty=false;
            if(oldConfig.ChartType!=newConfig.ChartType)
            {
                chart.config.data.datasets[0].type=newConfig.ChartType;
                isDirty=true;
            }
            if(oldConfig.BarOrLineColor!=newConfig.BarOrLineColor)
            {
                chart.config.data.datasets[0].backgroundColor=newConfig.BarOrLineColor.toLowerCase();
                isDirty=true;
            }
            if(isDirty)
                chart.update();

            console.log("Config changed from "+Object.entries(oldConfig)+" to "+Object.entries(newConfig));
        }
        
        function onDataUpdate(data)
        {
            // Deal with null data
            if(!data)
                return;

            console.log(data)

            // In Multi-item, each item gets its own onDataUpdate
            // information is encapsulated in a single element array
            // NOTE:  Storing items in Scope just in case need to use them later
            var item=data.Data[0];
            // Only on sporadic updates
            if(item.Label)
            {
                scope.Label=item.Label;
                scope.Units=item.Units;
                scope.DataSource=item.Path.indexOf('|')>-1?"AF Attribute":"Tag";
                chart.config.data.datasets[0].label=scope.Label;
                chart.config.options.scales.yAxes[0].scaleLabel.labelString=scope.Units.length>0?scope.Units:'???';
            }
            scope.StartTime=item.StartTime;
            scope.EndTime=item.EndTime;
            scope.Values=item.Values;
            var xData=[]
            var yData=[]
            for(var idx in scope.Values)
            {
                xData.push(new Date(scope.Values[idx].Time).getTime());
                yData.push(scope.Values[idx].Value)
            }
            chart.config.data.labels=xData;
            chart.config.data.datasets[0].data=yData;
            chart.update();
        }
    };

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
