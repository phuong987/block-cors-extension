let lineChart;
let lineChartPointsDOJI = [], lineChartPointsSJC = [];
function newLineChart() {
    lineChart = new CanvasJS.StockChart("lineChartContainer",{
        theme: "light2",
        exportEnabled: true,
        title:{text:"Line Chart"},
        subtitles: [{text: "Gold Price (in VND)"}],
        charts: [
            {
                axisX: {
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                axisY: {
                    //prefix: "VND "
                },
                toolTip: {
                    shared: true,
                    enabled: true,
                    content: "<span style='\"'color: {color};'\"'>{x}<br/>{name}: {y}<br/>{detail}</span>"
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: true,
                    itemclick: toggleDataSeries
                },
                data: [
                    {
                        type:"line",
                        //axisYType: "secondary",
                        name: "Gap PNJ",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: lineChartPointsPNJ
                    },
                    {
                        type:"line",
                        //axisYType: "secondary",
                        name: "Gap SJC",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: lineChartPointsSJC
                    },
                    {
                        type:"line",
                        //axisYType: "secondary",
                        name: "Gap DOJI",
                        showInLegend: false,
                        markerSize: 0,
                        yValueFormatString: "#,###.## VND",
                        dataPoints: lineChartPointsDOJI
                    }
                ]
            }
        ],
        navigator: {
            data: [{
                dataPoints: lineChartPointsPNJ
            }],
            slider: {
                minimum: new Date(2023, 1, 1),
                maximum: new Date()
            }
        }
    });
}

function toggleDataSeries(e){
    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
    lineChart.render();
}