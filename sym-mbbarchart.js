(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "mbbarchart",
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){ 
			return { 
				DataShape: 'Table',
				Height: 150,
				Width: 150 
			} 
		}
	}

	function getConfig(){
		return {
			"type": "serial",
			"categoryField": "attributeOrTag",
			"startDuration": 1,
			"categoryAxis": {
				"gridPosition": "start"
			},
			"trendLines": [],
			"graphs": [
				{
					"balloonText": "[[title]] of [[category]]:[[value]]",
					"fillAlphas": 1,
					"id": "AmGraph-1",
					"title": "Volume (MBDP)",
					"type": "column",
					"valueField": "value",
					"fillColors": "#FF00FF"
				}
			],
			"guides": [],
			"valueAxes": [
				{
					"id": "ValueAxis-1",
					"title": "Thousand Barrels per Day"
				}
			],
			"allLabels": [],
			"balloon": {},
			"legend": {
				"enabled": true,
				"useGraphSettings": true
			},
			"titles": [
				{
					"id": "Title-1",
					"size": 15,
					"text": "Well Performance"
				}
			]
		}		
	}

	symbolVis.prototype.init = function(scope, elem) 
	{ 
		// Reference to container
		var container=elem.find('#container')[0];
		// Create unique id to work with the container for this symbol (i.e. using symbol name)
		container.id="barChart_"+scope.symbol.name;  // Needed if multiple charts on the page which is not handled by PV Symbol SDK
		var chart=AmCharts.makeChart(container.id,getConfig());

		scope.DataItems=[] // Will hold the table attributes or tags and their current values, thus making available to other Angular objects
		// Function that converts scope items to chart data
		function createChartData()
		{
			return scope.DataItems.map(function(item){
				return {
					value: item.Value,
					attributeOrTag: item.Label
				}
			});
		}


		
		this.onDataUpdate=function(data) {
			//console.log(data);

			// In Multi-item and Table, all items are updated on the same onDataUpdate
			// information is encapsulated in a Rows array
			for(var row in data.Rows)
			{
				// Only on sporadic updates
				if(data.Rows[row].Label)
				{
					scope.DataItems[row]={
						Label: data.Rows[row].Label,
						Units: data.Rows[row].Units,
						DataSource: data.Rows[row].Path.indexOf('|')>-1?"AF Attribute":"Tag",
						Value: data.Rows[row].Value,
						Time: data.Rows[row].Time,
					}
					continue;
				}
				scope.DataItems[row].Value=data.Rows[row].Value;
				scope.DataItems[row].Time=data.Rows[row].Time;
			}

			// Force chart update
			var chartData=createChartData();
			chart.dataProvider=chartData;
			chart.validateData(); // Repaint chart
		}

		this.getValue(row)
		{
			return scope[row]
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
